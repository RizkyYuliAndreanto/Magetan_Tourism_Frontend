<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-theater-masks"></i>
          Data Budaya
        </h2>
        <p class="subtitle">
          Kelola informasi budaya dan warisan kultural Magetan untuk
          melestarikan dan mempromosikan kekayaan budaya daerah kepada
          wisatawan.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formBudayaOpen"
          class="action-button create-button"
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
      <div class="table-header">
        <h3 class="table-title">
          <i class="fas fa-list"></i>
          Daftar Budaya
        </h3>
      </div>
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
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
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1);
}

.create-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.add-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
  border: 1px solid #059669;
}

.add-button:hover {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2), 0 4px 6px -2px rgba(16, 185, 129, 0.1);
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

/* Table Header Section */
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

/* Table Responsive Wrapper */
.table-responsive {
  overflow-x: auto;
  padding: 1.5rem;
  background: white;
  -webkit-overflow-scrolling: touch;
}

.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table th,
.data-table td {
  padding: 0.875rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  position: sticky;
  top: 0;
  z-index: 1;
}

.data-table th i {
  color: #3b82f6;
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.data-table td {
  color: #1f2937;
  background-color: #ffffff;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  transform: translateY(-1px);
  transition: all 0.2s ease-in-out;
}

/* Table Actions */
.actions {
  display: flex;
  gap: 0.375rem;
}

.actions .action-button {
  padding: 0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 0.875rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.actions .edit-button {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.actions .edit-button:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.actions .delete-button {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.actions .delete-button:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(16, 185, 129, 0.2);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 2rem;
}

.empty-state i {
  font-size: 4rem;
  color: #3b82f6;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #1f2937;
  margin: 0;
  font-weight: 600;
}

.empty-state p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  text-align: center;
  max-width: 400px;
  line-height: 1.6;
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
    margin: 1rem;
    border-radius: 12px;
  }

  .table-responsive {
    padding: 1rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .actions {
    flex-direction: row;
    gap: 0.25rem;
  }

  .actions .action-button {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.75rem;
  }
}

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
.form-card.card {
  padding: 2rem;
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
</style>
