<template>
  <div>
    <div class="action-bar">
      <button v-if="!formAnggotaOpen" class="action-button create-button" @click="openAnggotaForm()">
        <i class="fas fa-plus-circle"></i> Tambah Anggota Baru
      </button>
    </div>

    <div v-if="formAnggotaOpen" class="form-card card">
      <StrukturAnggotaForm
        :is-editing="isEditingAnggota"
        :initial-data="formAnggota"
        @close-form="closeAnggotaForm"
        @save-anggota="handleSaveAnggota"
        @update-anggota="handleUpdateAnggota"
      />
    </div>

    <div v-else class="table-container card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Anggota</th>
              <th>Jabatan</th>
              <th>Urutan</th>
              <th>Admin Pengelola</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="anggotaList.length === 0">
              <td colspan="6" class="no-data-found">
                Tidak ada data anggota yang tersedia.
              </td>
            </tr>
            <tr v-for="anggota in anggotaList" :key="anggota.id_anggota">
              <td>{{ anggota.id_anggota }}</td>
              <td>{{ anggota.nama_anggota }}</td>
              <td>{{ anggota.jabatan }}</td>
              <td>{{ anggota.urutan_tampilan }}</td>
              <td>{{ anggota.adminPengelola.username }}</td>
              <td class="actions">
                <button class="action-button edit-button" @click="openAnggotaForm(anggota)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" @click="handleDeleteAnggota(anggota.id_anggota)" title="Hapus">
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
import StrukturAnggotaForm from './StrukturAnggotaForm.vue';

const anggotaList = ref([]);
const formAnggotaOpen = ref(false);
const isEditingAnggota = ref(false);
const formAnggota = ref(null);

const fetchAnggotaData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/struktur-anggota');
    anggotaList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data struktur anggota:', err);
    alert('Gagal memuat data struktur anggota.');
  }
};

const openAnggotaForm = (anggota = null) => {
  isEditingAnggota.value = !!anggota;
  if (anggota) {
    formAnggota.value = { ...anggota };
  } else {
    formAnggota.value = {
      id_anggota: null, nama_anggota: '', jabatan: '', deskripsi_tugas: '', foto_anggota: null, urutan_tampilan: 0,
    };
  }
  formAnggotaOpen.value = true;
};

const closeAnggotaForm = () => {
  formAnggotaOpen.value = false;
  formAnggota.value = null;
  isEditingAnggota.value = false;
};

const handleSaveAnggota = async (formData) => {
  try {
    const token = localStorage.getItem('access_token');
    await axios.post('http://localhost:5000/api/struktur-anggota', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    alert('Anggota berhasil ditambahkan!');
    closeAnggotaForm();
    fetchAnggotaData();
  } catch (err) {
    console.error('Gagal menyimpan anggota:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan anggota.');
  }
};

const handleUpdateAnggota = async (formData) => {
  try {
    const token = localStorage.getItem('access_token');
    await axios.put(`http://localhost:5000/api/struktur-anggota/${formData.get('id_anggota')}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    alert('Anggota berhasil diperbarui!');
    closeAnggotaForm();
    fetchAnggotaData();
  } catch (err) {
    console.error('Gagal memperbarui anggota:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal memperbarui anggota.');
  }
};

const handleDeleteAnggota = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus anggota ini?')) {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:5000/api/struktur-anggota/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Anggota berhasil dihapus!');
      fetchAnggotaData();
    } catch (err) {
      console.error('Gagal menghapus anggota:', err.response?.data);
      alert(err.response?.data?.error || 'Gagal menghapus anggota.');
    }
  }
};

onMounted(() => {
  fetchAnggotaData();
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