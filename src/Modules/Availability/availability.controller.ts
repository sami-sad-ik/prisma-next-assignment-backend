import { RequestHandler } from "express";
import { availabilityService } from "./availability.service";

const setAvailability: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;
    const { startTime, endTime } = req.body;
    const result: any = await availabilityService.setAvailability(userId, {
      startTime,
      endTime,
    });
    res.status(201).json({
      success: true,
      message: "Availability set successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Failed to set availability",
    });
  }
};

const getAvailability: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;
    const result: any = await availabilityService.getAvailability(userId);
    res.status(200).json({
      success: true,
      message: "Retrieved availability successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Failed to retrieve availability!",
    });
  }
};

const deleteAbility: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user!.id;
    const result = await availabilityService.deleteAbility(
      id as string,
      userId,
    );
    res.status(200).json({
      success: true,
      message: "Deleted availability successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message || "Failed to delete availability!",
    });
  }
};

export const availabilityController = {
  setAvailability,
  getAvailability,
  deleteAbility,
};
