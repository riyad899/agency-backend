import { Request, Response } from "express";
import { getDB } from "../../config/db";
import { ObjectId } from "mongodb";

// Create a new product


export const createProduct = async (req: Request, res: Response) => {
  try {
    const db = getDB();

    const {
      slug,
      title,
      tagline,
      description,
      coverImage,
      badge,
      liveLink,
      repoLink,
      highlights,
      features,
      cta,
      theme,
      status,
      order,
      postedBy,
    } = req.body;

    if (!slug || !title || !postedBy) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // ✅ validate ObjectId
    if (!ObjectId.isValid(postedBy as string)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    // Check user exists
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(postedBy as string) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = {
      slug,
      title,
      tagline,
      description,
      coverImage,
      badge,
      liveLink,
      repoLink,
      highlights,
      features,
      cta,
      theme,
      status: status || "active",
      order: order || 0,
      postedBy: new ObjectId(postedBy as string), // ✅ from request body
      createdAt: new Date(),
    };

    const result = await db.collection("products").insertOne(product);

    return res.status(201).json({
      success: true,
      data: { ...product, _id: result.insertedId },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create product" });
  }
};

// Get all products
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const db = getDB();

    const products = await db
      .collection("products")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "postedBy",
          },
        },
        {
          $addFields: {
            postedBy: {
              $ifNull: [{ $arrayElemAt: ["$postedBy", 0] }, null]
            }
          }
        },
        {
          $sort: { order: 1, createdAt: -1 },
        },
      ])
      .toArray();

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get all products error:", error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};


// updated product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const db = getDB();

    const updateData: any = {
      ...req.body,
      updatedAt: new Date(),
    };

    delete updateData.postedBy;
    delete updateData._id;
    delete updateData.createdAt;

    const result = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(id as string) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(500).json({ message: "Failed to update product" });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!id || !ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const db = getDB();

    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id as string),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({ message: "Failed to delete product" });
  }
};