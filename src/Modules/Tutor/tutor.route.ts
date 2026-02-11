import authMiddleware from "../../Middleware/authMiddleware";
import { tutorController } from "./tutor.controller";
import { Router } from "express";

const router = Router();

router.get("/", tutorController.getTutors);
router.get("/featured", tutorController.getFeaturedTutor);
router.get(
  "/sessions",
  authMiddleware("TUTOR"),
  tutorController.getTeachingSessions,
);
router.get(
  "/reviews",
  authMiddleware("TUTOR"),
  tutorController.getTutorReviews,
);
router.get("/:id", tutorController.getSpecificTutor);

export const tutorRoute = router;
