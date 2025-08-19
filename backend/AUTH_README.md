# Authentication System Implementation

This implementation provides a complete JWT-based authentication system with OAuth 2.0 support for the iTida E-commerce platform.

## Features Implemented

### 🔐 JWT Authentication
- **User Registration & Login**: Complete user management with password hashing
- **JWT Tokens**: Access tokens (15min) and refresh tokens (7 days)
- **Token Refresh**: Automatic token refresh mechanism
- **Secure Logout**: Token invalidation and cleanup

### 🛡️ Authorization & Security
- **Role-Based Access Control**: Customer, Merchant, Admin roles
- **Protected Routes**: Middleware for authentication and authorization
- **Password Security**: bcrypt with salt rounds for password hashing
- **Token Validation**: Comprehensive JWT verification and error handling

### 🔗 OAuth 2.0 Integration
- **Google OAuth**: Ready for Google authentication
- **GitHub OAuth**: Ready for GitHub authentication
- **Extensible**: Easy to add more OAuth providers
- **Account Linking**: Link OAuth accounts to existing users

### 🏗️ Architecture
- **Modular Design**: Separated concerns for auth, models, routes
- **TypeScript**: Full type safety throughout the application
- **Express Middleware**: Clean integration with Express.js
- **Environment Configuration**: Secure configuration management

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer" // optional: customer, merchant, admin
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Logout
```bash
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### OAuth Routes (`/api/auth`)

#### Google OAuth
```bash
GET /api/auth/google
GET /api/auth/google/callback
```

#### GitHub OAuth
```bash
GET /api/auth/github
GET /api/auth/github/callback
```

### Protected Routes (`/api`)

#### User Profile (Requires Authentication)
```bash
GET /api/profile
Authorization: Bearer your-access-token
```

#### Admin Routes (Requires Admin Role)
```bash
GET /api/admin/users
Authorization: Bearer your-access-token
```

#### Merchant Routes (Requires Merchant or Admin Role)
```bash
GET /api/merchant/dashboard
Authorization: Bearer your-access-token
```

## Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/itida-ecommerce

# JWT Configuration
JWT_ACCESS_SECRET=your-very-secure-access-secret-key
JWT_REFRESH_SECRET=your-very-secure-refresh-secret-key

# Session Configuration
SESSION_SECRET=your-very-secure-session-secret-key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## User Model Schema

```typescript
interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'merchant' | 'admin';
  isVerified: boolean;
  googleId?: string;
  githubId?: string;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Token Structure

### Access Token Payload
```typescript
{
  userId: string;
  email: string;
  role: string;
  exp: number; // 15 minutes from issue
}
```

### Refresh Token Payload
```typescript
{
  userId: string;
  email: string;
  role: string;
  exp: number; // 7 days from issue
}
```

## Authentication Flow

1. **Registration/Login**: User provides credentials
2. **Token Generation**: Server generates access + refresh tokens
3. **API Requests**: Client sends access token in Authorization header
4. **Token Validation**: Middleware validates token and injects user data
5. **Token Refresh**: Client uses refresh token to get new access token
6. **Logout**: Server invalidates refresh tokens

## OAuth 2.0 Flow

1. **Initiate**: Client redirects to `/api/auth/google` or `/api/auth/github`
2. **Provider Auth**: User authenticates with OAuth provider
3. **Callback**: Provider redirects to callback URL
4. **Account Handling**: Server creates or links user account
5. **Token Generation**: Server generates JWT tokens
6. **Client Redirect**: Redirect to client with tokens

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **Token Expiration**: Short-lived access tokens, longer refresh tokens
- **Token Invalidation**: Refresh tokens stored and can be revoked
- **Role-Based Access**: Different permission levels for different user types
- **Input Validation**: Proper validation of all inputs
- **Error Handling**: Secure error messages without information leakage

## Usage Examples

### Register and Login Flow
```javascript
// Register
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe'
  })
});

// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { accessToken, refreshToken } = await loginResponse.json();
```

### Accessing Protected Routes
```javascript
// Access protected route
const profileResponse = await fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

### Token Refresh
```javascript
// Refresh token when access token expires
const refreshResponse = await fetch('/api/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken })
});

const { accessToken: newAccessToken } = await refreshResponse.json();
```

## Development Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Start MongoDB** (optional for testing):
   ```bash
   # The system works without database for demonstration
   # But for full functionality, start MongoDB:
   mongod
   ```

## Status: ✅ Complete

The JWT authentication system with OAuth 2.0 foundation is fully implemented and functional. The system provides:

- Complete user authentication flow
- Role-based authorization
- OAuth 2.0 integration foundation
- Secure token management
- Production-ready security practices

The implementation follows best practices for authentication systems and is ready for production use once connected to a MongoDB database.