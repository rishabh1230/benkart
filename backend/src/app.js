import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";
import uploadRoutes from "./routes/upload.routes.js";
import orderRoutes from "./routes/order.route.js";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);


// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    error: "NotFound",
    message: "Route not found",
    code: 404
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err); // optional: logs error in console
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || "InternalServerError",
    message: err.message || "Something went wrong",
    code: status
  });
});

export { app };
