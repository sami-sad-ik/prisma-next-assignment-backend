import { RequestHandler } from "express";
import { tutorService } from "./tutor.service";

const getTutors: RequestHandler = async (req, res) => {
  try {
    const result = await tutorService.getTutors();
    res.status(201).json({
      success: true,
      message: "Successfully Reviewed this session",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const tutorController = { getTutors };
