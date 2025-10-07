<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h1 class="main-title">
          <i class="fas fa-theater-masks"></i>
          Data Budaya
        </h1>
        <p class="subtitle">
          Kelola informasi budaya dan warisan kultural Magetan untuk
          melestarikan dan mempromosikan kekayaan budaya daerah kepada
          wisatawan.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formBudayaOpen"
          class="action-button add-button"
          @click="openBudayaForm()">
          <i class="fas fa-plus-circle"></i> Tambah Budaya Baru
        </button>
      </div>
    </div>

    <!-- Statistics Dashboard -->
    <div v-if="!formBudayaOpen" class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-theater-masks"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalBudaya }}</h3>
          <p>Total Budaya</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-calendar-plus"></i>
        </div>
        <div class="stat-content">
          <h3>{{ bulanIniBudaya }}</h3>
          <p>Budaya Bulan Ini</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-eye"></i>
        </div>
        <div class="stat-content">
          <h3>{{ budayaAktif }}</h3>
          <p>Status Aktif</p>
        </div>
      </div>
    </div>

    <!-- Form Overlay -->
    <div v-if="formBudayaOpen" class="form-overlay">
      <div class="form-card card">
        <BudayaForm
          :is-editing="isEditingBudaya"
          :initial-data="formBudaya"
          :gallery-list="editingBudayaGallery"
          @close-form="closeBudayaForm"
          @save-budaya="handleSaveBudaya"
          @update-budaya="handleUpdateBudaya" />
      </div>
    </div>

    <div v-else class="table-container card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul Budaya</th>
              <th>Kategori</th>
              <th>Admin</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="budayaList.length === 0">
              <td colspan="5">
                <div class="empty-state">
                  <i class="fas fa-theater-masks"></i>
                  <h3>Belum Ada Data Budaya</h3>
                  <p>
                    Mulai tambahkan informasi budaya dan warisan kultural
                    Magetan untuk melestarikan dan mempromosikan kekayaan budaya
                    daerah.
                  </p>
                  <button
                    class="action-button add-button"
                    @click="openBudayaForm()">
                    <i class="fas fa-plus-circle"></i> Tambah Budaya Pertama
                  </button>
                </div>
              </td>
            </tr>
            <tr v-for="budaya in budayaList" :key="budaya.id_budaya">
              <td>{{ budaya.id_budaya }}</td>
              <td>{{ budaya.judul_budaya }}</td>
              <td>
                <span class="category-badge">{{
                  budaya.kategori_budaya || "Tidak ada kategori"
                }}</span>
              </td>
              <td>{{ budaya.adminPengelola.username }}</td>
              <td class="actions">
                <button
                  class="action-button edit-button"
                  @click="openBudayaForm(budaya)"
                  title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="action-button delete-button"
                  @click="showDeleteConfirm(budaya.id_budaya)"
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
import BudayaForm from "./BudayaForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const budayaList = ref([]);
const formBudayaOpen = ref(false);
const isEditingBudaya = ref(false);
const formBudaya = ref(null);
const editingBudayaGallery = ref([]);

// State untuk pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Budaya");
const popUpMessage = ref("");
const budayaToDeleteId = ref(null);

// Computed properties untuk statistics
const totalBudaya = computed(() => budayaList.value.length);

const bulanIniBudaya = computed(() => {
  const bulanIni = new Date();
  bulanIni.setDate(1);
  bulanIni.setHours(0, 0, 0, 0);

  return budayaList.value.filter((budaya) => {
    const tanggalDibuat = new Date(budaya.created_at);
    return tanggalDibuat >= bulanIni;
  }).length;
});

const budayaAktif = computed(() => {
  return budayaList.value.filter(
    (budaya) => budaya.status === "aktif" || !budaya.status
  ).length;
});

// Fungsi yang memicu pop-up konfirmasi
const showDeleteConfirm = (id) => {
  budayaToDeleteId.value = id;
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
      `http://localhost:5000/api/budaya/${budayaToDeleteId.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    openPopUp("success", "delete");
    fetchBudayaData();
  } catch (err) {
    console.error("Gagal menghapus budaya:", err.response?.data);
    openPopUp(
      "error",
      "delete",
      err.response?.data?.error || "Gagal menghapus budaya."
    );
  } finally {
    budayaToDeleteId.value = null;
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

const fetchBudayaData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/budaya");
    budayaList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data budaya:", err);
    openPopUp("error", "fetch", "Gagal memuat data budaya.");
  }
};

const openBudayaForm = async (budaya = null) => {
  isEditingBudaya.value = !!budaya;
  if (budaya) {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/budaya/${budaya.id_budaya}`
      );
      const fullBudayaData = response.data;
      formBudaya.value = { ...fullBudayaData };
      editingBudayaGallery.value = fullBudayaData.galeriBudaya;
    } catch (error) {
      console.error("Gagal memuat detail budaya:", error);
      openPopUp("error", "fetch", "Gagal memuat detail budaya untuk diedit.");
      return;
    }
  } else {
    formBudaya.value = {
      id_budaya: null,
      judul_budaya: "",
      deskripsi_budaya: "",
      gambar_budaya: null,
      kategori_budaya: "",
    };
    editingBudayaGallery.value = [];
  }
  formBudayaOpen.value = true;

  // Prevent body scroll
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
};

const closeBudayaForm = () => {
  formBudayaOpen.value = false;
  formBudaya.value = null;
  editingBudayaGallery.value = [];
  isEditingBudaya.value = false;

  // Restore body scroll
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";

  fetchBudayaData();
};

const handleSaveBudaya = async (formData, galleryFiles) => {
  try {
    const token = localStorage.getItem("access_token");

    const budayaResponse = await axios.post(
      "http://localhost:5000/api/budaya",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const id_budaya = budayaResponse.data.budaya.id_budaya;

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append("id_konten", id_budaya);
      galleryFormData.append("tipe_konten", "budaya");
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
    closeBudayaForm();
  } catch (err) {
    console.error("Gagal menyimpan budaya:", err.response?.data);
    openPopUp(
      "error",
      "create",
      err.response?.data?.error || "Gagal menyimpan budaya."
    );
  }
};

const handleUpdateBudaya = async (
  formData,
  galleryFiles,
  deletedGalleryIds
) => {
  try {
    const token = localStorage.getItem("access_token");
    const id = formData.get("id_budaya");

    await axios.put(`http://localhost:5000/api/budaya/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append("id_konten", id);
      galleryFormData.append("tipe_konten", "budaya");
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
    closeBudayaForm();
  } catch (err) {
    console.error("Gagal memperbarui budaya:", err.response?.data);
    openPopUp(
      "error",
      "update",
      err.response?.data?.error || "Gagal memperbarui budaya."
    );
  }
};

onMounted(() => {
  fetchBudayaData();
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
