const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
  } catch (error) {
    throw error;
  }
};

module.exports = generateRefreshToken;
