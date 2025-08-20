<template>
  <div class="pengumuman-view-user">
    <div class="container">
      <h1 class="page-title">Pengumuman Terbaru</h1>
      <p class="page-subtitle">Informasi penting seputar kegiatan Dinas Kebudayaan dan Pariwisata Kabupaten Magetan.</p>
      
      <div v-if="loading" class="state-message">
        <div class="spinner"></div>
        <p>Memuat daftar pengumuman...</p>
      </div>

      <div v-if="error" class="state-message error-message">
        <p>❌ Maaf, terjadi kesalahan saat memuat data. Silakan coba kembali.</p>
      </div>

      <div v-if="!loading && !error && pengumumanList.length === 0" class="state-message empty-message">
        <p>📋 Belum ada pengumuman yang tersedia saat ini.</p>
      </div>

      <ul class="pengumuman-list" v-if="pengumumanList.length > 0">
        <li v-for="pengumuman in pengumumanList" :key="pengumuman.id_pengumuman" class="pengumuman-card">
          <div class="pengumuman-cover" v-if="pengumuman.sampul_pengumuman">
            <img :src="baseUrl + pengumuman.sampul_pengumuman" :alt="`Sampul ${pengumuman.judul_pengumuman}`" class="cover-image">
          </div>
          <div class="card-content">
            <h2 class="pengumuman-title">{{ pengumuman.judul_pengumuman }}</h2>
            <p class="pengumuman-meta">Dipublikasi pada: {{ formatDate(pengumuman.tanggal_publikasi) }}</p>
            <div v-if="pengumuman.isi_pengumuman" class="pengumuman-excerpt">
              <p>{{ truncateText(pengumuman.isi_pengumuman) }}</p>
            </div>
            <div class="card-actions">
              <button @click="openPdfModal(pengumuman.file_pdf_path)" class="view-link">
                <i class="fas fa-eye"></i> Baca PDF
              </button>
              <a :href="baseUrl + pengumuman.file_pdf_path" target="_blank" rel="noopener noreferrer" class="download-link">
                <i class="fas fa-file-download"></i> Unduh File PDF
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
    
    <div v-if="showPdfModal" class="pdf-modal-overlay" @click.self="closePdfModal">
      <button class="close-button" @click="closePdfModal">×</button>
      <div class="pdf-modal-content">
        <iframe :src="currentPdfUrl" class="pdf-iframe"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const pengumumanList = ref([]);
const loading = ref(true);
const error = ref(false);
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const showPdfModal = ref(false);
const currentPdfUrl = ref('');

const fetchPengumuman = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await axios.get(`${baseUrl}/api/pengumuman`);
    pengumumanList.value = response.data;
  } catch (err) {
    console.error("Error fetching pengumuman:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const truncateText = (text, length = 200) => {
  if (!text || text.length <= length) {
    return text;
  }
  return text.substring(0, length) + '...';
};

const openPdfModal = (pdfPath) => {
  currentPdfUrl.value = baseUrl + pdfPath;
  showPdfModal.value = true;
};

const closePdfModal = () => {
  showPdfModal.value = false;
  currentPdfUrl.value = '';
};

onMounted(() => {
  fetchPengumuman();
});
</script>

<style scoped>
/* Styling yang sudah ada */
.pengumuman-view-user {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #f4f7f9;
  color: #333;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
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
  gap: 25px;
}

.pengumuman-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  display: flex;
}

.pengumuman-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* Styling untuk foto sampul */
.pengumuman-cover {
  width: 250px;
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
  padding: 30px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.pengumuman-title {
  font-size: 1.8rem;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.pengumuman-meta {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 20px;
  font-style: italic;
}

.pengumuman-excerpt {
  flex-grow: 1;
  color: #495057;
  line-height: 1.7;
  margin-bottom: 20px;
}

/* --- PERBAIKAN CSS DI BAGIAN INI --- */
.card-actions {
  display: flex;
  gap: 15px;
  width: 100%;
}

.download-link, .view-link {
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
  flex-grow: 1; /* Properti kunci untuk lebar yang sama */
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
/* --- AKHIR DARI PERBAIKAN CSS --- */

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
  z-index: 1000;
}

.pdf-modal-content {
  background: white;
  width: 90%;
  height: 90vh;
  max-width: 900px;
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
  z-index: 1002;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .pengumuman-card {
    flex-direction: column;
  }
  
  .pengumuman-cover {
    width: 100%;
    height: 200px;
  }
}
</style>