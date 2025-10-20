<template>
  <div>
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-calendar-alt"></i>
          Data Event & Kegiatan
        </h2>
        <p class="subtitle">
          Kelola event dan kegiatan wisata di Magetan termasuk festival,
          pameran, dan acara budaya untuk meningkatkan daya tarik wisata daerah.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formEventOpen"
          class="action-button create-button"
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

    <!-- Form Overlay -->
    <div v-if="formEventOpen" class="form-overlay">
      <div class="form-card card">
        <EventForm
          :is-editing="isEditingEvent"
          :initial-data="formEvent"
          :gallery-list="editingEventGallery"
          @close-form="closeEventForm"
          @save-event="handleSaveEvent"
          @update-event="handleUpdateEvent" />
      </div>
    </div>

    <div v-else>
      <!-- Tabel Event -->
      <div class="table-container card">
        <div class="table-header">
          <h3 class="table-title">
            <i class="fas fa-list"></i>
            Daftar Event & Kegiatan
          </h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th><i class="fas fa-hashtag"></i> ID</th>
                <th><i class="fas fa-calendar-alt"></i> Nama Event</th>
                <th><i class="fas fa-map-marker-alt"></i> Lokasi</th>
                <th><i class="fas fa-clock"></i> Tanggal</th>
                <th><i class="fas fa-user"></i> Admin</th>
                <th><i class="fas fa-cogs"></i> Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="eventList.length === 0">
                <td colspan="6" class="no-data-found">
                  <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <p>Belum ada event yang tersedia.</p>
                    <small
                      >Klik tombol "Tambah Event Baru" untuk membuat event
                      pertama.</small
                    >
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
/* Modern Admin Styling - Event Management */
* {
  box-sizing: border-box;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}
.action-button {
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: 0.9375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  font-family: inherit;
  text-decoration: none;
}

.create-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: 1px solid #2563eb;
}

.create-button:hover {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2),
    0 4px 6px -2px rgba(59, 130, 246, 0.1);
}

.create-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
/* Table Container */
.table-container.card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  overflow: hidden;
  margin-top: 1rem;
}

/* Table Header Section */
.table-header {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.table-title i {
  color: #3b82f6;
  font-size: 1.125rem;
}

/* Table Responsive Wrapper */
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Data Table */
.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  font-size: 0.875rem;
}

.data-table thead th {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #475569;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table thead th i {
  margin-right: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.data-table tbody td {
  padding: 1.25rem 1.5rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  line-height: 1.5;
}

.data-table tbody tr {
  transition: all 0.2s ease;
  background: white;
}

.data-table tbody tr:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  transform: scale(1.001);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}
/* Empty State */
.no-data-found {
  text-align: center;
  padding: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: #cbd5e1;
}

.empty-state p {
  font-size: 1.125rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: #475569;
}

.empty-state small {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}
/* Action Buttons */
.actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: flex-start;
}

.actions .action-button {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.actions .edit-button {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.actions .edit-button:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
}

.actions .delete-button {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.actions .delete-button:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-info {
  flex: 1;
}

.main-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.main-title i {
  font-size: 1.6rem;
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
  max-width: 600px;
  max-width: 600px;
}

/* Stats Section */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  color: white;
  padding: 1.75rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
}

.stat-card:hover {
  transform: translateY(-3px) scale(1.02);
}

.stat-card:nth-child(1) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  font-size: 2.75rem;
  opacity: 0.95;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 2.25rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.stat-content p {
  font-size: 0.9375rem;
  margin: 0.375rem 0 0 0;
  opacity: 0.95;
  font-weight: 500;
}

/* Form Overlay */
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-section {
    flex-direction: column;
    gap: 1.5rem;
  }

  .action-bar {
    align-self: stretch;
  }

  .create-button {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .header-section {
    margin-bottom: 1.5rem;
  }

  .main-title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.875rem;
  }

  .stats-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    padding: 1.25rem;
  }

  .stat-content h3 {
    font-size: 1.75rem;
  }

  .table-header {
    padding: 1.25rem 1rem;
  }

  .table-title {
    justify-content: center;
    font-size: 1.125rem;
  }

  .data-table {
    min-width: 600px;
    font-size: 0.8125rem;
  }

  .data-table thead th {
    padding: 0.875rem 1rem;
    font-size: 0.6875rem;
  }

  .data-table tbody td {
    padding: 1rem;
  }

  .actions .action-button {
    width: 2.25rem;
    height: 2.25rem;
  }

  .empty-state {
    padding: 3rem 1.5rem;
  }

  .empty-state i {
    font-size: 3.5rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.375rem;
  }

  .stats-container {
    margin-bottom: 1.5rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-icon {
    font-size: 2rem;
  }

  .stat-content h3 {
    font-size: 1.5rem;
  }

  .table-header {
    padding: 1rem;
  }

  .data-table thead th {
    padding: 0.75rem 0.875rem;
  }

  .data-table tbody td {
    padding: 0.875rem;
  }

  .actions {
    gap: 0.5rem;
  }

  .actions .action-button {
    width: 2rem;
    height: 2rem;
    font-size: 0.8125rem;
  }

  .form-overlay {
    padding: 0.5rem;
  }
}
</style>
