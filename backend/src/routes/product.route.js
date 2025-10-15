import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/product.controller.js";
import { verifyJWT, authorizeAdmin } from "../middlewares/auth.middleware.js";
import checkId from "../middlewares/checkId.js";

router
  .route("/")
  .get(fetchProducts)
  .post(verifyJWT, authorizeAdmin, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(verifyJWT , checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(verifyJWT, authorizeAdmin, formidable(), updateProductDetails)
  .delete(verifyJWT, authorizeAdmin, removeProduct);

router.route("/filtered-products").post(filterProducts);

export default router;