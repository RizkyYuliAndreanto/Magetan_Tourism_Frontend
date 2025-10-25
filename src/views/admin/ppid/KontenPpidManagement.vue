<template>
  <!-- Header dengan Penjelasan -->
  <div class="header-section">
    <div class="header-info">
      <h2 class="main-title">
        <i class="fas fa-file-alt"></i>
        Data Konten PPID
      </h2>
      <p class="subtitle">
        Kelola dokumen dan informasi PPID berdasarkan kategori yang telah
        ditentukan. Setiap konten akan ditampilkan sesuai dengan kategori yang
        dipilih.
      </p>
    </div>
    <div class="action-bar">
      <button
        v-if="!formKontenOpen"
        class="action-button create-button"
        @click="openKontenForm()">
        <i class="fas fa-plus-circle"></i> Tambah Konten Baru
      </button>
    </div>
  </div>

  <div v-if="formKontenOpen" class="form-overlay">
    <div class="form-card card">
      <KontenPpidForm
        :is-editing="isEditingKonten"
        :initial-data="formKonten"
        :kategori-list="kategoriList"
        @close-form="closeKontenForm"
        @save-konten="handleSaveKonten"
        @update-konten="handleUpdateKonten" />
    </div>
  </div>

  <div v-else>
    <!-- Statistik -->
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-file-alt"></i>
        </div>
        <div class="stat-content">
          <h3>{{ kontenList.length }}</h3>
          <p>Total Konten</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-tags"></i>
        </div>
        <div class="stat-content">
          <h3>{{ kategoriList.length }}</h3>
          <p>Kategori Tersedia</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <div class="stat-content">
          <h3>{{ kontenBulanIni }}</h3>
          <p>Konten Bulan Ini</p>
        </div>
      </div>
    </div>

    <div class="table-container card">
      <div class="table-header">
        <h3 class="table-title">
          <i class="fas fa-list"></i>
          Daftar Konten PPID
        </h3>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th><i class="fas fa-hashtag"></i> ID</th>
              <th><i class="fas fa-file-text"></i> Judul Konten</th>
              <th><i class="fas fa-tag"></i> Kategori</th>
              <th><i class="fas fa-user"></i> Admin Pengelola</th>
              <th><i class="fas fa-calendar"></i> Tanggal Publikasi</th>
              <th><i class="fas fa-cogs"></i> Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="kontenList.length === 0">
              <td colspan="6" class="no-data-found">
                Tidak ada data konten yang tersedia.
              </td>
            </tr>
            <tr v-for="konten in kontenList" :key="konten.id_konten_ppid">
              <td>{{ konten.id_konten_ppid }}</td>
              <td>{{ konten.judul_konten }}</td>
              <td>
                <div class="category-display" v-if="konten.kategoriPPID">
                  <span
                    class="category-badge"
                    :class="
                      konten.kategoriPPID.id_kategori_induk
                        ? 'sub-category'
                        : 'main-category'
                    ">
                    <i
                      :class="
                        konten.kategoriPPID.id_kategori_induk
                          ? 'fas fa-folder-open'
                          : 'fas fa-folder'
                      "></i>
                    {{ konten.kategoriPPID.nama_kategori }}
                  </span>
                  <small
                    v-if="konten.kategoriPPID.id_kategori_induk"
                    class="parent-category">
                    Sub dari:
                    {{
                      getParentCategoryName(
                        konten.kategoriPPID.id_kategori_induk
                      )
                    }}
                  </small>
                </div>
                <span v-else class="category-badge inactive">N/A</span>
              </td>
              <td>
                {{
                  konten.adminPengelola ? konten.adminPengelola.username : "N/A"
                }}
              </td>
              <td>{{ formatDate(konten.tanggal_publikasi) }}</td>
              <td class="actions">
                <button
                  class="action-button edit-button"
                  @click="openKontenForm(konten)"
                  title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="action-button delete-button"
                  @click="showDeleteConfirm(konten.id_konten_ppid)"
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
import KontenPpidForm from "./KontenPpidForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const kontenList = ref([]);
const kategoriList = ref([]);
const formKontenOpen = ref(false);
const isEditingKonten = ref(false);
const formKonten = ref(null);

const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Konten PPID");
const popUpMessage = ref("");
const kontenToDeleteId = ref(null);

const getToken = () => localStorage.getItem("access_token");

// Computed property untuk statistik
const kontenBulanIni = computed(() => {
  const bulanIni = new Date();
  bulanIni.setDate(1);
  bulanIni.setHours(0, 0, 0, 0);

  return kontenList.value.filter((konten) => {
    const tanggalPublikasi = new Date(konten.tanggal_publikasi);
    return tanggalPublikasi >= bulanIni;
  }).length;
});

const fetchKontenData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/konten-ppid");
    kontenList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data konten PPID:", err);
    openPopUp(
      "error",
      "fetch",
      err.response?.data?.error || "Gagal memuat data konten PPID."
    );
  }
};

const fetchKategoriData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/kategori-ppid");
    kategoriList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data kategori PPID:", err);
    openPopUp(
      "error",
      "fetch",
      err.response?.data?.error || "Gagal memuat data kategori PPID."
    );
  }
};

const openKontenForm = (konten = null) => {
  isEditingKonten.value = !!konten;
  if (konten) {
    // Memuat data awal untuk form edit
    formKonten.value = {
      ...konten,
      id_kategori_ppid: konten.kategoriPPID?.id_kategori_ppid,
      file_pdf_ppid: null, // Reset file input
      gambar_sampul_ppid: null, // Reset file input
    };
  } else {
    // Data awal untuk form tambah baru
    formKonten.value = {
      id_konten_ppid: null,
      judul_konten: "",
      deskripsi_konten: "",
      id_kategori_ppid: "",
      gambar_sampul: null,
      file_pdf_path: null,
    };
  }
  formKontenOpen.value = true;

  // Prevent body scroll
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
};

const closeKontenForm = () => {
  formKontenOpen.value = false;
  formKonten.value = null;
  isEditingKonten.value = false;

  // Restore body scroll
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";

  fetchKontenData();
  fetchKategoriData();
};

const handleSaveKonten = async (formData) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.post("http://localhost:5000/api/konten-ppid", formData, config);
    openPopUp("success", "create");
    closeKontenForm();
  } catch (err) {
    const errorMessage =
      err.response?.data?.error || "Gagal menyimpan konten PPID.";
    console.error("Gagal menyimpan konten PPID:", errorMessage);
    openPopUp("error", "create", errorMessage);
  }
};

const handleUpdateKonten = async (formData) => {
  try {
    const token = getToken();
    const id = formData.get("id_konten_ppid");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.put(
      `http://localhost:5000/api/konten-ppid/${id}`,
      formData,
      config
    );
    openPopUp("success", "update");
    closeKontenForm();
  } catch (err) {
    const errorMessage =
      err.response?.data?.error || "Gagal memperbarui konten PPID.";
    console.error("Gagal memperbarui konten PPID:", errorMessage);
    openPopUp("error", "update", errorMessage);
  }
};

const showDeleteConfirm = (id) => {
  kontenToDeleteId.value = id;
  popUpStatus.value = "confirm";
  popUpAction.value = "confirmDelete";
  showPopUp.value = true;
};

const handleDeleteConfirmed = async () => {
  closePopUp();
  await nextTick(); // Menunggu DOM diperbarui

  try {
    const token = getToken();
    await axios.delete(
      `http://localhost:5000/api/konten-ppid/${kontenToDeleteId.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    openPopUp("success", "delete");
    fetchKontenData();
  } catch (err) {
    const errorMessage =
      err.response?.data?.error || "Gagal menghapus konten PPID.";
    console.error("Gagal menghapus konten PPID:", errorMessage);
    openPopUp("error", "delete", errorMessage);
  } finally {
    kontenToDeleteId.value = null;
  }
};

const openPopUp = (status, action, message = "") => {
  popUpStatus.value = status;
  popUpAction.value = action;
  popUpMessage.value = message;
  showPopUp.value = true;
};

const closePopUp = () => {
  showPopUp.value = false;
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

const getParentCategoryName = (parentId) => {
  const parent = kategoriList.value.find(
    (k) => k.id_kategori_ppid === parentId
  );
  return parent ? parent.nama_kategori : "Tidak ditemukan";
};

onMounted(() => {
  fetchKontenData();
  fetchKategoriData();
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
.form-card.card {
  padding: 2rem;
}
.table-container.card {
  padding: 0;
  border: 1px solid #e0e6ed;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

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
  gap: 0.5rem;
}

.table-title i {
  color: #007bff;
}

.table-count {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
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
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th i {
  color: #007bff;
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.data-table tbody tr {
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.data-table tbody tr:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-left: 3px solid #667eea;
  transform: translateX(2px);
}

.data-table td {
  color: #495057;
  font-size: 0.9rem;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.no-data-found {
  text-align: center;
  font-style: italic;
  color: #6c757d;
  padding: 3rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
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
.category-display {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.category-badge.main-category {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

.category-badge.sub-category {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
}

.category-badge.inactive {
  background-color: #6c757d;
  color: white;
}

.category-badge i {
  font-size: 0.75rem;
}

.parent-category {
  font-size: 0.7rem;
  color: #6c757d;
  font-style: italic;
  margin-left: 0.5rem;
}
.mt-4 {
  margin-top: 1.5rem;
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

/* Responsive Design */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 1rem;
  }

  .action-bar {
    width: 100%;
    justify-content: center;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .table-count {
    align-self: flex-start;
  }

  .category-display {
    align-items: flex-start;
  }

  .actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-overlay {
    padding: 1rem;
  }

  .form-overlay .form-card {
    max-width: 100%;
  }
}

@media (max-width: 576px) {
  .main-title {
    font-size: 1.5rem;
  }

  .stats-container {
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-content h3 {
    font-size: 1.5rem;
  }

  .category-badge {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>
