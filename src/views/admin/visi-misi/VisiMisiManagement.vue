<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-flag"></i>
          Data Visi & Misi
        </h2>
        <p class="subtitle">
          Kelola visi dan misi dinas pariwisata Magetan untuk memberikan arah
          strategis dalam pengembangan pariwisata daerah.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!visiMisiData"
          class="action-button create-button"
          @click="openForm()">
          <i class="fas fa-plus-circle"></i> Tambah Visi Misi
        </button>
        <button
          v-else
          class="action-button edit-button"
          @click="openForm(visiMisiData)">
          <i class="fas fa-edit"></i> Edit Visi Misi
        </button>
      </div>
    </div>

    <!-- Statistics Dashboard -->
    <div v-if="!formOpen" class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-flag"></i>
        </div>
        <div class="stat-content">
          <h3>{{ visiMisiData ? "1" : "0" }}</h3>
          <p>Visi & Misi</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-file-alt"></i>
        </div>
        <div class="stat-content">
          <h3>{{ visiMisiData?.tipe_file_visi_misi || "-" }}</h3>
          <p>Tipe File</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-calendar-check"></i>
        </div>
        <div class="stat-content">
          <h3>{{ visiMisiData ? formatDate(visiMisiData.updatedAt) : "-" }}</h3>
          <p>Terakhir Diperbarui</p>
        </div>
      </div>
    </div>

    <div v-if="formOpen" class="form-card card">
      <VisiMisiForm
        :is-editing="!!visiMisiData"
        :initial-data="formVisiMisi"
        @close-form="closeForm"
        @save-visi-misi="handleSave"
        @update-visi-misi="handleUpdate" />
    </div>

    <div v-else-if="visiMisiData" class="preview-container card">
      <h3 class="preview-title">Pratinjau Visi Misi</h3>
      <div class="preview-content">
        <div v-if="visiMisiData.deskripsi" class="preview-section">
          <h4 class="preview-subtitle">Deskripsi</h4>
          <p>{{ visiMisiData.deskripsi }}</p>
        </div>
        <div v-if="visiMisiData.visi_misi_file_path" class="preview-section">
          <h4 class="preview-subtitle">File Visi Misi</h4>
          <div class="file-preview-area">
            <img
              v-if="visiMisiData.tipe_file_visi_misi === 'gambar'"
              :src="getFilePath(visiMisiData.visi_misi_file_path)"
              alt="Visi Misi File"
              class="file-thumbnail" />
            <a
              v-else-if="visiMisiData.tipe_file_visi_misi === 'pdf'"
              :href="getFilePath(visiMisiData.visi_misi_file_path)"
              target="_blank"
              class="pdf-link">
              <i class="fas fa-file-pdf pdf-icon"></i>
              <span>Lihat PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-data-card card">
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-flag"></i>
        </div>
        <h3 class="empty-title">Belum Ada Visi & Misi</h3>
        <p class="empty-description">
          Belum ada data Visi & Misi yang tersimpan. Klik tombol "Tambah Visi &
          Misi" di atas untuk menambahkan visi dan misi dinas pariwisata untuk
          memberikan arah strategis pengembangan wisata Magetan.
        </p>
      </div>
    </div>

    <!-- Implementasi komponen pop-up -->
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
import VisiMisiForm from "./VisiMisiForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const visiMisiData = ref(null);
const formVisiMisi = ref({});
const formOpen = ref(false);

// State untuk pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Visi Misi");
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

const fetchVisiMisiData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/visi-misi");

    // Jika berhasil mendapat response
    if (response.data && response.data.id_visi_misi) {
      // Ada data visi misi
      visiMisiData.value = response.data;
      formVisiMisi.value = { ...response.data, visi_misi_file: null };
    } else {
      // Tidak ada data visi misi (kondisi normal)
      visiMisiData.value = null;
      formVisiMisi.value = {
        id_visi_misi: null,
        visi_misi_file: null,
        deskripsi: null,
      };
    }
  } catch (err) {
    // Hanya tampilkan error jika bukan 404 (data tidak ditemukan)
    if (err.response && err.response.status === 404) {
      // 404 berarti belum ada data, ini normal
      visiMisiData.value = null;
      formVisiMisi.value = {
        id_visi_misi: null,
        visi_misi_file: null,
        deskripsi: null,
      };
    } else {
      // Error lainnya yang perlu ditampilkan
      console.error("Gagal memuat data Visi Misi:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Terjadi kesalahan saat memuat data Visi Misi";
      openPopUp("error", "fetch", errorMessage);
      visiMisiData.value = null;
    }
  }
};

const openForm = (data = null) => {
  formVisiMisi.value = data
    ? { ...data, visi_misi_file: null }
    : { id_visi_misi: null, visi_misi_file: null, deskripsi: null };
  formOpen.value = true;
  // Mencegah scroll pada body saat form terbuka
  document.body.style.overflow = "hidden";
};

const closeForm = () => {
  formOpen.value = false;
  // Mengembalikan scroll pada body saat form ditutup
  document.body.style.overflow = "auto";
  fetchVisiMisiData(); // Refresh data setelah form ditutup
};

const handleSave = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.post("http://localhost:5000/api/visi-misi", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    openPopUp("success", "create");
    closeForm();
  } catch (err) {
    console.error("Gagal menyimpan Visi Misi:", err.response?.data);
    openPopUp(
      "error",
      "create",
      err.response?.data?.error || "Gagal menyimpan Visi Misi."
    );
  }
};

const handleUpdate = async (id, formData) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.put(`http://localhost:5000/api/visi-misi/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    openPopUp("success", "update");
    closeForm();
  } catch (err) {
    console.error("Gagal memperbarui Visi Misi:", err.response?.data);
    openPopUp(
      "error",
      "update",
      err.response?.data?.error || "Gagal memperbarui Visi Misi."
    );
  }
};

const getFilePath = (path) => {
  return `http://localhost:5000${path}`;
};

onMounted(() => {
  fetchVisiMisiData();
});
</script>

<style scoped>
/* ========== Styling yang diselaraskan dengan NewsManagement Template ========== */

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

.action-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* Action Buttons */
.action-button {
  padding: 0.875rem 1.75rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  text-decoration: none;
  outline: none;
  position: relative;
  overflow: hidden;
}

.create-button {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
  border: 1px solid #2563eb;
}

.create-button:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2),
    0 4px 6px -2px rgba(59, 130, 246, 0.1);
}

.edit-button {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
  border: 1px solid #d97706;
}

.edit-button:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.2),
    0 4px 6px -2px rgba(245, 158, 11, 0.1);
}

/* Cards */
.form-card.card,
.preview-container.card,
.no-data-card.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.form-card.card::before,
.preview-container.card::before,
.no-data-card.card::before {
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

.form-title,
.preview-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
  position: relative;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.preview-section {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}
.preview-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.preview-subtitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.5rem;
}
.preview-content p {
  color: #495057;
  line-height: 1.6;
  margin: 0;
}
.file-preview-area {
  margin-top: 1rem;
  display: flex; /* Menjadikan kontainer flexbox */
  justify-content: center; /* Memposisikan konten di tengah secara horizontal */
}
.file-thumbnail {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin: auto;
  width: 50%;
  padding: 10px;
}
.pdf-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}
.pdf-link:hover {
  text-decoration: underline;
}
.pdf-icon {
  font-size: 2rem;
  color: #dc3545;
}

.no-data-card {
  text-align: center;
  padding: 3rem;
}

.empty-state p {
  color: #6c757d;
  font-style: italic;
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

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.stat-card:nth-child(3):hover {
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
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
  margin: 0;
  opacity: 0.9;
  font-weight: 500;
}

/* Enhanced Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  padding: 3rem 2rem;
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

/* Responsive Design */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 1rem;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>
