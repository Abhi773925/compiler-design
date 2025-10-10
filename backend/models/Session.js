const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    creatorName: {
      type: String,
      required: true,
    },
    creatorUserId: {
      type: String,
      default: null,
    },
    participants: [
      {
        userId: String,
        name: String,
        joinedAt: Date,
        lastSeen: Date,
      },
    ],
    code: {
      type: String,
      default: "// Start coding here...\n",
    },
    language: {
      type: String,
      default: "javascript",
    },
    messages: [
      {
        userId: String,
        userName: String,
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    files: [
      {
        fileId: String,
        name: String,
        content: String,
        mime: String,
        size: Number,
        uploadedBy: String, // User ID
        uploaderName: String, // User name
        uploadedAt: {
          type: Date,
          default: Date.now,
        }
      },
    ],
    whiteboardElements: {
      type: Array,
      default: [],
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for automatic deletion of expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Update lastActivity before saving
sessionSchema.pre("save", function (next) {
  if (
    this.isModified("code") ||
    this.isModified("language") ||
    this.isModified("participants") ||
    this.isModified("messages") ||
    this.isModified("whiteboardElements") ||
    this.isModified("files")
  ) {
    this.lastActivity = new Date();
  }
  next();
});

module.exports = mongoose.model("Session", sessionSchema);
