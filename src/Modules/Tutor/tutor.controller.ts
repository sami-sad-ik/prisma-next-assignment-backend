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
      message: "Tutor details fetched successfully",
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
      message: "Featured tutors fetched successfully",
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

const getTutorProfile: RequestHandler = async (req, res) => {
  try {
    const id = req.user!.id;
    const result = await tutorService.getTutorProfileByUserId(id);
    res.status(200).json({
      success: true,
      message: "Tutor profile fetched successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateTutorProfile: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;
    const data = req.body;

    const result = await tutorService.updateTutorProfileInDB(userId, data);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

export const tutorController = {
  getTutors,
  getSpecificTutor,
  getFeaturedTutor,
  getTeachingSessions,
  getTutorReviews,
  getTutorProfile,
  updateTutorProfile,
};
