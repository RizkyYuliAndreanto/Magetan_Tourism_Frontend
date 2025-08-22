<template>
  <div>
    <div class="action-bar">
      <button v-if="!strukturOrganisasiData" class="action-button create-button" @click="openForm()">
        <i class="fas fa-plus-circle"></i> Tambah Struktur Organisasi
      </button>
      <button v-else class="action-button edit-button" @click="openForm(strukturOrganisasiData)">
        <i class="fas fa-edit"></i> Edit Struktur Organisasi
      </button>
    </div>

    <div v-if="formOpen" class="form-card card">
      <StrukturOrganisasiForm
        :is-editing="!!strukturOrganisasiData"
        :initial-data="formStrukturOrganisasi"
        @close-form="closeForm"
        @save-struktur="handleSave"
        @update-struktur="handleUpdate"
      />
    </div>

    <div v-else-if="strukturOrganisasiData" class="preview-container card">
      <h3 class="preview-title">Pratinjau Struktur Organisasi</h3>
      <div class="preview-content">
        <div class="preview-section">
          <h4 class="preview-subtitle">Judul</h4>
          <p>{{ strukturOrganisasiData.judul_struktur }}</p>
        </div>
        <div class="preview-section">
          <h4 class="preview-subtitle">Deskripsi</h4>
          <p>{{ strukturOrganisasiData.deskripsi_struktur || '-' }}</p>
        </div>
        <div class="preview-section" v-if="strukturOrganisasiData.gambar_struktur_path">
          <h4 class="preview-subtitle">Gambar Struktur</h4>
          <div class="file-preview-area">
            <img :src="getFilePath(strukturOrganisasiData.gambar_struktur_path)" alt="Struktur Organisasi" class="file-thumbnail" />
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-data-card card">
      <div class="empty-state">
        <p>Belum ada data Struktur Organisasi. Silakan tambahkan satu.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import StrukturOrganisasiForm from './StrukturOrganisasiForm.vue';

const strukturOrganisasiData = ref(null);
const formStrukturOrganisasi = ref({});
const formOpen = ref(false);

const fetchStrukturOrganisasiData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/struktur-organisasi');
    if (response.data && response.data.id_struktur_organisasi) {
      strukturOrganisasiData.value = response.data;
      formStrukturOrganisasi.value = { ...response.data, gambar_struktur_organisasi: null };
    } else {
      strukturOrganisasiData.value = null;
      formStrukturOrganisasi.value = { id_struktur_organisasi: null, judul_struktur: 'Struktur Organisasi', deskripsi_struktur: null, gambar_struktur_organisasi: null };
    }
  } catch (err) {
    console.error('Gagal memuat data Struktur Organisasi:', err);
    strukturOrganisasiData.value = null;
  }
};

const openForm = (data = null) => {
  formStrukturOrganisasi.value = data ? { ...data, gambar_struktur_organisasi: null } : { id_struktur_organisasi: null, judul_struktur: 'Struktur Organisasi', deskripsi_struktur: null, gambar_struktur_organisasi: null };
  formOpen.value = true;
};

const closeForm = () => {
  formOpen.value = false;
  fetchStrukturOrganisasiData(); // Refresh data setelah form ditutup
};

const handleSave = async (formData) => {
  try {
    const token = localStorage.getItem('access_token');
    await axios.post('http://localhost:5000/api/struktur-organisasi', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    alert('Struktur Organisasi berhasil ditambahkan!');
    closeForm();
  } catch (err) {
    console.error('Gagal menyimpan Struktur Organisasi:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan Struktur Organisasi.');
  }
};

const handleUpdate = async (id, formData) => {
  try {
    const token = localStorage.getItem('access_token');
    await axios.put(`http://localhost:5000/api/struktur-organisasi/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
    alert('Struktur Organisasi berhasil diperbarui!');
    closeForm();
  } catch (err) {
    console.error('Gagal memperbarui Struktur Organisasi:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal memperbarui Struktur Organisasi.');
  }
};

const getFilePath = (path) => {
  return `http://localhost:5000${path}`;
};

onMounted(() => {
  fetchStrukturOrganisasiData();
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
.no-data-card {
  text-align: center;
  padding: 3rem;
}

.empty-state p {
  color: #6c757d;
  font-style: italic;
}
</style>