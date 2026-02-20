import { Router } from "express";
import { availabilityController } from "./availability.controller";
import authMiddleware from "../../Middleware/authMiddleware";

const router = Router();

router.post(
  "/",
  authMiddleware("TUTOR"),
  availabilityController.setAvailability,
);
router.get(
  "/",
  authMiddleware("TUTOR"),
  availabilityController.getAvailability,
);
router.delete(
  "/:id",
  authMiddleware("TUTOR"),
  availabilityController.deleteAbility,
);

export const availabilityRoute = router;
