<template>
  <div>
    <div class="action-bar">
      <button v-if="!formPengumumanOpen" class="action-button create-button" @click="openPengumumanForm()">
        <i class="fas fa-plus-circle"></i> Tambah Pengumuman Baru
      </button>
    </div>

    <div v-if="formPengumumanOpen" class="form-card">
      <PengumumanForm
        :is-editing="isEditingPengumuman"
        :initial-data="formPengumuman"
        @close-form="closePengumumanForm"
        @save-pengumuman="handleSavePengumuman"
        @update-pengumuman="handleUpdatePengumuman"
      />
    </div>

    <div v-else class="table-container">
      <div class="table-responsive card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul</th>
              <th>Admin Pengelola</th>
              <th>Tanggal Publikasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pengumuman in pengumumanList" :key="pengumuman.id_pengumuman">
              <td>{{ pengumuman.id_pengumuman }}</td>
              <td>{{ pengumuman.judul_pengumuman }}</td>
              <td>{{ pengumuman.adminPengelola.username }}</td>
              <td>{{ formatDate(pengumuman.tanggal_publikasi) }}</td>
              <td class="actions">
                <button class="action-button edit-button" @click="openPengumumanForm(pengumuman)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" @click="handleDeletePengumuman(pengumuman.id_pengumuman)" title="Hapus">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import PengumumanForm from './PengumumanForm.vue';

const pengumumanList = ref([]);
const formPengumumanOpen = ref(false);
const isEditingPengumuman = ref(false);
const formPengumuman = ref(null);

const fetchPengumumanData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/pengumuman');
    pengumumanList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data pengumuman:', err);
    alert('Gagal memuat data pengumuman.');
  }
};

const openPengumumanForm = (pengumuman = null) => {
  isEditingPengumuman.value = !!pengumuman;
  if (pengumuman) {
    formPengumuman.value = { 
      ...pengumuman,
      file_pdf_pengumuman: null, // Ensure file input is reset
      sampul_pengumuman: null // Ensure file input is reset
    };
  } else {
    formPengumuman.value = {
      id_pengumuman: null, 
      judul_pengumuman: '', 
      isi_pengumuman: '', 
      file_pdf_pengumuman: null,
      sampul_pengumuman: null,
    };
  }
  formPengumumanOpen.value = true;
};

const closePengumumanForm = () => {
  formPengumumanOpen.value = false;
  formPengumuman.value = null;
  isEditingPengumuman.value = false;
};

const handleSavePengumuman = async (formData) => {
  try {
    const token = localStorage.getItem('access_token');
    await axios.post('http://localhost:5000/api/pengumuman', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    alert('Pengumuman berhasil ditambahkan!');
    closePengumumanForm();
    fetchPengumumanData();
  } catch (err) {
    console.error('Gagal menyimpan pengumuman:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan pengumuman.');
  }
};

const handleUpdatePengumuman = async (formData) => {
  try {
    const token = localStorage.getItem('access_token');
    await axios.put(`http://localhost:5000/api/pengumuman/${formData.get('id_pengumuman')}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    alert('Pengumuman berhasil diperbarui!');
    closePengumumanForm();
    fetchPengumumanData();
  } catch (err) {
    console.error('Gagal memperbarui pengumuman:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal memperbarui pengumuman.');
  }
};

const handleDeletePengumuman = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:5000/api/pengumuman/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Pengumuman berhasil dihapus!');
      fetchPengumumanData();
    } catch (err) {
      console.error('Gagal menghapus pengumuman:', err.response?.data);
      alert(err.response?.data?.error || 'Gagal menghapus pengumuman.');
    }
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

onMounted(() => {
  fetchPengumumanData();
});
</script>

<style scoped>
/* No changes to styles */
.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}
.action-button {
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.create-button {
  background-color: #28a745;
}
.create-button:hover {
  background-color: #218838;
  transform: translateY(-2px);
}
.table-container {
  overflow-x: auto;
}
.table-responsive.card {
  padding: 0;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}
.data-table th, 
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}
.data-table th {
  background-color: #e9ecef;
  color: #343a40;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
}
.data-table tr:last-child td {
  border-bottom: none;
}
.data-table tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.actions .action-button {
  padding: 0.5rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: none;
}
.actions .edit-button {
  background-color: #ffc107;
  color: white;
}
.actions .edit-button:hover {
  background-color: #e0a800;
}
.actions .delete-button {
  background-color: #dc3545;
}
.actions .delete-button:hover {
  background-color: #c82333;
}
</style>