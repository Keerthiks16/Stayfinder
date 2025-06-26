import mongoose from "mongoose";

const heroSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    subtitle: {
      type: String,
      maxlength: 200,
    },
    image: {
      type: String, // Cloudinary URL
      required: true,
    },
    ctaText: {
      type: String,
      maxlength: 50,
    },
    ctaLink: {
      type: String,
    },
    order: {
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

const HeroSection = mongoose.model("HeroSection", heroSectionSchema);
export default HeroSection;
