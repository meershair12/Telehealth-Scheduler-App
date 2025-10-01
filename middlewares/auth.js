const jwt = require('jsonwebtoken');

const loginAttempts = {};
const blockedIPs = {};

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes


const User = require("../models/user.model"); // apna User model import karo

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: false,
      type: "no_token",
      message: "Unauthorized: No token provided",
      redirectTo: "/login" // frontend ko redirect karne ke liye
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

    // DB se user fetch karo
    const user = await User.findOne({
      where: { status: 'active',id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        status: false,
        type: "user_not_found",
        message: "Unauthorized: User does not exist or may be deactivated or susspended",
        redirectTo: "/contact-admin" // frontend ko redirect karne ke liye
      });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        status: false,
        type: "user_blocked",
        message: "Access denied: User is blocked",
        redirectTo: "/contact-admin" // frontend ko redirect karne ke liye
      });
    }

    // request ke sath user attach karo
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      status: false,
      type: "invalid_token",
      message: error.message || "Unauthorized: Invalid token",
      redirectTo: "/login" // frontend ko redirect karne ke liye

    });
  }
};



module.exports  ={loginAttempts,blockedIPs,MAX_ATTEMPTS,BLOCK_DURATION,protect}