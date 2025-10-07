<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h1 class="main-title">
          <i class="fas fa-images"></i>
          Data Media Galeri
        </h1>
        <p class="subtitle">
          Kelola galeri foto dan video untuk semua konten wisata, termasuk
          destinasi, event, akomodasi, dan konten lainnya untuk memperkaya
          informasi visual.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formMediaOpen"
          class="action-button add-button"
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

    <div v-if="formMediaOpen" class="form-card card">
      <MediaGaleriForm
        :is-editing="isEditingMedia"
        :initial-data="formMedia"
        @close-form="closeMediaForm"
        @save-media="handleSaveMedia"
        @update-media="handleUpdateMedia" />
    </div>

    <div v-else class="table-container card">
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
/* =========== Perubahan Styling untuk Konsistensi =========== */

/* Card Base Style */
.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e6ed;
}

/* Table Container */
.table-container {
  margin-bottom: 2rem;
}

.table-responsive {
  overflow-x: auto;
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

.form-card {
  padding: 2rem;
}

.table-container.card {
  padding: 0;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.data-table th,
.data-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.data-table th {
  background-color: #f8f9fa;
  color: #6c757d;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table td {
  color: #212529;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover {
  background-color: #f1f3f5;
}

.no-data-found {
  text-align: center;
  font-style: italic;
  color: #888;
  padding: 2rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.actions .action-button {
  padding: 0.6rem;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.actions .edit-button {
  background-color: #ffc107;
  color: white;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);
}

.actions .edit-button:hover {
  background-color: #e0a800;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.actions .delete-button {
  background-color: #dc3545;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}

.actions .delete-button:hover {
  background-color: #c82333;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.media-preview-thumb {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 8px;
  background-color: #e9ecef;
  border: 1px solid #dee2e6;
}

.media-thumbnail-small {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
    gap: 1rem;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .table-container {
    overflow-x: auto;
  }
}
</style>
