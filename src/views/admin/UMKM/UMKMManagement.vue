<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-store"></i>
          Data UMKM
        </h2>
        <p class="subtitle">
          Kelola data Usaha Mikro Kecil dan Menengah (UMKM) di Magetan untuk
          mendukung ekonomi lokal dan memberikan informasi produk unggulan
          kepada wisatawan.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formUMKMOpen"
          class="action-button create-button"
          @click="openUMKMForm()">
          <i class="fas fa-plus-circle"></i> Tambah UMKM Baru
        </button>
      </div>
    </div>

    <!-- Statistics Dashboard -->
    <div v-if="!formUMKMOpen" class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-store"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalUMKM }}</h3>
          <p>Total UMKM</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-calendar-plus"></i>
        </div>
        <div class="stat-content">
          <h3>{{ bulanIniUMKM }}</h3>
          <p>UMKM Bulan Ini</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-tags"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalKategoriUMKM }}</h3>
          <p>Kategori UMKM</p>
        </div>
      </div>
    </div>

    <div v-if="formUMKMOpen" class="form-overlay">
      <div class="form-card card">
        <UMKMForm
          :is-editing="isEditingUMKM"
          :initial-data="formUMKM"
          :gallery-list="editingUMKMGallery"
          :kategori-list="kategoriList"
          @close-form="closeUMKMForm"
          @save-umkm="handleSaveUMKM"
          @update-umkm="handleUpdateUMKM" />
      </div>
    </div>

    <div v-else class="table-container card">
      <div class="table-header">
        <h3 class="table-title">
          <i class="fas fa-store"></i>
          Daftar UMKM
        </h3>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th><i class="fas fa-hashtag"></i>ID</th>
              <th><i class="fas fa-store"></i>Nama UMKM</th>
              <th><i class="fas fa-tags"></i>Kategori</th>
              <th><i class="fas fa-user-shield"></i>Admin</th>
              <th><i class="fas fa-cogs"></i>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="umkmList.length === 0">
              <td colspan="5">
                <div class="empty-state">
                  <i class="fas fa-store"></i>
                  <h3>Belum Ada UMKM</h3>
                  <p>
                    Mulai daftarkan UMKM lokal untuk mendukung ekonomi Magetan
                    dan memberikan informasi kepada wisatawan.
                  </p>
                  <button
                    class="action-button add-button"
                    @click="openUMKMForm()">
                    <i class="fas fa-plus-circle"></i> Daftar UMKM Pertama
                  </button>
                </div>
              </td>
            </tr>
            <tr v-for="umkm in umkmList" :key="umkm.id_umkm">
              <td>{{ umkm.id_umkm }}</td>
              <td>{{ umkm.nama_umkm }}</td>
              <td>{{ umkm.kategoriUMKM?.nama_kategori || "-" }}</td>
              <td>{{ umkm.adminPembuat.username }}</td>
              <td class="actions">
                <button
                  class="action-button edit-button"
                  @click="openUMKMForm(umkm)"
                  title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="action-button delete-button"
                  @click="showDeleteConfirm(umkm.id_umkm)"
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
import UMKMForm from "./UMKMForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const umkmList = ref([]);
const kategoriList = ref([]);
const formUMKMOpen = ref(false);
const isEditingUMKM = ref(false);
const formUMKM = ref(null);
const editingUMKMGallery = ref([]);

// State untuk pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("UMKM");
const popUpMessage = ref("");
const umkmToDeleteId = ref(null);

// Computed properties untuk statistics
const totalUMKM = computed(() => umkmList.value.length);

const bulanIniUMKM = computed(() => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return umkmList.value.filter((umkm) => {
    const createdDate = new Date(umkm.createdAt);
    return (
      createdDate.getMonth() === currentMonth &&
      createdDate.getFullYear() === currentYear
    );
  }).length;
});

const totalKategoriUMKM = computed(() => kategoriList.value.length);

// Fungsi yang memicu pop-up konfirmasi
const showDeleteConfirm = (id) => {
  umkmToDeleteId.value = id;
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
      `http://localhost:5000/api/umkm/${umkmToDeleteId.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    openPopUp("success", "delete");
    fetchUMKMData();
  } catch (err) {
    console.error("Gagal menghapus UMKM:", err.response?.data);
    openPopUp(
      "error",
      "delete",
      err.response?.data?.error || "Gagal menghapus UMKM."
    );
  } finally {
    umkmToDeleteId.value = null;
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

const fetchUMKMData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/umkm");
    umkmList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data UMKM:", err);
    openPopUp("error", "fetch", "Gagal memuat data UMKM.");
  }
};

const fetchKategoriData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/kategori-umkm");
    kategoriList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data kategori:", err);
    openPopUp("error", "fetch", "Gagal memuat data kategori.");
  }
};

const openUMKMForm = async (umkm = null) => {
  isEditingUMKM.value = !!umkm;
  if (umkm) {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/umkm/${umkm.id_umkm}`
      );
      const fullUMKMData = response.data;
      formUMKM.value = {
        ...fullUMKMData,
      };
      editingUMKMGallery.value = fullUMKMData.galeriUMKM;
    } catch (error) {
      console.error("Gagal memuat detail UMKM:", error);
      openPopUp("error", "fetch", "Gagal memuat detail UMKM untuk diedit.");
      return;
    }
  } else {
    formUMKM.value = {
      id_umkm: null,
      nama_umkm: "",
      deskripsi_umkm: "",
      hastag_umkm: "",
      alamat_umkm: "",
      kontak_umkm: "",
      jam_operasional: "",
      hari_operasional: "",
      website_umkm: "",
      gambar_produk_utama: null,
      gambar_sampul: null,
      id_kategori_umkm: "",
    };
    editingUMKMGallery.value = [];
  }
  formUMKMOpen.value = true;

  // Prevent body scroll
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
};

const closeUMKMForm = () => {
  formUMKMOpen.value = false;

  // Restore body scroll
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";

  formUMKM.value = null;
  editingUMKMGallery.value = [];
  isEditingUMKM.value = false;
  fetchUMKMData();
};

const handleSaveUMKM = async (formData, galleryFiles) => {
  try {
    const token = localStorage.getItem("access_token");

    const umkmResponse = await axios.post(
      "http://localhost:5000/api/umkm",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const id_umkm = umkmResponse.data.umkm.id_umkm;

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append("id_konten", id_umkm);
      galleryFormData.append("tipe_konten", "umkm");

      galleryFiles.forEach((galleryItem) => {
        galleryFormData.append(`media_galeri_files`, galleryItem.file);
        galleryFormData.append("deskripsi_file", galleryItem.deskripsi || "");
        galleryFormData.append("jenis_file", galleryItem.jenis_file);
        galleryFormData.append("urutan_tampil", galleryItem.urutan);
      });
      await axios.post(
        "http://localhost:5000/api/media-galeri",
        galleryFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
    openPopUp("success", "create");
    closeUMKMForm();
  } catch (err) {
    console.error("Gagal menyimpan UMKM:", err.response?.data);
    openPopUp(
      "error",
      "create",
      err.response?.data?.error ||
        "Gagal menyimpan UMKM. Periksa kembali input Anda."
    );
  }
};

const handleUpdateUMKM = async (formData, galleryFiles, deletedGalleryIds) => {
  try {
    const token = localStorage.getItem("access_token");
    const id = formData.get("id_umkm");

    await axios.put(`http://localhost:5000/api/umkm/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append("id_konten", id);
      galleryFormData.append("tipe_konten", "umkm");
      galleryFiles.forEach((galleryItem) => {
        galleryFormData.append(`media_galeri_files`, galleryItem.file);
        galleryFormData.append("deskripsi_file", galleryItem.deskripsi || "");
        galleryFormData.append("jenis_file", galleryItem.jenis_file);
        galleryFormData.append("urutan_tampil", galleryItem.urutan);
      });
      await axios.post(
        "http://localhost:5000/api/media-galeri",
        galleryFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    if (deletedGalleryIds && deletedGalleryIds.length > 0) {
      await Promise.all(
        deletedGalleryIds.map(async (mediaId) => {
          await axios.delete(
            `http://localhost:5000/api/media-galeri/${mediaId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        })
      );
    }
    openPopUp("success", "update");
    closeUMKMForm();
  } catch (err) {
    console.error("Gagal memperbarui UMKM:", err.response?.data);
    openPopUp(
      "error",
      "update",
      err.response?.data?.error || "Gagal memperbarui UMKM."
    );
  }
};

onMounted(() => {
  fetchUMKMData();
  fetchKategoriData();
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
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  font-family: inherit;
  text-decoration: none;
}

.create-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
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
.table-container.card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  overflow: hidden;
  margin-top: 1rem;
}

/* Table Responsive Wrapper */
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Data Table */
.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  font-size: 0.875rem;
}

.data-table thead th {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #475569;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table thead th i {
  margin-right: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.data-table tbody td {
  padding: 1.25rem 1.5rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  line-height: 1.5;
}

.data-table tbody tr {
  transition: all 0.2s ease;
  background: white;
}

.data-table tbody tr:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  transform: scale(1.001);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.no-data-found {
  text-align: center;
  font-style: italic;
  color: #888;
  padding: 2rem;
}

/* Action Buttons */
.actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: flex-start;
}

.actions .action-button {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.actions .edit-button {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.actions .edit-button:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
}

.actions .delete-button {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.actions .delete-button:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.category-badge {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  background-color: #28a745;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-info {
  flex: 1;
}

.main-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.main-title i {
  font-size: 1.6rem;
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
  max-width: 600px;
}

/* Stats Section */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  color: white;
  padding: 1.75rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1.25rem;
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
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.stat-card:nth-child(1):hover {
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.stat-card:nth-child(2):hover {
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.stat-card:nth-child(3):hover {
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.stat-icon {
  font-size: 2.75rem;
  opacity: 0.95;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.stat-content p {
  font-size: 0.9375rem;
  margin: 0.375rem 0 0 0;
  opacity: 0.95;
  font-weight: 500;
}

/* Table Styling */
.table thead th {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.table thead th i {
  margin-right: 0.5rem;
  color: #007bff;
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
}

.add-button {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

/* Form Overlay Styles */
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
  align-items: center;
  z-index: 9999;
  overflow-y: auto;
  padding: 2rem;
  box-sizing: border-box;
}

.form-overlay .form-card {
  position: relative;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;
  z-index: 10000;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

/* Prevent background interaction */
.form-overlay::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 9998;
}

/* Table Header Styles */
.table-header {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.table-title i {
  color: #3b82f6;
  font-size: 1.125rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-section {
    flex-direction: column;
    gap: 1.5rem;
  }

  .action-bar {
    align-self: stretch;
  }

  .create-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .header-section {
    margin-bottom: 1.5rem;
  }

  .main-title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.875rem;
  }

  .stats-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    padding: 1.25rem;
  }

  .stat-content h3 {
    font-size: 1.75rem;
  }

  .table-header {
    padding: 1.25rem 1rem;
  }

  .table-title {
    justify-content: center;
    font-size: 1.125rem;
  }

  .data-table {
    min-width: 600px;
    font-size: 0.8125rem;
  }

  .data-table thead th {
    padding: 0.875rem 1rem;
    font-size: 0.6875rem;
  }

  .data-table tbody td {
    padding: 1rem;
  }

  .actions .action-button {
    width: 2.25rem;
    height: 2.25rem;
  }

  .form-overlay {
    padding: 1rem;
  }

  .form-overlay .form-card {
    max-height: 95vh;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.375rem;
  }

  .stats-container {
    margin-bottom: 1.5rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-icon {
    font-size: 2rem;
  }

  .stat-content h3 {
    font-size: 1.5rem;
  }

  .table-header {
    padding: 1rem;
  }

  .data-table thead th {
    padding: 0.75rem 0.875rem;
  }

  .data-table tbody td {
    padding: 0.875rem;
  }

  .actions {
    gap: 0.5rem;
  }

  .actions .action-button {
    width: 2rem;
    height: 2rem;
    font-size: 0.8125rem;
  }

  .form-overlay {
    padding: 0.5rem;
  }
}
</style>
