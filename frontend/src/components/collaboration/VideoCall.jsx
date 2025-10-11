import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Users,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Settings,
  Monitor,
  MonitorOff,
} from "lucide-react";

const VideoCall = ({
  socket,
  roomId,
  userName,
  isCallActive,
  onCallToggle,
  onIncomingCall,
  participants = [],
  theme = "dark",
}) => {
  // State management
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [peerConnections, setPeerConnections] = useState(new Map());
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [callQuality, setCallQuality] = useState("high");

  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef(new Map());
  const callContainerRef = useRef(null);

  // WebRTC configuration
  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ];

  const rtcConfiguration = {
    iceServers,
    iceCandidatePoolSize: 10,
  };

  // Initialize media stream
  const initializeMedia = useCallback(async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: callQuality === "high" ? 1280 : 640 },
          height: { ideal: callQuality === "high" ? 720 : 480 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  }, [callQuality]);

  // Create peer connection
  const createPeerConnection = useCallback(
    (userId) => {
      const peerConnection = new RTCPeerConnection(rtcConfiguration);

      // Add local stream tracks
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStream);
        });
      }

      // Handle incoming stream
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setRemoteStreams((prev) => new Map(prev.set(userId, remoteStream)));

        // Set remote video ref
        const videoElement = remoteVideoRefs.current.get(userId);
        if (videoElement) {
          videoElement.srcObject = remoteStream;
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            targetUserId: userId,
            roomId,
          });
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log(
          `Connection state with ${userId}:`,
          peerConnection.connectionState
        );

        if (
          peerConnection.connectionState === "disconnected" ||
          peerConnection.connectionState === "failed"
        ) {
          // Clean up disconnected peer
          setRemoteStreams((prev) => {
            const newMap = new Map(prev);
            newMap.delete(userId);
            return newMap;
          });

          setPeerConnections((prev) => {
            const newMap = new Map(prev);
            newMap.delete(userId);
            return newMap;
          });
        }
      };

      return peerConnection;
    },
    [localStream, socket, roomId]
  );

  // Start call
  const startCall = useCallback(async () => {
    try {
      const stream = await initializeMedia();

      // Notify other users about call start
      if (socket) {
        socket.emit("call-start", { roomId, userName });
      }

      onCallToggle(true);
    } catch (error) {
      console.error("Failed to start call:", error);
      alert("Failed to access camera/microphone. Please check permissions.");
    }
  }, [initializeMedia, socket, roomId, userName, onCallToggle]);

  // End call
  const endCall = useCallback(() => {
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    // Close all peer connections
    peerConnections.forEach((pc) => pc.close());
    setPeerConnections(new Map());
    setRemoteStreams(new Map());

    // Notify others
    if (socket) {
      socket.emit("call-end", { roomId, userName });
    }

    onCallToggle(false);
    setIsFullscreen(false);
  }, [localStream, peerConnections, socket, roomId, userName, onCallToggle]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);

        // Notify others about video state
        if (socket) {
          socket.emit("video-toggle", {
            roomId,
            userId: userName,
            enabled: videoTrack.enabled,
          });
        }
      }
    }
  }, [localStream, socket, roomId, userName]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);

        // Notify others about audio state
        if (socket) {
          socket.emit("audio-toggle", {
            roomId,
            userId: userName,
            enabled: audioTrack.enabled,
          });
        }
      }
    }
  }, [localStream, socket, roomId, userName]);

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        // Replace video track in all peer connections
        const videoTrack = screenStream.getVideoTracks()[0];
        peerConnections.forEach(async (pc) => {
          const sender = pc
            .getSenders()
            .find((s) => s.track && s.track.kind === "video");
          if (sender) {
            await sender.replaceTrack(videoTrack);
          }
        });

        // Update local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        setIsScreenSharing(true);

        // Handle screen share end
        videoTrack.onended = () => {
          setIsScreenSharing(false);
          // Switch back to camera
          if (localStream) {
            const cameraTrack = localStream.getVideoTracks()[0];
            peerConnections.forEach(async (pc) => {
              const sender = pc
                .getSenders()
                .find((s) => s.track && s.track.kind === "video");
              if (sender) {
                await sender.replaceTrack(cameraTrack);
              }
            });

            if (localVideoRef.current) {
              localVideoRef.current.srcObject = localStream;
            }
          }
        };
      } else {
        // Stop screen sharing
        setIsScreenSharing(false);
        if (localStream) {
          const cameraTrack = localStream.getVideoTracks()[0];
          peerConnections.forEach(async (pc) => {
            const sender = pc
              .getSenders()
              .find((s) => s.track && s.track.kind === "video");
            if (sender) {
              await sender.replaceTrack(cameraTrack);
            }
          });

          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
          }
        }
      }
    } catch (error) {
      console.error("Screen sharing error:", error);
    }
  }, [isScreenSharing, localStream, peerConnections]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    // Handle incoming call requests
    socket.on("call-request", ({ fromUser, fromUserId }) => {
      onIncomingCall({ fromUser, fromUserId });
    });

    // Handle call accepted
    socket.on("call-accepted", async ({ fromUserId }) => {
      if (!localStream) return;

      const peerConnection = createPeerConnection(fromUserId);
      setPeerConnections(
        (prev) => new Map(prev.set(fromUserId, peerConnection))
      );

      // Create offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket.emit("call-offer", {
        offer,
        targetUserId: fromUserId,
        roomId,
      });
    });

    // Handle call offer
    socket.on("call-offer", async ({ offer, fromUserId }) => {
      if (!localStream) return;

      const peerConnection = createPeerConnection(fromUserId);
      setPeerConnections(
        (prev) => new Map(prev.set(fromUserId, peerConnection))
      );

      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit("call-answer", {
        answer,
        targetUserId: fromUserId,
        roomId,
      });
    });

    // Handle call answer
    socket.on("call-answer", async ({ answer, fromUserId }) => {
      const peerConnection = peerConnections.get(fromUserId);
      if (peerConnection) {
        await peerConnection.setRemoteDescription(answer);
      }
    });

    // Handle ICE candidates
    socket.on("ice-candidate", async ({ candidate, fromUserId }) => {
      const peerConnection = peerConnections.get(fromUserId);
      if (peerConnection) {
        await peerConnection.addIceCandidate(candidate);
      }
    });

    // Handle user left call
    socket.on("user-left-call", ({ userId }) => {
      const peerConnection = peerConnections.get(userId);
      if (peerConnection) {
        peerConnection.close();
        setPeerConnections((prev) => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
      }

      setRemoteStreams((prev) => {
        const newMap = new Map(prev);
        newMap.delete(userId);
        return newMap;
      });
    });

    return () => {
      socket.off("call-request");
      socket.off("call-accepted");
      socket.off("call-offer");
      socket.off("call-answer");
      socket.off("ice-candidate");
      socket.off("user-left-call");
    };
  }, [
    socket,
    localStream,
    peerConnections,
    createPeerConnection,
    onIncomingCall,
    roomId,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      peerConnections.forEach((pc) => pc.close());
    };
  }, [localStream, peerConnections]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  if (!isCallActive) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startCall}
        className={`
          flex items-center justify-center p-3 rounded-lg transition-all duration-200
          ${
            theme === "dark"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }
          shadow-lg hover:shadow-xl
        `}
        title="Start Video Call"
      >
        <Video className="w-5 h-5" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={callContainerRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`
          ${isFullscreen ? "fixed inset-0 z-50" : "relative w-full h-full"}
          ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}
          rounded-lg overflow-hidden shadow-xl
        `}
      >
        {/* Video Grid */}
        <div
          className={`
          grid gap-2 p-4 h-full
          ${
            remoteStreams.size === 0
              ? "grid-cols-1"
              : remoteStreams.size === 1
              ? "grid-cols-2"
              : remoteStreams.size <= 3
              ? "grid-cols-2 grid-rows-2"
              : "grid-cols-3 grid-rows-2"
          }
        `}
        >
          {/* Local Video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              relative rounded-lg overflow-hidden
              ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}
              ${remoteStreams.size === 0 ? "col-span-full row-span-full" : ""}
            `}
          >
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`
                w-full h-full object-cover
                ${!isVideoEnabled ? "hidden" : ""}
              `}
            />

            {!isVideoEnabled && (
              <div
                className={`
                flex items-center justify-center w-full h-full
                ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-300 text-gray-700"
                }
              `}
              >
                <VideoOff className="w-12 h-12" />
              </div>
            )}

            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 rounded text-white text-sm">
              You {isScreenSharing && "(Screen)"}
            </div>

            <div className="absolute top-2 right-2 flex gap-1">
              {!isVideoEnabled && (
                <div className="p-1 bg-red-500 rounded-full">
                  <VideoOff className="w-3 h-3 text-white" />
                </div>
              )}
              {!isAudioEnabled && (
                <div className="p-1 bg-red-500 rounded-full">
                  <MicOff className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Remote Videos */}
          {Array.from(remoteStreams.entries()).map(
            ([userId, stream], index) => (
              <motion.div
                key={userId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`
                relative rounded-lg overflow-hidden
                ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}
              `}
              >
                <video
                  ref={(el) => {
                    if (el) {
                      remoteVideoRefs.current.set(userId, el);
                      el.srcObject = stream;
                    }
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />

                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 rounded text-white text-sm">
                  {userId}
                </div>
              </motion.div>
            )
          )}
        </div>

        {/* Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            absolute bottom-4 left-1/2 transform -translate-x-1/2
            flex items-center gap-3 px-6 py-3 rounded-full
            ${
              theme === "dark"
                ? "bg-gray-800 bg-opacity-90 backdrop-blur-sm"
                : "bg-white bg-opacity-90 backdrop-blur-sm"
            }
            shadow-lg border border-opacity-20
            ${theme === "dark" ? "border-gray-600" : "border-gray-300"}
          `}
        >
          {/* Video Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleVideo}
            className={`
              p-3 rounded-full transition-all duration-200
              ${
                isVideoEnabled
                  ? theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }
            `}
            title={isVideoEnabled ? "Turn off video" : "Turn on video"}
          >
            {isVideoEnabled ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5" />
            )}
          </motion.button>

          {/* Audio Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleAudio}
            className={`
              p-3 rounded-full transition-all duration-200
              ${
                isAudioEnabled
                  ? theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }
            `}
            title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
          >
            {isAudioEnabled ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </motion.button>

          {/* Screen Share */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleScreenShare}
            className={`
              p-3 rounded-full transition-all duration-200
              ${
                isScreenSharing
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }
            `}
            title={isScreenSharing ? "Stop screen sharing" : "Share screen"}
          >
            {isScreenSharing ? (
              <MonitorOff className="w-5 h-5" />
            ) : (
              <Monitor className="w-5 h-5" />
            )}
          </motion.button>

          {/* Fullscreen Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFullscreen}
            className={`
              p-3 rounded-full transition-all duration-200
              ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }
            `}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </motion.button>

          {/* End Call */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={endCall}
            className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
            title="End call"
          >
            <PhoneOff className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Participants Count */}
        <div
          className={`
          absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full
          ${
            theme === "dark"
              ? "bg-gray-800 bg-opacity-90 text-white"
              : "bg-white bg-opacity-90 text-gray-700"
          }
          backdrop-blur-sm shadow-lg
        `}
        >
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">{remoteStreams.size + 1}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoCall;
