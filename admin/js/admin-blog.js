const API_BASE_URL = 'https://layole-backend.onrender.com/api/blogs';
let currentPage = 1;
let currentStatus = 'all';
let currentSearch = '';

document.addEventListener('DOMContentLoaded', () => {
  checkAuthAndLoad();
  setupEventListeners();
});

async function checkAuthAndLoad() {
  try {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
    
    await loadBlogPosts();
    setupEventListeners();
  } catch (error) {
    console.error('Initialization error:', error);
    showError('Failed to initialize. Please try again.');
  }
}

async function loadBlogPosts() {
  try {
    showLoading(true);
    
    let url = `${API_BASE_URL}/admin?page=${currentPage}`;
    if (currentStatus !== 'all') url += `&status=${currentStatus}`;
    if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')}`
      }
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const { data: posts, pagination } = await response.json();
    renderBlogPosts(posts);
    renderPagination(pagination);
  } catch (error) {
    if (error.message.includes('401')) {
      logout();
    } else {
      showError('Failed to load blog posts. Please try again later.');
      console.error('Admin blog load error:', error);
    }
  } finally {
    showLoading(false);
  }
}

function renderBlogPosts(posts) {
  const postsContainer = document.getElementById('blogList');
  if (!postsContainer) return;

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = '<div class="no-posts">No blog posts found.</div>';
    return;
  }

  postsContainer.innerHTML = posts.map(post => `
    <div class="blog-post-card ${post.status}">
      <div class="post-image">
        <img src="${post.featuredImage.url}" alt="${post.title}" loading="lazy">
      </div>
      <div class="post-info">
        <h3>${post.title}</h3>
        <div class="post-meta">
          <span class="status ${post.status}">${post.status}</span>
          <span class="date">${formatDate(post.publishedAt || post.createdAt)}</span>
          <span class="author">${post.author.firstName} ${post.author.lastName}</span>
        </div>
        <div class="post-actions">
          <button class="btn-edit" data-id="${post._id}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn-delete" data-id="${post._id}">
            <i class="fas fa-trash"></i> Delete
          </button>
          <a href="../blog-single.html?slug=${post.slug}" class="btn-view" target="_blank">
            <i class="fas fa-eye"></i> View
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

function setupEventListeners() {
  // New post button
  document.getElementById('newPostBtn').addEventListener('click', () => {
    openBlogEditor();
  });

  // Filters
  document.getElementById('statusFilter').addEventListener('change', (e) => {
    currentStatus = e.target.value;
    currentPage = 1;
    loadBlogPosts();
  });

  // Search functionality
  const searchInput = document.getElementById('blogSearch');
  searchInput.addEventListener('keyup', debounce(() => {
    currentSearch = searchInput.value.trim();
    currentPage = 1;
    loadBlogPosts();
  }, 500));

  // Edit/Delete buttons (delegated)
  document.getElementById('blogList').addEventListener('click', (e) => {
    if (e.target.closest('.btn-edit')) {
      const postId = e.target.closest('.btn-edit').dataset.id;
      editBlogPost(postId);
    }
    
    if (e.target.closest('.btn-delete')) {
      const postId = e.target.closest('.btn-delete').dataset.id;
      deleteBlogPost(postId);
    }
  });

  // Form submission
  document.getElementById('blogForm').addEventListener('submit', handleFormSubmit);
}

async function editBlogPost(postId) {
  try {
    showLoading(true);
    const response = await fetch(`${API_BASE_URL}/${postId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')}`
      }
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const { data: post } = await response.json();
    openBlogEditor(post);
  } catch (error) {
    showError('Failed to load post for editing.');
    console.error('Edit post error:', error);
  } finally {
    showLoading(false);
  }
}

function openBlogEditor(post = null) {
  const modal = document.getElementById('blogEditorModal');
  const form = document.getElementById('blogForm');
  
  if (post) {
    // Edit existing post
    document.getElementById('modalTitle').textContent = 'Edit Blog Post';
    document.getElementById('postId').value = post._id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postContent').value = post.content;
    document.getElementById('postExcerpt').value = post.excerpt || '';
    document.getElementById('postStatus').value = post.status;
    
    if (post.publishedAt) {
      const date = new Date(post.publishedAt);
      const localDateTime = date.toISOString().slice(0, 16);
      document.getElementById('postDate').value = localDateTime;
    }
    
    // Image preview
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = `
      <img src="${post.featuredImage.url}" alt="Current featured image">
      <small>Current image</small>
    `;
    
    // Categories
    renderCategories(post.categories);
  } else {
    // New post
    document.getElementById('modalTitle').textContent = 'New Blog Post';
    form.reset();
    document.getElementById('imagePreview').innerHTML = '';
    renderCategories();
  }
  
  modal.style.display = 'block';
}

function closeBlogEditor() {
  document.getElementById('blogEditorModal').style.display = 'none';
}

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const postId = document.getElementById('postId').value;
  
  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    
    const formData = new FormData();
    formData.append('title', document.getElementById('postTitle').value);
    formData.append('content', document.getElementById('postContent').value);
    formData.append('excerpt', document.getElementById('postExcerpt').value);
    formData.append('status', document.getElementById('postStatus').value);
    
    const publishDate = document.getElementById('postDate').value;
    if (publishDate) {
      formData.append('publishedAt', new Date(publishDate).toISOString());
    }
    
    // Selected categories
    const selectedCategories = [];
    document.querySelectorAll('#categoryCheckboxes input:checked').forEach(checkbox => {
      selectedCategories.push(checkbox.value);
    });
    formData.append('categories', JSON.stringify(selectedCategories));
    
    // Image file if selected
    const imageInput = document.getElementById('postImage');
    if (imageInput.files[0]) {
      formData.append('featuredImage', imageInput.files[0]);
    }
    
    const url = postId ? `${API_BASE_URL}/${postId}` : API_BASE_URL;
    const method = postId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to save post');
    }
    
    showSuccess('Blog post saved successfully!');
    closeBlogEditor();
    loadBlogPosts();
  } catch (error) {
    showError(error.message || 'Failed to save blog post.');
    console.error('Save post error:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Post';
  }
}

async function deleteBlogPost(postId) {
  if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
  
  try {
    showLoading(true);
    const response = await fetch(`${API_BASE_URL}/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken')}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete post');
    }
    
    showSuccess('Post deleted successfully!');
    loadBlogPosts();
  } catch (error) {
    showError(error.message || 'Failed to delete post.');
    console.error('Delete post error:', error);
  } finally {
    showLoading(false);
  }
}

function renderCategories(selectedCategories = []) {
  const categories = ['Health Tips', 'Medical News', 'Patient Stories', 'Prevention', 'Treatment'];
  const container = document.getElementById('categoryCheckboxes');
  
  container.innerHTML = categories.map(category => `
    <label>
      <input type="checkbox" value="${category}" 
        ${selectedCategories.includes(category) ? 'checked' : ''}>
      ${category}
    </label>
  `).join('');
}

function renderPagination(pagination) {
  const container = document.getElementById('blogPagination');
  if (!container || !pagination) return;
  
  let html = '';
  
  if (pagination.page > 1) {
    html += `<button class="page-btn" data-page="${pagination.page - 1}">Previous</button>`;
  }
  
  for (let i = 1; i <= pagination.pages; i++) {
    html += `<button class="page-btn ${i === pagination.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  
  if (pagination.page < pagination.pages) {
    html += `<button class="page-btn" data-page="${pagination.page + 1}">Next</button>`;
  }
  
  container.innerHTML = html;
  
  // Add event listeners to pagination buttons
  container.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      loadBlogPosts();
    });
  });
}

function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
  sessionStorage.removeItem('adminToken');
  sessionStorage.removeItem('adminData');
  window.location.href = 'login.html';
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
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
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  
  const container = document.querySelector('.admin-content');
  if (container) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(el => el.remove());
    
    container.insertBefore(errorElement, container.firstChild);
    setTimeout(() => errorElement.remove(), 5000);
  }
}

function showSuccess(message) {
  const successElement = document.createElement('div');
  successElement.className = 'success-message';
  successElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  
  const container = document.querySelector('.admin-content');
  if (container) {
    // Remove existing success messages
    const existingSuccess = document.querySelectorAll('.success-message');
    existingSuccess.forEach(el => el.remove());
    
    container.insertBefore(successElement, container.firstChild);
    setTimeout(() => successElement.remove(), 5000);
  }
}