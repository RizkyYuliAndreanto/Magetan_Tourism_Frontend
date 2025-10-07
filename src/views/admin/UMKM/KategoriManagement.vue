<template>
  <div>
    <div class="action-bar">
      <button v-if="!formKategoriOpen" class="action-button create-button" @click="openKategoriForm()">
        <i class="fas fa-plus-circle"></i> Tambah Kategori Baru
      </button>
    </div>

    <div v-if="formKategoriOpen" class="form-overlay">
      <div class="form-card card">
        <KategoriForm
          :is-editing="isEditingKategori"
          :initial-data="formKategori"
          @close-form="closeKategoriForm"
          @save-kategori="handleSaveKategori"
          @update-kategori="handleUpdateKategori"
        />
      </div>
    </div>

    <div v-else class="table-container card">
      <div class="table-header">
        <h3 class="table-title">
          <i class="fas fa-tags"></i>
          Daftar Kategori UMKM
        </h3>
        <span class="table-count">{{ kategoriList.length }} Kategori</span>
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
            <tr v-for="kategori in kategoriList" :key="kategori.id_kategori_umkm">
              <td>{{ kategori.id_kategori_umkm }}</td>
              <td>{{ kategori.nama_kategori }}</td>
              <td>{{ kategori.deskripsi_kategori }}</td>
              <td>
                <img v-if="kategori.gambar_sampul" :src="`http://localhost:5000${kategori.gambar_sampul}`" alt="Gambar Sampul" class="thumbnail-image"/>
                <span v-else>Tidak ada gambar</span>
              </td>
              <td class="actions">
                <button class="action-button edit-button" @click="openKategoriForm(kategori)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" @click="showDeleteConfirm(kategori.id_kategori_umkm)" title="Hapus">
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
      @confirmed="handleDeleteConfirmed"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import KategoriForm from './KategoriForm.vue';
import BasePopUp from '../../../components/pop-up/BasePopUp.vue';

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
    const token = localStorage.getItem('access_token');
    await axios.delete(`http://localhost:5000/api/kategori-umkm/${kategoriToDeleteId.value}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    openPopUp("success", "delete");
    fetchKategoriData();
  } catch (err) {
    console.error('Gagal menghapus kategori:', err.response?.data);
    openPopUp("error", "delete", err.response?.data?.error || "Gagal menghapus kategori.");
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
    const response = await axios.get('http://localhost:5000/api/kategori-umkm');
    kategoriList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data kategori:', err);
    openPopUp("error", "fetch", "Gagal memuat data kategori.");
  }
};

const openKategoriForm = (kategori = null) => {
  isEditingKategori.value = !!kategori;
  if (kategori) {
    formKategori.value = { ...kategori };
  } else {
    formKategori.value = {
      nama_kategori: '',
      deskripsi_kategori: '',
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
    const token = localStorage.getItem('access_token');
    await axios.post('http://localhost:5000/api/kategori-umkm', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    openPopUp("success", "create");
    closeKategoriForm();
  } catch (err) {
    console.error('Gagal menyimpan kategori:', err.response?.data);
    openPopUp("error", "create", err.response?.data?.error || "Gagal menyimpan kategori.");
  }
};

const handleUpdateKategori = async (formData) => {
  try {
    const token = localStorage.getItem('access_token');
    const id = formData.get('id_kategori_umkm');
    await axios.put(`http://localhost:5000/api/kategori-umkm/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    openPopUp("success", "update");
    closeKategoriForm();
  } catch (err) {
    console.error('Gagal memperbarui kategori:', err.response?.data);
    openPopUp("error", "update", err.response?.data?.error || "Gagal memperbarui kategori.");
  }
};

onMounted(() => {
  fetchKategoriData();
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
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}
.actions .delete-button:hover {
  background-color: #c82333;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}
.thumbnail-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e9ecef;
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

/* Responsive Design for Form Overlay */
@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .table-count {
    align-self: flex-start;
  }

  .form-overlay {
    padding: 1rem;
  }

  .form-overlay .form-card {
    max-height: 95vh;
  }
}
</style>