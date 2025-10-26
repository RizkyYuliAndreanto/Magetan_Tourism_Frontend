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
            <i class="fas fa-users"></i>
            Struktur Anggota
          </h1>
          <p class="hero-subtitle">Susunan Kepegawaian Dinas</p>
          <p class="hero-description">
            Informasi lengkap mengenai struktur kepegawaian dan anggota
            organisasi Dinas Kebudayaan dan Pariwisata Kabupaten Magetan.
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">{{ totalAnggota }}</div>
              <div class="stat-label">Total Anggota</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">{{ totalJabatan }}</div>
              <div class="stat-label">Jabatan</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <div v-if="loading" class="state-message">
        <div class="spinner"></div>
        <p>Memuat Struktur Anggota...</p>
      </div>
      <div v-if="error" class="state-message error-message">
        <div class="state-icon">🔧</div>
        <h3>Gagal Memuat Data</h3>
        <p>
          Tidak dapat mengakses informasi struktur anggota. Silakan coba kembali
          atau hubungi administrator.
        </p>
      </div>
      <div
        v-if="!loading && !error && strukturAnggotaList.length === 0"
        class="state-message empty-message">
        <div class="state-icon">�</div>
        <h3>Belum Ada Konten</h3>
        <p>
          Informasi struktur anggota organisasi belum tersedia. Silakan periksa
          kembali nanti.
        </p>
      </div>

      <div
        v-if="strukturAnggotaList.length > 0 && !loading"
        class="anggota-content">
        <div v-if="kepalaDinas" class="anggota-section">
          <h3 class="anggota-grid-title">Kepala Dinas</h3>
          <div class="anggota-flex-center">
            <div
              class="anggota-card kepala-dinas-card"
              @click="openAnggotaDetailModal(kepalaDinas)">
              <div class="anggota-photo-container kepala-dinas-photo">
                <img
                  v-if="kepalaDinas.foto_anggota"
                  :src="baseUrl + kepalaDinas.foto_anggota"
                  :alt="kepalaDinas.nama_anggota"
                  class="anggota-photo" />
                <div
                  v-else
                  class="anggota-photo-placeholder kepala-dinas-photo-placeholder">
                  <i class="fas fa-user-circle"></i>
                </div>
              </div>
              <h2 class="anggota-name kepala-dinas-name">
                {{ kepalaDinas.nama_anggota }}
              </h2>
              <p class="anggota-jabatan kepala-dinas-jabatan">
                {{ kepalaDinas.jabatan }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="sekretaris" class="anggota-section">
          <h3 class="anggota-grid-title">Sekretaris</h3>
          <div class="anggota-flex-center">
            <div
              class="anggota-card sekretaris-card"
              @click="openAnggotaDetailModal(sekretaris)">
              <div class="anggota-photo-container sekretaris-photo">
                <img
                  v-if="sekretaris.foto_anggota"
                  :src="baseUrl + sekretaris.foto_anggota"
                  :alt="sekretaris.nama_anggota"
                  class="anggota-photo" />
                <div
                  v-else
                  class="anggota-photo-placeholder sekretaris-photo-placeholder">
                  <i class="fas fa-user-circle"></i>
                </div>
              </div>
              <h2 class="anggota-name sekretaris-name">
                {{ sekretaris.nama_anggota }}
              </h2>
              <p class="anggota-jabatan sekretaris-jabatan">
                {{ sekretaris.jabatan }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="kepalaBidangList.length > 0" class="anggota-section">
          <h3 class="anggota-grid-title">Kepala Bidang</h3>
          <div class="anggota-grid">
            <div
              v-for="anggota in kepalaBidangList"
              :key="anggota.id_struktur_anggota"
              class="anggota-card"
              @click="openAnggotaDetailModal(anggota)">
              <div class="anggota-photo-container">
                <img
                  v-if="anggota.foto_anggota"
                  :src="baseUrl + anggota.foto_anggota"
                  :alt="anggota.nama_anggota"
                  class="anggota-photo" />
                <div v-else class="anggota-photo-placeholder">
                  <i class="fas fa-user-circle"></i>
                </div>
              </div>
              <h2 class="anggota-name">{{ anggota.nama_anggota }}</h2>
              <p class="anggota-jabatan">{{ anggota.jabatan }}</p>
            </div>
          </div>
        </div>

        <div v-if="stafLainnya.length > 0" class="anggota-section">
          <h3 class="anggota-grid-title">Staf Lainnya</h3>
          <div class="anggota-grid">
            <div
              v-for="anggota in stafLainnya"
              :key="anggota.id_struktur_anggota"
              class="anggota-card"
              @click="openAnggotaDetailModal(anggota)">
              <div class="anggota-photo-container">
                <img
                  v-if="anggota.foto_anggota"
                  :src="baseUrl + anggota.foto_anggota"
                  :alt="anggota.nama_anggota"
                  class="anggota-photo" />
                <div v-else class="anggota-photo-placeholder">
                  <i class="fas fa-user-circle"></i>
                </div>
              </div>
              <h2 class="anggota-name">{{ anggota.nama_anggota }}</h2>
              <p class="anggota-jabatan">{{ anggota.jabatan }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showAnggotaModal"
    class="anggota-modal-overlay"
    @click.self="closeAnggotaDetailModal">
    <div class="anggota-modal-content">
      <button class="close-button" @click="closeAnggotaDetailModal">×</button>
      <div v-if="currentAnggotaDetail" class="modal-body-content">
        <div class="modal-anggota-photo-container">
          <img
            v-if="currentAnggotaDetail.foto_anggota"
            :src="baseUrl + currentAnggotaDetail.foto_anggota"
            :alt="currentAnggotaDetail.nama_anggota"
            class="modal-anggota-photo" />
          <div v-else class="modal-anggota-photo-placeholder">
            <i class="fas fa-user-circle"></i>
          </div>
        </div>
        <h2 class="modal-anggota-name">
          {{ currentAnggotaDetail.nama_anggota }}
        </h2>
        <p class="modal-anggota-jabatan">{{ currentAnggotaDetail.jabatan }}</p>

        <div
          v-if="currentAnggotaDetail.deskripsi_tugas"
          class="modal-anggota-deskripsi">
          <h3 class="modal-section-title">Deskripsi Tugas</h3>
          <p>{{ currentAnggotaDetail.deskripsi_tugas }}</p>
        </div>
        <div v-else class="modal-anggota-deskripsi">
          <p class="text-muted">Deskripsi tugas tidak tersedia.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const strukturAnggotaList = ref([]);
const loading = ref(true);
const error = ref(false);
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const showAnggotaModal = ref(false);
const currentAnggotaDetail = ref(null);

// Computed properties for statistics
const totalAnggota = computed(() => strukturAnggotaList.value.length);
const totalJabatan = computed(
  () => [...new Set(strukturAnggotaList.value.map((a) => a.jabatan))].length
);

const fetchStrukturAnggotaData = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await axios.get(`${baseUrl}/api/struktur-anggota`);
    if (
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      strukturAnggotaList.value = response.data.sort(
        (a, b) => a.urutan_tampilan - b.urutan_tampilan
      );
    } else {
      strukturAnggotaList.value = [];
    }
  } catch (err) {
    console.error("Error fetching Struktur Anggota data:", err);
    // Jika error 404 atau data kosong, jangan tampilkan sebagai error
    if (
      err.response &&
      (err.response.status === 404 || err.response.status === 204)
    ) {
      strukturAnggotaList.value = [];
      error.value = false;
    } else {
      error.value = true;
    }
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.back();
};

const openAnggotaDetailModal = (anggota) => {
  currentAnggotaDetail.value = anggota;
  showAnggotaModal.value = true;
};

const closeAnggotaDetailModal = () => {
  showAnggotaModal.value = false;
  currentAnggotaDetail.value = null;
};

const kepalaDinas = computed(() => {
  return strukturAnggotaList.value.find((anggota) =>
    anggota.jabatan.toLowerCase().includes("kepala dinas")
  );
});

const sekretaris = computed(() => {
  return strukturAnggotaList.value.find((anggota) =>
    anggota.jabatan.toLowerCase().includes("sekretaris")
  );
});

const kepalaBidangList = computed(() => {
  return strukturAnggotaList.value.filter((anggota) =>
    anggota.jabatan.toLowerCase().includes("kepala bidang")
  );
});

const stafLainnya = computed(() => {
  return strukturAnggotaList.value.filter(
    (anggota) =>
      !anggota.jabatan.toLowerCase().includes("kepala dinas") &&
      !anggota.jabatan.toLowerCase().includes("sekretaris") &&
      !anggota.jabatan.toLowerCase().includes("kepala bidang")
  );
});

onMounted(() => {
  // Scroll ke atas halaman
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  fetchStrukturAnggotaData();
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

/* Specific Styles for StrukturAnggotaView */
.anggota-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

/* Container untuk bagian Kepala Dinas dan Sekretaris */
.anggota-section {
  width: 100%;
}

.anggota-flex-center {
  display: flex;
  justify-content: center;
}

.anggota-grid-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a1a1a;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 25px;
}
.anggota-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

/* KARTU KEPALA DINAS DAN SEKRETARIS DIBESARKAN DAN DITENGAHKAN */
.kepala-dinas-card {
  min-width: 350px;
  max-width: 500px;
  padding: 35px;
}
.kepala-dinas-photo {
  width: 250px;
  height: 250px;
}
.kepala-dinas-photo-placeholder {
  font-size: 6rem;
}
.kepala-dinas-name {
  font-size: 2rem;
}
.kepala-dinas-jabatan {
  font-size: 1.2rem;
}

.sekretaris-card {
  min-width: 350px;
  max-width: 500px;
  padding: 30px;
}
.sekretaris-photo {
  width: 200px;
  height: 200px;
}
.sekretaris-photo-placeholder {
  font-size: 5rem;
}
.sekretaris-name {
  font-size: 1.8rem;
}
.sekretaris-jabatan {
  font-size: 1.1rem;
}

/* Gaya Kartu Anggota Umum */
.anggota-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 119, 182, 0.08);
  border: 1px solid rgba(0, 119, 182, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 25px;
  cursor: pointer;
  position: relative;
}
.anggota-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 35px rgba(0, 119, 182, 0.15);
  border-color: rgba(0, 119, 182, 0.2);
}
.anggota-photo-container {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e0e0e0;
  margin-bottom: 15px;
  border: 3px solid #0077b6;
  display: flex;
  justify-content: center;
  align-items: center;
}
.anggota-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.anggota-photo-placeholder {
  font-size: 5rem;
  color: #999;
}
.anggota-name {
  font-size: 1.6rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}
.anggota-jabatan {
  font-size: 1.1rem;
  color: #0077b6;
  font-weight: 500;
  margin-bottom: 18px;
}
.anggota-deskripsi {
  display: none;
}

/* Modal Styling */
.anggota-modal-overlay {
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
.anggota-modal-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
}
.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  font-size: 1.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1001;
  transition: background-color 0.2s ease;
}
.close-button:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
.modal-body-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-anggota-photo-container {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #0077b6;
  margin-bottom: 20px;
}
.modal-anggota-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.modal-anggota-photo-placeholder {
  font-size: 6rem;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.modal-anggota-name {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 5px;
}
.modal-anggota-jabatan {
  font-size: 1.2rem;
  color: #0077b6;
  font-weight: 500;
  margin-bottom: 20px;
}
.modal-anggota-deskripsi {
  text-align: left;
  margin-top: 20px;
  font-size: 1rem;
  color: #495057;
  line-height: 1.6;
  padding: 0 20px;
}
.modal-section-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 10px;
}
.text-muted {
  color: #6c757d;
  font-style: italic;
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

/* Responsiveness */
@media (max-width: 768px) {
  .anggota-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  .anggota-name {
    font-size: 1.4rem;
  }
  .anggota-jabatan {
    font-size: 1rem;
  }
  .anggota-photo-container {
    width: 140px;
    height: 140px;
  }
  .anggota-photo-placeholder {
    font-size: 4.5rem;
  }
  .kepala-dinas-card,
  .sekretaris-card {
    max-width: 100%;
  }
  .anggota-modal-content {
    padding: 30px 20px;
  }
  .modal-anggota-photo-container {
    width: 150px;
    height: 150px;
  }
  .modal-anggota-name {
    font-size: 1.8rem;
  }
  .modal-anggota-jabatan {
    font-size: 1.1rem;
  }
}
</style>
<style scoped>
.detail-page-container {
  overflow-y: auto;
}
</style>
