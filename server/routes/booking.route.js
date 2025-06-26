import express from "express";
import {
  createBooking,
  getMyBookings,
  getMyPropertyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  updatePaymentStatus,
  getBookingStats,
  deleteBooking,
} from "../controllers/booking.controller.js";
import { protectroute } from "../middleware/protectroute.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protectroute);

// POST /api/bookings - Create a new booking
router.post("/", createBooking);

// GET /api/bookings/my - Get user's bookings (as guest)
router.get("/my", getMyBookings);

// GET /api/bookings/property - Get bookings for user's properties (as owner)
router.get("/property", getMyPropertyBookings);

// GET /api/bookings/stats - Get booking statistics for property owner
router.get("/stats", getBookingStats);

// GET /api/bookings/:id - Get specific booking by ID
router.get("/:id", getBookingById);

// PUT /api/bookings/:id/status - Update booking status (property owner only)
router.put("/:id/status", updateBookingStatus);

// PUT /api/bookings/:id/cancel - Cancel booking (guest only)
router.put("/:id/cancel", cancelBooking);

// PUT /api/bookings/:id/payment - Update payment status
router.put("/:id/payment", updatePaymentStatus);

router.post("/:id/delete", deleteBooking);

export default router;
