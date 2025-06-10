import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

// ✅ Custom Request type for authenticated routes
interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

// Register user
router.post(
  '/register',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { firstName, lastName, email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const user = new User({ firstName, lastName, email, password });
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '7d'
      });

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Register Error:', error);
      return res.status(500).json({ success: false, message: 'Server error during registration' });
    }
  }
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '7d'
      });

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login Error:', error);
      return res.status(500).json({ success: false, message: 'Server error during login' });
    }
  }
);

// ✅ Get current user
router.get('/me', auth, async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    console.error('Me Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Refresh token
router.post('/refresh', auth, async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '7d'
    });

    return res.json({ success: true, token });
  } catch (error) {
    console.error('Refresh Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
