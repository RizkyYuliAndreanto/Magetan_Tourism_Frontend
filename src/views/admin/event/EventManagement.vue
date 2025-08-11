<template>
  <div>
    <div class="action-bar">
      <button v-if="!formEventOpen" class="action-button create-button" @click="openEventForm()">
        <i class="fas fa-plus-circle"></i> Tambah Event Baru
      </button>
    </div>

    <div v-if="formEventOpen" class="form-card">
      <EventForm
        :is-editing="isEditingEvent"
        :initial-data="formEvent"
        :gallery-list="editingEventGallery"
        @close-form="closeEventForm"
        @save-event="handleSaveEvent"
        @update-event="handleUpdateEvent"
      />
    </div>
    
    <div v-else class="table-container">
      <div class="table-responsive card">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Event</th>
              <th>Lokasi</th>
              <th>Tanggal</th>
              <th>Admin</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in eventList" :key="event.id_event">
              <td>{{ event.id_event }}</td>
              <td>{{ event.nama_event }}</td>
              <td>{{ event.lokasi_event }}</td>
              <td>{{ formatDate(event.tanggal_mulai) }} - {{ formatDate(event.tanggal_selesai) }}</td>
              <td>{{ event.adminPembuat.username }}</td>
              <td class="actions">
                <button class="action-button edit-button" @click="openEventForm(event)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-button delete-button" @click="handleDeleteEvent(event.id_event)" title="Hapus">
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
import EventForm from './EventForm.vue';

const eventList = ref([]);
const formEventOpen = ref(false);
const isEditingEvent = ref(false);
const formEvent = ref(null);
const editingEventGallery = ref([]);

const fetchEventData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/event');
    eventList.value = response.data.data;
  } catch (err) {
    console.error('Gagal memuat data event:', err);
    alert('Gagal memuat data event.');
  }
};

const openEventForm = async (event = null) => {
  isEditingEvent.value = !!event;
  if (event) {
    try {
      const response = await axios.get(`http://localhost:5000/api/event/${event.id_event}`);
      const fullEventData = response.data;
      formEvent.value = { ...fullEventData };
      editingEventGallery.value = fullEventData.galeriEvent;
    } catch (error) {
      console.error('Gagal memuat detail event:', error);
      alert('Gagal memuat detail event untuk diedit.');
      return;
    }
  } else {
    formEvent.value = {
      id_event: null, nama_event: '', deskripsi_event: '', tanggal_mulai: '', tanggal_selesai: '',
      lokasi_event: '', koordinat_lokasi: '', brosur_event: null, gambar_event: null,
    };
    editingEventGallery.value = [];
  }
  formEventOpen.value = true;
};

const closeEventForm = () => {
  formEventOpen.value = false;
  formEvent.value = null;
  editingEventGallery.value = [];
  isEditingEvent.value = false;
};

const handleSaveEvent = async (formData, galleryFiles) => {
  try {
    const token = localStorage.getItem('access_token');
    
    const eventResponse = await axios.post('http://localhost:5000/api/event', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    const id_event = eventResponse.data.event.id_event;

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append('id_konten', id_event);
      galleryFormData.append('tipe_konten', 'event');
      
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
    
    alert('Event dan galeri berhasil ditambahkan!');
    closeEventForm();
    fetchEventData();
  } catch (err) {
    console.error('Gagal menyimpan event:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal menyimpan event.');
  }
};

const handleUpdateEvent = async (formData, galleryFiles, deletedGalleryIds) => {
  try {
    const token = localStorage.getItem('access_token');
    const id = formData.get('id_event');
    
    await axios.put(`http://localhost:5000/api/event/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append('id_konten', id);
      galleryFormData.append('tipe_konten', 'event');
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

    alert('Event berhasil diperbarui!');
    closeEventForm();
    fetchEventData();
  } catch (err) {
    console.error('Gagal memperbarui event:', err.response?.data);
    alert(err.response?.data?.error || 'Gagal memperbarui event.');
  }
};

const handleDeleteEvent = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus event ini?')) {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:5000/api/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Event berhasil dihapus!');
      fetchEventData();
    } catch (err) {
      console.error('Gagal menghapus event:', err.response?.data);
      alert(err.response?.data?.error || 'Gagal menghapus event.');
    }
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

onMounted(() => {
  fetchEventData();
});
</script>

<style scoped>
/* Gaya CSS untuk tabel event dan tombol aksi */
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
</style>