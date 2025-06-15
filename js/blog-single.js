const API_BASE_URL = 'https://layole-backend.onrender.com/api/blogs';

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  
  if (slug) {
    loadBlogPost(slug);
    loadRelatedPosts(slug);
  } else {
    window.location.href = 'blog.html';
  }
});

async function loadBlogPost(slug) {
  try {
    showLoading(true);
    const response = await fetch(`${API_BASE_URL}/${slug}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const { data: post } = await response.json();
    renderBlogPost(post);
    updateMetaTags(post);
  } catch (error) {
    showError('Failed to load the article. Please try again later.');
    console.error('Post load error:', error);
  } finally {
    showLoading(false);
  }
}

function renderBlogPost(post) {
  const articleContainer = document.getElementById('blogArticle');
  if (!articleContainer) return;

  articleContainer.innerHTML = `
    <header class="article-header">
      <div class="article-meta">
        <span class="category">${post.categories.join(', ')}</span>
        <span class="date">${formatDate(post.publishedAt)}</span>
        <span class="author">By ${post.author.firstName} ${post.author.lastName}</span>
      </div>
      <h1>${post.title}</h1>
      <div class="featured-image">
        <img src="${post.featuredImage.url}" alt="${post.title}" loading="lazy">
      </div>
    </header>
    <div class="article-content">
      ${formatContent(post.content)}
    </div>
  `;
}

function formatContent(content) {
  // Simple formatting - in a real app you might use a Markdown parser
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

async function loadRelatedPosts(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}/${slug}/related`);
    if (!response.ok) return;
    
    const { data: relatedPosts } = await response.json();
    renderRelatedPosts(relatedPosts);
  } catch (error) {
    console.error('Related posts error:', error);
  }
}

function renderRelatedPosts(posts) {
  const relatedContainer = document.getElementById('relatedPosts');
  if (!relatedContainer || !posts || posts.length === 0) return;

  relatedContainer.innerHTML = posts.map(post => `
    <div class="related-post">
      <a href="blog-single.html?slug=${post.slug}">
        <img src="${post.featuredImage.url}" alt="${post.title}" loading="lazy">
        <h4>${post.title}</h4>
      </a>
    </div>
  `).join('');
}

function updateMetaTags(post) {
  document.title = `${post.title} | Layole Hospital`;
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.content = post.metaDescription || post.excerpt || post.title;
  }
  
  // Open Graph meta tags for social sharing
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = post.title;
  
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.content = post.metaDescription || post.excerpt || post.title;
  
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.content = post.featuredImage.url;
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function showLoading(show) {
  const loader = document.querySelector('.loading');
  if (loader) loader.style.display = show ? 'block' : 'none';
}

function showError(message) {
  const articleContainer = document.getElementById('blogArticle');
  if (articleContainer) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    articleContainer.appendChild(errorElement);
  }
}