// Cache for storing fetched articles (same as in blog.js)
let articlesCache = [];

document.addEventListener('DOMContentLoaded', () => {
    loadArticle();
});

async function loadArticle() {
    try {
        showLoading(true);
        
        // Get article ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        
        if (!articleId) {
            throw new Error('No article ID specified');
        }
        
        // Load articles if not already cached
        if (articlesCache.length === 0) {
            const medicalNews = await fetchMedicalNews();
            const healthTips = await fetchHealthTips();
            const diseaseInfo = await fetchDiseaseInfo();
            articlesCache = [...medicalNews, ...healthTips, ...diseaseInfo];
        }
        
        // Find the requested article
        const article = articlesCache.find(a => a.id === articleId);
        
        if (!article) {
            throw new Error('Article not found');
        }
        
        // Render the article
        renderArticle(article);
        
        // Load related articles
        loadRelatedArticles(article);
    } catch (error) {
        showError('Failed to load article. Please try again later.');
        console.error('Error loading article:', error);
    } finally {
        showLoading(false);
    }
}

// Same simulated API functions as in blog.js
async function fetchMedicalNews() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...]; // Same data as in blog.js
}

async function fetchHealthTips() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...]; // Same data as in blog.js
}

async function fetchDiseaseInfo() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...]; // Same data as in blog.js
}

function renderArticle(article) {
    const container = document.getElementById('blogArticle');
    
    container.innerHTML = `
        <div class="article-header">
            <h1>${article.title}</h1>
            <div class="article-meta">
                <span class="post-category">${article.category}</span>
                <span class="post-date">${formatDate(article.date)}</span>
                <span class="post-author">By ${article.author}</span>
            </div>
        </div>
        
        <div class="featured-image">
            <img src="${article.imageUrl}" alt="${article.title}">
        </div>
        
        <div class="article-content">
            ${article.content}
            
            <div class="article-footer">
                <div class="tags">
                    <span>Tags:</span>
                    <a href="blog.html?category=${article.category.toLowerCase().replace(' ', '-')}">${article.category}</a>
                    <a href="blog.html?category=health">Health</a>
                </div>
            </div>
        </div>
    `;
}

function loadRelatedArticles(currentArticle) {
    // Find articles in the same category, excluding the current one
    const related = articlesCache.filter(article => 
        article.category === currentArticle.category && 
        article.id !== currentArticle.id
    ).slice(0, 3); // Limit to 3 related articles
    
    const container = document.getElementById('relatedPosts');
    
    if (related.length === 0) {
        container.innerHTML = '<p>No related articles found.</p>';
        return;
    }
    
    container.innerHTML = related.map(article => `
        <div class="related-post">
            <a href="blog-single.html?id=${article.id}">
                <img src="${article.imageUrl}" alt="${article.title}">
                <h4>${article.title}</h4>
            </a>
        </div>
    `).join('');
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
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    const container = document.querySelector('.blog-single-container');
    if (container) {
        const existing = document.querySelector('.error-message');
        if (existing) existing.remove();
        
        container.insertBefore(errorElement, container.firstChild);
        setTimeout(() => errorElement.remove(), 5000);
    }
}