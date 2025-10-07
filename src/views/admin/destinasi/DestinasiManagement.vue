<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h1 class="main-title">
          <i class="fas fa-map-marked-alt"></i>
          Data Destinasi Wisata
        </h1>
        <p class="subtitle">
          Kelola data destinasi wisata Magetan termasuk informasi lokasi, galeri
          foto, dan kategori destinasi untuk memberikan pengalaman wisata yang
          optimal.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formDestinasiOpen"
          class="action-button add-button"
          @click="openDestinasiForm()">
          <i class="fas fa-plus-circle"></i> Tambah Destinasi Baru
        </button>
      </div>
    </div>

    <!-- Statistics Dashboard -->
    <div v-if="!formDestinasiOpen" class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-map-marked-alt"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalDestinasi }}</h3>
          <p>Total Destinasi</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-calendar-plus"></i>
        </div>
        <div class="stat-content">
          <h3>{{ bulanIniDestinasi }}</h3>
          <p>Ditambahkan Bulan Ini</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-tags"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalKategoriDestinasi }}</h3>
          <p>Kategori Tersedia</p>
        </div>
      </div>
    </div>

    <div v-if="formDestinasiOpen">
      <DestinasiForm
        :is-editing="isEditingDestinasi"
        :initial-data="formDestinasi"
        :kategori-list="kategoriDestinasiList"
        :gallery-list="editingDestinasiGallery"
        @close-form="closeDestinasiForm"
        @save-destinasi="handleSaveDestinasi"
        @update-destinasi="handleUpdateDestinasi" />
    </div>

    <div v-else class="table-container card">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th><i class="fas fa-hashtag"></i>ID</th>
              <th><i class="fas fa-map-marked-alt"></i>Nama Destinasi</th>
              <th><i class="fas fa-tags"></i>Kategori</th>
              <th><i class="fas fa-user-shield"></i>Admin</th>
              <th><i class="fas fa-cogs"></i>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="destinasiList.length === 0">
              <td colspan="5">
                <div class="empty-state">
                  <i class="fas fa-map-marked-alt"></i>
                  <h3>Belum Ada Destinasi</h3>
                  <p>
                    Mulai tambahkan destinasi wisata Magetan untuk memberikan
                    informasi yang lengkap kepada pengunjung.
                  </p>
                  <button
                    class="action-button add-button"
                    @click="openDestinasiForm()">
                    <i class="fas fa-plus-circle"></i> Tambah Destinasi Pertama
                  </button>
                </div>
              </td>
            </tr>
            <tr
              v-for="destinasi in destinasiList"
              :key="destinasi.id_destinasi">
              <td>{{ destinasi.id_destinasi }}</td>
              <td>{{ destinasi.nama_destinasi }}</td>
              <td>
                <span class="category-badge">{{
                  destinasi.kategoriDestinasi.nama_kategori
                }}</span>
              </td>
              <td>{{ destinasi.adminPembuat.username }}</td>
              <td class="actions">
                <button
                  class="action-button edit-button"
                  @click="openDestinasiForm(destinasi)"
                  title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="action-button delete-button"
                  @click="showDeleteConfirm(destinasi.id_destinasi)"
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
import DestinasiForm from "./DestinasiForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const destinasiList = ref([]);
const kategoriDestinasiList = ref([]);
const formDestinasiOpen = ref(false);
const isEditingDestinasi = ref(false);
const formDestinasi = ref(null);
const editingDestinasiGallery = ref([]);

// State untuk pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Destinasi");
const popUpMessage = ref("");
const destinasiToDeleteId = ref(null);

// Computed properties untuk statistics
const totalDestinasi = computed(() => destinasiList.value.length);

const bulanIniDestinasi = computed(() => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return destinasiList.value.filter((destinasi) => {
    const createdDate = new Date(destinasi.createdAt);
    return (
      createdDate.getMonth() === currentMonth &&
      createdDate.getFullYear() === currentYear
    );
  }).length;
});

const totalKategoriDestinasi = computed(
  () => kategoriDestinasiList.value.length
);

// Fungsi yang memicu pop-up konfirmasi
const showDeleteConfirm = (id) => {
  destinasiToDeleteId.value = id;
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
      `http://localhost:5000/api/destinasi/${destinasiToDeleteId.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    openPopUp("success", "delete");
    fetchDestinasiData();
  } catch (err) {
    console.error("Gagal menghapus destinasi:", err.response?.data);
    openPopUp(
      "error",
      "delete",
      err.response?.data?.error || "Gagal menghapus destinasi."
    );
  } finally {
    destinasiToDeleteId.value = null;
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

const fetchDestinasiData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/destinasi");
    destinasiList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data destinasi:", err);
    openPopUp("error", "fetch", "Gagal memuat data destinasi.");
  }
};

const fetchKategoriDestinasiData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/kategori-destinasi"
    );
    kategoriDestinasiList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data kategori destinasi:", err);
    openPopUp("error", "fetch", "Gagal memuat data kategori destinasi.");
  }
};

const openDestinasiForm = async (destinasi = null) => {
  isEditingDestinasi.value = !!destinasi;
  if (destinasi) {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/destinasi/${destinasi.id_destinasi}`
      );
      const fullDestinasiData = response.data;
      formDestinasi.value = {
        ...fullDestinasiData,
        id_kategori_destinasi:
          fullDestinasiData.kategoriDestinasi.id_kategori_destinasi,
      };
      editingDestinasiGallery.value = fullDestinasiData.galeriDestinasi;
    } catch (error) {
      console.error("Gagal memuat detail destinasi:", error);
      openPopUp(
        "error",
        "fetch",
        "Gagal memuat detail destinasi untuk diedit."
      );
      return;
    }
  } else {
    formDestinasi.value = {
      id_destinasi: null,
      nama_destinasi: "",
      deskripsi_destinasi: "",
      alamat: "",
      koordinat_lokasi: "",
      jam_operasional: "",
      harga_tiket: null,
      gambar_utama: null,
      id_kategori_destinasi: "",
    };
    editingDestinasiGallery.value = [];
  }
  formDestinasiOpen.value = true;
  // Mencegah scroll pada body saat form terbuka
  document.body.style.overflow = "hidden";
};

const closeDestinasiForm = () => {
  formDestinasiOpen.value = false;
  formDestinasi.value = null;
  editingDestinasiGallery.value = [];
  isEditingDestinasi.value = false;
  // Mengembalikan scroll pada body saat form ditutup
  document.body.style.overflow = "auto";
  fetchDestinasiData();
};

const handleSaveDestinasi = async (formData, galleryFiles) => {
  try {
    const token = localStorage.getItem("access_token");

    const destinasiResponse = await axios.post(
      "http://localhost:5000/api/destinasi",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const id_destinasi = destinasiResponse.data.destinasi.id_destinasi;

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append("id_konten", id_destinasi);
      galleryFormData.append("tipe_konten", "destinasi");
      galleryFiles.forEach((item) => {
        galleryFormData.append("media_galeri_files", item.file);
        galleryFormData.append("deskripsi_file", item.deskripsi);
        galleryFormData.append("jenis_file", item.jenis_file);
        galleryFormData.append("urutan_tampil", item.urutan);
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
    closeDestinasiForm();
  } catch (err) {
    console.error("Gagal menyimpan destinasi:", err.response?.data);
    openPopUp(
      "error",
      "create",
      err.response?.data?.error || "Gagal menyimpan destinasi."
    );
  }
};

const handleUpdateDestinasi = async (
  formData,
  galleryFiles,
  deletedGalleryIds
) => {
  try {
    const token = localStorage.getItem("access_token");
    const id = formData.get("id_destinasi");

    await axios.put(`http://localhost:5000/api/destinasi/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append("id_konten", id);
      galleryFormData.append("tipe_konten", "destinasi");
      galleryFiles.forEach((item) => {
        galleryFormData.append("media_galeri_files", item.file);
        galleryFormData.append("deskripsi_file", item.deskripsi);
        galleryFormData.append("jenis_file", item.jenis_file);
        galleryFormData.append("urutan_tampil", item.urutan);
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
    closeDestinasiForm();
  } catch (err) {
    console.error("Gagal memperbarui destinasi:", err.response?.data);
    openPopUp(
      "error",
      "update",
      err.response?.data?.error || "Gagal memperbarui destinasi."
    );
  }
};

onMounted(() => {
  fetchDestinasiData();
  fetchKategoriDestinasiData();
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
