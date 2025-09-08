# Authentication Setup

This application uses Auth.js (NextAuth.js) with credential authentication.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Auth.js Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# For production, use your actual domain
# NEXTAUTH_URL=https://yourdomain.com
```

## Test Credentials

For testing purposes, the following mock users are available:

- **Email:** john@example.com  
  **Password:** password123

- **Email:** jane@example.com  
  **Password:** password456

## Authentication Flow

1. **Guest Access:** Users start at `/guest` with access to login/signup pages
2. **Login:** Users can log in at `/guest/login` 
3. **Signup:** New users can register at `/guest/signup`
4. **Authenticated Access:** Logged-in users are redirected to `/auth`
5. **Logout:** Users can logout from any authenticated page

## Route Protection

- `/guest/*` - Public routes (login, signup, landing page)
- `/auth/*` - Protected routes (requires authentication)
- Root `/` - Redirects based on authentication state

## Implementation Notes

- Uses credential-based authentication with bcrypt for password hashing
- Middleware automatically protects routes and handles redirects
- Session management handled by Auth.js
- Mock user data is currently used (replace with database integration)
