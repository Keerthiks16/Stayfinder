import express from "express";
import {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
  checkAvailability,
} from "../controllers/listing.controller.js";
import { protectroute } from "../middleware/protectroute.js";

const listingRouter = express.Router();

// Protected routes (put specific routes before parameter routes)
listingRouter.post("/", protectroute, createListing); // Removed upload middleware
listingRouter.get("/my-listings", protectroute, getMyListings);

// Public routes
listingRouter.get("/", getAllListings);

// Parameter routes (put these after specific routes)
listingRouter.get("/:id", getListingById);
listingRouter.post("/:id/availability", checkAvailability); // Changed to POST for body data
listingRouter.put("/:id", protectroute, updateListing); // Removed upload middleware
listingRouter.delete("/:id", protectroute, deleteListing);

export default listingRouter;
