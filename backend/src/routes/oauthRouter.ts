import express, { Request, Response } from 'express';
import passport from '../config/passport';
import { generateAccessToken, generateRefreshToken, TokenPayload } from '../middlewares/auth/jwt';
import { User } from '../models/User';

const router = express.Router();

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as any;
      
      if (!user) {
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/error?message=Authentication failed`);
        return;
      }

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      };

      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      // Save refresh token to user
      await User.findByIdAndUpdate(user._id, {
        $push: { refreshTokens: refreshToken }
      });

      // Redirect to frontend with tokens
      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/error?message=Authentication failed`);
    }
  }
);

// GitHub OAuth routes
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as any;
      
      if (!user) {
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/error?message=Authentication failed`);
        return;
      }

      // Generate tokens
      const tokenPayload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      };

      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      // Save refresh token to user
      await User.findByIdAndUpdate(user._id, {
        $push: { refreshTokens: refreshToken }
      });

      // Redirect to frontend with tokens
      const redirectUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('GitHub OAuth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/error?message=Authentication failed`);
    }
  }
);

export default router;