const express = require("express");
const router = express.Router();
const File = require("../models/File");
const auth = require("../middleware/auth");

// Get all files for a user
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const files = await File.find({ userId })
      .sort({ lastAccessed: -1 })
      .select("-content") // Exclude content for list view
      .limit(50);

    res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch files",
    });
  }
});

// Get a specific file by ID
router.get("/:fileId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { fileId } = req.params;

    const file = await File.findOne({ _id: fileId, userId });

    if (!file) {
      return res.status(404).json({
        error: "File not found",
        message: "No file found with this ID",
      });
    }

    // Update last accessed timestamp
    file.lastAccessed = new Date();
    await file.save();

    res.status(200).json({
      success: true,
      file,
    });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch file",
    });
  }
});

// Create or update a file
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, content, source, metadata, fileId } = req.body;

    if (!name || !content) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Name and content are required",
      });
    }

    let file;

    // If fileId is provided, try to update existing file
    if (fileId) {
      file = await File.findOne({ _id: fileId, userId });
    }

    // If file doesn't exist or fileId wasn't provided, create new file
    if (!file) {
      file = new File({
        name,
        content,
        userId,
        source: source || "editor",
        metadata: metadata || {},
      });
    } else {
      // Update existing file
      file.name = name;
      file.content = content;
      file.lastAccessed = new Date();
      if (source) file.source = source;
      if (metadata) file.metadata = metadata;
    }

    await file.save();

    res.status(201).json({
      success: true,
      message: "File saved successfully",
      fileId: file._id,
      file,
    });
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to save file",
    });
  }
});

// Delete a file
router.delete("/:fileId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { fileId } = req.params;

    const result = await File.deleteOne({ _id: fileId, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "File not found",
        message: "No file found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to delete file",
    });
  }
});

module.exports = router;