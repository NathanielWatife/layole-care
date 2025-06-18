const DashboardController = {
  charts: {},
  data: {},

  async initialize() {
    try {
      // Verify authentication first
      if (!adminAuth || !adminAuth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
      }

      this.showLoading(true);
      
      // Load admin name if available
      const admin = adminAuth.getCurrentUser();
      if (admin && admin.username) {
        document.getElementById('adminName').textContent = admin.username;
      }

      await this.loadData();
      this.renderDashboard();
      this.initializeCharts();
    } catch (error) {
      this.showError("Failed to load dashboard. Please try again.");
      console.error("Dashboard initialization error:", error);
    } finally {
      this.showLoading(false);
    }
  },

  async loadData() {
    try {
      const response = await adminAuth.apiRequest("/dashboard/stats");
      if (response?.data?.success) {
        this.data = response.data.data;
      } else {
        throw new Error(response?.data?.message || "Invalid data received");
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      throw error;
    }
  },

  renderDashboard() {
    this.updateStats();
    this.updateRecentAppointments();
    this.updateBadges();
  },

  updateStats() {
    const stats = this.data.overview || {};
    document.getElementById("totalAppointments").textContent = stats.totalAppointments || 0;
    document.getElementById("pendingAppointments").textContent = stats.pendingAppointments || 0;
    document.getElementById("completedAppointments").textContent = stats.completedAppointments || 0;
    document.getElementById("cancelledAppointments").textContent = stats.cancelledAppointments || 0;
    
    // Update additional stats if available
    if (stats.weeklyIncrease) {
      document.getElementById("weeklyIncrease").textContent = stats.weeklyIncrease;
    }
    if (stats.todayAppointments) {
      document.getElementById("todayAppointments").textContent = stats.todayAppointments;
    }
    if (stats.completionRate) {
      document.getElementById("completionRate").textContent = stats.completionRate.toFixed(1);
    }
    if (stats.cancellationRate) {
      document.getElementById("cancellationRate").textContent = stats.cancellationRate.toFixed(1);
    }
  },

  updateRecentAppointments() {
    const container = document.getElementById("recentAppointments");
    const appointments = this.data.recent?.appointments || [];
    
    container.innerHTML = appointments.length > 0
      ? appointments.map(app => this.createAppointmentItem(app)).join("")
      : '<div class="no-data">No recent appointments</div>';
  },

  createAppointmentItem(appointment) {
    const formattedDate = appointment.appointmentDate 
      ? adminAuth.formatDate(appointment.appointmentDate) 
      : 'N/A';
    
    return `
      <div class="appointment-item">
        <div class="item-info">
          <div class="item-name">${appointment.firstName || ''} ${appointment.lastName || ''}</div>
          <div class="item-details">
            ${appointment.department || 'No department'} • 
            ${formattedDate}
          </div>
        </div>
        <div class="item-status status-${appointment.status?.toLowerCase() || 'pending'}">
          ${appointment.status || 'Pending'}
        </div>
      </div>
    `;
  },

  updateBadges() {
    const stats = this.data.overview || {};
    const pendingBadge = document.getElementById("pendingBadge");
    const messagesBadge = document.getElementById("messagesBadge");
    
    if (pendingBadge) {
      pendingBadge.textContent = stats.pendingAppointments || 0;
    }
    if (messagesBadge && stats.unreadMessages) {
      messagesBadge.textContent = stats.unreadMessages;
    }
  },

  initializeCharts() {
    this.initializeTrendChart();
    this.initializeStatusChart();
    this.initializeDepartmentChart();
    this.initializePeakHoursChart();
  },

  initializeTrendChart() {
    const ctx = document.getElementById("appointmentsTrendChart");
    if (!ctx) return;

    const trendData = this.data.trend || {};
    const labels = trendData.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dataPoints = trendData.data || [0, 0, 0, 0, 0, 0, 0];

    this.charts.trend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Appointments',
          data: dataPoints,
          borderColor: '#2c5aa0',
          backgroundColor: 'rgba(44, 90, 160, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  },

  initializeStatusChart() {
    const ctx = document.getElementById("statusDistributionChart");
    if (!ctx) return;

    const statusData = this.data.statusDistribution || {};
    const labels = statusData.labels || ['Pending', 'Completed', 'Cancelled'];
    const dataPoints = statusData.data || [0, 0, 0];

    this.charts.status = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataPoints,
          backgroundColor: ['#ffc107', '#28a745', '#dc3545'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  },

  initializeDepartmentChart() {
    const ctx = document.getElementById("departmentChart");
    if (!ctx) return;

    const deptData = this.data.departmentDistribution || {};
    const labels = deptData.labels || ['Cardiology', 'Neurology', 'Pediatrics'];
    const dataPoints = deptData.data || [0, 0, 0];

    this.charts.department = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Appointments',
          data: dataPoints,
          backgroundColor: '#17a2b8',
          borderColor: '#117a8b',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  },

  initializePeakHoursChart() {
    const ctx = document.getElementById("peakHoursChart");
    if (!ctx) return;

    const hoursData = this.data.peakHours || {};
    const labels = hoursData.labels || ['8AM', '10AM', '12PM', '2PM', '4PM'];
    const dataPoints = hoursData.data || [0, 0, 0, 0, 0];

    this.charts.peakHours = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Appointments',
          data: dataPoints,
          backgroundColor: 'rgba(23, 162, 184, 0.7)',
          borderColor: '#117a8b',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  },

  updateTrendChart() {
    const period = document.getElementById("trendPeriod").value;
    // In a real implementation, you would fetch new data based on the period
    console.log("Updating trend chart for period:", period);
    // You would typically make an API call here to get data for the selected period
  },

  showLoading(show) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.style.display = show ? "flex" : "none";
  },

  showError(message) {
    if (adminAuth && adminAuth.showError) {
      adminAuth.showError(message);
    } else {
      console.error("Error:", message);
      alert(message); // Fallback if adminAuth is not available
    }
  }
};

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("dashboard.html")) {
    DashboardController.initialize();
  }
});

// Make sure the updateTrendChart function is available globally
window.updateTrendChart = () => DashboardController.updateTrendChart();

// Export to window
window.dashboardController = DashboardController;