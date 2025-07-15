document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('register-message');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Simulate registration (replace with API call)
        messageDiv.textContent = `Registered as ${username} (${email})!`;
        registerForm.reset();
    });
});