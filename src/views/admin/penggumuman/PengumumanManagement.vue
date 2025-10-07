<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h1 class="main-title">
          <i class="fas fa-bullhorn"></i>
          Data Pengumuman
        </h1>
        <p class="subtitle">
          Kelola pengumuman dan informasi penting untuk masyarakat dan wisatawan
          mengenai kebijakan, event, dan informasi terkini Magetan.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formPengumumanOpen"
          class="action-button add-button"
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

    <div v-else class="table-container card">
      <div class="table-responsive">
        <table class="table">
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
.form-card.card,
.table-container.card {
  padding: 0;
  border: 1px solid #e0e6ed;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.form-card.card {
  padding: 2rem;
}
.table-container.card {
  padding: 0;
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
  color: white;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}
.actions .delete-button:hover {
  background-color: #c82333;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
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
