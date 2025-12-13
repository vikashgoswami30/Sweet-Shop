import { Router } from "express";
import { addSweet } from "../controllers/sweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/sweets").post(
  upload.fields([
    {
      name: "sweetImage",
      maxCount: 1,
    },
  ]),
  addSweet
);

export default router;
