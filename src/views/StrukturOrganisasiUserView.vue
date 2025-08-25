<template>
  <div class="detail-page-container">
    <div class="content-wrapper">
      <button @click="goBack" class="back-button">
        <i class="fas fa-arrow-left"></i> Kembali
      </button>
      <h1 class="page-main-title">Struktur Organisasi</h1>

      <!-- Loading, Error, and Empty States -->
      <div v-if="loading" class="state-message">
        <div class="spinner"></div>
        <p>Memuat Struktur Organisasi...</p>
      </div>
      <div v-if="error" class="state-message error-message">
        <p>❌ Maaf, terjadi kesalahan saat memuat data. Silakan coba kembali.</p>
      </div>
      <div v-if="!loading && !error && !strukturOrganisasiData" class="state-message empty-message">
        <p>📋 Belum ada informasi Struktur Organisasi yang tersedia saat ini.</p>
      </div>

      <!-- Main Content -->
      <div v-if="strukturOrganisasiData && !loading" class="struktur-organisasi-content">
        <p class="last-updated">Terakhir diperbarui: {{ formatDate(strukturOrganisasiData.tanggal_pembaruan) }}</p>
        
        <h2 class="section-sub-title">{{ strukturOrganisasiData.judul_struktur || 'Struktur Organisasi Dinas' }}</h2>
        
        <div v-if="strukturOrganisasiData.gambar_struktur_path" class="struktur-image-container">
          <img 
            :src="baseUrl + strukturOrganisasiData.gambar_struktur_path" 
            :alt="strukturOrganisasiData.judul_struktur || 'Struktur Organisasi'" 
            class="struktur-organisasi-image"
          >
        </div>
        <div v-else class="struktur-image-placeholder">
          <i class="fas fa-sitemap fa-3x"></i>
          <span>Gambar Struktur Organisasi Tidak Tersedia</span>
        </div>

        <div v-if="strukturOrganisasiData.deskripsi_struktur" class="struktur-description">
          <h3 class="section-heading-small">Deskripsi</h3>
          <p class="page-description">{{ strukturOrganisasiData.deskripsi_struktur }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const strukturOrganisasiData = ref(null);
const loading = ref(true);
const error = ref(false);
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const fetchStrukturOrganisasiData = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await axios.get(`${baseUrl}/api/struktur-organisasi`);
    if (response.data) {
      strukturOrganisasiData.value = response.data;
    } else {
      strukturOrganisasiData.value = null;
    }
  } catch (err) {
    console.error("Error fetching Struktur Organisasi data:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  fetchStrukturOrganisasiData();
});
</script>

<style scoped>
/* Base Page Styles */
.detail-page-container {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #f4f7f9;
  color: #333;
}
.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 25px;
  transition: background-color 0.3s ease;
}
.back-button:hover {
  background-color: #5a6268;
}
.page-main-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #0077b6;
  margin-bottom: 20px;
}
.page-description {
  font-size: 1rem;
  color: #495057;
  line-height: 1.8;
  margin-bottom: 20px;
}

/* Specific Styles for StrukturOrganisasiView */
.struktur-organisasi-content {
  margin-top: 20px;
}
.last-updated {
  font-size: 0.85rem;
  color: #888;
  text-align: right;
  margin-bottom: 20px;
}
.section-sub-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a1a1a;
  border-bottom: 2px solid #0077b6;
  padding-bottom: 5px;
  margin-bottom: 25px;
  display: inline-block;
}
.struktur-image-container {
  width: 100%;
  max-height: 600px; /* Batasi tinggi gambar */
  overflow: hidden;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-color: #e0e0e0; /* Placeholder background */
  display: flex;
  justify-content: center;
  align-items: center;
}
.struktur-organisasi-image {
  width: 100%;
  height: auto;
  object-fit: contain; /* Pastikan gambar terlihat utuh */
  display: block;
}
.struktur-image-placeholder {
  width: 100%;
  height: 400px;
  background-color: #e0e0e0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  border-radius: 8px;
  color: #999;
  font-size: 1.2rem;
  margin-top: 30px;
  margin-bottom: 30px;
}
.struktur-image-placeholder i {
  font-size: 4rem;
}
.struktur-description {
  margin-top: 30px;
}
.section-heading-small {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 15px;
}

/* Other shared styles (Loading, Error, Spinner) */
.state-message {
  text-align: center;
  font-size: 1.2rem;
  color: #6c757d;
  margin: 50px 0;
}
.state-message.error-message { color: #dc3545; }
.state-message.empty-message { color: #ffc107; }
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #0077b6;
  animation: spin 1s ease infinite;
  margin: 0 auto 15px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>