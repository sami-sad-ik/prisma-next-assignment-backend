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

export const userController = { becomeTutor };
