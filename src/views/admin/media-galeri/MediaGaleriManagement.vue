<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-images"></i>
          Data Media Galeri
        </h2>
        <p class="subtitle">
          Kelola galeri foto dan video untuk semua konten wisata, termasuk
          destinasi, event, akomodasi, dan konten lainnya untuk memperkaya
          informasi visual.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formMediaOpen"
          class="action-button create-button"
          @click="openMediaForm()">
          <i class="fas fa-plus-circle"></i> Tambah Media Baru
        </button>
      </div>
    </div>

    <!-- Statistics Dashboard -->
    <div v-if="!formMediaOpen" class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-images"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalMedia }}</h3>
          <p>Total Media</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-camera"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalGambar }}</h3>
          <p>Gambar</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-video"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalVideo }}</h3>
          <p>Video</p>
        </div>
      </div>
    </div>

    <!-- Form Overlay -->
    <div v-if="formMediaOpen" class="form-overlay">
      <div class="form-card card">
        <MediaGaleriForm
          :is-editing="isEditingMedia"
          :initial-data="formMedia"
          @close-form="closeMediaForm"
          @save-media="handleSaveMedia"
          @update-media="handleUpdateMedia" />
      </div>
    </div>

    <div v-else>
      <div class="table-container card">
        <div class="table-header">
          <h3 class="table-title">
            <i class="fas fa-list"></i>
            Daftar Media Galeri
          </h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th><i class="fas fa-hashtag"></i> ID</th>
                <th><i class="fas fa-link"></i> ID Konten</th>
                <th><i class="fas fa-tag"></i> Tipe Konten</th>
                <th><i class="fas fa-file"></i> Jenis File</th>
                <th><i class="fas fa-comment"></i> Deskripsi</th>
                <th><i class="fas fa-sort-numeric-up"></i> Urutan</th>
                <th><i class="fas fa-eye"></i> Pratinjau</th>
                <th><i class="fas fa-cogs"></i> Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="mediaGaleriList.length === 0">
                <td colspan="8">
                  <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <h3>Belum Ada Media</h3>
                    <p>
                      Mulai upload foto dan video untuk memperkaya galeri konten
                      wisata Magetan.
                    </p>
                    <button
                      class="action-button add-button"
                      @click="openMediaForm()">
                      <i class="fas fa-plus-circle"></i> Upload Media Pertama
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-for="media in mediaGaleriList" :key="media.id_media_galeri">
                <td>{{ media.id_media_galeri }}</td>
                <td>{{ media.id_konten || "-" }}</td>
                <td>{{ media.tipe_konten || "-" }}</td>
                <td>{{ media.jenis_file }}</td>
                <td>{{ media.deskripsi_file || "-" }}</td>
                <td>{{ media.urutan_tampil }}</td>
                <td>
                  <div class="media-preview-thumb">
                    <img
                      v-if="media.jenis_file === 'gambar'"
                      :src="getMediaUrl(media.path_file)"
                      alt="Preview"
                      class="media-thumbnail-small" />
                    <video
                      v-else-if="media.jenis_file === 'video'"
                      :src="getMediaUrl(media.path_file)"
                      controls
                      class="media-thumbnail-small"></video>
                  </div>
                </td>
                <td class="actions">
                  <button
                    class="action-button edit-button"
                    @click="openMediaForm(media)"
                    title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="action-button delete-button"
                    @click="showDeleteConfirm(media.id_media_galeri)"
                    title="Hapus">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <BasePopUp
      v-if="showPopUp"
      :key="`${popUpStatus}-${popUpAction}`"
      :status="popUpStatus"
      :action="popUpAction"
      :entity-name="popUpEntity"
      :error-message="popUpMessage"
      @close="closePopUp"
      @confirmed="handleDeleteConfirmed" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import axios from "axios";
import MediaGaleriForm from "./MediaGaleriForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const mediaGaleriList = ref([]);
const formMediaOpen = ref(false);
const isEditingMedia = ref(false);
const formMedia = ref(null);

// State untuk pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Media Galeri");
const popUpMessage = ref("");
const mediaToDeleteId = ref(null);

// Computed properties untuk statistics
const totalMedia = computed(() => mediaGaleriList.value.length);

const totalGambar = computed(() => {
  return mediaGaleriList.value.filter((media) => media.jenis_file === "gambar")
    .length;
});

const totalVideo = computed(() => {
  return mediaGaleriList.value.filter((media) => media.jenis_file === "video")
    .length;
});

// Fungsi yang memicu pop-up konfirmasi
const showDeleteConfirm = (id) => {
  mediaToDeleteId.value = id;
  popUpStatus.value = "confirm";
  popUpAction.value = "confirmDelete";
  showPopUp.value = true;
};

// Fungsi yang dipanggil setelah konfirmasi hapus dari pop-up
const handleDeleteConfirmed = async () => {
  // Tutup popup konfirmasi agar komponen unmount
  closePopUp();
  await nextTick();

  try {
    const token = localStorage.getItem("access_token");
    await axios.delete(
      `http://localhost:5000/api/media-galeri/${mediaToDeleteId.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    openPopUp("success", "delete");
    fetchMediaGaleriData();
  } catch (err) {
    console.error("Gagal menghapus media:", err.response?.data);
    openPopUp(
      "error",
      "delete",
      err.response?.data?.error || "Gagal menghapus media."
    );
  } finally {
    mediaToDeleteId.value = null;
  }
};

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

const fetchMediaGaleriData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/media-galeri");
    mediaGaleriList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data media galeri:", err);
    openPopUp("error", "fetch", "Gagal memuat data media galeri.");
  }
};

const openMediaForm = (media = null) => {
  isEditingMedia.value = !!media;
  if (media) {
    formMedia.value = { ...media };
  } else {
    formMedia.value = {
      id_media_galeri: null,
      id_konten: null,
      tipe_konten: "",
      path_file: null,
      deskripsi_file: "",
      jenis_file: "gambar",
      urutan_tampil: 0,
    };
  }
  formMediaOpen.value = true;
  // Mencegah scroll pada body saat form terbuka
  document.body.style.overflow = "hidden";
};

const closeMediaForm = () => {
  formMediaOpen.value = false;
  // Mengembalikan scroll pada body saat form ditutup
  document.body.style.overflow = "auto";
  fetchMediaGaleriData();
};

const handleSaveMedia = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.post("http://localhost:5000/api/media-galeri", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    openPopUp("success", "create");
    closeMediaForm();
  } catch (err) {
    console.error("Gagal menyimpan media galeri:", err.response?.data);
    openPopUp(
      "error",
      "create",
      err.response?.data?.error || "Gagal menyimpan media galeri."
    );
  }
};

const handleUpdateMedia = async (formData, mediaId) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.put(
      `http://localhost:5000/api/media-galeri/${mediaId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    openPopUp("success", "update");
    closeMediaForm();
  } catch (err) {
    console.error("Gagal memperbarui media galeri:", err.response?.data);
    openPopUp(
      "error",
      "update",
      err.response?.data?.error || "Gagal memperbarui media galeri."
    );
  }
};

const getMediaUrl = (path) => {
  return `http://localhost:5000${path}`;
};

onMounted(() => {
  fetchMediaGaleriData();
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

/* Action Button */
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

.create-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Table Container */
.table-wrapper {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
}

.table-wrapper::before {
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

.table-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header::before {
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

.table-header > * {
  position: relative;
  z-index: 1;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-responsive {
  overflow-x: auto;
  background: white;
  position: relative;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  margin: 0;
  font-size: 0.9rem;
  position: relative;
  min-width: 700px;
}

.data-table th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.data-table th i {
  color: #007bff;
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.data-table td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  vertical-align: middle;
  transition: all 0.2s ease;
}

.data-table tbody tr {
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.data-table tbody tr:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-left: 3px solid #667eea;
  transform: translateX(2px);
}

.data-table .text-center {
  text-align: center;
}

/* Action Buttons in Table */
.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.actions .action-button {
  padding: 0.625rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.actions .action-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.actions .action-button:hover::before {
  left: 100%;
}

.actions .edit-button {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
}

.actions .edit-button:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
}

.actions .delete-button {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
}

.actions .delete-button:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.media-preview-thumb {
  width: 70px;
  height: 70px;
  overflow: hidden;
  border-radius: 12px;
  background-color: #f3f4f6;
  border: 2px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.media-preview-thumb:hover {
  transform: scale(1.1) rotate(2deg);
  border-color: #3b82f6;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

.media-thumbnail-small {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.no-data-found {
  text-align: center;
  font-style: italic;
  color: #6b7280;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
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

.subtitle {
  font-size: 1rem;
  color: #dcdfe2;
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

/* Form Overlay */
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 9999;
  overflow-y: auto;
  padding: 2rem;
  box-sizing: border-box;
}

.form-overlay .form-card {
  position: relative;
  max-width: 900px;
  width: 100%;
  margin: auto;
  z-index: 10000;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Empty State */
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
  line-height: 1.5;
}

.empty-state .add-button {
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}

.empty-state .add-button:hover {
  background-color: #0069d9;
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.3);
  transform: translateY(-1px);
}

.add-button {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    padding: 1.5rem;
  }

  .main-title {
    font-size: 1.5rem;
    justify-content: center;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .stats-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .action-bar {
    justify-content: stretch;
    width: 100%;
  }

  .action-button {
    flex: 1;
    justify-content: center;
  }

  .table-header {
    padding: 1.25rem 1rem;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .table-responsive {
    font-size: 0.8rem;
  }

  .data-table {
    min-width: 600px;
  }

  .data-table th,
  .data-table td {
    padding: 1rem 0.75rem;
  }

  .actions .action-button {
    width: 2.25rem;
    height: 2.25rem;
    padding: 0.5rem;
  }

  .media-preview-thumb {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 1.25rem;
  }

  .main-title {
    font-size: 1.25rem;
  }

  .table-header {
    padding: 1rem 0.75rem;
  }

  .data-table {
    min-width: 500px;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }

  .actions .action-button {
    width: 2rem;
    height: 2rem;
    padding: 0.375rem;
  }

  .media-preview-thumb {
    width: 50px;
    height: 50px;
  }

  .no-data-found {
    padding: 2rem 1rem;
  }
}
</style>
