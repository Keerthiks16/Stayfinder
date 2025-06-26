import { genToken } from "../middleware/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Admin-specific signup (only accessible by super-admin)
export const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email, isAdmin: true });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    // Generate token
    const token = await genToken(admin._id);

    res.cookie("stayfinder-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      isAdmin: admin.isAdmin,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Admin signup error: ${error.message}` });
  }
};

// Admin login (same as user login but verifies isAdmin)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin user
    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // Generate token
    const token = await genToken(admin._id);

    res.cookie("stayfinder-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      isAdmin: admin.isAdmin,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Admin login error: ${error.message}` });
  }
};

// Get current admin (protected by verifyAdmin middleware)
export const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id).select("-password");
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    return res.status(200).json(admin);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error fetching admin: ${error.message}` });
  }
};

// Admin logout (same as user logout)
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("stayfinder-token");
    return res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Admin logout error: ${error.message}` });
  }
};