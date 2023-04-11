const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/auth");
const User = require("../models/user");

const router = express.Router();

// Set up multer for handling file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

// Route for uploading profile pictures
router.post(
  "/users/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get user ID from auth middleware
      const userId = req.userId;

      // Update user with profile picture URL
      const user = await User.findById(userId);
      user.profilePicture = req.file.path;
      await user.save();

      res.status(200).json({ message: "Profile picture uploaded" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Route for getting user's profile picture
router.get("/users/:id/avatar", async (req, res) => {
  try {
    // Get user by ID
    const user = await User.findById(req.params.id);

    // Check if user has a profile picture
    if (!user || !user.profilePicture) {
      return res.status(404).send();
    }

    // Set response header to indicate image file
    res.set("Content-Type", "image/png");

    // Send file as response
    fs.createReadStream(user.profilePicture).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
