const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    // Verify JWT token with enhanced validation
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret",
      {
        issuer: "prepmate-api",
        audience: "prepmate-client",
      }
    );

    // Check if token is expired (additional check)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    const user = await User.findById(decoded.userId).select("-googleId -__v");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid - user not found",
      });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      tokenIssuedAt: decoded.iat,
      tokenExpiresAt: decoded.exp,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired, please login again",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    res.status(401).json({
      success: false,
      message: "Token verification failed",
    });
  }
};

module.exports = auth;
