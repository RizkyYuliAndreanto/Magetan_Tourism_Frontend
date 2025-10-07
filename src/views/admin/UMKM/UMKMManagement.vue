<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h1 class="main-title">
          <i class="fas fa-store"></i>
          Data UMKM
        </h1>
        <p class="subtitle">
          Kelola data Usaha Mikro Kecil dan Menengah (UMKM) di Magetan untuk
          mendukung ekonomi lokal dan memberikan informasi produk unggulan
          kepada wisatawan.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formUMKMOpen"
          class="action-button add-button"
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
        <span class="table-count">{{ umkmList.length }} UMKM</span>
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

.table-container.card {
  padding: 0;
  border: 1px solid #e0e6ed;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
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
  color: #495057;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table th i {
  color: #007bff;
  margin-right: 0.5rem;
  font-size: 0.8rem;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e0e6ed;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.table-title i {
  color: #007bff;
}

.table-count {
  background-color: #007bff;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
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

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .table-count {
    align-self: flex-start;
  }

  .form-overlay {
    padding: 1rem;
  }

  .form-overlay .form-card {
    max-height: 95vh;
  }
}
</style>
