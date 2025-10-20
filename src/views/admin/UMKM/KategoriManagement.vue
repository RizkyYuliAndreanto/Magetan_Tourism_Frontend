<template>
  <div>
    <!-- Header dengan Penjelasan -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-tags"></i>
          Kategori UMKM
        </h2>
        <p class="subtitle">
          Kelola kategori UMKM untuk mengelompokkan usaha mikro, kecil, dan
          menengah. Setiap kategori membantu wisatawan menemukan jenis UMKM yang
          mereka cari.
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
        <KategoriForm
          :is-editing="isEditingKategori"
          :initial-data="formKategori"
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
            <i class="fas fa-tags"></i>
          </div>
          <div class="stat-content">
            <h3>{{ kategoriList.length }}</h3>
            <p>Total Kategori</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stat-content">
            <h3>
              {{
                kategoriList.filter(
                  (k) => k.nama_kategori && k.nama_kategori.length > 0
                ).length
              }}
            </h3>
            <p>Kategori Aktif</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-image"></i>
          </div>
          <div class="stat-content">
            <h3>{{ kategoriList.filter((k) => k.gambar_sampul).length }}</h3>
            <p>Dengan Gambar</p>
          </div>
        </div>
      </div>

      <!-- Tabel -->
      <div class="table-container card">
        <div class="table-header">
          <h3 class="table-title">
            <i class="fas fa-tags"></i>
            Daftar Kategori UMKM
          </h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th><i class="fas fa-hashtag"></i>ID</th>
                <th><i class="fas fa-tags"></i>Nama Kategori</th>
                <th><i class="fas fa-align-left"></i>Deskripsi</th>
                <th><i class="fas fa-image"></i>Gambar Sampul</th>
                <th><i class="fas fa-cogs"></i>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="kategoriList.length === 0">
                <td colspan="5" class="no-data-found">
                  Tidak ada kategori yang tersedia.
                </td>
              </tr>
              <tr
                v-for="kategori in kategoriList"
                :key="kategori.id_kategori_umkm">
                <td>{{ kategori.id_kategori_umkm }}</td>
                <td>{{ kategori.nama_kategori }}</td>
                <td>{{ kategori.deskripsi_kategori }}</td>
                <td>
                  <img
                    v-if="kategori.gambar_sampul"
                    :src="`http://localhost:5000${kategori.gambar_sampul}`"
                    alt="Gambar Sampul"
                    class="thumbnail-image" />
                  <span v-else>Tidak ada gambar</span>
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
                    @click="showDeleteConfirm(kategori.id_kategori_umkm)"
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
import { ref, onMounted, nextTick } from "vue";
import axios from "axios";
import KategoriForm from "./KategoriForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const kategoriList = ref([]);
const formKategoriOpen = ref(false);
const isEditingKategori = ref(false);
const formKategori = ref(null);

// State untuk pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Kategori UMKM");
const popUpMessage = ref("");
const kategoriToDeleteId = ref(null);

// Fungsi yang memicu pop-up konfirmasi
const showDeleteConfirm = (id) => {
  kategoriToDeleteId.value = id;
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
      `http://localhost:5000/api/kategori-umkm/${kategoriToDeleteId.value}`,
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

const fetchKategoriData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/kategori-umkm");
    kategoriList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data kategori:", err);
    openPopUp("error", "fetch", "Gagal memuat data kategori.");
  }
};

const openKategoriForm = (kategori = null) => {
  isEditingKategori.value = !!kategori;
  if (kategori) {
    formKategori.value = { ...kategori };
  } else {
    formKategori.value = {
      nama_kategori: "",
      deskripsi_kategori: "",
      gambar_sampul: null,
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

const handleSaveKategori = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.post("http://localhost:5000/api/kategori-umkm", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
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

const handleUpdateKategori = async (formData) => {
  try {
    const token = localStorage.getItem("access_token");
    const id = formData.get("id_kategori_umkm");
    await axios.put(`http://localhost:5000/api/kategori-umkm/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
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

onMounted(() => {
  fetchKategoriData();
});
</script>

<style scoped>
/* Header Section */
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-info .main-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-info .main-title i {
  font-size: 1.6rem;
}

.header-info .subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
  max-width: 600px;
}

.action-bar {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  border-left: 4px solid transparent;
}

.stat-card:nth-child(1) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.9;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.stat-content p {
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
}

/* Action Buttons */
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
  position: relative;
  overflow: hidden;
}

.action-button::before {
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
  transition: left 0.5s ease;
}

.action-button:hover::before {
  left: 100%;
}

.create-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.create-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.edit-button {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  color: #8b4513;
  padding: 0.5rem;
}

.edit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(252, 182, 159, 0.4);
}

.delete-button {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  color: #d63384;
  padding: 0.5rem;
}

.delete-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 154, 158, 0.4);
}

/* Table Section */
.table-container.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.table-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #495057;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.table-title i {
  color: #667eea;
  font-size: 1.1rem;
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
  border-bottom: 1px solid #f1f3f4;
  vertical-align: middle;
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
  justify-content: center;
}

.thumbnail-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.thumbnail-image:hover {
  transform: scale(1.1);
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

/* Table Header Styles */
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
  gap: 0.75rem;
}

.table-title i {
  color: #007bff;
}

.table-count {
  background-color: #007bff;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Table Header Icons */
.data-table th i {
  color: #007bff;
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.data-table th {
  color: #495057;
  font-size: 0.85rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .stats-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    padding: 1.5rem;
  }

  .header-info .main-title {
    font-size: 1.5rem;
    justify-content: center;
  }

  .action-bar {
    justify-content: center;
  }

  .stats-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 1.5rem;
  }

  .table-responsive {
    font-size: 0.85rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem 1rem;
  }

  .form-overlay {
    padding: 1rem;
  }

  .form-overlay .form-card {
    max-height: 95vh;
  }

  .actions {
    flex-direction: column;
    gap: 0.25rem;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 1rem;
  }

  .header-info .main-title {
    font-size: 1.25rem;
  }

  .header-info .subtitle {
    font-size: 0.9rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .thumbnail-image {
    width: 40px;
    height: 40px;
  }
}
</style>
