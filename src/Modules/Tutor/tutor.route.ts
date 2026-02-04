import { tutorController } from "./tutor.controller";
import { Router } from "express";

const router = Router();

router.get("/", tutorController.getTutors);

export const tutorRoute = router;
