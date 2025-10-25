<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-users"></i>
          Data Struktur Anggota
        </h2>
        <p class="subtitle">
          Kelola struktur anggota organisasi dinas pariwisata Magetan termasuk
          informasi jabatan, foto, dan urutan tampilan dalam struktur
          organisasi.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formAnggotaOpen"
          class="action-button create-button"
          @click="openAnggotaForm()">
          <i class="fas fa-plus-circle"></i> Tambah Anggota Baru
        </button>
      </div>
    </div>

    <!-- Statistics Dashboard -->
    <div v-if="!formAnggotaOpen" class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalAnggota }}</h3>
          <p>Total Anggota</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-user-tie"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalJabatan }}</h3>
          <p>Jabatan Berbeda</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-calendar-plus"></i>
        </div>
        <div class="stat-content">
          <h3>{{ bulanIniAnggota }}</h3>
          <p>Ditambah Bulan Ini</p>
        </div>
      </div>
    </div>

    <!-- Form Overlay -->
    <div v-if="formAnggotaOpen" class="form-overlay">
      <div class="form-card card">
        <StrukturAnggotaForm
          :is-editing="isEditingAnggota"
          :initial-data="formAnggota"
          @close-form="closeAnggotaForm"
          @save-anggota="handleSaveAnggota"
          @update-anggota="handleUpdateAnggota" />
      </div>
    </div>

    <div v-else>
      <div class="table-container card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th><i class="fas fa-hashtag"></i>ID</th>
                <th><i class="fas fa-user"></i>Nama Anggota</th>
                <th><i class="fas fa-user-tie"></i>Jabatan</th>
                <th><i class="fas fa-sort-numeric-up"></i>Urutan</th>
                <th><i class="fas fa-user-shield"></i>Admin Pengelola</th>
                <th><i class="fas fa-cogs"></i>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="anggotaList.length === 0">
                <td colspan="6">
                  <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>Belum Ada Anggota</h3>
                    <p>
                      Mulai tambahkan anggota struktur organisasi untuk
                      melengkapi profil dinas pariwisata Magetan.
                    </p>
                    <button
                      class="action-button add-button"
                      @click="openAnggotaForm()">
                      <i class="fas fa-plus-circle"></i> Tambah Anggota Pertama
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-for="anggota in anggotaList" :key="anggota.id_anggota">
                <td>{{ anggota.id_anggota }}</td>
                <td>{{ anggota.nama_anggota }}</td>
                <td>{{ anggota.jabatan }}</td>
                <td>{{ anggota.urutan_tampilan }}</td>
                <td>{{ anggota.adminPengelola.username }}</td>
                <td class="actions">
                  <button
                    class="action-button edit-button"
                    @click="openAnggotaForm(anggota)"
                    title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="action-button delete-button"
                    @click="showDeleteConfirm(anggota.id_anggota)"
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
import StrukturAnggotaForm from "./StrukturAnggotaForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const anggotaList = ref([]);
const formAnggotaOpen = ref(false);
const isEditingAnggota = ref(false);
const formAnggota = ref(null);

// State untuk pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Anggota");
const popUpMessage = ref("");
const anggotaToDeleteId = ref(null);

// Computed properties untuk statistics
const totalAnggota = computed(() => anggotaList.value.length);

const totalJabatan = computed(() => {
  const uniqueJabatan = new Set(
    anggotaList.value.map((anggota) => anggota.jabatan)
  );
  return uniqueJabatan.size;
});

const bulanIniAnggota = computed(() => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return anggotaList.value.filter((anggota) => {
    const createdDate = new Date(anggota.createdAt);
    return (
      createdDate.getMonth() === currentMonth &&
      createdDate.getFullYear() === currentYear
    );
  }).length;
});

// Fungsi yang memicu pop-up konfirmasi
const showDeleteConfirm = (id) => {
  anggotaToDeleteId.value = id;
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
      `http://localhost:5000/api/struktur-anggota/${anggotaToDeleteId.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    openPopUp("success", "delete");
    fetchAnggotaData();
  } catch (err) {
    console.error("Gagal menghapus anggota:", err.response?.data);
    openPopUp(
      "error",
      "delete",
      err.response?.data?.error || "Gagal menghapus anggota."
    );
  } finally {
    anggotaToDeleteId.value = null;
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

const fetchAnggotaData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/struktur-anggota"
    );
    anggotaList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data struktur anggota:", err);
    openPopUp("error", "fetch", "Gagal memuat data struktur anggota.");
  }
};

const openAnggotaForm = (anggota = null) => {
  isEditingAnggota.value = !!anggota;
  if (anggota) {
    formAnggota.value = { ...anggota };
  } else {
    formAnggota.value = {
      id_anggota: null,
      nama_anggota: "",
      jabatan: "",
      deskripsi_tugas: "",
      foto_anggota: null,
      urutan_tampilan: 0,
    };
  }
  formAnggotaOpen.value = true;
  // Mencegah scroll pada body saat form terbuka
  document.body.style.overflow = "hidden";
};

const closeAnggotaForm = () => {
  formAnggotaOpen.value = false;
  formAnggota.value = null;
  isEditingAnggota.value = false;
  // Mengembalikan scroll pada body saat form ditutup
  document.body.style.overflow = "auto";
  fetchAnggotaData();
};

const handleSaveAnggota = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.post("http://localhost:5000/api/struktur-anggota", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    openPopUp("success", "create");
    closeAnggotaForm();
  } catch (err) {
    console.error("Gagal menyimpan anggota:", err.response?.data);
    openPopUp(
      "error",
      "create",
      err.response?.data?.error || "Gagal menyimpan anggota."
    );
  }
};

const handleUpdateAnggota = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.put(
      `http://localhost:5000/api/struktur-anggota/${formData.get(
        "id_anggota"
      )}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    openPopUp("success", "update");
    closeAnggotaForm();
  } catch (err) {
    console.error("Gagal memperbarui anggota:", err.response?.data);
    openPopUp(
      "error",
      "update",
      err.response?.data?.error || "Gagal memperbarui anggota."
    );
  }
};

onMounted(() => {
  fetchAnggotaData();
});
</script>

<style scoped>
/* ========== Styling yang diselaraskan dengan Template Konsisten ========== */

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

/* Action Button */
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.create-button {
  background-color: #007bff;
}

.create-button:hover {
  background-color: #0069d9;
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.2);
}

.add-button {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

/* Table Styling */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead th {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  position: relative;
}

.table thead th i {
  margin-right: 0.5rem;
  color: #007bff;
}

.table tbody td {
  padding: 1rem;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
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

/* Action Buttons in Table */
.actions {
  display: flex;
  gap: 0.5rem;
}

.actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
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
