<template>
  <div>
    <div class="action-bar">
      <button v-if="!formEventOpen" class="action-button create-button" @click="openEventForm()">
        <i class="fas fa-plus-circle"></i> Tambah Event Baru
      </button>
    </div>

    <div v-if="formEventOpen" class="table-container card">
      <EventForm
        :is-editing="isEditingEvent"
        :initial-data="formEvent"
        :gallery-list="editingEventGallery"
        @close-form="closeEventForm"
        @save-event="handleSaveEvent"
        @update-event="handleUpdateEvent"
      />
    </div>
    
    <div v-else class="table-container card">
      <div class="table-responsive">
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
            <tr v-if="eventList.length === 0">
              <td colspan="6" class="no-data-found">
                Tidak ada event yang tersedia.
              </td>
            </tr>
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
    eventList.value = response.data;
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
  fetchEventData();
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