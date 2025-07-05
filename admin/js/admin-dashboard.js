const DashboardController = {
  async initialize() {
    try {
      if (!adminAuth || !adminAuth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
      }

      this.showLoading(true);
      
      const admin = await adminAuth.getAdminData();
      if (admin && admin.name) {
        document.getElementById('adminName').textContent = admin.name;
      }

      // Load only blog-related stats
      await Promise.all([
        this.loadBlogStats(),
        this.checkDraftBlogPosts(),
        this.loadRecentBlogActivity()
      ]);
      
    } catch (error) {
      this.showError("Failed to load dashboard. Please try again.");
      console.error("Dashboard initialization error:", error);
    } finally {
      this.showLoading(false);
    }
  },

  async loadBlogStats() {
    try {
      const response = await fetch('/api/v1/blogs/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to load blog stats');
      
      const stats = await response.json();
      this.updateBlogStats(stats);
    } catch (error) {
      console.error("Failed to load blog stats:", error);
      throw error;
    }
  },

  updateBlogStats(stats) {
    document.getElementById("totalPosts").textContent = stats.total || 0;
    document.getElementById("publishedPosts").textContent = stats.published || 0;
    document.getElementById("draftPosts").textContent = stats.drafts || 0;
    document.getElementById("weeklyPosts").textContent = stats.weekly || 0;
  },

  async loadRecentBlogActivity() {
    try {
      const response = await fetch('/api/v1/blogs/recent', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to load recent activity');
      
      const { posts } = await response.json();
      this.renderRecentBlogActivity(posts);
    } catch (error) {
      console.error("Failed to load recent blog activity:", error);
    }
  },

  renderRecentBlogActivity(posts) {
    const container = document.getElementById("recentBlogActivity");
    if (!posts || posts.length === 0) {
      container.innerHTML = '<div class="no-activity">No recent blog activity</div>';
      return;
    }
    
    container.innerHTML = posts.map(post => `
      <div class="activity-item">
        <div class="activity-meta">
          <span class="activity-date">${adminAuth.formatDate(post.updatedAt)}</span>
          <span class="activity-status ${post.status}">${post.status}</span>
        </div>
        <h4 class="activity-title">${post.title}</h4>
        <a href="blog-edit.html?id=${post._id}" class="activity-link">
          <i class="fas fa-edit"></i> Edit
        </a>
      </div>
    `).join('');
  }
};