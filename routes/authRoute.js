const express = require("express");
const {
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
} = require("../controllers/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { validationResult } = require("express-validator"); // Import validation functions if needed
const router = express.Router();

// User Registration
router.post("/register", createUser);

// Forgot Password - Request Reset Token
router.post("/forgot-password-token", forgotPasswordToken);

// Reset Password with Token
router.put("/reset-password/:token", resetPassword);

// Update Password
router.put("/password", authMiddleware, updatePassword);

// User Login
router.post("/login", loginUserCtrl);

// Refresh Token
router.get("/refresh", handleRefreshToken);

// Get All Users (Admin only)
router.get("/all-users", authMiddleware, isAdmin, getallUser);

// Get a User by ID
router.get("/:id", authMiddleware, getaUser);

// Delete a User (Admin only)
router.delete("/:id", authMiddleware, isAdmin, deleteaUser);

// Update User (Admin or user updating their own profile)
router.put("/:id", authMiddleware, updatedUser);

// Block User (Admin only)
router.put("/block-User/:id", authMiddleware, isAdmin, blockUser);

// Unblock User (Admin only)
router.put("/unblock-User/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
