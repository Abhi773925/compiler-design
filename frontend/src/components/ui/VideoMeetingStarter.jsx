import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Video, Users, Copy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VideoMeetingStarter = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roomId, setRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const generateRoomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const createMeeting = () => {
    const newRoomId = generateRoomId();
    setIsCreating(true);

    // Add a small delay for better UX
    setTimeout(() => {
      navigate(`/meeting/${newRoomId}`);
      onClose();
      setIsCreating(false);
    }, 500);
  };

  const joinMeeting = () => {
    if (roomId.trim()) {
      navigate(`/meeting/${roomId.trim()}`);
      onClose();
    }
  };

  const copyRoomId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      // Could add a toast notification here
    } catch (err) {
      console.error("Failed to copy room ID:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Video Meeting
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.name || user?.username || "Guest"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Create New Meeting */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={createMeeting}
              disabled={isCreating}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white p-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isCreating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Meeting...
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Start New Meeting
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                or
              </span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Join Existing Meeting */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Join with Meeting ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter meeting ID"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && joinMeeting()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={joinMeeting}
                  disabled={!roomId.trim()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium transition-all duration-200"
                >
                  Join
                </motion.button>
              </div>
            </div>

            {/* Quick Room IDs for Testing */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quick Access
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["room-1", "room-2", "team-call", "meeting-123"].map(
                  (quickRoom) => (
                    <motion.button
                      key={quickRoom}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/meeting/${quickRoom}`)}
                      className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 group"
                    >
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {quickRoom}
                      </span>
                      <Copy
                        className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyRoomId(quickRoom);
                        }}
                      />
                    </motion.button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Video meetings are peer-to-peer encrypted and secure
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoMeetingStarter;
