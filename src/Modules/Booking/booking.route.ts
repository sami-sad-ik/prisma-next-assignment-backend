import { Router } from "express";
import authMiddleware from "../../Middleware/authMiddleware";
import { bookingController } from "./booking.controller";

const router = Router();

router.post(
  "/",
  authMiddleware("STUDENT", "TUTOR"),
  bookingController.postBooking,
);
router.get("/", authMiddleware("ADMIN"), bookingController.getAllBookings);

export const bookingRoute = router;
