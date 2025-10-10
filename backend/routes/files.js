const express = require("express");
const router = express.Router();
const File = require("../models/File");
const auth = require("../middleware/auth");

// Get all files for a user
router.get("/", auth, async (req, res) => {
  try {
    const userEmail = req.user.email; // Use email instead of userId
    const { withContent } = req.query; // Add query param to optionally include content
    
    console.log("=== FETCHING FILES ===");
    console.log("User Email:", userEmail);
    console.log("With content:", withContent);
    
    const files = await File.find({ userId: userEmail })
      .sort({ lastAccessed: -1 })
      .select(withContent === 'true' ? '' : '-content') // Include content if requested
      .limit(100); // Increase limit

    console.log(`✅ Found ${files.length} files for user`);

    res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("❌ Error fetching files:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch files",
    });
  }
});

// Get a specific file by ID
router.get("/:fileId", auth, async (req, res) => {
  try {
    const userEmail = req.user.email; // Use email instead of userId
    const { fileId } = req.params;

    const file = await File.findOne({ _id: fileId, userId: userEmail });

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
    const userEmail = req.user.email; // Use email instead of userId
    const { name, content, source, metadata, fileId } = req.body;

    console.log("=== FILE SAVE REQUEST ===");
    console.log("User Email:", userEmail);
    console.log("File name:", name);
    console.log("Content length:", content?.length);
    console.log("Source:", source);
    console.log("File ID (for update):", fileId);

    if (!name || !content) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        error: "Missing required fields",
        message: "Name and content are required",
      });
    }

    let file;

    // First check if fileId is provided
    if (fileId) {
      console.log("Looking for existing file with ID:", fileId);
      file = await File.findOne({ _id: fileId, userId: userEmail });
      if (file) {
        console.log("✅ Found existing file by ID, updating...");
      }
    }
    
    // If fileId not provided or not found, check by name
    if (!file) {
      console.log("Checking if file with same name exists...");
      file = await File.findOne({ name, userId: userEmail });
      if (file) {
        console.log("✅ Found existing file by name, updating...");
      }
    }

    // If file exists (found by ID or name), update it
    if (file) {
      console.log("Updating existing file:", file._id);
      file.name = name;
      file.content = content;
      file.lastAccessed = new Date();
      if (source) file.source = source;
      if (metadata) file.metadata = metadata;
    } else {
      // Create new file if it doesn't exist
      console.log("Creating new file...");
      file = new File({
        name,
        content,
        userId: userEmail, // Store email as userId
        source: source || "editor",
        metadata: metadata || {},
      });
    }

    await file.save();
    console.log("✅ File saved successfully:", file._id);

    res.status(201).json({
      success: true,
      message: "File saved successfully",
      fileId: file._id,
      file,
    });
  } catch (error) {
    console.error("❌ Error saving file:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to save file",
    });
  }
});

// Delete a file
router.delete("/:fileId", auth, async (req, res) => {
  try {
    const userEmail = req.user.email; // Use email instead of userId
    const { fileId } = req.params;

    const result = await File.deleteOne({ _id: fileId, userId: userEmail });

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