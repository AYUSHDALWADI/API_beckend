const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const auth = require("../middleware/auth");

// Signup
router.post("/signup", UserController.signup);

// Login
router.post("/login", UserController.login);

// Profile (Protected)
router.get("/profile", auth, UserController.profile);

// Update Profile (Protected)
router.put("/update-profile/:id", auth, UserController.updateProfile);

module.exports = router;