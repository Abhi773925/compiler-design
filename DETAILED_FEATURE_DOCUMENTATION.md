# PrepMate - Detailed Feature Documentation & Internal Working

## Complete Technical Deep-Dive into Each Feature

---

## Table of Contents
1. [Authentication System](#1-authentication-system)
2. [Real-Time Code Collaboration](#2-real-time-code-collaboration)
3. [Video Calling System](#3-video-calling-system)
4. [File Management System](#4-file-management-system)
5. [Code Execution Engine](#5-code-execution-engine)
6. [DSA Problem Solving Platform](#6-dsa-problem-solving-platform)
7. [Session Persistence](#7-session-persistence)
8. [Chat System](#8-chat-system)
9. [Collaborative Whiteboard](#9-collaborative-whiteboard)
10. [GitHub Integration](#10-github-integration)
11. [User Progress Tracking](#11-user-progress-tracking)
12. [Security Layer](#12-security-layer)

---

## 1. Authentication System

### Overview
JWT-based authentication with Google OAuth 2.0 integration providing 7-day persistent sessions.

### Technologies Used
- **Frontend:** `@react-oauth/google` v0.12.1, React Context API
- **Backend:** `google-auth-library` v9.4.1, `jsonwebtoken` v9.0.2
- **Security:** `bcryptjs` v2.4.3

### Internal Working Flow

#### Step 1: User Initiates Login
```javascript
// Frontend: AuthModal.jsx
<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
  <GoogleLogin
    onSuccess={handleGoogleLogin}
    onError={handleLoginError}
  />
</GoogleOAuthProvider>
```

#### Step 2: Token Exchange
```javascript
// Frontend sends Google credential to backend
const response = await fetch('/api/auth/google', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: credentialResponse.credential })
});
```

#### Step 3: Backend Verification
```javascript
// Backend: routes/auth.js
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google token
const ticket = await client.verifyIdToken({
  idToken: token,
  audience: process.env.GOOGLE_CLIENT_ID,
});

const payload = ticket.getPayload();
const { sub: googleId, email, name, picture } = payload;
```

#### Step 4: User Creation/Retrieval
```javascript
// Check if user exists in MongoDB
let user = await User.findOne({ googleId });

if (!user) {
  // Create new user
  user = new User({
    googleId,
    email,
    name,
    picture,
    role: 'user',
    preferences: {
      theme: 'dark',
      language: 'javascript'
    }
  });
  await user.save();
}
```

#### Step 5: JWT Generation
```javascript
// Generate JWT with 7-day expiration
const jwtToken = jwt.sign(
  {
    userId: user._id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000)
  },
  process.env.JWT_SECRET,
  {
    expiresIn: '7d',
    issuer: 'prepmate-api',
    audience: 'prepmate-client'
  }
);
```

#### Step 6: Frontend Storage
```javascript
// AuthContext.jsx - Store token and user data
localStorage.setItem('token', jwtToken);
localStorage.setItem('user', JSON.stringify(userData));
setUser(userData);
```

### Authentication Middleware
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No authentication token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

### Token Refresh Mechanism
```javascript
// AuthContext.jsx
const refreshToken = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return true;
  }
  
  return false;
};
```

### Session Persistence Check
```javascript
// On page load, verify token validity
useEffect(() => {
  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUser(data.user);
      } else {
        // Token expired, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  };
  
  checkAuthStatus();
}, []);
```

### Database Schema
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  picture: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    language: { type: String, default: 'javascript' }
  },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  problemsSolved: [{
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    solvedAt: { type: Date, default: Date.now },
    solution: String,
    language: String
  }],
  stats: {
    totalProblems: { type: Number, default: 0 },
    easyProblems: { type: Number, default: 0 },
    mediumProblems: { type: Number, default: 0 },
    hardProblems: { type: Number, default: 0 }
  }
}, { timestamps: true });
```

---

## 2. Real-Time Code Collaboration

### Overview
Bidirectional real-time code synchronization using Socket.IO with Monaco Editor integration.

### Technologies Used
- **Frontend:** Monaco Editor (@monaco-editor/react v4.7.0), Socket.IO Client v4.8.1
- **Backend:** Socket.IO v4.7.4, Express.js v4.18.2
- **Database:** MongoDB with Mongoose v8.0.3

### Internal Working Flow

#### Step 1: Room Creation & Joining

##### Frontend: Create/Join Room
```javascript
// CollaborationPage.jsx
const createRoom = async () => {
  const roomId = generateRoomId(); // 8-character unique ID
  
  // Create session in database
  const response = await fetch('/api/sessions/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      roomId,
      creatorName: user.name,
      creatorUserId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })
  });
  
  navigate(`/compiler?room=${roomId}`);
};
```

##### Backend: Session Creation
```javascript
// routes/sessions.js
router.post('/create', auth, async (req, res) => {
  const { roomId, creatorName, creatorUserId, expiresAt } = req.body;
  
  const session = new Session({
    roomId,
    creatorName,
    creatorUserId,
    participants: [{
      userId: creatorUserId,
      name: creatorName,
      joinedAt: new Date(),
      lastSeen: new Date()
    }],
    code: '// Start coding here...\n',
    language: 'javascript',
    messages: [],
    files: [],
    whiteboardElements: [],
    expiresAt
  });
  
  await session.save();
  res.json({ success: true, session });
});
```

#### Step 2: Socket.IO Connection Establishment

##### Frontend: Socket Initialization
```javascript
// Compiler.jsx
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 
                  'https://compiler-design.onrender.com';

const socketRef = useRef(null);

useEffect(() => {
  socketRef.current = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });
  
  // Join room
  socketRef.current.emit('joinRoom', {
    roomId,
    userName,
    userId: user?.id || 'anonymous'
  });
  
  return () => {
    socketRef.current.disconnect();
  };
}, [roomId, userName]);
```

##### Backend: Room Join Handler
```javascript
// backend/index.js
const roomUsers = new Map(); // roomId -> Map(socketId -> userInfo)

io.on('connection', (socket) => {
  socket.on('joinRoom', async ({ roomId, userName, userId }) => {
    socket.join(roomId);
    socket.userName = userName;
    socket.userId = userId;
    socket.currentRoom = roomId;
    
    // Add user to room users list
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Map());
    }
    
    roomUsers.get(roomId).set(socket.id, {
      id: socket.id,
      name: userName,
      userId: userId,
      joinedAt: new Date().toISOString()
    });
    
    // Load session from database
    const session = await Session.findOne({ roomId });
    if (session) {
      // Add participant
      const existingParticipant = session.participants.find(
        p => p.userId === userId
      );
      
      if (!existingParticipant) {
        session.participants.push({
          userId,
          name: userName,
          joinedAt: new Date(),
          lastSeen: new Date()
        });
      } else {
        existingParticipant.lastSeen = new Date();
      }
      
      session.lastActivity = new Date();
      await session.save();
    }
    
    // Send updated user list to all users in room
    const usersInRoom = Array.from(roomUsers.get(roomId).values());
    io.to(roomId).emit('roomUsers', usersInRoom);
    
    // Notify others about new user
    socket.to(roomId).emit('userJoined', {
      userId: socket.id,
      userName,
      message: `${userName} joined the room`
    });
  });
});
```

#### Step 3: Monaco Editor Setup

##### Frontend: Editor Initialization
```javascript
// Compiler.jsx
import Editor from '@monaco-editor/react';

const editorRef = useRef(null);
const monacoRef = useRef(null);
const isRemoteChange = useRef(false);

const handleEditorDidMount = (editor, monaco) => {
  editorRef.current = editor;
  monacoRef.current = monaco;
  
  // Listen for content changes
  editor.onDidChangeModelContent((event) => {
    // Ignore if this is a remote change to prevent echo
    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }
    
    const currentCode = editor.getValue();
    setCode(currentCode);
    
    // Broadcast code change to other users
    if (socketRef.current) {
      socketRef.current.emit('codeChange', {
        roomId,
        code: currentCode,
        language
      });
    }
  });
  
  setEditorReady(true);
};

<Editor
  height="100%"
  language={language}
  theme={theme}
  value={code}
  onMount={handleEditorDidMount}
  options={{
    fontSize: 14,
    minimap: { enabled: true },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    tabSize: 2
  }}
/>
```

#### Step 4: Code Change Broadcasting

##### Frontend: Send Code Updates
```javascript
// When user types in editor
editor.onDidChangeModelContent(() => {
  if (isRemoteChange.current) return;
  
  const currentCode = editor.getValue();
  
  // Emit to Socket.IO server
  socketRef.current.emit('codeChange', {
    roomId,
    code: currentCode,
    language
  });
});
```

##### Backend: Broadcast Code Changes
```javascript
// backend/index.js
socket.on('codeChange', async ({ roomId, code, language }) => {
  // Broadcast to all users in room EXCEPT sender
  socket.to(roomId).emit('codeUpdate', {
    code,
    language,
    userId: socket.id,
    userName: socket.userName,
    timestamp: new Date().toISOString()
  });
  
  // Save to database
  await Session.findOneAndUpdate(
    { roomId },
    {
      code,
      language: language || undefined,
      lastActivity: new Date()
    },
    { new: true }
  );
});
```

##### Frontend: Receive Code Updates
```javascript
// Compiler.jsx
useEffect(() => {
  socketRef.current.on('codeUpdate', ({ code, language }) => {
    // Set flag to prevent echo
    isRemoteChange.current = true;
    
    // Update Monaco editor
    if (monacoRef.current && editorRef.current) {
      editorRef.current.setValue(code);
    }
    
    // Update local state
    setCode(code);
    if (language) {
      setLanguage(language);
    }
  });
  
  return () => {
    socketRef.current.off('codeUpdate');
  };
}, []);
```

#### Step 5: Language Synchronization

##### Frontend: Language Change
```javascript
const handleLanguageChange = (newLanguage) => {
  setLanguage(newLanguage);
  
  // Broadcast to other users
  socketRef.current.emit('languageChange', {
    roomId,
    language: newLanguage
  });
};
```

##### Backend: Language Update Handler
```javascript
socket.on('languageChange', async ({ roomId, language }) => {
  socket.to(roomId).emit('languageUpdate', {
    language,
    userId: socket.id,
    userName: socket.userName
  });
  
  // Update database
  await Session.findOneAndUpdate(
    { roomId },
    { language, lastActivity: new Date() },
    { new: true }
  );
});
```

#### Step 6: Auto-Save Mechanism

##### Frontend: Debounced Auto-Save
```javascript
// Compiler.jsx
useEffect(() => {
  // Auto-save code after 2 seconds of inactivity
  const saveTimer = setTimeout(async () => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    
    await fetch(`${BACKEND_URL}/api/sessions/${roomId}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        code,
        language,
        lastActivity: new Date()
      })
    });
    
    setSaveStatus('saved');
  }, 2000);
  
  setSaveStatus('saving');
  
  return () => clearTimeout(saveTimer);
}, [code, language, roomId]);
```

#### Step 7: Session State Restoration

##### Frontend: Restore on Rejoin
```javascript
// Compiler.jsx
const restoreSession = async () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const response = await fetch(`${BACKEND_URL}/api/sessions/${roomId}`);
  const data = await response.json();
  
  if (data.success && data.session) {
    const session = data.session;
    
    // Restore code
    if (session.code && monacoRef.current) {
      isRemoteChange.current = true;
      monacoRef.current.setValue(session.code);
      setCode(session.code);
    }
    
    // Restore language
    if (session.language) {
      setLanguage(session.language);
    }
    
    // Restore chat messages
    if (session.messages && session.messages.length > 0) {
      const formattedMessages = session.messages.map((msg, index) => ({
        id: index,
        userId: msg.userId,
        userName: msg.userName,
        message: msg.message,
        timestamp: msg.timestamp
      }));
      setMessages(formattedMessages);
    }
  }
};

useEffect(() => {
  if (editorReady && roomId) {
    restoreSession();
  }
}, [editorReady, roomId]);
```

### Data Flow Diagram
```
User Types → Monaco Editor → onDidChangeModelContent Event
                                        ↓
                            Check isRemoteChange (prevent echo)
                                        ↓
                            Emit 'codeChange' via Socket.IO
                                        ↓
                            Backend receives event
                                        ↓
                    Broadcast to room (except sender)
                                        ↓
                            Save to MongoDB Session
                                        ↓
                Other users receive 'codeUpdate'
                                        ↓
                    Set isRemoteChange = true
                                        ↓
                    Update Monaco Editor
                                        ↓
                Update complete, reset flag
```

### Conflict Resolution Strategy
```javascript
// Version-based conflict resolution
const updateFileContent = (fileId, content, source = 'local') => {
  const timestamp = Date.now();
  
  setFiles(prev => {
    const currentFile = prev[fileId];
    const newVersion = (currentFile?.version || 0) + 1;
    
    const updatedFile = {
      ...currentFile,
      content,
      lastModified: timestamp,
      version: newVersion,
      syncStatus: source === 'local' ? 'pending' : 'synced'
    };
    
    fileVersionsRef.current[fileId] = newVersion;
    
    return {
      ...prev,
      [fileId]: updatedFile
    };
  });
};
```

---

## 3. Video Calling System

### Overview
WebRTC-based peer-to-peer video calling with STUN servers for NAT traversal.

### Technologies Used
- **WebRTC API:** getUserMedia, RTCPeerConnection, RTCDataChannel
- **Signaling:** Socket.IO v4.8.1
- **STUN Servers:** Google STUN servers
- **Frontend:** React Hooks, useRef, useState

### Internal Working Flow

#### Step 1: Media Stream Initialization

##### Get User Media
```javascript
// VideoCall.jsx
const initializeMedia = async () => {
  try {
    const constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setLocalStream(stream);
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    
    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
};
```

#### Step 2: WebRTC Configuration

##### ICE Servers Setup
```javascript
const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' }
];

const rtcConfiguration = {
  iceServers,
  iceCandidatePoolSize: 10
};
```

#### Step 3: Peer Connection Creation

##### Create RTCPeerConnection
```javascript
const createPeerConnection = (userId) => {
  const peerConnection = new RTCPeerConnection(rtcConfiguration);
  
  // Add local stream tracks to peer connection
  if (localStream) {
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });
  }
  
  // Handle incoming remote stream
  peerConnection.ontrack = (event) => {
    const [remoteStream] = event.streams;
    
    setRemoteStreams(prev => {
      const newStreams = new Map(prev);
      newStreams.set(userId, remoteStream);
      return newStreams;
    });
  };
  
  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', {
        candidate: event.candidate,
        to: userId,
        roomId
      });
    }
  };
  
  // Monitor connection state
  peerConnection.onconnectionstatechange = () => {
    console.log('Connection state:', peerConnection.connectionState);
    
    if (peerConnection.connectionState === 'failed') {
      // Attempt to reconnect
      peerConnection.restartIce();
    }
  };
  
  setPeerConnections(prev => {
    const newConnections = new Map(prev);
    newConnections.set(userId, peerConnection);
    return newConnections;
  });
  
  return peerConnection;
};
```

#### Step 4: Call Initiation & Signaling

##### Start Call
```javascript
const startCall = async () => {
  // Initialize media first
  const stream = await initializeMedia();
  
  // Notify server that user is ready for call
  socket.emit('userReadyForCall', {
    roomId,
    isReconnecting: false
  });
  
  setIsCallActive(true);
};
```

##### Backend: Track Call Participants
```javascript
// backend/index.js
const roomsWithActiveCalls = new Set();
const activeCallParticipants = new Map(); // roomId -> Set of socketIds

socket.on('userReadyForCall', ({ roomId, isReconnecting }) => {
  // Mark room as having active call
  roomsWithActiveCalls.add(roomId);
  
  // Track participant
  if (!activeCallParticipants.has(roomId)) {
    activeCallParticipants.set(roomId, new Set());
  }
  activeCallParticipants.get(roomId).add(socket.id);
  
  // Get existing participants
  const existingParticipants = [];
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
  
  // Send list to new user
  if (existingParticipants.length > 0) {
    socket.emit('existingCallParticipants', {
      participants: existingParticipants,
      isReconnect: !!isReconnecting
    });
  }
  
  // Notify others
  socket.to(roomId).emit('userReadyForCall', {
    userId: socket.id,
    userName: socket.userName,
    isReconnect: !!isReconnecting
  });
});
```

#### Step 5: WebRTC Offer/Answer Exchange

##### Frontend: Create and Send Offer
```javascript
// When another user joins call
socket.on('userReadyForCall', async ({ userId, userName }) => {
  const peerConnection = createPeerConnection(userId);
  
  // Create offer
  const offer = await peerConnection.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  });
  
  await peerConnection.setLocalDescription(offer);
  
  // Send offer via signaling server
  socket.emit('webrtc-offer', {
    offer,
    to: userId,
    roomId
  });
});
```

##### Backend: Forward Offer
```javascript
socket.on('webrtc-offer', ({ offer, to, roomId }) => {
  io.to(to).emit('webrtc-offer', {
    offer,
    from: socket.id,
    userName: socket.userName,
    roomId
  });
});
```

##### Frontend: Receive Offer and Send Answer
```javascript
socket.on('webrtc-offer', async ({ offer, from, userName }) => {
  const peerConnection = createPeerConnection(from);
  
  // Set remote description
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(offer)
  );
  
  // Create answer
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  
  // Send answer
  socket.emit('webrtc-answer', {
    answer,
    to: from,
    roomId
  });
});
```

##### Backend: Forward Answer
```javascript
socket.on('webrtc-answer', ({ answer, to, roomId }) => {
  io.to(to).emit('webrtc-answer', {
    answer,
    from: socket.id,
    userName: socket.userName,
    roomId
  });
});
```

##### Frontend: Receive Answer
```javascript
socket.on('webrtc-answer', async ({ answer, from }) => {
  const peerConnection = peerConnections.get(from);
  
  if (peerConnection) {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }
});
```

#### Step 6: ICE Candidate Exchange

##### Frontend: Send ICE Candidate
```javascript
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.emit('ice-candidate', {
      candidate: event.candidate,
      to: userId,
      roomId
    });
  }
};
```

##### Backend: Forward ICE Candidate
```javascript
socket.on('ice-candidate', ({ candidate, to, roomId }) => {
  io.to(to).emit('ice-candidate', {
    candidate,
    from: socket.id,
    userName: socket.userName,
    roomId
  });
});
```

##### Frontend: Add ICE Candidate
```javascript
socket.on('ice-candidate', async ({ candidate, from }) => {
  const peerConnection = peerConnections.get(from);
  
  if (peerConnection && candidate) {
    try {
      await peerConnection.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }
});
```

#### Step 7: Audio/Video Controls

##### Toggle Video
```javascript
const toggleVideo = () => {
  if (localStream) {
    const videoTrack = localStream.getVideoTracks()[0];
    
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
      
      // Notify other users
      socket.emit('video-toggle', {
        roomId,
        isEnabled: videoTrack.enabled
      });
    }
  }
};
```

##### Toggle Audio
```javascript
const toggleAudio = () => {
  if (localStream) {
    const audioTrack = localStream.getAudioTracks()[0];
    
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
      
      // Notify other users
      socket.emit('audio-toggle', {
        roomId,
        isEnabled: audioTrack.enabled
      });
    }
  }
};
```

#### Step 8: Screen Sharing

##### Start Screen Share
```javascript
const startScreenShare = async () => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always',
        displaySurface: 'monitor'
      },
      audio: false
    });
    
    setScreenStream(screenStream);
    setIsScreenSharing(true);
    
    // Replace video track in all peer connections
    peerConnections.forEach(peerConnection => {
      const sender = peerConnection.getSenders().find(
        s => s.track?.kind === 'video'
      );
      
      if (sender) {
        sender.replaceTrack(screenStream.getVideoTracks()[0]);
      }
    });
    
    // Handle stop sharing via browser button
    screenStream.getVideoTracks()[0].onended = () => {
      stopScreenShare();
    };
    
    // Notify others
    socket.emit('screenShareStarted', { roomId });
  } catch (error) {
    console.error('Screen share error:', error);
  }
};
```

##### Stop Screen Share
```javascript
const stopScreenShare = () => {
  if (screenStream) {
    screenStream.getTracks().forEach(track => track.stop());
    setScreenStream(null);
    setIsScreenSharing(false);
    
    // Restore camera video
    if (localStream) {
      peerConnections.forEach(peerConnection => {
        const sender = peerConnection.getSenders().find(
          s => s.track?.kind === 'video'
        );
        
        if (sender) {
          sender.replaceTrack(localStream.getVideoTracks()[0]);
        }
      });
    }
    
    socket.emit('screenShareStopped', { roomId });
  }
};
```

#### Step 9: Leave Call

##### End Call
```javascript
const endCall = () => {
  // Stop local media streams
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    setLocalStream(null);
  }
  
  if (screenStream) {
    screenStream.getTracks().forEach(track => track.stop());
    setScreenStream(null);
  }
  
  // Close all peer connections
  peerConnections.forEach(peerConnection => {
    peerConnection.close();
  });
  setPeerConnections(new Map());
  
  // Clear remote streams
  setRemoteStreams(new Map());
  
  // Notify server
  socket.emit('userLeftCall', { roomId });
  
  setIsCallActive(false);
};
```

##### Backend: Handle User Left Call
```javascript
socket.on('userLeftCall', ({ roomId }) => {
  // Remove from participants
  if (activeCallParticipants.has(roomId)) {
    activeCallParticipants.get(roomId).delete(socket.id);
    
    // If no participants left
    if (activeCallParticipants.get(roomId).size === 0) {
      activeCallParticipants.delete(roomId);
      roomsWithActiveCalls.delete(roomId);
    }
  }
  
  // Notify others
  socket.to(roomId).emit('userLeftCall', {
    userId: socket.id,
    userName: socket.userName
  });
});
```

### WebRTC Connection Flow
```
User A                    Signaling Server              User B
  |                              |                          |
  |--- userReadyForCall -------->|                          |
  |                              |--- userReadyForCall ---->|
  |                              |                          |
  |--- createOffer() ----------->|                          |
  |--- webrtc-offer ------------>|--- webrtc-offer -------->|
  |                              |                          |
  |                              |<-- createAnswer() -------|
  |<-- webrtc-answer ------------|<-- webrtc-answer --------|
  |                              |                          |
  |--- ICE candidates ---------->|--- ICE candidates ------>|
  |<-- ICE candidates -----------|<-- ICE candidates -------|
  |                              |                          |
  |<====== Peer-to-Peer Media Connection Established ======>|
```

---

## 4. File Management System

### Overview
Multi-file support with real-time synchronization, version tracking, and conflict resolution.

### Technologies Used
- **Frontend:** React useState/useRef, LocalStorage, SessionStorage
- **Backend:** MongoDB GridFS (optional), Socket.IO
- **File Types:** Text files, binary files (base64 encoded)

### Internal Working Flow

#### Step 1: File Upload

##### Frontend: Upload File
```javascript
// FilesTab.jsx
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  
  reader.onload = async (e) => {
    const content = e.target.result;
    const fileId = generateFileId();
    
    // Detect MIME type
    const mime = file.type || 'text/plain';
    
    // Create file object
    const fileData = {
      fileId,
      name: file.name,
      content,
      mime,
      size: file.size,
      uploadedBy: userId,
      uploaderName: userName,
      source: 'local-upload',
      metadata: {
        uploadDate: new Date().toISOString(),
        type: file.type
      }
    };
    
    // Emit to Socket.IO server
    socket.emit('uploadFile', {
      roomId,
      ...fileData
    });
    
    // Store locally
    setFiles(prev => ({
      ...prev,
      [fileId]: fileData
    }));
  };
  
  // Read file based on type
  if (mime.startsWith('text/')) {
    reader.readAsText(file);
  } else {
    reader.readAsDataURL(file); // Base64 for binary files
  }
};
```

##### Backend: Handle File Upload
```javascript
// backend/index.js
socket.on('uploadFile', async ({
  roomId, fileId, name, mime, size, 
  content, uploadedBy, uploaderName, 
  source, metadata
}) => {
  // Store in memory
  if (!roomFiles.has(roomId)) {
    roomFiles.set(roomId, new Map());
  }
  if (!roomFileMeta.has(roomId)) {
    roomFileMeta.set(roomId, new Map());
  }
  
  const timestamp = new Date().toISOString();
  
  roomFiles.get(roomId).set(fileId, {
    name: name || fileId,
    content: content || '',
    updatedAt: timestamp
  });
  
  roomFileMeta.get(roomId).set(fileId, {
    name,
    mime,
    size,
    uploadedBy,
    uploaderName,
    source,
    metadata
  });
  
  // Broadcast to all users
  io.to(roomId).emit('fileUploaded', {
    fileId,
    name,
    mime,
    size,
    uploadedBy,
    uploaderName,
    source
  });
  
  // Send file content
  io.to(roomId).emit('fileContentSnapshot', {
    fileId,
    name,
    content
  });
  
  // Save to database
  const session = await Session.findOne({ roomId });
  if (session) {
    const fileEntry = {
      fileId,
      name,
      content,
      mime,
      size,
      uploadedBy,
      uploaderName,
      uploadedAt: new Date(),
      source,
      metadata
    };
    
    const fileIndex = session.files?.findIndex(f => f.fileId === fileId);
    
    if (fileIndex !== -1) {
      session.files[fileIndex] = fileEntry;
    } else {
      if (!session.files) session.files = [];
      session.files.push(fileEntry);
    }
    
    session.lastActivity = new Date();
    await session.save();
  }
});
```

#### Step 2: File Content Synchronization

##### Frontend: Edit File Content
```javascript
const updateFileContent = (fileId, content, source = 'local') => {
  const timestamp = Date.now();
  
  setFiles(prev => {
    const currentFile = prev[fileId];
    const newVersion = (currentFile?.version || 0) + 1;
    
    const updatedFile = {
      ...currentFile,
      content,
      lastModified: timestamp,
      version: newVersion,
      syncStatus: source === 'local' ? 'pending' : 'synced',
      pendingChanges: source === 'local'
    };
    
    fileVersionsRef.current[fileId] = newVersion;
    
    return {
      ...prev,
      [fileId]: updatedFile
    };
  });
  
  // Broadcast changes
  if (source === 'local' && fileId === activeFileId) {
    socket.emit('changeFile', {
      roomId,
      fileId,
      content
    });
  }
};
```

##### Backend: Broadcast File Changes
```javascript
socket.on('changeFile', ({ roomId, fileId, content }) => {
  if (!roomFiles.has(roomId)) {
    roomFiles.set(roomId, new Map());
  }
  
  const files = roomFiles.get(roomId);
  const name = files.get(fileId)?.name || fileId;
  
  files.set(fileId, {
    name,
    content,
    updatedAt: new Date().toISOString()
  });
  
  // Broadcast to other users
  socket.to(roomId).emit('fileContentUpdate', {
    fileId,
    content,
    userId: socket.id,
    userName: socket.userName
  });
});
```

##### Frontend: Receive File Updates
```javascript
useEffect(() => {
  socket.on('fileContentUpdate', ({ fileId, content, userId, userName }) => {
    // Update file content from remote user
    updateFileContent(fileId, content, 'remote');
    
    // If this is the active file, update editor
    if (fileId === activeFileId && editorRef.current) {
      isRemoteChange.current = true;
      editorRef.current.setValue(content);
    }
  });
  
  return () => {
    socket.off('fileContentUpdate');
  };
}, [activeFileId]);
```

#### Step 3: Active File Switching

##### Frontend: Switch Active File
```javascript
const switchFile = (fileId) => {
  // Save current file state
  if (activeFileId && editorRef.current) {
    const currentContent = editorRef.current.getValue();
    updateFileContent(activeFileId, currentContent, 'local');
  }
  
  // Switch to new file
  setActiveFileId(fileId);
  
  // Load new file content
  const file = files[fileId];
  if (file && editorRef.current) {
    isRemoteChange.current = true;
    editorRef.current.setValue(file.content || '');
  }
  
  // Notify others
  socket.emit('setActiveFile', {
    roomId,
    fileId
  });
};
```

##### Backend: Broadcast Active File Change
```javascript
socket.on('setActiveFile', ({ roomId, fileId }) => {
  roomActiveFile.set(roomId, fileId);
  io.to(roomId).emit('activeFileChanged', { fileId });
});
```

#### Step 4: File Sync with Retry Logic

##### Frontend: Sync with Retry
```javascript
const syncFile = async (fileId) => {
  const pendingChange = pendingChangesRef.current[fileId];
  if (!pendingChange) return;
  
  try {
    // Save to database
    if (isUserLoggedIn()) {
      await saveFileToDatabase({
        name: files[fileId]?.name || fileId,
        content: pendingChange.content,
        metadata: {
          version: fileVersionsRef.current[fileId],
          lastModified: pendingChange.timestamp
        }
      });
    }
    
    // Save to session
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    await fetch(`${BACKEND_URL}/api/sessions/${roomId}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileId,
        name: files[fileId]?.name || fileId,
        content: pendingChange.content,
        version: fileVersionsRef.current[fileId],
        timestamp: pendingChange.timestamp
      })
    });
    
    // Mark as synced
    setFiles(prev => ({
      ...prev,
      [fileId]: {
        ...prev[fileId],
        syncStatus: 'synced',
        pendingChanges: false
      }
    }));
    
    delete pendingChangesRef.current[fileId];
  } catch (error) {
    console.error('Sync error:', error);
    
    // Retry logic
    if (pendingChange.attempts < 3) {
      pendingChange.attempts++;
      setTimeout(
        () => syncFile(fileId),
        2000 * pendingChange.attempts
      );
    } else {
      setFiles(prev => ({
        ...prev,
        [fileId]: {
          ...prev[fileId],
          syncStatus: 'error'
        }
      }));
    }
  }
};
```

#### Step 5: GitHub File Import

##### Frontend: Import from GitHub
```javascript
const importFromGitHub = async (repoUrl, filePath) => {
  // Fetch file content from GitHub API
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    }
  );
  
  const content = await response.text();
  const fileId = generateFileId();
  
  // Upload to room
  socket.emit('uploadFile', {
    roomId,
    fileId,
    name: path.basename(filePath),
    content,
    mime: 'text/plain',
    size: content.length,
    uploadedBy: userId,
    uploaderName: userName,
    source: 'github',
    metadata: {
      githubUrl: repoUrl,
      originalPath: filePath,
      importDate: new Date().toISOString()
    }
  });
};
```

### File Schema in MongoDB
```javascript
// models/File.js
const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  source: {
    type: String,
    enum: ['github', 'editor', 'local-upload', 'custom'],
    default: 'editor'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  lastAccessed: { type: Date, default: Date.now }
}, { timestamps: true });

fileSchema.index({ userId: 1, createdAt: -1 });
fileSchema.index({ userId: 1, name: 1 });
```

---

## 5. Code Execution Engine

### Overview
Remote code execution using Piston API with support for multiple programming languages.

### Technologies Used
- **Piston API:** emkc.org/api/v2/piston
- **Axios:** HTTP client for API requests
- **Languages:** JavaScript, Python, Java, C++, C, TypeScript, Go, Rust

### Internal Working Flow

#### Step 1: Language Configuration

##### Piston API Service
```javascript
// backend/services/pistonAPI.js
class PistonAPI {
  constructor() {
    this.baseURL = 'https://emkc.org/api/v2/piston';
  }
  
  getLanguageConfig(language) {
    const configs = {
      javascript: { language: 'javascript', version: '18.15.0' },
      java: { language: 'java', version: '15.0.2' },
      cpp: { language: 'cpp', version: '10.2.0' },
      c: { language: 'c', version: '10.2.0' },
      python: { language: 'python', version: '3.10.0' }
    };
    return configs[language] || configs['javascript'];
  }
  
  getFileName(language) {
    const extensions = {
      javascript: 'main.js',
      java: 'Main.java',
      cpp: 'main.cpp',
      c: 'main.c',
      python: 'main.py'
    };
    return extensions[language] || 'main.txt';
  }
}
```

#### Step 2: Code Execution Request

##### Frontend: Run Code
```javascript
// Compiler.jsx
const runCode = async () => {
  setIsRunning(true);
  setOutput('Running code...');
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        language,
        code,
        input: customInput
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      setOutput(result.output);
    } else {
      setOutput(`Error: ${result.error}`);
    }
  } catch (error) {
    setOutput(`Execution failed: ${error.message}`);
  } finally {
    setIsRunning(false);
    setShowOutput(true);
  }
};
```

#### Step 3: Backend Execution Handler

##### Execute Code via Piston API
```javascript
// backend/services/pistonAPI.js
async executeCode(language, version, code, input = '') {
  try {
    const payload = {
      language: language,
      version: version,
      files: [{
        name: this.getFileName(language),
        content: code
      }],
      stdin: input,
      args: [],
      compile_timeout: 10000,  // 10 seconds
      run_timeout: 3000,       // 3 seconds
      compile_memory_limit: -1,
      run_memory_limit: -1
    };
    
    const response = await axios.post(
      `${this.baseURL}/execute`,
      payload
    );
    
    return response.data;
  } catch (error) {
    console.error('Error executing code:', error);
    throw error;
  }
}
```

#### Step 4: Result Processing

##### Process Execution Result
```javascript
// routes/problems.js (or execution route)
router.post('/execute', async (req, res) => {
  const { language, code, input } = req.body;
  
  try {
    const config = pistonAPI.getLanguageConfig(language);
    const result = await pistonAPI.executeCode(
      config.language,
      config.version,
      code,
      input
    );
    
    // Check compilation errors
    if (result.compile && result.compile.code !== 0) {
      return res.json({
        success: false,
        error: result.compile.stderr || 'Compilation error',
        stage: 'compilation'
      });
    }
    
    // Check runtime errors
    if (result.run.code !== 0) {
      return res.json({
        success: false,
        error: result.run.stderr || 'Runtime error',
        stage: 'runtime',
        output: result.run.stdout
      });
    }
    
    // Success
    res.json({
      success: true,
      output: result.run.stdout,
      executionTime: result.run.signal || 'N/A'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

#### Step 5: Test Case Execution

##### Run Single Test Case
```javascript
// backend/services/pistonAPI.js
async runTestCase(language, code, input, expectedOutput) {
  try {
    const config = this.getLanguageConfig(language);
    const result = await this.executeCode(
      config.language,
      config.version,
      code,
      input
    );
    
    // Compilation error
    if (result.compile && result.compile.code !== 0) {
      return {
        passed: false,
        input: input,
        expectedOutput: expectedOutput,
        actualOutput: result.compile.stderr || 'Compilation error',
        error: result.compile.stderr || 'Compilation failed'
      };
    }
    
    // Runtime error
    if (result.run.code !== 0) {
      return {
        passed: false,
        input: input,
        expectedOutput: expectedOutput,
        actualOutput: result.run.stderr || 'Runtime error',
        error: result.run.stderr || 'Runtime error'
      };
    }
    
    // Compare output
    const actualOutput = result.run.stdout.trim();
    const passed = actualOutput === expectedOutput.trim();
    
    return {
      passed: passed,
      input: input,
      expectedOutput: expectedOutput,
      actualOutput: actualOutput,
      executionTime: result.run.signal || 'N/A'
    };
  } catch (error) {
    return {
      passed: false,
      input: input,
      expectedOutput: expectedOutput,
      actualOutput: 'Execution error',
      error: error.message
    };
  }
}
```

##### Run All Test Cases
```javascript
async runAllTestCases(language, code, testCases) {
  const results = [];
  let passedTests = 0;
  
  for (const testCase of testCases) {
    const result = await this.runTestCase(
      language,
      code,
      testCase.input,
      testCase.expectedOutput
    );
    
    if (result.passed) {
      passedTests++;
    }
    
    results.push({
      ...result,
      isHidden: testCase.isHidden || false
    });
  }
  
  return {
    success: passedTests === testCases.length,
    passedTests: passedTests,
    totalTests: testCases.length,
    results: results
  };
}
```

#### Step 6: Submission Handling

##### Submit Problem Solution
```javascript
// routes/problems.js
router.post('/:slug/submit', auth, async (req, res) => {
  const { code, language } = req.body;
  const problem = await Problem.findOne({ slug: req.params.slug });
  
  if (!problem) {
    return res.status(404).json({ message: 'Problem not found' });
  }
  
  // Get all test cases (including hidden)
  const allTestCases = problem.testCases;
  
  // Execute code
  const executionResult = await pistonAPI.runAllTestCases(
    language,
    code,
    allTestCases
  );
  
  const success = executionResult.success;
  
  // Update problem stats
  problem.stats.totalSubmissions += 1;
  if (success) {
    problem.stats.acceptedSubmissions += 1;
    
    // Update user stats
    const user = await User.findById(req.user.userId);
    const alreadySolved = user.problemsSolved.some(
      solved => solved.problemId.toString() === problem._id.toString()
    );
    
    if (!alreadySolved) {
      user.problemsSolved.push({
        problemId: problem._id,
        solution: code,
        language: language,
        solvedAt: new Date()
      });
      
      user.stats.totalProblems += 1;
      
      if (problem.difficulty === 'Easy') {
        user.stats.easyProblems += 1;
      } else if (problem.difficulty === 'Medium') {
        user.stats.mediumProblems += 1;
      } else if (problem.difficulty === 'Hard') {
        user.stats.hardProblems += 1;
      }
      
      await user.save();
    }
  }
  
  await problem.save();
  
  // Hide output for hidden test cases
  const sanitizedResults = executionResult.results.map(result => ({
    ...result,
    actualOutput: result.isHidden
      ? (result.passed ? '✓' : '✗')
      : result.actualOutput,
    input: result.isHidden ? 'Hidden' : result.input
  }));
  
  res.json({
    success: success,
    passedTests: executionResult.passedTests,
    totalTests: executionResult.totalTests,
    results: sanitizedResults
  });
});
```

### Execution Flow Diagram
```
Frontend: User clicks "Run Code"
         ↓
Validate input & language
         ↓
Send POST /api/execute
         ↓
Backend: Receive request
         ↓
Get language config (version, runtime)
         ↓
Construct Piston API payload
         ↓
POST to Piston API
         ↓
Piston: Compile code (if needed)
         ↓
Piston: Execute code with input
         ↓
Piston: Return results
         ↓
Backend: Process results
         ↓
Check compilation errors
         ↓
Check runtime errors
         ↓
Extract output/error
         ↓
Return JSON response
         ↓
Frontend: Display results
```

---

## 6. DSA Problem Solving Platform

### Overview
LeetCode-style problem database with test cases, hints, and progress tracking.

### Technologies Used
- **Database:** MongoDB with Mongoose
- **Problem Set:** Blind 75 collection
- **Frontend:** React with pagination and filtering

### Internal Working Flow

#### Step 1: Problem Database Schema

##### Problem Model
```javascript
// models/Problem.js
const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: { type: String, required: true },
  tags: [String],
  
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  
  constraints: [String],
  
  testCases: [{
    input: String,
    expectedOutput: String,
    isHidden: { type: Boolean, default: false }
  }],
  
  starterCode: {
    javascript: String,
    python: String,
    java: String,
    cpp: String,
    c: String,
    typescript: String,
    go: String,
    rust: String
  },
  
  solution: {
    javascript: String,
    python: String,
    java: String,
    cpp: String,
    c: String,
    typescript: String,
    go: String,
    rust: String
  },
  
  hints: [String],
  relatedTopics: [String],
  companies: [String],
  
  stats: {
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 }
  },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
```

#### Step 2: Problem Seeding

##### Seed Problems to Database
```javascript
// backend/seedProblems.js
const problems = require('./data/leetcodeBlind75');
const Problem = require('./models/Problem');

const seedProblems = async () => {
  await mongoose.connect(MONGODB_URI);
  
  // Clear existing problems
  await Problem.deleteMany({});
  
  // Insert new problems
  for (const problemData of problems) {
    const problem = new Problem({
      title: problemData.title,
      slug: problemData.slug,
      description: problemData.description,
      difficulty: problemData.difficulty,
      category: problemData.category,
      tags: problemData.tags,
      examples: problemData.examples,
      constraints: problemData.constraints,
      testCases: problemData.testCases,
      starterCode: problemData.starterCode,
      solution: problemData.solution,
      hints: problemData.hints,
      relatedTopics: problemData.relatedTopics,
      companies: problemData.companies
    });
    
    await problem.save();
    console.log(`✓ Seeded: ${problem.title}`);
  }
  
  console.log('All problems seeded successfully!');
};
```

#### Step 3: Problem Listing with Filtering

##### Frontend: Fetch Problems
```javascript
// PracticePage.jsx
const [problems, setProblems] = useState([]);
const [filter, setFilter] = useState('All');
const [searchQuery, setSearchQuery] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10);

useEffect(() => {
  fetchProblems();
}, []);

const fetchProblems = async () => {
  const response = await fetch(
    'https://compiler-design.onrender.com/api/problems'
  );
  const data = await response.json();
  setProblems(data);
};

// Filter and search logic
const filteredProblems = problems.filter(problem => {
  const matchesDifficulty = filter === 'All' || 
                           problem.difficulty === filter;
  const matchesSearch = 
    problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    problem.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    problem.tags.some(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  return matchesDifficulty && matchesSearch;
});

// Pagination
const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentProblems = filteredProblems.slice(startIndex, endIndex);
```

##### Backend: Get Problems Endpoint
```javascript
// routes/problems.js
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find(
      {},
      {
        title: 1,
        slug: 1,
        difficulty: 1,
        category: 1,
        tags: 1,
        stats: 1,
        _id: 1
      }
    ).sort({ createdAt: -1 });
    
    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
```

#### Step 4: Problem Detail View

##### Frontend: Load Problem
```javascript
// ProblemSolver.jsx
const { slug } = useParams();
const [problem, setProblem] = useState(null);

useEffect(() => {
  fetchProblem();
}, [slug]);

const fetchProblem = async () => {
  const response = await fetch(
    `https://compiler-design.onrender.com/api/problems/${slug}`
  );
  const data = await response.json();
  setProblem(data);
  
  // Load starter code for selected language
  if (data.starterCode && data.starterCode[language]) {
    setCode(data.starterCode[language]);
  }
};
```

##### Backend: Get Problem by Slug
```javascript
router.get('/:slug', async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    
    // Return problem without hidden test cases
    const problemData = {
      ...problem.toObject(),
      testCases: problem.testCases.filter(tc => !tc.isHidden)
    };
    
    res.json(problemData);
  } catch (error) {
    console.error('Error fetching problem:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
```

#### Step 5: Solution Submission

##### Already covered in Code Execution section above

#### Step 6: Progress Tracking

##### Update User Stats
```javascript
// After successful submission
const user = await User.findById(req.user.userId);

const alreadySolved = user.problemsSolved.some(
  solved => solved.problemId.toString() === problem._id.toString()
);

if (!alreadySolved) {
  // Add to solved problems
  user.problemsSolved.push({
    problemId: problem._id,
    solution: code,
    language: language,
    solvedAt: new Date()
  });
  
  // Update stats
  user.stats.totalProblems += 1;
  
  switch (problem.difficulty) {
    case 'Easy':
      user.stats.easyProblems += 1;
      break;
    case 'Medium':
      user.stats.mediumProblems += 1;
      break;
    case 'Hard':
      user.stats.hardProblems += 1;
      break;
  }
  
  await user.save();
}
```

##### Display User Statistics
```javascript
// ProfilePage.jsx
const [stats, setStats] = useState({
  totalProblems: 0,
  easyProblems: 0,
  mediumProblems: 0,
  hardProblems: 0
});

useEffect(() => {
  if (user) {
    setStats(user.stats);
  }
}, [user]);

// Render stats
<div className="stats-grid">
  <StatCard
    title="Total Solved"
    value={stats.totalProblems}
    color="blue"
  />
  <StatCard
    title="Easy"
    value={stats.easyProblems}
    color="green"
  />
  <StatCard
    title="Medium"
    value={stats.mediumProblems}
    color="yellow"
  />
  <StatCard
    title="Hard"
    value={stats.hardProblems}
    color="red"
  />
</div>
```

---

## 7. Session Persistence

### Overview
7-day session storage with MongoDB TTL indexing and auto-cleanup.

### Technologies Used
- **MongoDB TTL Index:** Automatic document expiration
- **Node-Cron:** Scheduled cleanup jobs
- **LocalStorage:** Client-side state backup

### Internal Working Flow

#### Step 1: Session Schema with TTL

##### Session Model
```javascript
// models/Session.js
const sessionSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  creatorName: { type: String, required: true },
  creatorUserId: { type: String, default: null },
  
  participants: [{
    userId: String,
    name: String,
    joinedAt: Date,
    lastSeen: Date
  }],
  
  code: { type: String, default: '// Start coding here...\n' },
  language: { type: String, default: 'javascript' },
  
  messages: [{
    userId: String,
    userName: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  files: [{
    fileId: String,
    name: String,
    content: String,
    mime: String,
    size: Number,
    uploadedBy: String,
    uploaderName: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  whiteboardElements: { type: Array, default: [] },
  
  lastActivity: { type: Date, default: Date.now },
  
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// TTL Index - MongoDB automatically deletes expired documents
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Auto-update lastActivity
sessionSchema.pre('save', function(next) {
  if (this.isModified('code') || 
      this.isModified('language') ||
      this.isModified('participants') ||
      this.isModified('messages') ||
      this.isModified('whiteboardElements') ||
      this.isModified('files')) {
    this.lastActivity = new Date();
  }
  next();
});
```

#### Step 2: Session Creation

##### Frontend: Create Session
```javascript
// CollaborationPage.jsx
const createRoom = async () => {
  const roomId = generateRoomId();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
  
  const response = await fetch(
    `${BACKEND_URL}/api/sessions/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        roomId,
        creatorName: user.name,
        creatorUserId: user.id,
        expiresAt
      })
    }
  );
  
  const data = await response.json();
  
  if (data.success) {
    navigate(`/compiler?room=${roomId}`);
  }
};
```

##### Backend: Create Session Endpoint
```javascript
// routes/sessions.js
router.post('/create', auth, async (req, res) => {
  const { roomId, creatorName, creatorUserId, expiresAt } = req.body;
  
  try {
    // Check if session already exists
    const existingSession = await Session.findOne({ roomId });
    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'Room ID already exists'
      });
    }
    
    const session = new Session({
      roomId,
      creatorName,
      creatorUserId,
      participants: [{
        userId: creatorUserId,
        name: creatorName,
        joinedAt: new Date(),
        lastSeen: new Date()
      }],
      code: '// Start coding here...\n',
      language: 'javascript',
      messages: [],
      files: [],
      whiteboardElements: [],
      lastActivity: new Date(),
      expiresAt: expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    
    await session.save();
    
    res.json({
      success: true,
      session: {
        roomId: session.roomId,
        expiresAt: session.expiresAt
      }
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session'
    });
  }
});
```

#### Step 3: Session Auto-Save

##### Frontend: Debounced Auto-Save
```javascript
// Compiler.jsx
useEffect(() => {
  const saveTimer = setTimeout(async () => {
    if (!roomId) return;
    
    try {
      await fetch(`${BACKEND_URL}/api/sessions/${roomId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code,
          language,
          lastActivity: new Date()
        })
      });
      
      setSaveStatus('saved');
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaveStatus('error');
    }
  }, 2000); // 2-second delay
  
  setSaveStatus('saving');
  
  return () => clearTimeout(saveTimer);
}, [code, language, roomId]);
```

##### Backend: Update Session
```javascript
// routes/sessions.js
router.post('/:roomId/update', async (req, res) => {
  const { roomId } = req.params;
  const { code, language, lastActivity } = req.body;
  
  try {
    const session = await Session.findOneAndUpdate(
      { roomId },
      {
        $set: {
          code,
          language,
          lastActivity: lastActivity || new Date()
        }
      },
      { new: true }
    );
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update session'
    });
  }
});
```

#### Step 4: Session Restoration

##### Frontend: Restore Session
```javascript
// Compiler.jsx
const restoreSession = async () => {
  if (!roomId) return;
  
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/sessions/${roomId}`
    );
    const data = await response.json();
    
    if (data.success && data.session) {
      const session = data.session;
      
      // Restore code
      if (session.code && monacoRef.current) {
        isRemoteChange.current = true;
        monacoRef.current.setValue(session.code);
        setCode(session.code);
      }
      
      // Restore language
      if (session.language) {
        setLanguage(session.language);
      }
      
      // Restore messages
      if (session.messages && session.messages.length > 0) {
        const formattedMessages = session.messages.map((msg, index) => ({
          id: index,
          userId: msg.userId,
          userName: msg.userName,
          message: msg.message,
          timestamp: msg.timestamp
        }));
        setMessages(formattedMessages);
      }
      
      // Restore files
      if (session.files && session.files.length > 0) {
        const filesObj = {};
        session.files.forEach(file => {
          filesObj[file.fileId] = {
            name: file.name,
            content: file.content,
            mime: file.mime,
            size: file.size,
            uploadedBy: file.uploadedBy,
            uploaderName: file.uploaderName
          };
        });
        setFiles(filesObj);
      }
      
      // Restore whiteboard
      if (session.whiteboardElements && session.whiteboardElements.length > 0) {
        // Load into whiteboard component
        loadWhiteboardElements(session.whiteboardElements);
      }
      
      console.log('Session restored successfully');
    }
  } catch (error) {
    console.error('Failed to restore session:', error);
  }
};

useEffect(() => {
  if (editorReady && roomId) {
    restoreSession();
  }
}, [editorReady, roomId]);
```

##### Backend: Get Session
```javascript
// routes/sessions.js
router.get('/:roomId', async (req, res) => {
  const { roomId } = req.params;
  
  try {
    const session = await Session.findOne({ roomId });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or expired'
      });
    }
    
    // Check if session is expired
    if (new Date() > session.expiresAt) {
      await Session.deleteOne({ roomId });
      return res.status(410).json({
        success: false,
        message: 'Session has expired'
      });
    }
    
    res.json({
      success: true,
      session: {
        roomId: session.roomId,
        code: session.code,
        language: session.language,
        participants: session.participants,
        messages: session.messages,
        files: session.files,
        whiteboardElements: session.whiteboardElements,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        lastActivity: session.lastActivity
      }
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session'
    });
  }
});
```

#### Step 5: Recent Sessions

##### Frontend: Get User's Recent Sessions
```javascript
// RoomModal.jsx
const [recentSessions, setRecentSessions] = useState([]);

useEffect(() => {
  if (user?.id) {
    fetchRecentSessions();
  }
}, [user]);

const fetchRecentSessions = async () => {
  const response = await fetch(
    `${BACKEND_URL}/api/sessions/user/${user.id}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  const data = await response.json();
  
  if (data.success) {
    setRecentSessions(data.sessions);
  }
};

// Render recent sessions
{recentSessions.map(session => (
  <div
    key={session.roomId}
    onClick={() => joinRoom(session.roomId)}
    className="session-card"
  >
    <div className="room-id">{session.roomId}</div>
    <div className="participants-count">
      {session.participants.length} participants
    </div>
    <div className="created-at">
      {formatDate(session.createdAt)}
    </div>
    <div className="time-remaining">
      {calculateTimeRemaining(session.expiresAt)}
    </div>
  </div>
))}
```

##### Backend: Get User Sessions
```javascript
// routes/sessions.js
router.get('/user/:userId', auth, async (req, res) => {
  const { userId } = req.params;
  
  try {
    const sessions = await Session.find({
      'participants.userId': userId,
      expiresAt: { $gt: new Date() }
    })
    .select('roomId participants createdAt expiresAt lastActivity')
    .sort({ lastActivity: -1 })
    .limit(10);
    
    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions'
    });
  }
});
```

#### Step 6: Automatic Cleanup

##### Cron Job for Expired Sessions
```javascript
// backend/index.js
const cron = require('node-cron');

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const result = await Session.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    console.log(`Cleaned up ${result.deletedCount} expired sessions`);
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
  }
});

console.log('Session cleanup job scheduled (daily at midnight)');
```

---

## 8. Chat System

### Overview
Real-time messaging with message persistence and typing indicators.

### Technologies Used
- **Socket.IO:** Real-time messaging
- **MongoDB:** Message storage
- **React:** UI components

### Internal Working Flow

#### Step 1: Send Message

##### Frontend: Send Chat Message
```javascript
// Compiler.jsx
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState('');

const sendMessage = () => {
  if (!newMessage.trim()) return;
  
  const messageData = {
    id: Date.now(),
    message: newMessage,
    userId: socket.id,
    userName: userName,
    timestamp: new Date().toISOString()
  };
  
  // Add to local state immediately
  setMessages(prev => [...prev, messageData]);
  
  // Emit to server
  socket.emit('chatMessage', {
    roomId,
    message: newMessage
  });
  
  // Clear input
  setNewMessage('');
};
```

##### Backend: Broadcast Message
```javascript
// backend/index.js
socket.on('chatMessage', async ({ roomId, message }) => {
  const messageText = typeof message === 'string' ? message : message.message;
  
  const messageData = {
    id: Date.now(),
    message: messageText,
    userId: socket.id,
    userName: socket.userName,
    timestamp: new Date().toISOString()
  };
  
  // Broadcast to other users (not back to sender)
  socket.to(roomId).emit('newMessage', { message: messageData });
  
  // Save to database
  const session = await Session.findOne({ roomId });
  if (session) {
    session.messages.push({
      userId: socket.userId || socket.id,
      userName: socket.userName,
      message: messageText,
      timestamp: new Date()
    });
    
    session.lastActivity = new Date();
    await session.save();
  }
});
```

##### Frontend: Receive Message
```javascript
useEffect(() => {
  socket.on('newMessage', ({ message }) => {
    setMessages(prev => [...prev, message]);
    
    // Auto-scroll to bottom
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 
        chatContainerRef.current.scrollHeight;
    }
  });
  
  return () => {
    socket.off('newMessage');
  };
}, []);
```

#### Step 2: Typing Indicators

##### Frontend: Send Typing Status
```javascript
const handleTyping = () => {
  if (!isTyping) {
    setIsTyping(true);
    socket.emit('userTyping', { roomId });
    
    // Clear typing status after 3 seconds
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('userStoppedTyping', { roomId });
    }, 3000);
  }
};
```

##### Backend: Broadcast Typing Status
```javascript
socket.on('userTyping', ({ roomId }) => {
  socket.to(roomId).emit('userIsTyping', {
    userId: socket.id,
    userName: socket.userName
  });
});

socket.on('userStoppedTyping', ({ roomId }) => {
  socket.to(roomId).emit('userStoppedTyping', {
    userId: socket.id,
    userName: socket.userName
  });
});
```

##### Frontend: Display Typing Indicator
```javascript
const [typingUsers, setTypingUsers] = useState(new Set());

useEffect(() => {
  socket.on('userIsTyping', ({ userId, userName }) => {
    setTypingUsers(prev => new Set(prev).add(userId));
  });
  
  socket.on('userStoppedTyping', ({ userId }) => {
    setTypingUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  });
  
  return () => {
    socket.off('userIsTyping');
    socket.off('userStoppedTyping');
  };
}, []);

// Render typing indicator
{typingUsers.size > 0 && (
  <div className="typing-indicator">
    {typingUsers.size === 1 ? 'Someone is' : `${typingUsers.size} people are`} typing...
  </div>
)}
```

---

## 9. Collaborative Whiteboard

### Overview
Real-time collaborative drawing using Tldraw with state synchronization.

### Technologies Used
- **Tldraw:** v4.0.3 - Drawing canvas
- **Socket.IO:** Real-time sync
- **MongoDB:** Persistent storage

### Internal Working Flow

#### Step 1: Initialize Tldraw

##### Frontend: Tldraw Component
```javascript
// Compiler.jsx
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

const [tldrawEditor, setTldrawEditor] = useState(null);
const [showFullscreenWhiteboard, setShowFullscreenWhiteboard] = useState(false);

<Tldraw
  onMount={(editor) => {
    setTldrawEditor(editor);
    
    // Subscribe to store changes
    const unsubscribe = editor.store.listen((entry) => {
      handleStoreChange(entry);
    });
    
    tldrawUnsubRef.current = unsubscribe;
  }}
/>
```

#### Step 2: Sync Whiteboard Changes

##### Frontend: Handle Store Changes
```javascript
const handleStoreChange = (entry) => {
  if (isApplyingRemoteRef.current) return;
  
  // Get current snapshot
  const snapshot = tldrawEditor.store.getSnapshot();
  
  // Debounce broadcast
  clearTimeout(whiteboardSyncTimeoutRef.current);
  whiteboardSyncTimeoutRef.current = setTimeout(() => {
    socket.emit('whiteboardChange', {
      roomId,
      snapshot
    });
  }, 500);
};
```

##### Backend: Broadcast Whiteboard Changes
```javascript
socket.on('whiteboardChange', async ({ roomId, snapshot }) => {
  // Broadcast to other users
  socket.to(roomId).emit('whiteboardUpdate', { snapshot });
  
  // Save to database
  const session = await Session.findOne({ roomId });
  if (session) {
    session.whiteboardElements = snapshot;
    session.lastActivity = new Date();
    await session.save();
  }
});
```

##### Frontend: Apply Remote Changes
```javascript
useEffect(() => {
  socket.on('whiteboardUpdate', ({ snapshot }) => {
    if (!tldrawEditor) return;
    
    // Set flag to prevent echo
    isApplyingRemoteRef.current = true;
    
    // Apply snapshot
    tldrawEditor.store.loadSnapshot(snapshot);
    
    // Reset flag
    setTimeout(() => {
      isApplyingRemoteRef.current = false;
    }, 100);
  });
  
  return () => {
    socket.off('whiteboardUpdate');
  };
}, [tldrawEditor]);
```

---

## 10. GitHub Integration

### Overview
OAuth-based GitHub integration for importing/exporting code.

### Technologies Used
- **GitHub OAuth:** Authentication
- **GitHub API:** Repository access
- **Axios:** HTTP requests

### Internal Working Flow

#### Step 1: GitHub OAuth Flow

##### Frontend: Initiate OAuth
```javascript
// GitHubIntegration.jsx
const clientId = 'Ov23likZXqyctlogOjrD';
const redirectUri = `${window.location.origin}/github-callback`;

const initiateGitHubLogin = () => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`;
  window.location.href = authUrl;
};
```

##### Frontend: Handle Callback
```javascript
// GitHubCallback.jsx
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  if (code) {
    exchangeCodeForToken(code);
  }
}, []);

const exchangeCodeForToken = async (code) => {
  const response = await fetch('/api/github/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      clientId,
      clientSecret
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    localStorage.setItem('github_token', data.access_token);
    localStorage.setItem('github_user', JSON.stringify(data.user));
    navigate('/compiler');
  }
};
```

##### Backend: Token Exchange
```javascript
// routes/github.js
router.post('/token', async (req, res) => {
  const { code, clientId, clientSecret } = req.body;
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      },
      {
        headers: { Accept: 'application/json' }
      }
    );
    
    const { access_token } = tokenResponse.data;
    
    // Get user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${access_token}` }
    });
    
    res.json({
      success: true,
      access_token,
      user: {
        id: userResponse.data.id,
        login: userResponse.data.login,
        name: userResponse.data.name,
        avatar_url: userResponse.data.avatar_url
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'GitHub authentication failed'
    });
  }
});
```

---

## 11. User Progress Tracking

### Already covered in DSA Problem Solving section

---

## 12. Security Layer

### Overview
Multi-layered security implementation protecting against common web vulnerabilities.

### Technologies Used
- **Helmet.js:** Security headers
- **Express Rate Limit:** DDoS protection
- **JWT:** Secure authentication
- **CORS:** Cross-origin protection
- **Express Validator:** Input sanitization

### Security Implementations

#### Rate Limiting
```javascript
// backend/index.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);
```

#### Security Headers
```javascript
const helmet = require('helmet');

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
```

#### CORS Configuration
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### Input Validation
```javascript
const { body, validationResult } = require('express-validator');

router.post('/submit',
  auth,
  [
    body('code').notEmpty().withMessage('Code is required'),
    body('language').isIn(['javascript', 'python', 'java', 'cpp', 'c'])
      .withMessage('Invalid language')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Process submission
  }
);
```

---

This comprehensive documentation covers the internal working of all major features. Each feature has detailed explanations of:
- Technologies used
- Complete data flow
- Frontend and backend code
- Database schemas
- Real-time synchronization mechanisms
- Error handling and edge cases

This document serves as complete technical documentation for understanding how PrepMate works internally.
