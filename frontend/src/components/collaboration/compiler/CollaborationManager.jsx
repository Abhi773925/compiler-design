import React, { useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const CollaborationManager = ({
  roomId,
  userName,
  setRoomUsers,
  setMessages,
  socketRef,
  files,
  activeFileId,
  monacoRef,
  setCode,
}) => {
  const peerConnections = useRef({});
  const localStream = useRef(null);
  const roomsWithActiveCalls = useRef(new Set());

  useEffect(() => {
    if (!roomId) return;

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://compiler-design.onrender.com";
    const socket = io(BACKEND_URL);
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinRoom", { roomId, userName });
    });

    socket.on("userJoined", (users) => {
      setRoomUsers(users);
    });

    socket.on("userLeft", (users) => {
      setRoomUsers(users);
    });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("fileContentChange", ({ fileId, content, userId }) => {
      if (userId !== socket.id && files[fileId] && monacoRef.current) {
        monacoRef.current.setValue(content);
        setCode(content);
      }
    });

    return () => {
      if (socket) {
        socket.emit("leaveRoom", { roomId });
        socket.disconnect();
      }
    };
  }, [roomId, userName]);

  const sendMessage = (message) => {
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        roomId,
        message,
        userId: socketRef.current.id,
        userName,
      });
    }
  };

  const handleFileChange = (content) => {
    if (socketRef.current && activeFileId) {
      socketRef.current.emit("fileContentChange", {
        roomId,
        fileId: activeFileId,
        content,
        userId: socketRef.current.id,
      });
    }
  };

  return {
    sendMessage,
    handleFileChange,
  };
};

export default CollaborationManager;