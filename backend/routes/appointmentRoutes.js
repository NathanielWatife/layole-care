const express = require("express")
const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentStats,
} = require("../controllers/appointmentController")
const { validateAppointment } = require("../middleware/validation")
const { appointmentLimiter } = require("../middleware/rateLimiter")

const router = express.Router()

// Public routes
router.post("/", appointmentLimiter, validateAppointment, createAppointment)

// Admin routes (would need authentication middleware in production)
router.get("/", getAppointments)
router.get("/stats", getAppointmentStats)
router.get("/:id", getAppointment)
router.put("/:id", updateAppointment)
router.delete("/:id", deleteAppointment)

module.exports = router
