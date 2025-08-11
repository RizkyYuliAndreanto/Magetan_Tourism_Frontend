<template>
  <div>
    <div class="action-bar">
      <button v-if="!formUMKMOpen" class="action-button create-button" @click="openUMKMForm()">
        <i class="fas fa-plus-circle"></i> Tambah UMKM Baru
      </button>
    </div>

    <div v-if="formUMKMOpen">
      <UMKMForm
        :is-editing="isEditingUMKM"
        :initial-data="formUMKM"
        :gallery-list="editingUMKMGallery"
        @close-form="closeUMKMForm"
        @save-umkm="handleSaveUMKM"
        @update-umkm="handleUpdateUMKM"
      />
    </div>

    <div v-else class="table-container">
      <div class="table-responsive card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama UMKM</th>
              <th>Jenis Usaha</th>
              <th>Admin</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="umkm in umkmList" :key="umkm.id_umkm">
              <td>{{ umkm.id_umkm }}</td>
              <td>{{ umkm.nama_umkm }}</td>
              <td><span class="category-badge">{{ umkm.jenis_usaha }}</span></td>
              <td>{{ umkm.adminPembuat.username }}</td>
              <td class="actions">
                <button class="action-button edit-button" @click="openUMKMForm(umkm)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" @click="handleDeleteUMKM(umkm.id_umkm)" title="Hapus">
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
import UMKMForm from './UMKMForm.vue';

const umkmList = ref([]);
const formUMKMOpen = ref(false);
const isEditingUMKM = ref(false);
const formUMKM = ref(null);
const editingUMKMGallery = ref([]);

const fetchUMKMData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/umkm');
    umkmList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data UMKM:', err);
    alert('Gagal memuat data UMKM.');
  }
};

const openUMKMForm = async (umkm = null) => {
  isEditingUMKM.value = !!umkm;
  if (umkm) {
    try {
      const response = await axios.get(`http://localhost:5000/api/umkm/${umkm.id_umkm}`);
      const fullUMKMData = response.data;
      formUMKM.value = { 
        ...fullUMKMData,
        gambar_produk_utama: null // reset file input
      };
      editingUMKMGallery.value = fullUMKMData.galeriUMKM;
    } catch (error) {
      console.error('Gagal memuat detail UMKM:', error);
      alert('Gagal memuat detail UMKM untuk diedit.');
      return;
    }
  } else {
    formUMKM.value = {
      id_umkm: null, nama_umkm: '', deskripsi_umkm: '', jenis_usaha: '', alamat_umkm: '',
      kontak_umkm: '', website_umkm: '', gambar_produk_utama: null,
    };
    editingUMKMGallery.value = [];
  }
  formUMKMOpen.value = true;
};

const closeUMKMForm = () => {
  formUMKMOpen.value = false;
  formUMKM.value = null;
  editingUMKMGallery.value = [];
  isEditingUMKM.value = false;
};

const handleSaveUMKM = async (formData, galleryFiles) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const umkmResponse = await axios.post('http://localhost:5000/api/umkm', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    const id_umkm = umkmResponse.data.umkm.id_umkm;

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append('id_konten', id_umkm);
      galleryFormData.append('tipe_konten', 'umkm');
      
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
    
    alert('UMKM dan galeri berhasil ditambahkan!');
    closeUMKMForm();
    fetchUMKMData();
  } catch (err) {
    console.error('Gagal menyimpan UMKM:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan UMKM. Periksa kembali input Anda.');
  }
};

const handleUpdateUMKM = async (formData, galleryFiles, deletedGalleryIds) => {
  try {
    const token = localStorage.getItem('access_token');
    const id = formData.get('id_umkm');
    
    await axios.put(`http://localhost:5000/api/umkm/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append('id_konten', id);
      galleryFormData.append('tipe_konten', 'umkm');
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

    alert('UMKM berhasil diperbarui!');
    closeUMKMForm();
    fetchUMKMData();
  } catch (err) {
    console.error('Gagal memperbarui UMKM:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal memperbarui UMKM.');
  }
};

const handleDeleteUMKM = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus UMKM ini?')) {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:5000/api/umkm/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('UMKM berhasil dihapus!');
      fetchUMKMData();
    } catch (err) {
      console.error('Gagal menghapus UMKM:', err.response?.data);
      alert(err.response?.data?.error || 'Gagal menghapus UMKM.');
    }
  }
};

onMounted(() => {
  fetchUMKMData();
});
</script>

<style scoped>
/* Gaya CSS untuk tabel UMKM dan tombol aksi */
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