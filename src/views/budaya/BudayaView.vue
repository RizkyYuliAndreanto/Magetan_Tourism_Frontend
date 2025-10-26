<template>
  <div class="budaya-view-user">
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
      <div class="hero-section">
        <h1 class="page-title">
          <span class="title-gradient">Warisan Budaya</span>
          <span class="title-accent">Magetan</span>
        </h1>
        <p class="page-subtitle">
          Jelajahi kekayaan budaya dan warisan tradisional Kabupaten Magetan
        </p>
        <div class="hero-ornament"></div>
      </div>

      <div v-if="loading" class="luxury-loading">
        <div class="cultural-spinner"></div>
        <p>Memuat daftar budaya...</p>
      </div>

      <div v-if="error" class="luxury-error">
        <div class="error-icon">❌</div>
        <p>
          Maaf, terjadi kesalahan saat memuat data budaya. Silakan coba kembali.
        </p>
      </div>

      <div
        v-if="
          !loading &&
          !error &&
          objekPengembanganItems.length === 0 &&
          situsKebudayaanItems.length === 0 &&
          sejarahItems.length === 0
        "
        class="luxury-empty">
        <div class="empty-icon">🏛️</div>
        <p>Belum ada data budaya yang tersedia saat ini.</p>
      </div>

      <!-- Objek Pengembangan Budaya Section -->
      <section
        class="luxury-budaya-section objek-pengembangan-budaya"
        v-if="objekPengembanganItems.length > 0">
        <div class="section-header">
          <h2 class="luxury-section-title">
            <span class="title-shimmer">Objek Pengembangan Budaya</span>
          </h2>
          <div class="section-subtitle">
            Budaya yang dikembangkan untuk generasi mendatang
          </div>
          <div class="animated-divider">
            <div class="glow-line"></div>
            <div class="cultural-icon">🏛️</div>
            <div class="glow-line"></div>
          </div>
        </div>

        <!-- Horizontal Cultural Carousel -->
        <div class="cultural-carousel-container">
          <div class="carousel-header">
            <div class="carousel-navigation">
              <button
                @click="scrollCarousel('objek-pengembangan', 'left')"
                class="nav-button prev-button"
                :disabled="objekPengembanganScrollPosition === 0">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" />
                </svg>
              </button>
              <button
                @click="scrollCarousel('objek-pengembangan', 'right')"
                class="nav-button next-button">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
                </svg>
              </button>
            </div>
          </div>

          <div
            class="cultural-carousel objek-pengembangan-carousel"
            ref="objekPengembanganCarousel">
            <div class="carousel-track">
              <div
                v-for="(item, index) in objekPengembanganItems"
                :key="item.id_budaya"
                class="carousel-card objek-pengembangan-card"
                :style="{ animationDelay: `${index * 0.15}s` }"
                @mouseenter="cardHover"
                @mouseleave="cardLeave">
                <!-- Cultural Badge -->
                <div class="heritage-badge">
                  <div class="badge-crown">🏛️</div>
                  <span class="badge-text">OBJEK PENGEMBANGAN</span>
                </div>

                <!-- Cultural Frame -->
                <div class="cultural-frame">
                  <div class="frame-corners">
                    <div class="corner top-left"></div>
                    <div class="corner top-right"></div>
                    <div class="corner bottom-left"></div>
                    <div class="corner bottom-right"></div>
                  </div>

                  <div class="cultural-image-container">
                    <div class="image-overlay cagar-overlay"></div>
                    <img
                      v-if="item.gambar_budaya"
                      :src="`http://localhost:5000${item.gambar_budaya}`"
                      :alt="item.judul_budaya"
                      class="cultural-image" />
                    <div v-else class="cultural-no-image">
                      <div class="temple-icon">🏛️</div>
                      <span>Objek Pengembangan</span>
                    </div>
                    <div class="heritage-shine"></div>
                  </div>
                </div>

                <!-- Cultural Content -->
                <div class="cultural-content">
                  <div class="cultural-header">
                    <h3 class="cultural-title">{{ item.judul_budaya }}</h3>
                    <div class="heritage-seal">🏛️</div>
                  </div>

                  <div class="cultural-meta">
                    <span class="era-info"
                      >Kategori: {{ item.kategori_budaya }}</span
                    >
                    <span class="location-info"
                      >�
                      {{
                        new Date(item.createdAt).toLocaleDateString("id-ID")
                      }}</span
                    >
                  </div>

                  <p class="cultural-description">
                    {{ truncateText(item.deskripsi_budaya, 100) }}
                  </p>

                  <div class="cultural-actions">
                    <button
                      @click="exploreObjekPengembangan(item.id_budaya)"
                      class="heritage-button">
                      <span>Jelajahi Budaya</span>
                      <div class="button-ornament"></div>
                    </button>
                  </div>
                </div>

                <!-- Traditional Ornaments -->
                <div class="traditional-ornaments">
                  <div class="ornament-pattern top"></div>
                  <div class="ornament-pattern bottom"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Situs Kebudayaan Section -->

      class="luxury-budaya-section situs-kebudayaan"
      v-if="situsKebudayaanItems.length > 0">
      <div class="section-header">
        <h2 class="luxury-section-title">
          <span class="title-shimmer">Situs Kebudayaan</span>
        </h2>
        <div class="section-subtitle">
          Tempat bersejarah dengan nilai budaya tinggi
        </div>
        <div class="animated-divider">
          <div class="glow-line"></div>
          <div class="cultural-icon">�️</div>
          <div class="glow-line"></div>
        </div>
      </div>

      <!-- Cultural Carousel -->
      <div class="cultural-navigation">
        <div class="nav-controls">
          <button
            @click="scrollCarousel('situs-kebudayaan', 'left')"
            class="nav-button prev-button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" />
            </svg>
          </button>
          <button
            @click="scrollCarousel('situs-kebudayaan', 'right')"
            class="nav-button next-button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="cultural-carousel situs-kebudayaan-carousel">
        <div class="carousel-track">
          <div
            v-for="(item, index) in situsKebudayaanItems"
            :key="item.id_budaya"
            class="carousel-card situs-kebudayaan-card"
            :style="{ animationDelay: `${index * 0.15}s` }"
            @mouseenter="cardHover"
            @mouseleave="cardLeave">
            <!-- Cultural Badge -->
            <div class="heritage-badge">
              <div class="badge-crown">🏛️</div>
              <span class="badge-text">SITUS KEBUDAYAAN</span>
              <div class="badge-accent">�️</div>
            </div>

            <!-- Cultural Frame -->
            <div class="cultural-frame">
              <div class="frame-corners">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
              </div>

              <div class="cultural-image-container">
                <div class="image-overlay cagar-overlay"></div>
                <img
                  v-if="item.gambar_budaya"
                  :src="`http://localhost:5000${item.gambar_budaya}`"
                  :alt="item.judul_budaya"
                  class="cultural-image" />
                <div v-else class="artistic-no-image">
                  <div class="culture-icon">�️</div>
                  <span>Situs Kebudayaan</span>
                </div>
                <div class="heritage-shine"></div>
              </div>

              <!-- Cultural Details -->
              <div class="cultural-content">
                <div class="cultural-header">
                  <h3 class="cultural-title">{{ item.judul_budaya }}</h3>
                  <div class="heritage-seal">🏛️</div>
                </div>

                <div class="cultural-meta">
                  <span class="origin-info"
                    >📅
                    {{
                      new Date(item.createdAt).toLocaleDateString("id-ID")
                    }}</span
                  >
                  <span class="category-info"
                    >� {{ item.adminPengelola?.username || "Admin" }}</span
                  >
                </div>

                <p class="cultural-description">
                  {{ truncateText(item.deskripsi_budaya, 100) }}
                </p>

                <div class="cultural-actions">
                  <button
                    @click="exploreSitusKebudayaan(item.id_budaya)"
                    class="heritage-button">
                    <span>Pelajari Situs</span>
                    <div class="button-ornament"></div>
                  </button>
                </div>
              </div>

              <!-- Traditional Ornaments -->
              <div class="traditional-ornaments">
                <div class="ornament-pattern top"></div>
                <div class="ornament-pattern bottom"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sejarah Section -->
    <section
      class="luxury-budaya-section sejarah"
      v-if="sejarahItems.length > 0">
      <div class="section-header">
        <h2 class="luxury-section-title">
          <span class="title-shimmer">Sejarah</span>
        </h2>
        <div class="section-subtitle">
          Warisan sejarah dan kisah masa lampau
        </div>
        <div class="animated-divider">
          <div class="glow-line"></div>
          <div class="cultural-icon">📜</div>
          <div class="glow-line"></div>
        </div>
      </div>

      <!-- Cultural Carousel -->
      <div class="cultural-navigation">
        <div class="nav-controls">
          <button
            @click="scrollCarousel('sejarah', 'left')"
            class="nav-button prev-button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" />
            </svg>
          </button>
          <button
            @click="scrollCarousel('sejarah', 'right')"
            class="nav-button next-button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
            </svg>
          </button>
        </div>
      </div>

      <div class="cultural-carousel sejarah-carousel">
        <div class="carousel-track">
          <div
            v-for="(item, index) in sejarahItems"
            :key="item.id_budaya"
            class="carousel-card sejarah-card"
            :style="{ animationDelay: `${index * 0.15}s` }"
            @mouseenter="cardHover"
            @mouseleave="cardLeave">
            <!-- Cultural Badge -->
            <div class="heritage-badge">
              <div class="badge-crown">📜</div>
              <span class="badge-text">SEJARAH</span>
            </div>

            <!-- Cultural Frame -->
            <div class="cultural-frame">
              <div class="frame-corners">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>
              </div>

              <div class="cultural-image-container">
                <div class="image-overlay cagar-overlay"></div>
                <img
                  v-if="item.gambar_budaya"
                  :src="`http://localhost:5000${item.gambar_budaya}`"
                  :alt="item.judul_budaya"
                  class="cultural-image" />
                <div v-else class="cultural-no-image">
                  <div class="temple-icon">🏛️</div>
                  <span>Sejarah Budaya</span>
                </div>
                <div class="heritage-shine"></div>
              </div>
            </div>

            <!-- Cultural Content -->
            <div class="cultural-content">
              <div class="cultural-header">
                <h3 class="cultural-title">{{ item.judul_budaya }}</h3>
                <div class="innovation-badge">�</div>
              </div>

              <div class="cultural-meta">
                <span class="period-info"
                  >📅
                  {{
                    new Date(item.createdAt).toLocaleDateString("id-ID")
                  }}</span
                >
                <span class="creator-info"
                  >� {{ item.adminPengelola?.username || "Admin" }}</span
                >
              </div>

              <p class="cultural-description">
                {{ truncateText(item.deskripsi_budaya, 100) }}
              </p>

              <div class="cultural-actions">
                <button
                  @click="exploreSejarah(item.id_budaya)"
                  class="heritage-button">
                  <span>Pelajari Sejarah</span>
                  <div class="button-ornament"></div>
                </button>
              </div>
            </div>

            <!-- Traditional Ornaments -->
            <div class="traditional-ornaments">
              <div class="ornament-pattern top"></div>
              <div class="ornament-pattern bottom"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios";

// Router instance
const router = useRouter();

// Reactive data
const objekPengembanganItems = ref([]);
const situsKebudayaanItems = ref([]);
const sejarahItems = ref([]);
const loading = ref(true);
const error = ref(false);

// Carousel scroll positions
const objekPengembanganScrollPosition = ref(0);

// Methods
const fetchBudayaData = async () => {
  loading.value = true;
  error.value = false;
  try {
    // Fetch all budaya data from backend
    const response = await axios.get("/budaya");
    const allBudaya = response.data || [];

    // Filter budaya based on kategori_budaya
    objekPengembanganItems.value = allBudaya.filter(
      (item) => item.kategori_budaya === "Objek Pengembangan Budaya"
    );

    situsKebudayaanItems.value = allBudaya.filter(
      (item) => item.kategori_budaya === "Situs Kebudayaan"
    );

    sejarahItems.value = allBudaya.filter(
      (item) => item.kategori_budaya === "Sejarah"
    );

    console.log("Budaya data loaded:", {
      objekPengembangan: objekPengembanganItems.value.length,
      situsKebudayaan: situsKebudayaanItems.value.length,
      sejarah: sejarahItems.value.length,
    });
  } catch (err) {
    console.error("Error fetching budaya data:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

// Carousel methods
const scrollCarousel = (type, direction) => {
  const carousel = document.querySelector(`.${type}-carousel .carousel-track`);
  if (!carousel) return;

  const cardWidth = 350;
  const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

  carousel.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  });

  // Update scroll position
  if (type === "objek-pengembangan") {
    objekPengembanganScrollPosition.value = Math.max(
      0,
      objekPengembanganScrollPosition.value + (direction === "left" ? -1 : 1)
    );
  }
};

// Grid card classes for artistic layout
const getCardClass = (index) => {
  const classes = ["card-large", "card-medium", "card-small"];
  return classes[index % 3];
};

const truncateText = (text, length = 100) => {
  if (!text) return "";
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + "...";
};

const exploreObjekPengembangan = (id) => {
  console.log("Navigate to objek pengembangan budaya detail:", id);
  router.push({ name: "DetailBudaya", params: { id: id } });
};

const exploreSitusKebudayaan = (id) => {
  console.log("Navigate to situs kebudayaan detail:", id);
  router.push({ name: "DetailBudaya", params: { id: id } });
};

const exploreSejarah = (id) => {
  console.log("Navigate to sejarah detail:", id);
  router.push({ name: "DetailBudaya", params: { id: id } });
};

const learnMore = (id) => {
  console.log("Navigate to budaya detail:", id);
  router.push({ name: "DetailBudaya", params: { id: id } });
};

const cardHover = (event) => {
  event.currentTarget.classList.add("hovered");
};

const cardLeave = (event) => {
  event.currentTarget.classList.remove("hovered");
};

onMounted(() => {
  // Scroll ke atas halaman
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  fetchBudayaData();
});
</script>

<style scoped>
/* ========== LUXURY CULTURAL BACKGROUND ========== */

.budaya-view-user {
  position: relative;
  min-height: 100vh;
  font-family: "Inter", "Poppins", sans-serif;
  overflow-x: hidden;
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
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.07"><circle cx="50" cy="50" r="40" fill="none" stroke="%233B82F6" stroke-width="3"/><circle cx="50" cy="50" r="25" fill="none" stroke="%233B82F6" stroke-width="2"/><circle cx="50" cy="50" r="12" fill="%233B82F6"/><path d="M30,30 L70,70 M70,30 L30,70" stroke="%233B82F6" stroke-width="1"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: gamelanPulse 15s ease-in-out infinite;
}

.batik-motifs {
  position: absolute;
  top: 40%;
  left: 20%;
  width: 100%;
  height: 30%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" opacity="0.04"><circle cx="20" cy="30" r="8" fill="none" stroke="%233B82F6" stroke-width="1"/><circle cx="60" cy="15" r="6" fill="none" stroke="%233B82F6" stroke-width="1"/><circle cx="100" cy="45" r="7" fill="none" stroke="%233B82F6" stroke-width="1"/><circle cx="140" cy="20" r="5" fill="none" stroke="%233B82F6" stroke-width="1"/><circle cx="180" cy="40" r="9" fill="none" stroke="%233B82F6" stroke-width="1"/></svg>')
    repeat-x;
  animation: batikFlow 30s linear infinite;
}

.floating-clouds {
  position: absolute;
  top: 15%;
  left: 0;
  width: 100%;
  height: 25%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 250" opacity="0.08"><ellipse cx="200" cy="100" rx="70" ry="25" fill="%23FFFFFF"/><ellipse cx="500" cy="130" rx="90" ry="35" fill="%23FFFFFF"/><ellipse cx="800" cy="80" rx="80" ry="30" fill="%23FFFFFF"/><ellipse cx="1100" cy="150" rx="60" ry="20" fill="%23FFFFFF"/></svg>')
    repeat-x;
  animation: cloudDrift 35s linear infinite;
}

.cultural-glow {
  position: absolute;
  top: 25%;
  right: 20%;
  width: 150px;
  height: 150px;
  background: radial-gradient(
    circle at center,
    rgba(59, 130, 246, 0.15) 0%,
    rgba(59, 130, 246, 0.08) 30%,
    rgba(59, 130, 246, 0.03) 60%,
    transparent 100%
  );
  border-radius: 50%;
  animation: culturalPulse 12s ease-in-out infinite;
}

.tradition-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" opacity="0.03"><circle cx="100" cy="100" r="2" fill="%233B82F6"/><circle cx="300" cy="200" r="1.5" fill="%233B82F6"/><circle cx="500" cy="150" r="2.5" fill="%233B82F6"/><circle cx="700" cy="300" r="1" fill="%233B82F6"/><circle cx="900" cy="250" r="2" fill="%233B82F6"/><circle cx="200" cy="400" r="1.5" fill="%233B82F6"/><circle cx="600" cy="500" r="2" fill="%233B82F6"/><circle cx="800" cy="600" r="1" fill="%233B82F6"/></svg>')
    repeat;
  animation: particleFloat 40s linear infinite;
}

/* Background Animations */
@keyframes mountainSway {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-10px);
  }
}

@keyframes templeFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(2deg);
  }
}

@keyframes wayangDance {
  0%,
  100% {
    transform: translateX(0) scaleX(1);
  }
  25% {
    transform: translateX(-8px) scaleX(0.95);
  }
  75% {
    transform: translateX(8px) scaleX(1.05);
  }
}

@keyframes gamelanPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes batikFlow {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-200px);
  }
}

@keyframes cloudDrift {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100px);
  }
}

@keyframes culturalPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.15;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.25;
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
}

/* ========== MAIN CONTENT ========== */

.container {
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
    #60a5fa 0%,
    #93c5fd 30%,
    #dbeafe 70%,
    #ffffff 100%
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
    filter: brightness(1) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
    text-shadow: 0 0 25px rgba(147, 197, 253, 0.9),
      0 0 50px rgba(59, 130, 246, 0.7), 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  50% {
    filter: brightness(1.4) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    text-shadow: 0 0 35px rgba(147, 197, 253, 1),
      0 0 70px rgba(59, 130, 246, 0.9), 0 6px 16px rgba(0, 0, 0, 0.4);
  }
}

@keyframes titleFloat {
  0%,
  100% {
    transform: translateY(0);
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.9),
      0 0 40px rgba(219, 234, 254, 0.7), 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: translateY(-8px);
    text-shadow: 0 0 30px rgba(255, 255, 255, 1),
      0 0 60px rgba(219, 234, 254, 0.9), 0 4px 12px rgba(0, 0, 0, 0.3);
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
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  }
}

/* ========== LUXURY LOADING & ERROR STATES ========== */

.luxury-loading {
  text-align: center;
  padding: 6rem 0;
  color: rgba(255, 255, 255, 0.9);
}

.cultural-spinner {
  width: 80px;
  height: 80px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #60a5fa;
  border-radius: 50%;
  animation: culturalSpin 1.5s ease-in-out infinite;
  margin: 0 auto 2rem;
}

@keyframes culturalSpin {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.luxury-error,
.luxury-empty {
  text-align: center;
  padding: 6rem 0;
  color: rgba(255, 255, 255, 0.8);
}

.error-icon,
.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  display: block;
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* ========== LUXURY BUDAYA SECTIONS ========== */

.luxury-budaya-section {
  padding: 80px 0;
  position: relative;
}

.cagar-budaya {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(30, 58, 138, 0.05) 100%
  );
}

.budaya-umum {
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.08) 0%,
    rgba(6, 95, 70, 0.04) 100%
  );
}

.non-cagar {
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.08) 0%,
    rgba(76, 29, 149, 0.04) 100%
  );
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.luxury-section-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  margin-bottom: 2rem;
  font-style: italic;
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
  text-shadow: 0 0 30px rgba(147, 197, 253, 0.9),
    0 0 60px rgba(59, 130, 246, 0.7), 0 4px 12px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
  animation: textShimmer 3s ease-in-out infinite;
}

@keyframes textShimmer {
  0%,
  100% {
    background-position: 0% 50%;
    filter: brightness(1) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
  }
  50% {
    background-position: 100% 50%;
    filter: brightness(1.3) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }
}

.animated-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 1rem;
}

.glow-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(45deg, transparent, #60a5fa, transparent);
  animation: lineGlow 2s ease-in-out infinite;
}

@keyframes lineGlow {
  0%,
  100% {
    opacity: 0.5;
    transform: scaleX(1);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.2);
  }
}

.cultural-icon {
  font-size: 2rem;
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
}

/* ========== CULTURAL CAROUSEL STYLES ========== */

.cultural-carousel-container {
  position: relative;
  margin-top: 4rem;
}

.carousel-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.carousel-navigation {
  display: flex;
  gap: 1rem;
}

.nav-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.nav-button:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button svg {
  width: 24px;
  height: 24px;
}

.cultural-carousel {
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.cultural-carousel::-webkit-scrollbar {
  display: none;
}

.carousel-track {
  display: flex;
  gap: 2rem;
  padding: 1rem 0;
}

.carousel-card {
  min-width: 320px;
  max-width: 320px;
  height: 450px;
  min-height: 450px;
  max-height: 450px;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  overflow: hidden;
  position: relative;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(30px);
  animation: cardSlideIn 0.8s ease-out forwards;
  display: flex;
  flex-direction: column;
}

@keyframes cardSlideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cagar-card.hovered {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15),
    0 15px 30px rgba(59, 130, 246, 0.2);
  border-color: rgba(180, 83, 9, 0.4);
}

/* Heritage Badge */
.heritage-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
  color: #ffffff;
  padding: 8px 15px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 10;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(180, 83, 9, 0.4);
}

.badge-crown {
  font-size: 1rem;
}

/* Cultural Frame */
.cultural-frame {
  position: relative;
  margin: 15px;
  border-radius: 20px;
  overflow: hidden;
}

.frame-corners {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(180, 83, 9, 0.8);
}

.corner.top-left {
  top: 8px;
  left: 8px;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 8px;
}

.corner.top-right {
  top: 8px;
  right: 8px;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 8px;
}

.corner.bottom-left {
  bottom: 8px;
  left: 8px;
  border-right: none;
  border-top: none;
  border-bottom-left-radius: 8px;
}

.corner.bottom-right {
  bottom: 8px;
  right: 8px;
  border-left: none;
  border-top: none;
  border-bottom-right-radius: 8px;
}

.cultural-image-container {
  position: relative;
  height: 180px;
  flex-shrink: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
}

.cagar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(180, 83, 9, 0.3) 0%,
    rgba(146, 64, 14, 0.2) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 2;
}

.cagar-card.hovered .cagar-overlay {
  opacity: 1;
}

.cultural-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.cagar-card.hovered .cultural-image {
  transform: scale(1.1);
}

.cultural-no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.temple-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.heritage-shine {
  position: absolute;
  top: -100%;
  left: -100%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(180, 83, 9, 0.3),
    transparent
  );
  opacity: 0;
  transition: all 0.6s ease;
}

.cagar-card.hovered .heritage-shine {
  opacity: 1;
  animation: heritageShine 1.5s ease-out;
}

@keyframes heritageShine {
  0% {
    transform: translateX(-100%) translateY(-100%);
  }
  100% {
    transform: translateX(100%) translateY(100%);
  }
}

/* Cultural Content */
.cultural-content {
  padding: 1.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cultural-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
}

.cultural-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.3;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.heritage-seal {
  font-size: 1.2rem;
  opacity: 0.8;
}

.cultural-meta {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
}

.era-info,
.location-info {
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cultural-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  flex: 1;
}

.cultural-actions {
  display: flex;
  gap: 10px;
}

.heritage-button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(180, 83, 9, 0.3);
}

.heritage-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(180, 83, 9, 0.4);
}

.button-ornament {
  position: absolute;
  top: 50%;
  right: 15px;
  width: 15px;
  height: 2px;
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  transform: translateY(-50%);
  border-radius: 1px;
}

/* Traditional Ornaments */
.traditional-ornaments {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  pointer-events: none;
}

.ornament-pattern {
  position: absolute;
  width: 100%;
  height: 15px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 15" opacity="0.1"><polygon points="0,15 10,0 20,15 30,0 40,15 50,0 60,15 70,0 80,15 90,0 100,15" fill="%23B45309"/></svg>')
    repeat-x;
}

.ornament-pattern.top {
  top: 0;
}

.ornament-pattern.bottom {
  bottom: 0;
  transform: scaleY(-1);
}

/* ========== ARTISTIC GRID STYLES ========== */

.artistic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  align-items: stretch;
}

.artistic-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.04) 100%
  );
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.08);
  opacity: 0;
  transform: translateY(40px);
  animation: cardReveal 0.8s ease-out forwards;
  display: flex;
  flex-direction: column;
  height: 480px;
  min-height: 480px;
  max-height: 480px;
}

.artistic-card.card-large,
.artistic-card.card-medium,
.artistic-card.card-small {
  grid-row: span 1;
  height: 480px;
  min-height: 480px;
  max-height: 480px;
}

.budaya-card.hovered {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 35px 70px rgba(0, 0, 0, 0.12),
    0 18px 35px rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.3);
}

/* Cultural Badge */
.cultural-badge {
  position: absolute;
  top: 18px;
  left: 18px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 8px 22px rgba(16, 185, 129, 0.4);
}

.badge-pattern {
  width: 12px;
  height: 12px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" opacity="0.8"><circle cx="10" cy="10" r="3" fill="none" stroke="%23FFFFFF" stroke-width="1"/><circle cx="10" cy="10" r="7" fill="none" stroke="%23FFFFFF" stroke-width="0.5"/></svg>')
    no-repeat center;
  background-size: contain;
}

.badge-accent {
  font-size: 1rem;
}

/* Artistic Image Container */
.artistic-image-container {
  position: relative;
  height: 180px;
  flex-shrink: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.artistic-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.25) 0%,
    rgba(5, 150, 105, 0.15) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 2;
}

.budaya-card.hovered .artistic-overlay {
  opacity: 1;
}

.artistic-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.budaya-card.hovered .artistic-image {
  transform: scale(1.08) rotate(1deg);
}

.artistic-no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.culture-icon {
  font-size: 3rem;
  margin-bottom: 0.8rem;
}

.artistic-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(16, 185, 129, 0.3) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.budaya-card.hovered .artistic-glow {
  opacity: 1;
  animation: artisticGlow 2s ease-in-out infinite;
}

@keyframes artisticGlow {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Artistic Content */
.artistic-content {
  padding: 1.3rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
}

.artistic-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.3;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.culture-type {
  background: rgba(16, 185, 129, 0.2);
  color: rgba(255, 255, 255, 0.9);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.cultural-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.origin-info,
.category-info {
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.artistic-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 1.3rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  flex: 1;
}

.artistic-actions {
  display: flex;
  gap: 12px;
}

.culture-button {
  flex: 1;
  padding: 14px 22px;
  border: none;
  border-radius: 22px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
}

.culture-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4);
}

.button-wave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
}

.culture-button:active .button-wave {
  width: 200px;
  height: 200px;
}

/* Batik Pattern Overlay */
.batik-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.03;
}

.batik-pattern {
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.3"><circle cx="25" cy="25" r="8" fill="none" stroke="%2310B981" stroke-width="1"/><circle cx="75" cy="25" r="6" fill="none" stroke="%2310B981" stroke-width="1"/><circle cx="25" cy="75" r="7" fill="none" stroke="%2310B981" stroke-width="1"/><circle cx="75" cy="75" r="9" fill="none" stroke="%2310B981" stroke-width="1"/><circle cx="50" cy="50" r="5" fill="%2310B981"/></svg>')
    repeat;
  background-size: 80px 80px;
  animation: batikPattern 20s linear infinite;
}

@keyframes batikPattern {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 80px 80px;
  }
}

/* ========== MODERN SHOWCASE STYLES ========== */

.modern-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  align-items: stretch;
}

.modern-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.03) 100%
  );
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 35px;
  overflow: hidden;
  position: relative;
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.06);
  opacity: 0;
  transform: translateY(50px);
  animation: modernReveal 0.9s ease-out forwards;
  display: flex;
  flex-direction: column;
  height: 500px;
  min-height: 500px;
  max-height: 500px;
}

@keyframes modernReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-card.hovered {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.1),
    0 20px 40px rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.3);
}

/* Modern Badge */
.modern-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
}

.badge-pulse {
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
  animation: modernPulse 2s ease-in-out infinite;
}

@keyframes modernPulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

.badge-sparkle {
  font-size: 1rem;
}

/* Dynamic Image Container */
.dynamic-image-container {
  position: relative;
  height: 200px;
  flex-shrink: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.dynamic-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.2) 0%,
    rgba(124, 58, 237, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 2;
}

.modern-card.hovered .dynamic-overlay {
  opacity: 1;
}

.dynamic-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.modern-card.hovered .dynamic-image {
  transform: scale(1.1) rotate(-1deg);
}

.dynamic-no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.modern-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

/* Dynamic Effects */
.dynamic-effects {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.effect-ring {
  width: 100px;
  height: 100px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  position: absolute;
  top: -50px;
  left: -50px;
  opacity: 0;
  animation: ringPulse 3s ease-in-out infinite;
}

@keyframes ringPulse {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.effect-particles {
  position: absolute;
  width: 200px;
  height: 200px;
  top: -100px;
  left: -100px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" opacity="0.4"><circle cx="50" cy="50" r="2" fill="%23FFFFFF"/><circle cx="150" cy="50" r="1.5" fill="%23FFFFFF"/><circle cx="50" cy="150" r="2.5" fill="%23FFFFFF"/><circle cx="150" cy="150" r="1" fill="%23FFFFFF"/><circle cx="100" cy="100" r="1.8" fill="%23FFFFFF"/></svg>')
    no-repeat center;
  background-size: contain;
  opacity: 0;
  animation: particleFloat 4s ease-in-out infinite;
}

@keyframes particleFloat {
  0%,
  100% {
    opacity: 0;
    transform: translateY(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: translateY(-20px) rotate(180deg);
  }
}

.modern-card.hovered .effect-particles {
  animation-play-state: running;
}

/* Modern Content */
.modern-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.modern-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.modern-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.3;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.innovation-badge {
  font-size: 1.3rem;
  opacity: 0.8;
}

.modern-meta {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.period-info,
.creator-info {
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.modern-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  flex: 1;
}

.modern-actions {
  display: flex;
  gap: 14px;
}

.modern-button {
  flex: 1;
  padding: 16px 24px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 10px 28px rgba(139, 92, 246, 0.3);
}

.modern-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(139, 92, 246, 0.4);
}

.button-glow-modern {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.modern-button:hover .button-glow-modern {
  opacity: 1;
  animation: modernGlow 1.5s ease-in-out infinite;
}

@keyframes modernGlow {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

/* Geometric Pattern Overlay */
.geometric-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.02;
}

.geometric-pattern {
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" opacity="0.5"><polygon points="60,10 90,40 90,80 60,110 30,80 30,40" fill="none" stroke="%238B5CF6" stroke-width="1"/><polygon points="60,30 80,50 80,70 60,90 40,70 40,50" fill="none" stroke="%238B5CF6" stroke-width="0.5"/><circle cx="60" cy="60" r="8" fill="%238B5CF6" opacity="0.3"/></svg>')
    repeat;
  background-size: 120px 120px;
  animation: geometricShift 25s linear infinite;
}

@keyframes geometricShift {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 120px 120px;
  }
}

/* ========== LUXURY BUDAYA CARDS ========== */

.luxury-budaya-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
  margin-top: 4rem;
}

.luxury-budaya-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(59, 130, 246, 0.1);
  opacity: 0;
  transform: translateY(50px);
  animation: cardReveal 0.8s ease-out forwards;
}

@keyframes cardReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.luxury-budaya-card.hovered {
  transform: translateY(-15px) scale(1.02);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.15),
    0 20px 40px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

.luxury-budaya-card::before {
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

.luxury-budaya-card.hovered::before {
  opacity: 1;
}

/* Premium Badge */
.premium-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  overflow: hidden;
  font-size: 0.85rem;
  font-weight: 600;
}

.premium-badge.traditional {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
}

.luxury-budaya-card.hovered .premium-badge {
  transform: scale(1.1) rotate(-3deg);
}

.badge-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.luxury-budaya-card.hovered .badge-glow {
  opacity: 1;
}

.badge-text {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.badge-ornament {
  width: 15px;
  height: 2px;
  background: linear-gradient(45deg, #60a5fa, #93c5fd);
  border-radius: 1px;
}

/* Luxury Image Container */
.luxury-image-container {
  position: relative;
  height: 280px;
  overflow: hidden;
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.2) 0%,
    rgba(30, 58, 138, 0.3) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 2;
}

.luxury-budaya-card.hovered .image-overlay {
  opacity: 1;
}

.luxury-budaya-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1) contrast(1.05);
}

.luxury-budaya-card.hovered .luxury-budaya-image {
  transform: scale(1.1) rotate(1deg);
  filter: brightness(1.1) contrast(1.1) saturate(1.2);
}

.luxury-no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  font-weight: 500;
}

.no-image-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.image-shine {
  position: absolute;
  top: -100%;
  left: -100%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  opacity: 0;
  transition: all 0.6s ease;
}

.luxury-budaya-card.hovered .image-shine {
  opacity: 1;
  animation: shine 1.5s ease-out;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%);
  }
  100% {
    transform: translateX(100%) translateY(100%);
  }
}

/* Premium Content */
.luxury-card-content {
  padding: 2.5rem 2rem;
  position: relative;
  z-index: 3;
}

.luxury-budaya-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1rem;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.luxury-budaya-location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.location-icon {
  font-size: 1.2rem;
}

.luxury-budaya-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
}

/* Premium Action Buttons */
.luxury-card-actions {
  display: flex;
  gap: 15px;
  margin-top: 2rem;
}

.luxury-detail-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
  color: #ffffff;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.luxury-detail-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}

.button-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
}

.luxury-detail-button:active .button-ripple {
  width: 200px;
  height: 200px;
}

.button-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.luxury-detail-button:hover .button-glow {
  opacity: 1;
  animation: buttonGlowPulse 1.5s ease-in-out infinite;
}

@keyframes buttonGlowPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.button-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.luxury-detail-button:hover .button-arrow {
  transform: translateX(4px);
}

/* Card Ornaments */
.card-ornaments {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.corner-decoration {
  position: absolute;
  width: 25px;
  height: 25px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  opacity: 0;
  transition: all 0.4s ease;
}

.corner-decoration.top-left {
  top: 20px;
  left: 20px;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 10px;
}

.corner-decoration.top-right {
  top: 20px;
  right: 20px;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 10px;
}

.corner-decoration.bottom-left {
  bottom: 20px;
  left: 20px;
  border-right: none;
  border-top: none;
  border-bottom-left-radius: 10px;
}

.corner-decoration.bottom-right {
  bottom: 20px;
  right: 20px;
  border-left: none;
  border-top: none;
  border-bottom-right-radius: 10px;
}

.luxury-budaya-card.hovered .corner-decoration {
  opacity: 1;
  border-color: rgba(59, 130, 246, 0.6);
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 1200px) {
  .cultural-carousel {
    padding: 0 1rem;
  }

  .carousel-card {
    min-width: 300px;
    max-width: 300px;
    height: 420px;
    min-height: 420px;
    max-height: 420px;
  }

  .artistic-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .artistic-card {
    height: 450px;
    min-height: 450px;
    max-height: 450px;
  }

  .modern-showcase {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .modern-card {
    height: 470px;
    min-height: 470px;
    max-height: 470px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .luxury-section-title {
    font-size: 2.5rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .carousel-header {
    justify-content: center;
  }

  .nav-button {
    width: 45px;
    height: 45px;
  }

  .nav-button svg {
    width: 20px;
    height: 20px;
  }

  .carousel-card {
    min-width: 280px;
    max-width: 280px;
    height: 400px;
    min-height: 400px;
    max-height: 400px;
  }

  .cultural-content,
  .artistic-content,
  .modern-content {
    padding: 1rem;
  }

  .cultural-title,
  .artistic-title,
  .modern-title {
    font-size: 1.2rem;
  }

  .artistic-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .artistic-card {
    height: 420px;
    min-height: 420px;
    max-height: 420px;
  }

  .modern-showcase {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .modern-card {
    height: 450px;
    min-height: 450px;
    max-height: 450px;
  }

  .cultural-image-container,
  .artistic-image-container,
  .dynamic-image-container {
    height: 160px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 100px 0 60px;
  }

  .page-title {
    font-size: 2rem;
  }

  .luxury-section-title {
    font-size: 2rem;
  }

  .section-subtitle {
    font-size: 0.9rem;
  }

  .carousel-card {
    min-width: 260px;
    max-width: 260px;
    height: 380px;
    min-height: 380px;
    max-height: 380px;
  }

  .cultural-content,
  .artistic-content,
  .modern-content {
    padding: 0.8rem;
  }

  .cultural-title,
  .artistic-title,
  .modern-title {
    font-size: 1.1rem;
  }

  .heritage-button,
  .culture-button,
  .modern-button {
    padding: 10px 16px;
    font-size: 0.85rem;
  }

  .container {
    padding: 0 15px;
  }

  .luxury-budaya-section {
    padding: 60px 0;
  }

  .artistic-card {
    height: 400px;
    min-height: 400px;
    max-height: 400px;
  }

  .modern-card {
    height: 420px;
    min-height: 420px;
    max-height: 420px;
  }

  .cultural-image-container,
  .artistic-image-container,
  .dynamic-image-container {
    height: 140px;
  }

  .heritage-badge,
  .cultural-badge,
  .modern-badge {
    padding: 6px 10px;
    font-size: 0.7rem;
  }

  .cultural-meta,
  .cultural-info,
  .modern-meta {
    font-size: 0.75rem;
  }

  .cultural-description,
  .artistic-description,
  .modern-description {
    font-size: 0.8rem;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
}
</style>
<style scoped>
.budaya-view-user {
  overflow-y: auto;
}
</style>
