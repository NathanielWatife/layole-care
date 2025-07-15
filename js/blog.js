document.addEventListener('DOMContentLoaded', () => {
    const posts = [
        {
            title: "Welcome to Layole Blog",
            author: "Admin",
            content: "This is the first post on the Layole Blog.",
            date: new Date().toLocaleDateString()
        }
    ];

    const postsSection = document.getElementById('posts');
    const postForm = document.getElementById('postForm');

    function renderPosts() {
        postsSection.innerHTML = '<h2>Blog Posts</h2>';
        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.innerHTML = `
                <div class="post-title">${post.title}</div>
                <div class="post-meta">By ${post.author} on ${post.date}</div>
                <div class="post-content">${post.content}</div>
            `;
            postsSection.appendChild(postDiv);
        });
    }

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const author = document.getElementById('author').value;
        posts.unshift({
            title,
            content,
            author,
            date: new Date().toLocaleDateString()
        });
        renderPosts();
        postForm.reset();
    });

    renderPosts();
});



// login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('login-message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Simulate login (replace with API call)
        if (username && password) {
            messageDiv.textContent = `Logged in as ${username}!`;
        } else {
            messageDiv.textContent = 'Login failed. Please try again.';
            messageDiv.style.color = 'red';
        }
        loginForm.reset();
    });
});