const express = require("express")
const { login, getProfile, updateProfile, changePassword, logout } = require("../controllers/authController")
const { protect } = require("../middleware/auth")
const { validateLogin, validateProfileUpdate, validatePasswordChange } = require("../middleware/validation")

const router = express.Router()

// Public routes
router.post("/login", validateLogin, login)

// Protected routes
router.use(protect) // All routes below this middleware require authentication

router.get("/profile", getProfile)
router.put("/profile", validateProfileUpdate, updateProfile)
router.put("/change-password", validatePasswordChange, changePassword)
router.post("/logout", logout)

module.exports = router
