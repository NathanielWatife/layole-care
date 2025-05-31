const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const connectDB = require("./config/db")
const appointmentRoutes = require("./routes/appointmentRoutes")
const contactRoutes = require("./routes/contactRoutes")
const utilityRoutes = require("./routes/utilityRoutes")
const errorHandler = require("./middleware/errorHandler")


const app = express()
const PORT = process.env.PORT || 3000

// connect to databse
connectDB()

// middleware
app.use(helmet())
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:8080",
        credentials: true,
    }),
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// rate limiting
const limiter = rateLimit({
    windowMS: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this, please try again later"
})
// limiter routes
app.use("/api/", limiter)

// routes
app.use("/api/appointments", appointmentRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api", utilityRoutes)

// error handling middleware
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" })
})

// server
app.listen(PORT, () => {
    console.log(`Hospital backend server running on port ${PORT}`)
    console.log(`Health Check: http://localhost:${PORT}/api/health`)
})

module.exports = app