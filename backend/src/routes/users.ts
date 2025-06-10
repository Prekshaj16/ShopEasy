import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth';
import User from '../models/User';
import Product from '../models/Product';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: { userId: string };
}

const router = express.Router();

// Update user profile
router.patch('/profile', auth, [
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('phone').optional().matches(/^\+?[\d\s-()]+$/).withMessage('Invalid phone number format')
], async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });

    const allowedUpdates = ['firstName', 'lastName', 'phone', 'avatar'];
    const updates: Record<string, any> = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user?.userId, updates, { new: true, runValidators: true });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({ success: true, message: 'Profile updated successfully', data: user });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// Add address
router.post('/addresses', auth, [
  body('type').isIn(['shipping', 'billing']).withMessage('Address type must be shipping or billing'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('address').trim().isLength({ min: 1 }).withMessage('Address is required'),
  body('city').trim().isLength({ min: 1 }).withMessage('City is required'),
  body('state').trim().isLength({ min: 1 }).withMessage('State is required'),
  body('zipCode').trim().isLength({ min: 1 }).withMessage('Zip code is required'),
  body('country').trim().isLength({ min: 1 }).withMessage('Country is required')
], async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });

    const user = await User.findById(req.user?.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newAddress = {
      _id: new mongoose.Types.ObjectId(),
      type: req.body.type,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      country: req.body.country,
      isDefault: req.body.isDefault ?? false
    };

    if (newAddress.isDefault) {
      user.addresses.forEach(addr => {
        if (addr.type === newAddress.type) addr.isDefault = false;
      });
    }

    user.addresses.push(newAddress);
    await user.save();

    return res.status(201).json({ success: true, message: 'Address added successfully', data: user.addresses });
  } catch (error) {
    console.error('Add address error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add address' });
  }
});

// Get wishlist
router.get('/wishlist', auth, async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.user?.userId)
      .populate('wishlist', 'name price images category rating reviews')
      .select('wishlist');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({ success: true, data: user.wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
});

// Add to wishlist
router.post('/wishlist/:productId', auth, async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const user = await User.findById(req.user?.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.wishlist.some(id => id.toString() === productId)) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }

    user.wishlist.push(new mongoose.Types.ObjectId(productId));
    await user.save();

    return res.json({ success: true, message: 'Product added to wishlist', data: user.wishlist });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return res.status(500).json({ success: false, message: 'Failed to add to wishlist' });
  }
});

// Export the router correctly
export default router;
