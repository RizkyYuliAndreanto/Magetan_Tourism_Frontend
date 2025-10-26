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
            <i class="fas fa-bullseye"></i>
            Visi & Misi
          </h1>
          <p class="hero-subtitle">Arah dan Tujuan Organisasi</p>
          <p class="hero-description">
            Visi, misi, dan tujuan strategis Dinas Kebudayaan dan Pariwisata
            Kabupaten Magetan dalam melayani masyarakat.
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">{{ visiMisiData ? 1 : 0 }}</div>
              <div class="stat-label">Visi</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">
                {{
                  visiMisiData
                    ? visiMisiData.misi
                      ? visiMisiData.misi.split("\n").filter((m) => m.trim())
                          .length
                      : 0
                    : 0
                }}
              </div>
              <div class="stat-label">Poin Misi</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <div v-if="loading" class="state-message">
        <div class="spinner"></div>
        <p>Memuat Visi dan Misi...</p>
      </div>
      <div v-if="error" class="state-message error-message">
        <div class="state-icon">🔧</div>
        <h3>Gagal Memuat Data</h3>
        <p>
          Tidak dapat mengakses informasi visi dan misi. Silakan coba kembali
          atau hubungi administrator.
        </p>
      </div>
      <div
        v-if="!loading && !error && !visiMisiData"
        class="state-message empty-message">
        <div class="state-icon">🎯</div>
        <h3>Belum Ada Konten</h3>
        <p>
          Informasi visi dan misi organisasi belum tersedia. Silakan periksa
          kembali nanti.
        </p>
      </div>

      <div v-if="visiMisiData && !loading" class="visi-misi-content">
        <p class="last-updated">
          Terakhir diperbarui: {{ formatDate(visiMisiData.tanggal_pembaruan) }}
        </p>

        <div v-if="visiMisiData.deskripsi" class="visi-misi-description">
          <h2 class="section-sub-title">Teks Visi Misi</h2>
          <div
            class="page-description-formatted"
            v-html="renderedMarkdown"></div>
        </div>

        <div v-if="visiMisiData.visi_misi_file_path" class="visi-misi-file">
          <h2 class="section-sub-title">File Visi Misi</h2>

          <div
            v-if="visiMisiData.tipe_file_visi_misi === 'gambar'"
            class="file-display image-display">
            <img
              :src="baseUrl + visiMisiData.visi_misi_file_path"
              alt="Visi Misi Image"
              class="visi-misi-image" />
          </div>

          <div
            v-else-if="visiMisiData.tipe_file_visi_misi === 'pdf'"
            class="file-display pdf-display">
            <p>
              File tersedia dalam format PDF. Anda dapat melihat atau
              mengunduhnya.
            </p>
            <div class="file-actions">
              <button
                @click="openPdfModal(visiMisiData.visi_misi_file_path)"
                class="view-link">
                <i class="fas fa-eye"></i> Lihat PDF
              </button>
            </div>
          </div>
        </div>
      </div>
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
import { useRouter } from "vue-router";
import axios from "axios";
import MarkdownIt from "markdown-it";

const router = useRouter();
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const visiMisiData = ref(null);
const loading = ref(true);
const error = ref(false);
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const showPdfModal = ref(false);
const currentPdfUrl = ref("");

const fetchVisiMisiData = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await axios.get(`${baseUrl}/api/visi-misi`);
    if (response.data && Object.keys(response.data).length > 0) {
      visiMisiData.value = response.data;
    } else {
      visiMisiData.value = null;
    }
  } catch (err) {
    console.error("Error fetching Visi Misi data:", err);
    // Jika error 404 atau data kosong, jangan tampilkan sebagai error
    if (err.response && err.response.status === 404) {
      visiMisiData.value = null;
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

const openPdfModal = (pdfPath) => {
  currentPdfUrl.value = `${baseUrl}${pdfPath}`;
  showPdfModal.value = true;
};

const closePdfModal = () => {
  showPdfModal.value = false;
  currentPdfUrl.value = "";
};

const renderedMarkdown = computed(() => {
  if (visiMisiData.value && visiMisiData.value.deskripsi) {
    return md.render(visiMisiData.value.deskripsi);
  }
  return "";
});

onMounted(() => {
  // Scroll ke atas halaman
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  fetchVisiMisiData();
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
.page-main-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #0077b6;
  margin-bottom: 20px;
}
.page-description {
  /* Ini untuk teks biasa jika masih ada */
  font-size: 1rem;
  color: #495057;
  line-height: 1.8;
  margin-bottom: 20px;
}

/* New Styles for VisiMisiView */
.visi-misi-content {
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
  margin-bottom: 15px;
  display: inline-block;
}
.visi-misi-description {
  margin-bottom: 30px;
}

/* Gaya untuk konten Markdown yang dirender */
.page-description-formatted {
  font-size: 1rem;
  color: #495057;
  line-height: 1.8;
  margin-bottom: 20px;
  padding: 0 20px;
}
/* Contoh gaya untuk elemen HTML yang dihasilkan dari Markdown */
.page-description-formatted strong,
.page-description-formatted b {
  font-weight: bold;
  color: #1a1a1a;
}
.page-description-formatted em,
.page-description-formatted i {
  font-style: italic;
}
.page-description-formatted p {
  margin-bottom: 1em;
}
.page-description-formatted ul,
.page-description-formatted ol {
  margin-bottom: 1em;
  padding-left: 20px;
}
.page-description-formatted ul li,
.page-description-formatted ol li {
  margin-bottom: 0.5em;
}
.page-description-formatted h1,
.page-description-formatted h2,
.page-description-formatted h3 {
  color: #0077b6;
  margin-top: 1.5em;
  margin-bottom: 0.8em;
}
/* Gaya untuk teks tengah */
.page-description-formatted p[style*="text-align: center"] {
  text-align: center;
}

.visi-misi-file {
  margin-top: 30px;
}
.file-display {
  padding: 20px;
  border: 1px solid rgba(0, 119, 182, 0.2);
  border-radius: 12px;
  background-color: rgba(248, 250, 252, 0.8);
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 119, 182, 0.05);
}
.image-display {
  display: flex;
  justify-content: center;
  align-items: center;
}
.visi-misi-image {
  max-width: 100%;
  max-height: 500px;
  border-radius: 8px;
  object-fit: contain;
}
.pdf-display {
  font-size: 1rem;
}
.file-actions {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 15px;
}
.view-link,
.download-link {
  display: inline-flex; /* Menggunakan inline-flex agar tombol tidak mengambil lebar penuh */
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
}

.view-link {
  background-color: #28a745;
}
.download-link {
  background-color: #0077b6;
}
.view-link:hover {
  background-color: #218838;
}
.download-link:hover {
  background-color: #005f91;
}

/* Gaya baru untuk tombol tunggal agar mengambil lebar penuh (ini dihapus dari template) */
/* .full-width-button {
  flex-grow: 1;
  width: 100%;
} */

/* Modal Styles (untuk preview PDF) */
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
  width: 95%;
  height: 95vh;
  max-width: 1200px;
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

/* Other shared styles */
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
