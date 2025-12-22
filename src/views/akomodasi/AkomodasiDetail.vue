<template>
  <div class="akomodasi-detail-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Memuat detail akomodasi...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Terjadi Kesalahan</h3>
      <p>{{ error }}</p>
      <button @click="fetchAkomodasi" class="retry-btn">Coba Lagi</button>
    </div>

    <!-- Content -->
    <div v-else-if="akomodasi" class="akomodasi-detail-content">
      <!-- Hero Section with Image Slideshow -->
      <section class="hero-section">
        <div
          class="hero-slideshow"
          v-if="akomodasi.images && akomodasi.images.length > 0">
          <div class="slide-container">
            <img
              :src="akomodasi.images[currentSlide]"
              :alt="`${akomodasi.nama_akomodasi} - Image ${currentSlide + 1}`"
              class="hero-image"
              @error="handleImageError" />
            <div class="slide-overlay">
              <div class="slide-content">
                <h1 class="hotel-name">{{ akomodasi.nama_akomodasi }}</h1>
                <div class="hotel-location">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ akomodasi.alamat }}</span>
                </div>
                <div class="hotel-rating" v-if="akomodasi.rating">
                  <div class="stars">
                    <i
                      v-for="star in 5"
                      :key="star"
                      :class="[
                        'fas fa-star',
                        { filled: star <= akomodasi.rating },
                      ]">
                    </i>
                  </div>
                  <span class="rating-text">({{ akomodasi.rating }}/5)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Dots -->
          <div class="slide-dots" v-if="akomodasi.images.length > 1">
            <button
              v-for="(image, index) in akomodasi.images"
              :key="index"
              @click="currentSlide = index"
              :class="['dot', { active: currentSlide === index }]"></button>
          </div>

          <!-- Navigation Arrows -->
          <div class="slide-nav" v-if="akomodasi.images.length > 1">
            <button @click="previousSlide" class="nav-btn prev-btn">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button @click="nextSlide" class="nav-btn next-btn">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- Fallback if no images -->
        <div v-else class="hero-fallback">
          <div class="fallback-content">
            <h1 class="hotel-name">{{ akomodasi.nama_akomodasi }}</h1>
            <div class="hotel-location">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ akomodasi.alamat }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Hotel Information Grid -->
      <section class="hotel-info-section">
        <div class="container">
          <div class="info-grid">
            <!-- Hotel Stats -->
            <div class="info-card stats-card">
              <h3 class="card-title">
                <i class="fas fa-info-circle"></i>
                Informasi Hotel
              </h3>
              <div class="stats-grid">
                <div class="stat-item" v-if="akomodasi.tipe_akomodasi">
                  <i class="fas fa-building"></i>
                  <div>
                    <span class="stat-label">Tipe</span>
                    <span class="stat-value">{{
                      akomodasi.tipe_akomodasi
                    }}</span>
                  </div>
                </div>
                <div class="stat-item" v-if="akomodasi.jumlah_kamar">
                  <i class="fas fa-bed"></i>
                  <div>
                    <span class="stat-label">Kamar</span>
                    <span class="stat-value"
                      >{{ akomodasi.jumlah_kamar }} Kamar</span
                    >
                  </div>
                </div>
                <div class="stat-item" v-if="akomodasi.harga_per_malam">
                  <i class="fas fa-money-bill-wave"></i>
                  <div>
                    <span class="stat-label">Tarif/Malam</span>
                    <span class="stat-value"
                      >Rp {{ formatPrice(akomodasi.harga_per_malam) }}</span
                    >
                  </div>
                </div>
                <div class="stat-item" v-if="akomodasi.rating">
                  <i class="fas fa-star"></i>
                  <div>
                    <span class="stat-label">Rating</span>
                    <span class="stat-value">{{ akomodasi.rating }}/5</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="info-card description-card">
              <h3 class="card-title">
                <i class="fas fa-align-left"></i>
                Deskripsi
              </h3>
              <div class="description-content">
                <p>{{ akomodasi.deskripsi || "Deskripsi tidak tersedia." }}</p>
              </div>
            </div>

            <!-- Facilities -->
            <div class="info-card facilities-card" v-if="akomodasi.fasilitas">
              <h3 class="card-title">
                <i class="fas fa-concierge-bell"></i>
                Fasilitas
              </h3>
              <div class="facilities-grid">
                <div
                  v-for="fasilitas in parseFasilitas(akomodasi.fasilitas)"
                  :key="fasilitas"
                  class="facility-item">
                  <i class="fas fa-check-circle"></i>
                  <span>{{ fasilitas }}</span>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="info-card contact-card">
              <h3 class="card-title">
                <i class="fas fa-phone"></i>
                Kontak & Reservasi
              </h3>
              <div class="contact-info">
                <div class="contact-item" v-if="akomodasi.nomor_telepon">
                  <i class="fas fa-phone"></i>
                  <div>
                    <span class="contact-label">Telepon</span>
                    <a
                      :href="`tel:${akomodasi.nomor_telepon}`"
                      class="contact-value">
                      {{ akomodasi.nomor_telepon }}
                    </a>
                  </div>
                </div>
                <div class="contact-item" v-if="akomodasi.email">
                  <i class="fas fa-envelope"></i>
                  <div>
                    <span class="contact-label">Email</span>
                    <a
                      :href="`mailto:${akomodasi.email}`"
                      class="contact-value">
                      {{ akomodasi.email }}
                    </a>
                  </div>
                </div>
                <div class="contact-item" v-if="akomodasi.website">
                  <i class="fas fa-globe"></i>
                  <div>
                    <span class="contact-label">Website</span>
                    <a
                      :href="akomodasi.website"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="contact-value">
                      {{ akomodasi.website }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Map Section -->
      <section
        class="map-section"
        v-if="akomodasi.latitude && akomodasi.longitude">
        <div class="container">
          <h3 class="section-title">
            <i class="fas fa-map-marked-alt"></i>
            Lokasi Hotel
          </h3>
          <div class="map-container">
            <div id="akomodasi-map" class="leaflet-map"></div>
          </div>
          <div class="location-info">
            <div class="address">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ akomodasi.alamat }}</span>
            </div>
            <div class="coordinates">
              <i class="fas fa-compass"></i>
              <span>{{ akomodasi.latitude }}, {{ akomodasi.longitude }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Back to List Button -->
      <section class="navigation-section">
        <div class="container">
          <button @click="goBack" class="back-btn">
            <i class="fas fa-arrow-left"></i>
            Kembali ke Daftar Akomodasi
          </button>
        </div>
      </section>
    </div>

    <!-- Not Found State -->
    <div v-else class="not-found-state">
      <div class="not-found-icon">🏨</div>
      <h3>Akomodasi Tidak Ditemukan</h3>
      <p>Akomodasi yang Anda cari tidak dapat ditemukan.</p>
      <button @click="goBack" class="back-btn">
        <i class="fas fa-arrow-left"></i>
        Kembali ke Daftar Akomodasi
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "AkomodasiDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();

    // Reactive data
    const akomodasi = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const currentSlide = ref(0);
    const slideInterval = ref(null);
    let map = null;

    // Methods
    const fetchAkomodasi = async () => {
      try {
        loading.value = true;
        error.value = null;

        const response = await axios.get(
          `http://localhost:3000/api/akomodasi/${route.params.id}`
        );
        akomodasi.value = response.data;

        // Process images
        if (akomodasi.value.images) {
          akomodasi.value.images = akomodasi.value.images.map((img) => {
            if (img.startsWith("http")) {
              return img;
            }
            return `http://localhost:3000/uploads/${img}`;
          });
        }

        // Initialize map after data is loaded
        await nextTick();
        if (akomodasi.value.latitude && akomodasi.value.longitude) {
          initMap();
        }

        // Start slideshow
        startSlideshow();
      } catch (err) {
        error.value =
          err.response?.data?.message || "Gagal memuat detail akomodasi";
      } finally {
        loading.value = false;
      }
    };

    const initMap = () => {
      if (map) {
        map.remove();
      }

      setTimeout(() => {
        const mapElement = document.getElementById("akomodasi-map");
        if (
          mapElement &&
          akomodasi.value.latitude &&
          akomodasi.value.longitude
        ) {
          map = L.map("akomodasi-map").setView(
            [akomodasi.value.latitude, akomodasi.value.longitude],
            15
          );

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(map);

          const customIcon = L.divIcon({
            html: '<i class="fas fa-hotel" style="color: #e74c3c; font-size: 24px;"></i>',
            iconSize: [30, 30],
            className: "custom-div-icon",
          });

          L.marker([akomodasi.value.latitude, akomodasi.value.longitude], {
            icon: customIcon,
          }).addTo(map).bindPopup(`
              <div class="map-popup">
                <h4>${akomodasi.value.nama_akomodasi}</h4>
                <p>${akomodasi.value.alamat}</p>
              </div>
            `);
        }
      }, 100);
    };

    const startSlideshow = () => {
      if (akomodasi.value?.images && akomodasi.value.images.length > 1) {
        slideInterval.value = setInterval(() => {
          nextSlide();
        }, 5000);
      }
    };

    const stopSlideshow = () => {
      if (slideInterval.value) {
        clearInterval(slideInterval.value);
        slideInterval.value = null;
      }
    };

    const nextSlide = () => {
      if (akomodasi.value?.images) {
        currentSlide.value =
          (currentSlide.value + 1) % akomodasi.value.images.length;
      }
    };

    const previousSlide = () => {
      if (akomodasi.value?.images) {
        currentSlide.value =
          currentSlide.value === 0
            ? akomodasi.value.images.length - 1
            : currentSlide.value - 1;
      }
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat("id-ID").format(price);
    };

    const parseFasilitas = (fasilitas) => {
      if (!fasilitas) return [];

      // If it's already an array, return it
      if (Array.isArray(fasilitas)) {
        return fasilitas;
      }

      // If it's a string, try to parse it
      if (typeof fasilitas === "string") {
        // Try JSON parse first
        try {
          const parsed = JSON.parse(fasilitas);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (e) {
          // If JSON parse fails, split by comma
          return fasilitas
            .split(",")
            .map((f) => f.trim())
            .filter((f) => f);
        }
      }

      return [];
    };

    const handleImageError = (event) => {
      event.target.src = "/placeholder-hotel.jpg";
    };

    const goBack = () => {
      router.push("/destinasi");
    };

    // Lifecycle
    onMounted(() => {
      fetchAkomodasi();
    });

    return {
      akomodasi,
      loading,
      error,
      currentSlide,
      fetchAkomodasi,
      nextSlide,
      previousSlide,
      formatPrice,
      parseFasilitas,
      handleImageError,
      goBack,
    };
  },
};
</script>

<style scoped>
.akomodasi-detail-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Loading State */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Error & Not Found States */
.error-state,
.not-found-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: white;
  text-align: center;
  padding: 2rem;
}

.error-icon,
.not-found-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.retry-btn,
.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.retry-btn:hover,
.back-btn:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 70vh;
  overflow: hidden;
}

.hero-slideshow {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-content {
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 2rem;
}

.hotel-name {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hotel-location {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.hotel-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.stars {
  display: flex;
  gap: 0.2rem;
}

.stars i {
  color: #ffd700;
  font-size: 1.2rem;
}

.stars i:not(.filled) {
  color: rgba(255, 255, 255, 0.3);
}

/* Slide Navigation */
.slide-dots {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: white;
}

.slide-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 10;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: white;
  color: #667eea;
  transform: scale(1.1);
}

/* Hero Fallback */
.hero-fallback {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fallback-content {
  text-align: center;
  color: white;
  padding: 2rem;
}

/* Hotel Info Section */
.hotel-info-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-title i {
  color: #667eea;
}

/* Stats Card */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 15px;
  color: white;
}

.stat-item i {
  font-size: 1.5rem;
  opacity: 0.9;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.9;
}

.stat-value {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Description Card */
.description-content p {
  line-height: 1.8;
  color: #666;
  font-size: 1.1rem;
}

/* Facilities Card */
.facilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.facility-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.facility-item i {
  color: #27ae60;
}

/* Contact Card */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.contact-item i {
  color: #667eea;
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.contact-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.2rem;
}

.contact-value {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-value:hover {
  color: #667eea;
}

/* Map Section */
.map-section {
  padding: 4rem 0;
  background: white;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: #667eea;
}

.map-container {
  margin-bottom: 2rem;
}

.leaflet-map {
  height: 400px;
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.location-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.address,
.coordinates {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  font-weight: 500;
}

.address i,
.coordinates i {
  color: #667eea;
}

/* Navigation Section */
.navigation-section {
  padding: 2rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
}

/* Map Popup Styles */
:global(.map-popup h4) {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-weight: 600;
}

:global(.map-popup p) {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

:global(.custom-div-icon) {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hotel-name {
    font-size: 2.5rem;
  }

  .hotel-location {
    font-size: 1.1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .facilities-grid {
    grid-template-columns: 1fr;
  }

  .slide-nav {
    padding: 0 1rem;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .hotel-name {
    font-size: 2rem;
  }

  .slide-content {
    padding: 1rem;
  }

  .info-card {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.5rem;
  }
}
</style>
