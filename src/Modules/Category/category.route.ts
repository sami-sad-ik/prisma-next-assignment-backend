import authMiddleware from "../../Middleware/authMiddleware";
import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();

router.post("/", authMiddleware("ADMIN"), categoryController.createCategory);
router.get("/", categoryController.getCategories);

export const categoryRoute = router;
