document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const blogPostsContainer = document.getElementById('blogPosts');
    const searchInput = document.getElementById('blogSearch');
    const searchBtn = document.getElementById('searchBtn');
    const categoryLinks = document.querySelectorAll('.categories a');
    const paginationLinks = document.querySelectorAll('.pagination a');
    const subscribeForm = document.getElementById('subscribeForm');

    // Sample data (in a real app, this would come from a database via API)
    let blogPosts = [
        {
            id: 1,
            title: "10 Ways to Maintain a Healthy Heart",
            excerpt: "Learn about the best practices for cardiovascular health from our cardiology team...",
            category: "Prevention Tips",
            date: "June 15, 2023",
            image: "images/blog-post1.jpg",
            content: "Full content would be here..."
        },
        {
            id: 2,
            title: "New Pediatric Wing Now Open",
            excerpt: "Our hospital has expanded with a state-of-the-art pediatric care facility...",
            category: "Hospital News",
            date: "May 28, 2023",
            image: "images/blog-post2.jpg",
            content: "Full content would be here..."
        },
        {
            id: 3,
            title: "Understanding Diabetes",
            excerpt: "A comprehensive guide to managing diabetes from our endocrinology specialists...",
            category: "Medical Advice",
            date: "April 10, 2023",
            image: "images/blog-post3.jpg",
            content: "Full content would be here..."
        },
        {
            id: 4,
            title: "Seasonal Allergy Guide",
            excerpt: "How to cope with seasonal allergies and when to seek medical help...",
            category: "Prevention Tips",
            date: "March 22, 2023",
            image: "images/blog-post4.jpg",
            content: "Full content would be here..."
        },
        {
            id: 5,
            title: "Our New MRI Machine",
            excerpt: "We've upgraded our diagnostic imaging capabilities with the latest MRI technology...",
            category: "Hospital News",
            date: "February 15, 2023",
            image: "images/blog-post5.jpg",
            content: "Full content would be here..."
        }
    ];

    // Display all blog posts initially
    displayBlogPosts(blogPosts);

    // Search functionality
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase();
        filterPosts(searchTerm);
    });

    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.toLowerCase();
            filterPosts(searchTerm);
        }
    });

    // Category filtering
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });

    // Pagination
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            paginationLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, this would load the appropriate page of results
            // For now, we'll just scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Subscription form
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // In a real app, you would send this to your backend
            console.log('Subscribed email:', email);
            alert('Thank you for subscribing to our blog updates!');
            this.reset();
        });
    }

    // Function to display blog posts
    function displayBlogPosts(posts) {
        blogPostsContainer.innerHTML = '';
        
        if (posts.length === 0) {
            blogPostsContainer.innerHTML = '<p class="no-results">No blog posts found.</p>';
            return;
        }
        
        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'blog-post';
            postElement.innerHTML = `
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-date">${post.date}</span>
                        <span class="post-category">${post.category}</span>
                    </div>
                    <h2 class="post-title">${post.title}</h2>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <a href="post.html?id=${post.id}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            blogPostsContainer.appendChild(postElement);
        });
    }

    // Function to filter posts by search term
    function filterPosts(searchTerm) {
        if (!searchTerm) {
            displayBlogPosts(blogPosts);
            return;
        }
        
        const filteredPosts = blogPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            post.excerpt.toLowerCase().includes(searchTerm) ||
            post.category.toLowerCase().includes(searchTerm)
        );
        
        displayBlogPosts(filteredPosts);
    }

    // Function to filter posts by category
    function filterByCategory(category) {
        if (category === 'all') {
            displayBlogPosts(blogPosts);
            return;
        }
        
        const filteredPosts = blogPosts.filter(post => 
            post.category === category
        );
        
        displayBlogPosts(filteredPosts);
    }

    // In a real application, you would fetch posts from your API:
    /*
    async function fetchBlogPosts() {
        try {
            const response = await fetch('/api/blog-posts');
            const data = await response.json();
            blogPosts = data;
            displayBlogPosts(blogPosts);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            blogPostsContainer.innerHTML = '<p class="error">Failed to load blog posts. Please try again later.</p>';
        }
    }
    
    fetchBlogPosts();
    */
});