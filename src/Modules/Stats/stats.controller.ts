import { RequestHandler } from "express";
import { statsService } from "./Stats.service";

const getHomepageStats: RequestHandler = async (req, res) => {
  try {
    const stats = await statsService.getHomepageStats();

    res.status(200).json({
      success: true,
      message: "Statistics fetched successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error in getHomepageStats controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch homepage statistics",
    });
  }
};

export const statsController = { getHomepageStats };
