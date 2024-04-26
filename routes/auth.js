const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const authGuard = require("../guards/authGuard");

router.post("/api/register", authController.registerUser);
router.post("/api/login", authController.loginUser);
router.get("/api/user",authGuard, authController.getUserData);

module.exports = router;
