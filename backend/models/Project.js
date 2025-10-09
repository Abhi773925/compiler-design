const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    code: {
      type: String,
      default: "// Start coding here...\n",
    },
    language: {
      type: String,
      enum: [
        "javascript",
        "python",
        "java",
        "cpp",
        "c",
        "typescript",
        "go",
        "rust",
      ],
      default: "javascript",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["viewer", "editor", "admin"],
          default: "editor",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    files: [
      {
        name: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          default: "",
        },
        language: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    chatHistory: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update last activity on save
projectSchema.pre("save", function (next) {
  this.lastActivity = new Date();
  next();
});

module.exports = mongoose.model("Project", projectSchema);
