<template>
  <div class="pengumuman-view-user">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <button @click="goBack" class="back-button">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>
        <div class="hero-text">
          <h1 class="hero-title">
            <i class="fas fa-bullhorn"></i>
            Pengumuman Terbaru
          </h1>
          <p class="hero-subtitle">Informasi dan Pengumuman Resmi</p>
          <p class="hero-description">
            Dapatkan informasi terkini seputar pengumuman resmi, kegiatan, dan
            program dari Dinas Kebudayaan dan Pariwisata Kabupaten Magetan.
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">{{ totalPengumuman }}</div>
              <div class="stat-label">Total Pengumuman</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">{{ activePengumuman }}</div>
              <div class="stat-label">Aktif</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div v-if="loading" class="state-message">
        <div class="spinner"></div>
        <p>Memuat daftar pengumuman...</p>
      </div>

      <div v-if="error" class="state-message error-message">
        <i class="fas fa-exclamation-triangle fa-2x"></i>
        <p>
          Maaf, terjadi kesalahan saat memuat data. Silakan coba kembali atau
          hubungi administrator.
        </p>
      </div>

      <div
        v-if="!loading && !error && pengumumanList.length === 0"
        class="state-message empty-message">
        <i class="fas fa-inbox fa-2x"></i>
        <h3>Belum Ada Pengumuman</h3>
        <p>
          Saat ini belum ada pengumuman yang tersedia. Silakan periksa kembali
          nanti.
        </p>
      </div>

      <ul class="pengumuman-list" v-if="pengumumanList.length > 0">
        <li
          v-for="pengumuman in pengumumanList"
          :key="pengumuman.id_pengumuman"
          class="pengumuman-card">
          <div class="pengumuman-cover" v-if="pengumuman.sampul_pengumuman">
            <img
              :src="baseUrl + pengumuman.sampul_pengumuman"
              :alt="`Sampul ${pengumuman.judul_pengumuman}`"
              class="cover-image" />
          </div>
          <div class="card-content">
            <h2 class="pengumuman-title">{{ pengumuman.judul_pengumuman }}</h2>
            <p class="pengumuman-meta">
              Dipublikasi pada: {{ formatDate(pengumuman.tanggal_publikasi) }}
            </p>
            <div v-if="pengumuman.isi_pengumuman" class="pengumuman-excerpt">
              <p>{{ truncateText(pengumuman.isi_pengumuman) }}</p>
            </div>
            <div class="card-actions">
              <button
                @click="openPdfModal(pengumuman.file_pdf_path)"
                class="view-link full-width-button">
                <i class="fas fa-eye"></i> Baca PDF
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div
      v-if="showPdfModal"
      class="pdf-modal-overlay"
      @click.self="closePdfModal">
      <button class="close-button" @click="closePdfModal">×</button>
      <div class="pdf-modal-content">
        <iframe :src="currentPdfUrl" class="pdf-iframe"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const pengumumanList = ref([]);
const loading = ref(true);
const error = ref(false);
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Computed properties for statistics
const totalPengumuman = computed(() => pengumumanList.value.length);
const activePengumuman = computed(
  () =>
    pengumumanList.value.filter(
      (p) => new Date(p.tanggal_publikasi) <= new Date()
    ).length
);

const showPdfModal = ref(false);
const currentPdfUrl = ref("");

const fetchPengumuman = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await axios.get(`${baseUrl}/api/pengumuman`);
    if (response.data && Array.isArray(response.data)) {
      pengumumanList.value = response.data;
    } else {
      pengumumanList.value = [];
    }
  } catch (err) {
    console.error("Error fetching pengumuman:", err);
    // Jika error 404 atau data kosong, jangan tampilkan sebagai error
    if (
      err.response &&
      (err.response.status === 404 || err.response.status === 204)
    ) {
      pengumumanList.value = [];
      error.value = false;
    } else {
      error.value = true;
    }
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const truncateText = (text, length = 200) => {
  if (!text || text.length <= length) {
    return text;
  }
  return text.substring(0, length) + "...";
};

const openPdfModal = (pdfPath) => {
  currentPdfUrl.value = baseUrl + pdfPath;
  showPdfModal.value = true;
};

const closePdfModal = () => {
  showPdfModal.value = false;
  currentPdfUrl.value = "";
};

const goBack = () => {
  router.go(-1);
};

onMounted(() => {
  // Scroll ke atas halaman
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  fetchPengumuman();
});
</script>

<style scoped>
/* Professional Government Styling */
.pengumuman-view-user {
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

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 4px 30px rgba(0, 119, 182, 0.08);
}

.page-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #0077b6;
  text-align: center;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  text-align: center;
  margin-bottom: 50px;
}

.pengumuman-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.pengumuman-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 119, 182, 0.08);
  border: 1px solid rgba(0, 119, 182, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
}

.pengumuman-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 119, 182, 0.15);
  border-color: rgba(0, 119, 182, 0.2);
}

/* Styling untuk foto sampul */
.pengumuman-cover {
  width: 300px;
  flex-shrink: 0;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-content {
  padding: 35px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.pengumuman-title {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 10px;
  font-weight: 600;
  line-height: 1.3;
}

.pengumuman-meta {
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 25px;
  font-style: italic;
  font-weight: 500;
}

.pengumuman-excerpt {
  flex-grow: 1;
  color: #495057;
  line-height: 1.7;
  font-size: 1rem;
  margin-bottom: 25px;
}

/* Card Actions (Tombol) */
.card-actions {
  display: flex;
  gap: 15px;
  width: 100%;
}

.download-link,
.view-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;
  flex-grow: 1;
}

.download-link {
  background-color: #0077b6;
}

.download-link:hover {
  background-color: #005f91;
}

.view-link {
  background-color: #28a745;
}

.view-link:hover {
  background-color: #218838;
}

/* Gaya baru untuk tombol tunggal agar mengambil lebar penuh */
.full-width-button {
  flex-grow: 1;
  width: 100%;
}

.pdf-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.pdf-modal-content {
  background: white;
  width: 95%; /* Diperlebar dari 90% menjadi 95% */
  height: 95vh; /* Diperlebar dari 90vh menjadi 95vh */
  max-width: 1200px; /* Diperbesar dari 1100px menjadi 1200px */
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  z-index: 10001;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.state-message {
  text-align: center;
  font-size: 1.2rem;
  color: #6c757d;
  margin: 50px 0;
}

.state-message.error-message {
  color: #dc3545;
}

.state-message.error-message i {
  margin-bottom: 15px;
  opacity: 0.8;
}

.state-message.empty-message {
  color: #64748b;
}

.state-message.empty-message i {
  margin-bottom: 15px;
  color: #0077b6;
  opacity: 0.7;
}

.state-message.empty-message h3 {
  color: #1a1a1a;
  font-size: 1.5rem;
  margin-bottom: 10px;
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

@media (max-width: 768px) {
  .pengumuman-card {
    flex-direction: column;
  }

  .pengumuman-cover {
    width: 100%;
    height: 200px;
  }

  /* Untuk mobile, kembalikan ke 1 kolom */
  .pengumuman-list {
    grid-template-columns: 1fr;
  }
}
</style>
<style scoped>
.pengumuman-view-user {
  overflow-y: auto;
}
</style>
