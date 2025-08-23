document.addEventListener('DOMContentLoaded', function() {
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
});

async function loadBlogs() {
    try {
        const searchTerm = document.getElementById('search-input')?.value || '';
        const tagFilter = document.getElementById('tag-filter')?.value || '';
        
        let url = '/api/blogs';
        const params = new URLSearchParams();
        
        if (searchTerm) params.append('search', searchTerm);
        if (tagFilter) params.append('tag', tagFilter);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await makeRequest(url);
        
        displayBlogs(response.blogs);
        updateTagFilter(response.blogs);
    } catch (error) {
        console.error('Error loading blogs:', error);
        document.getElementById('blogs-container').innerHTML = `
            <div class="error-message">Error loading blogs. Please try again later.</div>
        `;
    }
}

function displayBlogs(blogs) {
    const container = document.getElementById('blogs-container');
    
    if (!blogs || blogs.length === 0) {
        container.innerHTML = '<div class="no-blogs">No blogs found. Try adjusting your search.</div>';
        return;
    }
    
    container.innerHTML = blogs.map(blog => `
        <div class="blog-card">
            ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="blog-image">` : ''}
            <div class="blog-content">
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-description">${blog.description}</p>
                <div class="blog-meta">
                    <span>By ${blog.author}</span>
                    <span>${blog.readTime} min read</span>
                </div>
                ${blog.tags?.length ? `
                    <div class="blog-tags">
                        ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <a href="blog-details.html?id=${blog._id}" class="btn">Read More</a>
            </div>
        </div>
    `).join('');
}

function updateTagFilter(blogs) {
    const filter = document.getElementById('tag-filter');
    if (!filter) return;
    
    // Get all unique tags
    const tags = new Set();
    blogs.forEach(blog => {
        if (blog.tags) {
            blog.tags.forEach(tag => tags.add(tag));
        }
    });
    
    // Clear existing options (except first one)
    while (filter.options.length > 1) {
        filter.remove(1);
    }
    
    // Add new options
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        filter.appendChild(option);
    });
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}