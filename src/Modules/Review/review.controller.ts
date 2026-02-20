import { RequestHandler } from "express";
import { reviewService } from "./review.service";

const postReview: RequestHandler = (req, res) => {
  try {
    const studentId = req.user!.id;
    const { bookingId, rating, comment } = req.body;
    const result = reviewService.postReview(
      studentId,
      bookingId,
      rating,
      comment,
    );
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

const getTutorReviews: RequestHandler = async (req, res) => {
  try {
    const userId = req.user!.id;
    const result = await reviewService.getTutorReviewsFromDB(userId);
    res.status(200).json({
      success: true,
      message: "Successfully retrieved all the reviews",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const reviewController = { postReview, getTutorReviews };
