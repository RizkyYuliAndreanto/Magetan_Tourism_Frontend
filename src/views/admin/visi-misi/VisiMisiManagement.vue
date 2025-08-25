<template>
  <div>
    <div class="action-bar">
      <button v-if="!visiMisiData" class="action-button create-button" @click="openForm()">
        <i class="fas fa-plus-circle"></i> Tambah Visi Misi
      </button>
      <button v-else class="action-button edit-button" @click="openForm(visiMisiData)">
        <i class="fas fa-edit"></i> Edit Visi Misi
      </button>
    </div>

    <div v-if="formOpen" class="form-card card">
      <VisiMisiForm
        :is-editing="!!visiMisiData"
        :initial-data="formVisiMisi"
        @close-form="closeForm"
        @save-visi-misi="handleSave"
        @update-visi-misi="handleUpdate"
      />
    </div>

    <div v-else-if="visiMisiData" class="preview-container card">
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
    
    <div v-else class="no-data-card card">
      <div class="empty-state">
        <p>Belum ada data Visi Misi. Silakan tambahkan satu.</p>
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
const formOpen = ref(false);

const fetchVisiMisiData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/visi-misi');
    if (response.data && response.data.id_visi_misi) {
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

const openForm = (data = null) => {
  formVisiMisi.value = data ? { ...data, visi_misi_file: null } : { id_visi_misi: null, visi_misi_file: null, deskripsi: null };
  formOpen.value = true;
};

const closeForm = () => {
  formOpen.value = false;
  fetchVisiMisiData(); // Refresh data setelah form ditutup
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
    closeForm();
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
    closeForm();
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
.edit-button {
  background-color: #ffc107;
}
.edit-button:hover {
  background-color: #e0a800;
  box-shadow: 0 6px 16px rgba(255, 193, 7, 0.2);
}

.form-card.card,
.preview-container.card,
.no-data-card.card {
  padding: 2rem;
  border: 1px solid #e0e6ed;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

.form-title, .preview-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.preview-section {
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}
.preview-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.preview-subtitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.5rem;
}
.preview-content p {
  color: #495057;
  line-height: 1.6;
  margin: 0;
}
.file-preview-area {
  margin-top: 1rem;
}
.file-thumbnail {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #e9ecef;
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
  color: #dc3545;
}

.no-data-card {
  text-align: center;
  padding: 3rem;
}

.empty-state p {
  color: #6c757d;
  font-style: italic;
}
</style>