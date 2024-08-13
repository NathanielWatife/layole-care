const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");

require('dotenv').config();

// database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DB-Connection good!!"))
.catch((err) => {
    console.log(err);
});



// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., HTML, CSS)
app.use(express.static(path.join(__dirname, 'public')));

// POST endpoint to handle form submission
app.post('/send-email', (req, res) => {
  const { name, phone, email, message } = req.body;

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or use another email service
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  // Setup email data
  const mailOptions = {
    from: email,
    to: 'your-email@gmail.com',
    subject: 'New Appointment Request',
    text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Error sending email.');
    }
    res.status(200).send('Email sent successfully!');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
