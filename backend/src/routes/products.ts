import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import Product from '../models/Product';

const router = express.Router();

// Get all products with filtering, sorting, and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString().trim(),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be non-negative'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be non-negative'),
  query('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  query('search').optional().isString().trim(),
  query('sort').optional().isIn(['price', '-price', 'rating', '-rating', 'name', '-name', 'createdAt', '-createdAt'])
], async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };

    if (req.query.category) {
      filter.category = new RegExp(req.query.category as string, 'i');
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice as string);
    }

    if (req.query.rating) {
      filter.rating = { $gte: parseFloat(req.query.rating as string) };
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    let sort: any = { createdAt: -1 };
    if (req.query.sort) {
      const sortField = req.query.sort as string;
      sort = sortField.startsWith('-') ? { [sortField.slice(1)]: -1 } : { [sortField]: 1 };
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
});

// Get featured products
router.get('/featured', async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .sort({ rating: -1 })
      .limit(8)
      .lean();

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured products'
    });
  }
});

// Get product categories
router.get('/categories', async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categories.map(cat => ({
        name: cat._id,
        productCount: cat.count,
        priceRange: {
          min: cat.minPrice,
          max: cat.maxPrice,
          avg: cat.avgPrice
        }
      }))
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// Search products
router.get('/search/:query', async (req: Request, res: Response): Promise<void> => {
  try {
    const searchQuery = req.params.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const filter = {
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { category: { $regex: searchQuery, $options: 'i' } },
            { tags: { $in: [new RegExp(searchQuery, 'i')] } }
          ]
        }
      ]
    };

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ rating: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        products,
        searchQuery,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching products'
    });
  }
});

// Get single product by ID (MUST be below /search/:query to avoid conflict)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    }).lean();

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4).lean();

    res.json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
});

export default router;
