const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/api/register", authController.registerUser);
router.post("/api/login", authController.loginUser);
router.get("/api/user", authController.getUserData);

module.exports = router;
