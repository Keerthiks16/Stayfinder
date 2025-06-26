import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    propertyType: {
      type: String,
      required: true,
      enum: [
        "Villa",
        "Apartment",
        "House",
        "Condo",
        "Townhouse",
        "Studio",
        "Penthouse",
        "Cottage",
        "Cabin",
        "Loft",
        "Mansion",
        "Bungalow",
      ],
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    mainImage: {
      type: String, // Cloudinary URL
      required: true,
    },
    subsidiaryImages: [
      {
        type: [String],
        validate: {
          validator: function (val) {
            return val.length <= 8;
          },
          message: "Maximum 8 subsidiary images allowed",
        },
      },
    ],

    city: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        latitude: {
          type: Number,
          required: false,
        },
        longitude: {
          type: Number,
          required: false,
        },
      },
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    amenities: [
      {
        type: String,
        enum: [
          "WiFi",
          "Air Conditioning",
          "Kitchen",
          "Parking",
          "Pool",
          "Gym",
          "Pet Friendly",
          "Smoking Allowed",
          "TV",
          "Washing Machine",
          "Balcony",
          "Garden",
          "Hot Tub",
          "Fireplace",
          "Beach Access",
          "AC",
        ],
      },
    ],
    capacity: {
      guests: {
        type: Number,
        required: true,
        min: 1,
      },
      bedrooms: {
        type: Number,
        required: true,
        min: 0,
      },
      bathrooms: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    availability: {
      isAvailable: {
        type: Boolean,
        default: true,
      },
      unavailableDates: [
        {
          startDate: Date,
          endDate: Date,
        },
      ],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for better search performance
listingSchema.index({ city: 1, propertyType: 1, pricePerDay: 1 });
listingSchema.index({ owner: 1 });
listingSchema.index({ averageRating: -1 });

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
