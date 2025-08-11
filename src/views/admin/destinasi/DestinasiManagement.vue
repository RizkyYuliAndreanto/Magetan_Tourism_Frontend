<template>
  <div>
    <div class="action-bar">
      <button v-if="!formDestinasiOpen" class="action-button create-button" @click="openDestinasiForm()">
        <i class="fas fa-plus-circle"></i> Tambah Destinasi Baru
      </button>
    </div>

    <div v-if="formDestinasiOpen">
      <DestinasiForm
        :is-editing="isEditingDestinasi"
        :initial-data="formDestinasi"
        :kategori-list="kategoriDestinasiList"
        :gallery-list="editingDestinasiGallery"
        @close-form="closeDestinasiForm"
        @save-destinasi="handleSaveDestinasi"
        @update-destinasi="handleUpdateDestinasi"
      />
    </div>

    <div v-else class="table-container">
      <div class="table-responsive card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Destinasi</th>
              <th>Kategori</th>
              <th>Admin</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="destinasi in destinasiList" :key="destinasi.id_destinasi">
              <td>{{ destinasi.id_destinasi }}</td>
              <td>{{ destinasi.nama_destinasi }}</td>
              <td><span class="category-badge">{{ destinasi.kategoriDestinasi.nama_kategori }}</span></td>
              <td>{{ destinasi.adminPembuat.username }}</td>
              <td class="actions">
                <button class="action-button edit-button" @click="openDestinasiForm(destinasi)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" @click="handleDeleteDestinasi(destinasi.id_destinasi)" title="Hapus">
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
import DestinasiForm from './DestinasiForm.vue';

const destinasiList = ref([]);
const kategoriDestinasiList = ref([]);
const formDestinasiOpen = ref(false);
const isEditingDestinasi = ref(false);
const formDestinasi = ref(null);
const editingDestinasiGallery = ref([]);

const fetchDestinasiData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/destinasi');
    destinasiList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data destinasi:', err);
  }
};

const fetchKategoriDestinasiData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/kategori-destinasi');
    kategoriDestinasiList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data kategori destinasi:', err);
  }
};

const openDestinasiForm = async (destinasi = null) => {
  isEditingDestinasi.value = !!destinasi;
  if (destinasi) {
    try {
      const response = await axios.get(`http://localhost:5000/api/destinasi/${destinasi.id_destinasi}`);
      const fullDestinasiData = response.data;
      formDestinasi.value = { 
        ...fullDestinasiData,
        id_kategori_destinasi: fullDestinasiData.kategoriDestinasi.id_kategori_destinasi,
      };
      editingDestinasiGallery.value = fullDestinasiData.galeriDestinasi;
    } catch (error) {
      console.error('Gagal memuat detail destinasi:', error);
      alert('Gagal memuat detail destinasi untuk diedit.');
      return;
    }
  } else {
    formDestinasi.value = { 
      id_destinasi: null, nama_destinasi: '', deskripsi_destinasi: '', alamat: '', 
      koordinat_lokasi: '', jam_operasional: '', harga_tiket: null, 
      gambar_utama: null, id_kategori_destinasi: '',
    };
    editingDestinasiGallery.value = [];
  }
  formDestinasiOpen.value = true;
};

const closeDestinasiForm = () => {
  formDestinasiOpen.value = false;
  formDestinasi.value = null;
  editingDestinasiGallery.value = [];
  isEditingDestinasi.value = false;
};

const handleSaveDestinasi = async (formData, galleryFiles) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const destinasiResponse = await axios.post('http://localhost:5000/api/destinasi', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    const id_destinasi = destinasiResponse.data.destinasi.id_destinasi;
    
    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append('id_konten', id_destinasi);
      galleryFormData.append('tipe_konten', 'destinasi');
      galleryFiles.forEach(item => {
        galleryFormData.append('media_galeri_files', item.file);
        galleryFormData.append('deskripsi_file', item.deskripsi);
        galleryFormData.append('jenis_file', item.jenis_file);
        galleryFormData.append('urutan_tampil', item.urutan);
      });
      await axios.post('http://localhost:5000/api/media-galeri', galleryFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
    }

    alert('Destinasi dan galeri berhasil ditambahkan!');
    closeDestinasiForm();
    fetchDestinasiData();
  } catch (err) {
    console.error('Gagal menyimpan destinasi:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan destinasi.');
  }
};

const handleUpdateDestinasi = async (formData, galleryFiles, deletedGalleryIds) => {
  try {
    const token = localStorage.getItem('access_token');
    const id = formData.get('id_destinasi');
    
    await axios.put(`http://localhost:5000/api/destinasi/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append('id_konten', id);
      galleryFormData.append('tipe_konten', 'destinasi');
      galleryFiles.forEach(item => {
        galleryFormData.append('media_galeri_files', item.file);
        galleryFormData.append('deskripsi_file', item.deskripsi);
        galleryFormData.append('jenis_file', item.jenis_file);
        galleryFormData.append('urutan_tampil', item.urutan);
      });
      await axios.post('http://localhost:5000/api/media-galeri', galleryFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
    }

    if (deletedGalleryIds && deletedGalleryIds.length > 0) {
        await Promise.all(deletedGalleryIds.map(async (mediaId) => {
            await axios.delete(`http://localhost:5000/api/media-galeri/${mediaId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }));
    }

    alert('Destinasi berhasil diperbarui!');
    closeDestinasiForm();
    fetchDestinasiData();
  } catch (err) {
    console.error('Gagal memperbarui destinasi:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal memperbarui destinasi.');
  }
};

const handleDeleteDestinasi = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus destinasi ini?')) {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:5000/api/destinasi/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Destinasi berhasil dihapus!');
      fetchDestinasiData();
    } catch (err) {
      console.error('Gagal menghapus destinasi:', err.response?.data);
      alert(err.response?.data?.error || 'Gagal menghapus destinasi.');
    }
  }
};

onMounted(() => {
  fetchDestinasiData();
  fetchKategoriDestinasiData();
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