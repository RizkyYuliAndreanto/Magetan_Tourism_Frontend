<template>
  <div>
    <div class="action-bar">
      <button v-if="!visiMisiData" class="action-button create-button" @click="openForm()">
        <i class="fas fa-plus-circle"></i> Tambah Visi Misi
      </button>
    </div>

    <div class="form-card">
      <h3 class="form-title">{{ visiMisiData ? 'Edit Visi Misi' : 'Tambah Visi Misi Baru' }}</h3>
      <VisiMisiForm
        :is-editing="!!visiMisiData"
        :initial-data="formVisiMisi"
        @close-form="closeForm"
        @save-visi-misi="handleSave"
        @update-visi-misi="handleUpdate"
      />
    </div>

    <div v-if="visiMisiData" class="preview-container">
      <h3 class="preview-title">Pratinjau Visi Misi</h3>
      <div class="preview-content">
        <div v-if="visiMisiData.deskripsi" class="preview-section">
          <h4 class="preview-subtitle">Deskripsi</h4>
          <p>{{ visiMisiData.deskripsi }}</p>
        </div>
        <div v-if="visiMisiData.visi_misi_file_path" class="preview-section">
          <h4 class="preview-subtitle">File Visi Misi</h4>
          <div class="file-preview-area">
            <img v-if="visiMisiData.tipe_file_visi_misi === 'gambar'" :src="getFilePath(visiMisiData.visi_misi_file_path)" alt="Visi Misi File" class="file-thumbnail" />
            <a v-else-if="visiMisiData.tipe_file_visi_misi === 'pdf'" :href="getFilePath(visiMisiData.visi_misi_file_path)" target="_blank" class="pdf-link">
              <i class="fas fa-file-pdf pdf-icon"></i>
              <span>Lihat PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import VisiMisiForm from './VisiMisiForm.vue';

const visiMisiData = ref(null);
const formVisiMisi = ref({});

const fetchVisiMisiData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/visi-misi');
    if (response.data) {
      visiMisiData.value = response.data;
      formVisiMisi.value = { ...response.data, visi_misi_file: null };
    } else {
      visiMisiData.value = null;
      formVisiMisi.value = { id_visi_misi: null, visi_misi_file: null, deskripsi: null };
    }
  } catch (err) {
    console.error('Gagal memuat data Visi Misi:', err);
    visiMisiData.value = null;
  }
};

const openForm = () => {
  formVisiMisi.value = { id_visi_misi: null, visi_misi_file: null, deskripsi: null };
};

const closeForm = () => {
  fetchVisiMisiData();
};

const handleSave = async (formData) => {
  try {
    const token = localStorage.getItem('access_token');
    await axios.post('http://localhost:5000/api/visi-misi', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    alert('Visi Misi berhasil ditambahkan!');
    fetchVisiMisiData();
  } catch (err) {
    console.error('Gagal menyimpan Visi Misi:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan Visi Misi.');
  }
};

const handleUpdate = async (id, formData) => {
  try {
    const token = localStorage.getItem('access_token');
    await axios.put(`http://localhost:5000/api/visi-misi/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    alert('Visi Misi berhasil diperbarui!');
    fetchVisiMisiData();
  } catch (err) {
    console.error('Gagal memperbarui Visi Misi:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal memperbarui Visi Misi.');
  }
};

const getFilePath = (path) => {
  return `http://localhost:5000${path}`;
};

onMounted(() => {
  fetchVisiMisiData();
});
</script>

<style scoped>
/* Gaya CSS untuk pratinjau */
.preview-container {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-top: 2rem;
  border: 1px solid #dee2e6;
}
.preview-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
}
.preview-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.preview-section {
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}
.preview-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.preview-subtitle {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #343a40;
}
.preview-section p {
  color: #6c757d;
  line-height: 1.6;
}
.file-preview-area {
  margin-top: 1rem;
}
.file-thumbnail {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.pdf-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}
.pdf-link:hover {
  text-decoration: underline;
}
.pdf-icon {
  font-size: 2rem;
  color: #dc3545; /* Warna ikon PDF */
}
</style>