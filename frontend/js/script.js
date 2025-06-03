// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((n) =>
    n.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    }),
  )
}

// baseurl configuration
const API_BASE_URL = window.location.origin.includes('localhost')
  ? 'http://localhost:3000'
  : window.location.origin;

// Appointment Form Handling
const appointmentForm = document.getElementById("appointmentForm")
if (appointmentForm) {
  appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(appointmentForm)
    const appointmentData = Object.fromEntries(formData)

    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      })

      if (response.ok) {
        showSuccessMessage()
        appointmentForm.reset()
      } else {
        throw new Error("Failed to book appointment")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Sorry, there was an error booking your appointment. Please try again or call us directly.")
    }
  })
}

// Contact Form Handling
const contactForm = document.getElementById("contactForm")
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(contactForm)
    const contactData = Object.fromEntries(formData)
    console.log(contactData)

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })

      if (response.ok) {
        alert("Thank you for your message! We will get back to you soon.")
        contactForm.reset()
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Sorry, there was an error sending your message. Please try again or call us directly.")
    }
  })
}

// Success Message Functions
function showSuccessMessage() {
  const successMessage = document.getElementById("successMessage")
  if (successMessage) {
    successMessage.style.display = "flex"
  }
}

function closeSuccessMessage() {
  const successMessage = document.getElementById("successMessage")
  if (successMessage) {
    successMessage.style.display = "none"
  }
}

// Get Directions Function
function getDirections() {
  const hospitalAddress = "Oyemekun Street, no 89 Off College Road, Ifako-Ijaiye, Lagos, Nigeria."
  const encodedAddress = encodeURIComponent(hospitalAddress)
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`
  window.open(googleMapsUrl, "_blank")
}

// Form Validation
function validateForm(form) {
  const requiredFields = form.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.style.borderColor = "#dc3545"
      isValid = false
    } else {
      field.style.borderColor = "#e9ecef"
    }
  })

  return isValid
}

// Email Validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone Validation
function validatePhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

// Date Validation (ensure appointment date is in the future)
function validateAppointmentDate(date) {
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selectedDate >= today
}

// Set minimum date for appointment booking (today)
const appointmentDateInput = document.getElementById("appointmentDate")
if (appointmentDateInput) {
  const today = new Date().toISOString().split("T")[0]
  appointmentDateInput.setAttribute("min", today)
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Loading animation for forms
function showLoading(button) {
  const originalText = button.innerHTML
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
  button.disabled = true

  return () => {
    button.innerHTML = originalText
    button.disabled = false
  }
}

// Initialize Google Maps (placeholder function)
function initMap() {
  // This would be implemented with actual Google Maps API
  console.log("Google Maps would be initialized here")
}

// Accessibility improvements
document.addEventListener("keydown", (e) => {
  // Close modals with Escape key
  if (e.key === "Escape") {
    const successMessage = document.getElementById("successMessage")
    if (successMessage && successMessage.style.display === "flex") {
      closeSuccessMessage()
    }
  }
})

// Focus management for mobile menu
if (hamburger) {
  hamburger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      hamburger.click()
    }
  })
}

// Auto-hide mobile menu on window resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    hamburger?.classList.remove("active")
    navMenu?.classList.remove("active")
  }
})

console.log("Hospital website scripts loaded successfully")
