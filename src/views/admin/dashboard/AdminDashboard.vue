<template>
  <div class="admin-dashboard-container">
    <div class="header-container">
      <h2 class="page-title">Dashboard Utama</h2>
      <p class="page-subtitle">Ringkasan statistik dan aktivitas terbaru dari semua konten.</p>
    </div>

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
        <div v-for="activity in recentActivity" :key="activity.id" class="activity-card">
          <div :class="['activity-icon', activity.type]"><i :class="activity.iconClass"></i></div>
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
import { ref } from 'vue';
import DashboardCard from './DashboardCard.vue';

// Data dummy tetap sama
const statsData = ref([
  { title: 'Total Berita', value: 125, icon: 'fas fa-newspaper', color: '#007bff' },
  { title: 'Total Destinasi', value: 45, icon: 'fas fa-map-marker-alt', color: '#17a2b8' },
  { title: 'Total Event', value: 22, icon: 'fas fa-calendar-alt', color: '#28a745' },
  { title: 'Total UMKM', value: 89, icon: 'fas fa-store', color: '#ffc107' },
  { title: 'Total Sejarah', value: 15, icon: 'fas fa-book', color: '#6c757d' },
  { title: 'Total Media', value: 540, icon: 'fas fa-images', color: '#dc3545' },
]);

const recentActivity = ref([
  { id: 1, type: 'create', message: 'Admin John Doe menambahkan berita baru: "Lomba Balap Karung"', timestamp: '2 jam yang lalu', iconClass: 'fas fa-plus' },
  { id: 2, type: 'update', message: 'Admin Jane Smith memperbarui UMKM: "Toko Kerajinan Tangan"', timestamp: '4 jam yang lalu', iconClass: 'fas fa-edit' },
  { id: 3, type: 'delete', message: 'Admin Budi Santoso menghapus event: "Pesta Kesenian Daerah"', timestamp: '1 hari yang lalu', iconClass: 'fas fa-trash-alt' },
]);
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