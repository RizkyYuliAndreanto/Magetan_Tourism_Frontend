<template>
  <div class="admin-dashboard-container">
    <div class="header-container">
      <h2 class="page-title">
        <i class="fas fa-tachometer-alt"></i>
        Dashboard Admin
      </h2>
      <p class="page-subtitle">
        Selamat datang di panel administrasi Magetan Tourism. Pantau dan kelola
        semua konten website Anda dari sini.
      </p>
    </div>

    <div v-if="error" class="error-banner">
      <i class="fas fa-exclamation-triangle"></i>
      {{ error }}
      <div v-if="error.includes('Sesi login')" class="error-actions">
        <button @click="goToLogin" class="login-button">
          <i class="fas fa-sign-in-alt"></i>
          Login
        </button>
      </div>
    </div>

    <!-- Content Overview Component -->
    <ContentOverview />

    <div class="recent-activity">
      <div class="activity-header">
        <h3 class="section-title">Aktivitas Terbaru</h3>
        <button
          @click="refreshDashboard"
          class="refresh-button"
          :disabled="loading">
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
          {{ loading ? "Memuat..." : "Refresh" }}
        </button>
      </div>
      <div class="activity-card-list">
        <div v-if="loading" class="activity-loading">Memuat aktivitas...</div>
        <div v-else-if="recentActivity.length === 0" class="activity-empty">
          Belum ada aktivitas.
        </div>
        <div
          v-else
          v-for="activity in recentActivity"
          :key="activity.id"
          class="activity-card">
          <div :class="['activity-icon', activity.type]">
            <i :class="activity.iconClass"></i>
          </div>
          <div class="activity-content">
            <p class="activity-message">{{ activity.message }}</p>
            <span class="activity-timestamp">{{ activity.timestamp }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ContentOverview from "./ContentOverview.vue";
import axios from "axios";

const error = ref(null);
const loading = ref(false);
const recentActivity = ref([]);

// Function untuk redirect ke login
function goToLogin() {
  // You can implement router navigation here
  console.log("Redirecting to login...");
  // router.push('/admin/login');
}

// Function untuk refresh dashboard
function refreshDashboard() {
  loading.value = true;
  fetchRecentActivity();
  setTimeout(() => {
    loading.value = false;
    console.log("Dashboard refreshed");
  }, 1000);
}

// Function untuk fetch aktivitas terbaru
const fetchRecentActivity = async () => {
  try {
    // Simulasi data aktivitas terbaru
    // Pada implementasi nyata, ini akan mengambil data dari API log aktivitas
    const mockActivities = [
      {
        id: 1,
        type: "create",
        iconClass: "fas fa-plus",
        message: "Menambahkan destinasi wisata baru: Candi Penataran",
        timestamp: "2 menit yang lalu",
      },
      {
        id: 2,
        type: "update",
        iconClass: "fas fa-edit",
        message: "Memperbarui informasi berita: Festival Budaya Magetan 2025",
        timestamp: "15 menit yang lalu",
      },
      {
        id: 3,
        type: "upload",
        iconClass: "fas fa-upload",
        message: "Mengunggah 5 foto ke galeri media",
        timestamp: "30 menit yang lalu",
      },
      {
        id: 4,
        type: "create",
        iconClass: "fas fa-calendar-plus",
        message: "Membuat event baru: Workshop Batik Tradisional",
        timestamp: "1 jam yang lalu",
      },
      {
        id: 5,
        type: "delete",
        iconClass: "fas fa-trash",
        message: "Menghapus pengumuman yang sudah kedaluwarsa",
        timestamp: "2 jam yang lalu",
      },
      {
        id: 6,
        type: "update",
        iconClass: "fas fa-user-edit",
        message: "Memperbarui struktur anggota organisasi",
        timestamp: "3 jam yang lalu",
      },
    ];

    // Simulasi delay API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    recentActivity.value = mockActivities;
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    recentActivity.value = [];
  }
};

// Check auth status dan load initial data
onMounted(() => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    error.value = "Sesi login telah berakhir. Silakan login kembali.";
  } else {
    // Load aktivitas terbaru
    fetchRecentActivity();
  }
});
</script>

<style scoped>
/* =========== Dashboard Admin Template Konsisten =========== */

.admin-dashboard-container {
  padding: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
}

.header-container {
  margin-bottom: 2.5rem;
  text-align: left;
  margin-top: 80px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.page-title i {
  color: #3b82f6;
  font-size: 1.75rem;
}

.page-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  max-width: 700px;
  font-weight: 400;
}

.error-banner {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  border-left: 4px solid #dc2626;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.error-banner i {
  font-size: 1.25rem;
}

.error-actions {
  margin-left: auto;
  display: flex;
  gap: 0.75rem;
}

.login-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.login-button:hover {
  background: #2563eb;
}

/* Recent Activity Styles */
.recent-activity {
  background: #ffffff;
  padding: 1.75rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-top: 2rem;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title::before {
  content: "�";
  font-size: 1.1rem;
}

.refresh-button {
  background: #059669;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
  background: #047857;
}

.refresh-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.activity-card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-loading,
.activity-empty {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}

.activity-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.activity-card:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
  color: white;
}

.activity-icon.create {
  background: #3b82f6;
}

.activity-icon.update {
  background: #1e40af;
}

.activity-icon.delete {
  background: #64748b;
}

.activity-icon.upload {
  background: #2563eb;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-message {
  margin: 0 0 0.25rem 0;
  color: #1e293b;
  font-weight: 500;
  line-height: 1.4;
  font-size: 0.875rem;
}

.activity-timestamp {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 400;
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-dashboard-container {
    padding: 1.25rem;
  }

  .header-container {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1.25rem;
  }

  .page-title {
    font-size: 1.75rem;
    justify-content: center;
  }

  .page-title i {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.9375rem;
    text-align: center;
  }

  .error-banner {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .error-actions {
    margin-left: 0;
    justify-content: center;
  }

  .recent-activity {
    padding: 1.5rem;
    margin-top: 1.5rem;
  }

  .activity-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .section-title {
    text-align: center;
  }

  .refresh-button {
    align-self: center;
  }

  .activity-card {
    padding: 0.75rem;
    gap: 0.875rem;
  }

  .activity-icon {
    width: 32px;
    height: 32px;
    font-size: 0.8125rem;
  }

  .activity-message {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .admin-dashboard-container {
    padding: 1rem;
  }

  .header-container {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .page-subtitle {
    font-size: 0.875rem;
  }

  .recent-activity {
    padding: 1.25rem;
  }

  .activity-header {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
  }

  .section-title {
    font-size: 1rem;
  }
}
</style>
