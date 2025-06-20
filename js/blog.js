// API Configuration
const API_CONFIG = {
    newsapi: {
        url: 'https://newsapi.org/v2/top-headlines?category=health&apiKey=YOUR_NEWSAPI_KEY',
        enabled: true
    },
    cdc: {
        url: 'https://data.cdc.gov/resource/9mfq-cb36.json?$limit=10',
        enabled: true
    },
    who: {
        url: 'https://ghoapi.azureedge.net/api/Indicator?$top=5',
        enabled: true
    },
    healthgov: {
        url: 'https://health.gov/api/content/v1/topics.json',
        enabled: true
    }
};

// Global Variables
let allArticles = [];
let filteredArticles = [];
const articlesPerPage = 6;
let currentPage = 1;

// DOM Elements
const blogPostsEl = document.getElementById('blogPosts');
const paginationEl = document.getElementById('blogPagination');
const searchInput = document.getElementById('globalSearch');
const apiStatusEl = document.getElementById('apiStatus');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await checkAPIs();
    await loadAllArticles();
    setupEventListeners();
});

// API Health Check
async function checkAPIs() {
    apiStatusEl.innerHTML = '';
    for (const [source, config] of Object.entries(API_CONFIG)) {
        if (!config.enabled) continue;
        
        const li = document.createElement('li');
        try {
            const test = await fetch(config.url, { method: 'HEAD' });
            li.innerHTML = `<i class="fas fa-check-circle" style="color: green;"></i> ${source.toUpperCase()}`;
        } catch (error) {
            li.innerHTML = `<i class="fas fa-times-circle" style="color: red;"></i> ${source.toUpperCase()} (offline)`;
            API_CONFIG[source].enabled = false;
        }
        apiStatusEl.appendChild(li);
    }
}

// Fetch All APIs
async function loadAllArticles() {
    showLoading(true);
    
    try {
        const promises = [];
        if (API_CONFIG.newsapi.enabled) promises.push(fetchNewsAPI());
        if (API_CONFIG.cdc.enabled) promises.push(fetchCDC());
        if (API_CONFIG.who.enabled) promises.push(fetchWHO());
        if (API_CONFIG.healthgov.enabled) promises.push(fetchHealthGov());

        const results = await Promise.allSettled(promises);
        allArticles = results
            .filter(result => result.status === 'fulfilled')
            .flatMap(result => result.value);
            
        // Sort by date (newest first)
        allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        filteredArticles = [...allArticles];
        renderArticles();
    } catch (error) {
        showError('Failed to load articles. Please try again later.');
    } finally {
        showLoading(false);
    }
}

// Individual API Fetchers
async function fetchNewsAPI() {
    const response = await fetch(API_CONFIG.newsapi.url);
    const data = await response.json();
    return data.articles.map(article => ({
        id: `newsapi-${article.url.hashCode()}`,
        title: article.title,
        excerpt: article.description || "No description available",
        content: article.content || "Content not available",
        category: "Medical News",
        date: article.publishedAt,
        imageUrl: article.urlToImage || 'images/default-news.jpg',
        author: article.source?.name || "NewsAPI",
        source: "newsapi"
    }));
}

async function fetchCDC() {
    const response = await fetch(API_CONFIG.cdc.url);
    const data = await response.json();
    return data.map(item => ({
        id: `cdc-${item.id}`,
        title: `CDC Report: ${item.state || 'National Data'}`,
        excerpt: `New cases: ${item.new_case || 'Data not available'}`,
        content: JSON.stringify(item, null, 2),
        category: "Disease Reports",
        date: item.submission_date || new Date().toISOString(),
        imageUrl: 'images/cdc-logo.jpg',
        author: "Centers for Disease Control",
        source: "cdc"
    }));
}

async function fetchWHO() {
    const response = await fetch(API_CONFIG.who.url);
    const data = await response.json();
    return data.value.map(item => ({
        id: `who-${item.Id}`,
        title: `WHO: ${item.IndicatorName || 'Global Health Data'}`,
        excerpt: item.IndicatorCode || "World Health Organization data",
        content: JSON.stringify(item, null, 2),
        category: "Global Health",
        date: new Date().toISOString(),
        imageUrl: 'images/who-logo.jpg',
        author: "World Health Organization",
        source: "who"
    }));
}

async function fetchHealthGov() {
    const response = await fetch(API_CONFIG.healthgov.url);
    const data = await response.json();
    return data.items.map(item => ({
        id: `healthgov-${item.id}`,
        title: item.title,
        excerpt: item.description || "Prevention tips from health.gov",
        content: item.content || "See full article on health.gov",
        category: "Prevention Tips",
        date: item.last_updated,
        imageUrl: 'images/health-gov.jpg',
        author: "U.S. Department of Health",
        source: "healthgov"
    }));
}

// Render Articles
function renderArticles() {
    const startIdx = (currentPage - 1) * articlesPerPage;
    const paginatedArticles = filteredArticles.slice(startIdx, startIdx + articlesPerPage);
    
    blogPostsEl.innerHTML = paginatedArticles.map(article => `
        <article class="blog-post" data-source="${article.source}" data-category="${article.category}">
            <div class="post-image">
                <img src="${article.imageUrl}" alt="${article.title}" loading="lazy">
                <span class="source-badge">${article.source.toUpperCase()}</span>
            </div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-category">${article.category}</span>
                    <span class="post-date">${formatDate(article.date)}</span>
                </div>
                <h2><a href="blog-single.html?id=${article.id}&source=${article.source}">${article.title}</a></h2>
                <p class="post-excerpt">${article.excerpt}</p>
                <div class="post-footer">
                    <span class="post-author"><i class="fas fa-user"></i> ${article.author}</span>
                    <a href="blog-single.html?id=${article.id}&source=${article.source}" class="read-more">Read More</a>
                </div>
            </div>
        </article>
    `).join('');
    
    renderPagination();
}

// Search and Filter
function filterArticles() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeSource = document.querySelector('.api-filter.active').dataset.source;
    const activeCategory = document.querySelector('.categories a.active').dataset.category;
    
    filteredArticles = allArticles.filter(article => {
        const matchesSearch = searchTerm === '' || 
            article.title.toLowerCase().includes(searchTerm) || 
            article.excerpt.toLowerCase().includes(searchTerm);
        
        const matchesSource = activeSource === 'all' || article.source === activeSource;
        const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
        
        return matchesSearch && matchesSource && matchesCategory;
    });
    
    currentPage = 1;
    renderArticles();
}

// Pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }
    
    let html = '';
    if (currentPage > 1) {
        html += `<button class="page-btn" data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></button>`;
    }
    
    // Show limited page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    if (currentPage < totalPages) {
        html += `<button class="page-btn" data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></button>`;
    }
    
    paginationEl.innerHTML = html;
    
    // Add event listeners
    paginationEl.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            renderArticles();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Event Listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', debounce(filterArticles, 300));
    document.getElementById('searchBtn').addEventListener('click', filterArticles);
    
    // Source filters
    document.querySelectorAll('.api-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.api-filter').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterArticles();
        });
    });
    
    // Category filters
    document.querySelectorAll('.categories a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.categories a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            filterArticles();
        });
    });
}

// Helper Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function showLoading(show) {
    const loader = document.querySelector('.loading');
    if (loader) loader.style.display = show ? 'flex' : 'none';
}

function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    blogPostsEl.parentNode.insertBefore(errorEl, blogPostsEl.nextSibling);
    setTimeout(() => errorEl.remove(), 5000);
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Add hash code method for generating IDs
String.prototype.hashCode = function() {
    return this.split('').reduce((a,b) => {a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
};