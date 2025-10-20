<template>
  <div class="detail-informasi-view">
    <!-- Luxurious Background -->
    <div class="luxury-background">
      <div class="mountain-silhouettes"></div>
      <div class="floating-clouds"></div>
      <div class="information-patterns"></div>
      <div class="blue-glow"></div>
      <div class="light-waves"></div>
      <div class="floating-particles"></div>
    </div>

    <div class="main-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Memuat detail informasi...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">Terjadi Kesalahan</h2>
        <p class="error-message">{{ error }}</p>
        <button @click="fetchData" class="retry-button">
          <svg class="retry-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
          Coba Lagi
        </button>
      </div>

      <!-- Main Content -->
      <div v-else-if="informasi" class="detail-container">
        <!-- Navigation -->
        <div class="navigation-section">
          <button @click="goBack" class="back-button">
            <svg class="back-icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" />
            </svg>
            <span>Kembali</span>
          </button>
        </div>

        <!-- Header Section -->
        <header class="article-header">
          <!-- Category Badge -->
          <div class="category-container">
            <div class="category-badge">
              <span class="badge-icon">🏷️</span>
              <span class="badge-text">{{
                informasi.kategoriBerita?.nama_kategori || "Informasi"
              }}</span>
            </div>
          </div>

          <!-- Title -->
          <h1 class="article-title">{{ informasi.judul }}</h1>

          <!-- Meta Information -->
          <div class="article-meta">
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
              </svg>
              <span>{{ formatDate(informasi.tanggal_publikasi) }}</span>
            </div>
            <div class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              <span>{{ informasi.jumlah_dilihat || 0 }} kali dilihat</span>
            </div>
            <div v-if="informasi.adminPembuat" class="meta-item">
              <svg class="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span>{{ informasi.adminPembuat.nama || "Admin" }}</span>
            </div>
          </div>
        </header>

        <!-- Hero Image -->
        <div v-if="informasi.gambar_hero_berita" class="hero-image-container">
          <img
            :src="getImageUrl(informasi.gambar_hero_berita)"
            :alt="informasi.judul"
            class="hero-image"
            @error="handleImageError" />
          <div class="image-caption">
            <span>{{ informasi.judul }}</span>
          </div>
        </div>

        <!-- Article Content -->
        <article class="article-content">
          <div class="content-wrapper">
            <div
              class="article-body"
              v-html="formatContent(informasi.isi_berita)"></div>
          </div>
        </article>

        <!-- Action Buttons -->
        <div class="action-section">
          <div class="action-buttons">
            <button @click="shareArticle" class="action-button share-button">
              <svg class="action-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
              </svg>
              <span>Bagikan</span>
            </button>

            <button @click="printArticle" class="action-button print-button">
              <svg class="action-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
              </svg>
              <span>Cetak</span>
            </button>

            <button @click="goBack" class="action-button back-button-alt">
              <svg class="action-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" />
              </svg>
              <span>Kembali ke Daftar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();

// Reactive Data
const informasi = ref(null);
const loading = ref(true);
const error = ref(null);

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Methods
const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const id = route.params.id;
    const response = await axios.get(`${API_BASE_URL}/api/berita/${id}`);
    informasi.value = response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      error.value = "Informasi tidak ditemukan.";
    } else {
      error.value = "Gagal memuat detail informasi. Silakan coba lagi nanti.";
    }
    console.error("Error fetching detail:", err);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};

const handleImageError = (event) => {
  event.target.src =
    "https://via.placeholder.com/800x400/e2e8f0/64748b?text=Image+Not+Found";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const formatContent = (content) => {
  if (!content) return "";

  // Basic HTML formatting
  return content
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>")
    .replace(/<p><\/p>/g, "");
};

const goBack = () => {
  router.back();
};

const shareArticle = () => {
  if (navigator.share) {
    navigator
      .share({
        title: informasi.value.judul,
        text: getPreviewText(informasi.value.isi_berita, 100),
        url: window.location.href,
      })
      .catch((err) => console.log("Error sharing:", err));
  } else {
    // Fallback: copy URL to clipboard
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("Link berhasil disalin ke clipboard!");
      })
      .catch((err) => {
        console.log("Error copying to clipboard:", err);
      });
  }
};

const printArticle = () => {
  window.print();
};

const getPreviewText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

// Lifecycle
onMounted(() => {
  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  fetchData();
});
</script>

<style scoped>
/* ========== LUXURY BACKGROUND ========== */
.luxury-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.mountain-silhouettes,
.floating-clouds,
.information-patterns,
.blue-glow,
.light-waves,
.floating-particles {
  position: absolute;
}

.mountain-silhouettes {
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.1), transparent);
  clip-path: polygon(
    0 100%,
    0 60%,
    15% 50%,
    30% 70%,
    50% 45%,
    70% 65%,
    85% 40%,
    100% 55%,
    100% 100%
  );
}

.floating-clouds {
  top: 10%;
  width: 100%;
  height: 40%;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 70%
  );
  border-radius: 50%;
  animation: float 20s ease-in-out infinite;
}

.information-patterns {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
    circle at 25% 25%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
}

.blue-glow {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background: radial-gradient(
    ellipse at center,
    rgba(37, 99, 235, 0.2) 0%,
    transparent 70%
  );
  animation: pulse 8s ease-in-out infinite;
}

.light-waves {
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  animation: wave 15s linear infinite;
}

.floating-particles {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      2px 2px at 20px 30px,
      rgba(255, 255, 255, 0.3),
      transparent
    ),
    radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.2), transparent);
  background-repeat: repeat;
  background-size: 150px 100px;
  animation: sparkle 10s linear infinite;
}

/* ========== MAIN CONTENT ========== */
.detail-informasi-view {
  min-height: 100vh;
  font-family: "Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.main-content {
  position: relative;
  z-index: 1;
  padding-top: 80px;
}

/* ========== LOADING & ERROR STATES ========== */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px 20px;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 24px;
}

.loading-text {
  color: white;
  font-size: 1.1rem;
  opacity: 0.9;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 24px;
}

.error-title {
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.error-message {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 32px;
  max-width: 500px;
}

.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.retry-icon {
  width: 18px;
  height: 18px;
}

/* ========== DETAIL CONTAINER ========== */
.detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

/* ========== NAVIGATION ========== */
.navigation-section {
  margin-bottom: 32px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.back-icon {
  width: 18px;
  height: 18px;
}

/* ========== ARTICLE HEADER ========== */
.article-header {
  margin-bottom: 40px;
}

.category-container {
  margin-bottom: 24px;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #3b82f6, #1e3a8a);
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.badge-icon {
  font-size: 1.1rem;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  line-height: 1.2;
  margin-bottom: 24px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.article-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  font-weight: 500;
}

.meta-icon {
  width: 18px;
  height: 18px;
  opacity: 0.8;
}

/* ========== HERO IMAGE ========== */
.hero-image-container {
  position: relative;
  margin-bottom: 40px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  padding: 24px;
  font-size: 1.1rem;
  font-weight: 500;
}

/* ========== ARTICLE CONTENT ========== */
.article-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  overflow: hidden;
}

.content-wrapper {
  padding: 40px;
}

.article-body {
  line-height: 1.8;
  color: #374151;
  font-size: 1.1rem;
}

.article-body :deep(p) {
  margin-bottom: 1.5rem;
  text-align: justify;
}

.article-body :deep(p:last-child) {
  margin-bottom: 0;
}

.article-body :deep(br) {
  margin-bottom: 0.5rem;
}

/* ========== ACTION SECTION ========== */
.action-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.share-button {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.share-button:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.print-button {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
}

.print-button:hover {
  background: linear-gradient(135deg, #4b5563, #374151);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(107, 114, 128, 0.3);
}

.back-button-alt {
  background: linear-gradient(135deg, #3b82f6, #1e3a8a);
  color: white;
}

.back-button-alt:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.action-icon {
  width: 18px;
  height: 18px;
}

/* ========== ANIMATIONS ========== */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.4;
  }
}

@keyframes wave {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100px 0;
  }
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* ========== RESPONSIVE DESIGN ========== */
@media (max-width: 768px) {
  .main-content {
    padding-top: 60px;
  }

  .detail-container {
    padding: 0 15px 40px;
  }

  .article-title {
    font-size: 2rem;
  }

  .article-meta {
    flex-direction: column;
    gap: 12px;
  }

  .hero-image {
    height: 250px;
  }

  .content-wrapper {
    padding: 24px;
  }

  .article-body {
    font-size: 1rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .action-button {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .article-title {
    font-size: 1.6rem;
  }

  .hero-image {
    height: 200px;
  }

  .content-wrapper {
    padding: 20px;
  }

  .action-section {
    padding: 20px;
  }
}

/* ========== PRINT STYLES ========== */
@media print {
  .luxury-background,
  .navigation-section,
  .action-section {
    display: none !important;
  }

  .main-content {
    padding-top: 0;
  }

  .article-title {
    color: #000 !important;
    text-shadow: none !important;
  }

  .article-meta {
    color: #666 !important;
  }

  .article-content {
    box-shadow: none !important;
    border: 1px solid #ddd;
  }
}
</style>
<style scoped>
.detail-informasi-view {
  overflow-y: auto;
}
</style>
