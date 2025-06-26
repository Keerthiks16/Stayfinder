import express from "express";
import {
  adminSignup,
  adminLogin,
  getCurrentAdmin,
  adminLogout,
} from "../controllers/adminAuth.controller.js";
import { verifyAdmin } from "../middleware/protectroute.js";

const adminAuthRouter = express.Router();

// Super-admin only route (should be protected by another layer of auth)
adminAuthRouter.post("/signup", adminSignup);

// Regular admin routes
adminAuthRouter.post("/login", adminLogin);
adminAuthRouter.get("/me", verifyAdmin, getCurrentAdmin);
adminAuthRouter.post("/logout", verifyAdmin, adminLogout);

export default adminAuthRouter;
