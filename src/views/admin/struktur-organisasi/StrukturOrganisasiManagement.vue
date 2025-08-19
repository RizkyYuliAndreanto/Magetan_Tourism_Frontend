<template>
  <div>
    <div class="action-bar">
      <button v-if="!strukturOrganisasiData" class="action-button create-button" @click="openForm()">
        <i class="fas fa-plus-circle"></i> Tambah Struktur Organisasi
      </button>
    </div>

    <div class="form-card">
      <h3 class="form-title">{{ strukturOrganisasiData ? 'Edit Struktur Organisasi' : 'Tambah Struktur Organisasi Baru' }}</h3>
      <StrukturOrganisasiForm
        :is-editing="!!strukturOrganisasiData"
        :initial-data="formStrukturOrganisasi"
        @close-form="closeForm"
        @save-struktur="handleSave"
        @update-struktur="handleUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import StrukturOrganisasiForm from './StrukturOrganisasiForm.vue';

const strukturOrganisasiData = ref(null);
const formStrukturOrganisasi = ref({});

const fetchStrukturOrganisasiData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/struktur-organisasi');
    if (response.data) {
      strukturOrganisasiData.value = response.data;
      formStrukturOrganisasi.value = { ...response.data, gambar_struktur_organisasi: null };
    } else {
      strukturOrganisasiData.value = null;
      formStrukturOrganisasi.value = { id_struktur_organisasi: null, judul_struktur: 'Struktur Organisasi', deskripsi_struktur: null, gambar_struktur_organisasi: null };
    }
  } catch (err) {
    console.error('Gagal memuat data Struktur Organisasi:', err);
    strukturOrganisasiData.value = null;
    alert('Gagal memuat data Struktur Organisasi.');
  }
};

const openForm = () => {
  formStrukturOrganisasi.value = { id_struktur_organisasi: null, judul_struktur: 'Struktur Organisasi', deskripsi_struktur: null, gambar_struktur_organisasi: null };
};

const closeForm = () => {
  fetchStrukturOrganisasiData();
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
    fetchStrukturOrganisasiData();
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
    fetchStrukturOrganisasiData();
  } catch (err) {
    console.error('Gagal memperbarui Struktur Organisasi:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal memperbarui Struktur Organisasi.');
  }
};

onMounted(() => {
  fetchStrukturOrganisasiData();
});
</script>

<style scoped>
/* Gaya CSS untuk form Struktur Organisasi dan tombol aksi */
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
.form-card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;
  border: 1px solid #dee2e6;
}
.form-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #343a40;
  margin: 0;
}
</style>