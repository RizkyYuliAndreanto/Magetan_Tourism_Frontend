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
        <div class="header-content">
          <h3 class="section-title">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Aktivitas Terbaru
          </h3>
          <p class="section-subtitle">
            Pantau semua perubahan dan aktivitas terkini
          </p>
        </div>
        <button
          @click="refreshDashboard"
          class="refresh-button"
          :disabled="loading">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            :class="{ spin: loading }">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          {{ loading ? "Memuat..." : "Refresh" }}
        </button>
      </div>
      <div class="activity-list">
        <div v-if="loading" class="activity-loading">
          <div class="loading-spinner"></div>
          <p>Memuat aktivitas terbaru...</p>
        </div>
        <div v-else-if="recentActivity.length === 0" class="activity-empty">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M12 2v20" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <p>Belum ada aktivitas terbaru</p>
        </div>
        <div v-else class="activity-items">
          <div
            v-for="(activity, index) in recentActivity"
            :key="activity.id"
            class="activity-item"
            :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="activity-icon-wrapper">
              <div :class="['activity-icon', `icon-${activity.type}`]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path
                    v-for="(path, index) in getActivityIcon(activity.type)"
                    :key="index"
                    :d="path" />
                </svg>
              </div>
            </div>
            <div class="activity-details">
              <div class="activity-message">
                <span class="full-message">{{ activity.message }}</span>
              </div>
              <div class="activity-timestamp">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
                {{ activity.timestamp }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ContentOverview from "./ContentOverview.vue";
import axios from "@/api/axios.js";
import { useAuth } from "@/composables/useAuth.js";

const error = ref(null);
const loading = ref(false);
const recentActivity = ref([]);

// Function untuk refresh dashboard
function refreshDashboard() {
  loading.value = true;
  fetchRecentActivity();
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}

// Icon mapping functions
const getActivityIcon = (type) => {
  const iconPaths = {
    create: ["M12 5v14", "M5 12h14"],
    update: [
      "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
      "M14 2v4a2 2 0 0 0 2 2h4",
      "M10 9H8",
      "M16 13H8",
      "M16 17H8",
    ],
    upload: [
      "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Z",
      "M9 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
      "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
    ],
    delete: [
      "M3 6h18",
      "M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2",
      "M3 8h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z",
      "M10 11v6",
      "M14 11v6",
    ],
    event: [
      "M8 2v4",
      "M16 2v4",
      "M3 6h18v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z",
      "M3 10h18",
    ],
    login: [
      "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",
      "M10 17l5-5-5-5",
      "M15 12H3",
    ],
  };
  return iconPaths[type] || iconPaths.create;
};

const getActionText = (type) => {
  const actionMap = {
    create: "Menambahkan",
    update: "Memperbarui",
    upload: "Mengunggah",
    delete: "Menghapus",
    event: "Membuat",
  };
  return actionMap[type] || "Aktivitas";
};

const getActionDetails = (message) => {
  // Extract the main content after the action verb
  const parts = message.split(": ");
  return parts.length > 1
    ? parts[1]
    : message.replace(
        /^(Menambahkan|Memperbarui|Mengunggah|Menghapus|Membuat)\s/,
        ""
      );
};

// Helper function untuk format pesan aktivitas dari backend
const formatActivityMessage = (activity) => {
  // Prioritaskan deskripsi dari backend yang sudah detailed
  if (activity.description) {
    return activity.description;
  }

  // Fallback format jika description tidak ada (untuk data lama)
  const actionText = getActionText(activity.action);
  const entityName = activity.entityName || activity.entity;
  const adminName = activity.admin || "Admin";

  switch (activity.action) {
    case "create":
      return entityName
        ? `${adminName} menambahkan ${activity.entity} baru "${entityName}"`
        : `${adminName} menambahkan ${activity.entity} baru`;
    case "update":
      return entityName
        ? `${adminName} mengupdate/edit ${activity.entity} "${entityName}"`
        : `${adminName} mengupdate ${activity.entity}`;
    case "delete":
      return entityName
        ? `${adminName} menghapus ${activity.entity} "${entityName}"`
        : `${adminName} menghapus ${activity.entity}`;
    case "upload":
      return entityName
        ? `${adminName} mengunggah media untuk ${activity.entity} "${entityName}"`
        : `${adminName} mengunggah media ke ${activity.entity}`;
    case "login":
      return `${adminName} login ke sistem`;
    case "logout":
      return `${adminName} logout dari sistem`;
    default:
      return entityName
        ? `${adminName} melakukan ${activity.action} pada ${activity.entity} "${entityName}"`
        : `${adminName} melakukan ${activity.action} pada ${activity.entity}`;
  }
};

// Helper function untuk format timestamp menjadi relative time
const formatTimestamp = (dateString) => {
  const now = new Date();
  const activityDate = new Date(dateString);
  const diffInMs = now - activityDate;

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Baru saja";
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;

  // Format tanggal untuk aktivitas yang lebih lama
  return activityDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Function untuk fetch aktivitas terbaru
const fetchRecentActivity = async () => {
  try {
    loading.value = true;

    // Check if token exists
    const token = localStorage.getItem("access_token");

    // Mengambil data dari backend API
    // Coba dulu endpoint admin (dengan auth), jika gagal fallback ke dashboard
    let response;
    try {
      response = await axios.get("/admin/activity", {
        params: { limit: 15 }, // Ambil lebih banyak untuk filtering
      });
    } catch (adminError) {
      // Fallback ke dashboard endpoint (public)
      response = await axios.get("/dashboard/activity", {
        params: { limit: 15 }, // Ambil lebih banyak untuk filtering
      });
    }

    if (response.data.success && response.data.data) {
      // Format data dari backend untuk frontend
      let allActivities = response.data.data.map((activity) => ({
        id: activity.id,
        type: activity.action, // backend menggunakan 'action', frontend menggunakan 'type'
        message: formatActivityMessage(activity),
        timestamp: formatTimestamp(activity.createdAt),
        admin: activity.admin,
        entity: activity.entity,
        entityName: activity.entityName,
        description: activity.description,
      }));

      // Filter untuk menampilkan mix of activities (prioritas CRUD, tapi tetap include login)
      const crudActivities = allActivities.filter((a) =>
        ["create", "update", "delete", "upload"].includes(a.type)
      );
      const loginActivities = allActivities.filter((a) => a.type === "login");

      // Ambil kombinasi: prioritas CRUD activities, tambahkan login jika perlu
      let mixedActivities;
      if (crudActivities.length >= 8) {
        // Jika ada banyak CRUD, ambil 8 CRUD + 2 login
        mixedActivities = [
          ...crudActivities.slice(0, 8),
          ...loginActivities.slice(0, 2),
        ];
      } else {
        // Jika CRUD sedikit, ambil semua CRUD + login untuk melengkapi
        const remainingSlots = 10 - crudActivities.length;
        mixedActivities = [
          ...crudActivities,
          ...loginActivities.slice(0, remainingSlots),
        ];
      }

      // Sort by actual creation date (not formatted timestamp)
      mixedActivities = mixedActivities
        .sort((a, b) => {
          // Cari original activity untuk mendapat createdAt yang asli
          const origA = allActivities.find((orig) => orig.id === a.id);
          const origB = allActivities.find((orig) => orig.id === b.id);
          const dateA = response.data.data.find(
            (d) => d.id === a.id
          )?.createdAt;
          const dateB = response.data.data.find(
            (d) => d.id === b.id
          )?.createdAt;
          return new Date(dateB) - new Date(dateA);
        })
        .slice(0, 10);

      recentActivity.value = mixedActivities;
    } else {
      recentActivity.value = [];
    }
  } catch (error) {
    // Jika gagal koneksi ke backend, silent fail
    recentActivity.value = [];
  } finally {
    loading.value = false;
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
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");

/* =========== Dashboard Admin Template Konsisten =========== */

.admin-dashboard-container {
  padding: 2rem;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 30%, #f8fafc 100%);
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

/* =========== Modern Recent Activity Styles =========== */

.recent-activity {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
}

.recent-activity::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1e90ff 0%, #2563eb 100%);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.header-content {
  flex: 1;
}

.section-title {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.375rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title svg {
  color: #3b82f6;
}

.section-subtitle {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
}

.refresh-button {
  background: linear-gradient(135deg, #eaf4ff 0%, #dbeafe 100%);
  color: #1e90ff;
  border: 1px solid #bfdbfe;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.refresh-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #1e90ff 0%, #2563eb 100%);
  color: white;
  border-color: #1e90ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 144, 255, 0.3);
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.refresh-button svg.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Activity List */
.activity-list {
  position: relative;
}

.activity-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  gap: 1rem;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.activity-loading p {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
  font-weight: 500;
}

.activity-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  gap: 1rem;
}

.activity-empty svg {
  color: #cbd5e1;
}

.activity-empty p {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
  font-weight: 500;
}

/* Activity Items */
.activity-items {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: transparent;
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: slideInFade 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideInFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  transform: translateX(4px);
  border-radius: 12px;
  margin: 0 -0.5rem;
  padding: 1.25rem 1.75rem;
}

/* Hover backgrounds berdasarkan jenis aktivitas */
.activity-item:has(.icon-create):hover {
  background: linear-gradient(135deg, #eff6ff 0%, #f0f8ff 100%);
}

.activity-item:has(.icon-update):hover {
  background: linear-gradient(135deg, #f0f9ff 0%, #f0fdff 100%);
}

.activity-item:has(.icon-upload):hover {
  background: linear-gradient(135deg, #f0fdf4 0%, #f0fdf8 100%);
}

.activity-item:has(.icon-delete):hover {
  background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%);
}

.activity-item:has(.icon-event):hover {
  background: linear-gradient(135deg, #fffbeb 0%, #fffdf0 100%);
}

.activity-item:has(.icon-login):hover {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
}

/* Fallback untuk browser yang tidak support :has() */
@supports not (selector(:has(.icon-create))) {
  .activity-item:hover {
    background: linear-gradient(135deg, #eff6ff 0%, #f0f8ff 100%);
  }
}

/* Activity Icons */
.activity-icon-wrapper {
  position: relative;
  flex-shrink: 0;
}

.activity-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

/* Konsisten dengan Card Variants - Warna yang Lebih Kontras */
.activity-icon.icon-create {
  background: linear-gradient(135deg, #dbeafe 0%, #3b82f6 100%);
  color: white;
  border-color: #3b82f6;
}

.activity-icon.icon-update {
  background: linear-gradient(135deg, #e0f2fe 0%, #0891b2 100%);
  color: white;
  border-color: #0891b2;
}

.activity-icon.icon-upload {
  background: linear-gradient(135deg, #dcfce7 0%, #16a34a 100%);
  color: white;
  border-color: #16a34a;
}

.activity-icon.icon-delete {
  background: linear-gradient(135deg, #fecaca 0%, #dc2626 100%);
  color: white;
  border-color: #dc2626;
}

.activity-icon.icon-event {
  background: linear-gradient(135deg, #fed7aa 0%, #ea580c 100%);
  color: white;
  border-color: #ea580c;
}

/* Icon untuk login activity */
.activity-icon.icon-login {
  background: linear-gradient(135deg, #f3e8ff 0%, #9333ea 100%);
  color: white;
  border-color: #9333ea;
}

.activity-item:hover .activity-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Activity Details */
.activity-details {
  flex: 1;
  min-width: 0;
  padding-top: 0.125rem;
}

.activity-message {
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

.full-message {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.5;
  display: block;
}

/* Legacy styles for backward compatibility */
.action-type {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
  display: inline;
}

.action-details {
  font-size: 0.9375rem;
  font-weight: 400;
  color: #475569;
  display: inline;
  margin-left: 0.25rem;
}

.activity-timestamp {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.activity-timestamp svg {
  color: #9ca3af;
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
    border-radius: 12px;
  }

  .activity-header {
    flex-direction: column;
    gap: 1.25rem;
    align-items: stretch;
    margin-bottom: 1.5rem;
    padding-bottom: 1.25rem;
  }

  .section-title {
    text-align: center;
    font-size: 1.25rem;
    justify-content: center;
  }

  .section-subtitle {
    text-align: center;
    font-size: 0.8125rem;
  }

  .refresh-button {
    align-self: center;
    padding: 0.625rem 1rem;
    font-size: 0.8125rem;
  }

  .activity-item {
    padding: 1rem;
    gap: 0.875rem;
  }

  .activity-item:hover {
    margin: 0 -0.375rem;
    padding: 1rem 1.375rem;
  }

  .activity-icon {
    width: 40px;
    height: 40px;
  }

  .action-type,
  .action-details {
    font-size: 0.875rem;
  }

  .activity-timestamp {
    font-size: 0.6875rem;
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
    border-radius: 10px;
  }

  .activity-header {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    gap: 1rem;
  }

  .section-title {
    font-size: 1.125rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .section-subtitle {
    font-size: 0.75rem;
  }

  .refresh-button {
    padding: 0.5rem 0.875rem;
    font-size: 0.75rem;
  }

  .activity-item {
    padding: 0.875rem;
    gap: 0.75rem;
  }

  .activity-item:hover {
    margin: 0 -0.25rem;
    padding: 0.875rem 1.125rem;
  }

  .activity-icon {
    width: 36px;
    height: 36px;
  }

  .action-type,
  .action-details {
    font-size: 0.8125rem;
  }

  .activity-timestamp {
    font-size: 0.625rem;
  }

  .activity-loading,
  .activity-empty {
    padding: 2rem 1rem;
  }

  .activity-loading p,
  .activity-empty p {
    font-size: 0.8125rem;
  }
}
</style>
