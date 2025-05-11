// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");  // ← NEW: import User

const verifyToken = async (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res
      .status(401)
      .json({ msg: "No authentication token, access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    // ─── NEW BLOCK CHECK ─────────────────────────────────────────────
    const dbUser = await User.findById(req.user.id).select("status");
    if (dbUser?.status === "blocked") {
      return res
        .status(403)
        .json({ msg: "Your account has been blocked. Contact support." });
    }
    // ─────────────────────────────────────────────────────────────────

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

const ensureAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

module.exports = {
  verifyToken,
  ensureAdmin,
};
