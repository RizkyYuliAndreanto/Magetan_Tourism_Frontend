<template>
  <div>
    <div class="action-bar">
      <button v-if="!formPengumumanOpen" class="action-button create-button" @click="openPengumumanForm()">
        <i class="fas fa-plus-circle"></i> Tambah Pengumuman Baru
      </button>
    </div>

    <div v-if="formPengumumanOpen" class="form-card card">
      <PengumumanForm
        :is-editing="isEditingPengumuman"
        :initial-data="formPengumuman"
        @close-form="closePengumumanForm"
        @save-pengumuman="handleSavePengumuman"
        @update-pengumuman="handleUpdatePengumuman"
      />
    </div>

    <div v-else class="table-container card">
      <div class="table-responsive">
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
            <tr v-if="pengumumanList.length === 0">
              <td colspan="5" class="no-data-found">
                Tidak ada data pengumuman yang tersedia.
              </td>
            </tr>
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
</style>