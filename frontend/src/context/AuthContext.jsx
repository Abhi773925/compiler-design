import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and validate with backend for 1-week authentication
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          console.log("Validating 1-week JWT token on page load...");
          // Verify token with backend
          const response = await fetch("https://compiler-design.onrender.com/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok && data.success) {
            setUser(data.user);
            // Update localStorage with fresh user data
            localStorage.setItem("user", JSON.stringify(data.user));
            console.log("1-week authentication valid, user remains logged in");
          } else {
            // Token is invalid or expired, clear storage
            console.log(
              "Token expired or invalid:",
              data.message || "Unknown error"
            );
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          // Don't immediately logout on network errors, keep user logged in
          const savedUser = localStorage.getItem("user");
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
              console.log(
                "Network error, but keeping user logged in from localStorage"
              );
            } catch (parseError) {
              console.error("Error parsing saved user:", parseError);
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setUser(null);
            }
          }
        }
      } else {
        // No token found
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (userData) => {
    console.log("Logging in user for 1 week:", userData.name);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Token should already be stored by the auth component
  };

  const refreshToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      console.log("Refreshing JWT token for extended 1-week session...");
      const response = await fetch("https://compiler-design.onrender.com/api/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        console.log("Token refreshed successfully for another week");
        return true;
      } else {
        console.log("Token refresh failed:", data.message);
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return false;
    }
  };

  const logout = () => {
    console.log("User logged out");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Check if token is still valid (not expired)
  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return tokenData.exp > currentTime;
    } catch (error) {
      console.error("Error checking token validity:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshToken,
        isTokenValid,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
