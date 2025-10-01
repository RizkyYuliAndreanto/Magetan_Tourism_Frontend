<template>
  <div class="event-detail-page">
    <div class="container">
      <div v-if="loading" class="state-message">
        <div class="spinner"></div>
        <p>Memuat detail event...</p>
      </div>
      <div v-if="error" class="state-message error-message">
        <p>❌ Maaf, event tidak ditemukan atau terjadi kesalahan.</p>
        <button @click="goBack" class="back-button">
          Kembali ke Daftar Event
        </button>
      </div>

      <div v-if="eventDetail && !loading && !error" class="event-content">
        <button @click="goBack" class="back-button-top">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>
        <h1 class="event-title-main">{{ eventDetail.nama_event }}</h1>

        <div class="event-meta-header">
          <p class="event-meta-item">
            <i class="fas fa-calendar-alt"></i>
            <span v-if="eventDetail.tanggal_mulai">{{
              formatDateDetail(eventDetail.tanggal_mulai)
            }}</span>
            <span
              v-if="
                eventDetail.tanggal_selesai &&
                eventDetail.tanggal_mulai !== eventDetail.tanggal_selesai
              ">
              - {{ formatDateDetail(eventDetail.tanggal_selesai) }}
            </span>
          </p>
          <p class="event-meta-item">
            <i class="fas fa-map-marker-alt"></i> {{ eventDetail.lokasi_event }}
          </p>
          <div class="event-meta-stats-inline">
            <p>
              <i class="fas fa-eye"></i> Dilihat:
              {{ eventDetail.jumlah_dilihat || 0 }} kali
            </p>
            <p>
              <i class="fas fa-share-alt"></i> Dibagikan:
              {{ eventDetail.jumlah_share || 0 }} kali
            </p>
          </div>
        </div>

        <div class="event-main-image-container">
          <img
            :src="baseUrl + eventDetail.gambar_event"
            :alt="`Flyer ${eventDetail.nama_event}`"
            class="event-main-image"
            v-if="eventDetail.gambar_event" />
          <div v-else class="event-main-no-image">
            <i class="fas fa-image"></i> Flyer Tidak Tersedia
          </div>
        </div>

        <div class="event-body">
          <div class="event-description-section">
            <p>{{ eventDetail.deskripsi_event }}</p>
          </div>

          <div v-if="eventDetail.koordinat_lokasi" class="event-map-section">
            <h2 class="section-heading">Lokasi Event</h2>
            <div id="map-container" class="leaflet-map-frame"></div>
          </div>
        </div>

        <div class="event-actions-bottom">
          <a
            v-if="eventDetail.brosur_event"
            :href="baseUrl + eventDetail.brosur_event"
            target="_blank"
            rel="noopener noreferrer"
            class="download-brosur-button-lg">
            <i class="fas fa-file-download"></i> Unduh Brosur
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const route = useRoute();
const router = useRouter();

const eventDetail = ref(null);
const loading = ref(true);
const error = ref(false);
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initMap = () => {
  if (!eventDetail.value || !eventDetail.value.koordinat_lokasi) return;

  const [lat, lon] = eventDetail.value.koordinat_lokasi.split(",").map(Number);

  if (
    document.getElementById("map-container") &&
    !document.getElementById("map-container")._leaflet_id
  ) {
    const map = L.map("map-container").setView([lat, lon], 15);

    L.tileLayer("http://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(eventDetail.value.lokasi_event)
      .openPopup();
  }
};

const fetchEventDetail = async () => {
  loading.value = true;
  error.value = false;
  const eventId = route.params.id;
  try {
    const response = await axios.get(`${baseUrl}/api/event/${eventId}`);
    eventDetail.value = response.data;
    setTimeout(() => {
      initMap();
    }, 0);
  } catch (err) {
    console.error("Error fetching event detail:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const formatDateDetail = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  // Scroll ke atas halaman
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  fetchEventDetail();
});
</script>

<style scoped>
/* Base Styling */
.event-detail-page {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #f4f7f9;
  color: #333;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.event-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Header and Meta Info */
.back-button-top {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
}

.back-button-top:hover {
  background-color: #5a6268;
}

.event-title-main {
  font-size: 2.8rem;
  font-weight: 700;
  color: #0077b6;
  margin-bottom: 10px;
}

.event-meta-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  color: #6c757d;
  font-size: 1rem;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.event-meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-meta-stats-inline {
  display: flex;
  gap: 20px;
  flex-grow: 1; /* Agar statistik berada di sisi kanan */
  justify-content: flex-end;
}

.event-meta-stats-inline p {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Main Image */
.event-main-image-container {
  width: 100%;
  height: 400px;
  overflow: hidden;
  background-color: #e0e0e0;
  border-radius: 8px;
  margin-bottom: 30px;
}

.event-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.event-main-no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.5rem;
}

/* Body Content */
.event-body {
  line-height: 1.7;
}

.event-description-section {
  font-size: 1rem;
  margin-bottom: 40px;
  white-space: pre-wrap;
}

.section-heading {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a1a1a;
  border-bottom: 2px solid #0077b6;
  padding-bottom: 5px;
  margin-bottom: 20px;
  display: inline-block;
}

.event-map-section {
  margin-bottom: 30px;
}

.leaflet-map-frame {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Action Button */
.event-actions-bottom {
  margin-top: 30px;
  text-align: right;
}

.download-brosur-button-lg {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #28a745;
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.download-brosur-button-lg:hover {
  background-color: #218838;
}

/* Responsiveness */
@media (max-width: 768px) {
  .event-title-main {
    font-size: 2rem;
  }
  .event-meta-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .event-meta-stats-inline {
    flex-direction: column;
    gap: 10px;
    align-self: flex-start;
    justify-content: flex-start;
  }
  .event-main-image-container {
    height: 300px;
  }
  .section-heading {
    font-size: 1.5rem;
  }
  .leaflet-map-frame {
    height: 300px;
  }
  .event-actions-bottom {
    text-align: center;
  }
}
</style>
