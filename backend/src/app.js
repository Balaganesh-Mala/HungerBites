import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler.js";

// ✅ Import all routes
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import orderRoutes from "./routes/order.routes.js";
import heroRoutes from "./routes/hero.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import shiprocketRoutes from "./routes/shiprocket.routes.js"
import webhookRoutes from "./routes/shiprocket.routes.js";

dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form-data (if needed)

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/shiprocket", shiprocketRoutes);
app.post("/api/webhooks/shipment", (req, res) => {
  console.log("🔥 DIRECT WEBHOOK TEST HIT 🔥");
  res.json({ ok: true });
});





// ✅ Health check route (optional but useful)
app.get("/", (req, res) => {
  res.send("Hunger Bites API is running...");
});

// ✅ Error Handler (Always last)
app.use(errorHandler);

export default app;
