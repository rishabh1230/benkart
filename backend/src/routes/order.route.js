import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/order.controller.js";

import { verifyJWT, authorizeAdmin } from "../middlewares/auth.middleware.js";

router
  .route("/")
  .post(verifyJWT, createOrder)
  .get(verifyJWT, authorizeAdmin, getAllOrders);

router.route("/mine").get(verifyJWT, getUserOrders);
router.route("/total-orders").get(verifyJWT, authorizeAdmin, countTotalOrders);
router.route("/total-sales").get(verifyJWT, authorizeAdmin, calculateTotalSales);
router.route("/total-sales-by-date").get(verifyJWT, authorizeAdmin, calcualteTotalSalesByDate);
router.route("/:id").get(verifyJWT, findOrderById);
router.route("/:id/pay").put(verifyJWT, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(verifyJWT, authorizeAdmin, markOrderAsDelivered);

export default router;