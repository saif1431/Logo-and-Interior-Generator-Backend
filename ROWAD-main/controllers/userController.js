const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

  const { name, email, password, username, PhoneNo, Address } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    username,
    PhoneNo,
    Address,
  });

  sendToken(user, 201, res);
});

// Update User Profile

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email, username, PhoneNo, Address } = req.body;

  // Check if any of the required fields are missing
  if (!name || !email || !username || !PhoneNo || !Address) {
    return next(new ErrorHander("All fields are required", 400));
  }

  // Check if the provided email is already in use by another user
  const existingUser = await User.findOne({ email });
  

  // Update the user data
  const updatedUserData = {
    name,
    username,
    PhoneNo,
    Address
  };

  const user = await User.findByIdAndUpdate(existingUser._id, updatedUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  // Check if user exists
  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});
// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

  const existingUser = await User.findOne({ email:req.body.email });
  const user = await User.findById(existingUser._id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("Passwords do not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});