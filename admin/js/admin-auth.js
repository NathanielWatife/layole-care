const API_BASE_URL = "https://layole-backend.onrender.com";

// Authentication Controller
const AuthController = {
  init() {
    this.setupEventListeners();
    if (!this.isLoginPage()) {
      this.checkAuth();
      this.loadAdminProfile();
    }
  },

  setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    const toggleBtn = document.getElementById('togglePassword');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.togglePassword());
    }

    const closeError = document.getElementById('closeError');
    if (closeError) {
      closeError.addEventListener('click', () => this.hideError());
    }
  },

  // Check authentication state
  checkAuth() {
    const token = this.getToken();
    if (!token && !this.isLoginPage()) {
      this.redirectToLogin();
      return false;
    }
    if (token && this.isLoginPage()) {
      this.redirectToDashboard();
      return false;
    }
    return true;
  },

  // Handle login
  async handleLogin(e) {
    e.preventDefault();
    const formData = this.getLoginFormData();
    
    if (!formData.username || !formData.password) {
      this.showError("Please enter both username and password");
      return;
    }

    try {
      this.showLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.storeAuthData(data.data, formData.rememberMe);
        setTimeout(() => this.redirectToDashboard(), 100);
      } else {
        this.showError(data.error || "Login failed");
      }
    } catch (error) {
      this.showError("Network error. Please try again.");
      console.error("Login error:", error);
    } finally {
      this.showLoading(false);
    }
  },

  // Helper methods
  isLoginPage() {
    return window.location.pathname.endsWith("login.html");
  },

  getLoginFormData() {
    return {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      rememberMe: document.getElementById("rememberMe").checked
    };
  },

  storeAuthData(data, rememberMe) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("adminToken", data.token);
    storage.setItem("adminData", JSON.stringify(data.admin));
  },

  getToken() {
    return localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
  },

  // UI methods
  showLoading(show) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.style.display = show ? "flex" : "none";
  },

  showError(message) {
    const errorElement = document.getElementById("errorMessage");
    const errorText = document.getElementById("errorText");
    if (errorElement && errorText) {
      errorText.textContent = message;
      errorElement.style.display = "block";
    }
  },

  hideError() {
    const errorElement = document.getElementById("errorMessage");
    if (errorElement) errorElement.style.display = "none";
  },

  togglePassword() {
    const passwordInput = document.getElementById("password");
    const icon = document.querySelector("#togglePassword i");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.className = "fas fa-eye-slash";
    } else {
      passwordInput.type = "password";
      icon.className = "fas fa-eye";
    }
  },

  // Navigation methods
  redirectToLogin() {
    window.location.href = "login.html";
  },

  redirectToDashboard() {
    window.location.href = "dashboard.html";
  },

  logout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminData");
    this.redirectToLogin();
  }
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  AuthController.init();
});

// Export to window
window.adminAuth = AuthController;