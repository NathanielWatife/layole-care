// API routes
const API_BASE_URL = "https://layole-backend.onrender.com";
const BLOG_API_URL = `${API_BASE_URL}/api/blogs`;
const USER_API_URL = `${API_BASE_URL}/api/auth/me`;

document.addEventListener('DOMContentLoaded', function() {
    const postForm = document.getElementById('postForm');
    const postsContainer = document.querySelector('.posts-container');
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));

    // Check authentication
    if (!authToken) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize author field
    const authorInput = document.getElementById('author');
    if (authorInput && user) {
        authorInput.value = user.username;
    }

    // Helper functions
    function showLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        button.disabled = true;
        return () => {
            button.innerHTML = originalText;
            button.disabled = false;
        };
    }

    function showMessage(message, isError = false) {
        const messageDiv = document.getElementById('post-message');
        if (!messageDiv) return;
        
        messageDiv.textContent = message;
        messageDiv.style.color = isError ? '#dc3545' : '#28a745';
        messageDiv.style.margin = '10px 0';
        
        if (!isError) {
            setTimeout(() => messageDiv.textContent = '', 3000);
        }
    }

    // Handle post submission
    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = postForm.querySelector('button[type="submit"]');
            const resetLoading = showLoading(submitButton);

            try {
                const title = document.getElementById('title').value.trim();
                const content = document.getElementById('content').value.trim();
                const author = document.getElementById('author').value.trim();

                if (!title || !content) {
                    throw new Error('Title and content are required');
                }

                const response = await fetch(BLOG_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ title, content, author })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to create post');
                }

                showMessage('Post published successfully!');
                postForm.reset();
                fetchPosts();
            } catch (error) {
                console.error('Post creation error:', error);
                showMessage(error.message, true);
            } finally {
                resetLoading();
            }
        });
    }

    // Fetch and display posts
    async function fetchPosts() {
        try {
            const response = await fetch(BLOG_API_URL, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const posts = await response.json();
            renderPosts(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            postsContainer.innerHTML = `
                <div class="error-message">
                    Error loading posts. Please try again later.
                </div>
            `;
        }
    }

    // Render posts to the DOM
    function renderPosts(posts) {
        if (!postsContainer) return;
        
        if (!posts || posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts yet. Be the first to post!</p>';
            return;
        }

        postsContainer.innerHTML = posts.map(post => `
            <article class="post">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-meta">
                    <span class="post-author">By ${post.author}</span>
                    <span class="post-date">${new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="post-content">${post.content}</div>
            </article>
        `).join('');
    }

    // Initialize the blog
    fetchPosts();
});