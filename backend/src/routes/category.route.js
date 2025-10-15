import express from "express";
const router = express.Router();
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/category.controller.js";

import { authorizeAdmin, verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/").post(verifyJWT, authorizeAdmin, createCategory);
router.route("/:categoryId").put(verifyJWT, authorizeAdmin, updateCategory);
router
  .route("/:categoryId")
  .delete(verifyJWT, authorizeAdmin, removeCategory);

router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);

export default router;