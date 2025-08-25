// api routes
const API_BASE_URL= "https://layole-backend.onrender.com"

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

// Initialize Hero Image Carousel
function initHeroCarousel() {
  const images = document.querySelectorAll('.hero-images img');
  if (!images.length) return;

  // Create dots container if it doesn't exist
  let dotsContainer = document.querySelector('.hero-dots');
  if (!dotsContainer) {
    dotsContainer = document.createElement('div');
    dotsContainer.className = 'hero-dots';
    document.querySelector('.hero-images').appendChild(dotsContainer);
  } else {
    // Clear existing dots
    dotsContainer.innerHTML = '';
  }

  let current = 0;
  let interval;

  // Create dots for each image
  images.forEach((img, idx) => {
    const dot = document.createElement('div');
    dot.className = 'hero-dot' + (idx === 0 ? ' active' : '');
    dot.addEventListener('click', () => showSlide(idx));
    dotsContainer.appendChild(dot);
  });

  function showSlide(idx) {
    images[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = idx;
    images[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
    resetInterval();
  }

  function nextSlide() {
    showSlide((current + 1) % images.length);
  }

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
  }

  // Initialize first slide
  images[0].classList.add('active');
  interval = setInterval(nextSlide, 5000);

  // Pause on hover
  const heroContainer = document.querySelector('.hero-images');
  if (heroContainer) {
    heroContainer.addEventListener('mouseenter', () => clearInterval(interval));
    heroContainer.addEventListener('mouseleave', resetInterval);
  }
}
// Appointment Form Handling
const appointmentForm = document.getElementById("appointmentForm");
if (appointmentForm) {
  appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = appointmentForm.querySelector('button[type="submit"]');
    const resetLoading = showLoading(submitButton);

    try {
      // Get form data with proper formatting
      const formData = new FormData(appointmentForm);
      const appointmentData = {
        firstName: formData.get("firstName").trim(),
        lastName: formData.get("lastName").trim(),
        email: formData.get("email").trim(),
        phone: formData.get("phone").trim(),
        gender: formData.get("gender"),
        address: formData.get("address")?.trim() || undefined,
        department: formData.get("department"),
        doctor: formData.get("doctor") || undefined,
        appointmentDate: formData.get("appointmentDate"),
        appointmentTime: formData.get("appointmentTime"),
        reason: formData.get("reason").trim(),
        insurance: formData.get("insurance")?.trim() || undefined
      };

      // Client-side validation
      const errors = [];
      
      // Required fields check
      if (!appointmentData.firstName) errors.push("First name is required");
      if (!appointmentData.lastName) errors.push("Last name is required");
      if (!appointmentData.email) errors.push("Email is required");
      if (!appointmentData.phone) errors.push("Phone number is required");
      if (!appointmentData.gender) errors.push("Gender is required");
      if (!appointmentData.department) errors.push("Department is required");
      if (!appointmentData.appointmentDate) errors.push("Appointment date is required");
      if (!appointmentData.appointmentTime) errors.push("Appointment time is required");
      if (!appointmentData.reason) errors.push("Reason for visit is required");

      // Email format validation
      if (appointmentData.email && !validateEmail(appointmentData.email)) {
        errors.push("Please enter a valid email address");
      }

      // Phone format validation
      if (appointmentData.phone && !validatePhone(appointmentData.phone)) {
        errors.push("Please enter a valid phone number");
      }

      // Date validation
      if (appointmentData.appointmentDate && !validateAppointmentDate(appointmentData.appointmentDate)) {
        errors.push("Appointment date must be today or in the future");
      }

      if (errors.length > 0) {
        throw new Error(errors.join("\n"));
      }

      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Handle backend validation errors
        if (responseData.details) {
          const backendErrors = responseData.details.map(err => err.msg);
          throw new Error(backendErrors.join("\n"));
        }
        throw new Error(responseData.error || "Failed to book appointment");
      }

      // Show success message
      showSuccessMessage("Appointment booked successfully! We've sent a confirmation to your email.");
      appointmentForm.reset();

    } catch (error) {
      console.error("Appointment error:", error);
      alert(error.message || "An error occurred. Please try again or call us directly.");
    } finally {
      resetLoading();
    }
  });
}


// Contact Form Handling
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const resetLoading = showLoading(submitButton);

    try {
      const formData = new FormData(contactForm);
      const contactData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone") || "",
        message: formData.get("message")
      };

      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to send message");
      }

      // Show success modal
      showSuccessMessage("Your message has been sent successfully!");
      contactForm.reset();

    } catch (error) {
      console.error("Contact form error:", error);
      alert(error.message || "An error occurred. Please try again later.");
    } finally {
      resetLoading();
    }
  });
}


// Updated success message function
function showSuccessMessage(message) {
  const successModal = document.getElementById("successMessage");
  if (successModal) {
    successModal.querySelector(".modal-message").textContent = message;
    successModal.style.display = "flex";
    // Auto-close after 5 seconds
    setTimeout(() => successModal.style.display = "none", 5000);
  } else {
    alert(message); // Fallback
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

// Initialize Google Maps (placeholder function
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

document.addEventListener('DOMContentLoaded', function() {
  initHeroCarousel();
  console.log("Hospital website scripts loaded successfully");
});