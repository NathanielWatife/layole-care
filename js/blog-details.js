document.addEventListener('DOMContentLoaded', function() {
    loadBlogDetails();
});

async function loadBlogDetails() {
    const blogId = getUrlParameter('id');
    if (!blogId) {
        window.location.href = 'blog.html';
        return;
    }
    
    try {
        const response = await makeRequest(`/api/blogs/${blogId}`);
        displayBlogDetails(response.blog);
    } catch (error) {
        console.error('Error loading blog:', error);
        document.getElementById('blog-post').innerHTML = `
            <div class="error-message">Error loading blog. It may not exist or is not published.</div>
            <a href="blog.html" class="btn">Back to Blogs</a>
        `;
    }
}

function displayBlogDetails(blog) {
    const blogPost = document.getElementById('blog-post');
    
    blogPost.innerHTML = `
        <h1>${blog.title}</h1>
        <p class="author">By ${blog.author}</p>
        ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="post-image">` : ''}
        <p class="description">${blog.description}</p>
        <div class="content">${formatBlogContent(blog.body)}</div>
        ${blog.tags?.length ? `
            <div class="blog-tags">
                ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        ` : ''}
        <div class="post-meta">
            <span>${blog.readTime} min read</span>
            <span>${blog.readCount} views</span>
            <span>${new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <div class="actions">
            <a href="blog.html" class="btn">Back to Blogs</a>
            <a href="create-blog.html?edit=${blog._id}" class="btn">Edit Post</a>
        </div>
    `;
}

function formatBlogContent(content) {
    return content.split('\n').map(paragraph => 
        `<p>${paragraph || '<br>'}</p>`
    ).join('');
}