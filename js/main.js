// API routes
const API_BASE_URL= "https://layole-backend.onrender.com"

// Utility function for making API requests
async function makeRequest(url, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        console.log(`Making ${method} request to: ${API_BASE_URL}${url}`);
        const response = await fetch(`${API_BASE_URL}${url}`, options);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Serve response error:', response.status.errorText);
            throw new Error(error.message || 'Something went wrong');

            let errorMessage = `Server error: ${response.status}`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage =  errorData.message || errorMessage;
            } catch (e) {
                errorMessage = errorData.message || errorMessage;
            }
            throw new Error(errorMessage);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        if (error.name === 'TypError' && error.message.includes('Failed to fetch')) {
            throw new Error('Caanot connect to the server. Please check your internet connection or try again later.');
        }
        throw error;
    }
}

// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Show message to user
function showMessage(message, type = 'error') {
    const messageElement = document.createElement('div');
    messageElement.className = `${type}-message`;
    messageElement.textContent = message;
    
    // Insert at the top of the main content
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(messageElement, main.firstChild);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => messageElement.remove(), 500);
        }, 5000);
    }
}