import { genToken } from "../middleware/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }
    let hashPassword = await bcrypt.hash(password, 12);
    let user = await User.create({ name, email, password: hashPassword });
    let token = await genToken(user._id);
    res.cookie("stayfinder-token", token, {
      httpOnly: true,
      secure: (process.env.NODE_ENV = "production"),
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Signup Error: ${error}` });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    let token = await genToken(user._id);
    res.cookie("stayfinder-token", token, {
      httpOnly: true,
      secure: (process.env.NODE_ENV = "production"),
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Login Error: ${error}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("stayfinder-token");
    return res.status(200).json({ message: `Logout Successful` });
  } catch (error) {
    return res.status(500).json({ message: `Logout Error: ${error}` });
  }
};

export const getcurrentuser = async (req,res)=>{
  try {
    return res.status(200).json({user:req.user});
  } catch (error) {
    console.log(`Error in GetCurrentUser: ${error}`)
    return res.status(500).json({message: `Error in GetCurrentUser: ${error}`});
  }
}