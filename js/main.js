// API routes
const API_BASE_URL = "https://layole-backend.onrender.com";

const authLinks = document.getElementById('auth-links');
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const authModal = document.getElementById('auth-modal');
const closeModal = document.getElementById('.close');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');


// check for user authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (token){
        authLinks.innerHTML = `
            <span>Welcome, ${localStorage.getItem('username')}<span>
            <a href="#" id="logout-link">Logout</a>
        `;
        document.getElementById('logout-link').addEventListener('click', logout);
    } else {
        authLinks.innerHTML = `
            <a href="login.html" id="login-link">Login</a>
            <a href="register.html" id="register-link">Register</a>
        `;
    }
}


// logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    checkAuth();
    window.location.href = 'blog.html';
}

// show auth modal
function showAuthModal(formToShow = 'login') {
    authModal.style.display = 'block';
    if (formToShow === 'login'){
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

//  hide the modal
function hideAuthModal() {
    authModal.style.display = 'none';
}

// Event listeners
if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthModal('login');
    });
}

if (registerLink) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthModal('register');
    });
}

if (closeModal) {
    closeModal.addEventListener('click', hideAuthModal);
}

if (showRegister) {
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthModal('register');
    });
}

if (showLogin) {
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthModal('login');
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        hideAuthModal();
    }
});

// Initialize auth check when page loads
document.addEventListener('DOMContentLoaded', checkAuth);

// Utility function for making API requests
async function makeRequest(url, method = 'GET', body = null, requiresAuth = false) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (requiresAuth) {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    
    return response.json();
}

// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
js/auth.js
javascript
document.addEventListener('DOMContentLoaded', function() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            try {
                const response = await makeRequest('/auth/login', 'POST', {
                    username,
                    password
                });
                
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('userId', response.data.user.id);
                
                hideAuthModal();
                checkAuth();
                
                // Redirect to home page or show success message
                window.location.href = 'index.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }
    
    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            try {
                const response = await makeRequest('/auth/register', 'POST', {
                    username,
                    email,
                    password
                });
                
                alert('Registration successful! Please login.');
                showAuthModal('login');
                
                // Clear form
                registerForm.reset();
            } catch (error) {
                alert(error.message);
            }
        });
    }
});