"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Spotlight } from "../ui/BackgroundEffects"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { io } from "socket.io-client"
import { Tldraw } from "tldraw"
import "tldraw/tldraw.css"

const Compiler = ({ roomId, userName }) => {
  const { theme: appTheme, toggleTheme } = useTheme()
  const { user } = useAuth() // Get logged in user
  const navigate = useNavigate() // For navigation
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState("")
  const [theme, setTheme] = useState("vs-dark")
  const [output, setOutput] = useState("")
  const [customInput, setCustomInput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [editorReady, setEditorReady] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [roomUsers, setRoomUsers] = useState([])
  const [activeTab, setActiveTab] = useState("users") // New state for active tab
  const [localStream, setLocalStream] = useState(null)
  const [screenStream, setScreenStream] = useState(null)
  const [remoteStreams, setRemoteStreams] = useState({})
  const [remoteScreenShares, setRemoteScreenShares] = useState({}) // Remote screen shares {userId: stream}
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [incomingCall, setIncomingCall] = useState(null) // {from: userId, userName: string}
  const [messages, setMessages] = useState([]) // Chat messages [{id, userId, userName, message, timestamp}]
  const [newMessage, setNewMessage] = useState("") // Current message being typed
  const [activeUsers, setActiveUsers] = useState({}) // {userId: {typing: bool, lastActivity: timestamp}}
  const [typingUsers, setTypingUsers] = useState(new Set()) // Set of userIds who are typing
  const [showFullscreenWhiteboard, setShowFullscreenWhiteboard] = useState(false) // Toggle fullscreen whiteboard
  const [tldrawEditor, setTldrawEditor] = useState(null) // tldraw editor instance
  const tldrawUnsubRef = useRef(null)
  const whiteboardOpenedByOthers = useRef(true) // Track if whiteboard was opened by another user
  const isApplyingRemoteRef = useRef(false)
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const socketRef = useRef(null)
  const isRemoteChange = useRef(false)
  const languageRef = useRef(language) // Add ref for language
  const roomIdRef = useRef(roomId) // Add ref for roomId
  const peerConnections = useRef({})
  const localVideoRef = useRef(null)
  const screenVideoRef = useRef(null)
  const messagesEndRef = useRef(null) // For auto-scrolling chat

  const loaderAddedRef = React.useRef(false)
  const editorCreatedRef = React.useRef(false)

  // Update refs when values change
  useEffect(() => {
    languageRef.current = language
  }, [language])

  useEffect(() => {
    roomIdRef.current = roomId
  }, [roomId])

  const languageOptions = [
    { id: "javascript", name: "JavaScript", version: "*" },
    { id: "python", name: "Python", version: "*" },
    { id: "java", name: "Java", version: "*" },
    { id: "cpp", name: "C++", version: "*" },
    { id: "c", name: "C", version: "*" },
    { id: "csharp", name: "C#", version: "*" },
    { id: "typescript", name: "TypeScript", version: "*" },
    { id: "go", name: "Go", version: "*" },
    { id: "rust", name: "Rust", version: "*" },
    { id: "php", name: "PHP", version: "*" },
    { id: "ruby", name: "Ruby", version: "*" },
    { id: "kotlin", name: "Kotlin", version: "*" },
    { id: "swift", name: "Swift", version: "*" },
    { id: "r", name: "R", version: "*" },
    { id: "sql", name: "SQL", version: "*" },
  ]

  // Simple starter comments for each language
  const languageTemplates = {
    javascript: "// Write your JavaScript code here\n",
    python: "# Write your Python code here\n",
    java: "// Write your Java code here\n",
    cpp: "// Write your C++ code here\n",
    c: "// Write your C code here\n",
    csharp: "// Write your C# code here\n",
    typescript: "// Write your TypeScript code here\n",
    go: "// Write your Go code here\n",
    rust: "// Write your Rust code here\n",
    php: "<?php\n// Write your PHP code here\n",
    ruby: "# Write your Ruby code here\n",
    kotlin: "// Write your Kotlin code here\n",
    swift: "// Write your Swift code here\n",
    r: "# Write your R code here\n",
    sql: "-- Write your SQL queries here\n",
  }

  // Language mappings for Piston API (code execution)
  const languageMappings = {
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "c++",
    c: "c",
    csharp: "csharp",
    typescript: "typescript",
    go: "go",
    rust: "rust",
    php: "php",
    ruby: "ruby",
    kotlin: "kotlin",
    swift: "swift",
    r: "r",
    sql: "sqlite3",
  }

  // Language mappings for Monaco Editor (syntax highlighting)
  const monacoLanguageMappings = {
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    csharp: "csharp",
    typescript: "typescript",
    go: "go",
    rust: "rust",
    php: "php",
    ruby: "ruby",
    kotlin: "kotlin",
    swift: "swift",
    r: "r",
    sql: "sql",
  }

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      csharp: "cs",
      typescript: "ts",
      go: "go",
      rust: "rs",
      php: "php",
      ruby: "rb",
      kotlin: "kt",
      swift: "swift",
      r: "r",
      sql: "sql",
    }
    return extensions[lang] || "txt"
  }

  const copyCode = () => {
    if (!monacoRef.current) return

    const model = monacoRef.current.getModel()
    const selection = monacoRef.current.getSelection()
    const hasSelection = selection && !selection.isEmpty()

    const text = hasSelection ? model.getValueInRange(selection) : monacoRef.current.getValue()
    navigator.clipboard.writeText(text)
    setOutput("Code copied to clipboard!")
    setShowOutput(true)
  }

  const selectAll = () => {
    if (!monacoRef.current || !window.monaco) return
    const model = monacoRef.current.getModel()
    if (!model) return
    const full = model.getFullModelRange()
    monacoRef.current.setSelection(full)
    monacoRef.current.focus()
  }

  const pasteCode = async () => {
    if (!monacoRef.current || !navigator.clipboard?.readText) return
    const text = await navigator.clipboard.readText()
    const selection = monacoRef.current.getSelection()
    monacoRef.current.executeEdits("paste", [{ range: selection, text, forceMoveMarkers: true }])
    monacoRef.current.focus()
  }

  const cutCode = async () => {
    if (!monacoRef.current) return
    const selection = monacoRef.current.getSelection()
    const model = monacoRef.current.getModel()
    if (!selection || !model) return
    const selectedText = model.getValueInRange(selection)
    await navigator.clipboard.writeText(selectedText)
    monacoRef.current.executeEdits("cut", [{ range: selection, text: "" }])
    monacoRef.current.focus()
  }

  const undo = () => {
    monacoRef.current?.trigger("keyboard", "undo", null)
  }

  const redo = () => {
    monacoRef.current?.trigger("keyboard", "redo", null)
  }

  const handleLogout = () => {
    // Disconnect from socket
    if (socketRef.current) {
      socketRef.current.emit("leaveRoom", { roomId })
      socketRef.current.disconnect()
    }

    // Stop media streams
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
    }
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop())
    }

    // Navigate to homepage
    navigate("/")
  }

  const runCode = async () => {
    if (!monacoRef.current) return

    setIsRunning(true)
    setOutput("Running code...")
    setShowOutput(true)

    const currentCode = monacoRef.current.getValue()

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: languageMappings[language] || language,
          version: "*",
          files: [
            {
              name: `main.${getFileExtension(language)}`,
              content: currentCode,
            },
          ],
          stdin: customInput,
          args: [],
          compile_timeout: 10000,
          run_timeout: 3000,
          compile_memory_limit: -1,
          run_memory_limit: -1,
        }),
      })

      const data = await response.json()

      // Handle different response scenarios
      if (data.compile && data.compile.code !== 0) {
        // Compilation failed
        setOutput(`Compilation Error:\n${data.compile.stderr || data.compile.output || "Unknown compilation error"}`)
      } else if (data.run) {
        // Code executed (successfully or with runtime error)
        let output = ""

        if (data.run.stdout) {
          output += data.run.stdout
        }

        if (data.run.stderr) {
          if (output) output += "\n\n--- Errors/Warnings ---\n"
          output += data.run.stderr
        }

        if (!output) {
          output = "Program executed successfully with no output"
        }

        setOutput(output)
      } else if (data.message) {
        // API error message
        setOutput(`Error: ${data.message}`)
      } else {
        setOutput("No output generated")
      }
    } catch (error) {
      setOutput(`Error: ${error.message || "Failed to execute code"}`)
    } finally {
      setIsRunning(false)
    }
  }

  // Function to generate a shareable link
  const shareLink = async () => {
    if (!monacoRef.current) return

    const codeContent = monacoRef.current.getValue()
    const lang = language

    try {
      // If roomId exists, share the room URL
      if (roomId) {
        const roomUrl = `${window.location.origin}/compiler?room=${roomId}`
        navigator.clipboard.writeText(roomUrl)
        setOutput("Room link copied to clipboard! Share it with your team.")
        setShowOutput(true)
        return
      }

      // Create a gist or similar to store the code
      // For simplicity, we'll simulate a shareable link with encoded content
      // In a real app, you'd use a backend service to store and retrieve code
      const encodedContent = btoa(JSON.stringify({ code: codeContent, language: lang }))
      const shareableLink = `${window.location.origin}/compiler?code=${encodeURIComponent(encodedContent)}`

      navigator.clipboard.writeText(shareableLink)
      setOutput("Shareable link copied to clipboard!")
      setShowOutput(true)
    } catch (error) {
      setOutput(`Error generating share link: ${error.message}`)
      setShowOutput(true)
    }
  }

  // WebRTC Configuration
  const iceServers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
  }

  // Create peer connection for WebRTC
  const createPeerConnection = async (userId, isInitiator, screenTrack = null) => {
    try {
      const pc = new RTCPeerConnection(iceServers)
      peerConnections.current[userId] = pc

      // Add tracks to peer connection
      // Priority: screen share > video call > nothing
      if (screenTrack) {
        // If we have a screen track, add it
        console.log(`Adding screen track for user ${userId}`)
        pc.addTrack(screenTrack, screenStream)
      } else if (localStream) {
        // Otherwise, add local video/audio if available
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream)
        })
      }

      // Handle incoming remote stream
      pc.ontrack = (event) => {
        console.log(
          "Received remote track from:",
          userId,
          "Track kind:",
          event.track.kind,
          "Stream ID:",
          event.streams[0]?.id,
        )
        const stream = event.streams[0]
        const track = event.track

        // Log track details
        console.log(
          "Remote stream tracks:",
          stream?.getTracks().map((t) => ({
            kind: t.kind,
            id: t.id,
            enabled: t.enabled,
            muted: t.muted,
            readyState: t.readyState,
            label: t.label,
          })),
        )

        // Detect if this is a screen share based on track label or stream
        // Screen share tracks typically have "screen" in label or come from getDisplayMedia
        const isScreenShare =
          track.label.toLowerCase().includes("screen") ||
          track.label.toLowerCase().includes("monitor") ||
          track.label.toLowerCase().includes("window")

        if (isScreenShare && track.kind === "video") {
          console.log(`Detected SCREEN SHARE from user ${userId}`)
          setRemoteScreenShares((prev) => ({
            ...prev,
            [userId]: stream,
          }))
        } else {
          // Regular video/audio track
          console.log(`Detected regular ${track.kind} from user ${userId}`)
          setRemoteStreams((prev) => {
            const updated = {
              ...prev,
              [userId]: stream,
            }
            console.log("Updated remote streams:", Object.keys(updated))
            return updated
          })
        }
      }

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit("ice-candidate", {
            candidate: event.candidate,
            to: userId,
            roomId,
          })
        }
      }

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log(`Connection state with ${userId}:`, pc.connectionState)
        if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
          // Clean up disconnected peer
          if (peerConnections.current[userId]) {
            peerConnections.current[userId].close()
            delete peerConnections.current[userId]
          }
          setRemoteStreams((prev) => {
            const updated = { ...prev }
            delete updated[userId]
            return updated
          })
        }
      }

      // If initiator, create and send offer
      if (isInitiator) {
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socketRef.current.emit("webrtc-offer", {
          offer,
          to: userId,
          roomId,
        })
      }

      return pc
    } catch (error) {
      console.error("Error creating peer connection:", error)
      throw error
    }
  }

  // Start video call with Zoom-like quality
  const startVideo = async () => {
    try {
      // Request permissions with enhanced quality settings
      const constraints = {
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 30, max: 60 },
          facingMode: "user"
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      // Auto switch to video tab when starting a call
      setActiveTab("video")
      
      // Show notification that video is active
      setOutput("Video call started successfully! Others in the room will be notified.")
      setShowOutput(true)
      setTimeout(() => setShowOutput(false), 3000)

      console.log("Local stream obtained:", stream.id)
      console.log(
        "Local stream tracks:",
        stream.getTracks().map((t) => ({
          kind: t.kind,
          id: t.id,
          enabled: t.enabled,
          muted: t.muted,
          readyState: t.readyState,
          label: t.label,
        })),
      )

      setLocalStream(stream)
      setIsVideoOn(true)
      setIsAudioOn(true)

      // Set srcObject and explicitly play
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        try {
          await localVideoRef.current.play()
          console.log("Local video playing successfully")
        } catch (err) {
          console.error("Error playing local video:", err)
          // Try auto-play as a fallback
          localVideoRef.current.muted = true
          localVideoRef.current.autoplay = true
        }
      }

      // Add tracks to existing peer connections (if any exist from other users)
      const existingPeers = Object.keys(peerConnections.current)
      if (existingPeers.length > 0) {
        console.log("Adding tracks to existing peer connections:", existingPeers)
        stream.getTracks().forEach((track) => {
          existingPeers.forEach((userId) => {
            const pc = peerConnections.current[userId]
            if (pc) {
              // Check if this track kind already exists
              const senders = pc.getSenders()
              const existingSender = senders.find((s) => s.track?.kind === track.kind)
              if (!existingSender) {
                console.log(`Adding ${track.kind} track to peer ${userId}`)
                pc.addTrack(track, stream)
              } else {
                console.log(`Replacing ${track.kind} track for peer ${userId}`)
                existingSender.replaceTrack(track)
              }
            }
          })
        })

        // Renegotiate with all peers
        for (const userId of existingPeers) {
          const pc = peerConnections.current[userId]
          if (pc && pc.signalingState === "stable") {
            console.log(`Renegotiating with peer ${userId}`)
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)
            socketRef.current.emit("webrtc-offer", {
              offer,
              to: userId,
              roomId,
            })
          }
        }
      }

      // Notify other users that this user is ready for call
      if (socketRef.current && roomId) {
        socketRef.current.emit("userReadyForCall", { roomId })
      }

      // Automatically open video tab when starting a call
      setActiveTab("video")

      setOutput("Video call started! Connecting to other users...")
      setShowOutput(true)
    } catch (error) {
      console.error("Error accessing media devices:", error)
      setOutput("Could not access camera/microphone. Please check permissions.")
      setShowOutput(true)
    }
  }

  // Stop video call
  const stopVideo = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
      setIsVideoOn(false)
      setIsAudioOn(false)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null
      }

      // Close all peer connections
      Object.values(peerConnections.current).forEach((pc) => pc.close())
      peerConnections.current = {}

      // Notify other users
      if (socketRef.current && roomId) {
        socketRef.current.emit("userLeftCall", { roomId })
      }

      setOutput("Video call ended")
      setShowOutput(true)
    }
  }

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioOn(audioTrack.enabled)
      }
    }
  }

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOn(videoTrack.enabled && videoTrack.readyState === "live")
      }
    }
  }

  // Accept incoming call
  const acceptCall = async () => {
    if (!incomingCall) return

    try {
      // Start our own video with better quality constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      })

      console.log("Call accepted, local stream obtained:", stream.id)
      setLocalStream(stream)
      setIsVideoOn(true)
      setIsAudioOn(true)

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        localVideoRef.current
          .play()
          .then(() => console.log("Local video playing after accepting call"))
          .catch((err) => console.error("Error playing local video:", err))
      }

      // Check if this is a room call (joining an existing call) or direct call
      if (incomingCall.from === "room") {
        // This is for joining an active room call
        // Signal that we're ready for call to everyone in the room
        socketRef.current.emit("userReadyForCall", { roomId });
        
        // Clear incoming call notification but keep video tab active
        setIncomingCall(null);
        setOutput(`You joined the active video call`);
        setShowOutput(true);
        setTimeout(() => setShowOutput(false), 5000);
      } else {
        // Create peer connection with the specific caller
        await createPeerConnection(incomingCall.from, true);

        // Clear incoming call notification
        setIncomingCall(null);
        setOutput(`Connected with ${incomingCall.userName}`);
        setShowOutput(true);
        setTimeout(() => setShowOutput(false), 3000);
      }
    } catch (error) {
      console.error("Error accepting call:", error);
      setOutput("Could not accept call. Please check camera/microphone permissions.");
      setShowOutput(true);
      setIncomingCall(null);
    }
  }

  // Reject incoming call
  const rejectCall = () => {
    if (!incomingCall) return;
    
    // Special handling for room calls
    if (incomingCall.from === "room") {
      setOutput(`You declined to join the active video call`);
    } else {
      setOutput(`Declined call from ${incomingCall.userName}`);
    }
    
    setShowOutput(true);
    setTimeout(() => setShowOutput(false), 3000);
    setIncomingCall(null);

    console.log("Call rejected from:", incomingCall.userName)
    setIncomingCall(null)
    setOutput(`Call from ${incomingCall.userName} declined`)
    setShowOutput(true)
    setTimeout(() => setShowOutput(false), 3000)
  }

  // Send chat message
  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current || !roomId) return

    const messageData = {
      id: Date.now(),
      userId: socketRef.current.id,
      userName: user?.name || userName || "Anonymous",
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    }

    // Add to local messages
    setMessages((prev) => [...prev, messageData])

    // Emit to other users
    socketRef.current.emit("chatMessage", {
      roomId,
      message: messageData,
    })

    // Clear input
    setNewMessage("")
  }

  // Handle Enter key to send message
  const handleMessageKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Handle whiteboard changes
  const handleWhiteboardChange = () => {
    if (!socketRef.current || !roomIdRef.current || !tldrawEditor) {
      return
    }
    // Prevent infinite loop if changes are applied locally and broadcasted
    if (isApplyingRemoteRef.current) return

    // Get current drawing data from tldraw
    const snapshot = tldrawEditor.store.getSnapshot()

    // Broadcast to other users
    socketRef.current.emit("whiteboardChange", {
      roomId: roomIdRef.current,
      snapshot,
    })
  }

  // Apply remote whiteboard changes
  const applyRemoteWhiteboardChange = (snapshot) => {
    if (tldrawEditor && snapshot) {
      isApplyingRemoteRef.current = true
      try {
        tldrawEditor.store.loadSnapshot(snapshot)
      } finally {
        isApplyingRemoteRef.current = false
      }
    }
  }

  // Notify typing in editor
  const notifyTyping = () => {
    if (socketRef.current && roomId) {
      socketRef.current.emit("userTyping", { roomId })
    }
  }

  // Notify stopped typing
  const notifyStoppedTyping = () => {
    if (socketRef.current && roomId) {
      socketRef.current.emit("userStoppedTyping", { roomId })
    }
  }
console.log("white");
  // Open whiteboard for all users
  const openWhiteboardForAll = () => {
    setShowFullscreenWhiteboard(true)
    if (socketRef.current && roomId) {
      socketRef.current.emit("whiteboardOpened", { roomId })
    }
  }

  // Close whiteboard for all users
  const closeWhiteboardForAll = () => {
    setShowFullscreenWhiteboard(false)
    if (socketRef.current && roomId && !whiteboardOpenedByOthers.current) {
      socketRef.current.emit("whiteboardClosed", { roomId })
    }
    whiteboardOpenedByOthers.current = false
  }

  // Start screen share
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
        },
        audio: false,
      })

      console.log("Screen share stream obtained:", stream.id)
      console.log(
        "Screen share tracks:",
        stream.getTracks().map((t) => ({
          kind: t.kind,
          id: t.id,
          enabled: t.enabled,
          muted: t.muted,
          readyState: t.readyState,
          label: t.label,
        })),
      )

      setScreenStream(stream)
      setIsScreenSharing(true)

      // Set srcObject and force play
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream
        screenVideoRef.current
          .play()
          .then(() => console.log("Screen video playing successfully"))
          .catch((err) => console.error("Error playing screen video:", err))
      }

      // Listen for when user stops sharing via browser UI
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare()
      }

      const screenTrack = stream.getVideoTracks()[0]
      const hasActivePeers = Object.keys(peerConnections.current).length > 0

      if (!hasActivePeers) {
        // No peer connections exist, need to establish them
        console.log("No active peers, initiating screen share connections...")
        if (socketRef.current && roomId) {
          // Store screen track for when connections are created
          window.pendingScreenTrack = screenTrack
          socketRef.current.emit("userReadyForScreenShare", { roomId })
        }
      } else {
        // Replace video tracks in existing peer connections
        Object.entries(peerConnections.current).forEach(([userId, pc]) => {
          const senders = pc.getSenders()
          const videoSender = senders.find((sender) => sender.track?.kind === "video")
          if (videoSender) {
            console.log(`Replacing video track with screen track for user ${userId}`)
            videoSender
              .replaceTrack(screenTrack)
              .then(() => {
                console.log(`Successfully replaced track for user ${userId}`)
              })
              .catch((error) => {
                console.error(`Error replacing track for user ${userId}:`, error)
              })
          } else {
            console.log(`No video sender found for user ${userId}, adding screen track`)
            // If no video sender exists, add the screen track
            pc.addTrack(screenTrack, stream)
          }
        })
      }

      // Broadcast screen share to other users
      if (socketRef.current && roomId) {
        socketRef.current.emit("screenShareStarted", { roomId })
      }

      setOutput("Screen sharing started! Other users can now see your screen.")
      setShowOutput(true)
    } catch (error) {
      console.error("Error starting screen share:", error)
      setOutput("Could not start screen sharing. Please check permissions.")
      setShowOutput(true)
    }
  }

  // Stop screen share
  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop())
      setScreenStream(null)
      setIsScreenSharing(false)
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = null
      }

      // Switch back to camera video if call is active
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0]
        Object.values(peerConnections.current).forEach((pc) => {
          const senders = pc.getSenders()
          const videoSender = senders.find((sender) => sender.track?.kind === "video")
          if (videoSender && videoTrack) {
            videoSender.replaceTrack(videoTrack).catch((error) => {
              console.error("Error switching back to camera:", error)
            })
          }
        })
      }

      // Notify other users
      if (socketRef.current && roomId) {
        socketRef.current.emit("screenShareStopped", { roomId })
      }

      setOutput("Screen sharing stopped")
      setShowOutput(true)
    }
  }

  // Socket.IO connection and real-time collaboration
  useEffect(() => {
    if (!roomId) return

    // Connect to Socket.IO server
    const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "https://compiler-design.onrender.com"
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    })
    
    // Handler for when joining a room with active call
    socketRef.current.on("callActiveInRoom", async ({ roomId }) => {
      console.log("Active call detected in room:", roomId)
      
      // Show notification about active call
      setOutput(`There's an active video call in this room. Would you like to join?`)
      setShowOutput(true)
      
      // Auto-open the video tab
      setActiveTab("video")
      
      // Display join call button
      setIncomingCall({ 
        from: "room", // Special identifier for room calls
        userName: "Room Members" 
      })
      
      // Show browser notification if possible
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Active Video Call', {
          body: `There's an ongoing video call in this room. Click to join.`,
          icon: '/favicon.ico'
        });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    })

    // Restore session state from database
    const restoreSession = async () => {
      try {
        const response = await fetch(`${SOCKET_URL}/api/sessions/${roomId}`)
        if (response.ok) {
          const data = await response.json()
          const session = data.session

          // Restore code and language
          if (session.code && monacoRef.current) {
            isRemoteChange.current = true
            monacoRef.current.setValue(session.code)
            setCode(session.code)
          }
          if (session.language) {
            setLanguage(session.language)
          }

          // Restore messages
          if (session.messages && session.messages.length > 0) {
            const formattedMessages = session.messages.map((msg, index) => ({
              id: index,
              userId: msg.userId,
              userName: msg.userName,
              message: msg.message,
              timestamp: msg.timestamp,
            }))
            setMessages(formattedMessages)
          }

          console.log("Session restored successfully:", session)
        }
      } catch (error) {
        console.error("Error restoring session:", error)
      }
    }

    // Wait for editor to be ready, then restore session
    if (editorReady) {
      restoreSession()
    }

    // Join the room with userId
    socketRef.current.emit("joinRoom", {
      roomId,
      userName:user?.name || userName || "Anonymous",
      userId: user?._id || user?.id || null,
    })

    // Listen for room users updates
    socketRef.current.on("roomUsers", (users) => {
      setRoomUsers(users)
      console.log("Room users updated:", users)
    })

    // Listen for user joined events
    socketRef.current.on("userJoined", ({ userName: newUserName, message }) => {
      setOutput(message)
      setShowOutput(true)
      console.log(message)
    })

    // Listen for user left events
    socketRef.current.on("userLeft", ({ userName: leftUserName, message }) => {
      setOutput(message)
      setShowOutput(true)
      console.log(message)
    })

    // Listen for code updates from other users
    socketRef.current.on("codeUpdate", ({ code: newCode, userName: senderName }) => {
      if (monacoRef.current) {
        isRemoteChange.current = true
        monacoRef.current.setValue(newCode)
        setCode(newCode)
        console.log(`Code updated by ${senderName}`)
      }
    })

    // Listen for language updates from other users
    socketRef.current.on("languageUpdate", ({ language: newLanguage, userName: senderName }) => {
      setLanguage(newLanguage)
      console.log(`Language changed to ${newLanguage} by ${senderName}`)
    })

    // Request current code state when joining
    socketRef.current.emit("requestCodeState", { roomId })

    // Handle code state request from new users
    socketRef.current.on("codeStateRequest", ({ requesterId }) => {
      if (monacoRef.current) {
        const currentCode = monacoRef.current.getValue()
        socketRef.current.emit("sendCodeState", {
          roomId,
          code: currentCode,
          language,
          targetUserId: requesterId,
        })
      }
    })

    // Receive code state when joining
    socketRef.current.on("receiveCodeState", ({ code: receivedCode, language: receivedLanguage }) => {
      if (monacoRef.current && receivedCode) {
        isRemoteChange.current = true
        monacoRef.current.setValue(receivedCode)
        setCode(receivedCode)
        setLanguage(receivedLanguage)
        console.log("Received current code state from another user")
      }
    })

    // Listen for screen share events
    socketRef.current.on("userScreenShareStarted", ({ userId, userName: sharerName }) => {
      console.log(`${sharerName} (${userId}) started screen sharing`)
      setOutput(`${sharerName} started screen sharing`)
      setShowOutput(true)
      setTimeout(() => setShowOutput(false), 3000)
    })

    socketRef.current.on("userScreenShareStopped", ({ userId, userName: sharerName }) => {
      console.log(`${sharerName} (${userId}) stopped screen sharing`)
      // Remove remote screen share
      setRemoteScreenShares((prev) => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
      setOutput(`${sharerName} stopped screen sharing`)
      setShowOutput(true)
      setTimeout(() => setShowOutput(false), 3000)
    })

    // Handle chat messages
    socketRef.current.on("newMessage", ({ message }) => {
      console.log("New message received:", message)
      setMessages((prev) => [...prev, message])
    })

    // Handle whiteboard changes
    socketRef.current.on("whiteboardUpdate", ({ snapshot }) => {
      console.log("Whiteboard update received:", snapshot)
      applyRemoteWhiteboardChange(snapshot)
    })

    // Handle whiteboard opened by another user
    socketRef.current.on("whiteboardOpenedByUser", ({ userName }) => {
      console.log(`${userName} opened the whiteboard`)
      whiteboardOpenedByOthers.current = true
      setShowFullscreenWhiteboard(true)
      setOutput(`${userName} opened the whiteboard`)
      setShowOutput(true)
      setTimeout(() => setShowOutput(false), 3000)
    })

    // Handle whiteboard closed by another user
    socketRef.current.on("whiteboardClosedByUser", ({ userName }) => {
      console.log(`${userName} closed the whiteboard`)
      setShowFullscreenWhiteboard(false)
      setOutput(`${userName} closed the whiteboard`)
      setShowOutput(true)
      setTimeout(() => setShowOutput(false), 3000)
    })

    // Handle typing indicators
    socketRef.current.on("userIsTyping", ({ userId, userName }) => {
      console.log(`${userName} is typing...`)
      setTypingUsers((prev) => new Set(prev).add(userId))

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setTypingUsers((prev) => {
          const updated = new Set(prev)
          updated.delete(userId)
          return updated
        })
      }, 3000)
    })

    socketRef.current.on("userStoppedTyping", ({ userId }) => {
      setTypingUsers((prev) => {
        const updated = new Set(prev)
        updated.delete(userId)
        return updated
      })
    })

    // WebRTC Signaling Events
    // Handle user ready for call (incoming call notification)
    socketRef.current.on("userReadyForCall", async ({ userId, userName: callerName }) => {
      console.log("User ready for call:", userId, callerName)

      if (userId !== socketRef.current.id) {
        // If we don't have local stream, show incoming call notification
        if (!localStream) {
          // Set incoming call state with caller details
          setIncomingCall({ from: userId, userName: callerName })
          
          // Show prominent notification in the UI
          setOutput(`📞 Incoming video call from ${callerName}! Click "Accept" to join the meeting.`)
          setShowOutput(true)
          
          // Play a ringtone sound (if available)
          try {
            const audio = new Audio('/call-ringtone.mp3');
            audio.loop = true;
            audio.play().catch(err => console.log('Could not play ringtone', err));
            // Store audio reference to stop it later
            window._callRingtone = audio;
          } catch (err) {
            console.log('Error playing ringtone:', err);
          }
          
          // Show a browser notification if possible
          if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification('Incoming Video Call', {
              body: `${callerName} is calling you. Click to answer.`,
              icon: '/favicon.ico',
              requireInteraction: true
            });
            
            // Focus window when notification is clicked
            notification.onclick = function() {
              window.focus();
              setActiveTab("video");
            }
          } else if ('Notification' in window && Notification.permission !== 'denied') {
            // Request permission
            Notification.requestPermission();
          }
          
          // Switch to video tab to make call more visible
          setActiveTab("video")
        } else {
          // Auto-accept if we already have video on
          await createPeerConnection(userId, true)
          
          // Display notification that someone joined the call
          setOutput(`${callerName} joined the video call`)
          setShowOutput(true)
          setTimeout(() => setShowOutput(false), 3000)
          
          // Make sure video tab is visible
          setActiveTab("video")
        }
      }
    })

    // Handle user ready for screen share
    socketRef.current.on("userReadyForScreenShare", async ({ userId }) => {
      console.log("User ready for screen share:", userId)
      if (userId !== socketRef.current.id) {
        // Get the pending screen track if available
        const screenTrack = window.pendingScreenTrack || null
        await createPeerConnection(userId, true, screenTrack)
      }
    })

    // Handle WebRTC offer
    socketRef.current.on("webrtc-offer", async ({ offer, from }) => {
      console.log("Received offer from:", from)
      try {
        const pc = await createPeerConnection(from, false)
        await pc.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        socketRef.current.emit("webrtc-answer", {
          answer,
          to: from,
          roomId,
        })
      } catch (error) {
        console.error("Error handling offer:", error)
      }
    })

    // Handle WebRTC answer
    socketRef.current.on("webrtc-answer", async ({ answer, from }) => {
      console.log("Received answer from:", from)
      try {
        const pc = peerConnections.current[from]
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer))
        }
      } catch (error) {
        console.error("Error handling answer:", error)
      }
    })

    // Handle ICE candidate
    socketRef.current.on("ice-candidate", async ({ candidate, from }) => {
      console.log("Received ICE candidate from:", from)
      try {
        const pc = peerConnections.current[from]
        if (pc && candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate))
        }
      } catch (error) {
        console.error("Error adding ICE candidate:", error)
      }
    })

    // Handle user disconnected from call
    socketRef.current.on("userLeftCall", ({ userId }) => {
      console.log("User left call:", userId)
      if (peerConnections.current[userId]) {
        peerConnections.current[userId].close()
        delete peerConnections.current[userId]
      }
      setRemoteStreams((prev) => {
        const updated = { ...prev }
        delete updated[userId]
        return updated
      })
    })

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveRoom", { roomId })
        socketRef.current.disconnect()
      }
      // Clean up media streams
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop())
      }
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop())
      }
      if (tldrawUnsubRef.current) {
        tldrawUnsubRef.current()
        tldrawUnsubRef.current = null
      }
    }
  }, [roomId, userName, localStream, screenStream, editorReady])

  React.useEffect(() => {
    const setupEditor = () => {
      if (editorCreatedRef.current || !editorRef.current || !window.monaco) return

      // If there was any existing content (e.g., from session), reuse it
      const existing = monacoRef.current?.getValue?.()
      const initialCode = typeof existing === "string" ? existing : ""

      const monacoLang = monacoLanguageMappings[languageRef.current] || languageRef.current
      const editor = window.monaco.editor.create(editorRef.current, {
        value: initialCode,
        language: monacoLang,
        theme: theme,
        minimap: { enabled: false },
        fontSize: 14,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        readOnly: false,
        contextmenu: true,
        quickSuggestions: true,
        acceptSuggestionOnCommitCharacter: true,
        acceptSuggestionOnEnter: "on",
        accessibilitySupport: "auto",
        find: { seedSearchStringFromSelection: true, autoFindInSelection: "never" },
        domReadOnly: false,
        wordBasedSuggestions: true,
      })

      // focus and store editor
      editor.focus()
      monacoRef.current = editor
      editorCreatedRef.current = true
      setEditorReady(true)
    }

    if (window.monaco) {
      // Monaco already loaded, just set up the editor once
      setupEditor()
    } else if (!loaderAddedRef.current) {
      // Add loader script only once
      loaderAddedRef.current = true
      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js"
      script.async = true
      script.onload = () => {
        // Configure and load monaco
        if (window.require) {
          window.require.config({
            paths: {
              vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs",
            },
          })
          window.require(["vs/editor/editor.main"], setupEditor)
        }
      }
      document.body.appendChild(script)
    }

    return () => {
      // Cleanly dispose if unmounting
      if (monacoRef.current) {
        monacoRef.current.dispose()
        monacoRef.current = null
        editorCreatedRef.current = false
      }
    }
  }, [])

  // React.useEffect(() => {
  //   if (monacoRef.current) {
  //     monacoRef.current.updateOptions({ theme: theme })
  //   }
  // }, [theme])

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.monaco) {
      // Apply theme once to all models/editors
      window.monaco.editor.setTheme(theme)
    }
  }, [theme])

  // Sync editor theme with app theme
  React.useEffect(() => {
    const editorTheme = appTheme === "dark" ? "vs-dark" : "light"
    setTheme(editorTheme)
  }, [appTheme])

  // Update language syntax highlighting without recreating the model
  React.useEffect(() => {
    if (!monacoRef.current || !window.monaco) return

    const model = monacoRef.current.getModel()
    if (!model) return

    const desired = monacoLanguageMappings[language] || language
    const isRegistered =
      typeof window.monaco.languages.getEncodedLanguageId === "function" &&
      window.monaco.languages.getEncodedLanguageId(desired) !== 0

    const langId = isRegistered ? desired : "plaintext"

    // Only update the language mode without recreating the model
    window.monaco.editor.setModelLanguage(model, langId)
  }, [language])

  // model language will be updated in the dedicated "Update language syntax highlighting" effect below
  React.useEffect(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit("languageChange", { roomId, language })
    }
  }, [language, roomId])

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-save code and language to database (debounced)
  useEffect(() => {
    if (!roomId || !code) return

    const saveTimer = setTimeout(async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://compiler-design.onrender.com"
        await fetch(`${BACKEND_URL}/api/sessions/${roomId}/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            language,
          }),
        })
        console.log("Session auto-saved to database")
      } catch (error) {
        console.error("Error auto-saving session:", error)
      }
    }, 2000) // Save after 2 seconds of inactivity

    return () => clearTimeout(saveTimer)
  }, [code, language, roomId])

  // Effect to set up whiteboard listener when editor is ready
  useEffect(() => {
    if (tldrawEditor && socketRef.current && roomId) {
      const handleChange = () => {
        handleWhiteboardChange()
      }

      // Debounce changes to avoid too many socket emissions
      let changeTimeout
      const unsubscribe = tldrawEditor.store.listen(() => {
        clearTimeout(changeTimeout)
        changeTimeout = setTimeout(handleChange, 300)
      })
      tldrawUnsubRef.current = unsubscribe
    }

    return () => {
      if (tldrawUnsubRef.current) {
        tldrawUnsubRef.current()
        tldrawUnsubRef.current = null
      }
    }
  }, [tldrawEditor, socketRef.current, roomId])

  return (
    <div className="flex h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden relative z-10">
      {/* Spotlight Effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="orange" />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent dark:from-orange-950/20 dark:via-transparent dark:to-transparent pointer-events-none" />

      {/* Incoming Call Modal */}
      <AnimatePresence>
        {incomingCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-orange-200 dark:border-orange-800"
            >
              {/* Ringing Animation */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                  className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                >
                  {incomingCall.userName.charAt(0).toUpperCase()}
                </motion.div>
              </div>

              {/* Call Info */}
              <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Incoming Call</h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                <span className="font-semibold text-orange-600 dark:text-orange-400">{incomingCall.userName}</span> is
                calling you...
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={rejectCall}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path>
                    <line x1="23" x2="17" y1="1" y2="7"></line>
                    <line x1="17" x2="23" y1="1" y2="7"></line>
                  </svg>
                  Decline
                </button>
                <button
                  onClick={acceptCall}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Accept
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar with Tabs */}
      <div className="flex h-full">
        {/* Tab Icons Bar */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static z-30 w-16 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex flex-col items-center py-4 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 h-full`}
        >
          {/* Users Tab */}
          {roomId && (
            <button
              onClick={() => setActiveTab(activeTab === "users" ? null : "users")}
              className={`p-2.5 md:p-3 ${activeTab === "users" ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400" : "hover:bg-orange-100 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"} rounded-lg mb-3 md:mb-4 transition-all duration-200 hover:scale-105 relative`}
              title="Collaborators"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="md:w-5 md:h-5"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              {roomUsers.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {roomUsers.length}
                </span>
              )}
            </button>
          )}

          {/* Files Tab */}
          <button
            onClick={() => setActiveTab(activeTab === "files" ? null : "files")}
            className={`p-2.5 md:p-3 ${activeTab === "files" ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400" : "hover:bg-orange-100 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"} rounded-lg mb-3 md:mb-4 transition-all duration-200 hover:scale-105`}
            title="Files"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="md:w-5 md:h-5"
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
          </button>

          {/* Chat Tab */}
          <button
            onClick={() => setActiveTab(activeTab === "chat" ? null : "chat")}
            className={`p-2.5 md:p-3 ${activeTab === "chat" ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400" : "hover:bg-orange-100 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"} rounded-lg mb-3 md:mb-4 transition-all duration-200 hover:scale-105`}
            title="Chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="md:w-5 md:h-5"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>

          {/* Whiteboard Tab */}
          <button
            onClick={openWhiteboardForAll}
            className="p-2.5 md:p-3 hover:bg-orange-100 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg mb-3 md:mb-4 transition-all duration-200 hover:scale-105"
            title="Whiteboard (Fullscreen)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="md:w-5 md:h-5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </button>

          {/* Video Tab */}
          <button
            onClick={() => setActiveTab(activeTab === "video" ? null : "video")}
            className={`p-2.5 md:p-3 ${activeTab === "video" ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400" : "hover:bg-orange-100 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"} rounded-lg mb-3 md:mb-4 transition-all duration-200 hover:scale-105`}
            title="Video Call"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="md:w-5 md:h-5"
            >
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
          </button>

          <div className="flex-grow"></div>

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2.5 md:p-3 hover:bg-orange-100 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg mb-3 md:mb-4 transition-all duration-200 hover:scale-105"
            title="Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="md:w-5 md:h-5"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </motion.div>

        {/* Tab Content Panel */}
        <AnimatePresence>
          {activeTab && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-80 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-r border-gray-200 dark:border-gray-800 flex flex-col h-full overflow-hidden"
            >
              {/* Tab Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{activeTab}</h2>
                <button
                  onClick={() => setActiveTab(null)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-500"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Users Tab Content */}
                {activeTab === "users" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {roomUsers.length} Active User{roomUsers.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {roomUsers.length > 0 ? (
                      <div className="space-y-2">
                        {roomUsers.map((roomUser) => {
                          const isCurrentUser = roomUser.id === socketRef.current?.id
                          return (
                            <motion.div
                              key={roomUser.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex items-center gap-3 p-3 rounded-lg ${
                                isCurrentUser
                                  ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                                  : "bg-gray-50 dark:bg-gray-800"
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                                  isCurrentUser
                                    ? "bg-gradient-to-br from-orange-500 to-orange-700"
                                    : "bg-gradient-to-br from-orange-400 to-orange-600"
                                }`}
                              >
                                {roomUser.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {roomUser.name}
                                  {isCurrentUser && (
                                    <span className="ml-2 text-xs text-orange-600 dark:text-orange-400 font-normal">
                                      (You)
                                    </span>
                                  )}
                                </p>
                                <div className="flex items-center gap-1">
                                  {typingUsers.has(roomUser.id) ? (
                                    <>
                                      <div className="flex gap-1">
                                        <span
                                          className="w-1 h-1 bg-orange-500 rounded-full animate-bounce"
                                          style={{ animationDelay: "0ms" }}
                                        ></span>
                                        <span
                                          className="w-1 h-1 bg-orange-500 rounded-full animate-bounce"
                                          style={{ animationDelay: "150ms" }}
                                        ></span>
                                        <span
                                          className="w-1 h-1 bg-orange-500 rounded-full animate-bounce"
                                          style={{ animationDelay: "300ms" }}
                                        ></span>
                                      </div>
                                      <p className="text-xs text-orange-600 dark:text-orange-400 ml-1">typing...</p>
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                        No other users in the room
                      </p>
                    )}
                  </div>
                )}

                {/* Files Tab Content */}
                {activeTab === "files" && (
                  <div className="space-y-2">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto text-gray-400 mb-3"
                      >
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                      </svg>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">File sharing</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Coming soon...</p>
                    </div>
                  </div>
                )}

                {/* Chat Tab Content */}
                {activeTab === "chat" && (
                  <div className="flex flex-col h-full">
                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                      {messages.length > 0 ? (
                        messages.map((msg) => {
                          const isOwnMessage = msg.userId === socketRef.current?.id
                          return (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col`}
                              >
                                {/* Sender Name */}
                                {!isOwnMessage && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 px-2">
                                    {msg.userName}
                                  </span>
                                )}

                                {/* Message Bubble */}
                                <div
                                  className={`px-4 py-2 rounded-2xl ${
                                    isOwnMessage
                                      ? "bg-orange-600 text-white rounded-br-sm"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm"
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                </div>

                                {/* Timestamp */}
                                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 px-2">
                                  {new Date(msg.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </motion.div>
                          )
                        })
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mx-auto text-gray-400 mb-3"
                            >
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <p className="text-sm text-gray-600 dark:text-gray-400">No messages yet</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Start the conversation!</p>
                          </div>
                        </div>
                      )}
                      {/* Invisible element for auto-scroll */}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleMessageKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white placeholder-gray-500"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Whiteboard Tab Content - Removed, now opens in fullscreen */}

                {/* Video Tab Content */}
                {activeTab === "video" && (
                  <div className="space-y-4">
                    {/* Call Status */}
                    {Object.keys(remoteStreams).length > 0 && (
                      <div className="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2 flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-pulse"></div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-400">
                          Video call active with {Object.keys(remoteStreams).length} {Object.keys(remoteStreams).length === 1 ? 'person' : 'people'}
                        </p>
                      </div>
                    )}
                  
                    {/* Grid of Videos - Show grid only when there are participants */}
                    {(localStream || Object.keys(remoteStreams).length > 0) && (
                      <div className={`grid gap-2 ${Object.keys(remoteStreams).length > 0 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                        {/* Local Video */}
                        {localStream && (
                          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                            <video
                              ref={(video) => {
                                localVideoRef.current = video
                                if (video && localStream) {
                                  console.log("Setting local video srcObject")
                                  video.srcObject = localStream
                                  video
                                    .play()
                                    .then(() => console.log("Local video element playing"))
                                    .catch((e) => console.error("Error playing local video element:", e))
                                }
                              }}
                              autoPlay
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                              {user?.name || userName || "You"} (You)
                            </div>
                            {/* Video status indicators */}
                            <div className="absolute top-2 right-2 flex gap-1.5">
                              {!isVideoOn && (
                                <div className="bg-red-600 p-1 rounded-full">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                  </svg>
                                </div>
                              )}
                              {!isAudioOn && (
                                <div className="bg-red-600 p-1 rounded-full">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Remote Videos - Zoom-like Grid Layout */}
                        <div className={`grid gap-2 w-full ${
                          Object.keys(remoteStreams).length <= 1 ? "grid-cols-1" :
                          Object.keys(remoteStreams).length <= 4 ? "grid-cols-2" :
                          Object.keys(remoteStreams).length <= 9 ? "grid-cols-3" : "grid-cols-4"
                        }`}>
                          {Object.entries(remoteStreams).map(([userId, stream]) => {
                            const remoteUser = roomUsers.find((u) => u.id === userId)
                            const userName = remoteUser?.name || "Remote User"
                            const hasAudio = stream.getAudioTracks().length > 0
                            const audioEnabled = hasAudio && stream.getAudioTracks()[0].enabled
                            const hasVideo = stream.getVideoTracks().length > 0
                            const videoEnabled = hasVideo && stream.getVideoTracks()[0].enabled
                            
                            return (
                              <div key={userId} className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video transition-all duration-300 hover:shadow-lg hover:scale-105">
                                {/* Video Container */}
                                <video
                                  autoPlay
                                  playsInline
                                  className={`w-full h-full ${videoEnabled ? 'object-cover' : 'hidden'}`}
                                  ref={(video) => {
                                    if (video && stream) {
                                      console.log(`Setting srcObject for ${userName} (${userId})`)
                                      video.srcObject = stream
                                      // Force video to play
                                      video.play().catch((e) => console.error("Error playing video:", e))
                                    }
                                  }}
                                />
                                
                                {/* Placeholder if video is turned off */}
                                {(!hasVideo || !videoEnabled) && (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                    <div className="rounded-full bg-gray-600 w-20 h-20 flex items-center justify-center">
                                      <span className="text-2xl text-white font-semibold">
                                        {userName.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                
                                {/* User name label */}
                                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-sm text-white flex items-center gap-1">
                                  {!audioEnabled && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <line x1="1" y1="1" x2="23" y2="23"></line>
                                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                                    </svg>
                                  )}
                                  <span>{userName}</span>
                                </div>
                                
                                {/* Status indicators */}
                                <div className="absolute top-2 right-2 flex space-x-1">
                                  {!videoEnabled && (
                                    <div className="bg-red-600 p-1 rounded-full" title="Video off">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                        <path d="M13.5 6.5L21 15"></path>
                                        <path d="M3 3l18 18"></path>
                                        <rect x="1" y="5" width="15" height="14" rx="2"></rect>
                                      </svg>
                                    </div>
                                  )}
                                  {!audioEnabled && (
                                    <div className="bg-red-600 p-1 rounded-full" title="Microphone muted">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                                        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Screen Share Section */}
                    {(screenStream || Object.entries(remoteScreenShares).length > 0) && (
                      <div className="space-y-2 mt-2">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Screen Shares</h3>
                        <div className="grid gap-2 grid-cols-1">
                          {/* Your Own Screen Share */}
                          {screenStream && (
                            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                              <video
                                ref={screenVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                  <line x1="8" y1="21" x2="16" y2="21"></line>
                                  <line x1="12" y1="17" x2="12" y2="21"></line>
                                </svg>
                                {user?.name || userName || "Your Screen"}
                              </div>
                            </div>
                          )}

                          {/* Remote Screen Shares */}
                          {Object.entries(remoteScreenShares).map(([userId, stream]) => {
                            const sharerName = roomUsers.find((u) => u.id === userId)?.name || "Remote User"
                            return (
                              <div
                                key={`screen-${userId}`}
                                className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video border-2 border-orange-500"
                              >
                                <video
                                  autoPlay
                                  playsInline
                                  className="w-full h-full object-contain"
                                  ref={(video) => {
                                    if (video && stream) {
                                      console.log(`Setting remote screen share for ${sharerName} (${userId})`)
                                      video.srcObject = stream
                                      video
                                        .play()
                                        .then(() => console.log(`Remote screen share from ${sharerName} playing`))
                                        .catch((e) =>
                                          console.error(`Error playing remote screen share from ${sharerName}:`, e),
                                        )
                                    }
                                  }}
                                />
                                <div className="absolute bottom-2 left-2 bg-orange-600 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                    <line x1="8" y1="21" x2="16" y2="21"></line>
                                    <line x1="12" y1="17" x2="12" y2="21"></line>
                                  </svg>
                                  {sharerName}'s Screen
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Control Buttons */}
                    <div className="space-y-2 mt-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 border border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Call Controls</h3>
                      
                      {/* Active Call Status */}
                      {Object.keys(remoteStreams).length > 0 && !localStream && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2 mb-3">
                          <p className="text-sm text-yellow-800 dark:text-yellow-400 flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="12"></line>
                              <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            A video call is active in this room. Join to participate!
                          </p>
                        </div>
                      )}
                      
                      {/* Video Call Controls */}
                      {!localStream ? (
                        <button
                          onClick={startVideo}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg transform hover:scale-[1.02] duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                          {Object.keys(remoteStreams).length > 0 ? 'Join Video Call' : 'Start Video Call'}
                        </button>
                      ) : (
                        <>
                          {/* Meeting Status Indicator */}
                          <div className="mb-3 flex items-center justify-center">
                            <div className="inline-flex items-center px-3 py-1.5 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full">
                              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse mr-2"></div>
                              <span className="text-xs font-medium text-green-800 dark:text-green-400">
                                {Object.keys(remoteStreams).length > 0 
                                  ? `Meeting active · ${Object.keys(remoteStreams).length + 1} participants` 
                                  : "Video call active"}
                              </span>
                            </div>
                          </div>
                          
                          {/* Call Controls */}
                          <div className="grid grid-cols-4 gap-3">
                            {/* Toggle Audio */}
                            <button
                              onClick={toggleAudio}
                              className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg font-medium transition-all duration-200 ${
                                isAudioOn
                                  ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                                  : "bg-red-600 text-white hover:bg-red-700"
                              }`}
                              title={isAudioOn ? "Mute microphone" : "Unmute microphone"}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mb-1"
                              >
                                {isAudioOn ? (
                                  <>
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                  </>
                                ) : (
                                  <>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                                    <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                  </>
                                )}
                              </svg>
                              <span className="text-xs font-medium">{isAudioOn ? "Mute" : "Unmute"}</span>
                            </button>

                            {/* Toggle Video */}
                            <button
                              onClick={toggleVideo}
                              className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg font-medium transition-all duration-200 ${
                                isVideoOn
                                  ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                                  : "bg-red-600 text-white hover:bg-red-700"
                              }`}
                              title={isVideoOn ? "Turn off camera" : "Turn on camera"}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mb-1"
                              >
                                {isVideoOn ? (
                                  <>
                                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                  </>
                                ) : (
                                  <>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
                                  </>
                                )}
                              </svg>
                              <span className="text-xs font-medium">{isVideoOn ? "Stop Video" : "Start Video"}</span>
                            </button>

                            {/* Screen Share */}
                            <button
                              onClick={screenStream ? stopScreenShare : startScreenShare}
                              className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg font-medium transition-all duration-200 
                              ${screenStream 
                                ? "bg-green-600 text-white hover:bg-green-700" 
                                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"}`}
                              title={screenStream ? "Stop screen sharing" : "Share your screen"}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mb-1"
                              >
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                              </svg>
                              <span className="text-xs font-medium">
                                {screenStream ? "Stop Share" : "Share Screen"}
                              </span>
                            </button>

                            {/* End Call */}
                            <button
                              onClick={stopVideo}
                              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200"
                              title="Leave video call"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mb-1"
                              >
                                <path d="M16 2v4"></path>
                                <path d="M8 2v4"></path>
                                <path d="M22 8H2"></path>
                                <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9V8h18v4Z"></path>
                                <line x1="7" y1="15" x2="17" y2="15"></line>
                              </svg>
                              <span className="text-xs font-medium">Leave Call</span>
                            </button>
                          </div>
                        </>
                      )}
                      
                      {/* Participants Count */}
                      {Object.keys(remoteStreams).length > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                          {Object.keys(remoteStreams).length} {Object.keys(remoteStreams).length === 1 ? 'participant' : 'participants'} connected
                        </div>
                      )}

                      {/* Screen Share Controls */}
                      {localStream && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Screen Sharing</h3>
                          {!isScreenSharing ? (
                            <button
                              onClick={startScreenShare}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                              </svg>
                              Share Your Screen
                            </button>
                          ) : (
                            <button
                              onClick={stopScreenShare}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                                <line x1="2" y1="2" x2="22" y2="22"></line>
                              </svg>
                              Stop Screen Sharing
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Info & Tips */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">💡 Tips:</span>
                      </p>
                      <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5 list-disc pl-4">
                        <li>
                          {localStream || screenStream
                            ? "Your video/audio is now being shared with all collaborators in the room"
                            : "Start a video call to communicate face-to-face with your collaborators"}
                        </li>
                        <li>Toggle your camera and microphone anytime during the call</li>
                        <li>Share your screen to demonstrate code or show other applications</li>
                        <li>All participants in the room will be automatically connected to the call</li>
                      </ul>
                    </div>
                    
                    {/* Room Connection Status */}
                    <div className="p-3 mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Room Status</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-green-600 rounded-full animate-pulse"></div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          Connected to room: <span className="font-semibold">{roomId || 'Personal Workspace'}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {roomUsers.length} {roomUsers.length === 1 ? 'user' : 'users'} connected
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden"
      >
        {/* Old sidebar content hidden */}
      </motion.div>

      {/* Mobile Sidebar Toggle */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </motion.button>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Toolbar */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-2 sm:p-3 md:p-4"
        >
          {/* Room Info Bar */}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            {/* Left: Language and Theme Selectors */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              <select
                className="bg-white dark:bg-black text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-500 dark:hover:border-orange-400 transition-all duration-200 flex-1 sm:flex-none min-w-0"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languageOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              {/* Quick Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="flex items-center justify-center bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 p-1.5 sm:p-2 rounded-lg transition-all duration-200"
                title={appTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {appTheme === "dark" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:w-[18px] sm:h-[18px]"
                  >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:w-[18px] sm:h-[18px]"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center justify-center bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-1 sm:mr-2 sm:w-4 sm:h-4"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span className="whitespace-nowrap">{isRunning ? "Running..." : "Run"}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyCode}
                className="flex items-center justify-center bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sm:mr-2 sm:w-4 sm:h-4"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span className="hidden sm:inline">Copy</span>
              </motion.button>

              {/* Share Room Button */}
              {roomId && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareLink}
                  className="flex items-center justify-center bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
                  title="Share room link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:mr-2 sm:w-4 sm:h-4"
                  >
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  <span className="hidden sm:inline">Share</span>
                </motion.button>
              )}

              {/* Exit/Logout Button */}
              {roomId && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  title="Exit room"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:mr-2 sm:w-4 sm:h-4"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span className="hidden sm:inline">Exit</span>
                </motion.button>
              )}

              {/* Mobile Output Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOutput(!showOutput)}
                className="flex lg:hidden items-center justify-center bg-orange-100 dark:bg-orange-900/20 hover:bg-orange-200 dark:hover:bg-orange-900/40 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1 sm:mr-2 sm:w-4 sm:h-4"
                >
                  <polyline points="4 17 10 11 4 5"></polyline>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                </svg>
                <span className="whitespace-nowrap">{showOutput ? "Hide" : "Show"} Output</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Editor and Output */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Monaco Editor */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`flex-1 flex flex-col ${showOutput ? "hidden lg:flex" : "flex"}`}
          >
            {/* Typing Indicator Banner */}
            <AnimatePresence>
              {typingUsers.size > 0 && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800 px-4 py-2 flex items-center gap-2"
                >
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    {Array.from(typingUsers)
                      .map((userId) => {
                        const user = roomUsers.find((u) => u.id === userId)
                        return user?.name || "Someone"
                      })
                      .join(", ")}{" "}
                    {typingUsers.size === 1 ? "is" : "are"} typing...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1" ref={editorRef}></div>
          </motion.div>

          {/* Output & Input Panel */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`w-full lg:w-1/3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 flex flex-col ${showOutput ? "flex" : "hidden lg:flex"}`}
          >
            {/* Output Section */}
            <div className="flex-1 p-3 sm:p-4 overflow-auto min-h-0">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Output</h2>
                <button
                  onClick={() => setShowOutput(false)}
                  className="lg:hidden text-gray-500 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400 transition-colors duration-200 p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <pre className="bg-black text-green-400 p-3 sm:p-4 rounded-lg h-full min-h-[150px] sm:min-h-[200px] overflow-auto whitespace-pre-wrap font-mono text-xs sm:text-sm border border-gray-700 shadow-inner">
                {output || 'Click "Run" to see output here'}
              </pre>
            </div>

            {/* Custom Input Section */}
            <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Custom Input
              </h2>
              <textarea
                className="w-full bg-white dark:bg-black text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 p-3 sm:p-4 rounded-lg h-24 sm:h-32 resize-none font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter input for your program here..."
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingsOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
              onClick={() => setSettingsOpen(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-orange-600 dark:text-orange-400 sm:w-6 sm:h-6"
                      >
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
                  </div>
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500 dark:text-gray-400 sm:w-5 sm:h-5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                {/* Settings Content */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        {appTheme === "dark" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-orange-600 dark:text-orange-400 sm:w-5 sm:h-5"
                          >
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-orange-600 dark:text-orange-400 sm:w-5 sm:h-5"
                          >
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Theme</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {appTheme === "dark" ? "Dark Mode" : "Light Mode"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                        appTheme === "dark" ? "bg-orange-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-300 ${
                          appTheme === "dark" ? "translate-x-6 sm:translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Additional Info */}
                  <div className="p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold text-orange-600 dark:text-orange-400">💡 Tip:</span> Theme
                      preference is saved automatically and applies across the entire application.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  >
                    Close Settings
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fullscreen Whiteboard Modal */}
      <AnimatePresence>
        {showFullscreenWhiteboard && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-95 z-50"
            />

            {/* Fullscreen Whiteboard Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex flex-col"
            >
              {/* Toolbar */}
              <div className="bg-gray-900 border-b border-gray-700 p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-orange-500"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    <h2 className="text-white font-semibold text-lg">Collaborative Whiteboard</h2>
                  </div>
                  {roomId && (
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Room: {roomId}</span>
                  )}
                </div>

                <button
                  onClick={closeWhiteboardForAll}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span>Close Whiteboard</span>
                </button>
              </div>

              {/* Tldraw Canvas */}
              <div className="flex-1 w-full h-full">
                <Tldraw
                  onMount={(editor) => {
                    setTldrawEditor(editor)

                    // if an old listener exists, clean it up before reattaching
                    if (tldrawUnsubRef.current) {
                      tldrawUnsubRef.current()
                      tldrawUnsubRef.current = null
                    }

                    const handleChange = () => {
                      handleWhiteboardChange()
                    }

                    let changeTimeout
                    const off = editor.store.listen(() => {
                      clearTimeout(changeTimeout)
                      changeTimeout = setTimeout(handleChange, 300)
                    })

                    // store unsubscribe that also clears any pending timeout
                    tldrawUnsubRef.current = () => {
                      off()
                      if (changeTimeout) clearTimeout(changeTimeout)
                    }
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Compiler
