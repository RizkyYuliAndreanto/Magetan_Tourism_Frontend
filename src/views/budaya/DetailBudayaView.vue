<template>
  <div class="detail-budaya-view">
    <!-- Luxurious Cultural Background -->
    <div class="cultural-background">
      <div class="mountain-silhouettes"></div>
      <div class="temple-ornaments"></div>
      <div class="wayang-shadows"></div>
      <div class="gamelan-patterns"></div>
      <div class="batik-motifs"></div>
      <div class="floating-clouds"></div>
      <div class="cultural-glow"></div>
      <div class="tradition-particles"></div>
    </div>

    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="luxury-loading">
        <div class="cultural-spinner"></div>
        <p>Memuat detail budaya...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="luxury-error">
        <div class="error-icon">❌</div>
        <p>{{ error }}</p>
        <button @click="fetchBudayaDetail" class="retry-button">
          Coba Lagi
        </button>
      </div>

      <!-- Main Content -->
      <div v-if="!loading && !error && budayaData" class="detail-content">
        <!-- Back Button -->
        <div class="navigation-section">
          <button @click="goBack" class="back-button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" />
            </svg>
            <span>Kembali</span>
          </button>
        </div>

        <!-- Cultural Title Section -->
        <div class="title-section">
          <h1 class="cultural-title">
            <span class="title-gradient">{{ budayaData.judul_budaya }}</span>
          </h1>
          <div class="title-ornament"></div>
        </div>

        <!-- Main Cultural Image -->
        <div class="main-image-section">
          <div class="image-container">
            <div class="image-overlay"></div>
            <img
              v-if="budayaData.gambar_budaya"
              :src="`http://localhost:5000${budayaData.gambar_budaya}`"
              :alt="budayaData.judul_budaya"
              class="main-cultural-image" />
            <div v-else class="no-image-placeholder">
              <div class="temple-icon">🏛️</div>
              <span>Gambar tidak tersedia</span>
            </div>
            <div class="heritage-shine"></div>
          </div>
        </div>

        <!-- Description Section -->
        <div class="description-section">
          <div class="description-card">
            <div class="section-header">
              <h2 class="section-title">
                <span class="title-shimmer">Deskripsi</span>
              </h2>
              <div class="section-ornament">
                <div class="ornament-line"></div>
                <div class="ornament-icon">📜</div>
                <div class="ornament-line"></div>
              </div>
            </div>

            <div class="description-content">
              <p class="description-text">{{ budayaData.deskripsi_budaya }}</p>
            </div>
          </div>
        </div>

        <!-- Gallery Section -->
        <div
          v-if="budayaData.galeriBudaya && budayaData.galeriBudaya.length > 0"
          class="gallery-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-shimmer">Galeri</span>
            </h2>
            <div class="section-ornament">
              <div class="ornament-line"></div>
              <div class="ornament-icon">🖼️</div>
              <div class="ornament-line"></div>
            </div>
          </div>

          <div class="gallery-grid">
            <div
              v-for="(media, index) in budayaData.galeriBudaya"
              :key="media.id_media_galeri"
              class="gallery-item"
              :style="{ animationDelay: `${index * 0.1}s` }"
              @click="openLightbox(media, index)">
              <div class="gallery-image-container">
                <div class="gallery-overlay"></div>
                <img
                  :src="`http://localhost:5000${media.path_file}`"
                  :alt="media.deskripsi_file || `Galeri ${index + 1}`"
                  class="gallery-image" />
                <div class="gallery-hover-effect">
                  <div class="zoom-icon">🔍</div>
                  <p class="gallery-description" v-if="media.deskripsi_file">
                    {{ media.deskripsi_file }}
                  </p>
                </div>
                <div class="gallery-shine"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty Gallery State -->
        <div v-else class="empty-gallery">
          <div class="empty-icon">🖼️</div>
          <p>Belum ada galeri untuk budaya ini</p>
        </div>

        <!-- Cultural Info Section -->
        <div class="info-section">
          <div class="info-card">
            <div class="info-header">
              <div class="category-badge">
                <div class="badge-icon">
                  <span
                    v-if="
                      budayaData.kategori_budaya === 'Objek Pengembangan Budaya'
                    "
                    >🏛️</span
                  >
                  <span
                    v-else-if="
                      budayaData.kategori_budaya === 'Situs Kebudayaan'
                    "
                    >🏛️</span
                  >
                  <span v-else-if="budayaData.kategori_budaya === 'Sejarah'"
                    >📜</span
                  >
                  <span v-else>🏛️</span>
                </div>
                <span class="badge-text">{{ budayaData.kategori_budaya }}</span>
              </div>
            </div>

            <div class="info-details">
              <div class="info-item">
                <div class="info-label">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="info-icon">
                    <path
                      d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H11V21H5V3H14V8H21ZM20 19.5C20 21.43 18.43 23 16.5 23S13 21.43 13 19.5 14.57 16 16.5 16 20 17.57 20 19.5ZM16.5 18.5C15.67 18.5 15 19.17 15 20S15.67 21.5 16.5 21.5 18 20.83 18 20 17.33 18.5 16.5 18.5Z" />
                  </svg>
                  <span>Admin Pengelola</span>
                </div>
                <div class="info-value">
                  {{
                    budayaData.adminPengelola?.nama_lengkap || "Tidak diketahui"
                  }}
                  <span class="admin-level"
                    >({{
                      budayaData.adminPengelola?.level_akses || "Admin"
                    }})</span
                  >
                </div>
              </div>

              <div class="info-item">
                <div class="info-label">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="info-icon">
                    <path
                      d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H9V12H7V10ZM11 10H13V12H11V10ZM15 10H17V12H15V10ZM7 14H9V16H7V14ZM11 14H13V16H11V14ZM15 14H17V16H15V14Z" />
                  </svg>
                  <span>Tanggal Dibuat</span>
                </div>
                <div class="info-value">
                  {{ formatDate(budayaData.createdAt) }}
                </div>
              </div>

              <div
                class="info-item"
                v-if="budayaData.updatedAt !== budayaData.createdAt">
                <div class="info-label">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="info-icon">
                    <path
                      d="M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22S2 17.5 2 12S6.5 2 12 2ZM12 4C7.6 4 4 7.6 4 12S7.6 20 12 20S20 16.4 20 12S16.4 4 12 4ZM13 7H11V12.4L15.3 14.9L16.3 13.2L13 11.4V7Z" />
                  </svg>
                  <span>Terakhir Diperbarui</span>
                </div>
                <div class="info-value">
                  {{ formatDate(budayaData.updatedAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div v-if="showLightbox" class="lightbox-overlay" @click="closeLightbox">
      <div class="lightbox-container" @click.stop>
        <button @click="closeLightbox" class="lightbox-close">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
          </svg>
        </button>

        <div class="lightbox-navigation">
          <button
            @click="previousImage"
            class="nav-btn prev-btn"
            :disabled="currentImageIndex === 0">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" />
            </svg>
          </button>

          <div class="lightbox-content">
            <img
              :src="`http://localhost:5000${currentImage.path_file}`"
              :alt="currentImage.deskripsi_file"
              class="lightbox-image" />
            <div v-if="currentImage.deskripsi_file" class="lightbox-caption">
              {{ currentImage.deskripsi_file }}
            </div>
          </div>

          <button
            @click="nextImage"
            class="nav-btn next-btn"
            :disabled="
              currentImageIndex === budayaData.galeriBudaya.length - 1
            ">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
            </svg>
          </button>
        </div>

        <div class="lightbox-counter">
          {{ currentImageIndex + 1 }} / {{ budayaData.galeriBudaya.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/api/axios";

// Reactive data
const route = useRoute();
const router = useRouter();
const budayaData = ref(null);
const loading = ref(true);
const error = ref(null);

// Lightbox state
const showLightbox = ref(false);
const currentImage = ref(null);
const currentImageIndex = ref(0);

// Methods
const fetchBudayaDetail = async () => {
  loading.value = true;
  error.value = null;

  try {
    const budayaId = route.params.id;
    if (!budayaId) {
      throw new Error("ID budaya tidak ditemukan");
    }

    const response = await axios.get(`/budaya/${budayaId}`);
    budayaData.value = response.data;

    console.log("Detail budaya loaded:", budayaData.value);
  } catch (err) {
    console.error("Error fetching budaya detail:", err);
    error.value =
      err.response?.data?.message ||
      "Terjadi kesalahan saat memuat detail budaya";
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Tanggal tidak valid";
  }
};

const goBack = () => {
  router.go(-1);
};

// Lightbox functions
const openLightbox = (media, index) => {
  currentImage.value = media;
  currentImageIndex.value = index;
  showLightbox.value = true;
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  showLightbox.value = false;
  currentImage.value = null;
  currentImageIndex.value = 0;
  document.body.style.overflow = "auto";
};

const nextImage = () => {
  if (currentImageIndex.value < budayaData.value.galeriBudaya.length - 1) {
    currentImageIndex.value++;
    currentImage.value = budayaData.value.galeriBudaya[currentImageIndex.value];
  }
};

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
    currentImage.value = budayaData.value.galeriBudaya[currentImageIndex.value];
  }
};

// Keyboard navigation
const handleKeyPress = (event) => {
  if (!showLightbox.value) return;

  switch (event.key) {
    case "Escape":
      closeLightbox();
      break;
    case "ArrowLeft":
      previousImage();
      break;
    case "ArrowRight":
      nextImage();
      break;
  }
};

// Lifecycle
onMounted(() => {
  // Scroll ke atas halaman
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  fetchBudayaDetail();
  document.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyPress);
  document.body.style.overflow = "auto";
});
</script>

<style scoped>
/* ========== LUXURY CULTURAL BACKGROUND ========== */

.detail-budaya-view {
  position: relative;
  min-height: 100vh;
  font-family: "Inter", "Poppins", sans-serif;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0f172a 0%,
    #1e3a8a 25%,
    #3b82f6 50%,
    #dbeafe 75%,
    #ffffff 100%
  );
}

/* Cultural Animated Background */
.cultural-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
}

.mountain-silhouettes {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 35%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 350" opacity="0.12"><path d="M0,350 L180,180 L360,220 L540,140 L720,190 L900,120 L1080,160 L1200,350 Z" fill="%23FFFFFF"/><path d="M0,350 L150,260 L330,300 L510,200 L690,260 L870,160 L1050,230 L1200,350 Z" fill="%23F1F5F9" opacity="0.8"/></svg>')
    no-repeat center bottom;
  background-size: cover;
  animation: mountainSway 25s ease-in-out infinite;
}

.temple-ornaments {
  position: absolute;
  top: 20%;
  left: 10%;
  width: 80px;
  height: 80px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.08"><polygon points="50,10 65,30 85,25 75,45 95,55 75,65 85,85 65,80 50,100 35,80 15,85 25,65 5,55 25,45 15,25 35,30" fill="%233B82F6"/><circle cx="50" cy="50" r="15" fill="none" stroke="%233B82F6" stroke-width="2"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: templeFloat 20s ease-in-out infinite;
}

.wayang-shadows {
  position: absolute;
  top: 30%;
  right: 15%;
  width: 60px;
  height: 100px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 100" opacity="0.06"><path d="M30,10 Q20,20 25,35 Q15,45 20,60 Q10,70 15,85 Q25,95 30,90 Q35,95 45,85 Q40,70 50,60 Q45,45 55,35 Q40,20 30,10 Z" fill="%231E3A8A"/><circle cx="30" cy="25" r="3" fill="%23FFFFFF"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: wayangDance 18s ease-in-out infinite;
}

.gamelan-patterns {
  position: absolute;
  bottom: 20%;
  right: 25%;
  width: 70px;
  height: 70px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70" opacity="0.10"><circle cx="35" cy="35" r="30" fill="none" stroke="%23DBEAFE" stroke-width="2"/><circle cx="35" cy="35" r="20" fill="none" stroke="%233B82F6" stroke-width="3"/><circle cx="35" cy="35" r="10" fill="%231E3A8A"/><path d="M35,5 L40,25 L35,35 L30,25 Z" fill="%23F1F5F9"/><path d="M65,35 L45,40 L35,35 L45,30 Z" fill="%23F1F5F9"/><path d="M35,65 L30,45 L35,35 L40,45 Z" fill="%23F1F5F9"/><path d="M5,35 L25,30 L35,35 L25,40 Z" fill="%23F1F5F9"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: gamelanPulse 22s ease-in-out infinite;
}

.batik-motifs {
  position: absolute;
  top: 60%;
  left: 5%;
  width: 120px;
  height: 120px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" opacity="0.05"><defs><pattern id="batik" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="8" fill="none" stroke="%233B82F6" stroke-width="1"/><circle cx="15" cy="15" r="4" fill="%231E3A8A"/><path d="M15,7 Q22,15 15,23 Q8,15 15,7 Z" fill="%23DBEAFE"/></pattern></defs><rect width="120" height="120" fill="url(%23batik)"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: batikFlow 30s linear infinite;
}

.floating-clouds {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 150px;
  height: 80px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 80" opacity="0.08"><path d="M30,50 Q10,30 20,40 Q5,20 25,25 Q15,5 40,15 Q60,0 80,20 Q100,-5 120,15 Q140,5 130,25 Q145,20 135,40 Q150,30 130,50 Q120,60 100,55 Q80,70 60,55 Q40,65 30,50 Z" fill="%23F1F5F9"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: cloudDrift 35s ease-in-out infinite;
}

.cultural-glow {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.15) 0%,
    rgba(30, 58, 138, 0.1) 40%,
    transparent 70%
  );
  animation: culturalPulse 20s ease-in-out infinite;
}

.tradition-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" opacity="0.04"><circle cx="100" cy="100" r="2" fill="%233B82F6"><animate attributeName="opacity" values="0.4;1;0.4" dur="4s" repeatCount="indefinite" begin="0s"/></circle><circle cx="300" cy="150" r="1.5" fill="%231E3A8A"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="6s" repeatCount="indefinite" begin="1s"/></circle><circle cx="500" cy="200" r="2.5" fill="%23DBEAFE"><animate attributeName="opacity" values="0.6;1;0.6" dur="8s" repeatCount="indefinite" begin="2s"/></circle><circle cx="700" cy="120" r="1" fill="%233B82F6"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="5s" repeatCount="indefinite" begin="3s"/></circle><circle cx="200" cy="300" r="2" fill="%231E3A8A"><animate attributeName="opacity" values="0.5;1;0.5" dur="7s" repeatCount="indefinite" begin="4s"/></circle><circle cx="600" cy="350" r="1.5" fill="%23DBEAFE"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="9s" repeatCount="indefinite" begin="5s"/></circle><circle cx="150" cy="450" r="2.5" fill="%233B82F6"><animate attributeName="opacity" values="0.2;1;0.2" dur="6s" repeatCount="indefinite" begin="6s"/></circle><circle cx="450" cy="500" r="1" fill="%231E3A8A"><animate attributeName="opacity" values="0.6;0.9;0.6" dur="4s" repeatCount="indefinite" begin="7s"/></circle></svg>')
    no-repeat center;
  background-size: cover;
  animation: particleFloat 40s linear infinite;
}

/* Animations */
@keyframes mountainSway {
  0%,
  100% {
    transform: translateX(0) scale(1);
  }
  50% {
    transform: translateX(-5px) scale(1.02);
  }
}

@keyframes templeFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

@keyframes wayangDance {
  0%,
  100% {
    transform: translateX(0) skew(0deg);
  }
  25% {
    transform: translateX(-5px) skew(-2deg);
  }
  75% {
    transform: translateX(5px) skew(2deg);
  }
}

@keyframes gamelanPulse {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    opacity: 0.3;
  }
}

@keyframes batikFlow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes cloudDrift {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-20px);
  }
}

@keyframes culturalPulse {
  0%,
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 0.15;
  }
  50% {
    transform: translateX(-50%) scale(1.2);
    opacity: 0.25;
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
}

/* ========== MAIN CONTAINER ========== */

.container {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  padding-top: 6rem; /* Add top padding to avoid navbar overlap */
}

/* ========== LOADING & ERROR STATES ========== */

.luxury-loading {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
}

.cultural-spinner {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.luxury-error {
  text-align: center;
  padding: 4rem 2rem;
  color: #ef4444;
  background: linear-gradient(
    135deg,
    rgba(254, 242, 242, 0.9) 0%,
    rgba(255, 255, 255, 0.8) 100%
  );
  backdrop-filter: blur(20px);
  border-radius: 1rem;
  margin: 2rem 0;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
}

/* ========== NAVIGATION SECTION ========== */

.navigation-section {
  margin-bottom: 2rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  border: 2px solid rgba(59, 130, 246, 0.3);
  color: #1e3a8a;
  padding: 0.75rem 1.25rem;
  border-radius: 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.15);
  position: relative;
  z-index: 100; /* Ensure it's above other elements */
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.2);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(248, 250, 252, 0.95) 100%
  );
  border-color: rgba(59, 130, 246, 0.5);
}

.back-button svg {
  width: 20px;
  height: 20px;
}

/* ========== TITLE SECTION ========== */

.title-section {
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.8) 0%,
    rgba(30, 58, 138, 0.7) 50%,
    rgba(15, 23, 42, 0.8) 100%
  );
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  padding: 3rem 2rem;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cultural-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
}

.title-gradient {
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #f8fafc 30%,
    #ffffff 60%,
    #f1f5f9 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  animation: shimmer 3s ease-in-out infinite;
  /* Fallback for browsers that don't support background-clip: text */
  color: #ffffff;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
}

@keyframes shimmer {
  0%,
  100% {
    background-position: 0% 50%;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5),
      0 0 20px rgba(255, 255, 255, 0.3);
  }
  50% {
    background-position: 100% 50%;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7),
      0 0 30px rgba(255, 255, 255, 0.5);
  }
}

.title-ornament {
  width: 100px;
  height: 4px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #3b82f6 50%,
    transparent 100%
  );
  margin: 0 auto;
  position: relative;
}

.title-ornament::before,
.title-ornament::after {
  content: "";
  position: absolute;
  top: -2px;
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
}

.title-ornament::before {
  left: -4px;
}

.title-ornament::after {
  right: -4px;
}

/* ========== MAIN IMAGE SECTION ========== */

.main-image-section {
  margin-bottom: 3rem;
  display: flex;
  justify-content: center;
}

.image-container {
  position: relative;
  max-width: 800px;
  width: 100%;
  height: 500px;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 58, 138, 0.1) 0%,
    rgba(59, 130, 246, 0.05) 100%
  );
  z-index: 2;
}

.main-cultural-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.image-container:hover .main-cultural-image {
  transform: scale(1.05);
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-weight: 500;
  gap: 1rem;
}

.temple-icon {
  font-size: 4rem;
  opacity: 0.7;
  animation: templeGlow 2s ease-in-out infinite;
}

@keyframes templeGlow {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.heritage-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transform: translateX(-100%) translateY(-100%) rotate(45deg);
  transition: transform 0.8s ease;
}

.image-container:hover .heritage-shine {
  transform: translateX(100%) translateY(100%) rotate(45deg);
}

/* ========== INFO SECTION ========== */

.info-section {
  margin-bottom: 3rem;
}

.info-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(248, 250, 252, 0.8) 100%
  );
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.info-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.category-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 3rem;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 10px 30px rgba(30, 58, 138, 0.3);
  animation: badgeFloat 3s ease-in-out infinite;
}

@keyframes badgeFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.badge-icon {
  font-size: 1.5rem;
  animation: iconSpin 4s ease-in-out infinite;
}

@keyframes iconSpin {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-10deg);
  }
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1rem;
  border-left: 4px solid #3b82f6;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(5px);
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.08);
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #475569;
  font-weight: 600;
  flex-shrink: 0;
}

.info-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
}

.info-value {
  color: #1e3a8a;
  font-weight: 500;
  text-align: right;
  flex: 1;
  margin-left: 1rem;
}

.admin-level {
  color: #64748b;
  font-size: 0.9em;
  font-weight: 400;
}

/* ========== SECTION HEADERS ========== */

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.title-shimmer {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e3a8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  animation: shimmer 3s ease-in-out infinite;
}

.section-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.ornament-line {
  flex: 1;
  max-width: 100px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #3b82f6 50%,
    transparent 100%
  );
}

.ornament-icon {
  font-size: 1.5rem;
  padding: 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
  border-radius: 50%;
  color: white;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  animation: iconFloat 2s ease-in-out infinite;
}

@keyframes iconFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* ========== DESCRIPTION SECTION ========== */

.description-section {
  margin-bottom: 4rem;
}

.description-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 4rem 3rem; /* Increased padding for more breathing room */
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.description-content {
  max-width: 900px; /* Increased from 800px for better reading width */
  margin: 0 auto;
  padding: 1rem 0; /* Add some vertical padding */
}

.description-text {
  font-size: 1.25rem; /* Increased from 1.125rem */
  line-height: 1.9; /* Increased from 1.8 for better readability */
  color: #1f2937; /* Darker color for better contrast */
  text-align: justify;
  text-indent: 2rem;
  margin: 0;
  font-weight: 400; /* Regular weight for better readability */
  letter-spacing: 0.015em; /* Slight letter spacing for clarity */
  word-spacing: 0.05em; /* Slight word spacing */
}

/* ========== GALLERY SECTION ========== */

.gallery-section {
  margin-bottom: 4rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.gallery-item {
  position: relative;
  cursor: pointer;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.1);
  transition: all 0.4s ease;
  animation: gallerySlideIn 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  aspect-ratio: 4/3;
}

@keyframes gallerySlideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gallery-item:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.15);
}

.gallery-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 58, 138, 0.1) 0%,
    rgba(59, 130, 246, 0.05) 100%
  );
  z-index: 2;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  opacity: 0.8;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.1);
}

.gallery-hover-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: center;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 3;
}

.gallery-item:hover .gallery-hover-effect {
  opacity: 1;
}

.zoom-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  animation: zoomPulse 1.5s ease-in-out infinite;
}

@keyframes zoomPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.gallery-description {
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
  padding: 0 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.gallery-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 70%
  );
  transform: translateX(-100%) translateY(-100%) rotate(45deg);
  transition: transform 0.6s ease;
}

.gallery-item:hover .gallery-shine {
  transform: translateX(100%) translateY(100%) rotate(45deg);
}

/* ========== EMPTY GALLERY ========== */

.empty-gallery {
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.9) 0%,
    rgba(255, 255, 255, 0.8) 100%
  );
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  margin: 2rem 0;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

/* ========== LIGHTBOX ========== */

.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.lightbox-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: all 0.3s ease;
}

.lightbox-close:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.lightbox-close svg {
  width: 20px;
  height: 20px;
}

.lightbox-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
}

.nav-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn svg {
  width: 24px;
  height: 24px;
}

.lightbox-content {
  text-align: center;
  flex: 1;
}

.lightbox-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 0.5rem;
}

.lightbox-caption {
  margin-top: 1rem;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
}

.lightbox-counter {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.9rem;
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 768px) {
  .container {
    padding: 1rem;
    padding-top: 5rem; /* Adjust for mobile navbar */
  }

  .cultural-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .image-container {
    height: 300px;
  }

  .info-item {
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-label,
  .info-value {
    text-align: left;
  }

  .description-card {
    padding: 2.5rem 2rem; /* Adjusted for mobile */
  }

  .description-text {
    font-size: 1.125rem; /* Slightly smaller on mobile but still readable */
    text-indent: 1.5rem; /* Reduced indent on mobile */
    line-height: 1.85; /* Maintain good line height */
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .lightbox-navigation {
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .prev-btn {
    left: 1rem;
  }

  .next-btn {
    right: 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding-top: 4.5rem; /* Adjust for smaller mobile screens */
  }

  .cultural-title {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .image-container {
    height: 250px;
  }

  .description-card,
  .info-card {
    padding: 2rem 1.5rem; /* Better mobile padding */
  }

  .description-text {
    font-size: 1.1rem; /* Maintain readability on small screens */
    text-indent: 1rem;
    line-height: 1.8;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
<style scoped>
.detail-budaya-view {
  overflow-y: auto;
}
</style>
