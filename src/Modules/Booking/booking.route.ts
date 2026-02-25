import { Router } from "express";
import authMiddleware from "../../Middleware/authMiddleware";
import { bookingController } from "./booking.controller";

const router = Router();

router.post(
  "/",
  authMiddleware("STUDENT", "TUTOR"),
  bookingController.postBooking,
);
router.get("/all", authMiddleware("ADMIN"), bookingController.getAllBookings);
router.get(
  "/tutor-sessions",
  authMiddleware("TUTOR"),
  bookingController.getTutorSessions,
);
router.get(
  "/student",
  authMiddleware("STUDENT", "TUTOR"),
  bookingController.getBookingsBySpecificUser,
);
router.patch(
  "/complete/:id",
  authMiddleware("TUTOR"),
  bookingController.completeSession,
);
router.patch(
  "/cancel/:id",
  authMiddleware("TUTOR"),
  bookingController.cancelSession,
);

export const bookingRoute = router;
