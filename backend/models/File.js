const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: ["github", "editor"],
      default: "editor",
    },
    metadata: {
      repoName: String,
      repoOwner: String,
      path: String,
      sha: String,
      language: String,
      size: Number,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index to find files by userId
fileSchema.index({ userId: 1, createdAt: -1 });

// Index for name search
fileSchema.index({ userId: 1, name: 1 });

// Function to update lastAccessed timestamp
fileSchema.methods.updateLastAccessed = async function () {
  this.lastAccessed = new Date();
  return this.save();
};

module.exports = mongoose.model("File", fileSchema);