const User = require("../models/userModel");
const Agents = require("../models/agentModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const generateRefreshToken = require("../config/refreshToken"); // Fix typo in function name
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./emailCtrl");
const { validationResult } = require("express-validator"); // Import validation functions if needed
const { Agent } = require("http");

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if the user already exists
  const findUser = await User.findOne({ email });

  if (!findUser) {
    // Create a new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    res.status(400).json({ error: "User already exists" });
  }
});

// User login
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser._id); // Fix variable name

    // Update the user's refresh token
    const updatedUser = await User.findByIdAndUpdate(
      findUser._id,
      { refreshToken },
      { new: true }
    );

    // Set the refresh token as an HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    // Respond with user information and access token
    res.json({
      _id: findUser._id,
      name: findUser.name,
      agencyId: findUser.agencyId,
      type: findUser.type,
      email: findUser.email,
      mobile: findUser.mobile,
      token: generateToken(findUser._id),
    });
  } else {
    res.status(401).json({ error: "Invalid Email or Password" });
  }
});

// Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ error: "No refresh token found" });
    return;
  }

  // Verify and handle the refresh token as needed
  try {
    // Your refresh token verification logic here

    // If valid, generate a new access token and respond
    const newAccessToken = generateToken(userId);
    res.json({ token: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

// Update user information
const updatedUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    validateMongoDbId(id); // Validate the MongoDB ID

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body }, // Use $set to update only specified fields
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
});

// Get all users
const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find().sort({ distance: 1 });
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user by ID
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id); // Validate the MongoDB ID
    const getaUser = await User.findById(id);
    if (!getaUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(getaUser);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Error getting user" });
  }
});

// Delete a user
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    validateMongoDbId(id); // Validate the MongoDB ID

    const deleteaUser = await User.findByIdAndDelete(id);
    if (!deleteaUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
});

// Block a user (Admin only)
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    validateMongoDbId(id); // Validate the MongoDB ID

    const block = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );

    res.json({ message: "User blocked" });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ error: "Error blocking user" });
  }
});

// Unblock a user (Admin only)
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    validateMongoDbId(id); // Validate the MongoDB ID

    const unblock = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );

    res.json({ message: "User unblocked" });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ error: "Error unblocking user" });
  }
});

// Update user password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;

  try {
    validateMongoDbId(_id); // Validate the MongoDB ID

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.json(updatedPassword);
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Error updating password" });
  }
});

// Request a password reset token
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found with this email" });
    }

    const token = await user.createPasswordResetToken();
    await user.save();

    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid for the next 10 minutes: <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`;

    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };

    // Send the reset password email
    sendEmail(data);

    res.json(token);
  } catch (error) {
    console.error("Error requesting password reset token:", error);
    res.status(500).json({ error: "Error requesting password reset token" });
  }
});

// Reset password using the token
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Token Expired, Please try again later" });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Error resetting password" });
  }
});

module.exports = {
  createUser,
  loginUserCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
};
