import { RequestHandler } from "express";
import { tutorService } from "./tutor.service";

const getTutors: RequestHandler = async (req, res) => {
  try {
    const result = await tutorService.getTutors();
    res.status(201).json({
      success: true,
      message: "All tutors fetched successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSpecificTutor: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await tutorService.getSpecificTutor(id as string);
    res.status(201).json({
      success: true,
      message: "Tutor details fetched successfullty",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const tutorController = { getTutors, getSpecificTutor };
