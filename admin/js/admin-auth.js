// Admin Authentication JavaScript

// API Base URL
const API_BASE_URL = "http://localhost:3000/api"

// Check if user is authenticated
function checkAuth() {
  const token = localStorage.getItem("adminToken")
  const currentPage = window.location.pathname

  if (!token && !currentPage.includes("login.html")) {
    window.location.href = "login.html"
    return false
  }

  if (token && currentPage.includes("login.html")) {
    window.location.href = "dashboard.html"
    return false
  }

  return true
}

// Login functionality
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication on page load
  checkAuth()

  // Login form handler
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  // Load admin profile if on dashboard
  if (!window.location.pathname.includes("login.html")) {
    loadAdminProfile()
  }
})

// Handle login form submission
async function handleLogin(e) {
  e.preventDefault()

  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const rememberMe = document.getElementById("rememberMe").checked

  if (!username || !password) {
    showError("Please enter both username and password")
    return
  }

  showLoading(true)

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (data.success) {
      // Store token
      if (rememberMe) {
        localStorage.setItem("adminToken", data.data.token)
        localStorage.setItem("adminData", JSON.stringify(data.data.admin))
      } else {
        sessionStorage.setItem("adminToken", data.data.token)
        sessionStorage.setItem("adminData", JSON.stringify(data.data.admin))
      }

      // Redirect to dashboard
      window.location.href = "dashboard.html"
    } else {
      showError(data.error || "Login failed")
    }
  } catch (error) {
    console.error("Login error:", error)
    showError("Network error. Please try again.")
  } finally {
    showLoading(false)
  }
}

// Load admin profile
async function loadAdminProfile() {
  const token = getToken()
  if (!token) return

  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (data.success) {
      updateAdminInfo(data.data.admin)
    } else {
      if (response.status === 401) {
        logout()
      }
    }
  } catch (error) {
    console.error("Profile load error:", error)
  }
}

// Update admin info in UI
function updateAdminInfo(admin) {
  const adminNameElement = document.getElementById("adminName")
  if (adminNameElement) {
    adminNameElement.textContent = admin.fullName
  }

  // Store updated admin data
  const storage = localStorage.getItem("adminToken") ? localStorage : sessionStorage
  storage.setItem("adminData", JSON.stringify(admin))
}

// Get stored token
function getToken() {
  return localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken")
}

// Get stored admin data
function getAdminData() {
  const data = localStorage.getItem("adminData") || sessionStorage.getItem("adminData")
  return data ? JSON.parse(data) : null
}

// Logout functionality
function logout() {
  // Clear stored data
  localStorage.removeItem("adminToken")
  localStorage.removeItem("adminData")
  sessionStorage.removeItem("adminToken")
  sessionStorage.removeItem("adminData")

  // Redirect to login
  window.location.href = "login.html"
}

// API request helper with authentication
async function apiRequest(endpoint, options = {}) {
  const token = getToken()

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions)
    const data = await response.json()

    if (response.status === 401) {
      logout()
      return null
    }

    return { response, data }
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Show loading overlay
function showLoading(show) {
  const overlay = document.getElementById("loadingOverlay")
  if (overlay) {
    overlay.style.display = show ? "flex" : "none"
  }
}

// Show error message
function showError(message) {
  const errorElement = document.getElementById("errorMessage")
  const errorText = document.getElementById("errorText")

  if (errorElement && errorText) {
    errorText.textContent = message
    errorElement.style.display = "block"

    // Auto hide after 5 seconds
    setTimeout(() => {
      hideError()
    }, 5000)
  } else {
    alert(message)
  }
}

// Hide error message
function hideError() {
  const errorElement = document.getElementById("errorMessage")
  if (errorElement) {
    errorElement.style.display = "none"
  }
}

// Toggle password visibility
function togglePassword() {
  const passwordInput = document.getElementById("password")
  const toggleButton = document.querySelector(".toggle-password i")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    toggleButton.className = "fas fa-eye-slash"
  } else {
    passwordInput.type = "password"
    toggleButton.className = "fas fa-eye"
  }
}

// Toggle sidebar (mobile)
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar")
  if (sidebar) {
    sidebar.classList.toggle("active")
  }
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Format time for display
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":")
  const hour = Number.parseInt(hours)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

// Format department name
function formatDepartment(department) {
  return department
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Handle network errors
function handleNetworkError(error) {
  console.error("Network error:", error)
  showError("Network error. Please check your connection and try again.")
}

// Debounce function for search inputs
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Export functions for use in other scripts
window.adminAuth = {
  checkAuth,
  getToken,
  getAdminData,
  logout,
  apiRequest,
  showLoading,
  showError,
  hideError,
  formatDate,
  formatTime,
  formatDepartment,
  handleNetworkError,
  debounce,
}
