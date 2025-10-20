<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-sitemap"></i>
          Data Struktur Organisasi
        </h2>
        <p class="subtitle">
          Kelola struktur organisasi dinas pariwisata Magetan dalam bentuk bagan
          atau diagram untuk memberikan gambaran hierarki jabatan yang jelas.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!strukturOrganisasiData"
          class="action-button create-button"
          @click="openForm()">
          <i class="fas fa-plus-circle"></i> Tambah Struktur Organisasi
        </button>
        <button
          v-else
          class="action-button edit-button"
          @click="openForm(strukturOrganisasiData)">
          <i class="fas fa-edit"></i> Edit Struktur Organisasi
        </button>
      </div>
    </div>

    <!-- Statistics Dashboard -->
    <div v-if="!formOpen" class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-sitemap"></i>
        </div>
        <div class="stat-content">
          <h3>{{ strukturOrganisasiData ? "1" : "0" }}</h3>
          <p>Struktur Organisasi</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-image"></i>
        </div>
        <div class="stat-content">
          <h3>
            {{ strukturOrganisasiData?.gambar_struktur_path ? "Ada" : "Tidak" }}
          </h3>
          <p>Gambar Struktur</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-calendar-check"></i>
        </div>
        <div class="stat-content">
          <h3>
            {{
              strukturOrganisasiData
                ? formatDate(strukturOrganisasiData.updatedAt)
                : "-"
            }}
          </h3>
          <p>Terakhir Diperbarui</p>
        </div>
      </div>
    </div>

    <!-- Form Overlay -->
    <div v-if="formOpen" class="form-overlay">
      <div class="form-card card">
        <StrukturOrganisasiForm
          :is-editing="!!strukturOrganisasiData"
          :initial-data="formStrukturOrganisasi"
          @close-form="closeForm"
          @save-struktur="handleSave"
          @update-struktur="handleUpdate" />
      </div>
    </div>

    <div v-else-if="strukturOrganisasiData" class="preview-container card">
      <h3 class="preview-title">Pratinjau Struktur Organisasi</h3>
      <div class="preview-content">
        <div class="preview-section">
          <h4 class="preview-subtitle">Judul</h4>
          <p>{{ strukturOrganisasiData.judul_struktur }}</p>
        </div>
        <div class="preview-section">
          <h4 class="preview-subtitle">Deskripsi</h4>
          <p>{{ strukturOrganisasiData.deskripsi_struktur || "-" }}</p>
        </div>
        <div
          class="preview-section"
          v-if="strukturOrganisasiData.gambar_struktur_path">
          <h4 class="preview-subtitle">Gambar Struktur</h4>
          <div class="file-preview-area">
            <img
              :src="getFilePath(strukturOrganisasiData.gambar_struktur_path)"
              alt="Struktur Organisasi"
              class="file-thumbnail" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-data-card card">
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-sitemap"></i>
        </div>
        <h3 class="empty-title">Belum Ada Struktur Organisasi</h3>
        <p class="empty-description">
          Belum ada data Struktur Organisasi yang tersimpan. Klik tombol "Tambah
          Struktur Organisasi" di atas untuk menambahkan struktur organisasi
          Anda.
        </p>
      </div>
    </div>

    <BasePopUp
      v-if="showPopUp"
      :key="`${popUpStatus}-${popUpAction}`"
      :status="popUpStatus"
      :action="popUpAction"
      :entity-name="popUpEntity"
      :error-message="popUpMessage"
      @close="closePopUp" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import axios from "axios";
import StrukturOrganisasiForm from "./StrukturOrganisasiForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const strukturOrganisasiData = ref(null);
const formStrukturOrganisasi = ref({});
const formOpen = ref(false);

// State untuk pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Struktur Organisasi");
const popUpMessage = ref("");

// Fungsi utilitas untuk mengontrol pop-up
const openPopUp = (status, action, message = "") => {
  popUpStatus.value = status;
  popUpAction.value = action;
  popUpMessage.value = message;

  if (showPopUp.value) {
    showPopUp.value = false;
    requestAnimationFrame(() => {
      showPopUp.value = true;
    });
  } else {
    showPopUp.value = true;
  }
};

const closePopUp = () => {
  showPopUp.value = false;
};

const fetchStrukturOrganisasiData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/struktur-organisasi"
    );

    // Jika berhasil mendapat response
    if (response.data && response.data.id_struktur_organisasi) {
      // Ada data struktur organisasi
      strukturOrganisasiData.value = response.data;
      formStrukturOrganisasi.value = {
        ...response.data,
        gambar_struktur_organisasi: null,
      };
    } else {
      // Tidak ada data struktur organisasi (kondisi normal)
      strukturOrganisasiData.value = null;
      formStrukturOrganisasi.value = {
        id_struktur_organisasi: null,
        judul_struktur: "Struktur Organisasi",
        deskripsi_struktur: null,
        gambar_struktur_organisasi: null,
      };
    }
  } catch (err) {
    // Hanya tampilkan error jika bukan 404 (data tidak ditemukan)
    if (err.response && err.response.status === 404) {
      // 404 berarti belum ada data, ini normal
      strukturOrganisasiData.value = null;
      formStrukturOrganisasi.value = {
        id_struktur_organisasi: null,
        judul_struktur: "Struktur Organisasi",
        deskripsi_struktur: null,
        gambar_struktur_organisasi: null,
      };
    } else {
      // Error lainnya yang perlu ditampilkan
      console.error("Gagal memuat data Struktur Organisasi:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Terjadi kesalahan saat memuat data Struktur Organisasi";
      openPopUp("error", "fetch", errorMessage);
      strukturOrganisasiData.value = null;
    }
  }
};

const openForm = (data = null) => {
  formStrukturOrganisasi.value = data
    ? { ...data, gambar_struktur_organisasi: null }
    : {
        id_struktur_organisasi: null,
        judul_struktur: "Struktur Organisasi",
        deskripsi_struktur: null,
        gambar_struktur_organisasi: null,
      };
  formOpen.value = true;

  // Prevent body scroll
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
};

const closeForm = () => {
  formOpen.value = false;

  // Restore body scroll
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";

  fetchStrukturOrganisasiData(); // Refresh data setelah form ditutup
};

const handleSave = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.post(
      "http://localhost:5000/api/struktur-organisasi",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    openPopUp("success", "create");
    closeForm();
  } catch (err) {
    console.error("Gagal menyimpan Struktur Organisasi:", err.response?.data);
    openPopUp(
      "error",
      "create",
      err.response?.data?.error || "Gagal menyimpan Struktur Organisasi."
    );
  }
};

const handleUpdate = async (id, formData) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.put(
      `http://localhost:5000/api/struktur-organisasi/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    openPopUp("success", "update");
    closeForm();
  } catch (err) {
    console.error("Gagal memperbarui Struktur Organisasi:", err.response?.data);
    openPopUp(
      "error",
      "update",
      err.response?.data?.error || "Gagal memperbarui Struktur Organisasi."
    );
  }
};

const getFilePath = (path) => {
  return `http://localhost:5000${path}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(() => {
  fetchStrukturOrganisasiData();
});
</script>

<style scoped>
/* =========== Template Konsisten untuk Admin Management =========== */

/* Card Base Style */
.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e6ed;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
}

.header-section > * {
  position: relative;
  z-index: 1;
}

.header-info {
  flex: 1;
}

.main-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.main-title i {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.75rem;
}

.subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.6;
  max-width: 600px;
}

/* Stats Section */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
}

.stat-card:hover {
  transform: translateY(-3px) scale(1.02);
}

.stat-card:nth-child(1) {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.stat-card:nth-child(1):hover {
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.stat-card:nth-child(2):hover {
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.stat-card:nth-child(3):hover {
  box-shadow: 0 8px 25px rgba(255, 193, 7, 0.3);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.9;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.stat-content p {
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
}

/* Form Overlay */
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.form-card {
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;
  padding: 2rem;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}
.action-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.create-button {
  background-color: #007bff;
}
.create-button:hover {
  background-color: #0069d9;
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.2);
}
.edit-button {
  background-color: #ffc107;
}
.edit-button:hover {
  background-color: #e0a800;
  box-shadow: 0 6px 16px rgba(255, 193, 7, 0.2);
}

.form-card.card,
.preview-container.card,
.no-data-card.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 0;
}

.form-title,
.preview-title {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #dee2e6;
  font-size: 1.25rem;
  font-weight: 700;
  color: #495057;
  margin: 0 0 0 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.preview-title::before {
  content: "\f06e";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  color: #667eea;
}

.preview-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.preview-section {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 8px;
  border-left: 4px solid #667eea;
  transition: all 0.3s ease;
}

.preview-section:hover {
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.preview-subtitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preview-subtitle::before {
  content: "\f0a4";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  color: #667eea;
  font-size: 0.9rem;
}

.preview-content p {
  color: #495057;
  line-height: 1.6;
  margin: 0;
  background: white;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}
.file-preview-area {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
.file-thumbnail {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.no-data-card {
  text-align: center;
  padding: 3rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  font-size: 4rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #495057;
  margin: 0;
}

.empty-description {
  color: #6c757d;
  font-style: italic;
  max-width: 500px;
  line-height: 1.6;
  margin: 0;
}

/* Content Containers */
.preview-container,
.no-data-card {
  padding: 2rem;
  margin-bottom: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 1rem;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .form-card,
  .preview-container,
  .no-data-card {
    padding: 1.5rem;
  }

  .stat-content h3 {
    font-size: 1.5rem;
  }
}
</style>
