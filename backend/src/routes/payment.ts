import express, { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import Order from '../models/Order';

interface AuthRequest extends Request {
  user?: { userId: string };
}

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? '',
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? ''
});

router.post('/create-order', auth, [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('currency').optional().isString().withMessage('Currency must be a string'),
  body('orderId').isString().withMessage('Order ID is required')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });

    const { amount, currency = 'INR', orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user?.userId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        userId: req.user?.userId ?? ''
      }
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID ?? ''
      }
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
});

router.post('/verify-payment', auth, [
  body('razorpay_order_id').isString().withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id').isString().withMessage('Razorpay payment ID is required'),
  body('razorpay_signature').isString().withMessage('Razorpay signature is required'),
  body('orderId').isString().withMessage('Order ID is required')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? '').update(body).digest('hex');

    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });

    const order = await Order.findOne({ _id: orderId, user: req.user?.userId, razorpayOrderId: razorpay_order_id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
});

router.post('/payment-failed', auth, [
  body('orderId').isString().withMessage('Order ID is required'),
  body('error').optional().isObject().withMessage('Error details must be an object')
], async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, error } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user?.userId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.paymentStatus = 'failed';
    order.orderStatus = 'cancelled';
    order.cancellationReason = error?.description ?? 'Payment failed';
    order.cancelledAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: 'Payment failure recorded',
      data: {
        orderId: order._id,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    console.error('Payment failure error:', error);
    res.status(500).json({ success: false, message: 'Failed to record payment failure' });
  }
});

router.get('/status/:orderId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user?.userId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId
      }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ success: false, message: 'Failed to get payment status' });
  }
});

export default router;
