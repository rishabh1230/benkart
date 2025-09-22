import { Router } from "express";
import { createProduct , getAllProducts, updateProduct, getProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/createProduct",verifyJWT,
  upload.fields([{ name: "productImage", maxCount: 1 }]),
  createProduct
);
router.route("/all").get(getAllProducts);
router.put("/update/:id", verifyJWT, updateProduct);
router.get("/view", verifyJWT, getProduct );

export default router;
