document.addEventListener('DOMContentLoaded', function() {
    // check for auth initializtion
    checkAuth();

    // redirect authenticated users away from auth pages
    if(window.location.pathname.includes('login.html') ||
       window.location.pathname.includes('register.html')) {
        if (localStorage.getItem('token')) {
            window.location.href = 'blog.html';
        }
    }

    // login form submission from 
    const loginForm = document.getElementById('loginForm');
    if (loginForm){
        loginForm.addEventListener('submit', async function(e){
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementsById('login-password').value;
            try {
                const response = await makeRequest('auth/login', 'POST', {
                    username,
                    password
                });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('userId', response.data.user.id);
                // redirect to home page
                window.location.href = 'blog.html';
            } catch (error) {
                showError(error.message, loginForm);
            }
        });
    }

    //  register form submission 
    const registerForm = document.getElementById('registerForm');
    if (registerForm){
        //  password confirmation validation
        const passwordInput = document.getElementById('register-password');
        const confirmPasswordInput = document.getElementById('register-confirm-password');
        function validatePasswordMatch(){
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            if(password && confirmPassword){
                if (password !== confirmPassword){
                    confirmPasswordInput.setCustomValidity("Passwords do not match");
                    return false;
                } else {
                    confirmPasswordInput.setCustomValidity('');
                    return true;
                }
            }
            return false;
        }
        passwordInput.addEventListener('input', validatePasswordMatch);
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (!validatePasswordMatch()){
                showError("Passwords do not match", registerForm);
                return;
            }

            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            try {
                const response = await makeRequest('/auth/register', 'POST', {
                    username,email,password
                });
                // auto login after registration
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', response.data.user.username);
                localStorage.setItem('userId', response.data.user.id);

                // redirect to home page
                window.location.href = 'blog.html';
            } catch (error){
                showError(error.message, registerForm);
            }
        });
    }

    // forgot password 
    const forgotPasswordLink = document.getElementById('forgot-password');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPasswordModal.style.display = 'block';
        });
    }
    
    if (forgotPasswordModal) {
        const closeButtons = forgotPasswordModal.querySelectorAll('.close');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                forgotPasswordModal.style.display = 'none';
            });
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === forgotPasswordModal) {
                forgotPasswordModal.style.display = 'none';
            }
        });
    }
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('reset-email').value;
            
            try {
                await makeRequest('/auth/forgot-password', 'POST', {
                    email
                });
                
                alert('Password reset link has been sent to your email');
                forgotPasswordModal.style.display = 'none';
            } catch (error) {
                showError(error.message, forgotPasswordForm);
            }
        });
    }
});

// Show error message on form
function showError(message, formElement) {
    // Remove any existing error messages
    const existingError = formElement.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.style.color = 'var(--error-color)';
    errorElement.style.margin = '1rem 0';
    errorElement.style.textAlign = 'center';
    errorElement.textContent = message;
    
    // Insert after the form header or at the top of the form
    const formHeader = formElement.querySelector('h2');
    if (formHeader) {
        formHeader.insertAdjacentElement('afterend', errorElement);
    } else {
        formElement.insertAdjacentElement('afterbegin', errorElement);
    }
}