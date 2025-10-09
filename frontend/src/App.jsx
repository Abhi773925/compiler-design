import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import EditorPage from "./pages/EditorPage";
import AuthModal from "./components/auth/AuthModal";
import "./App.css";

// Replace with your actual Google OAuth Client ID
const GOOGLE_CLIENT_ID =
  "767738565159-917go1fi4liv39t8m209euifatmk7l53.apps.googleusercontent.com";

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/editor" element={<EditorPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
              />

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background:
                      document.documentElement.className === "dark"
                        ? "#1f2937"
                        : "#ffffff",
                    color:
                      document.documentElement.className === "dark"
                        ? "#f9fafb"
                        : "#111827",
                    border: `1px solid ${
                      document.documentElement.className === "dark"
                        ? "#374151"
                        : "#e5e7eb"
                    }`,
                    borderRadius: "12px",
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  },
                  success: {
                    iconTheme: {
                      primary: "#f97316",
                      secondary: "#ffffff",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#ffffff",
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
