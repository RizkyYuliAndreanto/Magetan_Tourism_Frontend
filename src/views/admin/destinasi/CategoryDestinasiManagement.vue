<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-tags"></i>
          Data Kategori Destinasi
        </h2>
        <p class="subtitle">
          Kelola kategori destinasi wisata untuk mengorganisir tempat wisata
          berdasarkan jenis atau tema tertentu.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formKategoriOpen"
          class="action-button create-button"
          @click="openKategoriForm()">
          <i class="fas fa-plus-circle"></i> Tambah Kategori Baru
        </button>
      </div>
    </div>

    <!-- Modal Category Form -->
    <CategoryDestinasiForm
      v-if="formKategoriOpen"
      :is-editing="isEditingKategori"
      :initial-data="formKategori"
      @close-form="closeKategoriForm"
      @save-kategori="handleSaveKategori" />

    <div v-else>
      <!-- Stats Section -->
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-tags"></i>
          </div>
          <div class="stat-content">
            <h3>{{ kategoriList.length }}</h3>
            <p>Total Kategori</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-map-marked-alt"></i>
          </div>
          <div class="stat-content">
            <h3>{{ kategoriAktif }}</h3>
            <p>Kategori Aktif</p>
          </div>
        </div>
      </div>

      <!-- Tabel Kategori -->
      <div class="table-wrapper">
        <div class="table-header">
          <h3 class="table-title">
            <i class="fas fa-list"></i>
            Daftar Kategori Destinasi
          </h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th><i class="fas fa-hashtag"></i> ID</th>
                <th><i class="fas fa-tags"></i> Nama Kategori</th>
                <th><i class="fas fa-align-left"></i> Deskripsi</th>
                <th><i class="fas fa-image"></i> Sampul</th>
                <th><i class="fas fa-cogs"></i> Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="kategoriList.length === 0">
                <td colspan="5" class="no-data-found">
                  <div class="empty-state">
                    <i class="fas fa-tags"></i>
                    <p>Belum ada kategori destinasi yang tersedia.</p>
                    <small
                      >Klik tombol "Tambah Kategori Baru" untuk membuat kategori
                      pertama.</small
                    >
                  </div>
                </td>
              </tr>
              <tr
                v-for="kategori in kategoriList"
                :key="kategori.id_kategori_destinasi">
                <td>{{ kategori.id_kategori_destinasi }}</td>
                <td>{{ kategori.nama_kategori }}</td>
                <td>{{ kategori.deskripsi_kategori || "-" }}</td>
                <td>
                  <img
                    v-if="kategori.sampul_kategori"
                    :src="`http://localhost:5000${kategori.sampul_kategori}`"
                    alt="Sampul Kategori"
                    class="table-image" />
                  <span v-else>-</span>
                </td>
                <td class="actions">
                  <button
                    class="action-button edit-button"
                    @click="openKategoriForm(kategori)"
                    title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="action-button delete-button"
                    @click="showDeleteConfirm(kategori.id_kategori_destinasi)"
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
import CategoryDestinasiForm from "./CategoryDestinasiForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const kategoriList = ref([]);
const formKategoriOpen = ref(false);
const isEditingKategori = ref(false);
const formKategori = ref(null);

// Computed property untuk statistik
const kategoriAktif = computed(() => {
  return kategoriList.value.filter(
    (kategori) =>
      kategori.sampul_kategori && kategori.nama_kategori.trim() !== ""
  ).length;
});

const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Kategori Destinasi");
const popUpMessage = ref("");
const kategoriToDeleteId = ref(null);

const showDeleteConfirm = (id) => {
  kategoriToDeleteId.value = id;
  popUpStatus.value = "confirm";
  popUpAction.value = "confirmDelete";
  showPopUp.value = true;
};

const handleDeleteConfirmed = async () => {
  closePopUp();
  await nextTick();

  try {
    const token = localStorage.getItem("access_token");
    await axios.delete(
      `http://localhost:5000/api/kategori-destinasi/${kategoriToDeleteId.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    openPopUp("success", "delete");
    fetchKategoriData();
  } catch (err) {
    console.error("Gagal menghapus kategori:", err.response?.data);
    openPopUp(
      "error",
      "delete",
      err.response?.data?.error || "Gagal menghapus kategori."
    );
  } finally {
    kategoriToDeleteId.value = null;
  }
};

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

const fetchKategoriData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/kategori-destinasi"
    );
    kategoriList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data kategori destinasi:", err);
    openPopUp("error", "fetch", "Gagal memuat data kategori destinasi.");
  }
};

const openKategoriForm = (kategori = null) => {
  isEditingKategori.value = !!kategori;
  formKategori.value = kategori
    ? { ...kategori }
    : {
        id_kategori_destinasi: null,
        nama_kategori: "",
        deskripsi_kategori: "",
        sampul_kategori: null,
      };
  formKategoriOpen.value = true;
};

const closeKategoriForm = () => {
  formKategoriOpen.value = false;
  formKategori.value = null;
  isEditingKategori.value = false;
  fetchKategoriData();
};

const handleSaveKategori = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };
    if (isEditingKategori.value) {
      await axios.put(
        `http://localhost:5000/api/kategori-destinasi/${formKategori.value.id_kategori_destinasi}`,
        formData,
        { headers }
      );
      openPopUp("success", "update");
    } else {
      await axios.post(
        "http://localhost:5000/api/kategori-destinasi",
        formData,
        { headers }
      );
      openPopUp("success", "create");
    }
    closeKategoriForm();
  } catch (err) {
    console.error("Gagal menyimpan kategori:", err.response?.data);
    openPopUp(
      "error",
      isEditingKategori.value ? "update" : "create",
      err.response?.data?.error || "Gagal menyimpan kategori."
    );
  }
};

onMounted(() => {
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
/* Buttons */
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
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
}

.create-button:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
}
/* Table Container */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e0e6ed;
}

.table-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #495057;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-title i {
  color: #007bff;
}

.table-count {
  color: #6c757d;
  font-size: 0.9rem;
}

.table-responsive {
  overflow-x: auto;
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
.table-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}
/* Empty State */
.no-data-found {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  color: #adb5bd;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  color: #495057;
}

.empty-state small {
  font-size: 0.9rem;
  color: #6c757d;
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

  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .main-title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }
}
</style>
