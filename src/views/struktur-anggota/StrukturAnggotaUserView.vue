<template>
  <div class="detail-page-container">
    <div class="content-wrapper">
      <button @click="goBack" class="back-button">
        <i class="fas fa-arrow-left"></i> Kembali
      </button>
      <h1 class="page-main-title">Struktur Anggota</h1>

      <div v-if="loading" class="state-message">
        <div class="spinner"></div>
        <p>Memuat Struktur Anggota...</p>
      </div>
      <div v-if="error" class="state-message error-message">
        <p>
          ❌ Maaf, terjadi kesalahan saat memuat data. Silakan coba kembali.
        </p>
      </div>
      <div
        v-if="!loading && !error && strukturAnggotaList.length === 0"
        class="state-message empty-message">
        <p>📋 Belum ada daftar anggota struktur yang tersedia saat ini.</p>
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

const fetchStrukturAnggotaData = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await axios.get(`${baseUrl}/api/struktur-anggota`);
    if (response.data) {
      strukturAnggotaList.value = response.data.sort(
        (a, b) => a.urutan_tampilan - b.urutan_tampilan
      );
    } else {
      strukturAnggotaList.value = [];
    }
  } catch (err) {
    console.error("Error fetching Struktur Anggota data:", err);
    error.value = true;
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
/* Base Page Styles */
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 25px;
  cursor: pointer;
}
.anggota-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
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
