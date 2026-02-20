import { RequestHandler } from "express";
import { categoryService } from "./category.service";

const createCategory: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await categoryService.createCategory(name);
    res.status(201).json({
      success: true,
      message: "Added new category",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getCategories: RequestHandler = async (req, res) => {
  try {
    const result = await categoryService.getCategoriesFromDB();
    res.status(200).json({
      success: true,
      message: "Successfully retrieved all categories",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Failed to retrieve categories!",
    });
  }
};

export const categoryController = { createCategory, getCategories };
