import { RequestHandler } from "express";
import { availabilityService } from "./availability.service";

const setAvailability: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;
    const { startTime, endTime } = req.body;
    const result = await availabilityService.setAvailability(userId, {
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

export const availabilityController = { setAvailability };
