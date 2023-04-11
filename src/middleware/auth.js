const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const SECRETE_KEY = process.env.SECRETE_KEY;
const authMiddleware = async (req, res, next) => {
  try {
    // Get JWT token from request header

    const token = req.header("Authorization").replace("Bearer ", "");
    // Verify JWT token
    const decoded = jwt.verify(token, SECRETE_KEY);

    // Find user in database by ID and token
    const user = await User.findOne({
      _id: decoded.userId,
    });
    console.log(user);
    // Check if user exists
    if (!user) {
      throw new Error();
    }

    // Attach user ID to request object for later use
    req.userId = user._id;

    // Call next middleware
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Please authenticate" });
  }
};

module.exports = authMiddleware;
