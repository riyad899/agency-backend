import express from "express";
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "./product.controller";
import { verifyToken, requireAdmin, requireUser, optionalToken } from "../../middlewares/auth.middleware";

const router = express.Router();

// Admin-only routes (create, update, delete)
router.post("/", verifyToken, requireAdmin, createProduct);
router.put("/:id", verifyToken, requireAdmin, updateProduct);
router.delete("/:id", verifyToken, requireAdmin, deleteProduct);

// User routes (view products) - could be public or user-only based on your needs
router.get("/", optionalToken, getAllProducts); // Public access with optional user info
// Alternative: router.get("/", verifyToken, requireUser, getAllProducts); // User-only access

export default router;
