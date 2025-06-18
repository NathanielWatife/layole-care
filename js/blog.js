// External APIs we'll use for medical content
const MEDICAL_NEWS_API = 'https://api.medicalnewstoday.com/v1/articles';
const HEALTH_TIPS_API = 'https://api.healthline.com/v1/tips';
const DISEASE_INFO_API = 'https://api.cdc.gov/v1/diseases';

// Cache for storing fetched articles
let articlesCache = [];
let currentCategory = 'all';
let currentSearch = '';
let currentPage = 1;
const articlesPerPage = 6;

document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
    setupEventListeners();
});

async function loadArticles() {
    try {
        showLoading(true);
        
        // Check if we have cached articles
        if (articlesCache.length === 0) {
            // Fetch from multiple APIs (in a real app, you would handle each API separately)
            // For demo purposes, we'll simulate fetching from different sources
            const medicalNews = await fetchMedicalNews();
            const healthTips = await fetchHealthTips();
            const diseaseInfo = await fetchDiseaseInfo();
            
            // Combine all articles
            articlesCache = [...medicalNews, ...healthTips, ...diseaseInfo];
        }
        
        // Filter articles based on category and search
        let filteredArticles = filterArticles(articlesCache);
        
        // Paginate results
        const paginatedArticles = paginateArticles(filteredArticles);
        
        // Render articles
        renderArticles(paginatedArticles);
        renderPagination(filteredArticles.length);
        
        // Load quick health tips
        loadQuickTips();
    } catch (error) {
        showError('Failed to load articles. Please try again later.');
        console.error('Error loading articles:', error);
    } finally {
        showLoading(false);
    }
}

// Simulated API calls (in a real app, you would make actual API calls)
async function fetchMedicalNews() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
        {
            id: '1',
            title: 'New Breakthrough in Cancer Treatment',
            excerpt: 'Researchers have discovered a promising new approach to treating advanced cancers.',
            content: '<p>Detailed content about the cancer treatment breakthrough...</p>',
            category: 'Medical Tips',
            date: '2025-05-15',
            imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
            author: 'Dr. Sarah Johnson'
        },
        {
            id: '2',
            title: 'The Future of Robotic Surgery',
            excerpt: 'How robotic assistance is transforming surgical procedures.',
            content: '<p>Detailed content about robotic surgery...</p>',
            category: 'Medical Tips',
            date: '2025-04-28',
            imageUrl: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=600',
            author: 'Dr. Michael Chen'
        }
    ];
}

async function fetchHealthTips() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
        {
            id: '3',
            title: '10 Daily Habits for Better Heart Health',
            excerpt: 'Simple changes you can make to improve your cardiovascular health.',
            content: '<p>Detailed content about heart health habits...</p>',
            category: 'Health Tips',
            date: '2025-05-10',
            imageUrl: 'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=600',
            author: 'Dr. Emily Wilson'
        },
        {
            id: '4',
            title: 'Managing Stress in a Busy World',
            excerpt: 'Effective techniques to reduce stress and improve mental wellbeing.',
            content: '<p>Detailed content about stress management...</p>',
            category: 'Health Tips',
            date: '2025-04-22',
            imageUrl: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=600',
            author: 'Dr. James Peterson'
        }
    ];
}

async function fetchDiseaseInfo() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
        {
            id: '5',
            title: 'Understanding Diabetes: Prevention and Management',
            excerpt: 'Comprehensive guide to diabetes symptoms, prevention and treatment.',
            content: '<p>Detailed content about diabetes...</p>',
            category: 'Diseases',
            date: '2025-05-05',
            imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600',
            author: 'Dr. Robert Taylor'
        },
        {
            id: '6',
            title: 'Seasonal Allergies: Causes and Remedies',
            excerpt: 'How to identify and manage common seasonal allergies.',
            content: '<p>Detailed content about seasonal allergies...</p>',
            category: 'Diseases',
            date: '2025-04-15',
            imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600',
            author: 'Dr. Lisa Rodriguez'
        }
    ];
}

function filterArticles(articles) {
    // Filter by category
    let filtered = articles;
    if (currentCategory !== 'all') {
        filtered = filtered.filter(article => article.category === currentCategory);
    }
    
    // Filter by search term
    if (currentSearch) {
        const searchTerm = currentSearch.toLowerCase();
        filtered = filtered.filter(article => 
            article.title.toLowerCase().includes(searchTerm) || 
            article.excerpt.toLowerCase().includes(searchTerm) ||
            article.content.toLowerCase().includes(searchTerm)
    }
    
    return filtered;
}

function paginateArticles(articles) {
    const startIndex = (currentPage - 1) * articlesPerPage;
    return articles.slice(startIndex, startIndex + articlesPerPage);
}

function renderArticles(articles) {
    const container = document.getElementById('blogPosts');
    
    if (!articles || articles.length === 0) {
        container.innerHTML = '<div class="no-posts">No articles found matching your criteria.</div>';
        return;
    }
    
    container.innerHTML = articles.map(article => `
        <article class="blog-post">
            <div class="post-image">
                <img src="${article.imageUrl}" alt="${article.title}">
            </div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-category">${article.category}</span>
                    <span class="post-date">${formatDate(article.date)}</span>
                </div>
                <h2><a href="blog-single.html?id=${article.id}">${article.title}</a></h2>
                <p class="post-excerpt">${article.excerpt}</p>
                <a href="blog-single.html?id=${article.id}" class="read-more">Read More</a>
            </div>
        </article>
    `).join('');
}

function renderPagination(totalArticles) {
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    const container = document.getElementById('blogPagination');
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    if (currentPage > 1) {
        html += `<button class="page-btn" data-page="${currentPage - 1}">Previous</button>`;
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
        html += `<button class="page-btn" data-page="${currentPage + 1}">Next</button>`;
    }
    
    container.innerHTML = html;
    
    // Add event listeners
    container.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            loadArticles();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function loadQuickTips() {
    const tips = [
        "Drink at least 8 glasses of water daily",
        "Get 7-8 hours of sleep each night",
        "Take a 5-minute break every hour if you sit for long",
        "Wash your hands frequently to prevent infections",
        "Include vegetables in every meal"
    ];
    
    const container = document.getElementById('quickTips');
    container.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
}

function setupEventListeners() {
    // Category filtering
    document.querySelectorAll('#blogCategories a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = link.dataset.category;
            currentPage = 1;
            
            // Update active state
            document.querySelectorAll('#blogCategories a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            
            loadArticles();
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('blogSearch');
    document.getElementById('searchBtn').addEventListener('click', () => {
        currentSearch = searchInput.value.trim();
        currentPage = 1;
        loadArticles();
    });
    
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            currentSearch = searchInput.value.trim();
            currentPage = 1;
            loadArticles();
        }
    });
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
    
    const container = document.querySelector('.blog-container');
    if (container) {
        const existing = document.querySelector('.error-message');
        if (existing) existing.remove();
        
        container.insertBefore(errorElement, container.firstChild);
        setTimeout(() => errorElement.remove(), 5000);
    }
}