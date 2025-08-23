document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('blog-form');
    if (form) {
        // Check if we're editing an existing blog
        const blogId = getUrlParameter('edit');
        if (blogId) {
            loadBlogForEditing(blogId);
        }
        
        form.addEventListener('submit', handleFormSubmit);
    }
});

async function loadBlogForEditing(blogId) {
    try {
        const response = await makeRequest(`/api/blogs/${blogId}`);
        const blog = response.blog;
        
        document.getElementById('blog-title').value = blog.title;
        document.getElementById('blog-author').value = blog.author;
        document.getElementById('blog-description').value = blog.description;
        document.getElementById('blog-tags').value = blog.tags?.join(', ') || '';
        document.getElementById('blog-image').value = blog.image || '';
        document.getElementById('blog-body').value = blog.body;
        
        // Update form title and button
        document.querySelector('h2').textContent = 'Edit Blog Post';
        document.querySelector('button[type="submit"]').textContent = 'Update Post';
        
        // Store blog ID in form dataset
        form.dataset.blogId = blogId;
    } catch (error) {
        showMessage('Failed to load blog for editing: ' + error.message);
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    try {
        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Publishing...';
        
        const blogData = {
            title: document.getElementById('blog-title').value,
            author: document.getElementById('blog-author').value,
            description: document.getElementById('blog-description').value,
            tags: document.getElementById('blog-tags').value,
            image: document.getElementById('blog-image').value,
            body: document.getElementById('blog-body').value
        };
        
        // Determine if we're creating or updating
        const blogId = form.dataset.blogId;
        let response;
        
        if (blogId) {
            // Update existing blog
            response = await makeRequest(`/api/blogs/${blogId}`, 'PUT', blogData);
            showMessage('Blog updated successfully!', 'success');
        } else {
            // Create new blog
            response = await makeRequest('/api/blogs', 'POST', blogData);
            showMessage('Blog published successfully!', 'success');
        }
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = `blog-details.html?id=${response.blog._id}`;
        }, 1500);
    } catch (error) {
        showMessage('Error: ' + error.message);
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}