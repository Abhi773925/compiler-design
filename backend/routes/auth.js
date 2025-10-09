const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth login
router.post("/google", async (req, res) => {
  console.log("=== Google Auth Request Received ===");
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);

  try {
    const { token } = req.body;

    if (!token) {
      console.log("ERROR: No token provided");
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    console.log("Token received, length:", token.length);
    console.log("Verifying Google token...");
    console.log("Using client ID:", process.env.GOOGLE_CLIENT_ID);

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    console.log("Google user data:", { googleId, email, name });

    // Check if user exists
    let user = await User.findOne({ googleId });

    if (!user) {
      console.log("Creating new user...");
      // Create new user
      user = new User({
        googleId,
        email,
        name,
        picture,
      });
      await user.save();
      console.log("New user created:", user._id);
    } else {
      console.log("Existing user found:", user._id);
    }

    // Generate JWT with 1 week expiration
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000), // issued at time
      },
      process.env.JWT_SECRET || "fallback_secret",
      {
        expiresIn: "7d", // 1 week = 7 days
        issuer: "prepmate-api",
        audience: "prepmate-client",
      }
    );

    console.log("JWT generated with 7-day expiration");
    console.log("Authentication successful, sending response");
    res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("=== Google Auth Error ===");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(400).json({
      success: false,
      message: error.message || "Invalid Google token",
    });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("projects", "name description lastActivity")
      .select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Update user preferences
router.patch("/preferences", auth, async (req, res) => {
  try {
    const { theme, language } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $set: {
          "preferences.theme": theme,
          "preferences.language": language,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      preferences: user.preferences,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Logout (client-side token removal)
router.post("/logout", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Token refresh endpoint
router.post("/refresh", auth, async (req, res) => {
  try {
    console.log("Token refresh requested for user:", req.user.userId);

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new JWT with fresh 1-week expiration
    const newToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET || "fallback_secret",
      {
        expiresIn: "7d",
        issuer: "prepmate-api",
        audience: "prepmate-client",
      }
    );

    console.log("Token refreshed successfully");
    res.status(200).json({
      success: true,
      token: newToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
        preferences: user.preferences,
      },
      expiresIn: "7d",
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refresh token",
    });
  }
});

module.exports = router;
