<template>
  <div>
    <!-- Header dengan Penjelasan -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-bed"></i>
          Data Akomodasi
        </h2>
        <p class="subtitle">
          Kelola data penginapan dan akomodasi yang tersedia. Membantu wisatawan
          menemukan tempat menginap yang sesuai dengan kebutuhan mereka.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formAkomodasiOpen"
          class="action-button create-button"
          @click="openAkomodasiForm()">
          <i class="fas fa-plus-circle"></i> Tambah Akomodasi Baru
        </button>
      </div>
    </div>

    <!-- Form Overlay -->
    <div v-if="formAkomodasiOpen" class="form-overlay">
      <div class="form-card card">
        <AkomodasiForm
          :is-editing="isEditingAkomodasi"
          :initial-data="formAkomodasi"
          :gallery-list="editingAkomodasiGallery"
          @close-form="closeAkomodasiForm"
          @save-akomodasi="handleSaveAkomodasi"
          @update-akomodasi="handleUpdateAkomodasi" />
      </div>
    </div>

    <div v-else>
      <!-- Statistik -->
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-bed"></i>
          </div>
          <div class="stat-content">
            <h3>{{ akomodasiList.length }}</h3>
            <p>Total Akomodasi</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="stat-content">
            <h3>{{ averageRating }}</h3>
            <p>Rating Rata-rata</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="stat-content">
            <h3>{{ akomodasiBulanIni }}</h3>
            <p>Akomodasi Bulan Ini</p>
          </div>
        </div>
      </div>

      <!-- Tabel Akomodasi -->
      <div class="table-container card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th><i class="fas fa-hashtag"></i> ID</th>
                <th><i class="fas fa-bed"></i> Nama Akomodasi</th>
                <th><i class="fas fa-map-marker-alt"></i> Alamat</th>
                <th><i class="fas fa-user-shield"></i> Admin Pengelola</th>
                <th><i class="fas fa-cogs"></i> Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="akomodasiList.length === 0">
                <td colspan="5">
                  <div class="empty-state">
                    <i class="fas fa-bed"></i>
                    <h3>Belum Ada Akomodasi</h3>
                    <p>
                      Mulai tambahkan data penginapan dan akomodasi untuk
                      membantu wisatawan menemukan tempat menginap di Magetan.
                    </p>
                    <button
                      class="action-button add-button"
                      @click="openAkomodasiForm()">
                      <i class="fas fa-plus-circle"></i> Tambah Akomodasi
                      Pertama
                    </button>
                  </div>
                </td>
              </tr>
              <tr
                v-for="akomodasi in akomodasiList"
                :key="akomodasi.id_akomodasi">
                <td>{{ akomodasi.id_akomodasi }}</td>
                <td>{{ akomodasi.nama_akomodasi }}</td>
                <td>{{ akomodasi.alamat }}</td>
                <td>{{ akomodasi.adminPengelola.username }}</td>
                <td class="actions">
                  <button
                    class="action-button edit-button"
                    @click="openAkomodasiForm(akomodasi)"
                    title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="action-button delete-button"
                    @click="showDeleteConfirm(akomodasi.id_akomodasi)"
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
import AkomodasiForm from "./AkomodasiForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const akomodasiList = ref([]);
const formAkomodasiOpen = ref(false);
const isEditingAkomodasi = ref(false);
const formAkomodasi = ref(null);
const editingAkomodasiGallery = ref([]);

// State untuk pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Akomodasi");
const popUpMessage = ref("");
const akomodasiToDeleteId = ref(null);

// Computed properties untuk statistik
const akomodasiBulanIni = computed(() => {
  const bulanIni = new Date();
  bulanIni.setDate(1);
  bulanIni.setHours(0, 0, 0, 0);

  return akomodasiList.value.filter((akomodasi) => {
    const tanggalDibuat = new Date(akomodasi.created_at);
    return tanggalDibuat >= bulanIni;
  }).length;
});

const averageRating = computed(() => {
  if (akomodasiList.value.length === 0) return "0.0";
  const totalRating = akomodasiList.value.reduce(
    (sum, akomodasi) => sum + (akomodasi.rating || 4.5),
    0
  );
  return (totalRating / akomodasiList.value.length).toFixed(1);
});

// Fungsi yang memicu pop-up konfirmasi
const showDeleteConfirm = (id) => {
  akomodasiToDeleteId.value = id;
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
      `http://localhost:5000/api/akomodasi/${akomodasiToDeleteId.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    openPopUp("success", "delete");
    fetchAkomodasiData();
  } catch (err) {
    console.error("Gagal menghapus akomodasi:", err.response?.data);
    openPopUp(
      "error",
      "delete",
      err.response?.data?.error || "Gagal menghapus akomodasi."
    );
  } finally {
    akomodasiToDeleteId.value = null;
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

const fetchAkomodasiData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/akomodasi");
    akomodasiList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data akomodasi:", err);
    openPopUp("error", "fetch", "Gagal memuat data akomodasi.");
  }
};

const openAkomodasiForm = async (akomodasi = null) => {
  isEditingAkomodasi.value = !!akomodasi;
  if (akomodasi) {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/akomodasi/${akomodasi.id_akomodasi}`
      );
      const fullAkomodasiData = response.data;
      formAkomodasi.value = {
        ...fullAkomodasiData,
        gambar_akomodasi: null, // reset file input
      };
      editingAkomodasiGallery.value = fullAkomodasiData.galeriAkomodasi;
    } catch (error) {
      console.error("Gagal memuat detail akomodasi:", error);
      openPopUp(
        "error",
        "fetch",
        "Gagal memuat detail akomodasi untuk diedit."
      );
      return;
    }
  } else {
    formAkomodasi.value = {
      id_akomodasi: null,
      nama_akomodasi: "",
      deskripsi_akomodasi: "",
      alamat: "",
      kontak: "",
      link_website: "",
      harga_akomodasi: null,
      gambar_akomodasi: null,
      koordinat_lokasi: "",
    };
    editingAkomodasiGallery.value = [];
  }
  formAkomodasiOpen.value = true;

  // Prevent body scroll
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
};

const closeAkomodasiForm = () => {
  formAkomodasiOpen.value = false;
  formAkomodasi.value = null;
  editingAkomodasiGallery.value = [];
  isEditingAkomodasi.value = false;

  // Restore body scroll
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";

  fetchAkomodasiData();
};

const handleSaveAkomodasi = async (formData, galleryFiles) => {
  try {
    const token = localStorage.getItem("access_token");

    const akomodasiResponse = await axios.post(
      "http://localhost:5000/api/akomodasi",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const id_akomodasi = akomodasiResponse.data.akomodasi.id_akomodasi;

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append("id_konten", id_akomodasi);
      galleryFormData.append("tipe_konten", "akomodasi");

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
    closeAkomodasiForm();
  } catch (err) {
    console.error("Gagal menyimpan akomodasi:", err.response?.data);
    openPopUp(
      "error",
      "create",
      err.response?.data?.error ||
        "Gagal menyimpan akomodasi. Periksa kembali input Anda."
    );
  }
};

const handleUpdateAkomodasi = async (
  formData,
  galleryFiles,
  deletedGalleryIds
) => {
  try {
    const token = localStorage.getItem("access_token");
    const id = formData.get("id_akomodasi");

    await axios.put(`http://localhost:5000/api/akomodasi/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append("id_konten", id);
      galleryFormData.append("tipe_konten", "akomodasi");
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
    closeAkomodasiForm();
  } catch (err) {
    console.error("Gagal memperbarui akomodasi:", err.response?.data);
    openPopUp(
      "error",
      "update",
      err.response?.data?.error || "Gagal memperbarui akomodasi."
    );
  }
};

onMounted(() => {
  fetchAkomodasiData();
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
  color: white;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}
.actions .delete-button:hover {
  background-color: #c82333;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
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
}

/* Header Section yang hilang */
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
  color: #495057;
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

  .actions {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
