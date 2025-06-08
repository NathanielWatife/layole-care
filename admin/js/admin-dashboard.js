// In initializeDashboard function:
async function initializeDashboard() {
  try {
    window.adminAuth.showLoading(true);
    await loadDashboardStats();
    initializeCharts();
    loadRecentAppointments(); // Renamed from loadRecentActivity
  } catch (error) {
    console.error("Dashboard initialization error:", error);
    window.adminAuth.showError("Failed to load dashboard data");
  } finally {
    window.adminAuth.showLoading(false);
  }
}

// Replace loadRecentActivity with:
async function loadRecentAppointments() {
  if (!window.dashboardData || !window.dashboardData.recentAppointments) return;

  const appointmentsList = document.getElementById("recentAppointments");
  if (appointmentsList) {
    appointmentsList.innerHTML =
      window.dashboardData.recentAppointments.length > 0
        ? window.dashboardData.recentAppointments.map(appointment => 
            createAppointmentItem(appointment)).join("")
        : '<div class="no-data">No recent appointments</div>';
  }
}

// Remove createContactItem function completely

// In initializeCharts function:
function initializeCharts() {
  if (!window.dashboardData) return;
  
  // Remove any contact-related chart initialization
  initializeAppointmentsTrendChart();
  initializeStatusDistributionChart();
  initializeDepartmentChart();
  initializePeakHoursChart();
}