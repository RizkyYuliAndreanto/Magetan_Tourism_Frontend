<template>
  <div class="admin-dashboard-container">
    <div class="header-container">
      <h2 class="page-title">Dashboard Utama</h2>
      <p class="page-subtitle">
        Ringkasan statistik dan aktivitas terbaru dari semua konten.
      </p>
    </div>

    <div v-if="error" class="error-banner">{{ error }}</div>

    <div class="stats-grid">
      <DashboardCard
        v-for="stat in statsData"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :icon="stat.icon"
        :color="stat.color" />
    </div>

    <div class="recent-activity">
      <h3 class="section-title">Aktivitas Terbaru</h3>
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
import DashboardCard from "./DashboardCard.vue";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const loading = ref(true);
const error = ref(null);

const statsData = ref([
  {
    title: "Total Berita",
    value: 0,
    icon: "fas fa-newspaper",
    color: "#007bff",
  },
  {
    title: "Total Destinasi",
    value: 0,
    icon: "fas fa-map-marker-alt",
    color: "#17a2b8",
  },
  {
    title: "Total Event",
    value: 0,
    icon: "fas fa-calendar-alt",
    color: "#28a745",
  },
  { title: "Total UMKM", value: 0, icon: "fas fa-store", color: "#ffc107" },
  { title: "Total Sejarah", value: 0, icon: "fas fa-book", color: "#6c757d" },
  { title: "Total Media", value: 0, icon: "fas fa-images", color: "#dc3545" },
]);

const recentActivity = ref([]);

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleString("id-ID");
  } catch {
    return ts;
  }
}

async function loadDashboard() {
  loading.value = true;
  error.value = null;
  try {
    const [summaryRes, activityRes] = await Promise.all([
      axios.get(`${backendUrl}/api/dashboard/summary`),
      axios.get(`${backendUrl}/api/admin/activity`, { params: { limit: 10 } }),
    ]);

    const t = summaryRes.data?.totals || summaryRes.data || {};
    const totals = {
      berita: t.berita ?? 0,
      destinasi: t.destinasi ?? 0,
      event: t.event ?? 0,
      umkm: t.umkm ?? 0,
      sejarah: t.sejarah ?? 0,
      media: t.media ?? 0,
    };
    statsData.value = [
      {
        title: "Total Berita",
        value: totals.berita,
        icon: "fas fa-newspaper",
        color: "#007bff",
      },
      {
        title: "Total Destinasi",
        value: totals.destinasi,
        icon: "fas fa-map-marker-alt",
        color: "#17a2b8",
      },
      {
        title: "Total Event",
        value: totals.event,
        icon: "fas fa-calendar-alt",
        color: "#28a745",
      },
      {
        title: "Total UMKM",
        value: totals.umkm,
        icon: "fas fa-store",
        color: "#ffc107",
      },
      {
        title: "Total Sejarah",
        value: totals.sejarah,
        icon: "fas fa-book",
        color: "#6c757d",
      },
      {
        title: "Total Media",
        value: totals.media,
        icon: "fas fa-images",
        color: "#dc3545",
      },
    ];

    const logs = activityRes.data?.data ?? activityRes.data ?? [];
    recentActivity.value = logs.map((a, idx) => {
      const rawType = (a.type || a.action || "").toString().toLowerCase();
      const typeMap = {
        create: "create",
        add: "create",
        update: "update",
        edit: "update",
        delete: "delete",
        remove: "delete",
      };
      const mapped = typeMap[rawType] || "update";
      const iconMap = {
        create: "fas fa-plus",
        update: "fas fa-edit",
        delete: "fas fa-trash-alt",
      };
      const actor = a.actor || a.admin || a.user || "Admin";
      const target = a.entity || a.module || a.target || "konten";
      const name = a.entityName || a.title || a.name || "";
      const actionWord =
        mapped === "create"
          ? "menambahkan"
          : mapped === "delete"
          ? "menghapus"
          : "memperbarui";
      const message = `${actor} ${actionWord} ${target}${
        name ? `: "${name}"` : ""
      }`;
      return {
        id: a.id || idx,
        type: mapped,
        message,
        timestamp: formatTime(
          a.createdAt || a.timestamp || new Date().toISOString()
        ),
        iconClass: iconMap[mapped],
      };
    });
  } catch (e) {
    console.error(e);
    error.value = "Gagal memuat data dashboard.";
  } finally {
    loading.value = false;
  }
}

onMounted(loadDashboard);
</script>

<style scoped>
.admin-dashboard-container {
  padding: 2rem;
  /* Mengubah background menjadi putih cerah */
  background-color: #f8f9fa;
  min-height: 100vh;
  margin-top: 80px;
}

.header-container {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  /* Menyesuaikan border untuk kontras yang lebih baik */
  border-bottom: 1px solid #dee2e6;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #212529; /* Teks lebih gelap agar jelas */
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  color: #212529; /* Teks lebih gelap */
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.activity-card-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-banner {
  background: #ffe8e8;
  color: #c43b3b;
  border: 1px solid #f4bcbc;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.activity-loading,
.activity-empty {
  background: #ffffff;
  border: 1px dashed #e9ecef;
  color: #6c757d;
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.activity-card {
  display: flex;
  align-items: center; /* Mengubah align-items agar ikon dan konten sejajar di tengah */
  gap: 1rem;
  padding: 1.25rem; /* Padding lebih besar */
  background-color: #ffffff; /* Latar belakang card putih */
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); /* Bayangan lebih jelas */
  border: 1px solid #e9ecef; /* Border lembut */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.activity-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

.activity-icon {
  width: 45px; /* Ukuran ikon sedikit lebih besar */
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.activity-icon.create {
  background-color: #28a745;
}
.activity-icon.update {
  background-color: #ffc107;
}
.activity-icon.delete {
  background-color: #dc3545;
}

.activity-content {
  flex-grow: 1;
}

.activity-message {
  margin: 0;
  font-weight: 500;
  color: #212529; /* Teks lebih gelap */
}

.activity-timestamp {
  font-size: 0.85rem;
  color: #adb5bd; /* Warna abu-abu yang lebih halus */
}
</style>
