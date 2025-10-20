<template>
  <div class="detail-destinasi-page" v-if="destinasi">
    <nav class="navbar">
      <router-link to="/pariwisata" class="navbar-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-semibold hidden-sm">Kembali</span>
      </router-link>
      <div class="navbar-actions">
        <button class="icon-button tooltip">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span class="tooltip-text">Tambah ke Favorit</span>
        </button>
        <button class="icon-button tooltip">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.684 13.342C12.434 17.155 17.245 20 22 20V19c0-.469-.06-1.127-.29-1.874-.23-.746-1.294-1.272-2.583-1.554-1.29-.283-2.92-0.089-4.21.36-1.29.448-2.61.8-3.95.8s-2.66-.352-3.95-.8c-1.29-.448-2.92-0.643-4.21-.36-1.289.282-2.353.808-2.583 1.554C1.06 17.873 1 18.531 1 19v1c4.755 0 9.566-2.845 13.316-6.658z" />
          </svg>
          <span class="tooltip-text">Bagikan</span>
        </button>
      </div>
    </nav>

    <header class="hero-header">
      <transition-group name="fade" tag="div">
        <img
          v-for="(img, idx) in heroImages"
          v-show="idx === currentHeroIndex"
          :key="img"
          :src="img"
          alt="Hero Image Destinasi"
          class="hero-image" />
      </transition-group>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">
          {{ destinasi?.nama_destinasi }}
        </h1>
        <div class="hero-rating">
          <span class="star-rating">★★★★★</span>
          <span class="star-value">(4.8/5.0)</span>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container-grid">
        <section class="main-info">
          <div class="info-card">
            <div class="info-header">
              <span class="category-tag">{{
                destinasi.kategoriDestinasi?.nama_kategori
              }}</span>
            </div>
            <h2 class="section-title">Deskripsi</h2>
            <p class="description">{{ destinasi.deskripsi_destinasi }}</p>
            <div class="info-grid">
              <div class="info-item location-item">
                <h3 class="info-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Lokasi
                </h3>
                <p class="info-text">{{ destinasi.alamat }}</p>
                <!-- Leaflet Map Container -->
                <div class="map-container">
                  <div id="detail-map-container"></div>
                </div>
                <a :href="mapsLink" target="_blank" class="map-link">
                  Lihat di Google Maps
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6L6 10l4 4M10 10h12" />
                  </svg>
                </a>
              </div>
              <div class="info-item">
                <h3 class="info-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Jam Operasional
                </h3>
                <p class="info-text">{{ destinasi.jam_operasional }}</p>
              </div>
              <div class="info-item">
                <h3 class="info-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 4v2m0 8v-2m0-4h2m-4 0H8m6 0a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  Harga Tiket
                </h3>
                <p class="info-text">
                  {{ formatCurrency(destinasi.harga_tiket) }}
                </p>
              </div>
            </div>
            <div class="stats">
              <div class="stat-item">
                <span class="stat-value">{{ destinasi.jumlah_dilihat }}</span>
                Dilihat
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ destinasi.jumlah_share }}</span>
                Dibagikan
              </div>
            </div>
          </div>
        </section>
        <aside class="side-info">
          <div class="info-card gallery-card">
            <h3 class="section-title">Galeri Foto</h3>
            <div class="gallery-grid">
              <div
                v-for="(image, index) in destinasi.galeriDestinasi"
                :key="index"
                class="gallery-item">
                <img
                  :src="getImageUrl(image.path_file)"
                  :alt="image.deskripsi_file"
                  class="gallery-image"
                  @click="openLightbox(index)" />
              </div>
            </div>
          </div>
          <div class="info-card admin-card">
            <h3 class="section-title">Informasi Admin</h3>
            <p class="admin-text">
              <span class="font-semibold">Nama:</span>
              {{ destinasi.adminPembuat?.nama_lengkap }}
            </p>
            <p class="admin-text">
              <span class="font-semibold">Level Akses:</span>
              {{ destinasi.adminPembuat?.level_akses }}
            </p>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const API_BASE_URL = "http://localhost:5000";
const destinasi = ref(null);
const loading = ref(true);
const error = ref(null);
const mapInstance = ref(null);

const route = useRoute();

// Hero slideshow logic
const heroImages = ref([]); // array of image URLs
const currentHeroIndex = ref(0);
let heroInterval = null;

const getHeroImages = (dest) => {
  if (!dest) return [];
  const galeri = Array.isArray(dest.galeriDestinasi)
    ? dest.galeriDestinasi.map((g) => getImageUrl(g.path_file))
    : [];

  const utama = dest.gambar_utama ? [getImageUrl(dest.gambar_utama)] : [];
  return utama.concat(galeri.length ? galeri : []);
};

const heroImage = computed(() => {
  if (!heroImages.value.length) {
    return "https://images.unsplash.com/photo-1542382903-51834927161b?q=80&w=1770&auto=format&fit=crop";
  }
  return heroImages.value[currentHeroIndex.value];
});

const mapsLink = computed(() => {
  if (!destinasi.value) return "#";
  const coords = destinasi.value.koordinat_lokasi;
  if (coords) {
    const [lat, lon] = coords.split(",").map((c) => c.trim());
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  }
  return "#";
});

function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
}

function formatCurrency(value) {
  if (!value) return "Gratis";
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  return formatter.format(value).replace(/\s/g, "");
}

function openLightbox(index) {
  console.log(`Open lightbox with image index: ${index}`);
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

  if (!destinasi.value || !destinasi.value.koordinat_lokasi) return;

  const [lat, lng] = destinasi.value.koordinat_lokasi
    .split(",")
    .map((coord) => parseFloat(coord.trim()));

  mapInstance.value = L.map("detail-map-container").setView([lat, lng], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapInstance.value);

  // Custom icon untuk marker
  const customIcon = L.icon({
    iconUrl: destinasi.value.gambar_utama
      ? getImageUrl(destinasi.value.gambar_utama)
      : "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  // Tambahkan marker
  L.marker([lat, lng], { icon: customIcon })
    .addTo(mapInstance.value)
    .bindPopup(
      `<b>${destinasi.value.nama_destinasi}</b><br>${destinasi.value.alamat}`
    )
    .openPopup();
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
    const id = route.params.id;
    const res = await axios.get(`${API_BASE_URL}/api/destinasi/${id}`);
    destinasi.value = res.data;
    heroImages.value = getHeroImages(res.data);
    startHeroSlideshow();
    loading.value = false;

    // Initialize map after data is loaded
    await nextTick();
    initializeMap();
  } catch (err) {
    error.value = err.message || "Gagal mengambil data destinasi";
    loading.value = false;
  }
});

onUnmounted(() => {
  destroyMap();
});

watch(destinasi, (val) => {
  heroImages.value = getHeroImages(val);
  currentHeroIndex.value = 0;
  startHeroSlideshow();

  // Reinitialize map when destinasi data changes
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
.detail-destinasi-page {
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
  padding-top: 80px; /* Untuk navbar fixed */
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: opacity 0.7s, transform 0.5s;
  z-index: 1;
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.hero-image:hover {
  transform: scale(1.05);
}

.hero-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: linear-gradient(
    to top,
    rgba(0, 71, 171, 0.92) 0%,
    rgba(0, 71, 171, 0.5) 40%,
    transparent 80%
  );
  opacity: 0.92;
  z-index: 2;
}

.hero-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 90px; /* Lebih jauh dari bottom */
  z-index: 20; /* Z-index lebih tinggi */
  width: 100%;
  padding: 0 2.5rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  pointer-events: auto;

  padding: 1.5rem 2.5rem;
  border-radius: 15px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  animation: fade-in-up 0.8s ease forwards;
}

.hero-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  animation: fade-in-up 0.8s ease forwards;
  animation-delay: 0.2s;
}
.star-rating {
  font-size: 1.25rem;
  color: #fcd34d;
}
.star-value {
  font-size: 0.875rem;
  font-weight: 300;
}

/* Main Content */
.main-content {
  background-color: #f9fafb;
  padding: 2.5rem 1rem 2rem 1rem;
  margin-top: -80px; /* Overlap dengan hero untuk design mulus */
  position: relative;
  z-index: 10; /* Lebih rendah dari hero-content */
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
  animation: fade-in 0.8s ease forwards;
}

.container-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
@media (max-width: 900px) {
  .container-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .side-info {
    margin-top: 2rem;
  }
}
.main-info {
  min-width: 0;
}
.side-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.info-header {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}
.category-tag {
  background-color: #dbeafe;
  color: #1e40af;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  display: inline-block;
}

.section-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.description {
  color: #4b5563;
  line-height: 1.75;
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.location-item {
  grid-column: span 2; /* Location item spans full width */
}

/* Map Styles */
.map-container {
  width: 100%;
  height: 300px;
  margin: 1rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

#detail-map-container {
  height: 100%;
  width: 100%;
}

.info-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.icon {
  color: #3b82f6;
}

.info-text {
  color: #6b7280;
}

.map-link {
  display: inline-flex;
  align-items: center;
  color: #3b82f6;
  text-decoration: none;
  margin-top: 0.5rem;
  transition: color 0.3s ease;
}
.map-link:hover {
  color: #2563eb;
}

.stats {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #6b7280;
}

.stat-value {
  font-weight: 700;
  color: #1f2937;
}

/* Gallery Card */
.gallery-card {
  animation: fade-in-up 0.8s ease forwards;
  animation-delay: 0.5s;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
}
.gallery-image {
  width: 100%;
  height: 8rem;
  object-fit: cover;
  transition: transform 0.3s ease;
  cursor: pointer;
}
.gallery-image:hover {
  transform: scale(1.1);
}

/* Admin Card */
.admin-card {
  animation: fade-in-up 0.8s ease forwards;
  animation-delay: 0.8s;
}
.admin-text {
  color: #4b5563;
  margin-bottom: 0.5rem;
}
.admin-text .font-semibold {
  font-weight: 600;
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
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
<style scoped>
.detail-destinasi-page {
  overflow-y: auto;
}
</style>
