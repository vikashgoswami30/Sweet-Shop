import { Router } from "express";
import {
  addSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from "../controllers/sweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/").post(upload.single("sweetImage"), addSweet);
router.route("/").get(verifyJWT, getAllSweets);
router.route("/search").get(verifyJWT, searchSweets);
router.route("/:id").patch(verifyJWT, upload.single("sweetImage"), updateSweet);

// Admin only routes
router.route("/:id").delete(verifyJWT, verifyAdmin, deleteSweet);

// Inventory routes
router.route("/:id/purchase").post(verifyJWT, purchaseSweet);
router.route("/:id/restock").post(verifyJWT, verifyAdmin, restockSweet);

export default router;
