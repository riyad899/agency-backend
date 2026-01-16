# Agency Backend

A Node.js backend application built with Express, TypeScript, MongoDB, and JWT authentication.

## Features

- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database with native driver
- **JWT Authentication** - Secure token-based authentication
- **CORS** - Cross-origin resource sharing support
- **Environment Configuration** - dotenv for environment variables

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env` file (already configured)

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

- `GET /` - API status
- `GET /health` - Health check
- `POST /auth/token` - Generate JWT token
- `GET /protected` - JWT protected route example

## Environment Variables

- `PORT` - Server port (default: 5001)
- `DB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Token expiration time

## Project Structure

```
src/
├── index.ts          # Main server file
├── routes/           # API routes (to be created)
├── models/           # Database models (to be created)
├── middleware/       # Custom middleware (to be created)
└── utils/            # Utility functions (to be created)
```