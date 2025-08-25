<template>
  <div class="event-view-user">
    <div class="container">
      <h1 class="page-title">Daftar Event Dinas Kebudayaan dan Pariwisata</h1>
      <p class="page-subtitle">Temukan informasi event menarik yang akan datang dan yang telah diselenggarakan.</p>
      
      <div v-if="loading" class="state-message">
        <div class="spinner"></div>
        <p>Memuat daftar event...</p>
      </div>

      <div v-if="error" class="state-message error-message">
        <p>❌ Maaf, terjadi kesalahan saat memuat data event. Silakan coba kembali.</p>
      </div>

      <div v-if="!loading && !error && eventList.length === 0" class="state-message empty-message">
        <p>📋 Belum ada event yang tersedia saat ini.</p>
      </div>

      <section class="events-section" v-if="comingSoonEvents.length > 0">
        <h2 class="section-title">Coming Soon
          <span class="title-line"></span>
        </h2>
        <div class="event-grid">
          <div v-for="event in comingSoonEvents" :key="event.id_event" class="event-card">
            <div class="event-date">
              <span class="day">{{ formatDate(event.tanggal_mulai, 'day') }}</span>
              <span class="month-year">{{ formatDate(event.tanggal_mulai, 'monthYear') }}</span>
            </div>
            <div class="event-image-container">
              <img :src="baseUrl + event.gambar_event" :alt="`Flyer ${event.nama_event}`" class="event-image" v-if="event.gambar_event">
              <div v-else class="no-image">
                <i class="fas fa-image"></i> Flyer Event
              </div>
            </div>
            <h3 class="event-title">{{ truncateText(event.nama_event, 50) }}</h3>
            <p class="event-location"><i class="fas fa-map-marker-alt"></i> {{ event.lokasi_event }}</p>
            <div class="card-actions">
              <button @click="viewEventDetail(event.id_event)" class="view-detail-button">
                Detail <i class="fas fa-arrow-right"></i>
              </button>
              <a v-if="event.brosur_event" :href="baseUrl + event.brosur_event" target="_blank" rel="noopener noreferrer" class="download-brosur-button">
                Brosur <i class="fas fa-file-download"></i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="events-section mt-10" v-if="pastEvents.length > 0">
        <h2 class="section-title">Past Events
          <span class="title-line"></span>
        </h2>
        <div class="past-event-list">
          <div v-for="event in pastEvents" :key="event.id_event" class="past-event-item">
            <div class="item-left">
              <div class="event-image-container past-event-image-container">
                <img :src="baseUrl + event.gambar_event" :alt="`Flyer ${event.nama_event}`" class="event-image" v-if="event.gambar_event">
                <div v-else class="no-image">
                  <i class="fas fa-image"></i> Flyer Event
                </div>
              </div>
              <div class="event-date-overlay">
                <span class="day">{{ formatDate(event.tanggal_mulai, 'day') }}</span>
                <span class="month-year">{{ formatDate(event.tanggal_mulai, 'monthYear') }}</span>
              </div>
            </div>
            <div class="item-right">
              <h3 class="event-title">{{ truncateText(event.nama_event, 70) }}</h3>
              <p class="event-location-past"><i class="fas fa-map-marker-alt"></i> {{ event.lokasi_event }}</p>
              <p class="event-description">{{ truncateText(event.deskripsi_event, 250) }}</p>
              <div class="card-actions past-actions">
                <button @click="viewEventDetail(event.id_event)" class="view-detail-button past-button">
                  Detail <i class="fas fa-arrow-right"></i>
                </button>
                <a v-if="event.brosur_event" :href="baseUrl + event.brosur_event" target="_blank" rel="noopener noreferrer" class="download-brosur-button past-button">
                  Brosur <i class="fas fa-file-download"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const eventList = ref([]);
const loading = ref(true);
const error = ref(false);
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const fetchEvents = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await axios.get(`${baseUrl}/api/event`);
    eventList.value = response.data;
  } catch (err) {
    console.error("Error fetching events:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString, part) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const optionsMonth = { month: 'short' };
  const optionsYear = { year: 'numeric' };

  if (part === 'day') {
    return date.getDate();
  } else if (part === 'monthYear') {
    return `${date.toLocaleDateString('id-ID', optionsMonth)} ${date.toLocaleDateString('id-ID', optionsYear)}`;
  }
  return date.toLocaleDateString('id-ID');
};

const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + '...';
};

const comingSoonEvents = computed(() => {
  const now = new Date();
  return eventList.value.filter(event => {
    const startDate = new Date(event.tanggal_mulai);
    const endDate = event.tanggal_selesai ? new Date(event.tanggal_selesai) : startDate;
    return endDate >= now;
  }).sort((a, b) => new Date(a.tanggal_mulai) - new Date(b.tanggal_mulai));
});

const pastEvents = computed(() => {
  const now = new Date();
  return eventList.value.filter(event => {
    const endDate = event.tanggal_selesai ? new Date(event.tanggal_selesai) : new Date(event.tanggal_mulai);
    return endDate < now;
  }).sort((a, b) => new Date(b.tanggal_mulai) - new Date(a.tanggal_mulai));
});

const viewEventDetail = (eventId) => {
  router.push({ name: 'EventDetail', params: { id: eventId } });
};

onMounted(() => {
  fetchEvents();
});
</script>

<style scoped>
/* Base styling */
.event-view-user {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #f4f7f9;
  color: #333;
}

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #0077b6;
  text-align: center;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  text-align: center;
  margin-bottom: 50px;
}

.state-message {
  text-align: center;
  font-size: 1.2rem;
  color: #6c757d;
  margin: 50px 0;
}

.state-message.error-message {
  color: #dc3545;
}

.state-message.empty-message {
  color: #ffc107;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #0077b6;
  animation: spin 1s ease infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Sections Styling */
.events-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 600;
  color: #1a1a1a;
  text-align: left;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.section-title .title-line {
  flex-grow: 1;
  height: 2px;
  background-color: #e0e0e0;
}

/* Coming Soon Grid Layout */
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); /* Diperbesar */
  gap: 30px; /* Jarak antar kartu diperbesar */
}

.event-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;
  position: relative;
  padding-bottom: 25px; /* Padding bawah diperbesar */
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.event-card .event-date {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: rgba(0, 119, 182, 0.9);
  color: white;
  padding: 10px 15px; /* Padding tanggal diperbesar */
  border-radius: 8px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.event-card .event-date .day {
  font-size: 2rem; /* Ukuran hari diperbesar */
  line-height: 1;
}

.event-card .event-date .month-year {
  font-size: 0.9rem; /* Ukuran bulan/tahun diperbesar */
  text-transform: uppercase;
  line-height: 1;
}

.event-image-container {
  width: 100%;
  height: 250px; /* Tinggi gambar diperbesar */
  overflow: hidden;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  position: relative;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.no-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.2rem; /* Ukuran font diperbesar */
}

.no-image .fas {
  font-size: 3rem; /* Ukuran ikon diperbesar */
  margin-bottom: 15px;
}

.event-card .event-title {
  font-size: 1.6rem; /* Ukuran judul diperbesar */
  color: #1a1a1a;
  margin: 25px 20px 12px 20px; /* Margin disesuaikan */
  flex-grow: 1;
  text-align: left;
}

.event-card .event-location {
  font-size: 1.05rem; /* Ukuran lokasi diperbesar */
  color: #6c757d;
  margin: 0 20px 25px 20px; /* Margin disesuaikan */
  text-align: left;
}

/* Card Actions (Tombol) - DIKEMBALIKAN KE UKURAN SEBELUMNYA */
.card-actions {
  display: flex;
  gap: 10px; /* Jarak antar tombol dikembalikan */
  padding: 0 15px; /* Padding dikembalikan */
  margin-top: auto;
  width: 100%;
}

.view-detail-button, .download-brosur-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* Jarak ikon/teks dikembalikan */
  color: white;
  padding: 10px 15px; /* Padding tombol dikembalikan */
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem; /* Ukuran font tombol dikembalikan */
  transition: background-color 0.3s ease;
  border: none;
  cursor: pointer;
  flex-grow: 1;
}

.view-detail-button {
  background-color: #0077b6;
}

.view-detail-button:hover {
  background-color: #005f91;
}

.download-brosur-button {
  background-color: #28a745;
}

.download-brosur-button:hover {
  background-color: #218838;
}

/* Past Events Section Styling */
.past-event-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.past-event-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  padding: 0;
}

.past-event-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.past-event-item .item-left {
  position: relative;
  width: 320px; /* Lebar item kiri diperbesar */
  height: 250px; /* Tinggi item kiri diperbesar */
  flex-shrink: 0;
}

.past-event-item .item-right {
  display: flex;
  flex-direction: column;
  padding: 25px; /* Padding diperbesar */
  flex-grow: 1;
}

.past-event-item .event-image-container.past-event-image-container {
  height: 100%;
}

.past-event-item .event-date-overlay {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: rgba(108, 117, 125, 0.9);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.past-event-item .event-date-overlay .day {
  font-size: 2rem;
  line-height: 1;
}

.past-event-item .event-date-overlay .month-year {
  font-size: 0.9rem;
  text-transform: uppercase;
  line-height: 1;
}

.past-event-item .event-title {
  font-size: 1.8rem;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.past-event-item .event-location-past {
  font-size: 1.05rem;
  color: #6c757d;
  margin-bottom: 12px;
}

.past-event-item .event-description {
  font-size: 1rem;
  color: #495057;
  line-height: 1.7;
  margin-bottom: 25px;
  flex-grow: 1;
}

/* Past Actions button override - DIKEMBALIKAN KE UKURAN SEBELUMNYA */
.past-event-item .card-actions.past-actions {
  display: flex;
  gap: 10px; /* Jarak antar tombol dikembalikan */
  margin-top: auto;
  width: auto;
  padding: 0;
  justify-content: flex-start;
}

.past-event-item .view-detail-button.past-button,
.past-event-item .download-brosur-button.past-button {
  padding: 10px 15px; /* Padding tombol dikembalikan */
  font-size: 0.9rem; /* Ukuran font tombol dikembalikan */
  flex-grow: 0;
  width: auto;
}

/* Responsiveness */
@media (max-width: 768px) {
  .event-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .event-card {
    padding-bottom: 20px;
  }
  .event-card .event-date {
    padding: 8px 12px;
  }
  .event-card .event-date .day {
    font-size: 1.8rem;
  }
  .event-card .event-date .month-year {
    font-size: 0.8rem;
  }
  .event-image-container {
    height: 200px;
  }
  .event-card .event-title {
    font-size: 1.4rem;
    margin: 20px 15px 10px 15px;
  }
  .event-card .event-location {
    font-size: 0.95rem;
    margin: 0 15px 20px 15px;
  }
  .card-actions {
    padding: 0 15px;
  }
  .view-detail-button, .download-brosur-button {
    padding: 10px 15px;
    font-size: 0.9rem;
  }

  .past-event-item {
    flex-direction: column;
  }
  .past-event-item .item-left {
    width: 100%;
    height: 200px;
  }
  .past-event-item .item-right {
    padding: 20px;
  }
  .past-event-item .event-title {
    font-size: 1.5rem;
  }
  .past-event-item .event-location-past,
  .past-event-item .event-description {
    font-size: 0.95rem;
  }
  .past-event-item .card-actions.past-actions {
    flex-direction: row;
    justify-content: center;
  }
  .past-event-item .view-detail-button.past-button,
  .past-event-item .download-brosur-button.past-button {
    flex-grow: 1;
    width: auto;
    padding: 10px 15px;
    font-size: 0.9rem;
  }
}
</style>