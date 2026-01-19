import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  getServicesByCategory,
  updateService,
  deleteService,
  getCategories
} from "./service.controller";
import { verifyToken, requireAdmin } from "../../middlewares/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", getAllServices);
router.get("/categories", getCategories);
router.get("/category/:category", getServicesByCategory);
router.get("/:id", getServiceById);
router.patch("/test/:id", updateService); // Temporary public update route for testing

// Admin-only routes
router.post("/", verifyToken, requireAdmin, createService);
router.put("/:id", verifyToken, requireAdmin, updateService);
router.patch("/:id", verifyToken, requireAdmin, updateService);
router.delete("/:id", verifyToken, requireAdmin, deleteService);

export default router;