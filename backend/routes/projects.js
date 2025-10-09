const express = require("express");
const Project = require("../models/Project");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all projects for user
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      $or: [
        { owner: req.user.userId },
        { "collaborators.user": req.user.userId },
      ],
    };

    if (search) {
      query.$and = [
        query,
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    const projects = await Project.find(query)
      .populate("owner", "name email picture")
      .populate("collaborators.user", "name email picture")
      .sort({ lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Create new project
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      description,
      language = "javascript",
      isPublic = false,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const project = new Project({
      name,
      description,
      language,
      isPublic,
      owner: req.user.userId,
    });

    await project.save();
    await project.populate("owner", "name email picture");

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get single project
router.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email picture")
      .populate("collaborators.user", "name email picture")
      .populate("chatHistory.user", "name picture");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user has access
    const hasAccess =
      project.owner._id.toString() === req.user.userId ||
      project.collaborators.some(
        (collab) => collab.user._id.toString() === req.user.userId
      ) ||
      project.isPublic;

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Update project
router.patch("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is owner or has admin access
    const isOwner = project.owner.toString() === req.user.userId;
    const hasAdminAccess = project.collaborators.some(
      (collab) =>
        collab.user.toString() === req.user.userId && collab.role === "admin"
    );

    if (!isOwner && !hasAdminAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const allowedUpdates = [
      "name",
      "description",
      "code",
      "language",
      "isPublic",
      "tags",
    ];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("owner", "name email picture")
      .populate("collaborators.user", "name email picture");

    res.status(200).json({
      success: true,
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Delete project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Only owner can delete
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can delete",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Add collaborator
router.post("/:id/collaborators", auth, async (req, res) => {
  try {
    const { userId, role = "editor" } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can add collaborators",
      });
    }

    // Check if user is already a collaborator
    const existingCollaborator = project.collaborators.find(
      (collab) => collab.user.toString() === userId
    );

    if (existingCollaborator) {
      return res.status(400).json({
        success: false,
        message: "User is already a collaborator",
      });
    }

    project.collaborators.push({
      user: userId,
      role,
    });

    await project.save();
    await project.populate("collaborators.user", "name email picture");

    res.status(200).json({
      success: true,
      collaborators: project.collaborators,
    });
  } catch (error) {
    console.error("Add collaborator error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
