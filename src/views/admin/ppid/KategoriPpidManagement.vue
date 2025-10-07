<template>
  <div>
    <!-- Header dengan Penjelasan -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-sitemap"></i>
          Data Kategori PPID
        </h2>
        <p class="subtitle">
          Kelola kategori dan sub-kategori untuk mengorganisir dokumen dan
          informasi PPID. Kategori induk adalah kategori utama, sedangkan
          sub-kategori adalah turunan dari kategori induk.
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

    <div v-if="formKategoriOpen" class="form-overlay">
      <div class="form-card card">
        <KategoriPpidForm
          :is-editing="isEditingKategori"
          :initial-data="formKategori"
          :kategori-induk-list="kategoriIndukList"
          @close-form="closeKategoriForm"
          @save-kategori="handleSaveKategori"
          @update-kategori="handleUpdateKategori" />
      </div>
    </div>

    <div v-else>
      <!-- Statistik -->
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-folder"></i>
          </div>
          <div class="stat-content">
            <h3>{{ kategoriIndukData.length }}</h3>
            <p>Kategori Induk</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-folder-open"></i>
          </div>
          <div class="stat-content">
            <h3>{{ totalSubKategori }}</h3>
            <p>Total Sub-Kategori</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-layer-group"></i>
          </div>
          <div class="stat-content">
            <h3>{{ kategoriIndukData.length + totalSubKategori }}</h3>
            <p>Total Kategori</p>
          </div>
        </div>
      </div>

      <div class="table-container card">
        <div class="table-header">
          <h3 class="table-title">
            <i class="fas fa-folder"></i>
            Kategori Induk (Level 1)
          </h3>
          <span v-if="kategoriIndukData.length > 0" class="table-count">
            {{ kategoriIndukData.length }} kategori
          </span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Kategori</th>
                <th>Deskripsi</th>
                <th>Sub-Kategori</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="kategoriIndukData.length === 0">
                <td colspan="5" class="no-data-found">
                  <div class="empty-state">
                    <i class="fas fa-folder-plus"></i>
                    <p>Belum ada kategori induk yang tersedia.</p>
                    <small
                      >Klik tombol "Tambah Kategori Baru" untuk membuat kategori
                      induk pertama.</small
                    >
                  </div>
                </td>
              </tr>
              <tr
                v-for="kategori in kategoriIndukData"
                :key="kategori.id_kategori_ppid">
                <td>
                  <span class="id-badge">{{ kategori.id_kategori_ppid }}</span>
                </td>
                <td>
                  <div class="category-name">
                    <i class="fas fa-folder category-icon"></i>
                    <strong>{{ kategori.nama_kategori }}</strong>
                  </div>
                </td>
                <td>{{ kategori.deskripsi_kategori || "-" }}</td>
                <td>
                  <span
                    class="sub-count"
                    :class="{
                      'has-subs':
                        kategori.subKategoris &&
                        kategori.subKategoris.length > 0,
                    }">
                    {{
                      kategori.subKategoris ? kategori.subKategoris.length : 0
                    }}
                    sub-kategori
                  </span>
                </td>
                <td class="actions">
                  <button
                    class="action-button edit-button"
                    @click="openKategoriForm(kategori)"
                    title="Edit Kategori">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="action-button delete-button"
                    @click="showDeleteConfirm(kategori.id_kategori_ppid)"
                    title="Hapus Kategori">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        v-for="induk in kategoriIndukData"
        :key="`sub-kategori-${induk.id_kategori_ppid}`">
        <div
          v-if="induk.subKategoris && induk.subKategoris.length > 0"
          class="table-container card mt-4">
          <div class="table-header sub-category-header">
            <h3 class="table-title">
              <i class="fas fa-folder-open"></i>
              Sub-Kategori dari:
              <span class="parent-category">{{ induk.nama_kategori }}</span>
            </h3>
            <span class="table-count">
              {{ induk.subKategoris.length }} sub-kategori
            </span>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Sub-Kategori</th>
                  <th>Deskripsi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="subKategori in induk.subKategoris"
                  :key="subKategori.id_kategori_ppid">
                  <td>
                    <span class="id-badge sub-badge">{{
                      subKategori.id_kategori_ppid
                    }}</span>
                  </td>
                  <td>
                    <div class="category-name sub-category-name">
                      <i class="fas fa-folder-open category-icon"></i>
                      <span>{{ subKategori.nama_kategori }}</span>
                    </div>
                  </td>
                  <td>{{ subKategori.deskripsi_kategori || "-" }}</td>
                  <td class="actions">
                    <button
                      class="action-button edit-button"
                      @click="openKategoriForm(subKategori)"
                      title="Edit Sub-Kategori">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="action-button delete-button"
                      @click="showDeleteConfirm(subKategori.id_kategori_ppid)"
                      title="Hapus Sub-Kategori">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import axios from "axios";
import KategoriPpidForm from "./KategoriPpidForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const kategoriList = ref([]);
const kategoriIndukList = ref([]);
const kategoriIndukData = ref([]);
const formKategoriOpen = ref(false);
const isEditingKategori = ref(false);
const formKategori = ref(null);

const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Kategori PPID");
const popUpMessage = ref("");
const kategoriToDeleteId = ref(null);

// Computed properties
const totalSubKategori = computed(() => {
  return kategoriIndukData.value.reduce((total, induk) => {
    return total + (induk.subKategoris ? induk.subKategoris.length : 0);
  }, 0);
});

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
      `http://localhost:5000/api/kategori-ppid/${kategoriToDeleteId.value}`,
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
      "http://localhost:5000/api/kategori-ppid?includeSubKategori=true"
    );
    kategoriList.value = response.data;

    const allKategoris = response.data;

    kategoriIndukData.value = allKategoris.filter(
      (k) => k.id_kategori_induk === null
    );

    kategoriIndukData.value = kategoriIndukData.value.map((induk) => ({
      ...induk,
      subKategoris: allKategoris.filter(
        (k) => k.id_kategori_induk === induk.id_kategori_ppid
      ),
    }));

    kategoriIndukList.value = kategoriIndukData.value.filter(
      (k) => k.id_kategori_induk === null
    );
  } catch (err) {
    console.error("Gagal memuat data kategori PPID:", err);
    openPopUp("error", "fetch", "Gagal memuat data kategori PPID.");
  }
};

const openKategoriForm = (kategori = null) => {
  isEditingKategori.value = !!kategori;
  if (kategori) {
    formKategori.value = {
      ...kategori,
      id_kategori_induk: kategori.id_kategori_induk
        ? kategori.id_kategori_induk
        : null,
    };
  } else {
    formKategori.value = {
      id_kategori_ppid: null,
      nama_kategori: "",
      deskripsi_kategori: "",
      id_kategori_induk: null,
    };
  }
  formKategoriOpen.value = true;

  // Prevent body scroll
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
};

const closeKategoriForm = () => {
  formKategoriOpen.value = false;
  formKategori.value = null;
  isEditingKategori.value = false;

  // Restore body scroll
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";

  fetchKategoriData();
};

const handleSaveKategori = async (kategoriData) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.post("http://localhost:5000/api/kategori-ppid", kategoriData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    openPopUp("success", "create");
    closeKategoriForm();
  } catch (err) {
    console.error("Gagal menyimpan kategori:", err.response?.data);
    openPopUp(
      "error",
      "create",
      err.response?.data?.error || "Gagal menyimpan kategori."
    );
  }
};

const handleUpdateKategori = async (kategoriData) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.put(
      `http://localhost:5000/api/kategori-ppid/${kategoriData.id_kategori_ppid}`,
      kategoriData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    openPopUp("success", "update");
    closeKategoriForm();
  } catch (err) {
    console.error("Gagal memperbarui kategori:", err.response?.data);
    openPopUp(
      "error",
      "update",
      err.response?.data?.error || "Gagal memperbarui kategori."
    );
  }
};

const handleDeleteKategori = async (id) => {
  showDeleteConfirm(id);
};

onMounted(() => {
  fetchKategoriData();
});
</script>

<style scoped>
/* =========== Gaya CSS yang diselaraskan dengan AkomodasiManagement.vue =========== */

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
}

.subtitle {
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

/* Stats Container */
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
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #6f42c1 0%, #59359a 100%);
  box-shadow: 0 4px 15px rgba(111, 66, 193, 0.2);
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.9;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.stat-content p {
  font-size: 0.9rem;
  margin: 0;
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
  border-bottom: 1px solid #e0e6ed;
  background-color: #f8f9fa;
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

.parent-category {
  color: #007bff;
  font-weight: 700;
}

.table-count {
  background-color: #007bff;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.sub-category-header .table-title i {
  color: #28a745;
}

.sub-category-header .table-count {
  background-color: #28a745;
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.empty-state i {
  font-size: 3rem;
  color: #007bff;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.1rem;
  color: #495057;
  margin: 0;
  font-weight: 500;
}

.empty-state small {
  color: #6c757d;
  font-size: 0.9rem;
  text-align: center;
  max-width: 300px;
}

.id-badge {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.sub-badge {
  background-color: #28a745;
}

.category-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-icon {
  color: #007bff;
  width: 16px;
}

.sub-category-name .category-icon {
  color: #28a745;
}

.sub-count {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: #e9ecef;
  color: #6c757d;
}

.sub-count.has-subs {
  background-color: #d1ecf1;
  color: #0c5460;
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
  align-items: center;
  z-index: 9999;
  overflow-y: auto;
  padding: 2rem;
  box-sizing: border-box;
}

.form-overlay .form-card {
  position: relative;
  max-width: 800px;
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

  .category-name {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
