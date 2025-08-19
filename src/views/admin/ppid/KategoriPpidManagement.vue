<template>
  <div>
    <div class="action-bar">
      <button v-if="!formKategoriOpen" class="action-button create-button" @click="openKategoriForm()">
        <i class="fas fa-plus-circle"></i> Tambah Kategori Baru
      </button>
    </div>

    <div v-if="formKategoriOpen" class="form-card">
      <KategoriPpidForm
        :is-editing="isEditingKategori"
        :initial-data="formKategori"
        :kategori-induk-list="kategoriIndukList"
        @close-form="closeKategoriForm"
        @save-kategori="handleSaveKategori"
        @update-kategori="handleUpdateKategori"
      />
    </div>

    <div v-else class="table-container">
      <div class="table-responsive card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Kategori</th>
              <th>Level</th>
              <th>Kategori Induk</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="kategori in kategoriList" :key="kategori.id_kategori_ppid">
              <td>{{ kategori.id_kategori_ppid }}</td>
              <td>{{ kategori.nama_kategori }}</td>
              <td>{{ kategori.level_kategori }}</td>
              <td>{{ kategori.kategoriInduk ? kategori.kategoriInduk.nama_kategori : '-' }}</td>
              <td class="actions">
                <button class="action-button edit-button" @click="openKategoriForm(kategori)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" @click="handleDeleteKategori(kategori.id_kategori_ppid)" title="Hapus">
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
import KategoriPpidForm from './KategoriPpidForm.vue';

const kategoriList = ref([]);
const kategoriIndukList = ref([]);
const formKategoriOpen = ref(false);
const isEditingKategori = ref(false);
const formKategori = ref(null);

const fetchKategoriData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/kategori-ppid?includeSubKategori=true');
    kategoriList.value = response.data;
    kategoriIndukList.value = response.data.filter(k => !k.id_kategori_induk);
  } catch (err) {
    console.error('Gagal memuat data kategori PPID:', err);
  }
};

const openKategoriForm = (kategori = null) => {
  isEditingKategori.value = !!kategori;
  if (kategori) {
    formKategori.value = { 
      ...kategori,
      id_kategori_induk: kategori.kategoriInduk ? kategori.kategoriInduk.id_kategori_ppid : null,
    };
  } else {
    formKategori.value = {
      id_kategori_ppid: null, nama_kategori: '', deskripsi_kategori: '', id_kategori_induk: null,
    };
  }
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
    await axios.post('http://localhost:5000/api/kategori-ppid', kategoriData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Kategori berhasil ditambahkan!');
    closeKategoriForm();
    fetchKategoriData();
  } catch (err) {
    console.error('Gagal menyimpan kategori:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan kategori.');
  }
};

const handleUpdateKategori = async (kategoriData) => {
  try {
    const token = localStorage.getItem('access_token');
    await axios.put(`http://localhost:5000/api/kategori-ppid/${kategoriData.id_kategori_ppid}`, kategoriData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Kategori berhasil diperbarui!');
    closeKategoriForm();
    fetchKategoriData();
  } catch (err) {
    console.error('Gagal memperbarui kategori:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal memperbarui kategori.');
  }
};

const handleDeleteKategori = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:5000/api/kategori-ppid/${id}`, {
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
/* Gaya CSS untuk tabel kategori PPID dan tombol aksi */
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