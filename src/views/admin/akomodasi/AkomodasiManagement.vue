<template>
  <div>
    <div class="action-bar">
      <button v-if="!formAkomodasiOpen" class="action-button create-button" @click="openAkomodasiForm()">
        <i class="fas fa-plus-circle"></i> Tambah Akomodasi Baru
      </button>
    </div>

    <div v-if="formAkomodasiOpen" class="form-card card">
      <AkomodasiForm
        :is-editing="isEditingAkomodasi"
        :initial-data="formAkomodasi"
        :gallery-list="editingAkomodasiGallery"
        @close-form="closeAkomodasiForm"
        @save-akomodasi="handleSaveAkomodasi"
        @update-akomodasi="handleUpdateAkomodasi"
      />
    </div>

    <div v-else class="table-container card">
      <div class="table-responsive">
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
  fetchAkomodasiData();
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