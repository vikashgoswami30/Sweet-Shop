import { Router } from "express";
import { addSweet } from "../controllers/sweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/sweets").post(
  upload.single("sweetImage"),
  addSweet
);

export default router;
