# Backend-Frontend Integration Guide

This guide explains how to integrate and run the EV project's backend and frontend applications.

## Project Structure

```
ev-project/
├── backend/                 # Node.js/Express API server
├── frontend/
│   ├── ev-user/            # User-facing React app (port 5173)
│   └── ev-admin/project/   # Admin dashboard React app (port 5174)
└── package.json            # Root package.json with dev scripts
```

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies for all projects
npm run install:all
```

### 2. Environment Setup

Create the following environment files:

**backend/.env:**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
ADMIN_URL="http://localhost:5174"
```

**frontend/ev-user/.env:**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME="EV Slot Booking"
```

**frontend/ev-admin/project/.env:**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME="EV Admin Dashboard"
```

### 3. Database Setup

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Start Development Servers

```bash
# Start all services (backend + both frontends)
npm run dev

# Or start individually:
npm run dev:backend    # Backend on port 5000
npm run dev:user       # User app on port 5173
npm run dev:admin      # Admin app on port 5174
```

## API Integration

### Backend API Endpoints

The backend runs on `http://localhost:5000` with the following main routes:

- **Authentication**: `/auth/*`
- **Stations**: `/stations/*`
- **Bookings**: `/bookings/*`
- **Admin**: `/admin/*`
- **Notifications**: `/notifications/*`
- **ETA**: `/eta/*`

### Frontend API Configuration

Both frontend applications are configured to:
- Use environment variables for API base URL
- Include authentication tokens in requests
- Handle CORS properly with the backend

### CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (User frontend)
- `http://localhost:5174` (Admin frontend)
- Environment variable URLs

### Vite Proxy Configuration

Both frontend apps have Vite proxy configured to forward `/api/*` requests to the backend during development.

## Development Workflow

1. **Start Backend**: `npm run dev:backend`
2. **Start Frontends**: `npm run dev:user` and `npm run dev:admin`
3. **Access Applications**:
   - User App: http://localhost:5173
   - Admin App: http://localhost:5174
   - API Docs: http://localhost:5000/api-docs

## Production Deployment

### Build Frontend Applications

```bash
npm run build
```

### Environment Variables for Production

Update the environment variables with production URLs:

- `VITE_API_BASE_URL` → Your production API URL
- `FRONTEND_URL` → Your production frontend URL
- `ADMIN_URL` → Your production admin URL

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS configuration includes your frontend URLs
2. **API Connection Failed**: Check if backend is running on port 5000
3. **Environment Variables**: Ensure `.env` files are created in the correct directories

### Port Conflicts

If ports are in use:
- Backend: Change `PORT` in backend/.env
- User Frontend: Change port in frontend/ev-user/vite.config.ts
- Admin Frontend: Change port in frontend/ev-admin/project/vite.config.ts

## API Testing

Use the Swagger documentation at `http://localhost:5000/api-docs` to test API endpoints.

## Socket.IO Integration

The backend includes Socket.IO for real-time features. Frontend applications can connect using:

```javascript
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');
```
