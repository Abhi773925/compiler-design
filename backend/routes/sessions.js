const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

// Create a new session
router.post("/create", async (req, res) => {
  try {
    const { roomId, creatorName, creatorUserId, code, language } = req.body;

    if (!roomId || !creatorName) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "roomId and creatorName are required",
      });
    }

    // Check if session already exists
    const existingSession = await Session.findOne({ roomId });
    if (existingSession) {
      return res.status(400).json({
        error: "Session already exists",
        message: "A session with this room ID already exists",
      });
    }

    // Create session with 7-day expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = new Session({
      roomId,
      creatorName,
      creatorUserId: creatorUserId || null,
      code: code || "// Start coding here...\n",
      language: language || "javascript",
      participants: [
        {
          userId: creatorUserId || "anonymous",
          name: creatorName,
          joinedAt: new Date(),
          lastSeen: new Date(),
        },
      ],
      expiresAt,
      lastActivity: new Date(),
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: "Session created successfully",
      session: {
        roomId: session.roomId,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to create session",
    });
  }
});

// Get session by room ID
router.get("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({
        error: "Session not found",
        message: "No session found with this room ID",
      });
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      await Session.deleteOne({ roomId });
      return res.status(410).json({
        error: "Session expired",
        message: "This session has expired and been deleted",
      });
    }

    res.status(200).json({
      success: true,
      session: {
        roomId: session.roomId,
        code: session.code,
        language: session.language,
        participants: session.participants,
        messages: session.messages,
        files: session.files || [], // Include files in the response
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        lastActivity: session.lastActivity,
      },
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch session",
    });
  }
});

// Update session (code, language, participants)
router.post("/:roomId/update", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { code, language, participants } = req.body;

    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({
        error: "Session not found",
        message: "No session found with this room ID",
      });
    }

    // Update fields
    if (code !== undefined) session.code = code;
    if (language !== undefined) session.language = language;
    if (participants !== undefined) session.participants = participants;

    session.lastActivity = new Date();

    await session.save();

    res.status(200).json({
      success: true,
      message: "Session updated successfully",
    });
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update session",
    });
  }
});

// Add a file to a session
router.post("/:roomId/files", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { fileId, name, content, mime, size, uploadedBy, uploaderName } = req.body;

    if (!fileId || !name) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "fileId and name are required",
      });
    }

    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({
        error: "Session not found",
        message: "No session found with this room ID",
      });
    }

    // Create file entry
    const fileEntry = {
      fileId,
      name,
      content,
      mime: mime || 'text/plain',
      size: size || 0,
      uploadedBy: uploadedBy || 'anonymous',
      uploaderName: uploaderName || 'Anonymous',
      uploadedAt: new Date(),
    };

    // Check if file already exists and update it, or add new
    const fileIndex = session.files?.findIndex(f => f.fileId === fileId);
    if (fileIndex !== -1 && fileIndex !== undefined) {
      session.files[fileIndex] = fileEntry;
    } else {
      if (!session.files) {
        session.files = [];
      }
      session.files.push(fileEntry);
    }

    session.lastActivity = new Date();
    await session.save();

    res.status(200).json({
      success: true,
      message: "File saved successfully",
      fileId: fileEntry.fileId,
    });
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to save file",
    });
  }
});

// Get files for a session
router.get("/:roomId/files", async (req, res) => {
  try {
    const { roomId } = req.params;

    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({
        error: "Session not found",
        message: "No session found with this room ID",
      });
    }

    // Return all files in the session
    res.status(200).json({
      success: true,
      files: session.files || [],
    });
  } catch (error) {
    console.error("Error fetching session files:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch session files",
    });
  }
});

// Get a specific file from a session
router.get("/:roomId/files/:fileId", async (req, res) => {
  try {
    const { roomId, fileId } = req.params;

    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({
        error: "Session not found",
        message: "No session found with this room ID",
      });
    }

    // Find the specific file
    const file = session.files?.find(f => f.fileId === fileId);
    
    if (!file) {
      return res.status(404).json({
        error: "File not found",
        message: "No file found with this file ID",
      });
    }

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

// Delete a file from a session
router.delete("/:roomId/files/:fileId", async (req, res) => {
  try {
    const { roomId, fileId } = req.params;

    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({
        error: "Session not found",
        message: "No session found with this room ID",
      });
    }

    // Remove the file
    if (session.files) {
      const initialLength = session.files.length;
      session.files = session.files.filter(f => f.fileId !== fileId);
      
      // Check if a file was actually removed
      if (session.files.length === initialLength) {
        return res.status(404).json({
          error: "File not found",
          message: "No file found with this file ID",
        });
      }
    }

    session.lastActivity = new Date();
    await session.save();

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

// Delete session
router.delete("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    const result = await Session.deleteOne({ roomId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "Session not found",
        message: "No session found with this room ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to delete session",
    });
  }
});

// Get user's recent sessions
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await Session.find({
      $or: [
        { creatorUserId: userId },
        { "participants.userId": userId },
      ],
      expiresAt: { $gt: new Date() },
    })
      .sort({ lastActivity: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      sessions: sessions.map((s) => ({
        roomId: s.roomId,
        creatorName: s.creatorName,
        participantCount: s.participants.length,
        language: s.language,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
        lastActivity: s.lastActivity,
        fileCount: s.files?.length || 0, // Include file count
      })),
    });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch user sessions",
    });
  }
});

module.exports = router;
