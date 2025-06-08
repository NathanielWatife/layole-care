// Admin Authentication JavaScript
const API_BASE_URL = "https://layole-backend.onrender.com";

// Check authentication state
function checkAuth() {
  const token = getToken();
  const isLoginPage = window.location.pathname.endsWith("login.html");
  const isDashboardPage = window.location.pathname.endsWith("dashboard.html");

  console.log("Auth check - Token exists:", !!token, "on page:", window.location.pathname);

  if (!token && !isLoginPage) {
    console.log("No token - redirecting to login");
    window.location.href = "login.html";
    return false;
  }

  if (token && isLoginPage) {
    console.log("Token exists - redirecting to dashboard");
    window.location.href = "dashboard.html";
    return false;
  }

  return true;
}

// Handle login form submission
async function handleLogin(e) {
  e.preventDefault();
  console.log("Login form submitted");

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  if (!username || !password) {
    showError("Please enter both username and password");
    return;
  }

  showLoading(true);

  try {
    console.log("Attempting login...");
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (data.success) {
      console.log("Login successful - storing token");
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("adminToken", data.data.token);
      storage.setItem("adminData", JSON.stringify(data.data.admin));

      // Small delay to ensure storage is committed
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 100);
    } else {
      showError(data.error || "Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("Network error. Please check your connection.");
  } finally {
    showLoading(false);
  }
}

// Load admin profile data
async function loadAdminProfile() {
  console.log("Loading admin profile...");
  const token = getToken();
  
  if (!token) {
    console.log("No token available - logging out");
    logout();
    return;
  }

  try {
    const { response, data } = await apiRequest("/auth/profile");
    console.log("Profile response:", data);

    if (data?.success) {
      updateAdminInfo(data.data.admin);
    } else if (response?.status === 401) {
      console.log("Unauthorized - logging out");
      logout();
    }
  } catch (error) {
    console.error("Profile load error:", error);
    logout();
  }
}

// Update admin info in UI
function updateAdminInfo(admin) {
  console.log("Updating admin info:", admin);
  const adminNameElement = document.getElementById("adminName");
  if (adminNameElement) {
    adminNameElement.textContent = admin.fullName || `${admin.firstName} ${admin.lastName}`;
  }

  const storage = localStorage.getItem("adminToken") ? localStorage : sessionStorage;
  storage.setItem("adminData", JSON.stringify(admin));
}

// Get stored token
function getToken() {
  return localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
}

// Get stored admin data
function getAdminData() {
  const data = localStorage.getItem("adminData") || sessionStorage.getItem("adminData");
  return data ? JSON.parse(data) : null;
}

// Logout and clear session
function logout() {
  console.log("Logging out...");
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminData");
  sessionStorage.removeItem("adminToken");
  sessionStorage.removeItem("adminData");
  window.location.href = "login.html";
}

// API request helper
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  console.log("Making API request to:", endpoint);

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
    const data = await response.json();

    if (response.status === 401) {
      console.log("API 401 Unauthorized");
      logout();
      return null;
    }

    return { response, data };
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// UI Functions
function showLoading(show) {
  const overlay = document.getElementById("loadingOverlay");
  if (overlay) {
    overlay.style.display = show ? "flex" : "none";
  }
}

function showError(message) {
  console.error("Showing error:", message);
  const errorElement = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");

  if (errorElement && errorText) {
    errorText.textContent = message;
    errorElement.style.display = "block";
    setTimeout(hideError, 5000);
  } else {
    alert(message);
  }
}

function hideError() {
  const errorElement = document.getElementById("errorMessage");
  if (errorElement) {
    errorElement.style.display = "none";
  }
}

function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleButton = document.querySelector(".toggle-password i");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleButton.className = "fas fa-eye-slash";
  } else {
    passwordInput.type = "password";
    toggleButton.className = "fas fa-eye";
  }
}

// Initialize authentication
document.addEventListener("DOMContentLoaded", function() {
  console.log("Admin auth initialized");
  
  // Only run auth check if not on login page
  if (!window.location.pathname.endsWith("login.html")) {
    checkAuth();
    loadAdminProfile();
  }

  // Setup login form if present
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});

// Export to window
window.adminAuth = {
  checkAuth,
  getToken,
  getAdminData,
  logout,
  apiRequest,
  showLoading,
  showError,
  hideError,
  togglePassword
};