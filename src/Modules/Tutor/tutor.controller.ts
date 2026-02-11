import { RequestHandler } from "express";
import { tutorService } from "./tutor.service";

const getTutors: RequestHandler = async (req, res) => {
  try {
    const result = await tutorService.getTutors();
    res.status(200).json({
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
    res.status(200).json({
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

const getFeaturedTutor: RequestHandler = async (req, res) => {
  try {
    const result = await tutorService.getFeaturedTutors();
    res.status(200).json({
      success: true,
      message: "Featured tutors fetched successfullty",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getTeachingSessions: RequestHandler = async (req, res) => {
  try {
    const tutorId = req.user!.id;
    const result = await tutorService.getTeachingSessions(tutorId);
    res.status(200).json({
      success: true,
      message: "All teaching sessions retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getTutorReviews: RequestHandler = async (req, res) => {
  try {
    const tutorId = req.user!.id;
    const result = await tutorService.getTutorReviews(tutorId);
    res.status(200).json({
      success: true,
      message: "All reviews retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const tutorController = {
  getTutors,
  getSpecificTutor,
  getFeaturedTutor,
  getTeachingSessions,
  getTutorReviews,
};
