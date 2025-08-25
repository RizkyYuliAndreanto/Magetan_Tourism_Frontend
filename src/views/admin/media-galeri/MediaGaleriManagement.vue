<template>
  <div>
    <div class="action-bar">
      <button v-if="!formMediaOpen" class="action-button create-button" @click="openMediaForm()">
        <i class="fas fa-plus-circle"></i> Tambah Media Baru
      </button>
    </div>

    <div v-if="formMediaOpen" class="form-card card">
      <MediaGaleriForm
        :is-editing="isEditingMedia"
        :initial-data="formMedia"
        @close-form="closeMediaForm"
        @save-media="handleSaveMedia"
        @update-media="handleUpdateMedia" />
    </div>
    
    <div v-else class="table-container card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Konten</th>
              <th>Tipe Konten</th>
              <th>Jenis File</th>
              <th>Deskripsi</th>
              <th>Urutan</th>
              <th>Pratinjau</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="mediaGaleriList.length === 0">
              <td colspan="8" class="no-data-found">
                Tidak ada data media galeri yang tersedia.
              </td>
            </tr>
            <tr v-for="media in mediaGaleriList" :key="media.id_media_galeri">
              <td>{{ media.id_media_galeri }}</td>
              <td>{{ media.id_konten || '-' }}</td>
              <td>{{ media.tipe_konten || '-' }}</td>
              <td>{{ media.jenis_file }}</td>
              <td>{{ media.deskripsi_file || '-' }}</td>
              <td>{{ media.urutan_tampil }}</td>
              <td>
                <div class="media-preview-thumb">
                  <img v-if="media.jenis_file === 'gambar'" :src="getMediaUrl(media.path_file)" alt="Preview" class="media-thumbnail-small">
                  <video v-else-if="media.jenis_file === 'video'" :src="getMediaUrl(media.path_file)" controls class="media-thumbnail-small"></video>
                </div>
              </td>
              <td class="actions">
                <button class="action-button edit-button" @click="openMediaForm(media)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" @click="handleDeleteMedia(media.id_media_galeri)" title="Hapus">
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
import MediaGaleriForm from './MediaGaleriForm.vue';

const mediaGaleriList = ref([]);
const formMediaOpen = ref(false);
const isEditingMedia = ref(false);
const formMedia = ref(null);

const fetchMediaGaleriData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/media-galeri');
    mediaGaleriList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data media galeri:', err);
    alert('Gagal memuat data media galeri.');
  }
};

const openMediaForm = (media = null) => {
  isEditingMedia.value = !!media;
  if (media) {
    formMedia.value = { ...media };
  } else {
    formMedia.value = {
      id_media_galeri: null,
      id_konten: null,
      tipe_konten: '',
      path_file: null,
      deskripsi_file: '',
      jenis_file: 'gambar',
      urutan_tampil: 0,
    };
  }
  formMediaOpen.value = true;
};

const closeMediaForm = () => {
  formMediaOpen.value = false;
  fetchMediaGaleriData();
};

const handleSaveMedia = async (formData) => {
  try {
    const token = localStorage.getItem('access_token');
    await axios.post('http://localhost:5000/api/media-galeri', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    alert('Media galeri berhasil ditambahkan!');
    closeMediaForm();
  } catch (err) {
    console.error('Gagal menyimpan media galeri:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan media galeri.');
  }
};

const handleUpdateMedia = async (formData, mediaId) => {
  try {
    const token = localStorage.getItem('access_token');
    await axios.put(`http://localhost:5000/api/media-galeri/${mediaId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    alert('Media galeri berhasil diperbarui!');
    closeMediaForm();
  } catch (err) {
    console.error('Gagal memperbarui media galeri:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal memperbarui media galeri.');
  }
};

const handleDeleteMedia = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus media ini?')) {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:5000/api/media-galeri/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Media berhasil dihapus!');
      fetchMediaGaleriData();
    } catch (err) {
      console.error('Gagal menghapus media:', err.response?.data);
      alert(err.response?.data?.error || 'Gagal menghapus media.');
    }
  }
};

const getMediaUrl = (path) => {
    return `http://localhost:5000${path}`;
};

onMounted(() => {
  fetchMediaGaleriData();
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

.form-card.card {
  background-color: #ffffff;
  padding: 2rem;
  border: 1px solid #e0e6ed;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
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

.media-preview-thumb {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 8px;
  background-color: #e9ecef;
  border: 1px solid #dee2e6;
}

.media-thumbnail-small {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>