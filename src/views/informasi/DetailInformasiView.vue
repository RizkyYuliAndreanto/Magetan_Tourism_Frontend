<template>
  <div class="detail-informasi-view">
    <!-- Modern News Portal Background -->
    <div class="modern-background">
      <div class="gradient-overlay"></div>
      <div class="pattern-dots"></div>
      <div class="floating-shapes"></div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="modern-loader">
        <div class="loader-ring"></div>
        <div class="loader-text">Memuat artikel...</div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-card">
        <div class="error-icon">📰</div>
        <h3 class="error-title">Artikel Tidak Ditemukan</h3>
        <p class="error-message">{{ error }}</p>
        <button @click="fetchData" class="retry-button">
          <svg
            class="retry-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">
            <path
              d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.07.74 5.61 1.98" />
            <path d="M17 2l4 4-4 4" />
          </svg>
          Coba Lagi
        </button>
      </div>
    </div>

    <!-- Main Article Content -->
    <main v-else-if="informasi" class="article-main">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-container">
          <!-- Back Button -->
          <div class="back-navigation">
            <button @click="goBack" class="simple-back-btn">
              <svg
                class="back-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Kembali ke Daftar
            </button>
          </div>

          <!-- Article Meta Info -->
          <div class="article-meta-top">
            <span class="category-badge">
              <svg
                class="category-icon"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
              {{ informasi.kategoriBerita?.nama_kategori || "Informasi" }}
            </span>
            <div class="article-stats">
              <span class="stat-item">
                <svg
                  class="stat-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {{ formatDate(informasi.tanggal_publikasi) }}
              </span>
              <span class="stat-item">
                <svg
                  class="stat-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {{ formatViews(informasi.jumlah_dilihat || 0) }} views
              </span>
              <span class="stat-item">
                <svg
                  class="stat-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {{ informasi.adminPembuat?.nama || "Admin" }}
              </span>
            </div>
          </div>

          <!-- Article Title -->
          <h1 class="article-title">{{ informasi.judul }}</h1>

          <!-- Reading Time & Share Preview -->
          <div class="article-info">
            <span class="reading-time">
              <svg
                class="time-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              {{ getReadingTime(informasi.isi_berita) }} menit baca
            </span>
          </div>
        </div>
      </section>

      <!-- Hero Image Section -->
      <section class="hero-image-section">
        <div class="image-container">
          <img
            v-if="informasi.gambar_hero_berita"
            :src="getImageUrl(informasi.gambar_hero_berita)"
            :alt="informasi.judul"
            class="hero-image"
            @error="handleImageError" />
          <div class="image-overlay">
            <div class="overlay-gradient"></div>
          </div>
        </div>
      </section>

      <!-- Article Content -->
      <section class="content-section">
        <div class="content-container">
          <article class="article-content">
            <div
              class="content-body"
              v-html="formatContent(informasi.isi_berita)"></div>
          </article>

          <!-- Article Actions -->
          <div class="article-actions">
            <button @click="shareArticle" class="action-btn primary">
              <svg
                class="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Bagikan
            </button>
            <button @click="printArticle" class="action-btn secondary">
              <svg
                class="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">
                <polyline points="6,9 6,2 18,2 18,9" />
                <path
                  d="M6,18H4a2,2,0,0,1-2-2v-5a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18" />
                <polyline points="6,14 6,22 18,22 18,14" />
              </svg>
              Cetak
            </button>
            <button @click="goBack" class="action-btn tertiary">
              <svg
                class="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">
                <path d="M3 12h18M12 5l7 7-7 7" />
              </svg>
              Kembali
            </button>
          </div>
        </div>
      </section>

      <!-- Related Articles Section -->
      <section class="related-section">
        <div class="related-container">
          <h3 class="related-title">Artikel Terkait</h3>
          <div class="related-grid">
            <!-- Placeholder for related articles -->
            <div class="related-card" v-for="i in 3" :key="i">
              <div class="related-image">
                <img
                  src="https://via.placeholder.com/200x120/EAF4FF/007BFF?text=Artikel"
                  alt="Related Article" />
              </div>
              <div class="related-content">
                <h4 class="related-card-title">Artikel Terkait {{ i }}</h4>
                <p class="related-excerpt">
                  Deskripsi singkat artikel terkait...
                </p>
                <span class="related-date">{{
                  new Date().toLocaleDateString("id-ID")
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
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
    "https://via.placeholder.com/1200x600/f8fafc/64748b?text=Gambar+Tidak+Tersedia";
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

  // Enhanced HTML formatting with better typography
  let formattedContent = content
    .replace(/\n\n/g, "</p><p class='content-paragraph'>")
    .replace(/\n/g, "<br>")
    .replace(/^/, "<p class='content-paragraph'>")
    .replace(/$/, "</p>")
    .replace(/<p class='content-paragraph'><\/p>/g, "");

  // Add emphasis for important text (basic markdown-like support)
  formattedContent = formattedContent
    .replace(/\*\*(.*?)\*\*/g, "<strong class='content-strong'>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em class='content-emphasis'>$1</em>");

  return formattedContent;
};

const getReadingTime = (content) => {
  if (!content) return 0;
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

const formatViews = (views) => {
  if (views < 1000) return views.toString();
  if (views < 1000000) return (views / 1000).toFixed(1) + "K";
  return (views / 1000000).toFixed(1) + "M";
};

const getCategoryIcon = (categoryName) => {
  if (!categoryName) return "📰";
  const name = categoryName.toLowerCase();
  if (name.includes("wisata") || name.includes("pariwisata")) return "🏖️";
  if (name.includes("budaya") || name.includes("tradisi")) return "🎭";
  if (name.includes("teknologi") || name.includes("digital")) return "💻";
  if (name.includes("kesehatan") || name.includes("health")) return "🏥";
  if (name.includes("pendidikan") || name.includes("education")) return "📚";
  if (name.includes("ekonomi") || name.includes("business")) return "💼";
  if (name.includes("olahraga") || name.includes("sport")) return "⚽";
  if (name.includes("lingkungan") || name.includes("environment")) return "🌱";
  return "📰";
};

const getCategoryClass = (categoryName) => {
  if (!categoryName) return "default";
  const name = categoryName.toLowerCase();
  if (name.includes("wisata") || name.includes("pariwisata")) return "tourism";
  if (name.includes("budaya") || name.includes("tradisi")) return "culture";
  if (name.includes("teknologi") || name.includes("digital"))
    return "technology";
  if (name.includes("kesehatan") || name.includes("health")) return "health";
  if (name.includes("pendidikan") || name.includes("education"))
    return "education";
  if (name.includes("ekonomi") || name.includes("business")) return "business";
  if (name.includes("olahraga") || name.includes("sport")) return "sports";
  if (name.includes("lingkungan") || name.includes("environment"))
    return "environment";
  return "default";
};

const getArticleTags = (categoryName) => {
  if (!categoryName) return ["informasi", "magetan"];
  const name = categoryName.toLowerCase();
  const tags = ["magetan"];

  if (name.includes("wisata")) tags.push("wisata", "destinasi", "traveling");
  if (name.includes("budaya")) tags.push("budaya", "tradisi", "warisan");
  if (name.includes("teknologi")) tags.push("teknologi", "digital", "inovasi");
  if (name.includes("kesehatan")) tags.push("kesehatan", "medis", "wellness");
  if (name.includes("pendidikan"))
    tags.push("pendidikan", "sekolah", "belajar");
  if (name.includes("ekonomi")) tags.push("ekonomi", "bisnis", "keuangan");

  tags.push("informasi");
  return tags;
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

const shareToFacebook = () => {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
};

const shareToTwitter = () => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(informasi.value.judul);
  window.open(
    `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    "_blank"
  );
};

const shareToWhatsApp = () => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(
    `${informasi.value.judul} - ${window.location.href}`
  );
  window.open(`https://wa.me/?text=${text}`, "_blank");
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
  // Scroll to top with smooth animation
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  fetchData();
});
</script>

<style scoped>
/* ========== MODERN NEWS PORTAL DESIGN ========== */
* {
  box-sizing: border-box;
}

.detail-informasi-view {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", "Roboto",
    "Helvetica Neue", Arial, sans-serif;
  line-height: 1.6;
  color: #1a202c;
  background: #ffffff;
  overflow-y: auto;

}

/* ========== MODERN BACKGROUND ========== */
.modern-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(180deg, #eaf4ff 0%, #ffffff 45%, #f5f7fa 100%);
  overflow: hidden;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    135deg,
    rgba(0, 123, 255, 0.03) 0%,
    rgba(0, 123, 255, 0.08) 50%,
    transparent 100%
  );
}

.pattern-dots {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba(0, 123, 255, 0.1) 1px,
    transparent 0
  );
  background-size: 40px 40px;
  animation: patternMove 60s linear infinite;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      ellipse at 20% 20%,
      rgba(0, 123, 255, 0.04) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse at 80% 80%,
      rgba(99, 179, 237, 0.04) 0%,
      transparent 50%
    );
  animation: floatShapes 30s ease-in-out infinite;
}

/* ========== LOADING STATES ========== */
.loading-container,
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 40px 20px;
}

.modern-loader {
  text-align: center;
}

.loader-ring {
  width: 50px;
  height: 50px;
  border: 4px solid #eaf4ff;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

.loader-text {
  color: #4a5568;
  font-weight: 500;
}

.error-card {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 400px;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
}

.error-message {
  color: #718096;
  margin-bottom: 24px;
}

.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.retry-icon {
  width: 18px;
  height: 18px;
}

/* ========== MAIN ARTICLE ========== */
.article-main {
  margin-top: 0;
}

/* ========== HERO SECTION ========== */
.hero-section {
  padding: 80px 20px 60px;
  background: linear-gradient(
    135deg,
    #eaf4ff 0%,
    rgba(255, 255, 255, 0.9) 100%
  );
}

.hero-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.back-navigation {
  margin-bottom: 32px;
  text-align: left;
}

.simple-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  color: #007bff;
  border: 2px solid #007bff;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.simple-back-btn:hover {
  background: #007bff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
}

.back-arrow {
  width: 18px;
  height: 18px;
}

.article-meta-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-icon {
  width: 16px;
  height: 16px;
}

.article-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-icon {
  width: 16px;
  height: 16px;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a202c;
  line-height: 1.2;
  margin-bottom: 24px;
  font-family: "Georgia", "Times New Roman", serif;
}

.article-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.reading-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
}

.time-icon {
  width: 16px;
  height: 16px;
}

/* ========== HERO IMAGE ========== */
.hero-image-section {
  padding: 0 20px 40px;
}

.image-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.overlay-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
}

/* ========== CONTENT SECTION ========== */
.content-section {
  padding: 40px 20px;
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
}

.article-content {
  background: white;
  border-radius: 16px;
  padding: 50px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 123, 255, 0.08);
}

.content-body {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #2d3748;
  font-family: "Georgia", "Times New Roman", serif;
}

.content-body :deep(p) {
  margin-bottom: 1.5rem;
  text-align: justify;
}

.content-body :deep(p:first-child) {
  font-size: 1.2rem;
  font-weight: 500;
  color: #1a202c;
}

.content-body :deep(strong) {
  font-weight: 700;
  color: #1a202c;
}

.content-body :deep(em) {
  font-style: italic;
  color: #007bff;
}

/* ========== ARTICLE ACTIONS ========== */
.article-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 2px solid transparent;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #007bff;
  color: white;
}

.action-btn.primary:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
}

.action-btn.secondary {
  background: #f5f7fa;
  color: #4a5568;
  border-color: #e2e8f0;
}

.action-btn.secondary:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
  transform: translateY(-2px);
}

.action-btn.tertiary {
  background: transparent;
  color: #007bff;
  border-color: #007bff;
}

.action-btn.tertiary:hover {
  background: #eaf4ff;
  transform: translateY(-2px);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* ========== RELATED ARTICLES ========== */
.related-section {
  padding: 60px 20px;
  background: #f5f7fa;
}

.related-container {
  max-width: 1000px;
  margin: 0 auto;
}

.related-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a202c;
  text-align: center;
  margin-bottom: 40px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.related-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
}

.related-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.related-image {
  height: 160px;
  overflow: hidden;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-card:hover .related-image img {
  transform: scale(1.05);
}

.related-content {
  padding: 20px;
}

.related-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
  line-height: 1.4;
}

.related-excerpt {
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 12px;
  line-height: 1.5;
}

.related-date {
  color: #718096;
  font-size: 0.85rem;
  font-weight: 500;
}

/* ========== ANIMATIONS ========== */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes patternMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 40px 40px;
  }
}

@keyframes floatShapes {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(1deg);
  }
  66% {
    transform: translateY(5px) rotate(-1deg);
  }
}

/* ========== RESPONSIVE DESIGN ========== */
@media (max-width: 768px) {
  .article-main {
    margin-top: 0;
  }

  .hero-section {
    padding: 40px 15px;
  }

  .article-title {
    font-size: 1.8rem;
  }

  .article-meta-top,
  .article-stats {
    flex-direction: column;
    gap: 12px;
  }

  .hero-image {
    height: 250px;
  }

  .article-content {
    padding: 30px 25px;
  }

  .content-body {
    font-size: 1rem;
  }

  .action-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 30px 10px;
  }

  .article-title {
    font-size: 1.5rem;
  }

  .article-content {
    padding: 20px;
  }

  .action-btn {
    padding: 8px 16px;
    font-size: 0.85rem;
  }

  .article-actions {
    flex-direction: column;
  }
}

/* ========== PRINT STYLES ========== */
@media print {
  .modern-background,
  .article-actions,
  .related-section {
    display: none !important;
  }

  .article-main {
    margin-top: 0;
  }

  .article-content {
    box-shadow: none;
    border: none;
    padding: 0;
  }

  .article-title {
    color: #000;
  }

  .content-body {
    font-size: 12pt;
    line-height: 1.6;
  }
}
</style>
