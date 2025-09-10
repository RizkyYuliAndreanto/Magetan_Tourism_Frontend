<template>
  <div class="pariwisata-page">
    <!-- Luxurious Animated Background -->
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
      <!-- Premium Search & Filter Section -->
      <section class="premium-search-section">
        <div class="search-container">
          <h1 class="hero-title">
            <span class="title-gradient">Temukan Destinasi</span>
            <span class="title-accent">Wisata Impian</span>
          </h1>

          <div class="search-filter-wrapper">
            <div class="luxury-search-bar">
              <div class="search-icon">🔍</div>
              <input
                v-model="searchQuery"
                type="text"
                class="premium-search-input"
                placeholder="Cari destinasi wisata yang menakjubkan..." />
              <div class="search-accent-line"></div>
            </div>

            <div class="premium-filter-dropdown">
              <button
                @click="toggleDropdown"
                class="luxury-dropdown-toggle"
                :class="{ 'dropdown-open': isDropdownOpen }">
                <span class="filter-icon">🏔️</span>
                <span class="button-label">{{
                  selectedKategoriLabel || "Semua Kategori"
                }}</span>
                <svg
                  class="dropdown-arrow"
                  :class="{ rotate: isDropdownOpen }"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              <ul v-if="isDropdownOpen" class="luxury-dropdown-menu">
                <li
                  @click="selectKategoriCustom('')"
                  :class="{ active: selectedKategori === '' }"
                  class="dropdown-item">
                  <span class="item-icon">🌟</span>
                  <span class="menu-label">Semua Kategori</span>
                </li>
                <li
                  v-for="kategori in kategoriList"
                  :key="kategori.id_kategori_destinasi"
                  @click="selectKategoriCustom(kategori.id_kategori_destinasi)"
                  :class="{
                    active: selectedKategori === kategori.id_kategori_destinasi,
                  }"
                  class="dropdown-item">
                  <span
                    class="item-icon"
                    v-html="getKategoriIcon(kategori.nama_kategori)"></span>
                  <span class="menu-label">{{ kategori.nama_kategori }}</span>
                  <div class="item-glow"></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Premium Tourism Cards Section -->
      <section class="luxury-tourism-section">
        <div class="section-header">
          <h2 class="luxury-section-title">
            <span class="title-shimmer">Rekomendasi Destinasi</span>
            <div class="title-underline"></div>
          </h2>
          <p class="section-subtitle">
            Jelajahi keindahan Indonesia yang memukau
          </p>
        </div>

        <div v-if="loading" class="luxury-loading">
          <div class="loading-spinner"></div>
          <p>Memuat destinasi menakjubkan...</p>
        </div>

        <div v-else-if="error" class="luxury-error">{{ error }}</div>

        <div v-else class="luxury-cards-grid">
          <div v-if="filteredPariwisata.length === 0" class="no-data-luxury">
            <div class="no-data-icon">🏝️</div>
            <p>Tidak ada destinasi yang ditemukan</p>
          </div>

          <div
            v-for="(item, cardIndex) in filteredPariwisata"
            :key="item.id_destinasi"
            class="luxury-destination-card"
            :style="{ animationDelay: `${cardIndex * 0.1}s` }"
            @mouseenter="cardHover"
            @mouseleave="cardLeave">
            <!-- Premium Image Container -->
            <div class="luxury-image-container">
              <div class="image-carousel">
                <transition-group name="luxury-fade" tag="div">
                  <img
                    v-for="(image, imgIndex) in getCarouselImages(item)"
                    :key="imgIndex"
                    v-show="currentImageIndex[item.id_destinasi] === imgIndex"
                    :src="image.url"
                    :alt="image.alt"
                    class="luxury-destination-image" />
                </transition-group>
              </div>

              <!-- Floating Category Badge -->
              <div class="floating-category-badge">
                <span class="category-icon">{{
                  getCategoryIcon(item.kategoriDestinasi?.nama_kategori)
                }}</span>
                <span class="category-text">{{
                  item.kategoriDestinasi?.nama_kategori || "Wisata"
                }}</span>
              </div>

              <!-- Premium Rating -->
              <div class="luxury-rating">
                <div class="stars-container">
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="luxury-star"
                    :class="{ filled: n <= (item.rating || 4) }"
                    >⭐</span
                  >
                </div>
                <span class="rating-text">{{ item.rating || 4.0 }}</span>
              </div>

              <!-- Gradient Overlay -->
              <div class="luxury-gradient-overlay"></div>

              <!-- Parallax Elements -->
              <div class="parallax-elements">
                <div class="location-pin">📍</div>
                <div class="camera-flash">📸</div>
              </div>
            </div>

            <!-- Premium Content Container -->
            <div class="luxury-content-container">
              <div class="destination-header">
                <h3 class="luxury-destination-title">
                  {{ item.nama_destinasi }}
                </h3>
                <p class="destination-location">
                  <span class="location-icon">🌍</span>
                  {{ item.lokasi || "Magetan, Indonesia" }}
                </p>
              </div>

              <div class="destination-features">
                <div class="feature-tags">
                  <span class="feature-tag">📸 Instagram-able</span>
                  <span class="feature-tag">🌿 Alam</span>
                </div>
              </div>

              <!-- Premium CTA Button -->
              <router-link
                :to="`/destinasi/${item.id_destinasi}`"
                class="luxury-cta-button">
                <span class="button-text">Jelajahi Destinasi</span>
                <div class="button-glow"></div>
                <div class="button-particles"></div>
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
                </svg>
              </router-link>
            </div>

            <!-- Card Decorative Elements -->
            <div class="card-decorations">
              <div class="corner-ornament top-left"></div>
              <div class="corner-ornament top-right"></div>
              <div class="corner-ornament bottom-left"></div>
              <div class="corner-ornament bottom-right"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Destinations Carousel -->
      <section class="featured-carousel-section">
        <div class="carousel-header">
          <h2 class="carousel-title">Destinasi Unggulan</h2>
          <p class="carousel-subtitle">Pengalaman wisata tak terlupakan</p>
        </div>

        <div class="cinematic-carousel">
          <div class="carousel-container">
            <div
              class="carousel-track"
              :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div
                v-for="(item, index) in filteredPariwisata.slice(0, 5)"
                :key="item.id_destinasi"
                class="carousel-slide">
                <div class="slide-background">
                  <img
                    :src="getCarouselImages(item)[0].url"
                    :alt="item.nama_destinasi" />
                  <div class="cinematic-overlay"></div>
                </div>
                <div class="slide-content">
                  <h3 class="slide-title">{{ item.nama_destinasi }}</h3>
                  <p class="slide-description">
                    Temukan keajaiban alam yang menakjubkan
                  </p>
                  <router-link
                    :to="`/destinasi/${item.id_destinasi}`"
                    class="slide-cta">
                    Mulai Petualangan
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <div class="carousel-controls">
            <button @click="prevSlide" class="carousel-btn prev">‹</button>
            <button @click="nextSlide" class="carousel-btn next">›</button>
          </div>

          <div class="carousel-indicators">
            <span
              v-for="(item, index) in filteredPariwisata.slice(0, 5)"
              :key="index"
              :class="{ active: index === currentSlide }"
              @click="goToSlide(index)">
            </span>
          </div>
        </div>
      </section>

      <!-- Travel Inspirations Section -->
      <section class="travel-inspirations-section">
        <div class="inspirations-header">
          <h2 class="inspirations-title">Inspirasi Perjalanan</h2>
          <p class="inspirations-subtitle">
            Aktivitas menarik untuk setiap petualangan
          </p>
        </div>

        <div class="inspirations-grid">
          <div
            class="inspiration-card"
            v-for="inspiration in travelInspirations"
            :key="inspiration.id">
            <div class="inspiration-icon">{{ inspiration.icon }}</div>
            <h3 class="inspiration-title">{{ inspiration.title }}</h3>
            <p class="inspiration-description">{{ inspiration.description }}</p>
            <div class="inspiration-glow"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";
const pariwisataList = ref([]);
const kategoriList = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedKategori = ref("");
const searchQuery = ref("");
const isDropdownOpen = ref(false);

const carouselInterval = ref(null);
const currentImageIndex = ref({});
const currentSlide = ref(0);

// Travel Inspirations Data
const travelInspirations = ref([
  {
    id: 1,
    icon: "🏔️",
    title: "Petualangan Gunung",
    description: "Jelajahi puncak-puncak menakjubkan",
  },
  {
    id: 2,
    icon: "🏖️",
    title: "Wisata Pantai",
    description: "Nikmati keindahan pesisir Indonesia",
  },
  {
    id: 3,
    icon: "🍜",
    title: "Kuliner Lokal",
    description: "Cicipi kelezatan masakan tradisional",
  },
  {
    id: 4,
    icon: "🏛️",
    title: "Wisata Budaya",
    description: "Temukan warisan budaya nusantara",
  },
]);

const kategoriIcons = {
  pantai: "🏖️",
  pegunungan: "🏔️",
  budaya: "🏛️",
  kuliner: "🍜",
  kota: "🏙️",
  alam: "🌿",
  adventure: "🎿",
  religi: "🕌",
};

const getKategoriIcon = (nama) => {
  const normalizedNama = nama?.toLowerCase().trim();
  return kategoriIcons[normalizedNama] || "🌟";
};

const getCategoryIcon = (kategori) => {
  return getKategoriIcon(kategori);
};

const getImageUrl = (path) => {
  if (!path)
    return "https://plus.unsplash.com/premium_photo-1750864966673-de251dfd7aef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%33D%33D";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
};

const getCarouselImages = (item) => {
  const images = [];
  if (item.gambar_utama) {
    images.push({
      url: getImageUrl(item.gambar_utama),
      alt: item.nama_destinasi,
    });
  }
  if (item.galeriDestinasi && item.galeriDestinasi.length > 0) {
    item.galeriDestinasi.forEach((galeriItem) => {
      images.push({
        url: getImageUrl(galeriItem.path_file),
        alt: galeriItem.deskripsi_file,
      });
    });
  }
  if (images.length === 0) {
    images.push({ url: getImageUrl(null), alt: "No Image Found" });
  }
  return images;
};

const selectedKategoriLabel = computed(() => {
  if (selectedKategori.value === "") {
    return "Semua Kategori";
  }
  const kategori = kategoriList.value.find(
    (k) => k.id_kategori_destinasi === selectedKategori.value
  );
  return kategori ? kategori.nama_kategori : "Pilih Kategori";
});

const fetchPariwisata = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/destinasi`);
    pariwisataList.value = response.data;
  } catch (err) {
    error.value = "Gagal memuat data pariwisata.";
    console.error(err);
  }
};

const fetchKategori = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/kategori-destinasi`);
    kategoriList.value = response.data;
  } catch (err) {
    error.value = "Gagal memuat data kategori.";
    console.error(err);
  }
};

const filteredPariwisata = computed(() => {
  let list = pariwisataList.value;
  if (selectedKategori.value) {
    list = list.filter(
      (item) =>
        String(item.id_kategori_destinasi) === String(selectedKategori.value)
    );
  }
  if (searchQuery.value) {
    list = list.filter((item) =>
      item.nama_destinasi
        ?.toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    );
  }
  return list;
});

const startCarousel = () => {
  carouselInterval.value = setInterval(() => {
    filteredPariwisata.value.forEach((item) => {
      const images = getCarouselImages(item);
      const currentIndex = currentImageIndex.value[item.id_destinasi] || 0;
      const nextIndex = (currentIndex + 1) % images.length;
      currentImageIndex.value = {
        ...currentImageIndex.value,
        [item.id_destinasi]: nextIndex,
      };
    });
  }, 4000);
};

const startFeaturedCarousel = () => {
  setInterval(() => {
    nextSlide();
  }, 6000);
};

const nextSlide = () => {
  const maxSlides = Math.min(filteredPariwisata.value.length, 5);
  currentSlide.value = (currentSlide.value + 1) % maxSlides;
};

const prevSlide = () => {
  const maxSlides = Math.min(filteredPariwisata.value.length, 5);
  currentSlide.value =
    currentSlide.value === 0 ? maxSlides - 1 : currentSlide.value - 1;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectKategoriCustom = (id) => {
  selectedKategori.value = id;
  isDropdownOpen.value = false;
};

const cardHover = (event) => {
  event.currentTarget.classList.add("hovered");
};

const cardLeave = (event) => {
  event.currentTarget.classList.remove("hovered");
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchPariwisata(), fetchKategori()]);
  loading.value = false;
  startCarousel();
  startFeaturedCarousel();
});

onUnmounted(() => {
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value);
  }
});
</script>

<style scoped>
/* ========== LUXURY BACKGROUND & BASE ========== */

.pariwisata-page {
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

/* Background Animations */
@keyframes mountainParallax {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-20px);
  }
}

@keyframes cloudFloat {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(1300px);
  }
}

@keyframes riceFieldSway {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.1);
  }
}

@keyframes sunsetPulse {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.5;
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
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
}

@keyframes birdsFlying {
  0% {
    transform: translateX(-200px);
  }
  100% {
    transform: translateX(1400px);
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
    #60a5fa 0%,
    #93c5fd 30%,
    #dbeafe 70%,
    #ffffff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  text-shadow: 0 0 20px rgba(147, 197, 253, 0.8),
    0 0 40px rgba(59, 130, 246, 0.6), 0 4px 8px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  animation: titleShimmer 3s ease-in-out infinite;
}

.title-accent {
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #dbeafe 100%);
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
    text-shadow: 0 0 20px rgba(147, 197, 253, 0.8),
      0 0 40px rgba(59, 130, 246, 0.6), 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  50% {
    filter: brightness(1.4) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
    text-shadow: 0 0 30px rgba(147, 197, 253, 1),
      0 0 60px rgba(59, 130, 246, 0.8), 0 6px 12px rgba(0, 0, 0, 0.4);
  }
}

@keyframes titleFloat {
  0%,
  100% {
    transform: translateY(0);
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.9),
      0 0 30px rgba(219, 234, 254, 0.7), 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: translateY(-5px);
    text-shadow: 0 0 20px rgba(255, 255, 255, 1),
      0 0 40px rgba(219, 234, 254, 0.9), 0 4px 8px rgba(0, 0, 0, 0.25);
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
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
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
    transform: translateY(-50%) scale(1);
  }
  50% {
    transform: translateY(-50%) scale(1.1);
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
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
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
  background: linear-gradient(135deg, #ebf4ff 0%, #dbeafe 100%);
  color: #1e3a8a;
  transform: translateX(4px);
}

.dropdown-item.active {
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
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
    45deg,
    transparent,
    rgba(59, 130, 246, 0.1),
    transparent
  );
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dropdown-item:hover .item-glow {
  opacity: 1;
}

/* ========== LUXURY TOURISM SECTION ========== */

.luxury-tourism-section {
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
    #60a5fa 0%,
    #93c5fd 30%,
    #dbeafe 70%,
    #ffffff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  text-shadow: 0 0 25px rgba(147, 197, 253, 0.9),
    0 0 50px rgba(59, 130, 246, 0.7), 0 4px 12px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
  animation: textShimmer 3s ease-in-out infinite;
}

@keyframes textShimmer {
  0%,
  100% {
    background-position: 0% 50%;
    filter: brightness(1) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
    text-shadow: 0 0 25px rgba(147, 197, 253, 0.9),
      0 0 50px rgba(59, 130, 246, 0.7), 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  50% {
    background-position: 100% 50%;
    filter: brightness(1.3) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    text-shadow: 0 0 35px rgba(147, 197, 253, 1),
      0 0 70px rgba(59, 130, 246, 0.9), 0 6px 16px rgba(0, 0, 0, 0.4);
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

/* Luxury Loading & Error States */
.luxury-loading {
  text-align: center;
  padding: 4rem 0;
  color: #3b82f6;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: luxurySpinner 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes luxurySpinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.luxury-error {
  text-align: center;
  padding: 4rem 0;
  color: #ef4444;
  font-size: 1.2rem;
}

.no-data-luxury {
  text-align: center;
  padding: 4rem 0;
  color: #6b7280;
}

.no-data-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

/* ========== LUXURY DESTINATION CARDS ========== */

.luxury-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
}

.luxury-destination-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(248, 250, 252, 0.8) 100%
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

.luxury-destination-card.hovered {
  transform: translateY(-20px) rotateX(5deg) rotateY(2deg);
  box-shadow: 0 40px 80px rgba(59, 130, 246, 0.2),
    0 20px 40px rgba(0, 0, 0, 0.1);
}

.luxury-destination-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(59, 130, 246, 0.1),
    transparent,
    rgba(147, 197, 253, 0.1)
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

.luxury-destination-card.hovered::before {
  opacity: 1;
}

/* Premium Image Container */
.luxury-image-container {
  position: relative;
  height: 280px;
  overflow: hidden;
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
}

.image-carousel {
  width: 100%;
  height: 100%;
  position: relative;
}

.luxury-destination-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1.1) contrast(1.05) saturate(1.2);
}

.luxury-destination-card.hovered .luxury-destination-image {
  transform: scale(1.15) rotate(1deg);
  filter: brightness(1.2) contrast(1.1) saturate(1.3);
}

.luxury-fade-enter-active,
.luxury-fade-leave-active {
  transition: opacity 1.2s ease-in-out;
}

.luxury-fade-enter-from,
.luxury-fade-leave-to {
  opacity: 0;
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

.luxury-destination-card.hovered .floating-category-badge {
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

.luxury-destination-card.hovered .luxury-rating {
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
  background: linear-gradient(
    to top,
    rgba(30, 58, 138, 0.8) 0%,
    rgba(59, 130, 246, 0.4) 40%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

.luxury-destination-card.hovered .luxury-gradient-overlay {
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

.luxury-destination-card.hovered .location-pin {
  opacity: 1;
  transform: translateY(0);
}

.luxury-destination-card.hovered .camera-flash {
  opacity: 1;
  transform: scale(1);
}

/* Premium Content Container */
.luxury-content-container {
  padding: 2rem 1.8rem;
  position: relative;
  z-index: 2;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.9) 100%
  );
}

.destination-header {
  margin-bottom: 1.5rem;
}

.luxury-destination-title {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  font-family: "Georgia", serif;
}

.destination-location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(30, 58, 138, 0.7);
  font-size: 1rem;
  font-weight: 500;
}

.location-icon {
  font-size: 1.1rem;
}

.destination-features {
  margin-bottom: 2rem;
}

.feature-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.feature-tag {
  background: linear-gradient(
    45deg,
    rgba(59, 130, 246, 0.1),
    rgba(147, 197, 253, 0.1)
  );
  color: #1e3a8a;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* Premium CTA Button */
.luxury-cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
  color: #ffffff;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.luxury-cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
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
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.2);
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

.luxury-destination-card.hovered .corner-ornament {
  opacity: 1;
  border-color: rgba(59, 130, 246, 0.6);
}

/* ========== FEATURED CAROUSEL SECTION ========== */

.featured-carousel-section {
  padding: 100px 0;
  background: linear-gradient(
    135deg,
    rgba(30, 58, 138, 0.05) 0%,
    rgba(59, 130, 246, 0.02) 100%
  );
  border-radius: 40px;
  margin: 80px 0;
  position: relative;
}

.carousel-header {
  text-align: center;
  margin-bottom: 4rem;
}

.carousel-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.carousel-subtitle {
  font-size: 1.2rem;
  color: rgba(30, 58, 138, 0.7);
  font-weight: 500;
}

.cinematic-carousel {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
}

.carousel-container {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
  min-width: 100%;
  position: relative;
  height: 100%;
}

.slide-background {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7) contrast(1.1);
}

.cinematic-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 58, 138, 0.6) 0%,
    transparent 50%,
    rgba(59, 130, 246, 0.4) 100%
  );
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3rem;
  color: #ffffff;
  background: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.7) 100%);
}

.slide-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

.slide-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.slide-cta {
  display: inline-block;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.slide-cta:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.carousel-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  transform: translateY(-50%);
  pointer-events: none;
}

.carousel-btn {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: #ffffff;
  font-size: 1.8rem;
  cursor: pointer;
  pointer-events: all;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn:hover {
  background: rgba(59, 130, 246, 0.8);
  border-color: rgba(59, 130, 246, 0.8);
  transform: scale(1.1);
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
}

.carousel-indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators span.active {
  background: #ffffff;
  transform: scale(1.3);
}

/* ========== TRAVEL INSPIRATIONS SECTION ========== */

.travel-inspirations-section {
  padding: 100px 0;
}

.inspirations-header {
  text-align: center;
  margin-bottom: 4rem;
}

.inspirations-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.inspirations-subtitle {
  font-size: 1.2rem;
  color: rgba(30, 58, 138, 0.7);
  font-weight: 500;
}

.inspirations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.inspiration-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(248, 250, 252, 0.8) 100%
  );
  border-radius: 25px;
  padding: 2.5rem 2rem;
  text-align: center;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(15px);
  cursor: pointer;
}

.inspiration-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.inspiration-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: block;
  animation: inspirationFloat 3s ease-in-out infinite;
}

@keyframes inspirationFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.inspiration-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 1rem;
}

.inspiration-description {
  color: rgba(30, 58, 138, 0.7);
  line-height: 1.6;
}

.inspiration-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(59, 130, 246, 0.1) 0%,
    transparent 70%
  );
  border-radius: 25px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.inspiration-card:hover .inspiration-glow {
  opacity: 1;
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 1200px) {
  .luxury-cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .search-filter-wrapper {
    flex-direction: column;
    gap: 15px;
  }

  .luxury-search-bar,
  .premium-filter-dropdown {
    max-width: none;
    min-width: auto;
  }

  .luxury-cards-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .luxury-section-title {
    font-size: 2.5rem;
  }

  .carousel-title {
    font-size: 2rem;
  }

  .inspirations-title {
    font-size: 2rem;
  }

  .inspirations-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .luxury-section-title {
    font-size: 2rem;
  }

  .luxury-destination-card {
    border-radius: 20px;
  }

  .luxury-content-container {
    padding: 1.5rem;
  }

  .slide-content {
    padding: 2rem 1.5rem;
  }

  .slide-title {
    font-size: 1.8rem;
  }
}
</style>
