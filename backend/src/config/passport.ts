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

// Conditionally configure OAuth strategies if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      }

      user = await User.findOne({ email: profile.emails?.[0]?.value });
      
      if (user) {
        user.googleId = profile.id;
        await user.save();
        return done(null, user);
      }

      user = new User({
        googleId: profile.id,
        email: profile.emails?.[0]?.value,
        firstName: profile.name?.givenName || 'Google',
        lastName: profile.name?.familyName || 'User',
        isVerified: true
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));

  console.log('✅ Google OAuth strategy configured');
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  const { Strategy: GitHubStrategy } = require('passport-github2');
  
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/api/auth/github/callback'
  }, async (accessToken: any, refreshToken: any, profile: any, done: any) => {
    try {
      let user = await User.findOne({ githubId: profile.id });
      
      if (user) {
        return done(null, user);
      }

      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findOne({ email });
        
        if (user) {
          user.githubId = profile.id;
          await user.save();
          return done(null, user);
        }
      }

      user = new User({
        githubId: profile.id,
        email: email || `${profile.username}@github.local`,
        firstName: profile.displayName?.split(' ')[0] || profile.username || 'GitHub',
        lastName: profile.displayName?.split(' ').slice(1).join(' ') || 'User',
        isVerified: true
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));

  console.log('✅ GitHub OAuth strategy configured');
}

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).select('-password -refreshTokens');
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

export default passport;