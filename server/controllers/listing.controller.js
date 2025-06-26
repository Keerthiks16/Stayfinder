import dotenv from "dotenv";
dotenv.config();

import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import Review from "../models/review.model.js";
import Booking from "../models/booking.model.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload base64 to Cloudinary
const uploadBase64ToCloudinary = async (base64Data, folder = "listings") => {
  try {
    // Validate base64 data
    if (!base64Data) {
      throw new Error("No base64 data provided");
    }

    // Ensure base64 data has proper format
    let processedBase64 = base64Data;
    if (!base64Data.startsWith("data:")) {
      // If it doesn't have data URI prefix, assume it's image/jpeg
      processedBase64 = `data:image/jpeg;base64,${base64Data}`;
    }

    console.log(
      "Processed base64 starts with:",
      processedBase64.substring(0, 50)
    );
    console.log("About to upload to Cloudinary...");

    const result = await cloudinary.uploader.upload(processedBase64, {
      folder,
      resource_type: "auto",
      quality: "auto:good",
      fetch_format: "auto",
    });

    console.log("Upload successful:", result.secure_url);
    console.log("===================");
    return result.secure_url;
  } catch (error) {
    console.error("=== UPLOAD ERROR ===");
    console.error("Cloudinary upload error:", error);
    console.error("Error details:", error.message);
    console.error("Error code:", error.code);
    console.error("Current cloudinary config:", cloudinary.config());
    console.error("===================");
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
};

export const createListing = async (req, res) => {
  try {
    console.log("=== CREATE LISTING DEBUG ===");
    console.log("Request body keys:", Object.keys(req.body));
    console.log("Main image type:", typeof req.body.mainImage);
    console.log(
      "Main image structure:",
      req.body.mainImage ? Object.keys(req.body.mainImage) : "No mainImage"
    );
    console.log("=============================");

    const {
      propertyName,
      propertyType,
      description,
      city,
      location,
      pricePerDay,
      amenities,
      capacity,
      mainImage,
      subsidiaryImages,
    } = req.body;

    // Validate required fields
    if (
      !propertyName ||
      !propertyType ||
      !description ||
      !city ||
      !pricePerDay ||
      !capacity?.guests
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    let mainImageUrl = null;
    let subsidiaryImageUrls = [];

    // Handle main image
    if (mainImage) {
      if (typeof mainImage === "object" && mainImage.data) {
        // It's a base64 image object
        try {
          mainImageUrl = await uploadBase64ToCloudinary(
            mainImage.data,
            "stayfinder/listings/main"
          );
        } catch (error) {
          console.error("Main image upload error:", error);
          return res.status(500).json({
            message: "Failed to upload main image",
            error: error.message,
          });
        }
      } else if (typeof mainImage === "string") {
        // It's already a URL
        mainImageUrl = mainImage;
      }
    }

    // Handle subsidiary images
    if (
      subsidiaryImages &&
      Array.isArray(subsidiaryImages) &&
      subsidiaryImages.length > 0
    ) {
      try {
        subsidiaryImageUrls = await Promise.all(
          subsidiaryImages.map(async (image) => {
            if (typeof image === "object" && image.data) {
              // It's a base64 image object
              return await uploadBase64ToCloudinary(
                image.data,
                "stayfinder/listings/subsidiary"
              );
            } else if (typeof image === "string") {
              // It's already a URL
              return image;
            }
            return null;
          })
        );
        // Filter out any null values
        subsidiaryImageUrls = subsidiaryImageUrls.filter((url) => url !== null);
      } catch (error) {
        console.error("Error uploading subsidiary images:", error);
        // Continue without subsidiary images rather than failing completely
        subsidiaryImageUrls = [];
      }
    }

    // Create the listing data
    const listingData = {
      propertyName,
      propertyType,
      description,
      city,
      location: location || {},
      pricePerDay: Number(pricePerDay),
      amenities: amenities || [],
      capacity: {
        guests: Number(capacity.guests),
        bedrooms: capacity.bedrooms ? Number(capacity.bedrooms) : undefined,
        bathrooms: capacity.bathrooms ? Number(capacity.bathrooms) : undefined,
      },
      mainImage: mainImageUrl,
      subsidiaryImages: subsidiaryImageUrls,
      owner: req.user.id, // Assuming you have authentication middleware
    };

    // Remove undefined values from capacity
    if (!listingData.capacity.bedrooms) delete listingData.capacity.bedrooms;
    if (!listingData.capacity.bathrooms) delete listingData.capacity.bathrooms;

    // Save to database
    const listing = new Listing(listingData);
    await listing.save();

    await listing.populate("owner", "name email");

    req.user.listings.push(listing._id);
    await req.user.save();

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create listing",
    });
  }
};

// Get all listings with filters
export const getAllListings = async (req, res) => {
  try {
    const {
      city,
      propertyType,
      minPrice,
      maxPrice,
      guests,
      amenities,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    let filter = { isActive: true };

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    if (guests) {
      filter["capacity.guests"] = { $gte: Number(guests) };
    }

    if (amenities) {
      const amenitiesArray = amenities.split(",");
      filter.amenities = { $in: amenitiesArray };
    }

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const listings = await Listing.find(filter)
      .populate("owner", "name email")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Listing.countDocuments(filter);

    return res.status(200).json({
      listings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalListings: total,
        hasNext: skip + Number(limit) < total,
        hasPrev: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error in getAllListings:", error);
    return res.status(500).json({
      message: "Error fetching listings",
      error: error.message,
    });
  }
};

// Get listing by ID
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate("owner", "name email")
      .populate({
        path: "reviews",
        populate: {
          path: "reviewer",
          select: "name",
        },
      });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    return res.status(200).json({ listing });
  } catch (error) {
    console.error("Error in getListingById:", error);
    return res.status(500).json({
      message: "Error fetching listing",
      error: error.message,
    });
  }
};

// Get user's own listings
export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }) // Changed from "owner" to "owner"
      .sort({ createdAt: -1 })
      .populate("reviews");

    return res.status(200).json({ listings });
  } catch (error) {
    console.error("Error in getMyListings:", error);
    return res.status(500).json({
      message: "Error fetching your listings",
      error: error.message,
    });
  }
};

// Update listing with base64 image support
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      propertyName,
      propertyType,
      description,
      city,
      location,
      pricePerDay,
      amenities,
      capacity,
      mainImage,
      subsidiaryImages,
      ...otherFields
    } = req.body;

    console.log("=== UPDATE LISTING DEBUG ===");
    console.log("Listing ID:", id);
    console.log("Main image type:", typeof mainImage);
    console.log("Subsidiary images:", subsidiaryImages?.length || 0);

    // Check if listing exists and user owns it
    const listing = await Listing.findOne({ _id: id, owner: req.user._id });
    if (!listing) {
      return res.status(404).json({
        message: "Listing not found or unauthorized",
      });
    }

    const updateData = { ...otherFields };

    // Handle main image update
    if (mainImage) {
      if (typeof mainImage === "object" && mainImage.data) {
        // It's a base64 image object
        try {
          // console.log("Uploading new main image");
          updateData.mainImage = await uploadBase64ToCloudinary(
            mainImage.data,
            "stayfinder/listings/main"
          );
        } catch (error) {
          // console.error("Main image upload error:", error);
          return res.status(500).json({
            message: "Failed to upload main image",
            error: error.message,
          });
        }
      } else if (typeof mainImage === "string") {
        // It's already a URL
        updateData.mainImage = mainImage;
      }
    }

    // Handle subsidiary images update
    if (
      subsidiaryImages &&
      Array.isArray(subsidiaryImages) &&
      subsidiaryImages.length > 0
    ) {
      try {
        // console.log("Uploading subsidiary images");
        const uploadedUrls = await Promise.all(
          subsidiaryImages.map(async (image) => {
            if (typeof image === "object" && image.data) {
              // It's a base64 image object
              return await uploadBase64ToCloudinary(
                image.data,
                "stayfinder/listings/subsidiary"
              );
            } else if (typeof image === "string") {
              // It's already a URL
              return image;
            }
            return null;
          })
        );
        updateData.subsidiaryImages = uploadedUrls.filter(
          (url) => url !== null
        );
      } catch (error) {
        // console.error("Subsidiary images upload error:", error);
        return res.status(500).json({
          message: "Failed to upload subsidiary images",
          error: error.message,
        });
      }
    }

    // Handle other fields
    if (propertyName) updateData.propertyName = propertyName;
    if (propertyType) updateData.propertyType = propertyType;
    if (description) updateData.description = description;
    if (city) updateData.city = city;
    if (location) updateData.location = location;
    if (pricePerDay) updateData.pricePerDay = Number(pricePerDay);
    if (amenities) updateData.amenities = amenities;
    if (capacity) {
      updateData.capacity = {
        guests: Number(capacity.guests),
        bedrooms: capacity.bedrooms ? Number(capacity.bedrooms) : undefined,
        bathrooms: capacity.bathrooms ? Number(capacity.bathrooms) : undefined,
      };
      // Remove undefined values
      if (!updateData.capacity.bedrooms) delete updateData.capacity.bedrooms;
      if (!updateData.capacity.bathrooms) delete updateData.capacity.bathrooms;
    }

    // console.log("Final update data:", updateData);

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("owner", "name email");

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.error("Error in updateListing:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating listing",
      error: error.message,
    });
  }
};

// Delete listing (soft delete)
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if listing exists and user owns it
    const listing = await Listing.findOne({ _id: id, owner: req.user._id });
    if (!listing) {
      return res.status(404).json({
        message: "Listing not found or unauthorized",
      });
    }

    // Soft delete - mark as inactive
    await Listing.findByIdAndUpdate(id, { isActive: false });
    await Listing.findByIdAndDelete(id);

    // Remove from user's listings array if you have that field
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { listings: id },
    });

    return res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteListing:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting listing",
      error: error.message,
    });
  }
};

// Check availability for booking
export const checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkInDate, checkOutDate, numberOfGuests } = req.body;

    // Validate required fields
    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Check-in and check-out dates are required",
      });
    }

    // Validate listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check if listing is active
    if (!listing.isActive) {
      return res.status(200).json({
        success: true,
        isAvailable: false,
        analysis: {
          status: "inactive",
          message: "This property is currently not available for booking",
          reasons: ["Property is deactivated by owner"],
        },
        listing: {
          id: listing._id,
          propertyName: listing.propertyName,
          pricePerDay: listing.pricePerDay,
          capacity: listing.capacity,
        },
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const now = new Date();

    // Comprehensive date validation
    const dateValidation = validateDates(checkIn, checkOut, now);
    if (!dateValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.message,
        validation: dateValidation,
      });
    }

    // Calculate booking duration and pricing
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const basePrice = numberOfDays * listing.pricePerDay;

    // Check guest capacity if provided
    let guestCapacityCheck = { isValid: true, message: null };
    if (numberOfGuests) {
      guestCapacityCheck = validateGuestCapacity(
        numberOfGuests,
        listing.capacity?.guests
      );
      if (!guestCapacityCheck.isValid) {
        return res.status(400).json({
          success: false,
          message: guestCapacityCheck.message,
          capacity: {
            requested: numberOfGuests,
            maximum: listing.capacity?.guests || 0,
          },
        });
      }
    }

    // Check availability conflicts
    const availabilityAnalysis = await analyzeAvailability(
      listing,
      checkIn,
      checkOut,
      id
    );

    // Get alternative dates if not available
    let alternatives = [];
    if (!availabilityAnalysis.isAvailable) {
      alternatives = await findAlternativeDates(
        listing,
        checkIn,
        checkOut,
        id,
        numberOfDays
      );
    }

    // Get booking history and occupancy rate
    const occupancyData = await calculateOccupancyRate(id, checkIn);

    // Compile comprehensive response
    const response = {
      success: true,
      isAvailable: availabilityAnalysis.isAvailable,
      analysis: {
        status: availabilityAnalysis.isAvailable ? "available" : "unavailable",
        message: availabilityAnalysis.message,
        reasons: availabilityAnalysis.reasons,
        conflictDetails: availabilityAnalysis.conflicts,
      },
      booking: {
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfDays,
        numberOfGuests: numberOfGuests || null,
        pricing: {
          pricePerDay: listing.pricePerDay,
          basePrice,
          currency: listing.currency || "USD",
        },
      },
      listing: {
        id: listing._id,
        propertyName: listing.propertyName,
        city: listing.city,
        pricePerDay: listing.pricePerDay,
        capacity: listing.capacity,
        amenities: listing.amenities?.slice(0, 5) || [], // Top 5 amenities
        images: listing.mainImage ? [listing.mainImage] : [],
        isActive: listing.isActive,
      },
      availability: {
        generalAvailability: listing.availability?.isAvailable !== false,
        unavailablePeriods: availabilityAnalysis.unavailablePeriods,
        bookedPeriods: availabilityAnalysis.bookedPeriods,
        occupancyRate: occupancyData.occupancyRate,
        popularityScore: occupancyData.popularityScore,
      },
      alternatives: availabilityAnalysis.isAvailable
        ? null
        : {
            suggestedDates: alternatives,
            message:
              alternatives.length > 0
                ? "Here are some alternative available dates for the same duration"
                : "No immediate alternatives found for the same duration",
          },
      tips: generateBookingTips(
        availabilityAnalysis,
        occupancyData,
        numberOfDays
      ),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in checkAvailability:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking availability",
      error: error.message,
    });
  }
};

// Helper function to validate dates
const validateDates = (checkIn, checkOut, now) => {
  const reasons = [];

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return {
      isValid: false,
      message: "Invalid date format provided",
      reasons: ["Invalid date format"],
    };
  }

  if (checkIn >= checkOut) {
    reasons.push("Check-out date must be after check-in date");
  }

  if (checkIn < now.setHours(0, 0, 0, 0)) {
    reasons.push("Check-in date cannot be in the past");
  }

  // Check if dates are too far in the future (optional business rule)
  const maxAdvanceBooking = new Date();
  maxAdvanceBooking.setFullYear(maxAdvanceBooking.getFullYear() + 1);
  if (checkIn > maxAdvanceBooking) {
    reasons.push("Check-in date cannot be more than 1 year in advance");
  }

  return {
    isValid: reasons.length === 0,
    message: reasons.length > 0 ? reasons[0] : "Dates are valid",
    reasons,
  };
};

// Helper function to validate guest capacity
const validateGuestCapacity = (requestedGuests, maxCapacity) => {
  if (!maxCapacity) {
    return {
      isValid: true,
      message: "Guest capacity not specified for this property",
    };
  }

  if (requestedGuests > maxCapacity) {
    return {
      isValid: false,
      message: `Property can accommodate maximum ${maxCapacity} guests, but ${requestedGuests} requested`,
    };
  }

  return {
    isValid: true,
    message: `Property can accommodate ${requestedGuests} guests`,
  };
};

// Helper function to analyze availability comprehensively
const analyzeAvailability = async (listing, checkIn, checkOut, listingId) => {
  const reasons = [];
  const conflicts = {
    unavailableDates: [],
    existingBookings: [],
    ownerBlocked: [],
  };

  // Check unavailable dates set by owner
  const unavailableConflicts =
    listing.availability?.unavailableDates?.filter((unavailable) => {
      const unavailableStart = new Date(unavailable.startDate);
      const unavailableEnd = new Date(unavailable.endDate);
      const hasOverlap =
        checkIn <= unavailableEnd && checkOut >= unavailableStart;

      if (hasOverlap) {
        conflicts.unavailableDates.push({
          startDate: unavailableStart,
          endDate: unavailableEnd,
          reason: unavailable.reason || "Owner blocked dates",
        });
      }

      return hasOverlap;
    }) || [];

  // Check existing bookings for conflicts
  // This query finds any booking that overlaps with the requested dates
  const existingBookings = await Booking.find({
    listing: listingId,
    status: { $in: ["confirmed", "pending"] }, // Only check active bookings
    $or: [
      {
        // Case 1: Existing booking starts before requested checkout and ends after requested checkin
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gt: checkIn },
      },
    ],
  }).populate("guest", "name");

  existingBookings.forEach((booking) => {
    conflicts.existingBookings.push({
      bookingId: booking._id,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      status: booking.status,
      guestName: booking.guest?.name || "Guest",
      numberOfDays: Math.ceil(
        (booking.checkOutDate - booking.checkInDate) / (1000 * 60 * 60 * 24)
      ),
    });
  });

  // Compile reasons
  if (unavailableConflicts.length > 0) {
    reasons.push("Selected dates overlap with owner-blocked periods");
  }
  if (existingBookings.length > 0) {
    reasons.push("Selected dates conflict with existing bookings");
  }
  if (listing.availability?.isAvailable === false) {
    reasons.push("Property is temporarily unavailable");
  }

  const isAvailable = reasons.length === 0;

  return {
    isAvailable,
    message: isAvailable
      ? "Property is available for your selected dates"
      : "Property is not available for your selected dates",
    reasons,
    conflicts,
    unavailablePeriods: conflicts.unavailableDates,
    bookedPeriods: conflicts.existingBookings,
  };
};

// Helper function to find alternative available dates
const findAlternativeDates = async (
  listing,
  originalCheckIn,
  originalCheckOut,
  listingId,
  duration
) => {
  const alternatives = [];
  const searchRange = 30; // Search within 30 days before and after

  // Get all conflicts for the next 60 days
  const searchStart = new Date(originalCheckIn);
  searchStart.setDate(searchStart.getDate() - searchRange);

  const searchEnd = new Date(originalCheckIn);
  searchEnd.setDate(searchEnd.getDate() + searchRange);

  const allBookings = await Booking.find({
    listing: listingId,
    status: { $in: ["confirmed", "pending"] },
    checkInDate: { $lt: searchEnd },
    checkOutDate: { $gt: searchStart },
  }).sort({ checkInDate: 1 });

  // Simple algorithm to find 3 alternative date ranges
  let currentDate = new Date(searchStart);
  let foundAlternatives = 0;

  while (currentDate < searchEnd && foundAlternatives < 3) {
    const potentialCheckOut = new Date(currentDate);
    potentialCheckOut.setDate(potentialCheckOut.getDate() + duration);

    // Check if this range conflicts with any booking
    const hasConflict = allBookings.some(
      (booking) =>
        currentDate < booking.checkOutDate &&
        potentialCheckOut > booking.checkInDate
    );

    if (!hasConflict && currentDate >= new Date()) {
      alternatives.push({
        checkInDate: new Date(currentDate),
        checkOutDate: new Date(potentialCheckOut),
        priceTotal: duration * listing.pricePerDay,
      });
      foundAlternatives++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return alternatives;
};

// Helper function to calculate occupancy rate and popularity
const calculateOccupancyRate = async (listingId, checkInDate) => {
  const threeMonthsAgo = new Date(checkInDate);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const bookings = await Booking.find({
    listing: listingId,
    status: { $in: ["confirmed", "completed"] },
    checkInDate: { $gte: threeMonthsAgo, $lte: checkInDate },
  });

  const totalDays = Math.ceil(
    (checkInDate - threeMonthsAgo) / (1000 * 60 * 60 * 24)
  );
  const bookedDays = bookings.reduce((total, booking) => {
    return (
      total +
      Math.ceil(
        (booking.checkOutDate - booking.checkInDate) / (1000 * 60 * 60 * 24)
      )
    );
  }, 0);

  const occupancyRate =
    totalDays > 0 ? Math.round((bookedDays / totalDays) * 100) : 0;

  let popularityScore = "Low";
  if (occupancyRate > 70) popularityScore = "High";
  else if (occupancyRate > 40) popularityScore = "Medium";

  return {
    occupancyRate,
    popularityScore,
    totalBookings: bookings.length,
  };
};

// Helper function to generate booking tips
const generateBookingTips = (
  availabilityAnalysis,
  occupancyData,
  numberOfDays
) => {
  const tips = [];

  if (availabilityAnalysis.isAvailable) {
    if (occupancyData.occupancyRate > 70) {
      tips.push(
        "⚡ This is a popular property! Consider booking soon to secure your dates."
      );
    }

    if (numberOfDays >= 7) {
      tips.push(
        "📅 Long stays often qualify for discounts. Contact the host for potential deals."
      );
    }

    tips.push(
      "✅ Your selected dates are available. Complete your booking to secure the reservation."
    );
  } else {
    tips.push("❌ Your selected dates are not available.");

    if (availabilityAnalysis.conflicts.existingBookings.length > 0) {
      tips.push(
        "📆 Try adjusting your dates by a few days to find availability."
      );
    }

    if (occupancyData.popularityScore === "High") {
      tips.push(
        "🔥 This property books up quickly. Consider flexible dates for better availability."
      );
    }
  }

  return tips;
};
