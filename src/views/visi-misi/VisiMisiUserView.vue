<template>
  <div class="detail-page-container">
    <div class="content-wrapper">
      <button @click="goBack" class="back-button">
        <i class="fas fa-arrow-left"></i> Kembali
      </button>
      <h1 class="page-main-title">Visi & Misi</h1>

      <div v-if="loading" class="state-message">
        <div class="spinner"></div>
        <p>Memuat Visi dan Misi...</p>
      </div>
      <div v-if="error" class="state-message error-message">
        <p>
          ❌ Maaf, terjadi kesalahan saat memuat data. Silakan coba kembali.
        </p>
      </div>
      <div
        v-if="!loading && !error && !visiMisiData"
        class="state-message empty-message">
        <p>📋 Belum ada informasi Visi dan Misi yang tersedia saat ini.</p>
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
    visiMisiData.value = response.data;
  } catch (err) {
    console.error("Error fetching Visi Misi data:", err);
    error.value = true;
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
/* Gabungan dari base-page-styles dan style baru */
.detail-page-container {
  padding-top: 100px;
  padding-bottom: 20px;
  min-height: 100vh;
  background-color: #f4f7f9;
  color: #333;
}
.content-wrapper {
  max-width: 1300px;
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
  border: 1px dashed #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
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
  font-size: 1.2rem;
  color: #6c757d;
  margin: 50px 0;
}
.state-message.error-message {
  color: #dc3545;
}
.state-message.empty-message {
  color: #ffc107;
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
