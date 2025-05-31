const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      match: [/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      enum: ["general-inquiry", "appointment", "billing", "medical-records", "feedback", "other"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "closed"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    assignedTo: {
      type: String,
      trim: true,
    },
    response: {
      type: String,
      trim: true,
    },
    responseDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
contactSchema.index({ status: 1 })
contactSchema.index({ priority: 1 })
contactSchema.index({ createdAt: -1 })

// Virtual for full name
contactSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`
})

// Method to mark as resolved
contactSchema.methods.markResolved = function (response, assignedTo) {
  this.status = "resolved"
  this.response = response
  this.responseDate = new Date()
  this.assignedTo = assignedTo
  return this.save()
}

module.exports = mongoose.model("Contact", contactSchema)
