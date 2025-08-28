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

    <div v-else class="table-container card">
      <div class="table-responsive">
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
            <tr v-if="beritaList.length === 0">
              <td colspan="6" class="no-data-found">
                Tidak ada berita yang tersedia.
              </td>
            </tr>
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
                <button class="action-button delete-button" @click="showDeleteConfirm(berita.id_berita)" title="Hapus">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BasePopUp
      v-if="showPopUp"
      :key="`${popUpStatus}-${popUpAction}`"
      :status="popUpStatus"
      :action="popUpAction"
      :entity-name="popUpEntity"
      :error-message="popUpMessage"
      @close="closePopUp"
      @confirmed="handleDeleteConfirmed"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import NewsForm from './NewsForm.vue';
import BasePopUp from '../../../components/pop-up/BasePopUp.vue';

const beritaList = ref([]);
const kategoriList = ref([]);
const formBeritaOpen = ref(false);
const isEditingBerita = ref(false);
const formBerita = ref(null);
const editingBeritaGallery = ref([]);

// State untuk pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Berita");
const popUpMessage = ref("");
const beritaToDeleteId = ref(null);

// Fungsi yang memicu pop-up konfirmasi
const showDeleteConfirm = (id) => {
  beritaToDeleteId.value = id;
  popUpStatus.value = "confirm";
  popUpAction.value = "confirmDelete";
  showPopUp.value = true;
};

// Fungsi yang dipanggil setelah konfirmasi hapus dari pop-up
const handleDeleteConfirmed = async () => {
  // Tutup popup konfirmasi agar komponen unmount
  closePopUp();
  await nextTick();

  try {
    const token = localStorage.getItem('access_token');
    await axios.delete(`http://localhost:5000/api/berita/${beritaToDeleteId.value}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    openPopUp("success", "delete");
    fetchBeritaData();
  } catch (err) {
    console.error('Gagal menghapus berita:', err.response?.data);
    openPopUp("error", "delete", err.response?.data?.error || "Gagal menghapus berita.");
  } finally {
    beritaToDeleteId.value = null;
  }
};

// Fungsi utilitas untuk mengontrol pop-up
const openPopUp = (status, action, message = "") => {
  popUpStatus.value = status;
  popUpAction.value = action;
  popUpMessage.value = message;

  if (showPopUp.value) {
    showPopUp.value = false;
    requestAnimationFrame(() => {
      showPopUp.value = true;
    });
  } else {
    showPopUp.value = true;
  }
};

const closePopUp = () => {
  showPopUp.value = false;
};

const fetchBeritaData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/berita');
    beritaList.value = response.data.data || response.data;
  } catch (err) {
    console.error('Gagal memuat data berita:', err);
    openPopUp("error", "fetch", "Gagal memuat data berita.");
  }
};

const fetchKategoriData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/kategori-berita');
    kategoriList.value = response.data;
  } catch (err) {
    console.error('Gagal memuat data kategori berita:', err);
    openPopUp("error", "fetch", "Gagal memuat data kategori berita.");
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
      openPopUp("error", "fetch", "Gagal memuat detail berita untuk diedit.");
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
  fetchBeritaData();
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
    openPopUp("success", "create");
    closeBeritaForm();
  } catch (err) {
    console.error('Gagal menyimpan berita:', err.response?.data);
    openPopUp("error", "create", err.response?.data?.error || "Gagal menyimpan berita. Periksa kembali input Anda.");
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
    openPopUp("success", "update");
    closeBeritaForm();
  } catch (err) {
    console.error('Gagal memperbarui berita:', err.response?.data);
    openPopUp("error", "update", err.response?.data?.error || "Gagal memperbarui berita.");
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
/* Anda dapat mempertahankan gaya CSS yang sudah ada */
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
.category-badge {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  background-color: #28a745;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}
</style>