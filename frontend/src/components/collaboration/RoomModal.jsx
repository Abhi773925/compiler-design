import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Plus, LogIn, Clock, Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const RoomModal = ({ isOpen, onClose, onCreateRoom, onJoinRoom }) => {
  const [mode, setMode] = useState(null); // 'create' or 'join'
  const [roomId, setRoomId] = useState("");
  const { user } = useAuth();
  const userName = user?.name || "Guest";
  const [error, setError] = useState("");
  const [recentSessions, setRecentSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Fetch recent sessions when modal opens
  useEffect(() => {
    if (isOpen && user?._id) {
      fetchRecentSessions();
    }
  }, [isOpen, user]);

  const fetchRecentSessions = async () => {
    setLoadingSessions(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${BACKEND_URL}/api/sessions/user/${user._id || user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setRecentSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Error fetching recent sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const formatTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    onCreateRoom(newRoomId, userName);
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }
    onJoinRoom(roomId.toUpperCase(), userName);
  };

  const resetForm = () => {
    setMode(null);
    setRoomId("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {mode === null && "Start Collaboration"}
                    {mode === "create" && "Create Room"}
                    {mode === "join" && "Join Room"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {mode === null && (
                  <>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Choose how you want to start collaborating with your team
                    </p>

                    {/* Recent Sessions */}
                    {recentSessions.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Recent Sessions
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {recentSessions.map((session) => (
                            <motion.div
                              key={session.roomId}
                              whileHover={{ scale: 1.01 }}
                              onClick={() => onJoinRoom(session.roomId, userName)}
                              className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-orange-500 dark:hover:border-orange-400 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm font-mono font-semibold text-orange-600 dark:text-orange-400">
                                      {session.roomId}
                                    </code>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {session.participantCount} {session.participantCount === 1 ? 'participant' : 'participants'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(session.createdAt)}
                                    </span>
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                      {formatTimeRemaining(session.expiresAt)}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-2">
                                  <LogIn className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {loadingSessions && (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading sessions...</p>
                      </div>
                    )}

                    {/* Create Room Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMode("create")}
                      className="w-full p-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg transition-all duration-200 flex items-center gap-4"
                    >
                      <div className="p-3 bg-white/20 rounded-lg">
                        <Plus className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-lg">Create New Room</div>
                        <div className="text-sm opacity-90">Start a new collaboration session</div>
                      </div>
                    </motion.button>

                    {/* Join Room Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMode("join")}
                      className="w-full p-6 bg-white dark:bg-gray-800 border-2 border-orange-500 dark:border-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 rounded-xl shadow-lg transition-all duration-200 flex items-center gap-4"
                    >
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <LogIn className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-lg text-gray-900 dark:text-white">
                          Join Existing Room
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Enter a room ID to join
                        </div>
                      </div>
                    </motion.button>
                  </>
                )}

                {mode === "create" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Name
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white">
                        {userName}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Using your account name
                      </p>
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setMode(null)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleCreateRoom}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Create Room
                      </Button>
                    </div>
                  </>
                )}

                {mode === "join" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Name
                      </label>
                      <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white">
                        {userName}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Using your account name
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Room ID
                      </label>
                      <input
                        type="text"
                        value={roomId}
                        onChange={(e) => {
                          setRoomId(e.target.value.toUpperCase());
                          setError("");
                        }}
                        placeholder="Enter room ID"
                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white uppercase"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setMode(null)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleJoinRoom}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Join Room
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {/* Info */}
              {mode === null && (
                <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-orange-600 dark:text-orange-400">💡 Tip:</span>{" "}
                    Create a room to get a unique ID that others can use to join your session
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RoomModal;
