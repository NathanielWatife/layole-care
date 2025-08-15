document.addEventListener('DOMContentLoaded', function() {
    // Load blogs on index page
    if (document.getElementById('blogs-container')) {
        loadBlogs();
        
        // Set up search and filter
        const searchInput = document.getElementById('search-input');
        const tagFilter = document.getElementById('tag-filter');
        
        if (searchInput) {
            searchInput.addEventListener('input', debounce(loadBlogs, 300));
        }
        
        if (tagFilter) {
            tagFilter.addEventListener('change', loadBlogs);
        }
    }
    
    // Load single blog on details page
    if (document.getElementById('blog-post')) {
        loadBlogDetails();
    }
    
    // Handle blog creation form
    const blogForm = document.getElementById('blog-form');
    if (blogForm) {
        blogForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const title = document.getElementById('blog-title').value;
            const description = document.getElementById('blog-description').value;
            const tags = document.getElementById('blog-tags').value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);
            const body = document.getElementById('blog-body').value;
            const image = document.getElementById('blog-image').value;
            const state = document.getElementById('blog-state').value;
            
            try {
                const response = await makeRequest('/blogs', 'POST', {
                    title,
                    description,
                    tags,
                    body,
                    image,
                    state
                }, true);
                
                alert('Blog created successfully!');
                window.location.href = 'index.html';
            } catch (error) {
                alert(error.message);
            }
        });
    }
});

// Load all published blogs
async function loadBlogs() {
    try {
        const searchTerm = document.getElementById('search-input')?.value || '';
        const tagFilter = document.getElementById('tag-filter')?.value || '';
        
        let url = '/blogs';
        if (searchTerm || tagFilter) {
            url += '?';
            if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}`;
            if (tagFilter) url += `${searchTerm ? '&' : ''}tag=${encodeURIComponent(tagFilter)}`;
        }
        
        const response = await makeRequest(url);
        displayBlogs(response.blogs);
        
        // Update tag filter options
        updateTagFilter(response.blogs);
    } catch (error) {
        console.error('Error loading blogs:', error);
        document.getElementById('blogs-container').innerHTML = `
            <div class="error-message">Error loading blogs. Please try again later.</div>
        `;
    }
}

// Display blogs in the grid
function displayBlogs(blogs) {
    const blogsContainer = document.getElementById('blogs-container');
    
    if (!blogs || blogs.length === 0) {
        blogsContainer.innerHTML = `
            <div class="no-blogs">No blogs found. Try adjusting your search.</div>
        `;
        return;
    }
    
    blogsContainer.innerHTML = blogs.map(blog => `
        <div class="blog-card">
            ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="blog-image">` : ''}
            <div class="blog-content">
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-description">${blog.description}</p>
                <div class="blog-meta">
                    <span>${blog.readTime} min read</span>
                    <span>${new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                ${blog.tags && blog.tags.length > 0 ? `
                    <div class="blog-tags">
                        ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <a href="blog-details.html?id=${blog._id}" class="btn" style="display: block; margin-top: 1rem; text-align: center;">Read More</a>
            </div>
        </div>
    `).join('');
}

// Update tag filter dropdown
function updateTagFilter(blogs) {
    const tagFilter = document.getElementById('tag-filter');
    if (!tagFilter) return;
    
    // Get all unique tags
    const tags = new Set();
    blogs.forEach(blog => {
        if (blog.tags && blog.tags.length > 0) {
            blog.tags.forEach(tag => tags.add(tag));
        }
    });
    
    // Save current selection
    const currentValue = tagFilter.value;
    
    // Clear existing options (except first one)
    while (tagFilter.options.length > 1) {
        tagFilter.remove(1);
    }
    
    // Add new options
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
    
    // Restore selection if still available
    if (currentValue && Array.from(tags).includes(currentValue)) {
        tagFilter.value = currentValue;
    }
}

// Load single blog details
async function loadBlogDetails() {
    const blogId = getUrlParameter('id');
    if (!blogId) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        const response = await makeRequest(`/blogs/${blogId}`);
        displayBlogDetails(response.blog);
    } catch (error) {
        console.error('Error loading blog:', error);
        document.getElementById('blog-post').innerHTML = `
            <div class="error-message">Error loading blog. It may not exist or is not published.</div>
            <a href="index.html" class="btn">Back to Blogs</a>
        `;
    }
}

// Display single blog details
function displayBlogDetails(blog) {
    const blogPost = document.getElementById('blog-post');
    
    blogPost.innerHTML = `
        <h1>${blog.title}</h1>
        <p class="author">By ${blog.author}</p>
        ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="post-image">` : ''}
        <p class="description">${blog.description}</p>
        <div class="content">${formatBlogContent(blog.body)}</div>
        ${blog.tags && blog.tags.length > 0 ? `
            <div class="blog-tags">
                ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        ` : ''}
        <div class="post-meta">
            <span>${blog.readTime} min read</span>
            <span>${blog.readCount} views</span>
            <span>${new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <a href="index.html" class="btn">Back to Blogs</a>
    `;
}

// Format blog content (simple formatting for line breaks)
function formatBlogContent(content) {
    return content.split('\n').map(paragraph => 
        `<p>${paragraph || '<br>'}</p>`
    ).join('');
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}