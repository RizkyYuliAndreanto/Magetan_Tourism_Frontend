<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h1 class="main-title">
          <i class="fas fa-flag"></i>
          Data Visi & Misi
        </h1>
        <p class="subtitle">
          Kelola visi dan misi dinas pariwisata Magetan untuk memberikan arah
          strategis dalam pengembangan pariwisata daerah.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!visiMisiData"
          class="action-button add-button"
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

    <div v-else-if="!visiMisiData" class="table-container card">
      <div class="empty-state">
        <i class="fas fa-flag"></i>
        <h3>Belum Ada Visi & Misi</h3>
        <p>
          Mulai tambahkan visi dan misi dinas pariwisata untuk memberikan arah
          strategis pengembangan wisata Magetan.
        </p>
        <button class="action-button add-button" @click="openForm()">
          <i class="fas fa-plus-circle"></i> Tambah Visi Misi Pertama
        </button>
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
/* =========== Perubahan Styling untuk Konsistensi =========== */

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
  padding: 2rem;
  border: 1px solid #e0e6ed;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

.form-title,
.preview-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
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

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-info {
  flex: 1;
}

.main-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.main-title i {
  color: #007bff;
  font-size: 1.5rem;
}

.subtitle {
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
  line-height: 1.5;
}

/* Stats Section */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
}

.stat-card:nth-child(2):hover {
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2);
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

.add-button {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

.edit-button {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
}

/* Enhanced Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #dee2e6;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.empty-state p {
  margin-bottom: 1.5rem;
  opacity: 0.8;
  font-style: normal;
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
