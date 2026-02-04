import { tutorController } from "./tutor.controller";
import { Router } from "express";

const router = Router();

router.get("/", tutorController.getTutors);
router.get("/:id", tutorController.getSpecificTutor);

export const tutorRoute = router;
