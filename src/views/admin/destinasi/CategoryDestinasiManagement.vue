<template>
  <div>
    <div class="action-bar">
      <button v-if="!formKategoriOpen" class="action-button create-button" @click="openKategoriForm()">
        <i class="fas fa-plus-circle"></i> Tambah Kategori Baru
      </button>
    </div>

    <div v-if="formKategoriOpen">
      <CategoryDestinasiForm
        :is-editing="isEditingKategori"
        :initial-data="formKategori"
        @close-form="closeKategoriForm"
        @save-kategori="handleSaveKategori"
      />
    </div>

    <div v-else class="table-container">
      <div class="table-responsive card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Kategori</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="kategori in kategoriList" :key="kategori.id_kategori_destinasi">
              <td>{{ kategori.id_kategori_destinasi }}</td>
              <td>{{ kategori.nama_kategori }}</td>
              <td>{{ kategori.deskripsi_kategori || '-' }}</td>
              <td class="actions">
                <button class="action-button edit-button" @click="openKategoriForm(kategori)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" @click="handleDeleteKategori(kategori.id_kategori_destinasi)" title="Hapus">
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
import CategoryDestinasiForm from './CategoryDestinasiForm.vue';

const kategoriList = ref([]);
const formKategoriOpen = ref(false);
const isEditingKategori = ref(false);
const formKategori = ref(null);

const fetchKategoriData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/kategori-destinasi');
    kategoriList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data kategori destinasi:', err);
  }
};

const openKategoriForm = (kategori = null) => {
  isEditingKategori.value = !!kategori;
  formKategori.value = kategori ? { ...kategori } : { id_kategori_destinasi: null, nama_kategori: '', deskripsi_kategori: '' };
  formKategoriOpen.value = true;
};

const closeKategoriForm = () => {
  formKategoriOpen.value = false;
  formKategori.value = null;
  isEditingKategori.value = false;
};

const handleSaveKategori = async (kategoriData) => {
  try {
    const token = localStorage.getItem('access_token');
    if (isEditingKategori.value) {
      await axios.put(`http://localhost:5000/api/kategori-destinasi/${kategoriData.id_kategori_destinasi}`, kategoriData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Kategori berhasil diperbarui!');
    } else {
      await axios.post('http://localhost:5000/api/kategori-destinasi', kategoriData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Kategori berhasil ditambahkan!');
    }
    closeKategoriForm();
    fetchKategoriData();
  } catch (err) {
    console.error('Gagal menyimpan kategori:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan kategori.');
  }
};

const handleDeleteKategori = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:5000/api/kategori-destinasi/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Kategori berhasil dihapus!');
      fetchKategoriData();
    } catch (err) {
      console.error('Gagal menghapus kategori:', err.response?.data);
      alert(err.response?.data?.error || 'Gagal menghapus kategori.');
    }
  }
};

onMounted(() => {
  fetchKategoriData();
});
</script>

<style scoped>
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
.form-card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;
  border: 1px solid #dee2e6;
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
.category-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  background-color: #007bff;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}
</style>