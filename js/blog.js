const API_BASE_URL = 'https://layole-backend.onrender.com/api/blogs';
let currentPage = 1;
let currentCategory = 'all';
let currentSearch = '';

document.addEventListener('DOMContentLoaded', () => {
  loadBlogPosts();
  setupEventListeners();
});

async function loadBlogPosts() {
  try {
    showLoading(true);
    
    let url = `${API_BASE_URL}?page=${currentPage}`;
    if (currentCategory !== 'all') {
      url += `&category=${currentCategory}`;
    }
    if (currentSearch) {
      url += `&search=${encodeURIComponent(currentSearch)}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const { data: posts, pagination } = await response.json();
    renderBlogPosts(posts);
    renderPagination(pagination);
  } catch (error) {
    showError('Failed to load blog posts. Please try again later.');
    console.error('Blog load error:', error);
  } finally {
    showLoading(false);
  }
}

function renderBlogPosts(posts) {
  const postsContainer = document.getElementById('blogPosts');
  if (!postsContainer) return;

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = '<div class="no-posts">No articles found matching your criteria.</div>';
    return;
  }

  postsContainer.innerHTML = posts.map(post => `
    <article class="blog-post">
      <div class="post-image">
        <img src="${post.featuredImage.url}" alt="${post.title}" loading="lazy">
      </div>
      <div class="post-content">
        <div class="post-meta">
          <span class="post-category">${post.categories[0]}</span>
          <span class="post-date">${formatDate(post.publishedAt)}</span>
        </div>
        <h2><a href="blog-single.html?slug=${post.slug}">${post.title}</a></h2>
        <p class="post-excerpt">${post.excerpt || truncateText(post.content, 150)}</p>
        <a href="blog-single.html?slug=${post.slug}" class="read-more">Read More</a>
      </div>
    </article>
  `).join('');
}

function setupEventListeners() {
  // Category filtering
  document.querySelectorAll('#blogCategories a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#blogCategories a.active').classList.remove('active');
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      currentPage = 1;
      loadBlogPosts();
    });
  });

  // Search functionality
  const searchInput = document.getElementById('blogSearch');
  searchInput.addEventListener('keyup', debounce(() => {
    currentSearch = searchInput.value.trim();
    currentPage = 1;
    loadBlogPosts();
  }, 500));
}

// Utility functions
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function showLoading(show) {
  const loader = document.querySelector('.loading');
  if (loader) loader.style.display = show ? 'block' : 'none';
}

function showError(message) {
  const postsContainer = document.getElementById('blogPosts');
  if (postsContainer) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    postsContainer.appendChild(errorElement);
  }
}