<template>
  <div>
    <div class="action-bar">
      <button v-if="!formKontenOpen" class="action-button create-button" @click="openKontenForm()">
        <i class="fas fa-plus-circle"></i> Tambah Konten Baru
      </button>
    </div>

    <div v-if="formKontenOpen" class="form-card card">
      <KontenPpidForm
        :is-editing="isEditingKonten"
        :initial-data="formKonten"
        :kategori-list="kategoriList"
        @close-form="closeKontenForm"
        @save-konten="handleSaveKonten"
        @update-konten="handleUpdateKonten"
      />
    </div>

    <div v-else class="table-container card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul Konten</th>
              <th>Kategori</th>
              <th>Admin Pengelola</th>
              <th>Tanggal Publikasi</th>
              <th>Aksi</th>
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
              <td><span class="category-badge">{{ konten.kategoriPPID ? konten.kategoriPPID.nama_kategori : 'N/A' }}</span></td>
              <td>{{ konten.adminPengelola ? konten.adminPengelola.username : 'N/A' }}</td>
              <td>{{ formatDate(konten.tanggal_publikasi) }}</td>
              <td class="actions">
                <button class="action-button edit-button" @click="openKontenForm(konten)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" @click="showDeleteConfirm(konten.id_konten_ppid)" title="Hapus">
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
import KontenPpidForm from './KontenPpidForm.vue';
import BasePopUp from '../../../components/pop-up/BasePopUp.vue';

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

const getToken = () => localStorage.getItem('access_token');

const fetchKontenData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/konten-ppid');
    kontenList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data konten PPID:', err);
    openPopUp("error", "fetch", err.response?.data?.error || "Gagal memuat data konten PPID.");
  }
};

const fetchKategoriData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/kategori-ppid');
    kategoriList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data kategori PPID:', err);
    openPopUp("error", "fetch", err.response?.data?.error || "Gagal memuat data kategori PPID.");
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
      judul_konten: '',
      deskripsi_konten: '',
      id_kategori_ppid: '',
      gambar_sampul: null,
      file_pdf_path: null,
    };
  }
  formKontenOpen.value = true;
};

const closeKontenForm = () => {
  formKontenOpen.value = false;
  formKonten.value = null;
  isEditingKonten.value = false;
  fetchKontenData();
  fetchKategoriData();
};

const handleSaveKonten = async (formData) => {
  try {
    const token = getToken();
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    };
    await axios.post('http://localhost:5000/api/konten-ppid', formData, config);
    openPopUp("success", "create");
    closeKontenForm();
  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Gagal menyimpan konten PPID.';
    console.error('Gagal menyimpan konten PPID:', errorMessage);
    openPopUp("error", "create", errorMessage);
  }
};

const handleUpdateKonten = async (formData) => {
  try {
    const token = getToken();
    const id = formData.get('id_konten_ppid');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    };
    
    await axios.put(`http://localhost:5000/api/konten-ppid/${id}`, formData, config);
    openPopUp("success", "update");
    closeKontenForm();
  } catch (err) {
    const errorMessage = err.response?.data?.error || 'Gagal memperbarui konten PPID.';
    console.error('Gagal memperbarui konten PPID:', errorMessage);
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
    await axios.delete(`http://localhost:5000/api/konten-ppid/${kontenToDeleteId.value}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    openPopUp("success", "delete");
    fetchKontenData();
  } catch (err) {
    const errorMessage = err.response?.data?.error || "Gagal menghapus konten PPID.";
    console.error('Gagal menghapus konten PPID:', errorMessage);
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
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

onMounted(() => {
  fetchKontenData();
  fetchKategoriData();
});
</script>

<style scoped>
/* Gaya CSS tidak ada perubahan. */
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
.table-container .table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e6ed;
  margin: 0;
  background-color: #f8f9fa;
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
</style>