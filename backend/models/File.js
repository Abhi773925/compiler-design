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
      enum: ["github", "editor", "local-upload", "custom"],
      default: "editor",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Use Mixed type to accept any structure
      default: {}
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    strict: false, // Allow additional fields
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

// Clear any existing model to force reload
if (mongoose.models.File) {
  delete mongoose.models.File;
}

module.exports = mongoose.model("File", fileSchema);