const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const path = require('path');
require("dotenv").config()

const connectDB = require("./config/db")
const appointmentRoutes = require("./routes/appointmentRoutes")
const contactRoutes = require("./routes/contactRoutes")
const authRoutes = require("./routes/authRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const utilityRoutes = require("./routes/utilityRoutes")
const errorHandler = require("./middleware/errorHandler")


const app = express()
const PORT = process.env.PORT || 3000
app.use(express.static(path.join(__dirname, '../frontend')));
// connect to databse
connectDB()

// middleware
app.use(helmet())
// app.use(
//     cors({
//         origin: [
//             process.env.FRONTEND_URL,
//             "http://localhost:3000", // add this for local dev
//             "http://127.0.0.1:3000"
//         ].filter(Boolean),
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders: ['Content-Type', 'Authorization'],
//         credentials: true,
//     }),
// )


// use origin:true for testing purposes
app.use(
    cors({
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials:true
    })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this, please try again later"
})
// limiter routes
app.use("/api/", limiter)

// routes
app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    } else {
        next();
    }
});
app.use("/api/auth", authRoutes)
app.use("/api/dashboard", dashboardRoutes)
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
    console.log(`Layole backend server running on port ${PORT}`)
    console.log(`Layole Health Check: http://localhost:${PORT}/api/health`)
})

module.exports = app