import express from "express";
import dotenv from "dotenv";
import connectdb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import bookingRouter from "./routes/booking.route.js";
import adminRouter from "./routes/admin.route.js";
import adminAuthRouter from "./routes/adminAuth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

let app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS configuration for frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

const PORT = process.env.PORT || 5001;

// Routes
app.get("/", (req, res) => {
  res.send("Welcome To StayFinder - Your AirBnB Clone");
});

app.use("/api/auth", authRouter);
app.use("/api/listings", listingRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/admin/auth", adminAuthRouter);
app.use("/api/admin", adminRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 5MB." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .json({ message: "Too many files. Maximum 9 files allowed." });
    }
  }

  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on: http://localhost:${PORT}`);
  connectdb();
});
