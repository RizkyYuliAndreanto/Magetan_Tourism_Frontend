<template>
  <div class="informasi-view">
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
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-container">
          <h1 class="page-title">
            <span class="title-gradient">Pusat Informasi</span>
            <span class="title-accent">Magetan</span>
          </h1>
          <p class="page-subtitle">
            Dapatkan informasi terbaru seputar kegiatan, program, dan layanan
            dari Dinas Kebudayaan dan Pariwisata Kabupaten Magetan
          </p>
          <div class="hero-ornament"></div>
        </div>
      </section>

      <!-- Search and Filter Section -->
      <section class="search-filter-section">
        <div class="search-container">
          <!-- Search Bar -->
          <div class="search-wrapper">
            <div class="search-input-container">
              <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari informasi berdasarkan judul atau kata kunci..."
                class="search-input"
                @input="handleSearch" />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="clear-search">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Category Filter -->
          <div class="filter-wrapper">
            <div class="category-tabs">
              <button
                @click="filterByCategory(null)"
                :class="[
                  'category-tab',
                  { active: selectedCategory === null },
                ]">
                <span class="tab-icon">📋</span>
                <span class="tab-text">Semua</span>
                <span class="tab-count">({{ totalItems }})</span>
              </button>
              <button
                v-for="category in categories"
                :key="category.id_kategori"
                @click="filterByCategory(category.id_kategori)"
                :class="[
                  'category-tab',
                  { active: selectedCategory === category.id_kategori },
                ]">
                <span class="tab-icon">📁</span>
                <span class="tab-text">{{ category.nama_kategori }}</span>
                <span class="tab-count"
                  >({{ getCategoryCount(category.id_kategori) }})</span
                >
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Information Grid Section -->
      <section class="information-grid-section">
        <div class="grid-container">
          <!-- Section Header -->
          <div class="section-header">
            <h2 class="section-title">
              {{ getSectionTitle() }}
            </h2>
            <div class="section-divider"></div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p class="loading-text">Memuat informasi...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <div class="error-icon">⚠️</div>
            <h3 class="error-title">Terjadi Kesalahan</h3>
            <p class="error-message">{{ error }}</p>
            <button @click="fetchData" class="retry-button">
              <svg class="retry-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
              Coba Lagi
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredInformasi.length === 0" class="empty-state">
            <div class="empty-icon">📄</div>
            <h3 class="empty-title">{{ getEmptyStateTitle() }}</h3>
            <p class="empty-message">{{ getEmptyStateMessage() }}</p>
            <button
              v-if="searchQuery || selectedCategory"
              @click="clearFilters"
              class="clear-filters-button">
              Tampilkan Semua Informasi
            </button>
          </div>

          <!-- Information Cards Grid -->
          <div v-else class="information-grid">
            <article
              v-for="item in filteredInformasi"
              :key="item.id_berita"
              class="information-card"
              @click="navigateToDetail(item.id_berita)">
              <!-- Card Image -->
              <div class="card-image-container">
                <img
                  :src="getImageUrl(item.gambar_hero_berita)"
                  :alt="item.judul"
                  class="card-image"
                  @error="handleImageError" />
                <div class="image-overlay">
                  <div class="view-detail-hint">
                    <svg
                      class="detail-icon"
                      viewBox="0 0 24 24"
                      fill="currentColor">
                      <path
                        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                    <span>Lihat Detail</span>
                  </div>
                </div>
              </div>

              <!-- Card Content -->
              <div class="card-content">
                <!-- Category Badge -->
                <div class="category-badge">
                  <span class="badge-icon">🏷️</span>
                  <span class="badge-text">{{
                    item.kategoriBerita?.nama_kategori || "Informasi"
                  }}</span>
                </div>

                <!-- Card Title -->
                <h3 class="card-title">{{ item.judul }}</h3>

                <!-- Card Summary -->
                <p class="card-summary">
                  {{ getPreviewText(item.isi_berita) }}
                </p>

                <!-- Card Meta -->
                <div class="card-meta">
                  <div class="meta-item">
                    <svg
                      class="meta-icon"
                      viewBox="0 0 24 24"
                      fill="currentColor">
                      <path
                        d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                    </svg>
                    <span>{{ formatDate(item.tanggal_publikasi) }}</span>
                  </div>
                  <div class="meta-item">
                    <svg
                      class="meta-icon"
                      viewBox="0 0 24 24"
                      fill="currentColor">
                      <path
                        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                    <span>{{ item.jumlah_dilihat || 0 }} views</span>
                  </div>
                </div>

                <!-- Read More Button -->
                <button class="read-more-button">
                  <span class="button-text">Baca Selengkapnya</span>
                  <svg
                    class="button-arrow"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path
                      d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
                  </svg>
                </button>
              </div>

              <!-- Card Decorations -->
              <div class="card-decorations">
                <div class="corner-accent top-left"></div>
                <div class="corner-accent top-right"></div>
                <div class="corner-accent bottom-left"></div>
                <div class="corner-accent bottom-right"></div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

// Reactive Data
const informasiList = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");
const selectedCategory = ref(null);

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Computed Properties
const filteredInformasi = computed(() => {
  let filtered = informasiList.value;

  // Filter by category
  if (selectedCategory.value !== null) {
    filtered = filtered.filter(
      (item) => item.id_kategori === selectedCategory.value
    );
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.judul.toLowerCase().includes(query) ||
        item.isi_berita.toLowerCase().includes(query) ||
        item.kategoriBerita?.nama_kategori.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const totalItems = computed(() => informasiList.value.length);

// Methods
const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Fetch informasi/berita
    const informasiResponse = await axios.get(`${API_BASE_URL}/api/berita`);
    informasiList.value = informasiResponse.data;

    // Fetch categories
    const categoriesResponse = await axios.get(
      `${API_BASE_URL}/api/kategori-berita`
    );
    categories.value = categoriesResponse.data;
  } catch (err) {
    error.value = "Gagal memuat data informasi. Silakan coba lagi nanti.";
    console.error("Error fetching data:", err);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://via.placeholder.com/400x250/e2e8f0/64748b?text=No+Image";
  }
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  return `${API_BASE_URL}${imagePath}`;
};

const handleImageError = (event) => {
  event.target.src =
    "https://via.placeholder.com/400x250/e2e8f0/64748b?text=Image+Not+Found";
};

const getPreviewText = (text, maxLength = 150) => {
  if (!text) return "Tidak ada preview tersedia.";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const getCategoryCount = (categoryId) => {
  return informasiList.value.filter((item) => item.id_kategori === categoryId)
    .length;
};

const getSectionTitle = () => {
  if (searchQuery.value.trim()) {
    return `Hasil Pencarian: "${searchQuery.value}"`;
  }
  if (selectedCategory.value !== null) {
    const category = categories.value.find(
      (cat) => cat.id_kategori === selectedCategory.value
    );
    return `Informasi ${category?.nama_kategori || "Kategori"}`;
  }
  return "Semua Informasi Terbaru";
};

const getEmptyStateTitle = () => {
  if (searchQuery.value.trim()) {
    return "Tidak Ditemukan";
  }
  if (selectedCategory.value !== null) {
    return "Belum Ada Informasi";
  }
  return "Belum Ada Data";
};

const getEmptyStateMessage = () => {
  if (searchQuery.value.trim()) {
    return `Tidak ada informasi yang cocok dengan pencarian "${searchQuery.value}". Coba gunakan kata kunci yang berbeda.`;
  }
  if (selectedCategory.value !== null) {
    const category = categories.value.find(
      (cat) => cat.id_kategori === selectedCategory.value
    );
    return `Belum ada informasi untuk kategori ${
      category?.nama_kategori || "ini"
    }.`;
  }
  return "Belum ada informasi yang tersedia saat ini.";
};

const handleSearch = () => {
  // Real-time search handled by computed property
};

const clearSearch = () => {
  searchQuery.value = "";
};

const filterByCategory = (categoryId) => {
  selectedCategory.value = categoryId;
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = null;
};

const navigateToDetail = (id) => {
  // Navigate to detail page - adjust route name as needed
  router.push({ name: "DetailInformasi", params: { id } });
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

// Watch for route changes
watch(
  () => router.currentRoute.value,
  () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
);
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

.mountain-silhouettes {
  position: absolute;
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
  position: absolute;
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 25% 25%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 75% 75%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%
    );
}

.blue-glow {
  position: absolute;
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
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.03) 75%,
    rgba(255, 255, 255, 0.06) 100%
  );
  animation: wave 15s linear infinite;
}

.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      2px 2px at 20px 30px,
      rgba(255, 255, 255, 0.3),
      transparent
    ),
    radial-gradient(1px 1px at 40px 70px, rgba(255, 255, 255, 0.2), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(
      2px 2px at 130px 80px,
      rgba(255, 255, 255, 0.2),
      transparent
    );
  background-repeat: repeat;
  background-size: 150px 100px;
  animation: sparkle 10s linear infinite;
}

/* ========== MAIN CONTENT ========== */
.informasi-view {
  min-height: 100vh;
  font-family: "Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.main-content {
  position: relative;
  z-index: 1;
  padding-top: 80px;
}

/* ========== HERO SECTION ========== */
.hero-section {
  padding: 60px 20px 40px;
  text-align: center;
}

.hero-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.page-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1.1;
}

.title-gradient {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
}

.title-accent {
  color: #1f2937;
  display: block;
  margin-top: 8px;
}

.page-subtitle {
  font-size: 1.25rem;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-ornament {
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #3b82f6, #1e3a8a);
  margin: 0 auto;
  border-radius: 2px;
}

/* ========== SEARCH AND FILTER SECTION ========== */
.search-filter-section {
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-wrapper {
  margin-bottom: 32px;
}

.search-input-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.search-input {
  width: 100%;
  padding: 16px 50px 16px 50px;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 50px;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
}

.clear-search {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.clear-search:hover {
  background-color: #f3f4f6;
}

.clear-search svg {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.filter-wrapper {
  display: flex;
  justify-content: center;
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 8px;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #6b7280;
  position: relative;
}

.category-tab:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.category-tab.active {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-text {
  font-size: 0.95rem;
}

.tab-count {
  font-size: 0.85rem;
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.category-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
}

/* ========== INFORMATION GRID SECTION ========== */
.information-grid-section {
  padding: 60px 20px;
}

.grid-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.section-divider {
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #3b82f6, #1e3a8a);
  margin: 0 auto;
  border-radius: 2px;
}

/* ========== STATES ========== */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 24px;
}

.loading-text {
  font-size: 1.1rem;
  color: #6b7280;
}

.error-icon,
.empty-icon {
  font-size: 4rem;
  margin-bottom: 24px;
}

.error-title,
.empty-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.error-message,
.empty-message {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 32px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.retry-button,
.clear-filters-button {
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
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.retry-button:hover,
.clear-filters-button:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.retry-icon {
  width: 18px;
  height: 18px;
}

/* ========== INFORMATION GRID ========== */
.information-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  margin-top: 40px;
}

.information-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.information-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(59, 130, 246, 0.2);
}

.card-image-container {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.information-card:hover .card-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.information-card:hover .image-overlay {
  opacity: 1;
}

.view-detail-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.detail-icon {
  width: 18px;
  height: 18px;
}

.card-content {
  padding: 24px;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #3b82f6, #1e3a8a);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 16px;
}

.badge-icon {
  font-size: 1rem;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-summary {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 0.9rem;
}

.meta-icon {
  width: 16px;
  height: 16px;
}

.read-more-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #3b82f6, #1e3a8a);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
}

.read-more-button:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.button-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.information-card:hover .button-arrow {
  transform: translateX(4px);
}

/* ========== CARD DECORATIONS ========== */
.card-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.corner-accent {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.information-card:hover .corner-accent {
  opacity: 1;
}

.corner-accent.top-left {
  top: 16px;
  left: 16px;
  border-top: 2px solid #3b82f6;
  border-left: 2px solid #3b82f6;
}

.corner-accent.top-right {
  top: 16px;
  right: 16px;
  border-top: 2px solid #3b82f6;
  border-right: 2px solid #3b82f6;
}

.corner-accent.bottom-left {
  bottom: 16px;
  left: 16px;
  border-bottom: 2px solid #3b82f6;
  border-left: 2px solid #3b82f6;
}

.corner-accent.bottom-right {
  bottom: 16px;
  right: 16px;
  border-bottom: 2px solid #3b82f6;
  border-right: 2px solid #3b82f6;
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
@media (max-width: 1024px) {
  .information-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .page-title {
    font-size: 2.8rem;
  }

  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 60px;
  }

  .hero-section {
    padding: 40px 15px 30px;
  }

  .page-title {
    font-size: 2.2rem;
  }

  .page-subtitle {
    font-size: 1.1rem;
  }

  .search-filter-section {
    padding: 30px 15px;
  }

  .category-tabs {
    flex-direction: column;
    align-items: stretch;
  }

  .category-tab {
    justify-content: center;
  }

  .information-grid-section {
    padding: 40px 15px;
  }

  .information-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .card-content {
    padding: 20px;
  }

  .card-meta {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.8rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .search-input {
    padding: 14px 45px 14px 45px;
    font-size: 0.95rem;
  }

  .category-tab {
    padding: 10px 16px;
  }

  .tab-text {
    font-size: 0.9rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .card-image-container {
    height: 180px;
  }
}
</style>
<style scoped>
.informasi-view {
  overflow-y: auto;
}
</style>
