import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User';
import { TokenPayload } from '../middlewares/auth/jwt';

// JWT Strategy for Passport (optional, since we have our own middleware)
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key'
}, async (payload: TokenPayload, done) => {
  try {
    const user = await User.findById(payload.userId).select('-password -refreshTokens');
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;