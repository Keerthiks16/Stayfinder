import express from "express";
import {
  getcurrentuser,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import { protectroute } from "../middleware/protectroute.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", protectroute, getcurrentuser);

export default authRouter;
