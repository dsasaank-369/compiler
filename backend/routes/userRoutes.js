const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const compilerController = require("../controllers/compilerController");

const router = express.Router();

// Authentication routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protected routes for user management
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);
router.patch("/updateMe", authController.protect, userController.updateMe);
router.delete("/deleteMe", authController.protect, userController.deleteMe);

// Compiler routes
router.post("/submitCode", compilerController.submitCode);
router.post("/run", compilerController.runCode);

// User-related routes
router.get("/:id", userController.getUserById);

module.exports = router;
