import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const AuthModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      console.log("Sending Google credential to backend...");

      // Send the Google credential to our backend
      const response = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (data.success) {
        // Store the JWT token (valid for 1 week)
        localStorage.setItem("token", data.token);

        // Update the auth context with user data
        login(data.user);

        toast.success(`Welcome, ${data.user.name}!`);
        console.log("User successfully logged in with 1-week token");
        onClose();
      } else {
        console.error("Backend authentication failed:", data.message);
        toast.error("Authentication failed. Please try again.");
        handleGoogleError();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Connection error. Please check if the server is running.");
      handleGoogleError();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
    toast.error("Google login failed. Please try again.");
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-gray-200 dark:border-gray-700"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to <span className="text-orange-500">PrepMate</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to start your coding journey
            </p>
          </motion.div>

          {/* Sign In Button */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              size="large"
              width="100%"
              theme={
                document.documentElement.className === "dark"
                  ? "filled_black"
                  : "outline"
              }
              disabled={loading}
            />

            {loading && (
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 flex items-center justify-center rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Signing in...
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Secure authentication • 1-week access
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
