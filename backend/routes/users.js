const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get user profile
router.get("/profile/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-googleId -__v")
      .populate("projects", "name description isPublic lastActivity");

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
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get detailed user profile with solved problems
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select("-googleId -__v")
      .populate({
        path: "problemsSolved.problemId",
        select: "title difficulty slug",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Group solved problems by difficulty
    const solvedProblems = {
      easy: [],
      medium: [],
      hard: [],
    };

    user.problemsSolved.forEach((solved) => {
      if (solved.problemId) {
        const problem = {
          id: solved.problemId._id,
          title: solved.problemId.title,
          difficulty: solved.problemId.difficulty,
          slug: solved.problemId.slug,
          solvedAt: solved.solvedAt,
          language: solved.language,
        };

        solvedProblems[solved.problemId.difficulty.toLowerCase()].push(problem);
      }
    });

    res.status(200).json({
      success: true,
      profile: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          role: user.role,
          preferences: user.preferences,
          stats: user.stats,
          createdAt: user.createdAt,
        },
        solvedProblems,
      },
    });
  } catch (error) {
    console.error("Get detailed user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Update user profile
router.patch("/profile", auth, async (req, res) => {
  try {
    const allowedUpdates = ["name", "preferences"];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-googleId -__v");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get user stats
router.get("/stats", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "stats problemsSolved"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const recentActivity = user.problemsSolved
      .sort((a, b) => b.solvedAt - a.solvedAt)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      stats: user.stats,
      recentActivity,
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Search users
router.get("/search", auth, async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    })
      .limit(parseInt(limit))
      .select("name email picture")
      .lean();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
