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
async function makeRequest(url, method = 'GET', body = null, requiresAuth = false, retries = 3) {
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
    
    try {
        // Check internet connection first
        if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your network and try again.');
        }

        const response = await fetch(`${API_BASE_URL}${url}`, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Something went wrong');
        }
        
        return response.json();
    } catch (error) {
        if (retries){
            await new Promise(resolve => setTimeout(resolve, 1000));
            return makeRequest(url, method, body, requiresAuth, retries - 1);
        }
        throw error
        // Handle different types of errors
        if (error.message === 'Failed to fetch') {
            throw new Error('Could not connect to the server. Please try again later.');
        }
        throw error; // Re-throw other errors
    }
}

// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

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
                window.location.href = 'blog.html';
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

// Network status indicator
function updateNetworkStatus() {
    const statusElement = document.createElement('div');
    statusElement.id = 'network-status';
    statusElement.style.position = 'fixed';
    statusElement.style.bottom = '20px';
    statusElement.style.right = '20px';
    statusElement.style.padding = '10px 20px';
    statusElement.style.borderRadius = '5px';
    statusElement.style.zIndex = '1000';
    
    if (!navigator.onLine) {
        statusElement.textContent = '⚠️ Offline - No internet connection';
        statusElement.style.backgroundColor = 'var(--error-color)';
        statusElement.style.color = 'white';
    } else {
        statusElement.textContent = '✓ Online';
        statusElement.style.backgroundColor = 'var(--success-color)';
        statusElement.style.color = 'white';
    }
    
    // Remove existing status if it exists
    const existingStatus = document.getElementById('network-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    document.body.appendChild(statusElement);
}

// Initial check
updateNetworkStatus();

// Listen for network changes
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);