<template>
  <div>
    <div class="action-bar">
      <button v-if="!formBeritaOpen" class="action-button create-button" @click="openBeritaForm()">
        <i class="fas fa-plus-circle"></i> Tambah Berita Baru
      </button>
    </div>

    <div v-if="formBeritaOpen">
      <NewsForm
        :is-editing="isEditingBerita"
        :initial-data="formBerita"
        :kategori-list="kategoriList"
        :gallery-list="editingBeritaGallery"
        @close-form="closeBeritaForm"
        @save-berita="handleSaveBerita"
        @update-berita="handleUpdateBerita"
      />
    </div>

    <div v-else class="table-container">
      <div class="table-responsive card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Admin</th>
              <th>Tanggal Publikasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="berita in beritaList" :key="berita.id_berita">
              <td>{{ berita.id_berita }}</td>
              <td>{{ berita.judul }}</td>
              <td><span class="category-badge">{{ berita.kategoriBerita.nama_kategori }}</span></td>
              <td>{{ berita.adminPembuat.username }}</td>
              <td>{{ formatDate(berita.tanggal_publikasi) }}</td>
              <td class="actions">
                <button class="action-button edit-button" @click="openBeritaForm(berita)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" @click="handleDeleteBerita(berita.id_berita)" title="Hapus">
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
import NewsForm from './NewsForm.vue';

const beritaList = ref([]);
const kategoriList = ref([]);
const formBeritaOpen = ref(false);
const isEditingBerita = ref(false);
const formBerita = ref(null);
const editingBeritaGallery = ref([]);

const fetchBeritaData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/berita');
    beritaList.value = response.data.data || response.data;
  } catch (err) {
    console.error('Gagal memuat data berita:', err);
  }
};

const fetchKategoriData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/kategori-berita');
    kategoriList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data kategori berita:', err);
  }
};

const openBeritaForm = async (berita = null) => {
  isEditingBerita.value = !!berita;
  if (berita) {
    try {
      const response = await axios.get(`http://localhost:5000/api/berita/${berita.id_berita}`);
      const fullBeritaData = response.data;
      formBerita.value = {
        ...fullBeritaData,
        tanggal_publikasi: new Date(fullBeritaData.tanggal_publikasi).toISOString().slice(0, 16),
        preview_gambar_hero: fullBeritaData.gambar_hero_berita ? `http://localhost:5000${fullBeritaData.gambar_hero_berita}` : null,
        gambar_hero_berita: null
      };
      editingBeritaGallery.value = fullBeritaData.galeriBerita;
    } catch (error) {
      console.error('Gagal memuat detail berita:', error);
      alert('Gagal memuat detail berita untuk diedit.');
      return;
    }
  } else {
    formBerita.value = {
      id_berita: null, judul: '', id_kategori: '', teras_berita: '', isi_berita: '', penutup_berita: '',
      gambar_hero_berita: null, preview_gambar_hero: null, koordinat_lokasi: '', zoom_level_peta: 13, tanggal_publikasi: new Date().toISOString().slice(0, 16),
    };
    editingBeritaGallery.value = [];
  }
  formBeritaOpen.value = true;
};

const closeBeritaForm = () => {
  formBeritaOpen.value = false;
  formBerita.value = null;
  editingBeritaGallery.value = [];
  isEditingBerita.value = false;
};

const handleSaveBerita = async (formData, galleryFiles) => {
  try {
    const token = localStorage.getItem('access_token');
    const beritaResponse = await axios.post('http://localhost:5000/api/berita', formData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
    });
    const id_berita = beritaResponse.data.berita.id_berita;
    
    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append('id_konten', id_berita);
      galleryFormData.append('tipe_konten', 'berita');
      galleryFiles.forEach((galleryItem) => {
        galleryFormData.append('media_galeri_files', galleryItem.file);
        galleryFormData.append('deskripsi_file', galleryItem.deskripsi || '');
        galleryFormData.append('jenis_file', galleryItem.jenis_file);
        galleryFormData.append('urutan_tampil', galleryItem.urutan);
      });
      await axios.post('http://localhost:5000/api/media-galeri', galleryFormData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
    }
    alert('Berita dan galeri berhasil ditambahkan!');
    closeBeritaForm();
    fetchBeritaData();
  } catch (err) {
    console.error('Gagal menyimpan berita:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan berita. Periksa kembali input Anda.');
  }
};

const handleUpdateBerita = async (formData, galleryFiles, deletedGalleryIds) => {
  try {
    const token = localStorage.getItem('access_token');
    const id = formData.get('id_berita');
    
    await axios.put(`http://localhost:5000/api/berita/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
    });
    
    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append('id_konten', id);
      galleryFormData.append('tipe_konten', 'berita');
      galleryFiles.forEach((galleryItem) => {
        galleryFormData.append('media_galeri_files', galleryItem.file);
        galleryFormData.append('deskripsi_file', galleryItem.deskripsi || '');
        galleryFormData.append('jenis_file', galleryItem.jenis_file);
        galleryFormData.append('urutan_tampil', galleryItem.urutan);
      });
      await axios.post('http://localhost:5000/api/media-galeri', galleryFormData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
    }
    
    if (deletedGalleryIds && deletedGalleryIds.length > 0) {
      await Promise.all(deletedGalleryIds.map(async (mediaId) => {
        await axios.delete(`http://localhost:5000/api/media-galeri/${mediaId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }));
    }
    alert('Berita berhasil diperbarui!');
    closeBeritaForm();
    fetchBeritaData();
  } catch (err) {
    console.error('Gagal memperbarui berita:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal memperbarui berita.');
  }
};

const handleDeleteBerita = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:5000/api/berita/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Berita berhasil dihapus!');
      fetchBeritaData();
    } catch (err) {
      console.error('Gagal menghapus berita:', err.response?.data);
      alert(err.response?.data?.error || 'Gagal menghapus berita.');
    }
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

onMounted(() => {
  fetchBeritaData();
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
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.create-button {
  background-color: #2563eb;
}

.create-button:hover {
  background-color: #3b82f6;
}

.table-responsive.card {
  padding: 0;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background-color: #f8fafc;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover {
  background-color: rgba(59, 130, 246, 0.05);
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
}

.actions .edit-button {
  background-color: #f59e0b;
  color: white;
}

.actions .edit-button:hover {
  background-color: #eab308;
}

.actions .delete-button {
  background-color: #ef4444;
}

.actions .delete-button:hover {
  background-color: #dc2626;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  background-color: #2563eb;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}
</style>