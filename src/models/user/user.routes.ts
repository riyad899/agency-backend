import express from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./user.controller";
import { verifyToken, requireAdmin, requireUserOrAdmin } from "../../middlewares/auth.middleware";

const router = express.Router();

// Admin-only routes
router.get("/", verifyToken, requireAdmin, getAllUsers); // Only admins can see all users
router.delete("/:id", verifyToken, requireAdmin, deleteUser); // Only admins can delete users

// User or Admin routes  
router.get("/:id", verifyToken, requireUserOrAdmin, getUserById); // Users can see their own profile, admins can see any
router.put("/:id", verifyToken, requireUserOrAdmin, updateUser); // Users can update their own profile, admins can update any
router.patch("/:id", verifyToken, requireUserOrAdmin, updateUser); // Same as PUT

export default router;
