import express from "express";
import {
  // User Management
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,

  // Listing Management
  getAllListings,
  createListingAsAdmin,
  updateListingAsAdmin,
  deleteListingAsAdmin,

  // Booking Management
  getAllBookings,
  createBookingAsAdmin,
  updateBookingAsAdmin,
  deleteBookingAsAdmin,

  // Hero Section Management
  getHeroSections,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,

  // Dashboard
  getDashboardStats,
  getListingByIdAsAdmin,
  getBookingByIdAsAdmin,
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middleware/protectroute.js";

const router = express.Router();

// Apply admin verification middleware to all routes
router.use(verifyAdmin);

// ==================== USER MANAGEMENT ROUTES ====================
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// ==================== LISTING MANAGEMENT ROUTES ====================
router.get("/listings", getAllListings);
router.post("/listings", createListingAsAdmin);
router.put("/listings/:id", updateListingAsAdmin);
router.get("/listings/:id", getListingByIdAsAdmin);
router.delete("/listings/:id", deleteListingAsAdmin);

// ==================== BOOKING MANAGEMENT ROUTES ====================
router.get("/bookings", getAllBookings);
router.post("/bookings", createBookingAsAdmin);
router.get("/bookings/:id", getBookingByIdAsAdmin);
router.put("/bookings/:id", updateBookingAsAdmin);
router.delete("/bookings/:id", deleteBookingAsAdmin);

// ==================== HERO SECTION MANAGEMENT ROUTES ====================
router.get("/hero-sections", getHeroSections);
router.post("/hero-sections", createHeroSection);
router.put("/hero-sections/:id", updateHeroSection);
router.delete("/hero-sections/:id", deleteHeroSection);

// ==================== DASHBOARD ROUTES ====================
router.get("/dashboard/stats", getDashboardStats);

export default router;
