const Appointment = require("../models/Appointment")
const { sendAppointmentConfirmation, sendAppointmentNotification } = require("../utils/emailTemplates")
const { sendEmail } = require("../utils/sendEmail")

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res, next) => {
  try {
    const appointmentData = req.body

    // Check for existing appointment at the same time
    const existingAppointment = await Appointment.findOne({
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      status: { $in: ["pending", "confirmed"] },
    })

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        error: "This time slot is already booked. Please choose a different time.",
      })
    }

    // Create new appointment
    const appointment = new Appointment(appointmentData)
    await appointment.save()

    // Send confirmation email to patient
    try {
      const patientEmailHtml = sendAppointmentConfirmation(appointment)
      await sendEmail(
        appointment.email,
        "Appointment Confirmation - MediCare Hospital",
        patientEmailHtml,
        `Appointment confirmed for ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime}`,
      )

      // Send notification email to hospital
      const hospitalEmailHtml = sendAppointmentNotification(appointment)
      await sendEmail(
        process.env.HOSPITAL_EMAIL || "appointments@medicarehospital.com",
        "New Appointment Booking",
        hospitalEmailHtml,
        `New appointment: ${appointment.fullName} - ${new Date(appointment.appointmentDate).toLocaleDateString()}`,
      )
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Continue without failing the appointment creation
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: {
        appointmentId: appointment._id,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        department: appointment.department,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private (Admin)
const getAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, department, date, search } = req.query

    // Build query
    const query = {}
    if (status) query.status = status
    if (department) query.department = department
    if (date) {
      const searchDate = new Date(date)
      const nextDay = new Date(searchDate)
      nextDay.setDate(nextDay.getDate() + 1)
      query.appointmentDate = {
        $gte: searchDate,
        $lt: nextDay,
      }
    }
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }

    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-__v")

    const total = await Appointment.countDocuments(query)

    res.json({
      success: true,
      data: {
        appointments,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalAppointments: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private (Admin)
const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      })
    }

    res.json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private (Admin)
const updateAppointment = async (req, res, next) => {
  try {
    const { status, notes } = req.body

    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      })
    }

    appointment.status = status || appointment.status
    appointment.notes = notes || appointment.notes

    await appointment.save()

    res.json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Admin)
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      })
    }

    await appointment.deleteOne()

    res.json({
      success: true,
      message: "Appointment deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get appointment statistics
// @route   GET /api/appointments/stats
// @access  Private (Admin)
const getAppointmentStats = async (req, res, next) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const stats = await Promise.all([
      // Total appointments
      Appointment.countDocuments(),
      // Today's appointments
      Appointment.countDocuments({
        appointmentDate: { $gte: today, $lt: tomorrow },
      }),
      // Pending appointments
      Appointment.countDocuments({ status: "pending" }),
      // Confirmed appointments
      Appointment.countDocuments({ status: "confirmed" }),
      // Appointments by department
      Appointment.aggregate([{ $group: { _id: "$department", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    ])

    res.json({
      success: true,
      data: {
        total: stats[0],
        today: stats[1],
        pending: stats[2],
        confirmed: stats[3],
        byDepartment: stats[4],
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentStats,
}
