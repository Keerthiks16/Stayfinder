import Booking from "../models/booking.model.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      listingId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
    } = req.body;

    console.log("=== CREATE BOOKING DEBUG ===");
    console.log("Request body:", req.body);
    console.log("User ID:", req.user.id);

    // Validate required fields
    if (!listingId || !checkInDate || !checkOutDate || !numberOfGuests) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: listingId, checkInDate, checkOutDate, numberOfGuests",
      });
    }

    // Check if listing exists and is active
    const listing = await Listing.findById(listingId);
    if (!listing || !listing.isActive) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or not available",
      });
    }

    // Check if user is trying to book their own property
    if (listing.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot book your own property",
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const now = new Date();

    // Validate dates
    if (checkIn >= checkOut) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    if (checkIn < now) {
      return res.status(400).json({
        success: false,
        message: "Check-in date cannot be in the past",
      });
    }

    // Validate guest capacity
    if (numberOfGuests > listing.capacity.guests) {
      return res.status(400).json({
        success: false,
        message: `Property can accommodate maximum ${listing.capacity.guests} guests`,
      });
    }

    // Check availability - no conflicts with unavailable dates
    const hasUnavailableConflict =
      listing.availability?.unavailableDates?.some((unavailable) => {
        const unavailableStart = new Date(unavailable.startDate);
        const unavailableEnd = new Date(unavailable.endDate);
        return checkIn <= unavailableEnd && checkOut >= unavailableStart;
      }) || false;

    if (hasUnavailableConflict) {
      return res.status(400).json({
        success: false,
        message: "Selected dates are not available",
      });
    }

    // Check for existing booking conflicts
    const existingBookings = await Booking.find({
      listing: listingId,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      ],
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Selected dates are already booked",
      });
    }

    // Calculate number of days and total price
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalPrice = numberOfDays * listing.pricePerDay;

    // Create booking
    const bookingData = {
      listing: listingId,
      guest: req.user.id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfDays,
      numberOfGuests,
      totalPrice,
      specialRequests: specialRequests || "",
      status: "pending",
      paymentStatus: "pending",
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // Populate booking with listing and guest details
    await booking.populate([
      {
        path: "listing",
        select: "propertyName mainImage city pricePerDay owner",
        populate: {
          path: "owner",
          select: "name email",
        },
      },
      {
        path: "guest",
        select: "name email",
      },
    ]);

    await req.user.bookings.push(booking._id);
    await req.user.save();
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create booking",
    });
  }
};

// Get all bookings for the current user (as guest)
export const getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build filter
    let filter = { guest: req.user.id };
    if (status && status !== "all") {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(filter)
      .populate({
        path: "listing",
        select: "propertyName mainImage city pricePerDay owner",
        populate: {
          path: "owner",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      bookings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalBookings: total,
        hasNext: skip + Number(limit) < total,
        hasPrev: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

// Get bookings for properties owned by the current user
export const getMyPropertyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // First get all listings owned by the user
    const userListings = await Listing.find({ owner: req.user.id }).select(
      "_id"
    );
    const listingIds = userListings.map((listing) => listing._id);

    if (listingIds.length === 0) {
      return res.status(200).json({
        success: true,
        bookings: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalBookings: 0,
          hasNext: false,
          hasPrev: false,
        },
      });
    }

    // Build filter
    let filter = { listing: { $in: listingIds } };
    if (status && status !== "all") {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(filter)
      .populate({
        path: "listing",
        select: "propertyName mainImage city pricePerDay",
      })
      .populate({
        path: "guest",
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      bookings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalBookings: total,
        hasNext: skip + Number(limit) < total,
        hasPrev: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error("Get property bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch property bookings",
    });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id)
      .populate({
        path: "listing",
        select:
          "propertyName mainImage subsidiaryImages city pricePerDay owner capacity amenities",
        populate: {
          path: "owner",
          select: "name email",
        },
      })
      .populate({
        path: "guest",
        select: "name email",
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user has permission to view this booking
    const isGuest = booking.guest._id.toString() === req.user.id;
    const isOwner = booking.listing.owner._id.toString() === req.user.id;

    if (!isGuest && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

// Update booking status (for property owners)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    if (
      !status ||
      !["pending", "confirmed", "cancelled", "completed"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Must be one of: pending, confirmed, cancelled, completed",
      });
    }

    const booking = await Booking.findById(id).populate("listing");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is the property owner
    if (booking.listing.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only property owner can update booking status",
      });
    }

    // Validate status transitions
    const currentStatus = booking.status;
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled"],
      cancelled: [], // Cannot change from cancelled
      completed: [], // Cannot change from completed
    };

    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${currentStatus} to ${status}`,
      });
    }

    booking.status = status;
    await booking.save();

    await booking.populate([
      {
        path: "listing",
        select: "propertyName mainImage city pricePerDay",
      },
      {
        path: "guest",
        select: "name email",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
};

// Cancel booking (for guests)
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is the guest who made the booking
    if (booking.guest.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own bookings",
      });
    }

    // Check if booking can be cancelled
    if (!["pending", "confirmed"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be cancelled in its current state",
      });
    }

    // Check cancellation policy (24 hours before check-in)
    const now = new Date();
    const checkInDate = new Date(booking.checkInDate);
    const timeDiff = checkInDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff < 24) {
      return res.status(400).json({
        success: false,
        message:
          "Booking cannot be cancelled less than 24 hours before check-in",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    await booking.populate([
      {
        path: "listing",
        select: "propertyName mainImage city pricePerDay owner",
        populate: {
          path: "owner",
          select: "name email",
        },
      },
      {
        path: "guest",
        select: "name email",
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    if (
      !paymentStatus ||
      !["pending", "paid", "refunded"].includes(paymentStatus)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment status. Must be one of: pending, paid, refunded",
      });
    }

    const booking = await Booking.findById(id).populate("listing");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is the guest or property owner
    const isGuest = booking.guest.toString() === req.user.id;
    const isOwner = booking.listing.owner.toString() === req.user.id;

    if (!isGuest && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update payment status",
      });
    }

    booking.paymentStatus = paymentStatus;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment status",
    });
  }
};

// Get booking statistics for property owner
export const getBookingStats = async (req, res) => {
  try {
    // Get all listings owned by the user
    const userListings = await Listing.find({ owner: req.user.id }).select(
      "_id"
    );
    const listingIds = userListings.map((listing) => listing._id);

    if (listingIds.length === 0) {
      return res.status(200).json({
        success: true,
        stats: {
          totalBookings: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          totalRevenue: 0,
          thisMonthRevenue: 0,
        },
      });
    }

    // Get booking statistics
    const [bookingStats, revenueStats] = await Promise.all([
      Booking.aggregate([
        { $match: { listing: { $in: listingIds } } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Booking.aggregate([
        {
          $match: {
            listing: { $in: listingIds },
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
            thisMonthRevenue: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      "$createdAt",
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                      ),
                    ],
                  },
                  "$totalPrice",
                  0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    // Process booking stats
    const stats = {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0,
      thisMonthRevenue: 0,
    };

    bookingStats.forEach((stat) => {
      stats.totalBookings += stat.count;
      switch (stat._id) {
        case "pending":
          stats.pendingBookings = stat.count;
          break;
        case "confirmed":
          stats.confirmedBookings = stat.count;
          break;
        case "completed":
          stats.completedBookings = stat.count;
          break;
        case "cancelled":
          stats.cancelledBookings = stat.count;
          break;
      }
    });

    if (revenueStats.length > 0) {
      stats.totalRevenue = revenueStats[0].totalRevenue || 0;
      stats.thisMonthRevenue = revenueStats[0].thisMonthRevenue || 0;
    }

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Get booking stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking statistics",
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBooking:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete booking" });
  }
};
