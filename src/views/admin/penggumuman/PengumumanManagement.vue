<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-bullhorn"></i>
          Data Pengumuman
        </h2>
        <p class="subtitle">
          Kelola pengumuman dan informasi penting untuk masyarakat dan wisatawan
          mengenai kebijakan, event, dan informasi terkini Magetan.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formPengumumanOpen"
          class="action-button create-button"
          @click="openPengumumanForm()">
          <i class="fas fa-plus-circle"></i> Tambah Pengumuman Baru
        </button>
      </div>
    </div>

    <!-- Statistics Dashboard -->
    <div v-if="!formPengumumanOpen" class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-bullhorn"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalPengumuman }}</h3>
          <p>Total Pengumuman</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-calendar-plus"></i>
        </div>
        <div class="stat-content">
          <h3>{{ bulanIniPengumuman }}</h3>
          <p>Pengumuman Bulan Ini</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <h3>{{ pengumumanTerbaru }}</h3>
          <p>Dalam 7 Hari Terakhir</p>
        </div>
      </div>
    </div>

    <div v-if="formPengumumanOpen" class="form-card card">
      <PengumumanForm
        :is-editing="isEditingPengumuman"
        :initial-data="formPengumuman"
        @close-form="closePengumumanForm"
        @save-pengumuman="handleSavePengumuman"
        @update-pengumuman="handleUpdatePengumuman" />
    </div>

    <div v-else class="table-wrapper">
      <div class="table-header">
        <h3 class="table-title">
          <i class="fas fa-list"></i>
          Daftar Pengumuman
        </h3>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th><i class="fas fa-hashtag"></i>ID</th>
              <th><i class="fas fa-bullhorn"></i>Judul</th>
              <th><i class="fas fa-user-shield"></i>Admin Pengelola</th>
              <th><i class="fas fa-calendar"></i>Tanggal Publikasi</th>
              <th><i class="fas fa-cogs"></i>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pengumumanList.length === 0">
              <td colspan="5">
                <div class="empty-state">
                  <i class="fas fa-bullhorn"></i>
                  <h3>Belum Ada Pengumuman</h3>
                  <p>
                    Mulai buat pengumuman penting untuk masyarakat dan wisatawan
                    Magetan.
                  </p>
                  <button
                    class="action-button add-button"
                    @click="openPengumumanForm()">
                    <i class="fas fa-plus-circle"></i> Buat Pengumuman Pertama
                  </button>
                </div>
              </td>
            </tr>
            <tr
              v-for="pengumuman in pengumumanList"
              :key="pengumuman.id_pengumuman">
              <td>{{ pengumuman.id_pengumuman }}</td>
              <td>{{ pengumuman.judul_pengumuman }}</td>
              <td>{{ pengumuman.adminPengelola.username }}</td>
              <td>{{ formatDate(pengumuman.tanggal_publikasi) }}</td>
              <td class="actions">
                <button
                  class="action-button edit-button"
                  @click="openPengumumanForm(pengumuman)"
                  title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="action-button delete-button"
                  @click="showDeleteConfirm(pengumuman.id_pengumuman)"
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
import PengumumanForm from "./PengumumanForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const pengumumanList = ref([]);
const formPengumumanOpen = ref(false);
const isEditingPengumuman = ref(false);
const formPengumuman = ref(null);

// State untuk pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Pengumuman");
const popUpMessage = ref("");
const pengumumanToDeleteId = ref(null);

// Computed properties untuk statistics
const totalPengumuman = computed(() => pengumumanList.value.length);

const bulanIniPengumuman = computed(() => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return pengumumanList.value.filter((pengumuman) => {
    const createdDate = new Date(pengumuman.createdAt);
    return (
      createdDate.getMonth() === currentMonth &&
      createdDate.getFullYear() === currentYear
    );
  }).length;
});

const pengumumanTerbaru = computed(() => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return pengumumanList.value.filter((pengumuman) => {
    const createdDate = new Date(pengumuman.createdAt);
    return createdDate >= sevenDaysAgo;
  }).length;
});

// Fungsi yang memicu pop-up konfirmasi
const showDeleteConfirm = (id) => {
  pengumumanToDeleteId.value = id;
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
      `http://localhost:5000/api/pengumuman/${pengumumanToDeleteId.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    openPopUp("success", "delete");
    fetchPengumumanData();
  } catch (err) {
    console.error("Gagal menghapus pengumuman:", err.response?.data);
    openPopUp(
      "error",
      "delete",
      err.response?.data?.error || "Gagal menghapus pengumuman."
    );
  } finally {
    pengumumanToDeleteId.value = null;
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

const fetchPengumumanData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/pengumuman");
    pengumumanList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data pengumuman:", err);
    openPopUp("error", "fetch", "Gagal memuat data pengumuman.");
  }
};

const openPengumumanForm = (pengumuman = null) => {
  isEditingPengumuman.value = !!pengumuman;
  if (pengumuman) {
    formPengumuman.value = {
      ...pengumuman,
      file_pdf_pengumuman: null, // Ensure file input is reset
      sampul_pengumuman: null, // Ensure file input is reset
    };
  } else {
    formPengumuman.value = {
      id_pengumuman: null,
      judul_pengumuman: "",
      isi_pengumuman: "",
      file_pdf_pengumuman: null,
      sampul_pengumuman: null,
    };
  }
  formPengumumanOpen.value = true;
  // Mencegah scroll pada body saat form terbuka
  document.body.style.overflow = "hidden";
};

const closePengumumanForm = () => {
  formPengumumanOpen.value = false;
  formPengumuman.value = null;
  isEditingPengumuman.value = false;
  // Mengembalikan scroll pada body saat form ditutup
  document.body.style.overflow = "auto";
  fetchPengumumanData();
};

const handleSavePengumuman = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.post("http://localhost:5000/api/pengumuman", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    openPopUp("success", "create");
    closePengumumanForm();
  } catch (err) {
    console.error("Gagal menyimpan pengumuman:", err.response?.data);
    openPopUp(
      "error",
      "create",
      err.response?.data?.error || "Gagal menyimpan pengumuman."
    );
  }
};

const handleUpdatePengumuman = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.put(
      `http://localhost:5000/api/pengumuman/${formData.get("id_pengumuman")}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    openPopUp("success", "update");
    closePengumumanForm();
  } catch (err) {
    console.error("Gagal memperbarui pengumuman:", err.response?.data);
    openPopUp(
      "error",
      "update",
      err.response?.data?.error || "Gagal memperbarui pengumuman."
    );
  }
};

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

onMounted(() => {
  fetchPengumumanData();
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

.add-button {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
}

.add-button:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

/* Form Card */
.form-card.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.form-card.card::before {
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
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
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
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
}

.data-table th {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-weight: 600;
  color: #374151;
  text-align: left;
  padding: 1.25rem 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
  white-space: nowrap;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
}

.data-table th i {
  margin-right: 0.5rem;
  color: #667eea;
}

.data-table td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  vertical-align: middle;
  transition: all 0.2s ease;
}

.data-table tr {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.data-table tbody tr:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  transform: scale(1.005);
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

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: #d1d5db;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #6b7280;
}

.empty-state p {
  margin-bottom: 1.5rem;
  opacity: 0.8;
  line-height: 1.6;
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

  .data-table th,
  .data-table td {
    padding: 1rem 0.75rem;
  }

  .actions .action-button {
    width: 2.25rem;
    height: 2.25rem;
    padding: 0.5rem;
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

  .empty-state {
    padding: 3rem 1rem;
  }
}
</style>
