<template>
  <div class="detail-page-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <button @click="goBack" class="back-button">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>
        <div class="hero-text">
          <h1 class="hero-title">
            <i class="fas fa-sitemap"></i>
            Struktur Organisasi
          </h1>
          <p class="hero-subtitle">Organisasi dan Tata Kerja Dinas</p>
          <p class="hero-description">
            Bagan dan informasi lengkap mengenai struktur organisasi Dinas
            Kebudayaan dan Pariwisata Kabupaten Magetan.
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">1</div>
              <div class="stat-label">Struktur Organisasi</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">
                {{ strukturOrganisasiData ? 1 : 0 }}
              </div>
              <div class="stat-label">Tersedia</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Loading, Error, and Empty States -->
      <div v-if="loading" class="state-message">
        <div class="spinner"></div>
        <p>Memuat Struktur Organisasi...</p>
      </div>
      <div v-if="error" class="state-message error-message">
        <div class="state-icon">🔧</div>
        <h3>Gagal Memuat Data</h3>
        <p>
          Tidak dapat mengakses informasi struktur organisasi. Silakan coba
          kembali atau hubungi administrator.
        </p>
      </div>
      <div
        v-if="!loading && !error && !strukturOrganisasiData"
        class="state-message empty-message">
        <div class="state-icon">🏢</div>
        <h3>Belum Ada Konten</h3>
        <p>
          Informasi struktur organisasi belum tersedia. Silakan periksa kembali
          nanti.
        </p>
      </div>

      <!-- Main Content -->
      <div
        v-if="strukturOrganisasiData && !loading"
        class="struktur-organisasi-content">
        <p class="last-updated">
          Terakhir diperbarui:
          {{ formatDate(strukturOrganisasiData.tanggal_pembaruan) }}
        </p>

        <h2 class="section-sub-title">
          {{
            strukturOrganisasiData.judul_struktur || "Struktur Organisasi Dinas"
          }}
        </h2>

        <div
          v-if="strukturOrganisasiData.gambar_struktur_path"
          class="struktur-image-container">
          <img
            :src="baseUrl + strukturOrganisasiData.gambar_struktur_path"
            :alt="
              strukturOrganisasiData.judul_struktur || 'Struktur Organisasi'
            "
            class="struktur-organisasi-image" />
        </div>
        <div v-else class="struktur-image-placeholder">
          <i class="fas fa-sitemap fa-3x"></i>
          <span>Gambar Struktur Organisasi Tidak Tersedia</span>
        </div>

        <div
          v-if="strukturOrganisasiData.deskripsi_struktur"
          class="struktur-description">
          <h3 class="section-heading-small">Deskripsi</h3>
          <p class="page-description">
            {{ strukturOrganisasiData.deskripsi_struktur }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const strukturOrganisasiData = ref(null);
const loading = ref(true);
const error = ref(false);
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const fetchStrukturOrganisasiData = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await axios.get(`${baseUrl}/api/struktur-organisasi`);
    if (response.data && Object.keys(response.data).length > 0) {
      strukturOrganisasiData.value = response.data;
    } else {
      strukturOrganisasiData.value = null;
    }
  } catch (err) {
    console.error("Error fetching Struktur Organisasi data:", err);
    // Jika error 404 atau data kosong, jangan tampilkan sebagai error
    if (
      err.response &&
      (err.response.status === 404 || err.response.status === 204)
    ) {
      strukturOrganisasiData.value = null;
      error.value = false;
    } else {
      error.value = true;
    }
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  // Scroll ke atas halaman
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  fetchStrukturOrganisasiData();
});
</script>

<style scoped>
/* Professional Government Base Styles */
.detail-page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f4f7f9 0%, #e8f0fe 50%, #f1f5f9 100%);
  color: #333;
  font-family: "Inter", "Segoe UI", sans-serif;
}

/* Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #0077b6 0%, #023e8a 100%);
  color: white;
  padding: 120px 20px 80px;
  text-align: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 30, 60, 0.3);
  backdrop-filter: blur(2px);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  position: absolute;
  top: -40px;
  left: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-size: 0.95rem;
  font-weight: 500;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.hero-text {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero-title i {
  margin-right: 20px;
  color: #ffd700;
}

.hero-subtitle {
  font-size: 1.4rem;
  font-weight: 500;
  margin: 0 0 25px 0;
  color: #e3f2fd;
}

.hero-description {
  font-size: 1.15rem;
  line-height: 1.7;
  margin: 0 0 40px 0;
  color: rgba(255, 255, 255, 0.9);
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 30px 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 40px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-divider {
  width: 2px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}
.content-wrapper {
  max-width: 1300px;
  margin: 0 auto;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 119, 182, 0.08);
  border: 1px solid rgba(0, 119, 182, 0.1);
}
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #475569 0%, #64748b 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 25px;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(71, 85, 105, 0.2);
}
.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(71, 85, 105, 0.3);
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
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
  max-height: 600px;
  overflow: hidden;
  margin-bottom: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 119, 182, 0.12);
  border: 1px solid rgba(0, 119, 182, 0.1);
  background-color: #f8fafc;
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
  margin: 50px auto;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 600px;
}

.state-message .state-icon {
  font-size: 3rem;
  margin-bottom: 20px;
  display: block;
}

.state-message h3 {
  margin: 0 0 15px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #475569;
}

.state-message p {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #64748b;
}

.state-message.error-message {
  border-left: 4px solid #ef4444;
}

.state-message.error-message h3 {
  color: #ef4444;
}

.state-message.empty-message {
  border-left: 4px solid #0077b6;
}

.state-message.empty-message h3 {
  color: #0077b6;
}
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
<style scoped>
.detail-page-container {
  overflow-y: auto;
}
</style>
