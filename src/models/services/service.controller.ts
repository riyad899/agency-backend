import { Request, Response } from "express";
import { getDB } from "../../config/db";
import { ObjectId } from "mongodb";
import { Service } from "./service.model";

// Create a new service
export const createService = async (req: Request, res: Response) => {
  try {
    const db = getDB();

    const {
      title,
      shortDescription,
      category,
      tags,
      images,
      links,
      pricing,
      deliveryTimeDays,
      features,
      technologies,
      requirements,
      status
    } = req.body;

    // Validate required fields
    if (!title || !shortDescription || !category || !pricing?.basePrice || !deliveryTimeDays) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const service: Service = {
      title,
      shortDescription,
      category,
      tags: tags || [],
      images: images || { thumbnail: "", gallery: [] },
      links: links || {},
      pricing: {
        basePrice: pricing.basePrice,
        currency: pricing.currency || "USD"
      },
      deliveryTimeDays,
      features: features || [],
      technologies: technologies || [],
      requirements: requirements || {
        businessName: false,
        businessType: false,
        pagesCount: false,
        contentProvided: false,
        referenceWebsites: false,
        domainHosting: false
      },
      status: status || "active",
      createdAt: new Date()
    };

    const result = await db.collection("services").insertOne(service);

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: { ...service, _id: result.insertedId }
    });
  } catch (error) {
    console.error("Create service error:", error);
    return res.status(500).json({ message: "Failed to create service" });
  }
};

// Get all services
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const db = getDB();

    // Query parameters for filtering
    const { category, status, tags, minPrice, maxPrice, limit, skip } = req.query;

    // Build filter object
    const filter: any = {};

    if (category && typeof category === 'string') {
      filter.category = category;
    }

    if (status && typeof status === 'string') {
      filter.status = status;
    }

    if (tags && typeof tags === 'string') {
      filter.tags = { $in: tags.split(',') };
    }

    if (minPrice || maxPrice) {
      filter['pricing.basePrice'] = {};
      if (minPrice) filter['pricing.basePrice'].$gte = Number(minPrice);
      if (maxPrice) filter['pricing.basePrice'].$lte = Number(maxPrice);
    }

    // Build query with pagination
    let query = db.collection("services").find(filter).sort({ createdAt: -1 });

    if (skip) query = query.skip(Number(skip));
    if (limit) query = query.limit(Number(limit));

    const services = await query.toArray();
    const totalCount = await db.collection("services").countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: services.length,
      totalCount,
      data: services,
      pagination: {
        skip: Number(skip) || 0,
        limit: Number(limit) || services.length,
        hasMore: (Number(skip) || 0) + services.length < totalCount
      }
    });
  } catch (error) {
    console.error("Get all services error:", error);
    return res.status(500).json({ message: "Failed to get services" });
  }
};

// Get service by ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const db = getDB();

    const service = await db.collection("services").findOne({ _id: new ObjectId(id as string) });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error("Get service by ID error:", error);
    return res.status(500).json({ message: "Failed to get service" });
  }
};

// Get services by category
export const getServicesByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { status, limit, skip } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const db = getDB();

    // Build filter
    const filter: any = { category };
    if (status && typeof status === 'string') {
      filter.status = status;
    }

    // Build query with pagination
    let query = db.collection("services").find(filter).sort({ createdAt: -1 });

    if (skip) query = query.skip(Number(skip));
    if (limit) query = query.limit(Number(limit));

    const services = await query.toArray();
    const totalCount = await db.collection("services").countDocuments(filter);

    return res.status(200).json({
      success: true,
      category,
      count: services.length,
      totalCount,
      data: services,
      pagination: {
        skip: Number(skip) || 0,
        limit: Number(limit) || services.length,
        hasMore: (Number(skip) || 0) + services.length < totalCount
      }
    });
  } catch (error) {
    console.error("Get services by category error:", error);
    return res.status(500).json({ message: "Failed to get services by category" });
  }
};

// Update service
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || !ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    if (!updateData || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Request body is required and must contain update data" });
    }

    const db = getDB();

    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.createdAt;

    // Add updated timestamp
    updateData.updatedAt = new Date();

    const result = await db.collection("services").findOneAndUpdate(
      { _id: new ObjectId(id as string) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result?.value) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: result.value
    });
  } catch (error) {
    console.error("Update service error:", error);
    return res.status(500).json({ message: "Failed to update service" });
  }
};

// Delete service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }

    const db = getDB();

    const result = await db.collection("services").deleteOne({ _id: new ObjectId(id as string) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Delete service error:", error);
    return res.status(500).json({ message: "Failed to delete service" });
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const db = getDB();

    const categories = await db.collection("services").distinct("category");

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({ message: "Failed to get categories" });
  }
};