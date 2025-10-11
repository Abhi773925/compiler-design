import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Video, User } from "lucide-react";

const IncomingCallModal = ({
  isOpen,
  onAccept,
  onDecline,
  callerName,
  theme = "dark",
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onDecline}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className={`
            relative z-10 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4
            ${
              theme === "dark"
                ? "bg-gray-900 border border-gray-700"
                : "bg-white border border-gray-200"
            }
          `}
        >
          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 border-4 border-green-500 rounded-full opacity-30"
            />
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute w-40 h-40 border-2 border-green-400 rounded-full opacity-20"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Caller Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`
                w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
                ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}
              `}
            >
              <User
                className={`w-10 h-10 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              />
            </motion.div>

            {/* Incoming call text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3
                className={`
                text-lg font-semibold mb-1
                ${theme === "dark" ? "text-white" : "text-gray-900"}
              `}
              >
                Incoming Video Call
              </h3>
              <p
                className={`
                text-sm mb-2
                ${theme === "dark" ? "text-gray-400" : "text-gray-600"}
              `}
              >
                {callerName} is calling you
              </p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Video
                  className={`w-4 h-4 ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                />
                <span
                  className={`
                  text-sm font-medium
                  ${theme === "dark" ? "text-green-400" : "text-green-600"}
                `}
                >
                  Video Call
                </span>
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-8"
            >
              {/* Decline button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDecline}
                className="
                  w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 
                  flex items-center justify-center text-white
                  shadow-lg transition-all duration-200
                  hover:shadow-red-500/25 hover:shadow-xl
                "
                title="Decline call"
              >
                <PhoneOff className="w-6 h-6" />
              </motion.button>

              {/* Accept button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onAccept}
                className="
                  w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 
                  flex items-center justify-center text-white
                  shadow-lg transition-all duration-200
                  hover:shadow-green-500/25 hover:shadow-xl
                "
                title="Accept call"
              >
                <Phone className="w-6 h-6" />
              </motion.button>
            </motion.div>

            {/* Auto-decline timer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`
                mt-4 text-xs
                ${theme === "dark" ? "text-gray-500" : "text-gray-400"}
              `}
            >
              Call will auto-decline in 30 seconds
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IncomingCallModal;
