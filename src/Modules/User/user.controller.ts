import { RequestHandler } from "express";
import { userService } from "./user.service";

const becomeTutor: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;
    const data = req.body;
    const { bio, hourlyRate, categoryIds } = data;

    const result = await userService.becomeTutor(userId, {
      bio,
      hourlyRate,
      categoryIds,
    });
    res.status(201).json({
      success: true,
      message: "You are a tutor now",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to become tutor!" });
  }
};

const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const result = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

const toggleUserStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const { newStatus } = req.body;

    if (!newStatus) {
      return res.status(400).json({
        success: false,
        message: "newStatus is required (e.g., 'ACTIVE' or 'BLOCKED')",
      });
    }

    const result = await userService.toggleUserStatus(id as string, newStatus);

    res.status(200).json({
      success: true,
      message: `User status updated to ${newStatus} successfully`,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

export const userController = { becomeTutor, getAllUsers, toggleUserStatus };
