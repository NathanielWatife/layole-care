import { Chart } from "@/components/ui/chart"
// Admin Dashboard JavaScript

const dashboardCharts = {}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  if (window.adminAuth.checkAuth()) {
    initializeDashboard()
  }
})

// Initialize dashboard components
async function initializeDashboard() {
  try {
    window.adminAuth.showLoading(true)

    // Load dashboard data
    await Promise.all([loadDashboardStats(), loadRecentActivity()])

    // Initialize charts
    initializeCharts()
  } catch (error) {
    console.error("Dashboard initialization error:", error)
    window.adminAuth.showError("Failed to load dashboard data")
  } finally {
    window.adminAuth.showLoading(false)
  }
}

// Load dashboard statistics
async function loadDashboardStats() {
  try {
    const result = await window.adminAuth.apiRequest("/dashboard/stats")
    if (result && result.data.success) {
      updateStatsCards(result.data.data.overview)
      updateBadges(result.data.data.overview)

      // Store chart data for later use
      window.dashboardData = result.data.data
    }
  } catch (error) {
    console.error("Error loading dashboard stats:", error)
    throw error
  }
}

// Update stats cards
function updateStatsCards(stats) {
  // Total appointments
  document.getElementById("totalAppointments").textContent = stats.totalAppointments || 0
  document.getElementById("weeklyIncrease").textContent = stats.thisWeekAppointments || 0

  // Pending appointments
  document.getElementById("pendingAppointments").textContent = stats.pendingAppointments || 0
  document.getElementById("todayAppointments").textContent = stats.todayAppointments || 0

  // Completed appointments
  document.getElementById("completedAppointments").textContent = stats.completedAppointments || 0
  const completionRate =
    stats.totalAppointments > 0 ? Math.round((stats.completedAppointments / stats.totalAppointments) * 100) : 0
  document.getElementById("completionRate").textContent = completionRate

  // Cancelled appointments
  document.getElementById("cancelledAppointments").textContent = stats.cancelledAppointments || 0
  const cancellationRate =
    stats.totalAppointments > 0 ? Math.round((stats.cancelledAppointments / stats.totalAppointments) * 100) : 0
  document.getElementById("cancellationRate").textContent = cancellationRate
}

// Update navigation badges
function updateBadges(stats) {
  const pendingBadge = document.getElementById("pendingBadge")
  const messagesBadge = document.getElementById("messagesBadge")

  if (pendingBadge) {
    pendingBadge.textContent = stats.pendingAppointments || 0
    pendingBadge.style.display = stats.pendingAppointments > 0 ? "inline" : "none"
  }

  if (messagesBadge) {
    messagesBadge.textContent = stats.newContacts || 0
    messagesBadge.style.display = stats.newContacts > 0 ? "inline" : "none"
  }
}

// Load recent activity
async function loadRecentActivity() {
  if (!window.dashboardData || !window.dashboardData.recent) return

  const { appointments, contacts } = window.dashboardData.recent

  // Update recent appointments
  const appointmentsList = document.getElementById("recentAppointments")
  if (appointmentsList && appointments) {
    appointmentsList.innerHTML =
      appointments.length > 0
        ? appointments.map((appointment) => createAppointmentItem(appointment)).join("")
        : '<div class="no-data">No recent appointments</div>'
  }

  // Update recent contacts
  const contactsList = document.getElementById("recentContacts")
  if (contactsList && contacts) {
    contactsList.innerHTML =
      contacts.length > 0
        ? contacts.map((contact) => createContactItem(contact)).join("")
        : '<div class="no-data">No recent messages</div>'
  }
}

// Create appointment item HTML
function createAppointmentItem(appointment) {
  const statusClass = `status-${appointment.status}`
  const formattedDate = window.adminAuth.formatDate(appointment.appointmentDate)
  const formattedTime = window.adminAuth.formatTime(appointment.appointmentTime)
  const department = window.adminAuth.formatDepartment(appointment.department)

  return `
        <div class="appointment-item">
            <div class="item-info">
                <div class="item-name">${appointment.firstName} ${appointment.lastName}</div>
                <div class="item-details">${department} • ${formattedDate} at ${formattedTime}</div>
            </div>
            <div class="item-status ${statusClass}">${appointment.status}</div>
        </div>
    `
}

// Create contact item HTML
function createContactItem(contact) {
  const statusClass = `status-${contact.status}`
  const formattedDate = window.adminAuth.formatDate(contact.createdAt)
  const subject = window.adminAuth.formatDepartment(contact.subject)

  return `
        <div class="contact-item">
            <div class="item-info">
                <div class="item-name">${contact.firstName} ${contact.lastName}</div>
                <div class="item-details">${subject} • ${formattedDate}</div>
            </div>
            <div class="item-status ${statusClass}">${contact.status}</div>
        </div>
    `
}

// Initialize all charts
function initializeCharts() {
  if (!window.dashboardData || !window.dashboardData.charts) return

  const { charts } = window.dashboardData

  // Initialize each chart
  initializeAppointmentsTrendChart(charts.appointmentsTrend)
  initializeStatusDistributionChart(charts.appointmentsByStatus)
  initializeDepartmentChart(charts.appointmentsByDepartment)
  initializePeakHoursChart()
}

// Initialize appointments trend chart
function initializeAppointmentsTrendChart(trendData) {
  const ctx = document.getElementById("appointmentsTrendChart")
  if (!ctx) return

  // Prepare data for last 7 days
  const last7Days = []
  const counts = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    last7Days.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }))

    const dayData = trendData.find((item) => item._id === dateStr)
    counts.push(dayData ? dayData.count : 0)
  }

  dashboardCharts.trendChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: last7Days,
      datasets: [
        {
          label: "Appointments",
          data: counts,
          borderColor: "#2c5aa0",
          backgroundColor: "rgba(44, 90, 160, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  })
}

// Initialize status distribution chart
function initializeStatusDistributionChart(statusData) {
  const ctx = document.getElementById("statusDistributionChart")
  if (!ctx) return

  const labels = statusData.map((item) => item._id.charAt(0).toUpperCase() + item._id.slice(1))
  const data = statusData.map((item) => item.count)
  const colors = ["#ffc107", "#17a2b8", "#28a745", "#dc3545"]

  dashboardCharts.statusChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  })
}

// Initialize department chart
function initializeDepartmentChart(departmentData) {
  const ctx = document.getElementById("departmentChart")
  if (!ctx) return

  const labels = departmentData.map((item) => window.adminAuth.formatDepartment(item._id))
  const data = departmentData.map((item) => item.count)

  dashboardCharts.departmentChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Appointments",
          data: data,
          backgroundColor: "#2c5aa0",
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  })
}

// Initialize peak hours chart
function initializePeakHoursChart() {
  const ctx = document.getElementById("peakHoursChart")
  if (!ctx) return

  // Sample data for peak hours
  const hours = ["9:00", "10:00", "11:00", "12:00", "2:00", "3:00", "4:00", "5:00"]
  const appointments = [12, 19, 15, 8, 14, 22, 18, 10]

  dashboardCharts.peakHoursChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: hours,
      datasets: [
        {
          label: "Appointments",
          data: appointments,
          backgroundColor: "#17a2b8",
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  })
}

// Update trend chart based on period selection
async function updateTrendChart() {
  const period = document.getElementById("trendPeriod").value

  try {
    const result = await window.adminAuth.apiRequest(`/dashboard/appointments-analytics?period=${period}`)
    if (result && result.data.success) {
      const { appointmentsByDate } = result.data.data

      // Update chart data
      if (dashboardCharts.trendChart) {
        const labels = appointmentsByDate.map((item) => {
          const date = new Date(item._id)
          return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        })
        const data = appointmentsByDate.map((item) => item.total)

        dashboardCharts.trendChart.data.labels = labels
        dashboardCharts.trendChart.data.datasets[0].data = data
        dashboardCharts.trendChart.update()
      }
    }
  } catch (error) {
    console.error("Error updating trend chart:", error)
    window.adminAuth.showError("Failed to update chart data")
  }
}

// Refresh dashboard data
async function refreshDashboard() {
  try {
    window.adminAuth.showLoading(true)
    await initializeDashboard()
    window.adminAuth.showError("Dashboard refreshed successfully")
  } catch (error) {
    window.adminAuth.showError("Failed to refresh dashboard")
  } finally {
    window.adminAuth.showLoading(false)
  }
}

// Auto-refresh dashboard every 5 minutes
setInterval(refreshDashboard, 5 * 60 * 1000)
