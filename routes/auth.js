// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register Route (unchanged)
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// Updated Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Exclude password from user data
    const userData = {
      id: user._id,
      username: user.username,
      // Add other non-sensitive fields as needed
    };

    res.json({ token, user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
