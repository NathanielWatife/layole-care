const DashboardController = {
  charts: {},
  data: {},

  async initialize() {
    try {
      this.showLoading(true);
      await this.loadData();
      this.renderDashboard();
      this.initializeCharts();
    } catch (error) {
      this.showError("Failed to load dashboard");
      console.error("Dashboard error:", error);
    } finally {
      this.showLoading(false);
    }
  },

  async loadData() {
    const { data } = await adminAuth.apiRequest("/dashboard/stats");
    if (data?.success) {
      this.data = data.data;
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
  },

  updateRecentAppointments() {
    const container = document.getElementById("recentAppointments");
    const appointments = this.data.recent?.appointments || [];
    
    container.innerHTML = appointments.length > 0
      ? appointments.map(app => this.createAppointmentItem(app)).join("")
      : '<div class="no-data">No recent appointments</div>';
  },

  createAppointmentItem(appointment) {
    return `
      <div class="appointment-item">
        <div class="item-info">
          <div class="item-name">${appointment.firstName} ${appointment.lastName}</div>
          <div class="item-details">
            ${appointment.department} • 
            ${adminAuth.formatDate(appointment.appointmentDate)}
          </div>
        </div>
        <div class="item-status status-${appointment.status}">
          ${appointment.status}
        </div>
      </div>
    `;
  },

  updateBadges() {
    const stats = this.data.overview || {};
    const pendingBadge = document.getElementById("pendingBadge");
    if (pendingBadge) {
      pendingBadge.textContent = stats.pendingAppointments || 0;
    }
  },

  initializeCharts() {
    this.initializeTrendChart();
    this.initializeStatusChart();
    this.initializeDepartmentChart();
  },

  initializeTrendChart() {
    const ctx = document.getElementById("appointmentsTrendChart");
    if (!ctx) return;

    this.charts.trend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Appointments',
          data: [12, 19, 3, 5, 2, 3, 8],
          borderColor: '#2c5aa0',
          backgroundColor: 'rgba(44, 90, 160, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  },

  initializeStatusChart() {
    const ctx = document.getElementById("statusDistributionChart");
    if (!ctx) return;

    this.charts.status = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Completed', 'Cancelled'],
        datasets: [{
          data: [12, 19, 3],
          backgroundColor: ['#ffc107', '#28a745', '#dc3545']
        }]
      }
    });
  },

  initializeDepartmentChart() {
    const ctx = document.getElementById("departmentChart");
    if (!ctx) return;

    this.charts.department = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Cardiology', 'Neurology', 'Pediatrics'],
        datasets: [{
          label: 'Appointments',
          data: [12, 19, 8],
          backgroundColor: '#17a2b8'
        }]
      },
      options: {
        plugins: { legend: { display: false } }
      }
    });
  },

  showLoading(show) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.style.display = show ? "flex" : "none";
  },

  showError(message) {
    adminAuth.showError(message);
  }
};

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("dashboard.html")) {
    DashboardController.initialize();
  }
});

// Export to window
window.dashboardController = DashboardController;