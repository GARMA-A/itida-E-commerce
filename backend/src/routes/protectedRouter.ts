import express, { Request, Response } from 'express';
import { authenticateToken, authorize } from '../middlewares/auth/jwt';

const router = express.Router();

// Protected route - requires authentication
router.get('/profile', authenticateToken, (req: Request, res: Response): void => {
  res.json({
    message: 'Profile accessed successfully',
    user: (req as any).user
  });
});

// Admin only route
router.get('/admin/users', 
  authenticateToken, 
  authorize(['admin']), 
  (req: Request, res: Response): void => {
    res.json({
      message: 'Admin area accessed successfully',
      user: (req as any).user
    });
  }
);

// Merchant or admin route
router.get('/merchant/dashboard', 
  authenticateToken, 
  authorize(['merchant', 'admin']), 
  (req: Request, res: Response): void => {
    res.json({
      message: 'Merchant dashboard accessed successfully',
      user: (req as any).user
    });
  }
);

export default router;