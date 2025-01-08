import { USER_AUTH_TOKEN } from "../constants/index.js";
import catchAsyncError from "../middlewares/catch-async-error.js"
import userModel from "../models/user.model.js";
import sendToken from "../utils/jwt-token.js";

export const createUser = catchAsyncError(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  const existingUser = await userModel.find({ email: email });
  if (existingUser.length) {
    return res.status(400).json({ message: "User already exists" });
  }
  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password,
  });
  res.status(201).json({ message: `Welcome ${user.firstName} ${user.lastName} to our platform!` });
});

export const login = catchAsyncError(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  const user = await userModel.findOne({ email: email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "User not found ! Please signup first!" });
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  sendToken(user, 200, res, `Welcome Back! ${user.firstName} ${user.lastName}`, USER_AUTH_TOKEN);
});