const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cron = require("node-cron");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const projectRoutes = require("./routes/projects");
const problemRoutes = require("./routes/problems");
const sessionRoutes = require("./routes/sessions");
const Session = require("./models/Session");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
    ],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/prepmate";

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(morgan("combined"));
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/sessions", sessionRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "PrepMate API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  });
});

// Socket.IO for real-time collaboration
// Store room users
const roomUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a collaboration room
  socket.on("joinRoom", async ({ roomId, userName, userId }) => {
    socket.join(roomId);
    socket.userName = userName;
    socket.userId = userId || "anonymous";
    socket.currentRoom = roomId;

    // Add user to room users list
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Map());
    }
    roomUsers.get(roomId).set(socket.id, {
      id: socket.id,
      name: userName,
      userId: socket.userId,
      joinedAt: new Date().toISOString(),
    });

    // Update session in database
    try {
      const session = await Session.findOne({ roomId });
      if (session) {
        // Add participant if not already present
        const existingParticipant = session.participants.find(
          (p) => p.userId === socket.userId
        );
        if (!existingParticipant) {
          session.participants.push({
            userId: socket.userId,
            name: userName,
            joinedAt: new Date(),
            lastSeen: new Date(),
          });
        } else {
          // Update lastSeen
          existingParticipant.lastSeen = new Date();
        }
        session.lastActivity = new Date();
        await session.save();
      }
    } catch (error) {
      console.error("Error updating session on join:", error);
    }

    // Get all users in the room
    const usersInRoom = roomUsers.has(roomId) 
      ? Array.from(roomUsers.get(roomId).values())
      : [];

    // Notify all users in the room about the new user
    io.to(roomId).emit("roomUsers", usersInRoom);

    // Notify others that a new user joined
    socket.to(roomId).emit("userJoined", {
      userId: socket.id,
      userName: userName,
      message: `${userName} joined the room`,
    });

    console.log(`${userName} (${socket.id}) joined room: ${roomId}`);
  });

  // Handle code changes
  socket.on("codeChange", async ({ roomId, code, language }) => {
    socket.to(roomId).emit("codeUpdate", {
      code: code,
      language: language,
      userId: socket.id,
      userName: socket.userName,
      timestamp: new Date().toISOString(),
    });

    // Update session in database
    try {
      await Session.findOneAndUpdate(
        { roomId },
        { 
          code, 
          language: language || undefined,
          lastActivity: new Date() 
        },
        { new: true }
      );
    } catch (error) {
      console.error("Error updating session code:", error);
    }
  });

  // Handle language changes
  socket.on("languageChange", async ({ roomId, language }) => {
    socket.to(roomId).emit("languageUpdate", {
      language: language,
      userId: socket.id,
      userName: socket.userName,
    });

    // Update session in database
    try {
      await Session.findOneAndUpdate(
        { roomId },
        { language, lastActivity: new Date() },
        { new: true }
      );
    } catch (error) {
      console.error("Error updating session language:", error);
    }
  });

  // Handle cursor position
  socket.on("cursorMove", ({ roomId, position }) => {
    socket.to(roomId).emit("cursorUpdate", {
      position: position,
      userId: socket.id,
      userName: socket.userName,
    });
  });

  // Handle chat messages
  socket.on("chatMessage", async ({ roomId, message }) => {
    // Handle both string and object message formats
    const messageText = typeof message === 'string' ? message : message.message;
    const messageUserId = typeof message === 'object' && message.userId ? message.userId : socket.id;
    const messageUserName = typeof message === 'object' && message.userName ? message.userName : socket.userName;
    
    const messageData = {
      id: Date.now(), // Add unique ID
      message: messageText,
      userId: messageUserId,
      userName: messageUserName,
      timestamp: new Date().toISOString(),
    };

    io.to(roomId).emit("newMessage", { message: messageData });

    // Save message to database
    try {
      const session = await Session.findOne({ roomId });
      if (session) {
        session.messages.push({
          userId: socket.userId || messageUserId, // Use actual userId if available
          userName: messageUserName,
          message: messageText,
          timestamp: new Date(),
        });
        session.lastActivity = new Date();
        await session.save();
        console.log("Chat message saved to database:", messageText);
      } else {
        console.error("Session not found for roomId:", roomId);
      }
    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  });

  // Handle user typing
  socket.on("userTyping", ({ roomId }) => {
    socket.to(roomId).emit("userIsTyping", {
      userId: socket.id,
      userName: socket.userName,
    });
  });

  // Handle user stopped typing
  socket.on("userStoppedTyping", ({ roomId }) => {
    socket.to(roomId).emit("userStoppedTyping", {
      userId: socket.id,
      userName: socket.userName,
    });
  });

  // Handle whiteboard changes
  socket.on("whiteboardChange", async ({ roomId, elements }) => {
    // Broadcast to other users in the room
    socket.to(roomId).emit("whiteboardUpdate", { elements });

    // Save whiteboard state to database
    try {
      const session = await Session.findOne({ roomId });
      if (session) {
        session.whiteboardElements = elements;
        session.lastActivity = new Date();
        await session.save();
        console.log("Whiteboard state saved to database");
      }
    } catch (error) {
      console.error("Error saving whiteboard state:", error);
    }
  });

  // Handle user ready for screen share (initiates peer connections if needed)
  socket.on("userReadyForScreenShare", ({ roomId }) => {
    socket.to(roomId).emit("userReadyForScreenShare", {
      userId: socket.id,
      userName: socket.userName,
    });
  });

  // Handle screen share started
  socket.on("screenShareStarted", ({ roomId }) => {
    socket.to(roomId).emit("userScreenShareStarted", {
      userId: socket.id,
      userName: socket.userName,
    });
  });

  // Handle screen share stopped
  socket.on("screenShareStopped", ({ roomId }) => {
    socket.to(roomId).emit("userScreenShareStopped", {
      userId: socket.id,
      userName: socket.userName,
    });
  });

  // WebRTC Signaling Events
  // Handle user ready for call
  socket.on("userReadyForCall", ({ roomId }) => {
    socket.to(roomId).emit("userReadyForCall", {
      userId: socket.id,
      userName: socket.userName,
    });
    console.log(`${socket.userName} is ready for call in room: ${roomId}`);
  });

  // Handle WebRTC offer
  socket.on("webrtc-offer", ({ offer, to, roomId }) => {
    io.to(to).emit("webrtc-offer", {
      offer: offer,
      from: socket.id,
      userName: socket.userName,
    });
    console.log(`WebRTC offer sent from ${socket.id} to ${to}`);
  });

  // Handle WebRTC answer
  socket.on("webrtc-answer", ({ answer, to, roomId }) => {
    io.to(to).emit("webrtc-answer", {
      answer: answer,
      from: socket.id,
      userName: socket.userName,
    });
    console.log(`WebRTC answer sent from ${socket.id} to ${to}`);
  });

  // Handle ICE candidate
  socket.on("ice-candidate", ({ candidate, to, roomId }) => {
    io.to(to).emit("ice-candidate", {
      candidate: candidate,
      from: socket.id,
      userName: socket.userName,
    });
  });

  // Handle user left call
  socket.on("userLeftCall", ({ roomId }) => {
    socket.to(roomId).emit("userLeftCall", {
      userId: socket.id,
      userName: socket.userName,
    });
    console.log(`${socket.userName} left the call in room: ${roomId}`);
  });

  // Request current code state when joining
  socket.on("requestCodeState", ({ roomId }) => {
    socket.to(roomId).emit("codeStateRequest", {
      requesterId: socket.id,
    });
  });

  // Send code state to requesting user
  socket.on("sendCodeState", ({ roomId, code, language, targetUserId }) => {
    io.to(targetUserId).emit("receiveCodeState", {
      code: code,
      language: language,
    });
  });

  // Join a project room (legacy support)
  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    socket.to(projectId).emit("userJoined", {
      userId: socket.id,
      message: "A user joined the project",
    });
  });

  // Handle disconnection
  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    // Update lastSeen in session
    if (socket.currentRoom && socket.userId) {
      try {
        const session = await Session.findOne({ roomId: socket.currentRoom });
        if (session) {
          const participant = session.participants.find(
            (p) => p.userId === socket.userId
          );
          if (participant) {
            participant.lastSeen = new Date();
          }
          session.lastActivity = new Date();
          await session.save();
        }
      } catch (error) {
        console.error("Error updating session on disconnect:", error);
      }
    }

    // Remove user from room users list
    if (socket.currentRoom && roomUsers.has(socket.currentRoom)) {
      roomUsers.get(socket.currentRoom).delete(socket.id);

      // Get updated users list
      const usersInRoom = Array.from(
        roomUsers.get(socket.currentRoom).values()
      );

      // Notify remaining users
      socket.to(socket.currentRoom).emit("roomUsers", usersInRoom);
      socket.to(socket.currentRoom).emit("userLeft", {
        userId: socket.id,
        userName: socket.userName,
        message: `${socket.userName} left the room`,
      });

      // Clean up empty rooms
      if (roomUsers.get(socket.currentRoom).size === 0) {
        roomUsers.delete(socket.currentRoom);
      }
    }
  });

  // Handle leaving a room
  socket.on("leaveRoom", ({ roomId }) => {
    socket.leave(roomId);

    // Remove user from room users list
    if (roomUsers.has(roomId)) {
      roomUsers.get(roomId).delete(socket.id);

      // Get updated users list
      const usersInRoom = Array.from(roomUsers.get(roomId).values());

      // Notify remaining users
      socket.to(roomId).emit("roomUsers", usersInRoom);
      socket.to(roomId).emit("userLeft", {
        userId: socket.id,
        userName: socket.userName,
        message: `${socket.userName} left the room`,
      });

      // Clean up empty rooms
      if (roomUsers.get(roomId).size === 0) {
        roomUsers.delete(roomId);
      }
    }

    socket.currentRoom = null;
    console.log(`${socket.userName} (${socket.id}) left room: ${roomId}`);
  });
});

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    
    // Start cleanup job for expired sessions (runs daily at midnight)
    cron.schedule("0 0 * * *", async () => {
      try {
        const result = await Session.deleteMany({
          expiresAt: { $lt: new Date() },
        });
        console.log(`Cleaned up ${result.deletedCount} expired sessions`);
      } catch (error) {
        console.error("Error cleaning up expired sessions:", error);
      }
    });
    
    console.log("Session cleanup job scheduled (daily at midnight)");
    
    server.listen(PORT, () => {
      console.log(`PrepMate API server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

module.exports = { app, server, io };
