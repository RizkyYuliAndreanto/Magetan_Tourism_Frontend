<template>
  <div class="admin-dashboard">
    <AdminSidebar :is-open="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <div :class="['main-content', { 'sidebar-open': sidebarOpen }]">

      <header class="admin-header">
        <button class="mobile-menu-btn" @click="toggleSidebar">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h1 class="header-title">{{ pageTitle }}</h1>
        <div class="header-right">
          </div>
      </header>

      <main class="content-area">
        <div class="content-wrapper">
          <div class="header-container">
            <h2 class="page-title">Manajemen Media Galeri</h2>
            <p class="page-subtitle">Kelola semua file gambar dan video yang terhubung ke konten lain.</p>
          </div>

          <div class="tab-content">
            <div class="action-bar">
              <button v-if="!formMediaOpen" class="action-button create-button" @click="openMediaForm()">
                <i class="fas fa-plus-circle"></i> Tambah Media Baru
              </button>
            </div>

            <div v-if="formMediaOpen" class="form-card">
              <h3 class="form-title">{{ isEditingMedia ? 'Edit Media Galeri' : 'Tambah Media Galeri Baru' }}</h3>
              <form @submit.prevent="saveMedia">
                <div class="form-grid">
                  <div class="form-group">
                    <label for="tipe_konten">Tipe Konten</label>
                    <select id="tipe_konten" v-model="formMedia.tipe_konten" class="form-input">
                      <option value="">Tidak Terhubung (Media Galeri Bebas)</option>
                      <option value="berita">Berita</option>
                      <option value="destinasi">Destinasi</option>
                      <option value="event">Event</option>
                      <option value="umkm">UMKM</option>
                      <option value="sejarah">Sejarah</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="id_konten">ID Konten</label>
                    <input type="number" id="id_konten" v-model="formMedia.id_konten" class="form-input" :disabled="formMedia.tipe_konten === ''">
                  </div>
                  <div class="form-group">
                    <label for="urutan_tampil">Urutan Tampil</label>
                    <input type="number" id="urutan_tampil" v-model="formMedia.urutan_tampil" class="form-input">
                  </div>
                  <div class="form-group">
                    <label for="deskripsi_file">Deskripsi File</label>
                    <textarea id="deskripsi_file" v-model="formMedia.deskripsi_file" class="form-input" rows="3"></textarea>
                  </div>

                  <div v-if="!isEditingMedia" class="form-group span-2">
                    <label for="media_galeri_files">File Media (Maks. 10 File)</label>
                    <input type="file" id="media_galeri_files" @change="handleFileUpload" class="form-input-file" multiple required>
                  </div>

                  <div v-else class="form-group span-2">
                    <label for="media_galeri_file_edit">Ganti File Media</label>
                    <input type="file" id="media_galeri_file_edit" @change="handleFileUpload" class="form-input-file">
                    <p class="mt-2 text-sm text-gray-500">File saat ini: {{ formMedia.path_file.split('/').pop() }}</p>
                  </div>

                  <div v-if="mediaPreviews.length > 0" class="form-group span-2">
                      <p class="text-sm font-semibold text-gray-700 mb-2">Pratinjau File:</p>
                      <div class="media-gallery-grid">
                          <div v-for="(preview, index) in mediaPreviews" :key="index" class="media-card">
                              <img v-if="preview.type.startsWith('image')" :src="preview.url" class="media-thumbnail" :alt="'Preview ' + index">
                              <video v-else-if="preview.type.startsWith('video')" :src="preview.url" class="media-thumbnail" controls></video>
                              <p class="media-description text-xs">{{ preview.file.name }}</p>
                              <button class="delete-media-button" @click="removePreview(index)">
                                  <i class="fas fa-times"></i>
                              </button>
                          </div>
                      </div>
                  </div>
                </div>
                <div class="form-actions">
                  <button type="submit" class="action-button save-button">
                    <i class="fas fa-save"></i> Simpan
                  </button>
                  <button type="button" class="action-button cancel-button" @click="closeMediaForm">
                    <i class="fas fa-times"></i> Batal
                  </button>
                </div>
              </form>
            </div>

            <div v-else class="table-container">
              <div class="table-responsive card">
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
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar.vue';

const sidebarOpen = ref(false);
const mediaGaleriList = ref([]);
const formMediaOpen = ref(false);
const isEditingMedia = ref(false);

const formMedia = ref({
  id_media_galeri: null,
  id_konten: null,
  tipe_konten: '', // Mengubah default menjadi string kosong agar bisa menjadi "media galeri bebas"
  path_file: null,
  deskripsi_file: '',
  jenis_file: 'gambar', // Default jenis_file akan di-overwrite di backend
  urutan_tampil: 0,
});

const selectedFiles = ref([]);
const mediaPreviews = ref([]);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const pageTitle = computed(() => {
  return 'Media Galeri';
});

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
  selectedFiles.value = [];
  mediaPreviews.value = [];

  if (media) {
    isEditingMedia.value = true;
    formMedia.value = { ...media };
  } else {
    isEditingMedia.value = false;
    formMedia.value = {
      id_media_galeri: null,
      id_konten: null,
      tipe_konten: '', // Menggunakan string kosong untuk default
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
};

const handleFileUpload = (event) => {
  const files = event.target.files;
  if (files) {
    const fileArray = Array.from(files).slice(0, 10);
    selectedFiles.value = fileArray;
    mediaPreviews.value = fileArray.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
      file: file
    }));
  }
};

const removePreview = (index) => {
  mediaPreviews.value.splice(index, 1);
  selectedFiles.value.splice(index, 1);
};

const getMediaUrl = (path) => {
    return `http://localhost:5000${path}`;
};

const saveMedia = async () => {
  const formData = new FormData();

  if (isEditingMedia.value) {
    // Mode Edit: Hanya update data (path_file bisa di-overwrite jika file baru diunggah)
    if (selectedFiles.value.length > 0) {
      formData.append('media_galeri_file', selectedFiles.value[0]);
    }
    // Menambahkan data form
    formData.append('id_konten', formMedia.value.id_konten || null);
    formData.append('tipe_konten', formMedia.value.tipe_konten || null);
    formData.append('deskripsi_file', formMedia.value.deskripsi_file);
    formData.append('urutan_tampil', formMedia.value.urutan_tampil);

  } else {
    // Mode Tambah: Unggah multiple file
    if (selectedFiles.value.length === 0) {
      alert('Pilih setidaknya satu file untuk diunggah.');
      return;
    }
    // Menambahkan data form
    formData.append('id_konten', formMedia.value.id_konten || null);
    formData.append('tipe_konten', formMedia.value.tipe_konten || null);
    formData.append('deskripsi_file', formMedia.value.deskripsi_file);
    formData.append('urutan_tampil', formMedia.value.urutan_tampil);
    
    // Append semua file ke form data
    selectedFiles.value.forEach((file) => {
      formData.append('media_galeri_files', file);
    });
  }

  try {
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

    if (isEditingMedia.value) {
      await axios.put(`http://localhost:5000/api/media-galeri/${formMedia.value.id_media_galeri}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...headers
        }
      });
      alert('Media galeri berhasil diperbarui!');
    } else {
      await axios.post('http://localhost:5000/api/media-galeri', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...headers
        }
      });
      alert('Media galeri berhasil ditambahkan!');
    }
    closeMediaForm();
    fetchMediaGaleriData();
  } catch (err) {
    console.error('Gagal menyimpan media galeri:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan media galeri.');
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

onMounted(() => {
  fetchMediaGaleriData();
});
</script>

<style scoped>
:root {
  --primary-blue: #007bff;
  --secondary-blue: #17a2b8;
  --background-light: #e9ecef;
  --background-dark: #ffffff;
  --text-color-dark: #343a40;
  --text-color-light: #ffffff;
  --text-color-muted: #6c757d;
  --border-color: #dee2e6;
  --shadow-light: rgba(0, 0, 0, 0.08);
  --shadow-medium: rgba(0, 0, 0, 0.15);
  --green-accent: #28a745;
  --red-accent: #dc3545;
  --yellow-accent: #ffc107;
  --border-radius: 12px;
  --box-shadow: 0 5px 15px var(--shadow-light);
  --transition: all 0.3s ease;
  --sidebar-width: 260px;
  --navbar-height: 70px;
}

/* Base Layout */
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background-color: var(--background-light);
}

.main-content {
  flex-grow: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: var(--navbar-height);
}

.admin-header {
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  z-index: 900;
  height: var(--navbar-height);
  background-color: var(--background-dark);
  padding: 0 30px;
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 4px var(--shadow-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: left 0.3s ease;
}

.main-content.sidebar-open .admin-header {
  left: var(--sidebar-width);
}
.main-content:not(.sidebar-open) .admin-header {
  left: 0;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color-dark);
  padding: 10px;
}

.mobile-menu-btn svg {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color-dark);
  margin: 0;
}

.content-area {
  flex-grow: 1;
  padding: 30px;
  background-color: var(--background-light);
}

.content-wrapper {
  padding: 0;
}

.header-container {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color-dark);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-color-muted);
  margin: 0;
}

/* Form and Table Styling */
.tab-content {
  background-color: var(--background-dark);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.action-button {
  padding: 0.6rem 1.2rem;
  border-radius: var(--border-radius);
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-color-light);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.create-button {
  background-color: var(--green-accent);
}

.create-button:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

.form-card {
  background-color: var(--background-dark);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-top: 1rem;
  border: 1px solid var(--border-color);
}

.form-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-color-dark);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.2rem;
}

.form-group.span-2 {
  grid-column: span 2;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-color-dark);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: #f8f9fa;
  color: var(--text-color-dark);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.form-input-file {
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: #f8f9fa;
  color: var(--text-color-dark);
  font-size: 0.95rem;
}

textarea.form-input {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.save-button {
  background-color: var(--primary-blue);
}

.save-button:hover {
  background-color: #0069d9;
  transform: translateY(-2px);
}

.cancel-button {
  background-color: var(--text-color-muted);
}

.cancel-button:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}

.table-responsive.card {
  padding: 0;
  border: none;
  box-shadow: var(--box-shadow);
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
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
  background-color: var(--background-light);
  color: var(--text-color-dark);
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
  background-color: var(--yellow-accent);
  color: white;
}

.actions .edit-button:hover {
  background-color: #e0a800;
}

.actions .delete-button {
  background-color: var(--red-accent);
}

.actions .delete-button:hover {
  background-color: #c82333;
}

.media-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.media-card {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.media-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.media-card-current {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  width: 100%;
}

.media-thumbnail {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.media-thumbnail-small {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.delete-media-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(220, 53, 69, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.delete-media-button:hover {
  opacity: 1;
  background-color: var(--red-accent);
}

.media-preview-thumb {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 4px;
}

.text-gray-500 {
  color: #6c757d;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.font-semibold {
  font-weight: 600;
}
.text-sm {
  font-size: 0.875rem;
}
.text-xs {
  font-size: 0.75rem;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .content-wrapper {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.span-2 {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .main-content.sidebar-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
  }

  .admin-header {
    left: 0;
  }

  .mobile-menu-btn {
    display: block;
  }

  .header-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 576px) {
  .page-title {
    font-size: 1.5rem;
  }

  .form-title {
    font-size: 1.2rem;
  }

  .action-button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem;
  }

  .media-gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>