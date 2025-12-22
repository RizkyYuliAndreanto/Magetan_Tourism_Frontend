<template>
  <div class="detail-akomodasi-page" v-if="akomodasi">
    <!-- Navbar -->
    <nav class="navbar">
      <router-link to="/pariwisata" class="navbar-link">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        Kembali ke Pariwisata
      </router-link>
      <div class="navbar-actions">
        <div class="tooltip">
          <button class="icon-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z" />
            </svg>
          </button>
          <span class="tooltip-text">Bagikan</span>
        </div>

        <div class="tooltip">
          <button class="icon-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          <span class="tooltip-text">Favorit</span>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="hero-header">
      <transition name="fade" mode="out-in">
        <img
          :key="heroImage"
          :src="heroImage"
          :alt="akomodasi.nama_hotel"
          class="hero-image"
          @click="openLightbox(currentHeroIndex)" />
      </transition>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">{{ akomodasi.nama_hotel }}</h1>
        <div class="hero-rating">
          <div class="star-rating">
            <span
              v-for="i in 5"
              :key="i"
              class="star"
              :class="{ filled: i <= Math.floor(akomodasi.rating_hotel || 0) }"
              >★</span
            >
          </div>
          <span class="star-value">{{ akomodasi.rating_hotel || "N/A" }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container-grid">
        <!-- Main Information -->
        <div class="main-info">
          <!-- Hotel Description -->
          <div class="info-card">
            <div class="info-header">
              <div class="category-tag">🏨 AKOMODASI</div>
            </div>
            <h2 class="section-title">Tentang Hotel</h2>
            <p class="description">{{ akomodasi.deskripsi_hotel }}</p>
          </div>

          <!-- Hotel Info Grid -->
          <div class="info-card">
            <h2 class="section-title">Informasi Hotel</h2>
            <div class="info-grid">
              <!-- Address -->
              <div class="location-item">
                <div class="info-title">
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  Alamat
                </div>
                <p class="info-text">{{ akomodasi.alamat_hotel }}</p>
              </div>

              <!-- Contact -->
              <div class="location-item" v-if="akomodasi.kontak_hotel">
                <div class="info-title">
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  Kontak
                </div>
                <p class="info-text">{{ akomodasi.kontak_hotel }}</p>
              </div>

              <!-- Website -->
              <div class="location-item" v-if="akomodasi.website_hotel">
                <div class="info-title">
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
                  </svg>
                  Website
                </div>
                <a
                  :href="akomodasi.website_hotel"
                  target="_blank"
                  class="info-text map-link">
                  {{ akomodasi.website_hotel }}
                </a>
              </div>

              <!-- Facilities -->
              <div class="location-item" v-if="akomodasi.fasilitas">
                <div class="info-title">
                  <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Fasilitas
                </div>
                <p class="info-text">{{ akomodasi.fasilitas }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Side Information -->
        <div class="side-info">
          <!-- Map -->
          <div
            class="info-card map-container"
            v-if="akomodasi.koordinat_lokasi">
            <h3 class="info-title">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              </svg>
              Lokasi Hotel
            </h3>
            <div id="detail-map-container"></div>
            <a :href="mapsLink" target="_blank" class="map-link">
              Buka di Google Maps
            </a>
          </div>

          <!-- Statistics -->
          <div class="info-card stats">
            <h3 class="info-title">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
              </svg>
              Statistik
            </h3>
            <div class="stat-value">
              👀 {{ akomodasi.jumlah_dilihat || 0 }} dilihat
            </div>
            <div class="stat-value">
              📤 {{ akomodasi.jumlah_share || 0 }} dibagikan
            </div>
            <div class="stat-value">
              ⭐ {{ akomodasi.rating_hotel || "N/A" }} rating
            </div>
          </div>

          <!-- Gallery -->
          <div
            class="info-card gallery-card"
            v-if="
              akomodasi.galeriAkomodasi && akomodasi.galeriAkomodasi.length > 0
            ">
            <h3 class="info-title">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
              Galeri Hotel
            </h3>
            <div class="gallery-grid">
              <div
                v-for="(item, index) in akomodasi.galeriAkomodasi"
                :key="index"
                class="gallery-item"
                @click="openLightbox(index + 1)">
                <img
                  :src="getImageUrl(item.path_file)"
                  :alt="item.deskripsi_file || 'Galeri Hotel'"
                  class="gallery-image" />
              </div>
            </div>
          </div>

          <!-- Admin Info -->
          <div class="info-card admin-card" v-if="akomodasi.adminPengelola">
            <h3 class="info-title">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              Dikelola oleh
            </h3>
            <div class="admin-text">
              <div class="font-semibold">
                {{
                  akomodasi.adminPengelola.nama_lengkap ||
                  akomodasi.adminPengelola.username
                }}
              </div>
              <div>{{ akomodasi.adminPengelola.level_akses }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>Memuat data akomodasi...</p>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="error-container">
    <div class="error-icon">⚠️</div>
    <h2>Terjadi Kesalahan</h2>
    <p>{{ error }}</p>
    <router-link to="/pariwisata" class="back-button">
      Kembali ke Pariwisata
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const API_BASE_URL = "http://localhost:5000";
const akomodasi = ref(null);
const loading = ref(true);
const error = ref(null);
const mapInstance = ref(null);

const route = useRoute();

// Hero slideshow logic
const heroImages = ref([]); // array of image URLs
const currentHeroIndex = ref(0);
let heroInterval = null;

const getHeroImages = (akm) => {
  if (!akm) return [];
  const galeri = Array.isArray(akm.galeriAkomodasi)
    ? akm.galeriAkomodasi.map((g) => getImageUrl(g.path_file))
    : [];

  const utama = akm.gambar_utama_hotel
    ? [getImageUrl(akm.gambar_utama_hotel)]
    : [];
  return utama.concat(galeri.length ? galeri : []);
};

const heroImage = computed(() => {
  if (!heroImages.value.length) {
    return "/api/placeholder/800/400";
  }
  return heroImages.value[currentHeroIndex.value];
});

const mapsLink = computed(() => {
  if (!akomodasi.value) return "#";
  const coords = akomodasi.value.koordinat_lokasi;
  if (coords) {
    const [lat, lng] = coords.split(",").map((c) => parseFloat(c.trim()));
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }
  return "#";
});

function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
}

function openLightbox(index) {
  // Implementation for lightbox can be added later
}

function startHeroSlideshow() {
  if (heroInterval) clearInterval(heroInterval);
  heroInterval = setInterval(() => {
    if (heroImages.value.length > 1) {
      currentHeroIndex.value =
        (currentHeroIndex.value + 1) % heroImages.value.length;
    }
  }, 3500);
}

function initializeMap() {
  if (mapInstance.value) {
    mapInstance.value.remove();
  }

  if (!akomodasi.value || !akomodasi.value.koordinat_lokasi) return;

  const [lat, lng] = akomodasi.value.koordinat_lokasi
    .split(",")
    .map((coord) => parseFloat(coord.trim()));

  mapInstance.value = L.map("detail-map-container").setView([lat, lng], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(mapInstance.value);

  // Custom icon untuk marker
  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Tambahkan marker
  L.marker([lat, lng], { icon: customIcon }).addTo(mapInstance.value)
    .bindPopup(`
      <div style="text-align: center;">
        <strong>${akomodasi.value.nama_hotel}</strong><br>
        ${akomodasi.value.alamat_hotel}
      </div>
    `);
}

function destroyMap() {
  if (mapInstance.value) {
    mapInstance.value.remove();
    mapInstance.value = null;
  }
}

onMounted(async () => {
  // Scroll ke atas halaman
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/akomodasi/${route.params.id}`
    );
    akomodasi.value = response.data;
    loading.value = false;

    await nextTick();
    initializeMap();
  } catch (err) {
    error.value = err.response?.data?.message || "Gagal memuat data akomodasi";
    loading.value = false;
  }
});

onUnmounted(() => {
  destroyMap();
  if (heroInterval) clearInterval(heroInterval);
});

watch(akomodasi, (val) => {
  heroImages.value = getHeroImages(val);
  currentHeroIndex.value = 0;
  startHeroSlideshow();

  // Reinitialize map when akomodasi data changes
  if (val) {
    nextTick(() => {
      initializeMap();
    });
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap");

/* Global Styles */
.detail-akomodasi-page {
  font-family: "Poppins", sans-serif;
  min-height: 100vh;
  background-color: #f3f4f6;
  color: #333;
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.navbar-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}
.navbar-link:hover {
  color: #0056b3;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
}

.icon-button {
  background-color: #f3f4f6;
  padding: 0.5rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
}
.icon-button:hover {
  background-color: #e5e7eb;
}

.tooltip {
  position: relative;
}
.tooltip .tooltip-text {
  visibility: hidden;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
}
.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* Hero Section */
.hero-header {
  position: relative;
  width: 100%;
  height: 75vh;
  min-height: 500px;
  overflow: hidden;
  margin-top: 0;
  padding-top: 80px;
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.hero-image:hover {
  transform: scale(1.02);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  z-index: 1;
}

.hero-content {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  z-index: 2;
  color: white;
  max-width: 50%;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}
.star-rating {
  display: flex;
  gap: 0.1rem;
}
.star {
  color: #d1d5db;
  font-size: 1.2rem;
}
.star.filled {
  color: #fbbf24;
}
.star-value {
  font-weight: 600;
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: fade-in-up 0.6s ease-out;
}

.container-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
@media (max-width: 900px) {
  .container-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
.main-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.side-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.info-header {
  margin-bottom: 1.5rem;
}
.category-tag {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
}

.description {
  line-height: 1.7;
  color: #4b5563;
  font-size: 1rem;
}

.info-grid {
  display: grid;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.location-item {
  margin-bottom: 1rem;
}

/* Map Styles */
.map-container {
  position: relative;
}

#detail-map-container {
  height: 250px;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.info-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #374151;
}

.icon {
  width: 20px;
  height: 20px;
}

.info-text {
  color: #6b7280;
  line-height: 1.6;
}

.map-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}
.map-link:hover {
  color: #1d4ed8;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-value {
  font-size: 0.95rem;
  color: #6b7280;
}

/* Gallery Card */
.gallery-card {
  overflow: hidden;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}
.gallery-item {
  cursor: pointer;
  border-radius: 0.5rem;
  overflow: hidden;
}
.gallery-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.gallery-image:hover {
  transform: scale(1.05);
}

/* Admin Card */
.admin-card {
  border-left: 4px solid #3b82f6;
}
.admin-text {
  color: #6b7280;
  line-height: 1.5;
}
.admin-text .font-semibold {
  font-weight: 600;
  color: #374151;
}

/* Loading and Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.back-button {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  margin-top: 1rem;
  display: inline-block;
  transition: transform 0.3s ease;
}

.back-button:hover {
  transform: translateY(-2px);
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-content {
    max-width: 80%;
  }

  .main-content {
    padding: 1rem;
  }

  .info-card {
    padding: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  #detail-map-container {
    height: 200px;
  }
}
</style>
