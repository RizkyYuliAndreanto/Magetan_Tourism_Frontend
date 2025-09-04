<template>
  <section
    class="pariwisata-section"
    aria-label="Carousel Pariwisata"
    @mouseenter="stopAutoSlide"
    @mouseleave="startAutoSlide">
    <template v-if="loading">
      <div class="skeleton-container">
        <div class="skeleton-header"></div>
        <div class="skeleton-carousel">
          <div v-for="i in 5" :key="i" class="skeleton-card"></div>
        </div>
      </div>
    </template>

    <template v-else-if="!error">
      <div class="section-title">
        <span class="section-title-line"></span>
        <h2 class="section-title-text">Pariwisata</h2>
        <span class="section-title-line"></span>
      </div>

      <div class="carousel-container" role="group" aria-roledescription="carousel">
        <button
          class="carousel-nav nav-left"
          @click="prevSlide"
          aria-label="Previous Slide">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" />
          </svg>
        </button>

        <div
          class="carousel-track-wrapper"
          ref="trackWrapper"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd">
          <div ref="carouselTrack" class="carousel-track">
            <div
              v-for="(kategori, index) in loopingKategoriList"
              :key="`loop-${index}-${kategori.id_kategori_destinasi}`"
              class="pariwisata-card"
              :class="{ 'card-visible': isCardVisible(index) }"
              :data-index="index"
              @mousemove="handleCardTilt"
              @mouseleave="handleCardReset">
              <div
                class="card-bg"
                :style="{
                  backgroundImage: `url(http://localhost:5000${kategori.sampul_kategori})`,
                }"></div>
              <div class="card-content">
                <h3 class="card-title">{{ kategori.nama_kategori }}</h3>
                <router-link
                  :to="`/destinasi?kategori=${kategori.id_kategori_destinasi}`"
                  class="details-button">
                  Lihat Detail
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M16.172 11L10.808 5.636L12.222 4.222L19.999 12L12.222 19.778L10.808 18.364L16.172 13H4V11H16.172Z" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <button
          class="carousel-nav nav-right"
          @click="nextSlide"
          aria-label="Next Slide">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
          </svg>
        </button>
      </div>

      <div class="carousel-indicators">
        <button
          v-for="(kategori, index) in kategoriList"
          :key="`indicator-${kategori.id_kategori_destinasi}`"
          :class="{ active: index === (currentSlideIndex % kategoriList.length) }"
          @click="goToSlide(index)"
          :aria-label="`Go to slide ${index + 1}`"></button>
      </div>
    </template>

    <div v-else-if="error" class="no-data-message">
      <p>⚠️ Gagal memuat data: {{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import axios from "axios";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// --- State Reaktif ---
const kategoriList = ref([]);
const loopingKategoriList = computed(() => {
  // Duplikasi array agar looping mulus
  return [...kategoriList.value, ...kategoriList.value];
});
const loading = ref(true);
const error = ref(null);
const carouselTrack = ref(null);
const trackWrapper = ref(null);
const currentSlideIndex = ref(0);
let autoSlideInterval = null;
let touchStartX = 0;

// --- Konstanta & Konfigurasi ---
const AUTO_SLIDE_DELAY = 3500; // 3.5 detik
const TRANSITION_DURATION = 0.8;
const ANIMATION_PROPERTIES = {
  y: 50,
  opacity: 0,
  scale: 0.95,
  stagger: 0.1,
  duration: 0.6,
  ease: "back.out(1.2)",
  delay: 0.3,
};

// --- Fungsi Pengambilan Data ---
const fetchData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/kategori-destinasi/"
    );
    kategoriList.value = response.data;
    await nextTick();
    if (kategoriList.value.length > 0) {
      animateCardsIn();
      startAutoSlide();
    }
  } catch (err) {
    error.value = "Gagal memuat data kategori destinasi.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// --- Fungsi Navigasi & Animasi ---
const animateSlide = (direction) => {
    if (!carouselTrack.value || kategoriList.value.length === 0) return;

    const trackEl = carouselTrack.value;
    const cards = gsap.utils.toArray(".pariwisata-card", trackEl);
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth + 20; // width + gap
    const totalSlides = kategoriList.value.length;

    let targetIndex;
    if (direction === "next") {
        currentSlideIndex.value++;
        targetIndex = currentSlideIndex.value;
    } else if (direction === "prev") {
        currentSlideIndex.value--;
        targetIndex = currentSlideIndex.value;
    } else {
        currentSlideIndex.value = direction;
        targetIndex = direction;
    }

    const newX = -targetIndex * cardWidth;

    gsap.to(trackEl, {
        x: newX,
        duration: TRANSITION_DURATION,
        ease: "power2.inOut",
        overwrite: true,
        onComplete: () => {
            // Looping Mulus
            if (currentSlideIndex.value >= totalSlides) {
                gsap.set(trackEl, { x: 0 });
                currentSlideIndex.value = 0;
            } else if (currentSlideIndex.value < 0) {
                gsap.set(trackEl, { x: -(totalSlides - 1) * cardWidth });
                currentSlideIndex.value = totalSlides - 1;
            }
        }
    });
};

const nextSlide = () => animateSlide("next");
const prevSlide = () => animateSlide("prev");
const goToSlide = (index) => {
    // Pastikan index yang dituju berada di array asli
    currentSlideIndex.value = index;
    animateSlide(index);
};

// --- Animasi Masuk Kartu (saat loading selesai) ---
const animateCardsIn = () => {
    gsap.from(".pariwisata-card", ANIMATION_PROPERTIES);
};

// --- Auto-Slide ---
const startAutoSlide = () => {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, AUTO_SLIDE_DELAY);
};
const stopAutoSlide = () => {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
};

// --- Navigasi Keyboard ---
const handleKeyNav = (event) => {
    if (event.key === "ArrowLeft") {
        prevSlide();
        stopAutoSlide();
    } else if (event.key === "ArrowRight") {
        nextSlide();
        stopAutoSlide();
    }
};

// --- Navigasi Swipe (Touch) ---
const handleTouchStart = (event) => {
    touchStartX = event.touches[0].clientX;
    stopAutoSlide();
};
const handleTouchMove = (event) => {
    // Mencegah scroll vertikal yang tidak diinginkan
    event.preventDefault();
};
const handleTouchEnd = (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;
    if (swipeDistance > 50) {
        // Swipe ke kanan
        prevSlide();
    } else if (swipeDistance < -50) {
        // Swipe ke kiri
        nextSlide();
    }
    startAutoSlide();
};

// --- Efek Hover & Parallax ---
const handleCardTilt = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const xAxis = (rect.height / 2 - (event.clientY - rect.top)) / 20;
    const yAxis = -(rect.width / 2 - (event.clientX - rect.left)) / 20;

    gsap.to(card, {
        transform: `rotateX(${xAxis}deg) rotateY(${yAxis}deg) scale(1.05)`,
        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.25)`,
        duration: 0.2,
        ease: "power2.out",
    });

    // Efek parallax ringan
    gsap.to(card.querySelector(".card-bg"), {
        x: yAxis * 1.5,
        y: xAxis * 1.5,
        duration: 0.2,
        ease: "power2.out",
    });
};

const handleCardReset = (event) => {
    gsap.to(event.currentTarget, {
        transform: "rotateX(0deg) rotateY(0deg) scale(1)",
        boxShadow: "var(--card-shadow)",
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
    });
    gsap.to(event.currentTarget.querySelector(".card-bg"), {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
    });
};

// --- Logika Visibilitas Kartu untuk Animasi Masuk ---
const isCardVisible = (index) => {
    // Logic to determine if a card should be animated based on its position
    return true; // Simple logic for demonstration
};

// --- Lifecycle Hooks ---
onMounted(() => {
    fetchData();
    window.addEventListener("keydown", handleKeyNav);
});

onUnmounted(() => {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    window.removeEventListener("keydown", handleKeyNav);
});
</script>
<style scoped>
/* ==================================== */
/* 🚀 Bagian 1: Variabel & Umum */
/* ==================================== */

:root {
  --primary-color: #007bff;
  --secondary-color: #009fe3;
  --bg-light: #f8fafc;
  --bg-dark: #e3f0fb;
  --card-bg: #fff;
  --card-shadow: 0 10px 40px rgba(0, 123, 255, 0.08);
  --soft-shadow: 0 8px 32px rgba(0, 123, 255, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.08);
  --hover-shadow: 0 16px 48px rgba(0, 123, 255, 0.25),
    0 4px 16px rgba(0, 0, 0, 0.13);
  --border-radius-lg: 18px;
  --font-heading: "Poppins", sans-serif;
  --transition-duration: 0.3s;
}

.pariwisata-section {
  padding: 60px 20px;
  background: linear-gradient(135deg, var(--bg-light) 0%, var(--bg-dark) 100%);
  max-width: 1200px;
  margin: 0 auto;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--card-shadow);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

/* ==================================== */
/* 🎭 Bagian 2: Loading Skeleton */
/* ==================================== */

.skeleton-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.skeleton-header {
  width: 60%;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-carousel {
  display: flex;
  gap: 20px;
  width: 100%;
  overflow: hidden;
  justify-content: center;
}

.skeleton-card {
  min-width: 250px;
  height: 350px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: var(--border-radius-lg);
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    background-color: rgba(0, 0, 0, 0.05);
  }
  50% {
    background-color: rgba(0, 0, 0, 0.1);
  }
  100% {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

/* ==================================== */
/* 📐 Bagian 3: Judul & Struktur */
/* ==================================== */

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
}

.section-title-text {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--primary-color);
  letter-spacing: 1.2px;
  text-align: center;
  font-family: var(--font-heading);
  position: relative;
  z-index: 1;
}

.section-title-line {
  flex-grow: 1;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--primary-color) 0%,
    var(--secondary-color) 100%
  );
  max-width: 150px;
  border-radius: 3px;
  opacity: 0.8;
}

.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
}

.carousel-track-wrapper {
  overflow: hidden;
  width: 100%;
  max-width: 1150px;
  position: relative;
  cursor: grab;
}

.carousel-track-wrapper:active {
  cursor: grabbing;
}

.carousel-track {
  display: flex;
  gap: 20px;
  padding: 10px;
  will-change: transform;
}

/* ==================================== */
/* 🎨 Bagian 4: Gaya Kartu */
/* ==================================== */

.pariwisata-card {
  position: relative;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--soft-shadow);
  border: 3px solid #e3eaf5;
  overflow: hidden;
  min-width: 250px;
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: var(--card-bg);
  transform-style: preserve-3d;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    box-shadow 0.3s ease;
  cursor: pointer;
  perspective: 1000px;
}

.pariwisata-card:hover {
  box-shadow: var(--hover-shadow);
  border-color: var(--primary-color);
  z-index: 10;
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: transform 0.3s ease-out;
  z-index: 1;
}

.card-bg::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0) 50%
  );
  z-index: 2;
  transition: opacity 0.3s ease;
}

.card-content {
  position: relative;
  z-index: 3;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card-title {
  color: #fff;
  font-size: 1.4rem;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  margin: 0 0 12px 0;
}

.details-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(
    90deg,
    var(--primary-color) 0%,
    var(--secondary-color) 100%
  );
  color: #fff;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.details-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 123, 255, 0.5);
}

.details-button svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
  transform: translateX(0);
  transition: transform 0.2s ease;
}

.details-button:hover svg {
  transform: translateX(4px);
}

/* ==================================== */
/* 🧭 Bagian 5: Navigasi & Indikator */
/* ==================================== */

.carousel-nav {
  background: var(--card-bg);
  border: none;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
  transition: transform var(--transition-duration) ease,
    background var(--transition-duration) ease,
    box-shadow var(--transition-duration) ease;
  z-index: 10;
  position: absolute;
}

.carousel-nav svg {
  width: 30px;
  height: 30px;
  fill: currentColor;
}

.nav-left {
  left: -20px;
}

.nav-right {
  right: -20px;
}

.carousel-nav:hover {
  transform: scale(1.1);
  background: var(--primary-color);
  color: #fff;
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.3);
}

.carousel-nav:active {
  transform: scale(0.95);
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
}

.carousel-indicators button {
  width: 12px;
  height: 12px;
  background-color: rgba(0, 0, 0, 0.2);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
}

.carousel-indicators button.active {
  width: 30px;
  border-radius: 10px;
  background-color: var(--primary-color);
}

/* ==================================== */
/* 📱 Bagian 6: Responsif */
/* ==================================== */

@media screen and (max-width: 1024px) {
  .section-title-text {
    font-size: 2.2rem;
  }
  .carousel-nav {
    width: 45px;
    height: 45px;
  }
  .nav-left {
    left: -15px;
  }
  .nav-right {
    right: -15px;
  }
}

@media screen and (max-width: 768px) {
  .section-title-text {
    font-size: 1.8rem;
  }
  .pariwisata-card {
    min-width: 200px;
    height: 300px;
  }
  .details-button {
    font-size: 0.9rem;
    padding: 10px 20px;
  }
  .carousel-nav {
    display: none; /* Sembunyikan tombol navigasi pada mobile */
  }
  .carousel-track-wrapper {
    touch-action: pan-y;
  }
}

@media screen and (max-width: 600px) {
  .pariwisata-section {
    padding: 24px 10px;
    border-radius: 12px;
  }
  .section-title-text {
    font-size: 1.5rem;
  }
  .section-title-line {
    max-width: 80px;
  }
}
</style>