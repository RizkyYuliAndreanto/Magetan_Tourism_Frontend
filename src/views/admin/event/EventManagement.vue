<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h1 class="main-title">
          <i class="fas fa-calendar-alt"></i>
          Data Event & Kegiatan
        </h1>
        <p class="subtitle">
          Kelola event dan kegiatan wisata di Magetan termasuk festival,
          pameran, dan acara budaya untuk meningkatkan daya tarik wisata daerah.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formEventOpen"
          class="action-button add-button"
          @click="openEventForm()">
          <i class="fas fa-plus-circle"></i> Tambah Event Baru
        </button>
      </div>
    </div>

    <!-- Statistics Dashboard -->
    <div v-if="!formEventOpen" class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <div class="stat-content">
          <h3>{{ totalEvent }}</h3>
          <p>Total Event</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-calendar-plus"></i>
        </div>
        <div class="stat-content">
          <h3>{{ eventAktif }}</h3>
          <p>Event Aktif</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-calendar-check"></i>
        </div>
        <div class="stat-content">
          <h3>{{ bulanIniEvent }}</h3>
          <p>Event Bulan Ini</p>
        </div>
      </div>
    </div>

    <div v-if="formEventOpen" class="table-container card">
      <EventForm
        :is-editing="isEditingEvent"
        :initial-data="formEvent"
        :gallery-list="editingEventGallery"
        @close-form="closeEventForm"
        @save-event="handleSaveEvent"
        @update-event="handleUpdateEvent" />
    </div>

    <div v-else class="table-container card">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th><i class="fas fa-hashtag"></i>ID</th>
              <th><i class="fas fa-calendar-alt"></i>Nama Event</th>
              <th><i class="fas fa-map-marker-alt"></i>Lokasi</th>
              <th><i class="fas fa-clock"></i>Tanggal</th>
              <th><i class="fas fa-user-shield"></i>Admin</th>
              <th><i class="fas fa-cogs"></i>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="eventList.length === 0">
              <td colspan="6">
                <div class="empty-state">
                  <i class="fas fa-calendar-alt"></i>
                  <h3>Belum Ada Event</h3>
                  <p>
                    Mulai tambahkan event dan kegiatan wisata untuk menarik
                    lebih banyak pengunjung ke Magetan.
                  </p>
                  <button
                    class="action-button add-button"
                    @click="openEventForm()">
                    <i class="fas fa-plus-circle"></i> Tambah Event Pertama
                  </button>
                </div>
              </td>
            </tr>
            <tr v-for="event in eventList" :key="event.id_event">
              <td>{{ event.id_event }}</td>
              <td>{{ event.nama_event }}</td>
              <td>{{ event.lokasi_event }}</td>
              <td>
                {{ formatDate(event.tanggal_mulai) }} -
                {{ formatDate(event.tanggal_selesai) }}
              </td>
              <td>{{ event.adminPembuat.username }}</td>
              <td class="actions">
                <button
                  class="action-button edit-button"
                  @click="openEventForm(event)"
                  title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="action-button delete-button"
                  @click="showDeleteConfirm(event.id_event)"
                  title="Hapus">
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
      @confirmed="handleDeleteConfirmed" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import axios from "axios";
import EventForm from "./EventForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

// State pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Event");
const popUpMessage = ref("");
const eventToDeleteId = ref(null);

const eventList = ref([]);
const formEventOpen = ref(false);
const isEditingEvent = ref(false);
const formEvent = ref(null);
const editingEventGallery = ref([]);

// Computed properties untuk statistics
const totalEvent = computed(() => eventList.value.length);

const eventAktif = computed(() => {
  const currentDate = new Date();
  return eventList.value.filter((event) => {
    const endDate = new Date(event.tanggal_selesai);
    return endDate >= currentDate;
  }).length;
});

const bulanIniEvent = computed(() => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  return eventList.value.filter((event) => {
    const startDate = new Date(event.tanggal_mulai);
    return (
      startDate.getMonth() === currentMonth &&
      startDate.getFullYear() === currentYear
    );
  }).length;
});

// Menampilkan konfirmasi delete
const showDeleteConfirm = (id) => {
  eventToDeleteId.value = id;
  popUpStatus.value = "confirm";
  popUpAction.value = "confirmDelete";
  showPopUp.value = true;
};

// Fungsi openPopUp dengan remount agar timer reset
const openPopUp = (status, action, message = "") => {
  popUpStatus.value = status;
  popUpAction.value = action;
  popUpMessage.value = message;

  if (showPopUp.value) {
    // Jika popup masih tampil, matikan dulu lalu nyalakan lagi (reset timer)
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

// Handle klik "Ya, Hapus"
const handleDeleteConfirmed = async () => {
  const id = eventToDeleteId.value;
  eventToDeleteId.value = null;

  // Tutup popup konfirmasi agar komponen unmount, supaya timer popup hasil tidak ikut kepotong
  showPopUp.value = false;
  await nextTick();

  await handleDeleteEvent(id);
};

// Ambil data event
const fetchEventData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/event");
    eventList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data event:", err);
    openPopUp("error", "fetch", "Gagal memuat data event.");
  }
};

// Buka form event
const openEventForm = async (event = null) => {
  isEditingEvent.value = !!event;
  if (event) {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/event/${event.id_event}`
      );
      const fullEventData = response.data;
      formEvent.value = { ...fullEventData };
      editingEventGallery.value = fullEventData.galeriEvent;
    } catch (error) {
      console.error("Gagal memuat detail event:", error);
      openPopUp("error", "fetch", "Gagal memuat detail event untuk diedit.");
      return;
    }
  } else {
    formEvent.value = {
      id_event: null,
      nama_event: "",
      deskripsi_event: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      lokasi_event: "",
      koordinat_lokasi: "",
      brosur_event: null,
      gambar_event: null,
    };
    editingEventGallery.value = [];
  }
  formEventOpen.value = true;
  // Mencegah scroll pada body saat form terbuka
  document.body.style.overflow = "hidden";
};

// Tutup form event
const closeEventForm = () => {
  formEventOpen.value = false;
  formEvent.value = null;
  editingEventGallery.value = [];
  isEditingEvent.value = false;
  // Mengembalikan scroll pada body saat form ditutup
  document.body.style.overflow = "auto";
  fetchEventData();
};

// Simpan event baru
const handleSaveEvent = async (formData, galleryFiles) => {
  try {
    const token = localStorage.getItem("access_token");

    const eventResponse = await axios.post(
      "http://localhost:5000/api/event",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const id_event = eventResponse.data.event.id_event;

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append("id_konten", id_event);
      galleryFormData.append("tipe_konten", "event");

      galleryFiles.forEach((galleryItem) => {
        galleryFormData.append(`media_galeri_files`, galleryItem.file);
        galleryFormData.append("deskripsi_file", galleryItem.deskripsi || "");
        galleryFormData.append("jenis_file", galleryItem.jenis_file);
        galleryFormData.append("urutan_tampil", galleryItem.urutan);
      });
      await axios.post(
        "http://localhost:5000/api/media-galeri",
        galleryFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    openPopUp("success", "create");
    closeEventForm();
  } catch (err) {
    console.error("Gagal menyimpan event:", err.response?.data);
    openPopUp(
      "error",
      "create",
      err.response?.data?.error || "Gagal menyimpan event."
    );
  }
};

// Update event
const handleUpdateEvent = async (formData, galleryFiles, deletedGalleryIds) => {
  try {
    const token = localStorage.getItem("access_token");
    const id = formData.get("id_event");

    await axios.put(`http://localhost:5000/api/event/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append("id_konten", id);
      galleryFormData.append("tipe_konten", "event");
      galleryFiles.forEach((galleryItem) => {
        galleryFormData.append(`media_galeri_files`, galleryItem.file);
        galleryFormData.append("deskripsi_file", galleryItem.deskripsi || "");
        galleryFormData.append("jenis_file", galleryItem.jenis_file);
        galleryFormData.append("urutan_tampil", galleryItem.urutan);
      });
      await axios.post(
        "http://localhost:5000/api/media-galeri",
        galleryFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    if (deletedGalleryIds && deletedGalleryIds.length > 0) {
      await Promise.all(
        deletedGalleryIds.map(async (mediaId) => {
          await axios.delete(
            `http://localhost:5000/api/media-galeri/${mediaId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        })
      );
    }

    openPopUp("success", "update");
    closeEventForm();
  } catch (err) {
    console.error("Gagal memperbarui event:", err.response?.data);
    openPopUp(
      "error",
      "update",
      err.response?.data?.error || "Gagal memperbarui event."
    );
  }
};

// Hapus event
const handleDeleteEvent = async (id) => {
  try {
    const token = localStorage.getItem("access_token");
    await axios.delete(`http://localhost:5000/api/event/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    openPopUp("success", "delete");
    fetchEventData();
  } catch (err) {
    console.error("Gagal menghapus event:", err.response?.data);
    openPopUp(
      "error",
      "delete",
      err.response?.data?.error || "Gagal menghapus event."
    );
  }
};

// Format tanggal
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

onMounted(() => {
  fetchEventData();
});
</script>

<style scoped>
/* CSS tetap sama seperti sebelumnya */
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

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-info {
  flex: 1;
}

.main-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.main-title i {
  color: #007bff;
  font-size: 1.5rem;
}

.subtitle {
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
  line-height: 1.5;
}

/* Stats Section */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
}

.stat-card:nth-child(2):hover {
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2);
}

.stat-card:nth-child(3):hover {
  box-shadow: 0 8px 25px rgba(255, 193, 7, 0.3);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.9;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.stat-content p {
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
}

/* Table Styling */
.table thead th {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.table thead th i {
  margin-right: 0.5rem;
  color: #007bff;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #dee2e6;
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.empty-state p {
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.add-button {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 1rem;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .table-container {
    overflow-x: auto;
  }
}
</style>
