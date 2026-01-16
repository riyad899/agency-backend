import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { verifyToken } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import userRoutes from "./models/user/user.routes";
import productRoutes from "./models/products/product.routes";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

// Authentication routes
app.get("/api/profile", verifyToken, (req: any, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie('auth-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Add your routes here
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);


app.use(errorHandler);

export default app;