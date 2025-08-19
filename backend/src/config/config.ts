// JWT Configuration
export const JWT_CONFIG = {
  ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key-change-in-production',
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
  ACCESS_EXPIRES_IN: '15m',
  REFRESH_EXPIRES_IN: '7d'
};

// OAuth Configuration
export const OAUTH_CONFIG = {
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || ''
  },
  GITHUB: {
    CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
    CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || ''
  }
};

// Database Configuration
export const DB_CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/itida-ecommerce'
};

// Server Configuration
export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
