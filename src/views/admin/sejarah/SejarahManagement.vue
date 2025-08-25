<template>
  <div>
    <div class="action-bar">
      <button v-if="!formSejarahOpen" class="action-button create-button" @click="openSejarahForm()">
        <i class="fas fa-plus-circle"></i> Tambah Sejarah Baru
      </button>
    </div>

    <div v-if="formSejarahOpen" class="form-card card">
      <SejarahForm
        :is-editing="isEditingSejarah"
        :initial-data="formSejarah"
        :gallery-list="editingSejarahGallery"
        @close-form="closeSejarahForm"
        @save-sejarah="handleSaveSejarah"
        @update-sejarah="handleUpdateSejarah"
      />
    </div>

    <div v-else class="table-container card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul</th>
              <th>Tanggal Kejadian</th>
              <th>Admin</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="sejarahList.length === 0">
              <td colspan="5" class="no-data-found">
                Tidak ada data sejarah yang tersedia.
              </td>
            </tr>
            <tr v-for="sejarah in sejarahList" :key="sejarah.id_sejarah">
              <td>{{ sejarah.id_sejarah }}</td>
              <td>{{ sejarah.judul }}</td>
              <td>{{ formatDate(sejarah.tanggal_kejadian) }}</td>
              <td>{{ sejarah.adminPembuat.username }}</td>
              <td class="actions">
                <button class="action-button edit-button" @click="openSejarahForm(sejarah)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" @click="handleDeleteSejarah(sejarah.id_sejarah)" title="Hapus">
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
import SejarahForm from './SejarahForm.vue';

const sejarahList = ref([]);
const formSejarahOpen = ref(false);
const isEditingSejarah = ref(false);
const formSejarah = ref(null);
const editingSejarahGallery = ref([]);

const fetchSejarahData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/sejarah');
    sejarahList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data sejarah:', err);
    alert('Gagal memuat data sejarah.');
  }
};

const openSejarahForm = async (sejarah = null) => {
  isEditingSejarah.value = !!sejarah;
  if (sejarah) {
    try {
      const response = await axios.get(`http://localhost:5000/api/sejarah/${sejarah.id_sejarah}`);
      const fullSejarahData = response.data;
      formSejarah.value = {
        ...fullSejarahData,
        tanggal_kejadian: new Date(fullSejarahData.tanggal_kejadian).toISOString().slice(0, 10),
      };
      editingSejarahGallery.value = fullSejarahData.galeriSejarah;
    } catch (error) {
      console.error('Gagal memuat detail sejarah:', error);
      alert('Gagal memuat detail sejarah untuk diedit.');
      return;
    }
  } else {
    formSejarah.value = {
      id_sejarah: null, judul: '', deskripsi: '', tanggal_kejadian: '', gambar_sejarah: null,
    };
    editingSejarahGallery.value = [];
  }
  formSejarahOpen.value = true;
};

const closeSejarahForm = () => {
  formSejarahOpen.value = false;
  formSejarah.value = null;
  editingSejarahGallery.value = [];
  isEditingSejarah.value = false;
  fetchSejarahData();
};

const handleSaveSejarah = async (formData, galleryFiles) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const sejarahResponse = await axios.post('http://localhost:5000/api/sejarah', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    const id_sejarah = sejarahResponse.data.sejarah.id_sejarah;

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append('id_konten', id_sejarah);
      galleryFormData.append('tipe_konten', 'sejarah');
      
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
    
    alert('Sejarah dan galeri berhasil ditambahkan!');
    closeSejarahForm();
    fetchSejarahData();
  } catch (err) {
    console.error('Gagal menyimpan sejarah:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan sejarah. Periksa kembali input Anda.');
  }
};

const handleUpdateSejarah = async (formData, galleryFiles, deletedGalleryIds) => {
  try {
    const token = localStorage.getItem('access_token');
    const id = formData.get('id_sejarah');
    
    await axios.put(`http://localhost:5000/api/sejarah/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append('id_konten', id);
      galleryFormData.append('tipe_konten', 'sejarah');
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

    alert('Sejarah berhasil diperbarui!');
    closeSejarahForm();
    fetchSejarahData();
  } catch (err) {
    console.error('Gagal memperbarui sejarah:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal memperbarui sejarah.');
  }
};

const handleDeleteSejarah = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus sejarah ini?')) {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:5000/api/sejarah/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Sejarah berhasil dihapus!');
      fetchSejarahData();
    } catch (err) {
      console.error('Gagal menghapus sejarah:', err.response?.data);
      alert(err.response?.data?.error || 'Gagal menghapus sejarah.');
    }
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

onMounted(() => {
  fetchSejarahData();
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
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}

.actions .delete-button:hover {
  background-color: #c82333;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}
</style>