import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  getAllUsersWithStatus,
  getUserStatus,
  getAllUsersWithRole,
  getUserRole,
  updateUserRole
} from "./user.controller";
import { verifyToken, requireAdmin, requireUserOrAdmin } from "../../middlewares/auth.middleware";

const router = express.Router();

// Admin-only routes
router.get("/", verifyToken, requireAdmin, getAllUsers);
router.get("/:id/status", verifyToken, requireAdmin, getUserStatus);
router.get("/:id/role", verifyToken, requireAdmin, getUserRole);
router.patch("/:id/status", verifyToken, requireAdmin, updateUserStatus);
router.patch("/:id/role", verifyToken, requireAdmin, updateUserRole);


// User or Admin routes
router.get("/status/all", verifyToken, requireUserOrAdmin, getAllUsersWithStatus);
router.get("/role/all", verifyToken, requireUserOrAdmin, getAllUsersWithRole); 
router.get("/:id", verifyToken, requireUserOrAdmin, getUserById);
router.put("/:id", verifyToken, requireUserOrAdmin, updateUser);
router.patch("/:id", verifyToken, requireUserOrAdmin, updateUser);

export default router;
