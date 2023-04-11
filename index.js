const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/auth");
const profileRoutes = require("./src/routes/profile");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Connect to MongoDB database
const uri = process.env.URI;
// Options to pass to MongoDB driver during connect
const options = {
  useNewUrlParser: true,
  autoIndex: false, // Don't build indexes

  serverSelectionTimeoutMS: 500000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};
mongoose
  .connect("mongodb://127.0.0.1:27017/colabapes", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(`Database connection error: ${err.message}`));
// Middleware for parsing JSON requests
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => console.log(`Server started on port ${port}`));
