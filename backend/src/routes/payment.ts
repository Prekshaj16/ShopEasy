import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import Order from '../models/Order';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: { userId: string };
}

const router = express.Router();

// Use test credentials for local testing
const razorpay = new Razorpay({
  key_id: "rzp_test_1234567890ABCDE", 
  key_secret: "test_secret_key"
});

// Helper function to safely convert ObjectId
const getOrderId = (id: unknown): string => {
  return id instanceof mongoose.Types.ObjectId ? id.toString() : String(id);
};

// Mock order creation for local testing
router.post('/create-order', auth, [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('currency').optional().isString().withMessage('Currency must be a string'),
  body('orderId').isString().withMessage('Order ID is required')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });

    const { amount, currency = 'INR', orderId } = req.body;

    const fakeOrder = {
      id: "order_test_ABC123",
      amount: Math.round(amount * 100),
      currency,
    };

    return res.json({
      success: true,
      message: "Fake order created for local testing",
      data: fakeOrder
    });

  } catch (error) {
    console.error("Local test error:", error);
    return res.status(500).json({ success: false, message: "Failed to create test order" });
  }
});

export default router;
