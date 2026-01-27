import dotenv from 'dotenv'

// Load environment variables FIRST before any other imports
dotenv.config()

import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { verifyIdTokenMiddleware, cookieAuthMiddleware } from './firebase'
import { connectDb } from './db'
import { connectDB } from './config/db'
import userRoutes from './routes/userRoutes'
import authRoutes from './routes/authRoutes'
import adminRoutes from './routes/adminRoutes'
import productRoutes from './routes/productRoutes'
import pricingRoutes from './models/pricing/pricing.routes'
import productsRoutes from './models/products/product.routes'
import projectsRoutes from './models/projects/project.routes'
import servicesRoutes from './models/services/service.routes'
import teamRoutes from './models/team/team.routes'
import userManagementRoutes from './models/user/user.routes'

const app = express()

// CORS configuration for Next.js client
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-admin-secret',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}))

// Security headers - Completely disable COOP for popup authentication
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  next()
})

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 4000

// Initialize both database connections
connectDb().catch((err) => {
  console.error('Failed to connect to MongoDB (Mongoose)', err)
})

connectDB().catch((err) => {
  console.error('Failed to connect to MongoDB (Native Driver)', err)
})

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

// Apply Firebase ID token verification middleware
app.use(verifyIdTokenMiddleware)

// Apply cookie session middleware (must be before routes that need it)
app.use(cookieAuthMiddleware)

// Mount admin routes
app.use('/api', adminRoutes)

// Mount auth routes (includes register, login, logout, profile, me)
app.use('/api', authRoutes)

// Mount user management routes (MongoDB-based - supports both Firebase UID and ObjectId)
app.use('/api/users', userManagementRoutes)

// Mount product routes
app.use('/api/products', productRoutes)
app.use('/api/products', productRoutes)

// Mount pricing routes
app.use('/api/pricing', pricingRoutes)

// Mount products module routes
app.use('/api/products-module', productsRoutes)

// Mount projects routes
app.use('/api/projects', projectsRoutes)

// Mount services routes
app.use('/api/services', servicesRoutes)

// Mount team routes
app.use('/api/team', teamRoutes)

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript server')
})

// Start server
app.listen(Number(PORT), () => {
  console.log(`Server running on http://localhost:${PORT}`)
})