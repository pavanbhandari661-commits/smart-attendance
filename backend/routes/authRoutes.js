const express = require("express");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const validateRegister = require("../middleware/authValidation");

const router = express.Router();

// Register a new user
router.post("/register", validateRegister, registerUser);

// Login user
router.post("/login", loginUser);

module.exports = router;