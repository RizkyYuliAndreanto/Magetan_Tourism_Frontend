<template>
  <div class="ekraf-page">
    <!-- Luxury Animated Background -->
    <div class="luxury-background">
      <div class="mountain-silhouettes"></div>
      <div class="floating-clouds"></div>
      <div class="craft-patterns"></div>
      <div class="blue-glow"></div>
      <div class="tourism-icons">
        <div class="craft-icon"></div>
        <div class="money-icon"></div>
        <div class="innovation-pins"></div>
      </div>
      <div class="light-waves"></div>
      <div class="floating-arts"></div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Premium Search Section -->
      <section class="premium-search-section">
        <div class="search-container">
          <h1 class="hero-title">
            <span class="title-gradient">Ekonomi Kreatif</span>
            <span class="title-accent">Magetan</span>
          </h1>

          <div class="search-filter-wrapper">
            <div class="luxury-search-bar">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Cari UMKM dan Ekonomi Kreatif..."
                class="premium-search-input" />
              <span class="search-icon">🔍</span>
              <div class="search-accent-line"></div>
            </div>

            <div class="premium-filter-dropdown">
              <button
                class="luxury-dropdown-toggle"
                @click="toggleDropdown"
                :aria-expanded="isDropdownOpen">
                <span class="filter-icon">🎨</span>
                {{ selectedKategoriLabel }}
                <svg
                  class="dropdown-arrow"
                  :class="{ rotate: isDropdownOpen }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <ul v-if="isDropdownOpen" class="luxury-dropdown-menu">
                <li
                  v-for="f in filters"
                  :key="f"
                  class="dropdown-item"
                  :class="{ active: activeFilter === f }"
                  @click="selectKategoriCustom(f)">
                  <span class="item-icon">{{ getCategoryIcon(f) }}</span>
                  {{ f }}
                  <div class="item-glow"></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Luxury UMKM Section -->
      <section class="luxury-umkm-section">
        <div class="section-header">
          <h2 class="luxury-section-title">
            <span class="title-shimmer">UMKM Unggulan Magetan</span>
          </h2>
          <div class="title-underline"></div>
          <p class="section-subtitle">
            Dukung produk lokal berkualitas tinggi dari pengrajin dan pelaku
            UMKM terbaik
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <div class="luxury-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
          </div>
          <p class="loading-text">Memuat data UMKM...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
          <span class="error-icon">⚠️</span>
          <h3 class="error-title">Gagal Memuat Data</h3>
          <p class="error-message">{{ error }}</p>
          <button @click="loadUMKMData" class="retry-button">
            🔄 Coba Lagi
          </button>
        </div>

        <!-- UMKM Cards Grid -->
        <div v-else-if="filteredItems.length > 0" class="luxury-cards-grid">
          <article
            v-for="item in filteredItems"
            :key="item.id_umkm"
            class="luxury-umkm-card"
            @mouseenter="cardHover"
            @mouseleave="cardLeave"
            v-scroll-reveal>
            <!-- Premium Image Container -->
            <div class="luxury-image-container">
              <div class="image-carousel">
                <img
                  :src="getImageUrl(item)"
                  :alt="item.nama_umkm"
                  class="luxury-umkm-image"
                  loading="lazy"
                  @error="handleImageError" />
              </div>

              <!-- Floating Category Badge -->
              <div class="floating-category-badge">
                <span class="category-icon">{{
                  getCategoryIcon(item.kategoriUMKM?.nama_kategori || "UMKM")
                }}</span>
                {{ item.kategoriUMKM?.nama_kategori || "UMKM" }}
              </div>

              <!-- Premium Rating -->
              <div class="luxury-rating">
                <div class="stars-container">
                  <span
                    v-for="i in 5"
                    :key="i"
                    class="luxury-star"
                    :class="{ filled: i <= 4 }"
                    >⭐</span
                  >
                </div>
                <span class="rating-text">4.0/5</span>
              </div>

              <!-- Gradient Overlay -->
              <div class="luxury-gradient-overlay"></div>

              <!-- Parallax Elements -->
              <div class="parallax-elements">
                <span class="location-pin">📍</span>
                <span class="camera-flash">📸</span>
              </div>
            </div>

            <!-- Premium Content Container -->
            <div class="luxury-content-container">
              <div class="umkm-header">
                <h3 class="luxury-umkm-title">{{ item.nama_umkm }}</h3>
                <div class="umkm-location">
                  <span class="location-icon">📍</span>
                  {{ item.alamat_umkm }}
                </div>
              </div>

              <p class="umkm-description">{{ item.deskripsi_umkm }}</p>

              <div class="umkm-details">
                <div class="detail-item">
                  <span class="detail-icon">📞</span>
                  <span class="detail-text">{{ item.kontak_umkm }}</span>
                </div>
                <div v-if="item.website_umkm" class="detail-item">
                  <span class="detail-icon">🌐</span>
                  <a
                    :href="item.website_umkm"
                    target="_blank"
                    class="detail-link">
                    {{ item.website_umkm }}
                  </a>
                </div>

                <!-- Operational Hours Section -->
                <div
                  v-if="item.jam_operasional || item.hari_operasional"
                  class="operational-hours">
                  <div class="operational-header">
                    <span class="operational-icon">⏰</span>
                    <span class="operational-title">Jam Operasional</span>
                  </div>
                  <div class="operational-content">
                    <div v-if="item.hari_operasional" class="operational-item">
                      <span class="day-icon">�</span>
                      <span class="operational-text">{{
                        item.hari_operasional
                      }}</span>
                    </div>
                    <div v-if="item.jam_operasional" class="operational-item">
                      <span class="time-icon">�</span>
                      <span class="operational-text">{{
                        item.jam_operasional
                      }}</span>
                    </div>
                  </div>
                </div>

                <div class="detail-item">
                  <span class="detail-icon">👁️</span>
                  <span class="detail-text"
                    >{{ item.jumlah_dilihat }} kali dilihat</span
                  >
                </div>
              </div>

              <div class="umkm-features">
                <div class="feature-tags">
                  <!-- Category Tag -->
                  <span
                    v-if="item.kategoriUMKM?.nama_kategori"
                    class="feature-tag category-tag">
                    <span class="tag-icon">🏷️</span>
                    {{ item.kategoriUMKM?.nama_kategori }}
                  </span>

                  <!-- Hashtags -->
                  <span
                    v-for="hashtag in parseHashtags(item.hastag_umkm)"
                    :key="hashtag"
                    class="feature-tag hashtag-tag">
                    {{ hashtag }}
                  </span>
                </div>
              </div>

              <RouterLink
                class="luxury-cta-button"
                :to="`/ekonomi-kreatif/detail/${item.id_umkm}`"
                aria-label="Lihat detail UMKM">
                <span class="button-glow"></span>
                <span class="button-particles"></span>
                <span>Lihat Detail</span>
                <svg
                  class="arrow-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"></path>
                </svg>
              </RouterLink>
            </div>

            <!-- Card Decorative Elements -->
            <div class="card-decorations">
              <div class="corner-ornament top-left"></div>
              <div class="corner-ornament top-right"></div>
              <div class="corner-ornament bottom-left"></div>
              <div class="corner-ornament bottom-right"></div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div
          v-if="!filteredItems || filteredItems.length === 0"
          class="luxury-empty">
          <span class="no-data-icon">🎨</span>
          <h3>Tidak ada data UMKM</h3>
          <p>Data UMKM untuk kategori ini sedang tidak tersedia.</p>
        </div>
      </section>

      <!-- UMKM Inspirations Section -->
      <section class="umkm-inspirations-section">
        <div class="inspirations-header">
          <h2 class="inspirations-title">
            <span class="title-shimmer">Inspirasi Ekonomi Kreatif</span>
          </h2>
          <div class="title-underline"></div>
          <p class="inspirations-subtitle">
            Temukan berbagai kategori UMKM yang berkembang pesat di Magetan
          </p>
        </div>

        <div class="inspirations-grid">
          <div
            v-for="inspiration in umkmInspirations"
            :key="inspiration.id"
            class="inspiration-card">
            <div class="inspiration-icon">{{ inspiration.icon }}</div>
            <h4 class="inspiration-title">{{ inspiration.title }}</h4>
            <p class="inspiration-description">{{ inspiration.description }}</p>
            <div class="inspiration-glow"></div>
          </div>
        </div>
      </section>
    </div>

    <div class="bottom-accent"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, type Directive } from "vue";
import { RouterLink } from "vue-router";
import axios from "axios";

// Backend data interfaces
interface Admin {
  username: string;
  nama_lengkap: string;
  email?: string;
  level_akses: string;
}

interface KategoriUMKM {
  id_kategori_umkm: number;
  nama_kategori: string;
  gambar_sampul?: string;
  created_at: string;
  updated_at: string;
}

interface MediaGaleri {
  path_file: string;
  deskripsi_file?: string;
  jenis_file: string;
  urutan_tampil: number;
}

interface UMKMItem {
  id_umkm: number;
  nama_umkm: string;
  deskripsi_umkm: string;
  hastag_umkm?: string;
  alamat_umkm: string;
  kontak_umkm: string;
  jam_operasional?: string;
  hari_operasional?: string;
  website_umkm?: string;
  gambar_produk_utama?: string;
  gambar_sampul?: string;
  jumlah_dilihat: number;
  jumlah_share: number;
  id_kategori_umkm?: number;
  id_admin: number;
  created_at: string;
  updated_at: string;
  adminPembuat: Admin;
  kategoriUMKM?: KategoriUMKM;
  galeriUMKM?: MediaGaleri[];
}

// Reactive data
const items = ref<UMKMItem[]>([]);
const categories = ref<KategoriUMKM[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Create dynamic filters based on categories
const filters = computed(() => {
  const dynamicFilters = [
    "Semua",
    ...categories.value.map((cat) => cat.nama_kategori),
  ];
  return dynamicFilters;
});

type Filter = string;

const activeFilter = ref<Filter>("Semua");
const searchQuery = ref("");
const isDropdownOpen = ref(false);

// Load data from API
const loadUMKMData = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Load UMKM data and categories in parallel
    const [umkmResponse, categoriesResponse] = await Promise.all([
      axios.get("http://localhost:5000/api/umkm"),
      axios.get("http://localhost:5000/api/kategori-umkm"),
    ]);

    items.value = umkmResponse.data || [];
    categories.value = categoriesResponse.data || [];

    console.log("UMKM Data loaded:", items.value.length, "items");
    console.log("Categories loaded:", categories.value.length, "categories");
  } catch (err) {
    console.error("Error loading UMKM data:", err);
    error.value = "Gagal memuat data UMKM. Silakan coba lagi nanti.";
  } finally {
    isLoading.value = false;
  }
};

// Load data on component mount
onMounted(() => {
  // Scroll ke atas halaman
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  loadUMKMData();
});

const umkmInspirations = ref([
  {
    id: 1,
    icon: "🍜",
    title: "Kuliner Nusantara",
    description: "Cita rasa tradisional dalam kemasan modern",
  },
  {
    id: 2,
    icon: "🎨",
    title: "Kriya & Kerajinan",
    description: "Seni tangan dengan nilai budaya tinggi",
  },
  {
    id: 3,
    icon: "👗",
    title: "Fashion Lokal",
    description: "Desain eksklusif karya anak bangsa",
  },
  {
    id: 4,
    icon: "🎵",
    title: "Industri Musik",
    description: "Kreativitas tanpa batas dalam berkarya",
  },
  {
    id: 5,
    icon: "💻",
    title: "Digital Creative",
    description: "Inovasi teknologi untuk masa depan",
  },
  {
    id: 6,
    icon: "📈",
    title: "Bisnis Startup",
    description: "Solusi inovatif untuk masyarakat",
  },
]);

const filteredItems = computed(() => {
  let list = items.value;

  // Filter by category
  if (activeFilter.value !== "Semua") {
    list = list.filter((item) => {
      return item.kategoriUMKM?.nama_kategori === activeFilter.value;
    });
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    list = list.filter(
      (item) =>
        item.nama_umkm.toLowerCase().includes(query) ||
        item.deskripsi_umkm.toLowerCase().includes(query) ||
        item.alamat_umkm.toLowerCase().includes(query) ||
        item.hastag_umkm?.toLowerCase().includes(query) ||
        item.kategoriUMKM?.nama_kategori.toLowerCase().includes(query)
    );
  }

  return list;
});

const selectedKategoriLabel = computed(() => {
  return activeFilter.value === "Semua" ? "Semua Kategori" : activeFilter.value;
});

const getCategoryIcon = (kategori: string) => {
  const icons: Record<string, string> = {
    Semua: "🌟",
    Kuliner: "🍜",
    Fashion: "👗",
    Kriya: "🎨",
    Kerajinan: "🖼️",
    Musik: "🎵",
    Digital: "💻",
    Perdagangan: "🏪",
    Jasa: "🛠️",
    Teknologi: "📱",
    UMKM: "🏢",
    // Fallback categories
    "Makanan & Minuman": "🍽️",
    "Seni & Budaya": "🎭",
    "Teknologi Informasi": "💾",
    "Perdagangan Umum": "🛍️",
  };
  return icons[kategori] || "�";
};

// Helper function to get image URL
const getImageUrl = (item: UMKMItem) => {
  const API_BASE_URL = "http://localhost:5000";

  // Priority: gambar_sampul > gambar_produk_utama > first gallery image > fallback
  if (item.gambar_sampul) {
    if (item.gambar_sampul.startsWith("http")) {
      return item.gambar_sampul;
    }
    return `${API_BASE_URL}${item.gambar_sampul}`;
  }
  if (item.gambar_produk_utama) {
    if (item.gambar_produk_utama.startsWith("http")) {
      return item.gambar_produk_utama;
    }
    return `${API_BASE_URL}${item.gambar_produk_utama}`;
  }
  if (item.galeriUMKM && item.galeriUMKM.length > 0) {
    const galleryImage = item.galeriUMKM[0].path_file;
    if (galleryImage.startsWith("http")) {
      return galleryImage;
    }
    return `${API_BASE_URL}${galleryImage}`;
  }
  // Fallback image with UMKM theme
  return "https://via.placeholder.com/400x300/3b82f6/ffffff?text=UMKM+Magetan";
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectKategoriCustom = (filter: Filter) => {
  activeFilter.value = filter;
  isDropdownOpen.value = false;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src =
    "https://via.placeholder.com/400x300/3b82f6/ffffff?text=UMKM+Magetan";
};

const parseHashtags = (hashtagString: string | undefined): string[] => {
  if (!hashtagString) return [];

  // Split by common separators and clean up
  return hashtagString
    .split(/[,;|\s]+/)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
};

const cardHover = (event: Event) => {
  (event.currentTarget as HTMLElement).classList.add("hovered");
};

const cardLeave = (event: Event) => {
  (event.currentTarget as HTMLElement).classList.remove("hovered");
};

// Scroll reveal directive
let observer: IntersectionObserver | null = null;

const vScrollReveal: Directive<HTMLElement, void> = {
  mounted(el) {
    el.style.transition = "opacity 600ms ease, transform 600ms ease";
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              target.style.opacity = "1";
              target.style.transform = "translateY(0)";
              observer?.unobserve(target);
            }
          });
        },
        { threshold: 0.12 }
      );
    }
    observer.observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});
</script>

<style scoped>
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

@media (min-width: 640px) {
  :root {
    --container-px: 24px;
  }
}
@media (min-width: 1024px) {
  :root {
    --container-px: 32px;
  }
}

.ekraf-page {
  position: relative;
  min-height: 100vh;
  font-family: "Inter", "Poppins", sans-serif;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #f0f9ff 0%,
    #e0f2fe 25%,
    #bae6fd 50%,
    #7dd3fc 75%,
    #38bdf8 100%
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

.craft-patterns {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 25%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" opacity="0.04"><path d="M0,150 Q100,120 200,150 Q300,180 400,150 Q500,120 600,150 Q700,180 800,150 L800,200 L0,200 Z" fill="%23F59E0B"/><path d="M0,170 Q100,140 200,170 Q300,200 400,170 Q500,140 600,170 Q700,200 800,170 L800,200 L0,200 Z" fill="%23F59E0B" opacity="0.7"/></svg>')
    repeat-x;
  animation: craftPatternSway 15s ease-in-out infinite;
}

.blue-glow {
  position: absolute;
  top: 15%;
  right: 10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.4) 0%,
    rgba(37, 99, 235, 0.2) 50%,
    transparent 100%
  );
  border-radius: 50%;
  animation: bluePulse 8s ease-in-out infinite;
}

.tourism-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.craft-icon {
  position: absolute;
  top: 20%;
  left: 15%;
  width: 60px;
  height: 60px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.08"><path d="M30,20 L70,20 L70,30 L30,30 Z" fill="%23F59E0B"/><path d="M25,30 L75,30 L70,70 L30,70 Z" fill="%23F59E0B"/><circle cx="45" cy="50" r="8" fill="%23FFFFFF"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: craftRotate 20s linear infinite;
}

.money-icon {
  position: absolute;
  top: 60%;
  right: 20%;
  width: 50px;
  height: 50px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.06"><circle cx="50" cy="50" r="40" fill="none" stroke="%23F59E0B" stroke-width="3"/><path d="M40,35 L40,25 L60,25 L60,35 M50,25 L50,75 M40,65 L60,65" stroke="%23F59E0B" stroke-width="3" fill="none"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: moneyFloat 6s ease-in-out infinite;
}

.innovation-pins {
  position: absolute;
  top: 40%;
  left: 70%;
  width: 40px;
  height: 40px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.1"><circle cx="50" cy="40" r="15" fill="%23F59E0B"/><path d="M50,55 L50,80 M35,75 L65,75" stroke="%23F59E0B" stroke-width="3"/></svg>')
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
    rgba(147, 197, 253, 0.02) 25%,
    rgba(59, 130, 246, 0.03) 50%,
    rgba(147, 197, 253, 0.02) 75%,
    transparent 100%
  );
  background-size: 200% 200%;
  animation: lightWaveFlow 12s ease-in-out infinite;
}

.floating-arts {
  position: absolute;
  top: 25%;
  left: 0;
  width: 100%;
  height: 20%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200" opacity="0.04"><path d="M100,100 L120,80 L140,100 L160,80 L180,100" fill="none" stroke="%23F59E0B" stroke-width="2"/><circle cx="300" cy="90" r="5" fill="%23F59E0B" opacity="0.6"/><rect x="480" y="80" width="20" height="20" fill="%23F59E0B" opacity="0.5" transform="rotate(45 490 90)"/></svg>')
    repeat-x;
  animation: artsFlying 25s linear infinite;
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
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(100vw);
  }
}

@keyframes craftPatternSway {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(20px);
  }
}

@keyframes bluePulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

@keyframes craftRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes moneyFloat {
  0%,
  90%,
  100% {
    opacity: 0.06;
  }
  95% {
    opacity: 0.3;
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

@keyframes artsFlying {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(100vw);
  }
}

/* ========== MAIN CONTENT ========== */

.main-content {
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ========== PREMIUM SEARCH SECTION ========== */

.premium-search-section {
  padding: 120px 0 80px;
  text-align: center;
  position: relative;
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  margin-bottom: 3rem;
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
}

.title-gradient {
  background: linear-gradient(
    135deg,
    #2563eb 0%,
    #3b82f6 25%,
    #60a5fa 50%,
    #93c5fd 75%,
    #1d4ed8 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  text-shadow: 0 0 20px rgba(37, 99, 235, 0.8), 0 0 40px rgba(59, 130, 246, 0.6),
    0 4px 8px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  animation: titleShimmer 3s ease-in-out infinite;
}

.title-accent {
  background: linear-gradient(135deg, #ffffff 0%, #dbeafe 50%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  margin-top: 0.5rem;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.9),
    0 0 30px rgba(219, 234, 254, 0.7), 0 2px 6px rgba(0, 0, 0, 0.2);
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.15));
  animation: titleFloat 4s ease-in-out infinite;
}

@keyframes titleShimmer {
  0%,
  100% {
    filter: brightness(1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
  50% {
    filter: brightness(1.2) drop-shadow(0 4px 8px rgba(37, 99, 235, 0.4));
  }
}

@keyframes titleFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.search-filter-wrapper {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.luxury-search-bar {
  position: relative;
  flex-grow: 1;
  max-width: 500px;
  min-width: 300px;
}

.premium-search-input {
  width: 100%;
  padding: 18px 24px 18px 60px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  font-size: 1.1rem;
  color: #1e3a8a;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
}

.premium-search-input::placeholder {
  color: rgba(30, 58, 138, 0.6);
}

.premium-search-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1),
    0 12px 40px rgba(59, 130, 246, 0.2);
  transform: translateY(-2px);
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: #3b82f6;
  animation: searchPulse 2s ease-in-out infinite;
}

@keyframes searchPulse {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

.search-accent-line {
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(45deg, #3b82f6, #60a5fa);
  transition: all 0.4s ease;
  transform: translateX(-50%);
}

.premium-search-input:focus + .search-accent-line {
  width: 100%;
}

.premium-filter-dropdown {
  position: relative;
  min-width: 250px;
}

.luxury-dropdown-toggle {
  width: 100%;
  padding: 18px 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: #1e3a8a;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
}

.luxury-dropdown-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.15);
}

.filter-icon {
  font-size: 1.2rem;
  margin-right: 8px;
}

.dropdown-arrow {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  transition: transform 0.3s ease;
}

.dropdown-arrow.rotate {
  transform: rotate(180deg);
}

.luxury-dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  list-style: none;
  padding: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(59, 130, 246, 0.1);
  animation: dropdownSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  color: #374151;
  font-weight: 500;
  position: relative;
}

.dropdown-item:hover {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e3a8a;
  transform: translateX(4px);
}

.dropdown-item.active {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.item-icon {
  font-size: 1.1rem;
}

.item-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(147, 197, 253, 0.05) 100%
  );
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dropdown-item:hover .item-glow {
  opacity: 1;
}

/* ========== LUXURY UMKM SECTION ========== */

.luxury-umkm-section {
  padding: 80px 0;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.luxury-section-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  position: relative;
}

.title-shimmer {
  background: linear-gradient(
    135deg,
    #2563eb 0%,
    #3b82f6 25%,
    #60a5fa 50%,
    #93c5fd 75%,
    #1d4ed8 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  text-shadow: 0 0 25px rgba(59, 130, 246, 0.9), 0 0 50px rgba(37, 99, 235, 0.7),
    0 4px 12px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
  animation: textShimmer 3s ease-in-out infinite;
}

@keyframes textShimmer {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.title-underline {
  width: 120px;
  height: 4px;
  background: linear-gradient(45deg, #3b82f6, #60a5fa);
  margin: 1rem auto;
  border-radius: 2px;
  animation: underlineExpand 2s ease-out;
}

@keyframes underlineExpand {
  from {
    width: 0;
  }
  to {
    width: 120px;
  }
}

.section-subtitle {
  font-size: 1.3rem;
  color: rgba(30, 58, 138, 0.8);
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* ========== LUXURY UMKM CARDS ========== */

.luxury-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.luxury-umkm-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(254, 252, 232, 0.8) 100%
  );
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  opacity: 0;
  transform: translateY(50px);
  animation: luxuryCardReveal 0.8s ease-out forwards;
}

@keyframes luxuryCardReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.luxury-umkm-card.hovered {
  transform: translateY(-20px) rotateX(5deg) rotateY(2deg);
  box-shadow: 0 40px 80px rgba(59, 130, 246, 0.2),
    0 20px 40px rgba(0, 0, 0, 0.1);
}

.luxury-umkm-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05) 0%,
    rgba(37, 99, 235, 0.03) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

.luxury-umkm-card.hovered::before {
  opacity: 1;
}

/* Premium Image Container - Compact Portrait Layout */
.luxury-image-container {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.image-carousel {
  width: 100%;
  height: 100%;
  position: relative;
}

.luxury-umkm-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1.1) contrast(1.05) saturate(1.2);
}

.luxury-umkm-card.hovered .luxury-umkm-image {
  transform: scale(1.15) rotate(1deg);
  filter: brightness(1.2) contrast(1.1) saturate(1.3);
}

/* Floating Category Badge */
.floating-category-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e3a8a;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  transform: scale(0.9);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 3;
}

.luxury-umkm-card.hovered .floating-category-badge {
  transform: scale(1) rotate(-2deg);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.25);
}

.category-icon {
  font-size: 1rem;
}

/* Premium Rating */
.luxury-rating {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(15px);
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 3;
  transition: all 0.3s ease;
}

.luxury-umkm-card.hovered .luxury-rating {
  background: rgba(59, 130, 246, 0.9);
  transform: scale(1.05);
}

.stars-container {
  display: flex;
  gap: 2px;
}

.luxury-star {
  font-size: 0.8rem;
  filter: grayscale(1);
  transition: filter 0.3s ease;
}

.luxury-star.filled {
  filter: grayscale(0);
}

.rating-text {
  font-size: 0.85rem;
  margin-left: 4px;
}

/* Gradient Overlay */
.luxury-gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.luxury-umkm-card.hovered .luxury-gradient-overlay {
  opacity: 1;
}

/* Parallax Elements */
.parallax-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.location-pin {
  position: absolute;
  bottom: 20px;
  left: 20px;
  font-size: 1.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
  z-index: 2;
}

.camera-flash {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 1.3rem;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.4s ease;
  z-index: 2;
}

.luxury-umkm-card.hovered .location-pin {
  opacity: 1;
  transform: translateY(0);
}

.luxury-umkm-card.hovered .camera-flash {
  opacity: 1;
  transform: scale(1);
}

/* Premium Content Container */
.luxury-content-container {
  padding: 1.5rem 1.4rem;
  position: relative;
  z-index: 2;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(254, 252, 232, 0.9) 100%
  );
}

.umkm-header {
  margin-bottom: 1rem;
}

.luxury-umkm-title {
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.4rem;
  line-height: 1.3;
  font-family: "Georgia", serif;
}

.umkm-location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(146, 64, 14, 0.7);
  font-size: 1rem;
  font-weight: 500;
}

.location-icon {
  font-size: 1.1rem;
}

.umkm-description {
  color: rgba(55, 65, 81, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.umkm-details {
  margin-bottom: 1rem;
  display: grid;
  gap: 6px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.detail-icon {
  font-size: 1rem;
}

.detail-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
}

.detail-link {
  font-size: 0.9rem;
  font-weight: 500;
  color: #3b82f6;
  text-decoration: none;
  transition: all 0.3s ease;
}

.detail-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* Operational Hours Styling */
.operational-hours {
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.08) 0%,
    rgba(5, 150, 105, 0.05) 100%
  );
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  padding: 12px;
  margin: 8px 0;
}

.operational-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(16, 185, 129, 0.15);
}

.operational-icon {
  font-size: 1.2rem;
}

.operational-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #059669;
}

.operational-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.operational-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  border: 1px solid rgba(16, 185, 129, 0.1);
}

.day-icon,
.time-icon {
  font-size: 1rem;
}

.operational-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
}

.umkm-features {
  margin-bottom: 1.5rem;
}

.feature-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.feature-tag {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.category-tag {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(147, 197, 253, 0.05) 100%
  );
  color: #1e40af;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.category-tag:hover {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.15) 0%,
    rgba(147, 197, 253, 0.08) 100%
  );
  transform: translateY(-1px);
}

.hashtag-tag {
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.1) 0%,
    rgba(251, 207, 232, 0.05) 100%
  );
  color: #be185d;
  border: 1px solid rgba(236, 72, 153, 0.2);
  font-family: "Courier New", monospace;
}

.hashtag-tag:hover {
  background: linear-gradient(
    135deg,
    rgba(236, 72, 153, 0.15) 0%,
    rgba(251, 207, 232, 0.08) 100%
  );
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
}

.tag-icon {
  font-size: 0.9rem;
}

/* Premium CTA Button */
.luxury-cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: #ffffff;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.luxury-cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
}

.button-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.luxury-cta-button:hover .button-glow {
  opacity: 1;
  animation: buttonGlowPulse 1.5s ease-in-out infinite;
}

@keyframes buttonGlowPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.button-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" opacity="0.3"><circle cx="20" cy="20" r="1" fill="%23FFFFFF"/><circle cx="50" cy="15" r="1.5" fill="%23FFFFFF"/><circle cx="80" cy="25" r="1" fill="%23FFFFFF"/></svg>')
    repeat-x;
  animation: particlesFloat 3s ease-in-out infinite;
  opacity: 0;
}

.luxury-cta-button:hover .button-particles {
  opacity: 1;
}

@keyframes particlesFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.arrow-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.luxury-cta-button:hover .arrow-icon {
  transform: translateX(4px);
}

/* Card Decorative Elements */
.card-decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.corner-ornament {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(59, 130, 246, 0.2);
  opacity: 0;
  transition: all 0.3s ease;
}

.corner-ornament.top-left {
  top: 15px;
  left: 15px;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 8px;
}

.corner-ornament.top-right {
  top: 15px;
  right: 15px;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 8px;
}

.corner-ornament.bottom-left {
  bottom: 15px;
  left: 15px;
  border-right: none;
  border-top: none;
  border-bottom-left-radius: 8px;
}

.corner-ornament.bottom-right {
  bottom: 15px;
  right: 15px;
  border-left: none;
  border-top: none;
  border-bottom-right-radius: 8px;
}

.luxury-umkm-card.hovered .corner-ornament {
  opacity: 1;
  border-color: rgba(59, 130, 246, 0.5);
}

/* Empty State */
.luxury-empty {
  text-align: center;
  padding: 4rem 0;
  color: #6b7280;
}

.no-data-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

.luxury-empty h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #374151;
}

.luxury-empty p {
  font-size: 1rem;
  color: #6b7280;
}

/* ========== UMKM INSPIRATIONS SECTION ========== */

.umkm-inspirations-section {
  padding: 80px 0;
}

.inspirations-header {
  text-align: center;
  margin-bottom: 4rem;
}

.inspirations-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  position: relative;
}

.inspirations-subtitle {
  font-size: 1.3rem;
  color: rgba(146, 64, 14, 0.8);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.inspirations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.inspiration-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(254, 252, 232, 0.8) 100%
  );
  padding: 2rem;
  border-radius: 24px;
  text-align: center;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(10px);
}

.inspiration-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(59, 130, 246, 0.15);
}

.inspiration-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  animation: inspirationFloat 3s ease-in-out infinite;
}

@keyframes inspirationFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.inspiration-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.8rem;
}

.inspiration-description {
  color: #6b7280;
  font-size: 0.95rem;
}

.inspiration-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05) 0%,
    rgba(147, 197, 253, 0.02) 100%
  );
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.inspiration-card:hover .inspiration-glow {
  opacity: 1;
}

/* Layout */
.bottom-accent {
  pointer-events: none;
  margin-top: 64px;
  height: 112px;
  width: 100%;
  background: linear-gradient(to top, #fef3c7, transparent);
}

/* Scroll reveal directive styles */
[v-scroll-reveal] {
  transition: opacity 600ms ease, transform 600ms ease;
  opacity: 0;
  transform: translateY(12px);
}

/* Focus ring */
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
  border-radius: 12px;
}

/* ========== LOADING STATES ========== */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 4rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(249, 250, 251, 0.98) 100%
  );
  border-radius: var(--radius-2xl);
  margin: 2rem 0;
}

.luxury-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 2rem;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid var(--primary-600);
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  border-top-color: var(--primary-700);
  animation-delay: -0.4s;
}

.spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  border-top-color: #60a5fa;
  animation-delay: -0.8s;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: var(--muted);
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  margin: 0;
  opacity: 0.8;
  animation: fadeInOut 2s ease-in-out infinite;
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* Error State */
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 4rem 2rem;
  background: linear-gradient(
    135deg,
    rgba(254, 242, 242, 0.95) 0%,
    rgba(253, 246, 246, 0.98) 100%
  );
  border: 2px solid rgba(248, 113, 113, 0.2);
  border-radius: var(--radius-2xl);
  margin: 2rem 0;
  text-align: center;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 1rem;
}

.error-message {
  color: #991b1b;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 400px;
  margin-bottom: 2rem;
}

.retry-button {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(220, 38, 38, 0.3);
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 1200px) {
  .luxury-cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.3rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .luxury-section-title {
    font-size: 2.5rem;
  }

  .search-filter-wrapper {
    flex-direction: column;
    gap: 15px;
  }

  .luxury-search-bar,
  .premium-filter-dropdown {
    min-width: 100%;
    max-width: 100%;
  }

  .luxury-cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.2rem;
  }

  .inspirations-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .main-content {
    padding: 0 15px;
  }

  /* Mobile operational hours */
  .operational-hours {
    padding: 10px;
  }

  .operational-content {
    gap: 5px;
  }

  .operational-item {
    padding: 4px 8px;
  }

  .feature-tags {
    gap: 5px;
  }

  .feature-tag {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .luxury-section-title {
    font-size: 2rem;
  }

  .premium-search-section {
    padding: 80px 0 60px;
  }

  .luxury-umkm-section {
    padding: 60px 0;
  }

  .luxury-content-container {
    padding: 1.5rem 1.2rem;
  }

  /* Portrait layout adjustments for mobile */
  .luxury-image-container {
    height: 200px;
  }

  .luxury-cards-grid {
    grid-template-columns: 1fr;
  }

  .luxury-content-container {
    padding: 1.2rem 1rem;
  }

  /* Loading State Mobile */
  .loading-container {
    min-height: 300px;
    padding: 3rem 1rem;
  }

  .luxury-spinner {
    width: 50px;
    height: 50px;
    margin-bottom: 1.5rem;
  }

  .loading-text {
    font-size: 1rem;
  }

  /* Error State Mobile */
  .error-container {
    min-height: 300px;
    padding: 3rem 1.5rem;
  }

  .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .error-title {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }

  .error-message {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .retry-button {
    padding: 0.65rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
<style scoped>
.ekraf-page {
  overflow-y: auto;
}
</style>
