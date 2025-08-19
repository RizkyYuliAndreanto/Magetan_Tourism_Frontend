<template>
  <div>
    <div class="action-bar">
      <button v-if="!formAkomodasiOpen" class="action-button create-button" @click="openAkomodasiForm()">
        <i class="fas fa-plus-circle"></i> Tambah Akomodasi Baru
      </button>
    </div>

    <div v-if="formAkomodasiOpen">
      <AkomodasiForm
        :is-editing="isEditingAkomodasi"
        :initial-data="formAkomodasi"
        :gallery-list="editingAkomodasiGallery"
        @close-form="closeAkomodasiForm"
        @save-akomodasi="handleSaveAkomodasi"
        @update-akomodasi="handleUpdateAkomodasi"
      />
    </div>

    <div v-else class="table-container">
      <div class="table-responsive card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Akomodasi</th>
              <th>Alamat</th>
              <th>Admin Pengelola</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="akomodasi in akomodasiList" :key="akomodasi.id_akomodasi">
              <td>{{ akomodasi.id_akomodasi }}</td>
              <td>{{ akomodasi.nama_akomodasi }}</td>
              <td>{{ akomodasi.alamat }}</td>
              <td>{{ akomodasi.adminPengelola.username }}</td>
              <td class="actions">
                <button class="action-button edit-button" @click="openAkomodasiForm(akomodasi)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" @click="handleDeleteAkomodasi(akomodasi.id_akomodasi)" title="Hapus">
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
import AkomodasiForm from './AkomodasiForm.vue';

const akomodasiList = ref([]);
const formAkomodasiOpen = ref(false);
const isEditingAkomodasi = ref(false);
const formAkomodasi = ref(null);
const editingAkomodasiGallery = ref([]);

const fetchAkomodasiData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/akomodasi');
    akomodasiList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data akomodasi:', err);
    alert('Gagal memuat data akomodasi.');
  }
};

const openAkomodasiForm = async (akomodasi = null) => {
  isEditingAkomodasi.value = !!akomodasi;
  if (akomodasi) {
    try {
      const response = await axios.get(`http://localhost:5000/api/akomodasi/${akomodasi.id_akomodasi}`);
      const fullAkomodasiData = response.data;
      formAkomodasi.value = { 
        ...fullAkomodasiData,
        gambar_akomodasi: null // reset file input
      };
      editingAkomodasiGallery.value = fullAkomodasiData.galeriAkomodasi;
    } catch (error) {
      console.error('Gagal memuat detail akomodasi:', error);
      alert('Gagal memuat detail akomodasi untuk diedit.');
      return;
    }
  } else {
    formAkomodasi.value = {
      id_akomodasi: null, nama_akomodasi: '', deskripsi_akomodasi: '', alamat: '', kontak: '',
      link_website: '', harga_akomodasi: null, gambar_akomodasi: null, koordinat_lokasi: '',
    };
    editingAkomodasiGallery.value = [];
  }
  formAkomodasiOpen.value = true;
};

const closeAkomodasiForm = () => {
  formAkomodasiOpen.value = false;
  formAkomodasi.value = null;
  editingAkomodasiGallery.value = [];
  isEditingAkomodasi.value = false;
};

const handleSaveAkomodasi = async (formData, galleryFiles) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const akomodasiResponse = await axios.post('http://localhost:5000/api/akomodasi', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    const id_akomodasi = akomodasiResponse.data.akomodasi.id_akomodasi;

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append('id_konten', id_akomodasi);
      galleryFormData.append('tipe_konten', 'akomodasi');
      
      galleryFiles.forEach((galleryItem) => {
        galleryFormData.append(`media_galeri_files`, galleryItem.file);
        galleryFormData.append('deskripsi_file', galleryItem.deskripsi || '');
        galleryFormData.append('jenis_file', galleryItem.jenis_file);
        galleryFormData.append('urutan_tampil', galleryItem.urutan);
      });
      await axios.post('http://localhost:5000/api/media-galeri', galleryFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    alert('Akomodasi dan galeri berhasil ditambahkan!');
    closeAkomodasiForm();
    fetchAkomodasiData();
  } catch (err) {
    console.error('Gagal menyimpan akomodasi:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan akomodasi. Periksa kembali input Anda.');
  }
};

const handleUpdateAkomodasi = async (formData, galleryFiles, deletedGalleryIds) => {
  try {
    const token = localStorage.getItem('access_token');
    const id = formData.get('id_akomodasi');
    
    await axios.put(`http://localhost:5000/api/akomodasi/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append('id_konten', id);
      galleryFormData.append('tipe_konten', 'akomodasi');
      galleryFiles.forEach((galleryItem) => {
        galleryFormData.append(`media_galeri_files`, galleryItem.file);
        galleryFormData.append('deskripsi_file', galleryItem.deskripsi || '');
        galleryFormData.append('jenis_file', galleryItem.jenis_file);
        galleryFormData.append('urutan_tampil', galleryItem.urutan);
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

    alert('Akomodasi berhasil diperbarui!');
    closeAkomodasiForm();
    fetchAkomodasiData();
  } catch (err) {
    console.error('Gagal memperbarui akomodasi:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal memperbarui akomodasi.');
  }
};

const handleDeleteAkomodasi = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus akomodasi ini?')) {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:5000/api/akomodasi/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Akomodasi berhasil dihapus!');
      fetchAkomodasiData();
    } catch (err) {
      console.error('Gagal menghapus akomodasi:', err.response?.data);
      alert(err.response?.data?.error || 'Gagal menghapus akomodasi.');
    }
  }
};

onMounted(() => {
  fetchAkomodasiData();
});
</script>

<style scoped>
/* Gaya CSS untuk tabel akomodasi dan tombol aksi */
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