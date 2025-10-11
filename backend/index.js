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
const githubRoutes = require("./routes/github");
const filesRoutes = require("./routes/files");
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

// Rate limiting - More generous for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased from 100 to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware - CORS must come BEFORE rate limiting
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(limiter);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/files", filesRoutes);

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
// Store room users and track rooms with active calls
const roomUsers = new Map();
const roomsWithActiveCalls = new Set();
const activeCallParticipants = new Map(); // Track who is in each call
// Shared files state per room
const roomFiles = new Map(); // roomId -> Map(fileId -> { name, content, updatedAt })
const roomActiveFile = new Map(); // roomId -> active fileId
const roomFileMeta = new Map(); // roomId -> Map(fileId -> { name, mime, size })

// Helper function to get user from a room
function getUserFromRoom(roomId, socketId) {
  if (roomUsers.has(roomId)) {
    return roomUsers.get(roomId).get(socketId);
  }
  return null;
}

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
    
    // Check if there's an active call in the room
    if (roomsWithActiveCalls.has(roomId)) {
      // Notify the new user that a call is active
      socket.emit("callActiveInRoom", { roomId });
      console.log(`Notifying ${userName} about active call in room ${roomId}`);
      
      // Also send the count of active participants for better UX
      if (activeCallParticipants.has(roomId)) {
        const participantCount = activeCallParticipants.get(roomId).size;
        if (participantCount > 0) {
          socket.emit("callParticipantsCount", { 
            roomId, 
            count: participantCount 
          });
        }
      }
    }

    // Load files from database into server memory if not already loaded
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
        
        // Initialize file collections for this room if needed
        if (!roomFiles.has(roomId)) roomFiles.set(roomId, new Map());
        if (!roomFileMeta.has(roomId)) roomFileMeta.set(roomId, new Map());
        
        // Load files from session into memory
        if (session.files && session.files.length > 0) {
          session.files.forEach(file => {
            roomFiles.get(roomId).set(file.fileId, {
              name: file.name,
              content: file.content || "",
              updatedAt: file.uploadedAt || new Date().toISOString()
            });
            
            roomFileMeta.get(roomId).set(file.fileId, {
              name: file.name,
              mime: file.mime || "text/plain",
              size: file.size || 0,
              uploadedBy: file.uploadedBy,
              uploaderName: file.uploaderName
            });
          });
          
          // Set first file as active if no active file is set
          if (!roomActiveFile.has(roomId) && session.files.length > 0) {
            roomActiveFile.set(roomId, session.files[0].fileId);
          }
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
          lastActivity: new Date(),
        },
        { new: true }
      );
    } catch (error) {
      console.error("Error updating session code:", error);
    }
  });

  // ===== Shared Files Collaboration =====
  // Open (or announce) a file in the room
  socket.on("openFile", ({ roomId, fileId, name }) => {
    try {
      if (!roomFiles.has(roomId)) roomFiles.set(roomId, new Map());
      const files = roomFiles.get(roomId);
      if (!files.has(fileId)) {
        files.set(fileId, { name: name || fileId, content: "", updatedAt: new Date().toISOString() });
      }
      io.to(roomId).emit("fileOpened", { fileId, name: files.get(fileId).name });
      // If no active file yet, set this as active
      if (!roomActiveFile.has(roomId)) {
        roomActiveFile.set(roomId, fileId);
        io.to(roomId).emit("activeFileChanged", { fileId });
      }
    } catch (e) {
      console.error("openFile error:", e);
    }
  });

  // Change file content
  socket.on("changeFile", ({ roomId, fileId, content }) => {
    try {
      if (!roomFiles.has(roomId)) roomFiles.set(roomId, new Map());
      const files = roomFiles.get(roomId);
      const name = files.get(fileId)?.name || fileId;
      files.set(fileId, { name, content, updatedAt: new Date().toISOString() });
      socket.to(roomId).emit("fileContentUpdate", { fileId, content, userId: socket.id, userName: socket.userName });
    } catch (e) {
      console.error("changeFile error:", e);
    }
  });

  // Request current content of a file
  socket.on("requestFile", ({ roomId, fileId }) => {
    try {
      const content = roomFiles.get(roomId)?.get(fileId)?.content || "";
      const name = roomFiles.get(roomId)?.get(fileId)?.name || fileId;
      socket.emit("fileContentSnapshot", { fileId, name, content });
    } catch (e) {
      console.error("requestFile error:", e);
    }
  });

  // Set active file for the room (e.g., switching tabs)
  socket.on("setActiveFile", ({ roomId, fileId }) => {
    try {
      roomActiveFile.set(roomId, fileId);
      io.to(roomId).emit("activeFileChanged", { fileId });
    } catch (e) {
      console.error("setActiveFile error:", e);
    }
  });

  // Upload a file (metadata + content in base64 or text)
  socket.on("uploadFile", async ({ roomId, fileId, name, mime, size, content, uploadedBy, uploaderName, source, metadata }) => {
    try {
      if (!roomFiles.has(roomId)) roomFiles.set(roomId, new Map());
      if (!roomFileMeta.has(roomId)) roomFileMeta.set(roomId, new Map());
      
      const timestamp = new Date().toISOString();
      roomFiles.get(roomId).set(fileId, { 
        name: name || fileId, 
        content: content || "", 
        updatedAt: timestamp
      });
      
      roomFileMeta.get(roomId).set(fileId, { 
        name: name || fileId, 
        mime: mime || "text/plain", 
        size: size || 0,
        uploadedBy: uploadedBy || socket.userId,
        uploaderName: uploaderName || socket.userName,
        source: source || "upload", // Track source of file (upload, github, cached)
        metadata: metadata || {}    // Store additional metadata
      });
      
      io.to(roomId).emit("fileUploaded", { 
        fileId, 
        name, 
        mime, 
        size, 
        uploadedBy: uploadedBy || socket.userId,
        uploaderName: uploaderName || socket.userName,
        source: source || "upload"
      });
      
      io.to(roomId).emit("fileContentSnapshot", { 
        fileId, 
        name, 
        content: content || "" 
      });
      
      // Save to database
      try {
        const session = await Session.findOne({ roomId });
        if (session) {
          // Check if file exists and update or add new
          const fileIndex = session.files?.findIndex(f => f.fileId === fileId);
          const fileEntry = {
            fileId,
            name: name || fileId,
            content: content || "",
            mime: mime || "text/plain",
            size: size || 0,
            uploadedBy: uploadedBy || socket.userId,
            uploaderName: uploaderName || socket.userName,
            uploadedAt: new Date(),
            source: source || "upload",
            metadata: metadata || {}
          };
          
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
          console.log(`File '${name}' (${source || 'upload'}) saved to database for room ${roomId}`);
        } else {
          // If session doesn't exist, create it
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry
          
          const newSession = new Session({
            roomId,
            creatorName: socket.userName || "Anonymous",
            creatorUserId: socket.userId || null,
            expiresAt,
            files: [{
              fileId,
              name: name || fileId,
              content: content || "",
              mime: mime || "text/plain",
              size: size || 0,
              uploadedBy: uploadedBy || socket.userId,
              uploaderName: uploaderName || socket.userName,
              uploadedAt: new Date(),
              source: source || "upload",
              metadata: metadata || {}
            }]
          });
          
          await newSession.save();
          console.log(`New session created with file '${name}' for room ${roomId}`);
        }
      } catch (dbError) {
        console.error("Error saving file to database:", dbError);
      }
    } catch (e) {
      console.error("uploadFile error:", e);
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
    const messageText = typeof message === "string" ? message : message.message;
    const messageUserId =
      typeof message === "object" && message.userId
        ? message.userId
        : socket.id;
    const messageUserName =
      typeof message === "object" && message.userName
        ? message.userName
        : socket.userName;

    const messageData = {
      id: Date.now(), // Add unique ID
      message: messageText,
      userId: messageUserId,
      userName: messageUserName,
      timestamp: new Date().toISOString(),
    };

    // Send message only to other users in the room, not back to the sender
    socket.to(roomId).emit("newMessage", { message: messageData });

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
  socket.on("whiteboardChange", async ({ roomId, snapshot }) => {
    // Broadcast to other users in the room
    socket.to(roomId).emit("whiteboardUpdate", { snapshot });

    // Save whiteboard state to database
    try {
      const session = await Session.findOne({ roomId });
      if (session) {
        session.whiteboardElements = snapshot;
        session.lastActivity = new Date();
        await session.save();
        console.log("Whiteboard state saved to database");
      }
    } catch (error) {
      console.error("Error saving whiteboard state:", error);
    }
  });

  // Handle whiteboard opened - broadcast to all users in room
  socket.on("whiteboardOpened", ({ roomId }) => {
    socket.to(roomId).emit("whiteboardOpenedByUser", {
      userId: socket.id,
      userName: socket.userName,
    });
    console.log(`${socket.userName} opened whiteboard in room: ${roomId}`);
  });

  // Handle whiteboard closed - broadcast to all users in room
  socket.on("whiteboardClosed", ({ roomId }) => {
    socket.to(roomId).emit("whiteboardClosedByUser", {
      userId: socket.id,
      userName: socket.userName,
    });
    console.log(`${socket.userName} closed whiteboard in room: ${roomId}`);
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
  socket.on("userReadyForCall", ({ roomId, isReconnecting }) => {
    // Track that this room has an active call
    roomsWithActiveCalls.add(roomId);
    
    // Track this user as a call participant
    if (!activeCallParticipants.has(roomId)) {
      activeCallParticipants.set(roomId, new Set());
    }
    activeCallParticipants.get(roomId).add(socket.id);
    
    // Get all existing participants in the call
    const existingParticipants = [];
    if (activeCallParticipants.has(roomId)) {
      activeCallParticipants.get(roomId).forEach(participantId => {
        if (participantId !== socket.id) {
          const user = getUserFromRoom(roomId, participantId);
          if (user) {
            existingParticipants.push({
              userId: participantId,
              userName: user.name
            });
          }
        }
      });
    }
    
    // Send list of existing call participants to the new user
    if (existingParticipants.length > 0) {
      socket.emit("existingCallParticipants", {
        participants: existingParticipants,
        isReconnect: !!isReconnecting
      });
      console.log(`Sent ${existingParticipants.length} existing participants to ${socket.userName}${isReconnecting ? " (reconnecting)" : ""}`);
    }
    
    // Notify others about this new participant
    socket.to(roomId).emit("userReadyForCall", {
      userId: socket.id,
      userName: socket.userName,
      isReconnect: !!isReconnecting
    });
    console.log(`${socket.userName} is ready for call in room: ${roomId}${isReconnecting ? " (reconnecting)" : ""}`);
  });

  // Handle WebRTC offer
  socket.on("webrtc-offer", ({ offer, to, roomId }) => {
    try {
      io.to(to).emit("webrtc-offer", {
        offer: offer,
        from: socket.id,
        userName: socket.userName,
        roomId: roomId
      });
      console.log(`WebRTC offer sent from ${socket.userName} (${socket.id}) to ${to}`);
    } catch (error) {
      console.error(`Error sending WebRTC offer from ${socket.id} to ${to}:`, error);
      socket.emit("webrtcError", {
        type: "offer-failed",
        message: "Failed to send offer",
        toUser: to
      });
    }
  });

  // Handle WebRTC answer
  socket.on("webrtc-answer", ({ answer, to, roomId }) => {
    try {
      io.to(to).emit("webrtc-answer", {
        answer: answer,
        from: socket.id,
        userName: socket.userName,
        roomId: roomId
      });
      console.log(`WebRTC answer sent from ${socket.userName} (${socket.id}) to ${to}`);
    } catch (error) {
      console.error(`Error sending WebRTC answer from ${socket.id} to ${to}:`, error);
      socket.emit("webrtcError", {
        type: "answer-failed",
        message: "Failed to send answer",
        toUser: to
      });
    }
  });

  // Handle ICE candidate
  socket.on("ice-candidate", ({ candidate, to, roomId }) => {
    try {
      io.to(to).emit("ice-candidate", {
        candidate: candidate,
        from: socket.id,
        userName: socket.userName,
        roomId: roomId
      });
      // Uncomment for detailed ICE candidate logging
      // console.log(`ICE candidate sent from ${socket.userName} (${socket.id}) to ${to}`);
    } catch (error) {
      console.error(`Error sending ICE candidate from ${socket.id} to ${to}:`, error);
    }
  });

  // Handle user left call
  socket.on("userLeftCall", ({ roomId }) => {
    // Remove user from active call participants
    if (activeCallParticipants.has(roomId)) {
      activeCallParticipants.get(roomId).delete(socket.id);
      
      // If no participants left, mark call as inactive
      if (activeCallParticipants.get(roomId).size === 0) {
        activeCallParticipants.delete(roomId);
        roomsWithActiveCalls.delete(roomId);
        console.log(`Call ended in room ${roomId} - no participants remaining`);
      } else {
        // Notify remaining participants about the updated count
        io.to(roomId).emit("callParticipantsCount", {
          roomId, 
          count: activeCallParticipants.get(roomId).size
        });
      }
    }
    
    // Notify others that this user left the call
    socket.to(roomId).emit("userLeftCall", {
      userId: socket.id,
      userName: socket.userName,
    });
    console.log(`${socket.userName} left the call in room: ${roomId}`);
  });
  
  // Handle explicit request for room call status (useful after refresh or reconnection)
  socket.on("checkRoomCallStatus", ({ roomId }) => {
    const hasActiveCall = roomsWithActiveCalls.has(roomId);
    let participantCount = 0;
    let participants = [];
    
    if (hasActiveCall && activeCallParticipants.has(roomId)) {
      participantCount = activeCallParticipants.get(roomId).size;
      
      // Get participant details
      activeCallParticipants.get(roomId).forEach(participantId => {
        if (participantId !== socket.id) {
          const user = getUserFromRoom(roomId, participantId);
          if (user) {
            participants.push({
              userId: participantId,
              userName: user.name
            });
          }
        }
      });
    }
    
    socket.emit("roomCallStatus", {
      roomId,
      hasActiveCall,
      participantCount,
      participants
    });
    
    console.log(`Sent room call status to ${socket.userName}: active=${hasActiveCall}, participants=${participantCount}`);
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

    // Clean up WebRTC call participants
    if (socket.currentRoom) {
      if (activeCallParticipants.has(socket.currentRoom)) {
        // Store user info before removing
        const isCallParticipant = activeCallParticipants.get(socket.currentRoom).has(socket.id);
        const userName = socket.userName || "A user";
        
        if (isCallParticipant) {
          // Don't immediately remove the user - give them a chance to reconnect
          // We'll set a timeout to remove them if they don't reconnect in 30 seconds
          setTimeout(() => {
            // After timeout, check if this socket is still disconnected (not replaced by a new one)
            if (activeCallParticipants.has(socket.currentRoom) && 
                activeCallParticipants.get(socket.currentRoom).has(socket.id)) {
                
              // Now remove them as they didn't reconnect in time
              activeCallParticipants.get(socket.currentRoom).delete(socket.id);
              
              // Notify others that this user left the call for good
              io.to(socket.currentRoom).emit("userLeftCall", {
                userId: socket.id,
                userName,
                reason: "timeout"
              });
              
              console.log(`${userName} removed from call in room ${socket.currentRoom} after reconnect timeout`);
              
              // If no participants left in call, clean up
              if (activeCallParticipants.get(socket.currentRoom).size === 0) {
                activeCallParticipants.delete(socket.currentRoom);
                roomsWithActiveCalls.delete(socket.currentRoom);
                console.log(`Call ended in room ${socket.currentRoom} - all participants disconnected`);
              }
            }
          }, 30000); // 30 second timeout
          
          // For immediate UI feedback, emit a temporary disconnect event
          socket.to(socket.currentRoom).emit("userTemporarilyDisconnected", {
            userId: socket.id,
            userName,
          });
          
          console.log(`${userName} temporarily disconnected from call in room ${socket.currentRoom}`);
        }
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

  // Handle raise hand
  socket.on('raiseHand', ({ roomId, timestamp }) => {
    const user = getUserFromRoom(roomId, socket.id);
    
    if (user) {
      // Broadcast to everyone else in the room
      socket.to(roomId).emit('userRaisedHand', {
        userId: socket.id,
        userName: user.name,
        timestamp
      });
    }
  });

  // Handle lower hand
  socket.on('lowerHand', ({ roomId }) => {
    const user = getUserFromRoom(roomId, socket.id);
    
    if (user) {
      // Broadcast to everyone else in the room
      socket.to(roomId).emit('userLoweredHand', {
        userId: socket.id,
        userName: user.name
      });
    }
  });

  // Video Meeting WebRTC Signaling Events (Meetly Implementation)
  socket.on("join-call", (path) => {
    const roomId = path;
    socket.join(roomId);
    
    // Store room info for this socket
    socket.currentVideoRoom = roomId;
    
    // Get all sockets in this room
    const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    
    // Notify existing users about new user
    socketsInRoom.forEach((socketId) => {
      if (socketId !== socket.id) {
        io.to(socketId).emit("user-joined", socket.id, socketsInRoom);
      }
    });
    
    // Send to new user list of existing users
    socket.emit("user-joined", socket.id, socketsInRoom);
    
    // Set up message handling for this room
    socket.on(
      "chat-message",
      (data, sender) => {
        // Broadcast to all users in the room
        socketsInRoom.forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      },
      (error) => {
        console.log("Error in chat message:", error);
      }
    );
  });

  socket.on("signal", (toId, message) => {
    io.to(toId).emit("signal", socket.id, message);
  });

  socket.on("chat-message", (data, sender) => {
    const roomId = socket.currentVideoRoom;
    if (roomId) {
      const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      socketsInRoom.forEach((elem) => {
        if (elem !== socket.id) {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        }
      });
    }
  });

  // Handle video call disconnection
  socket.on("disconnect", () => {
    const roomId = socket.currentVideoRoom;
    if (roomId) {
      const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      socketsInRoom.forEach((elem) => {
        io.to(elem).emit("user-left", socket.id);
      });
    }
  });
});

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Force drop files collection to ensure clean schema
    try {
      const collections = await mongoose.connection.db.listCollections({ name: 'files' }).toArray();
      if (collections.length > 0) {
        await mongoose.connection.db.dropCollection('files');
        console.log("✅ Dropped old files collection - fresh schema will be created");
      } else {
        console.log("ℹ️ Files collection doesn't exist yet - will be created on first save");
      }
    } catch (error) {
      console.error("⚠️ Error checking/dropping files collection:", error.message);
    }

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
