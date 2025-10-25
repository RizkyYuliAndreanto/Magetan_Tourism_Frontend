<template>
  <div class="informasi-view">
    <!-- Luxurious Background -->
    <div class="luxury-background">
      <div class="mountain-silhouettes"></div>
      <div class="floating-clouds"></div>
      <div class="rice-field-patterns"></div>
      <div class="sunset-glow"></div>
      <div class="tourism-icons">
        <div class="compass-icon"></div>
        <div class="camera-icon"></div>
        <div class="map-pins"></div>
      </div>
      <div class="light-waves"></div>
      <div class="flying-birds"></div>
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
            <div class="category-dropdown-container">
              <label class="dropdown-label">Filter Kategori:</label>
              <div class="dropdown-wrapper" ref="dropdownRef">
                <button
                  @click="toggleDropdown"
                  class="dropdown-trigger"
                  :class="{ active: isDropdownOpen }">
                  <span class="dropdown-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </span>
                  <span class="dropdown-text">
                    {{ getSelectedCategoryName() }}
                  </span>
                  <span class="dropdown-count">
                    ({{ getSelectedCategoryCount() }})
                  </span>
                  <svg
                    class="dropdown-arrow"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>

                <div v-show="isDropdownOpen" class="dropdown-menu" @click.stop>
                  <div class="dropdown-search">
                    <svg
                      class="search-icon-small"
                      viewBox="0 0 24 24"
                      fill="currentColor">
                      <path
                        d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    <input
                      v-model="categorySearchQuery"
                      type="text"
                      placeholder="Cari kategori..."
                      class="category-search-input"
                      @click.stop />
                  </div>

                  <div class="dropdown-options">
                    <button
                      @click="selectCategory(null)"
                      :class="[
                        'dropdown-option',
                        { active: selectedCategory === null },
                      ]">
                      <span class="option-icon">📋</span>
                      <div class="option-content">
                        <span class="option-text">Semua Kategori</span>
                        <span class="option-description"
                          >Tampilkan semua informasi</span
                        >
                      </div>
                      <span class="option-count">{{ totalItems }}</span>
                    </button>

                    <div class="dropdown-divider"></div>

                    <button
                      v-for="category in filteredCategories"
                      :key="category.id_kategori"
                      @click="selectCategory(category.id_kategori)"
                      :class="[
                        'dropdown-option',
                        { active: selectedCategory === category.id_kategori },
                      ]">
                      <span class="option-icon">{{
                        getCategoryIcon(category.nama_kategori)
                      }}</span>
                      <div class="option-content">
                        <span class="option-text">{{
                          category.nama_kategori
                        }}</span>
                        <span class="option-description">{{
                          getCategoryDescription(category.nama_kategori)
                        }}</span>
                      </div>
                      <span class="option-count">{{
                        getCategoryCount(category.id_kategori)
                      }}</span>
                    </button>

                    <div
                      v-if="
                        filteredCategories.length === 0 && categorySearchQuery
                      "
                      class="no-results">
                      <span class="no-results-icon">🔍</span>
                      <span class="no-results-text"
                        >Tidak ada kategori yang ditemukan</span
                      >
                    </div>
                  </div>
                </div>
              </div>
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
              v-for="(item, index) in filteredInformasi"
              :key="item.id_berita"
              :class="[
                'information-card',
                { 'horizontal-layout': index % 7 === 3 || index % 7 === 6 },
              ]"
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
                <div
                  class="category-badge"
                  :data-category="
                    getCategorySlug(item.kategoriBerita?.nama_kategori)
                  ">
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
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
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

// Dropdown specific data
const isDropdownOpen = ref(false);
const categorySearchQuery = ref("");
const dropdownRef = ref(null);

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

// Filtered categories for dropdown search
const filteredCategories = computed(() => {
  if (!categorySearchQuery.value.trim()) {
    return categories.value;
  }
  const query = categorySearchQuery.value.toLowerCase().trim();
  return categories.value.filter((category) =>
    category.nama_kategori.toLowerCase().includes(query)
  );
});

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

// Dropdown methods
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    categorySearchQuery.value = "";
  }
};

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  isDropdownOpen.value = false;
  categorySearchQuery.value = "";
};

const getSelectedCategoryName = () => {
  if (selectedCategory.value === null) {
    return "Semua Kategori";
  }
  const category = categories.value.find(
    (cat) => cat.id_kategori === selectedCategory.value
  );
  return category ? category.nama_kategori : "Kategori";
};

const getSelectedCategoryCount = () => {
  if (selectedCategory.value === null) {
    return totalItems.value;
  }
  return getCategoryCount(selectedCategory.value);
};

const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes("wisata") || name.includes("pariwisata")) return "🏖️";
  if (name.includes("budaya") || name.includes("tradisi")) return "🎭";
  if (name.includes("teknologi") || name.includes("digital")) return "💻";
  if (name.includes("kesehatan") || name.includes("health")) return "🏥";
  if (name.includes("pendidikan") || name.includes("education")) return "📚";
  if (name.includes("ekonomi") || name.includes("business")) return "💼";
  if (name.includes("olahraga") || name.includes("sport")) return "⚽";
  if (name.includes("lingkungan") || name.includes("environment")) return "🌱";
  return "📂";
};

const getCategoryDescription = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes("wisata") || name.includes("pariwisata"))
    return "Informasi destinasi dan objek wisata";
  if (name.includes("budaya") || name.includes("tradisi"))
    return "Warisan budaya dan tradisi lokal";
  if (name.includes("teknologi") || name.includes("digital"))
    return "Perkembangan teknologi terkini";
  if (name.includes("kesehatan") || name.includes("health"))
    return "Tips kesehatan dan informasi medis";
  if (name.includes("pendidikan") || name.includes("education"))
    return "Program pendidikan dan pelatihan";
  if (name.includes("ekonomi") || name.includes("business"))
    return "Perekonomian dan peluang bisnis";
  if (name.includes("olahraga") || name.includes("sport"))
    return "Kegiatan olahraga dan kompetisi";
  if (name.includes("lingkungan") || name.includes("environment"))
    return "Pelestarian lingkungan hidup";
  return "Informasi kategori terkait";
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = null;
};

const navigateToDetail = (id) => {
  // Navigate to detail page - adjust route name as needed
  router.push({ name: "DetailInformasi", params: { id } });
};

const getCategorySlug = (categoryName) => {
  if (!categoryName) return "";
  return categoryName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .trim();
};

// Lifecycle
onMounted(() => {
  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  fetchData();

  // Add click outside listener
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  // Remove click outside listener
  document.removeEventListener("click", handleClickOutside);
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
/* ========== IMPORT EDITORIAL FONTS ========== */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap");

/* ========== LUXURY BACKGROUND & BASE ========== */
:root {
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --text: #111827;
  --muted: #4b5563;
  --border: #e5e7eb;
  --bg: #ffffff;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.07);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.08);
  --radius-xl: 18px;
  --radius-2xl: 20px;
  --container-max: 1280px;
  --container-px: 16px;
}

.informasi-view {
  position: relative;
  min-height: 100vh;
  font-family: "Inter", "Poppins", sans-serif;
  color: var(--text);
  overflow: hidden;
  overflow-y: auto;
  background: linear-gradient(
    135deg,
    #0f172a 0%,
    #1e3a8a 25%,
    #3b82f6 50%,
    #dbeafe 75%,
    #ffffff 100%
  );
}

/* Luxury Animated Background */
.luxury-background {
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
  height: 40%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" opacity="0.1"><path d="M0,400 L200,200 L400,250 L600,150 L800,200 L1000,100 L1200,180 L1200,400 Z" fill="%23FFFFFF"/><path d="M0,400 L150,280 L350,320 L550,220 L750,280 L950,180 L1200,250 L1200,400 Z" fill="%23F1F5F9" opacity="0.8"/></svg>')
    no-repeat center bottom;
  background-size: cover;
  animation: mountainParallax 20s ease-in-out infinite;
}

.floating-clouds {
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  height: 30%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" opacity="0.06"><ellipse cx="200" cy="100" rx="80" ry="30" fill="%23FFFFFF"/><ellipse cx="500" cy="150" rx="100" ry="40" fill="%23FFFFFF"/><ellipse cx="800" cy="80" rx="90" ry="35" fill="%23FFFFFF"/><ellipse cx="1000" cy="180" rx="70" ry="25" fill="%23FFFFFF"/></svg>')
    repeat-x;
  animation: cloudFloat 30s linear infinite;
}

.rice-field-patterns {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 25%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" opacity="0.04"><path d="M0,150 Q100,120 200,150 Q300,180 400,150 Q500,120 600,150 Q700,180 800,150 L800,200 L0,200 Z" fill="%2334D399"/><path d="M0,170 Q100,140 200,170 Q300,200 400,170 Q500,140 600,170 Q700,200 800,170 L800,200 L0,200 Z" fill="%2334D399" opacity="0.7"/></svg>')
    repeat-x;
  animation: riceFieldSway 15s ease-in-out infinite;
}

.sunset-glow {
  position: absolute;
  top: 15%;
  right: 10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    rgba(251, 191, 36, 0.3) 0%,
    rgba(245, 158, 11, 0.2) 40%,
    transparent 70%
  );
  border-radius: 50%;
  animation: sunsetPulse 8s ease-in-out infinite;
}

.tourism-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.compass-icon {
  position: absolute;
  top: 20%;
  left: 15%;
  width: 60px;
  height: 60px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.08"><circle cx="50" cy="50" r="45" fill="none" stroke="%233B82F6" stroke-width="2"/><path d="M50,10 L55,45 L50,50 L45,45 Z" fill="%233B82F6"/><path d="M90,50 L55,55 L50,50 L55,45 Z" fill="%233B82F6"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: compassRotate 20s linear infinite;
}

.camera-icon {
  position: absolute;
  top: 60%;
  right: 20%;
  width: 50px;
  height: 50px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.06"><rect x="20" y="30" width="60" height="40" rx="5" fill="none" stroke="%233B82F6" stroke-width="2"/><circle cx="50" cy="50" r="12" fill="none" stroke="%233B82F6" stroke-width="2"/><rect x="35" y="25" width="10" height="5" fill="%233B82F6"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: cameraFlash 6s ease-in-out infinite;
}

.map-pins {
  position: absolute;
  top: 40%;
  left: 70%;
  width: 40px;
  height: 40px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.1"><path d="M50,20 C40,20 32,28 32,38 C32,52 50,80 50,80 S68,52 68,38 C68,28 60,20 50,20 Z" fill="%23EF4444"/><circle cx="50" cy="38" r="8" fill="%23FFFFFF"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: pinDrop 4s ease-in-out infinite;
}

.light-waves {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 0%,
    rgba(59, 130, 246, 0.1) 25%,
    transparent 50%,
    rgba(147, 197, 253, 0.1) 75%,
    transparent 100%
  );
  background-size: 200% 200%;
  animation: lightWaveFlow 12s ease-in-out infinite;
}

.flying-birds {
  position: absolute;
  top: 25%;
  left: 0;
  width: 100%;
  height: 20%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200" opacity="0.04"><path d="M100,100 Q110,90 120,100 Q130,110 140,100" fill="none" stroke="%23374151" stroke-width="2"/><path d="M300,80 Q310,70 320,80 Q330,90 340,80" fill="none" stroke="%23374151" stroke-width="2"/><path d="M500,120 Q510,110 520,120 Q530,130 540,120" fill="none" stroke="%23374151" stroke-width="2"/></svg>')
    repeat-x;
  animation: birdsFlying 25s linear infinite;
}

/* ========== MAIN CONTENT ========== */
.main-content {
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ========== HERO SECTION ========== */
.hero-section {
  padding: 140px 0 100px;
  text-align: center;
  position: relative;
}

.hero-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.page-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 2rem;
}

.title-gradient {
  background: linear-gradient(
    135deg,
    #93c5fd 0%,
    #60a5fa 25%,
    #3b82f6 50%,
    #2563eb 75%,
    #1d4ed8 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  text-shadow: 0 0 25px rgba(147, 197, 253, 0.9),
    0 0 50px rgba(59, 130, 246, 0.7), 0 4px 12px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
  animation: titleShimmer 3s ease-in-out infinite;
}

.title-accent {
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #dbeafe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  margin-top: 0.5rem;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.9),
    0 0 40px rgba(219, 234, 254, 0.7), 0 2px 8px rgba(0, 0, 0, 0.2);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
  animation: titleFloat 4s ease-in-out infinite;
}

@keyframes titleShimmer {
  0%,
  100% {
    transform: translateY(0);
    text-shadow: 0 0 25px rgba(147, 197, 253, 0.9),
      0 0 50px rgba(59, 130, 246, 0.7), 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  50% {
    transform: translateY(-2px);
    text-shadow: 0 0 30px rgba(147, 197, 253, 1),
      0 0 60px rgba(59, 130, 246, 0.9), 0 6px 16px rgba(0, 0, 0, 0.4);
  }
}

@keyframes titleFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.page-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 3rem;
}

.hero-ornament {
  width: 80px;
  height: 4px;
  background: linear-gradient(45deg, #3b82f6, #60a5fa, #93c5fd);
  margin: 2rem auto;
  border-radius: 2px;
  animation: ornamentGlow 2s ease-in-out infinite;
}

@keyframes ornamentGlow {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8),
      0 0 30px rgba(147, 197, 253, 0.6);
  }
}

/* ========== SEARCH AND FILTER SECTION ========== */
.search-filter-section {
  padding: 80px 0;
  position: relative;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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

/* ========== CATEGORY DROPDOWN STYLING ========== */
.category-dropdown-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 400px;
  width: 100%;
}

.dropdown-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  font-family: "Inter", sans-serif;
  letter-spacing: 0.025em;
}

.dropdown-wrapper {
  position: relative;
  width: 100%;
}

.dropdown-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

.dropdown-trigger:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.dropdown-trigger.active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
  flex-shrink: 0;
}

.dropdown-text {
  flex: 1;
  text-align: left;
  font-weight: 500;
  color: #1f2937;
}

.dropdown-count {
  font-size: 0.85rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 600;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.dropdown-trigger.active .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05);
  z-index: 50;
  overflow: hidden;
  animation: dropdownSlideIn 0.2s ease;
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-search {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
}

.search-icon-small {
  position: absolute;
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.category-search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.category-search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dropdown-options {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
}

.dropdown-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: "Inter", sans-serif;
}

.dropdown-option:hover {
  background: #f3f4f6;
}

.dropdown-option.active {
  background: #eff6ff;
  color: #1e40af;
}

.dropdown-option.active .option-icon {
  filter: brightness(1.2);
}

.option-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-text {
  font-weight: 500;
  font-size: 0.9rem;
  color: #1f2937;
}

.dropdown-option.active .option-text {
  color: #1e40af;
  font-weight: 600;
}

.option-description {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.3;
}

.option-count {
  font-size: 0.8rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  flex-shrink: 0;
}

.dropdown-option.active .option-count {
  background: #dbeafe;
  color: #1e40af;
}

.dropdown-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 8px 12px;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 16px;
  color: #6b7280;
}

.no-results-icon {
  font-size: 2rem;
  opacity: 0.5;
}

.no-results-text {
  font-size: 0.9rem;
  font-weight: 500;
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
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 48px;
  margin-top: 48px;
}

.information-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1px solid #f1f5f9;
  isolation: isolate;

  /* Editorial layout styling */
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ========== HORIZONTAL LAYOUT VARIANT ========== */
.information-card.horizontal-layout {
  flex-direction: row;
  min-height: 240px;
  grid-column: span 2;
}

.information-card.horizontal-layout .card-image-container {
  width: 45%;
  aspect-ratio: 4/3;
  height: auto;
  flex-shrink: 0;
}

.information-card.horizontal-layout .card-content {
  width: 55%;
  padding: 28px 32px;
  justify-content: space-between;
}

.information-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.02) 0%,
    rgba(147, 197, 253, 0.01) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.information-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15), 0 12px 20px rgba(0, 0, 0, 0.1);
  border-color: #e2e8f0;
}

.information-card:hover::before {
  opacity: 1;
}

.card-image-container {
  position: relative;
  height: 280px;
  overflow: hidden;
  background: #f8fafc;

  /* Cinematic 16:9 aspect ratio */
  aspect-ratio: 16/9;
  height: auto;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.4s ease;
  filter: saturate(0.9) contrast(1.1);
}

.information-card:hover .card-image {
  transform: scale(1.05);
  filter: saturate(1) contrast(1.15);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 60%,
    rgba(0, 0, 0, 0.3) 100%
  );
  opacity: 1;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 20px;
}

.information-card:hover .image-overlay {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.2) 60%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

.view-detail-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-weight: 500;
  font-size: 0.8rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateY(8px);
  opacity: 0;
  transition: all 0.3s ease;
  font-family: "Inter", sans-serif;
  letter-spacing: 0.025em;
}

.information-card:hover .view-detail-hint {
  transform: translateY(0);
  opacity: 1;
}

.detail-icon {
  width: 14px;
  height: 14px;
}

.card-content {
  padding: 32px 28px 28px;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  font-family: "Inter", sans-serif;
}

/* Category-specific colors */
.category-badge[data-category*="wisata"],
.category-badge[data-category*="pariwisata"],
.category-badge[data-category*="tourism"] {
  background: #dbeafe;
  color: #2563eb;
  border-color: #93c5fd;
}

.category-badge[data-category*="budaya"],
.category-badge[data-category*="cultural"],
.category-badge[data-category*="tradisi"] {
  background: #fef3c7;
  color: #d97706;
  border-color: #fbbf24;
}

.category-badge[data-category*="teknologi"],
.category-badge[data-category*="tech"],
.category-badge[data-category*="digital"] {
  background: #dcfce7;
  color: #16a34a;
  border-color: #86efac;
}

.category-badge[data-category*="kesehatan"],
.category-badge[data-category*="health"] {
  background: #fce7f3;
  color: #be185d;
  border-color: #f9a8d4;
}

.category-badge[data-category*="pendidikan"],
.category-badge[data-category*="education"] {
  background: #e0e7ff;
  color: #4338ca;
  border-color: #a5b4fc;
}

.category-badge[data-category*="ekonomi"],
.category-badge[data-category*="business"] {
  background: #ecfdf5;
  color: #059669;
  border-color: #6ee7b7;
}

.information-card:hover .category-badge {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.badge-icon {
  font-size: 0.8rem;
  opacity: 0.8;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
  letter-spacing: -0.025em;
  margin: 0;

  /* Editorial typography with serif for elegance */
  font-family: "Playfair Display", "Inter", serif;

  /* Text clipping for consistent height */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  /* Hover effects */
  transition: color 0.2s ease;
}

/* Alternative sans-serif variant for certain categories */
.information-card .card-title {
  font-family: "Inter", "Poppins", sans-serif;
}

.information-card[data-category*="teknologi"] .card-title,
.information-card[data-category*="digital"] .card-title {
  font-family: "Inter", sans-serif;
  font-weight: 600;
}

.information-card:hover .card-title {
  color: #1e40af;
}

.card-summary {
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
  font-weight: 400;
  margin: 0;

  /* Clean reading typography */
  font-family: "Inter", sans-serif;

  /* Consistent excerpt length */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  /* Subtle letter spacing for readability */
  letter-spacing: 0.01em;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0 0;
  border-top: 1px solid #f1f5f9;
  margin-top: auto;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  letter-spacing: 0.025em;
}

.meta-icon {
  width: 14px;
  height: 14px;
  opacity: 0.7;
  flex-shrink: 0;
}

.read-more-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  background: transparent;
  color: #3b82f6;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Inter", sans-serif;
  letter-spacing: 0.025em;
  margin-top: 8px;

  /* Clean editorial link style */
  text-decoration: none;
  position: relative;
}

.read-more-button::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.read-more-button:hover {
  color: #1e40af;
  transform: translateX(2px);
}

.read-more-button:hover::after {
  width: calc(100% - 24px);
}

.button-text {
  font-weight: 600;
}

.button-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.read-more-button:hover .button-arrow {
  transform: translateX(4px);
}

/* ========== CARD DECORATIONS - Minimalist Editorial Style ========== */
.card-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 20px;
  overflow: hidden;
}

.corner-accent {
  position: absolute;
  width: 24px;
  height: 24px;
  opacity: 0;
  transition: all 0.3s ease;
}

.information-card:hover .corner-accent {
  opacity: 0.6;
}

.corner-accent.top-left {
  top: 16px;
  left: 16px;
  border-top: 2px solid #e2e8f0;
  border-left: 2px solid #e2e8f0;
  border-radius: 0;
}

.corner-accent.top-right {
  top: 16px;
  right: 16px;
  border-top: 2px solid #e2e8f0;
  border-right: 2px solid #e2e8f0;
  border-radius: 0;
}

.corner-accent.bottom-left {
  bottom: 16px;
  left: 16px;
  border-bottom: 2px solid #e2e8f0;
  border-left: 2px solid #e2e8f0;
  border-radius: 0;
}

.corner-accent.bottom-right {
  bottom: 16px;
  right: 16px;
  border-bottom: 2px solid #e2e8f0;
  border-right: 2px solid #e2e8f0;
  border-radius: 0;
}

/* Background Animations */
@keyframes mountainParallax {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-10px);
  }
}

@keyframes cloudFloat {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100px);
  }
}

@keyframes riceFieldSway {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes sunsetPulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

@keyframes compassRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes cameraFlash {
  0%,
  90%,
  100% {
    opacity: 0.6;
  }
  95% {
    opacity: 1;
  }
}

@keyframes pinDrop {
  0%,
  80%,
  100% {
    transform: translateY(0);
  }
  10% {
    transform: translateY(-10px);
  }
}

@keyframes lightWaveFlow {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes birdsFlying {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-200px);
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
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 40px;
  }

  .information-card.horizontal-layout {
    grid-column: span 1;
    flex-direction: column;
    min-height: auto;
  }

  .information-card.horizontal-layout .card-image-container {
    width: 100%;
    aspect-ratio: 16/9;
  }

  .information-card.horizontal-layout .card-content {
    width: 100%;
    padding: 28px 24px 24px;
  }

  .page-title {
    font-size: 2.8rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .card-content {
    padding: 28px 24px 24px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 100px 0 60px;
  }

  .page-title {
    font-size: 2.2rem;
  }

  .page-subtitle {
    font-size: 1.1rem;
  }

  .search-filter-section {
    padding: 60px 0;
  }

  .category-dropdown-container {
    max-width: 100%;
  }

  .dropdown-trigger {
    padding: 14px 18px;
    font-size: 0.9rem;
  }

  .dropdown-menu {
    border-radius: 12px;
  }

  .dropdown-options {
    max-height: 250px;
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
    gap: 32px;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .card-content {
    padding: 24px 20px 20px;
  }

  .card-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  /* All cards become vertical on mobile */
  .information-card.horizontal-layout {
    flex-direction: column;
  }

  .information-card.horizontal-layout .card-image-container {
    width: 100%;
  }

  .information-card.horizontal-layout .card-content {
    width: 100%;
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

  .category-dropdown-container {
    max-width: 100%;
  }

  .dropdown-label {
    font-size: 0.85rem;
  }

  .dropdown-trigger {
    padding: 12px 16px;
    font-size: 0.85rem;
    gap: 10px;
  }

  .dropdown-text {
    font-size: 0.85rem;
  }

  .dropdown-count {
    font-size: 0.8rem;
    padding: 3px 6px;
  }

  .dropdown-menu {
    border-radius: 10px;
  }

  .dropdown-search {
    padding: 12px;
  }

  .category-search-input {
    padding: 8px 10px 8px 36px;
    font-size: 0.85rem;
  }

  .dropdown-options {
    max-height: 200px;
    padding: 6px;
  }

  .dropdown-option {
    padding: 10px 12px;
    gap: 10px;
  }

  .option-text {
    font-size: 0.85rem;
  }

  .option-description {
    font-size: 0.75rem;
  }

  .option-count {
    font-size: 0.75rem;
    padding: 3px 6px;
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

  .information-grid {
    gap: 28px;
  }

  .card-content {
    padding: 20px 18px 18px;
    gap: 14px;
  }

  .category-badge {
    font-size: 0.7rem;
    padding: 5px 10px;
  }

  .card-summary {
    font-size: 0.9rem;
  }

  .read-more-button {
    font-size: 0.85rem;
  }
}
</style>
