import express, { Response, Request } from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { auth } from '../middleware/auth';
import mongoose from 'mongoose';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

// Create new order
router.post(
  '/',
  auth,
  [body('items').isArray({ min: 1 }).withMessage('Items array is required')],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { items } = req.body;

      const cart = await Cart.findOne({ user: req.user?.userId }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      const order = new Order({
        user: req.user?.userId,
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        total: cart.items.reduce((acc, item) => {
          const product = item.product as any;
          return acc + product.price * item.quantity;
        }, 0),
      });

      await order.save();
      await Cart.deleteOne({ user: req.user?.userId });

      return res.status(201).json({ message: 'Order placed', order });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user orders
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?.userId }).populate('items.product');
    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get specific order
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user?.userId }).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/:id/status', auth, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user?.userId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    (order as any).status = req.body.status;
    await order.save();

    return res.json({ message: 'Order status updated', status: (order as any).status });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
