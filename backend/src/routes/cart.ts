import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import Cart, { ICartItem } from '../models/Cart';
import Product from '../models/Product';
import { Types } from 'mongoose';

const router = express.Router();

interface CustomRequest extends Request {
  user?: { userId: string };
}

// Utility to calculate total
const calculateCartTotal = (items: ICartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
};

// Get Cart
router.get('/', auth, async (req: CustomRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user?.userId })
      .populate('items.product', 'name price images stock category')
      .lean();

    if (!cart) {
      return res.json({ success: true, data: { user: req.user?.userId, items: [], total: 0 } });
    }

    return res.json({ success: true, data: cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Add Item to Cart
router.post(
  '/add',
  auth,
  [
    body('productId').isMongoId(),
    body('quantity').isInt({ min: 1 }),
  ],
  async (req: CustomRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ success: false, errors: errors.array() });

      const { productId, quantity } = req.body;
      const product = await Product.findOne({ _id: productId, isActive: true });

      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Not enough stock' });

      let cart = await Cart.findOne({ user: req.user?.userId });

      if (!cart) cart = new Cart({ user: req.user?.userId, items: [], total: 0 });

      const index = cart.items.findIndex(item => item.product.toString() === productId);

      if (index >= 0) {
        const newQuantity = cart.items[index].quantity + quantity;
        if (newQuantity > product.stock)
          return res.status(400).json({ success: false, message: 'Quantity exceeds stock' });

        cart.items[index].quantity = newQuantity;
        cart.items[index].price = product.price;
      } else {
        cart.items.push({ product: productId, quantity, price: product.price });
      }

      cart.total = calculateCartTotal(cart.items);
      await cart.save();
      await cart.populate('items.product');

      return res.json({ success: true, message: 'Added to cart', data: cart });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Failed to add item to cart' });
    }
  }
);

// Remove Item
router.delete('/remove/:productId', auth, async (req: CustomRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user?.userId });

    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    cart.total = calculateCartTotal(cart.items);
    await cart.save();

    return res.json({ success: true, message: 'Item removed', data: cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to remove item' });
  }
});

// Update Quantity
router.patch(
  '/update',
  auth,
  [
    body('productId').isMongoId(),
    body('quantity').isInt({ min: 0 }),
  ],
  async (req: CustomRequest, res: Response) => {
    try {
      const { productId, quantity } = req.body;

      const cart = await Cart.findOne({ user: req.user?.userId });
      if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Item not found' });

      if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        if (quantity > product.stock) return res.status(400).json({ success: false, message: 'Exceeds stock' });

        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = product.price;
      }

      cart.total = calculateCartTotal(cart.items);
      await cart.save();
      await cart.populate('items.product');

      return res.json({ success: true, message: 'Cart updated', data: cart });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Failed to update cart' });
    }
  }
);

// Clear Cart
router.delete('/clear', auth, async (req: CustomRequest, res: Response) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user?.userId },
      { items: [], total: 0 },
      { new: true }
    );

    return res.json({ success: true, message: 'Cart cleared', data: cart });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
});

// Cart Summary
router.get('/summary', auth, async (req: CustomRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user?.userId });

    if (!cart || cart.items.length === 0) {
      return res.json({ success: true, data: { itemCount: 0, subtotal: 0, shippingCost: 0, tax: 0, total: 0 } });
    }

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.total;
    const shippingCost = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    return res.json({
      success: true,
      data: {
        itemCount,
        subtotal,
        shippingCost,
        tax: +tax.toFixed(2),
        total: +total.toFixed(2)
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to get cart summary' });
  }
});

export default router;
