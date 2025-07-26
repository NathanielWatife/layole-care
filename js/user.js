// api routes
const API_BASE_URL = "https://layole-backend.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('register-message') || document.getElementById('login-message');

    // Helper function for loading state
    function showLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;
        return () => {
            button.innerHTML = originalText;
            button.disabled = false;
        };
    }

    // Helper function for error display
    function showError(message, element) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.marginTop = '10px';
        
        // Clear previous errors
        const existingError = element.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        element.appendChild(errorDiv);
    }

    // Registration
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = registerForm.querySelector('button[type="submit"]');
            const resetLoading = showLoading(submitButton);

            try {
                const username = document.getElementById('username').value.trim();
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;

                // Basic validation
                if (!username || !email || !password) {
                    throw new Error('All fields are required');
                }

                const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Registration failed');
                }

                // Store token and user data
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect to blog
                window.location.href = 'blog.html';
            } catch (error) {
                console.error('Registration error:', error);
                showError(error.message, registerForm);
            } finally {
                resetLoading();
            }
        });
    }

    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const resetLoading = showLoading(submitButton);

            try {
                const username = document.getElementById('login-username').value.trim();
                const password = document.getElementById('login-password').value;

                if (!username || !password) {
                    throw new Error('Both fields are required');
                }

                const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Login failed');
                }

                // Store token and user data
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Redirect to blog
                window.location.href = 'blog.html';
            } catch (error) {
                console.error('Login error:', error);
                showError(error.message, loginForm);
            } finally {
                resetLoading();
            }
        });
    }

    // Add logout button to navigation if logged in
    function addLogoutButton() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && localStorage.getItem('authToken')) {
            // Remove existing logout button if any
            const existingLogout = document.getElementById('logout');
            if (existingLogout) existingLogout.parentElement.remove();

            const logoutItem = document.createElement('li');
            logoutItem.innerHTML = '<a href="#" class="nav-link" id="logout">Logout</a>';
            navMenu.appendChild(logoutItem);
            
            document.getElementById('logout').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            });
        }
    }

    // Initialize logout button
    addLogoutButton();
});