import { Router } from "express";
import { reviewController } from "./review.controller";
import authMiddleware from "../../Middleware/authMiddleware";

const router = Router();

router.post(
  "/",
  authMiddleware("STUDENT", "TUTOR"),
  reviewController.postReview,
);

export const reviewRouter = router;
