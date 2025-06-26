import mongoose from "mongoose";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import Booking from "../models/booking.model.js";
import HeroSection from "../models/heroSection.model.js"; // You'll need to create this model
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload images to Cloudinary
const uploadToCloudinary = async (file, folder = "admin-uploads") => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image");
  }
};

// ==================== USER MANAGEMENT ====================

// Get all users with pagination
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const filter = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
      },
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, isVerified, role } = req.body;
    let { profileImage } = req.body;

    // Handle image upload if new image is provided
    if (profileImage && profileImage.startsWith("data:image")) {
      profileImage = await uploadToCloudinary(profileImage, "user-profiles");
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phoneNumber,
        isVerified,
        role,
        profileImage,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // First delete all listings and bookings associated with this user
    await Listing.deleteMany({ owner: id });
    await Booking.deleteMany({ $or: [{ guest: id }, { owner: id }] });

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

// ==================== LISTING MANAGEMENT ====================

// Get all listings with filters
export const getAllListings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      city,
      propertyType,
      minPrice,
      maxPrice,
      status = "all", // 'all', 'active', or 'inactive'
    } = req.query;

    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.$or = [
        { propertyName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (city) filter.city = { $regex: city, $options: "i" };
    if (propertyType) filter.propertyType = propertyType;
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }
    if (status === "active") filter.isActive = true;
    if (status === "inactive") filter.isActive = false;

    const listings = await Listing.find(filter)
      .populate("owner", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Listing.countDocuments(filter);

    res.status(200).json({
      success: true,
      listings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalListings: total,
      },
    });
  } catch (error) {
    console.error("Error getting listings:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch listings" });
  }
};

// Create listing as admin
export const createListingAsAdmin = async (req, res) => {
  try {
    const {
      propertyName,
      propertyType,
      description,
      city,
      location,
      pricePerDay,
      amenities,
      capacity,
      ownerId,
    } = req.body;

    let { mainImage, subsidiaryImages } = req.body;

    // Validate required fields
    if (
      !propertyName ||
      !propertyType ||
      !description ||
      !city ||
      !pricePerDay ||
      !capacity?.guests ||
      !ownerId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if owner exists
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(400).json({
        success: false,
        message: "Owner not found",
      });
    }

    // Upload main image if provided
    if (mainImage && mainImage.startsWith("data:image")) {
      mainImage = await uploadToCloudinary(mainImage, "listings/main");
    }

    // Upload subsidiary images if provided
    let subsidiaryImageUrls = [];
    if (subsidiaryImages && Array.isArray(subsidiaryImages)) {
      subsidiaryImageUrls = await Promise.all(
        subsidiaryImages.map(async (image) => {
          if (image.startsWith("data:image")) {
            return await uploadToCloudinary(image, "listings/subsidiary");
          }
          return image;
        })
      );
      subsidiaryImageUrls = subsidiaryImageUrls.filter((url) => url);
    }

    // Create listing
    const listing = new Listing({
      propertyName,
      propertyType,
      description,
      city,
      location: location || {},
      pricePerDay: Number(pricePerDay),
      amenities: amenities || [],
      capacity: {
        guests: Number(capacity.guests),
        bedrooms: capacity.bedrooms ? Number(capacity.bedrooms) : 1,
        bathrooms: capacity.bathrooms ? Number(capacity.bathrooms) : 1,
      },
      mainImage,
      subsidiaryImages: subsidiaryImageUrls,
      owner: ownerId,
      isActive: true,
    });

    await listing.save();

    // Add listing to owner's listings array
    await User.findByIdAndUpdate(ownerId, {
      $addToSet: { listings: listing._id },
    });

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Error creating listing:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create listing" });
  }
};

export const getListingByIdAsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("owner", "name email");

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    console.error("Error getting listing:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch listing" });
  }
};

// Update listing as admin
export const updateListingAsAdmin = async (req, res) => {
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
      ownerId,
      isActive,
    } = req.body;

    let { mainImage, subsidiaryImages } = req.body;

    // Check if listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check if new owner exists if provided
    if (ownerId) {
      const newOwner = await User.findById(ownerId);
      if (!newOwner) {
        return res.status(400).json({
          success: false,
          message: "New owner not found",
        });
      }
    }

    // Handle image updates
    if (mainImage) {
      if (mainImage.startsWith("data:image")) {
        mainImage = await uploadToCloudinary(mainImage, "listings/main");
      }
    } else {
      mainImage = listing.mainImage; // Keep existing if not provided
    }

    let subsidiaryImageUrls = listing.subsidiaryImages || [];
    if (subsidiaryImages && Array.isArray(subsidiaryImages)) {
      subsidiaryImageUrls = await Promise.all(
        subsidiaryImages.map(async (image) => {
          if (image.startsWith("data:image")) {
            return await uploadToCloudinary(image, "listings/subsidiary");
          }
          return image;
        })
      );
      subsidiaryImageUrls = subsidiaryImageUrls.filter((url) => url);
    }

    // Prepare update data
    const updateData = {
      propertyName: propertyName || listing.propertyName,
      propertyType: propertyType || listing.propertyType,
      description: description || listing.description,
      city: city || listing.city,
      location: location || listing.location,
      pricePerDay: pricePerDay ? Number(pricePerDay) : listing.pricePerDay,
      amenities: amenities || listing.amenities,
      capacity: {
        guests: capacity?.guests
          ? Number(capacity.guests)
          : listing.capacity.guests,
        bedrooms: capacity?.bedrooms
          ? Number(capacity.bedrooms)
          : listing.capacity.bedrooms,
        bathrooms: capacity?.bathrooms
          ? Number(capacity.bathrooms)
          : listing.capacity.bathrooms,
      },
      mainImage,
      subsidiaryImages: subsidiaryImageUrls,
      isActive: isActive !== undefined ? isActive : listing.isActive,
    };

    // Handle owner change if needed
    if (ownerId && ownerId !== listing.owner.toString()) {
      updateData.owner = ownerId;

      // Remove from old owner's listings
      await User.findByIdAndUpdate(listing.owner, {
        $pull: { listings: listing._id },
      });

      // Add to new owner's listings
      await User.findByIdAndUpdate(ownerId, {
        $addToSet: { listings: listing._id },
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("owner", "name email");

    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update listing" });
  }
};

// Delete listing as admin
export const deleteListingAsAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Find listing to get owner
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Remove from owner's listings array
    await User.findByIdAndUpdate(listing.owner, {
      $pull: { listings: listing._id },
    });

    // Delete all bookings for this listing
    await Booking.deleteMany({ listing: id });

    // Delete the listing
    await Listing.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Listing and associated bookings deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete listing" });
  }
};

// ==================== BOOKING MANAGEMENT ====================

// Get all bookings with filters
export const getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      paymentStatus,
      fromDate,
      toDate,
    } = req.query;

    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.$or = [
        { "listing.propertyName": { $regex: search, $options: "i" } },
        { "guest.name": { $regex: search, $options: "i" } },
        { "guest.email": { $regex: search, $options: "i" } },
      ];
    }
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (fromDate || toDate) {
      filter.checkInDate = {};
      if (fromDate) filter.checkInDate.$gte = new Date(fromDate);
      if (toDate) filter.checkInDate.$lte = new Date(toDate);
    }

    const bookings = await Booking.find(filter)
      .populate({
        path: "listing",
        select: "propertyName mainImage city pricePerDay",
      })
      .populate({
        path: "guest",
        select: "name email",
      })
      .populate({
        path: "listing.owner",
        select: "name email",
      })
      .skip(skip)
      .limit(limit)
      .sort({ checkInDate: -1 });

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      bookings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total,
      },
    });
  } catch (error) {
    console.error("Error getting bookings:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch bookings" });
  }
};

// Create booking as admin
export const createBookingAsAdmin = async (req, res) => {
  try {
    const {
      listingId,
      guestId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
      status = "confirmed",
      paymentStatus = "paid",
    } = req.body;

    // Validate required fields
    if (
      !listingId ||
      !guestId ||
      !checkInDate ||
      !checkOutDate ||
      !numberOfGuests
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing || !listing.isActive) {
      return res.status(404).json({
        success: false,
        message: "Listing not found or not available",
      });
    }

    // Check if guest exists
    const guest = await User.findById(guestId);
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: "Guest not found",
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

    if (checkIn < now.setHours(0, 0, 0, 0)) {
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

    // Check availability
    const existingBookings = await Booking.find({
      listing: listingId,
      status: { $in: ["confirmed", "pending"] },
      $or: [{ checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }],
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
    const booking = new Booking({
      listing: listingId,
      guest: guestId,
      owner: listing.owner,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfDays,
      numberOfGuests,
      totalPrice,
      specialRequests: specialRequests || "",
      status,
      paymentStatus,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create booking" });
  }
};

export const getBookingByIdAsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate({
        path: "listing",
        select: "propertyName mainImage city pricePerDay",
      })
      .populate({
        path: "guest",
        select: "name email",
      })
      .populate({
        path: "listing.owner",
        select: "name email",
      });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Error getting booking by ID:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch booking" });
  }
};

// Update booking as admin
export const updateBookingAsAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      listingId,
      guestId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
      status,
      paymentStatus,
    } = req.body;

    // Check if booking exists
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if listing exists if provided
    let listing = booking.listing;
    if (listingId && listingId !== booking.listing.toString()) {
      const newListing = await Listing.findById(listingId);
      if (!newListing || !newListing.isActive) {
        return res.status(404).json({
          success: false,
          message: "New listing not found or not available",
        });
      }
      listing = newListing._id;
    }

    // Check if guest exists if provided
    let guest = booking.guest;
    if (guestId && guestId !== booking.guest.toString()) {
      const newGuest = await User.findById(guestId);
      if (!newGuest) {
        return res.status(404).json({
          success: false,
          message: "New guest not found",
        });
      }
      guest = newGuest._id;
    }

    // Validate dates if provided
    let checkIn = booking.checkInDate;
    let checkOut = booking.checkOutDate;
    if (checkInDate || checkOutDate) {
      checkIn = checkInDate ? new Date(checkInDate) : booking.checkInDate;
      checkOut = checkOutDate ? new Date(checkOutDate) : booking.checkOutDate;

      if (checkIn >= checkOut) {
        return res.status(400).json({
          success: false,
          message: "Check-out date must be after check-in date",
        });
      }

      const now = new Date();
      if (checkIn < now.setHours(0, 0, 0, 0)) {
        return res.status(400).json({
          success: false,
          message: "Check-in date cannot be in the past",
        });
      }
    }

    // Validate guest capacity if provided
    if (numberOfGuests) {
      const currentListing = await Listing.findById(listing);
      if (numberOfGuests > currentListing.capacity.guests) {
        return res.status(400).json({
          success: false,
          message: `Property can accommodate maximum ${currentListing.capacity.guests} guests`,
        });
      }
    }

    // Check availability if dates are changed
    if (checkInDate || checkOutDate) {
      const existingBookings = await Booking.find({
        listing: listing,
        _id: { $ne: id }, // Exclude current booking
        status: { $in: ["confirmed", "pending"] },
        $or: [
          { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } },
        ],
      });

      if (existingBookings.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Selected dates are already booked",
        });
      }
    }

    // Calculate number of days and total price if dates changed
    let numberOfDays = booking.numberOfDays;
    let totalPrice = booking.totalPrice;
    if (checkInDate || checkOutDate) {
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const currentListing = await Listing.findById(listing);
      totalPrice = numberOfDays * currentListing.pricePerDay;
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        listing,
        guest,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfDays,
        numberOfGuests: numberOfGuests || booking.numberOfGuests,
        totalPrice,
        specialRequests: specialRequests || booking.specialRequests,
        status: status || booking.status,
        paymentStatus: paymentStatus || booking.paymentStatus,
      },
      { new: true, runValidators: true }
    )
      .populate("listing", "propertyName mainImage city pricePerDay")
      .populate("guest", "name email");

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update booking" });
  }
};

// Delete booking as admin
export const deleteBookingAsAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete booking" });
  }
};

// ==================== HERO SECTION MANAGEMENT ====================

// Get all hero sections
export const getHeroSections = async (req, res) => {
  try {
    const heroSections = await HeroSection.find().sort({ order: 1 });
    res.status(200).json({ success: true, heroSections });
  } catch (error) {
    console.error("Error getting hero sections:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch hero sections" });
  }
};

// Create hero section
export const createHeroSection = async (req, res) => {
  try {
    const { title, subtitle, ctaText, ctaLink, order, isActive } = req.body;
    let { image } = req.body;

    // Validate required fields
    if (!title || !image) {
      return res.status(400).json({
        success: false,
        message: "Title and image are required",
      });
    }

    // Upload image if it's a base64 string
    if (image.startsWith("data:image")) {
      image = await uploadToCloudinary(image, "hero-sections");
    }

    const heroSection = new HeroSection({
      title,
      subtitle,
      image,
      ctaText,
      ctaLink,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await heroSection.save();

    res.status(201).json({
      success: true,
      message: "Hero section created successfully",
      heroSection,
    });
  } catch (error) {
    console.error("Error creating hero section:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create hero section" });
  }
};

// Update hero section
export const updateHeroSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, ctaText, ctaLink, order, isActive } = req.body;
    let { image } = req.body;

    const heroSection = await HeroSection.findById(id);
    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found",
      });
    }

    // Handle image update
    if (image) {
      if (image.startsWith("data:image")) {
        image = await uploadToCloudinary(image, "hero-sections");
      }
    } else {
      image = heroSection.image; // Keep existing if not provided
    }

    const updatedHeroSection = await HeroSection.findByIdAndUpdate(
      id,
      {
        title: title || heroSection.title,
        subtitle: subtitle || heroSection.subtitle,
        image,
        ctaText: ctaText || heroSection.ctaText,
        ctaLink: ctaLink || heroSection.ctaLink,
        order: order !== undefined ? order : heroSection.order,
        isActive: isActive !== undefined ? isActive : heroSection.isActive,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Hero section updated successfully",
      heroSection: updatedHeroSection,
    });
  } catch (error) {
    console.error("Error updating hero section:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update hero section" });
  }
};

// Delete hero section
export const deleteHeroSection = async (req, res) => {
  try {
    const { id } = req.params;

    const heroSection = await HeroSection.findByIdAndDelete(id);
    if (!heroSection) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Hero section deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hero section:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete hero section" });
  }
};

// ==================== DASHBOARD STATS ====================

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [users, listings, bookings, revenue] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
            monthlyRevenue: {
              $sum: {
                $cond: [
                  {
                    $gte: [
                      "$createdAt",
                      new Date(new Date().setDate(new Date().getDate() - 30)),
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

    const stats = {
      totalUsers: users,
      totalListings: listings,
      totalBookings: bookings,
      totalRevenue: revenue[0]?.totalRevenue || 0,
      monthlyRevenue: revenue[0]?.monthlyRevenue || 0,
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};
