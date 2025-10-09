import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Compiler from "../components/collaboration/Compiler";
import RoomModal from "../components/collaboration/RoomModal";
import { useAuth } from "../context/AuthContext";

const CollaborationPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showRoomModal, setShowRoomModal] = useState(true);
  const [roomId, setRoomId] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check if roomId exists in URL
    const urlRoomId = searchParams.get("room");
    if (urlRoomId) {
      setRoomId(urlRoomId);
      setShowRoomModal(false);
    }
  }, [searchParams]);

  const createSessionInDatabase = async (roomId, userName) => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://compiler-design.onrender.com";
      const response = await fetch(`${BACKEND_URL}/api/sessions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          creatorName: userName,
          creatorUserId: user?._id || user?.id || null,
          code: "// Start coding here...\n",
          language: "javascript",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Session created:", data);
      } else {
        console.error("Failed to create session");
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleCreateRoom = async (newRoomId, name) => {
    setRoomId(newRoomId);
    setUserName(name);
    setShowRoomModal(false);
    // Update URL with room ID
    setSearchParams({ room: newRoomId });
    // Create session in database
    await createSessionInDatabase(newRoomId, name);
  };

  const handleJoinRoom = (existingRoomId, name) => {
    setRoomId(existingRoomId);
    setUserName(name);
    setShowRoomModal(false);
    // Update URL with room ID
    setSearchParams({ room: existingRoomId });
  };

  const handleCloseModal = () => {
    // Navigate back to home if modal is closed without creating/joining
    navigate("/");
  };

  return (
    <>
      <RoomModal
        isOpen={showRoomModal}
        onClose={handleCloseModal}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
      />
      {roomId && !showRoomModal && <Compiler roomId={roomId} userName={userName} />}
    </>
  );
};

export default CollaborationPage;
