<template>
  <section class="cultural-heritage-section">
    <!-- Premium Header -->
    <div class="premium-header" ref="headerRef">
      <div class="title-container">
        <h1 class="cultural-title">Kebudayaan</h1>
        <div class="cultural-divider">
          <div class="divider-line"></div>
          <div class="divider-ornament">
            <svg viewBox="0 0 60 20" class="batik-icon">
              <path
                d="M5,10 Q15,5 25,10 Q35,15 45,10 Q55,5 60,10"
                stroke="currentColor"
                fill="none"
                stroke-width="2" />
              <circle cx="15" cy="10" r="2" fill="currentColor" />
              <circle cx="30" cy="10" r="2" fill="currentColor" />
              <circle cx="45" cy="10" r="2" fill="currentColor" />
            </svg>
          </div>
          <div class="divider-line"></div>
        </div>
        <p class="cultural-subtitle">
          Warisan Budaya Magetan Yang Tak Ternilai
        </p>
      </div>
    </div>

    <!-- Premium Cultural Cards -->
    <div class="premium-cards-container">
      <!-- Objek Pemajuan Kebudayaan Card -->
      <div class="premium-culture-card objek-card" ref="objekCardRef">
        <div class="card-frame">
          <div class="cultural-pattern-overlay"></div>

          <!-- Artistic Image Frame -->
          <div class="artistic-image-frame">
            <div class="frame-border">
              <div class="frame-corners">
                <div class="corner corner-tl"></div>
                <div class="corner corner-tr"></div>
                <div class="corner corner-bl"></div>
                <div class="corner corner-br"></div>
              </div>
              <div class="image-placeholder objek-placeholder">
                <div
                  class="cultural-image-container"
                  @mouseenter="pauseObjekSlideshow"
                  @mouseleave="resumeObjekSlideshow">
                  <img
                    :src="currentObjekImage"
                    alt="Objek Pemajuan Kebudayaan Magetan"
                    class="cultural-image slideshow-image"
                    key="objek-image" />
                  <!-- Slideshow Indicators -->
                  <div class="slideshow-indicators">
                    <div
                      v-for="(image, index) in objekImages"
                      :key="`objek-indicator-${index}`"
                      class="indicator"
                      :class="{ active: index === currentObjekIndex }"></div>
                  </div>
                  <div class="image-overlay">
                    <div class="cultural-icon-large">
                      <svg viewBox="0 0 80 80" class="heritage-symbol">
                        <circle
                          cx="40"
                          cy="40"
                          r="30"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2" />
                        <path
                          d="M25,40 Q32,25 40,40 Q48,55 55,40"
                          stroke="currentColor"
                          fill="none"
                          stroke-width="2" />
                        <circle cx="40" cy="40" r="8" fill="currentColor" />
                        <path
                          d="M20,20 L60,20 M20,60 L60,60 M20,20 L20,60 M60,20 L60,60"
                          stroke="currentColor"
                          stroke-width="1"
                          opacity="0.5" />
                      </svg>
                    </div>
                    <p class="image-caption">
                      Galeri Objek Pemajuan Kebudayaan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Premium Content -->
          <div class="premium-content">
            <div class="content-header">
              <div class="cultural-badge">
                <span class="badge-icon">🏛️</span>
                <span class="badge-text">Tradisi & Warisan</span>
              </div>
              <h3 class="premium-title">Objek Pemajuan Kebudayaan</h3>
              <p class="premium-subtitle">Mengenal Kekayaan Tradisi Magetan</p>
            </div>

            <div class="premium-description">
              <p>
                Magetan kaya akan
                <strong>Objek Pemajuan Kebudayaan</strong> seperti tradisi
                lisan, manuskrip kuno, adat istiadat yang diwariskan
                turun-temurun, seni pertunjukan lokal, dan kerajinan tangan
                khas. Semua ini adalah bagian tak terpisahkan dari identitas
                budaya masyarakat Magetan yang telah mengakar selama
                berabad-abad.
              </p>
            </div>

            <router-link to="/budaya" class="premium-button objek-button">
              <span class="button-text">Jelajahi Tradisi</span>
              <div class="button-glow"></div>
              <svg viewBox="0 0 24 24" class="button-icon">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Cagar Budaya Card -->
      <div class="premium-culture-card cagar-card" ref="cagarCardRef">
        <div class="card-frame">
          <div class="cultural-pattern-overlay"></div>

          <!-- Artistic Image Frame -->
          <div class="artistic-image-frame">
            <div class="frame-border">
              <div class="frame-corners">
                <div class="corner corner-tl"></div>
                <div class="corner corner-tr"></div>
                <div class="corner corner-bl"></div>
                <div class="corner corner-br"></div>
              </div>
              <div class="image-placeholder cagar-placeholder">
                <div
                  class="cultural-image-container"
                  @mouseenter="pauseCagarSlideshow"
                  @mouseleave="resumeCagarSlideshow">
                  <img
                    :src="currentCagarImage"
                    alt="Cagar Budaya Magetan"
                    class="cultural-image slideshow-image"
                    key="cagar-image" />
                  <!-- Slideshow Indicators -->
                  <div class="slideshow-indicators">
                    <div
                      v-for="(image, index) in cagarImages"
                      :key="`cagar-indicator-${index}`"
                      class="indicator"
                      :class="{ active: index === currentCagarIndex }"></div>
                  </div>
                  <div class="image-overlay">
                    <div class="cultural-icon-large">
                      <svg viewBox="0 0 80 80" class="heritage-symbol">
                        <rect
                          x="15"
                          y="25"
                          width="50"
                          height="40"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2" />
                        <path
                          d="M20,25 L40,10 L60,25"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2" />
                        <rect
                          x="30"
                          y="35"
                          width="6"
                          height="15"
                          fill="currentColor" />
                        <rect
                          x="44"
                          y="35"
                          width="6"
                          height="15"
                          fill="currentColor" />
                        <rect
                          x="35"
                          y="50"
                          width="10"
                          height="15"
                          fill="currentColor" />
                        <circle cx="25" cy="40" r="2" fill="currentColor" />
                        <circle cx="55" cy="40" r="2" fill="currentColor" />
                      </svg>
                    </div>
                    <p class="image-caption">Galeri Cagar Budaya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Premium Content -->
          <div class="premium-content">
            <div class="content-header">
              <div class="cultural-badge">
                <span class="badge-icon">🏯</span>
                <span class="badge-text">Sejarah & Arsitektur</span>
              </div>
              <h3 class="premium-title">Cagar Budaya</h3>
              <p class="premium-subtitle">Jejak Sejarah yang Terlestarikan</p>
            </div>

            <div class="premium-description">
              <p>
                Jelajahi <strong>Cagar Budaya</strong> yang tersebar di seluruh
                penjuru Magetan, mulai dari situs-situs bersejarah,
                bangunan-bangunan peninggalan masa lalu, hingga kawasan yang
                dilindungi karena nilai budaya dan sejarahnya yang tinggi.
                Setiap situs menyimpan cerita panjang peradaban Magetan.
              </p>
            </div>

            <router-link to="/budaya" class="premium-button cagar-button">
              <span class="button-text">Telusuri Sejarah</span>
              <div class="button-glow"></div>
              <svg viewBox="0 0 24 24" class="button-icon">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import cultural images from assets - Objek Pemajuan Kebudayaan
import labuansarangan1 from "@/assets/labuansarangan1.jpg";
import labuansarangan2 from "@/assets/labuansarangan2.jpg";
import labuansarangan3 from "@/assets/labuansarangan3.jpg";
import labuansarangan4 from "@/assets/labuansarangan4.jpg";

// Import cultural images from assets - Cagar Budaya
import dewisri1 from "@/assets/dewisri1.jpg";
import dewisri2 from "@/assets/dewisri2.jpg";
import dewisri3 from "@/assets/dewisri3.jpg";
import dewisri4 from "@/assets/dewisri4.jpg";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const headerRef = ref(null);
const objekCardRef = ref(null);
const cagarCardRef = ref(null);

// Slideshow arrays
const objekImages = [
  labuansarangan1,
  labuansarangan2,
  labuansarangan3,
  labuansarangan4,
];
const cagarImages = [dewisri1, dewisri2, dewisri3, dewisri4];

// Current image indexes
const currentObjekIndex = ref(0);
const currentCagarIndex = ref(0);

// Slideshow intervals
let objekInterval = null;
let cagarInterval = null;

// Computed properties for current images
const currentObjekImage = ref(objekImages[0]);
const currentCagarImage = ref(cagarImages[0]);

// Slideshow functions
const startObjekSlideshow = () => {
  objekInterval = setInterval(() => {
    currentObjekIndex.value =
      (currentObjekIndex.value + 1) % objekImages.length;
    currentObjekImage.value = objekImages[currentObjekIndex.value];
  }, 2000);
};

const startCagarSlideshow = () => {
  cagarInterval = setInterval(() => {
    currentCagarIndex.value =
      (currentCagarIndex.value + 1) % cagarImages.length;
    currentCagarImage.value = cagarImages[currentCagarIndex.value];
  }, 2000);
};

const stopSlideshows = () => {
  if (objekInterval) {
    clearInterval(objekInterval);
    objekInterval = null;
  }
  if (cagarInterval) {
    clearInterval(cagarInterval);
    cagarInterval = null;
  }
};

// Pause and resume functions
const pauseObjekSlideshow = () => {
  if (objekInterval) {
    clearInterval(objekInterval);
    objekInterval = null;
  }
};

const resumeObjekSlideshow = () => {
  if (!objekInterval) {
    startObjekSlideshow();
  }
};

const pauseCagarSlideshow = () => {
  if (cagarInterval) {
    clearInterval(cagarInterval);
    cagarInterval = null;
  }
};

const resumeCagarSlideshow = () => {
  if (!cagarInterval) {
    startCagarSlideshow();
  }
};

onMounted(() => {
  // Set initial states untuk semua elemen animasi SEBELUM memulai animasi
  gsap.set(".premium-culture-card", { opacity: 0, x: 0, rotationY: 0 });
  gsap.set(".cultural-pattern-overlay", { opacity: 0, scale: 0.8 });
  gsap.set(".corner", { opacity: 0, scale: 0 });
  gsap.set(".cultural-badge", { opacity: 0, y: -20 });
  gsap.set(".cultural-image", { opacity: 0, scale: 1.1 });
  gsap.set(".premium-title", { opacity: 0, y: 30 });
  gsap.set(".premium-subtitle", { opacity: 0, y: 20 });
  gsap.set(".premium-description", { opacity: 0, y: 25 });
  gsap.set(".premium-button", { opacity: 0, y: 30 });

  // Start slideshows setelah delay kecil
  setTimeout(() => {
    startObjekSlideshow();
    startCagarSlideshow();
  }, 500);

  // Premium header animation with cultural elegance
  const tl = gsap.timeline();

  tl.from(".cultural-title", {
    opacity: 0,
    y: -40,
    scale: 0.8,
    duration: 1.2,
    ease: "back.out(1.7)",
  })
    .from(
      ".cultural-divider",
      {
        opacity: 0,
        scaleX: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.6"
    )
    .from(
      ".cultural-subtitle",
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.4"
    );

  // Premium cards staggered entrance animation dengan perbaikan timing
  const cardsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".premium-cards-container",
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
      refreshPriority: -1,
      invalidateOnRefresh: true,
    },
  });

  // Objek card animation
  cardsTimeline.fromTo(
    objekCardRef.value,
    {
      opacity: 0,
      x: -100,
      rotationY: -15,
    },
    {
      opacity: 1,
      x: 0,
      rotationY: 0,
      duration: 1.2,
      ease: "power3.out",
    }
  );

  // Cagar card animation dengan delay yang lebih teratur
  cardsTimeline.fromTo(
    cagarCardRef.value,
    {
      opacity: 0,
      x: 100,
      rotationY: 15,
    },
    {
      opacity: 1,
      x: 0,
      rotationY: 0,
      duration: 1.2,
      ease: "power3.out",
    },
    "-=0.8"
  );

  // Content elements animation dengan timeline terpisah
  const contentTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".premium-cards-container",
      start: "top 70%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
      refreshPriority: 0,
      invalidateOnRefresh: true,
    },
  });

  // Cultural pattern overlay animation
  contentTimeline.to(".cultural-pattern-overlay", {
    opacity: 1,
    scale: 1,
    duration: 1.2,
    ease: "power2.out",
    stagger: 0.1,
  });

  // Frame corners animation
  contentTimeline.to(
    ".corner",
    {
      opacity: 0.8,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: 0.05,
    },
    "-=0.8"
  );

  // Cultural images entrance
  contentTimeline.to(
    ".cultural-image",
    {
      opacity: 1,
      scale: 1,
      duration: 1.0,
      ease: "power2.out",
      stagger: 0.1,
    },
    "-=0.6"
  );

  // Cultural badges entrance
  contentTimeline.to(
    ".cultural-badge",
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,
    },
    "-=0.5"
  );

  // Premium titles animation
  contentTimeline.to(
    ".premium-title",
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,
    },
    "-=0.4"
  );

  // Premium subtitles animation
  contentTimeline.to(
    ".premium-subtitle",
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.1,
    },
    "-=0.5"
  );

  // Premium descriptions animation
  contentTimeline.to(
    ".premium-description",
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,
    },
    "-=0.4"
  );

  // Premium buttons animation
  contentTimeline.to(
    ".premium-button",
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,
    },
    "-=0.3"
  );

  // Image overlay elements animation
  gsap.set(".image-overlay", { opacity: 0 });
  gsap.set(".cultural-icon-large", { scale: 0.8, y: 20 });
  gsap.set(".image-caption", { y: 30, opacity: 0 });

  // Premium buttons glow effect on scroll
  gsap.to(".button-glow", {
    opacity: 0.8,
    scale: 1.2,
    duration: 2,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
    stagger: 0.5,
  });

  // Force refresh ScrollTrigger setelah semua animasi di-setup
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
});

onUnmounted(() => {
  stopSlideshows();
  // Cleanup ScrollTrigger instances untuk mencegah memory leak
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
</script>

<style scoped>
/* ===== PREMIUM CULTURAL VARIABLES ===== */
:root {
  --royal-blue: #1e3a8a;
  --deep-navy: #1e293b;
  --ivory-white: #f8f9fa;
  --gold-accent: #d4af37;
  --bronze-gold: #cd7f32;
  --pearl-white: #ffffff;
  --soft-gray: #e2e8f0;
  --charcoal: #374151;
  --sapphire: #0f4c75;

  --cultural-gradient: linear-gradient(
    135deg,
    var(--ivory-white) 0%,
    #e6f2ff 50%,
    var(--soft-gray) 100%
  );
  --gold-gradient: linear-gradient(
    135deg,
    var(--gold-accent) 0%,
    var(--bronze-gold) 100%
  );
  --blue-gradient: linear-gradient(
    135deg,
    var(--royal-blue) 0%,
    var(--sapphire) 100%
  );

  --premium-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
  --gold-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  --cultural-glow: 0 0 30px rgba(212, 175, 55, 0.4);

  --premium-transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --smooth-ease: cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== MAIN CULTURAL SECTION ===== */
.cultural-heritage-section {
  position: relative;
  background: 
    /* Cultural Pattern Overlay */ radial-gradient(
      circle at 20% 80%,
      rgba(30, 58, 138, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(212, 175, 55, 0.06) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 40%,
      rgba(30, 58, 138, 0.04) 0%,
      transparent 50%
    ),
    /* Batik Pattern */
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 35px,
        rgba(30, 58, 138, 0.02) 35px,
        rgba(30, 58, 138, 0.02) 40px
      ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 35px,
      rgba(212, 175, 55, 0.015) 35px,
      rgba(212, 175, 55, 0.015) 40px
    ),
    /* Main Gradient - untuk transisi seamless ke Event Section */
      linear-gradient(
        180deg,
        #ffffff 0%,
        #fefefe 10%,
        #f8fafe 20%,
        #f0f6fe 30%,
        #e8f2fe 40%,
        #e6f2ff 50%,
        #bae6fd 60%,
        #7dd3fc 70%,
        #38bdf8 80%,
        #0ea5e9 90%,
        #0ea5e9 100%
      );

  padding: 60px 2rem 60px 2rem;
  margin-top: -40px;
  margin-bottom: 0;
  font-family: "Playfair Display", "Georgia", "Times New Roman", serif;
  color: var(--charcoal);
  overflow: hidden;
  min-height: 90vh;
  border-bottom: none;
  z-index: 5;
}

.cultural-heritage-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    /* Mountain Silhouette - Left */ radial-gradient(
      ellipse 200px 120px at 10% 75%,
      rgba(30, 58, 138, 0.12) 0%,
      transparent 70%
    ),
    /* Temple Silhouette - Right */
      radial-gradient(
        ellipse 150px 100px at 90% 80%,
        rgba(30, 58, 138, 0.1) 0%,
        transparent 70%
      ),
    /* Water/Lake Element - Bottom Center */
      radial-gradient(
        ellipse 300px 80px at 50% 95%,
        rgba(30, 58, 138, 0.06) 0%,
        transparent 70%
      ),
    /* Cultural Motif - Top Right */
      radial-gradient(
        ellipse 100px 100px at 85% 15%,
        rgba(212, 175, 55, 0.08) 0%,
        transparent 70%
      ),
    /* Floral Motif - Top Left */
      radial-gradient(
        ellipse 120px 120px at 15% 20%,
        rgba(30, 58, 138, 0.06) 0%,
        transparent 70%
      );

  z-index: 1;
  pointer-events: none;
}

/* Pattern overlay */
.cultural-heritage-section .premium-header,
.cultural-heritage-section .premium-cards-container {
  position: relative;
  z-index: 5;
}

/* Transisi dihilangkan untuk menghindari overlap dengan Event Section */

/* Add a subtle texture overlay - TANPA elemen kuning */
.cultural-heritage-section::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    /* Subtle Batik Pattern Overlay - hanya biru */ url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%231e3a8a' stroke-width='0.5' opacity='0.08'%3E%3Cpath d='M60,10 Q80,30 60,50 Q40,30 60,10' /%3E%3Cpath d='M10,60 Q30,40 50,60 Q30,80 10,60' /%3E%3Cpath d='M110,60 Q90,80 70,60 Q90,40 110,60' /%3E%3Cpath d='M60,110 Q40,90 60,70 Q80,90 60,110' /%3E%3Ccircle cx='60' cy='60' r='25' /%3E%3C/g%3E%3C/svg%3E");
  background-size: 200px 200px;
  background-position: 0 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.3;
}

/* Lake/Water Element */
.cultural-heritage-section
  .premium-cards-container
  .premium-culture-card:last-child::after {
  content: "";
  position: absolute;
  bottom: -20px;
  left: 10%;
  width: 120px;
  height: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'%3E%3Cellipse cx='60' cy='30' rx='50' ry='10' fill='%231e3a8a' opacity='0.1'/%3E%3Cpath d='M20,25 Q40,20 60,25 Q80,20 100,25' stroke='%231e3a8a' stroke-width='0.5' fill='none' opacity='0.15'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 2;
  opacity: 0.4;
}

/* Floral Motif */
.cultural-heritage-section .premium-header .title-container::before {
  content: "";
  position: absolute;
  top: -20px;
  right: -100px;
  width: 50px;
  height: 50px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50'%3E%3Cpath d='M25,5 Q35,15 25,25 Q15,15 25,5' fill='%23d4af37' opacity='0.1'/%3E%3Cpath d='M5,25 Q15,15 25,25 Q15,35 5,25' fill='%23d4af37' opacity='0.08'/%3E%3Cpath d='M45,25 Q35,35 25,25 Q35,15 45,25' fill='%23d4af37' opacity='0.08'/%3E%3Cpath d='M25,45 Q15,35 25,25 Q35,35 25,45' fill='%23d4af37' opacity='0.1'/%3E%3Ccircle cx='25' cy='25' r='3' fill='%23d4af37' opacity='0.15'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 2;
  opacity: 0.7;
}

/* Garis dekoratif dihapus untuk transisi yang bersih */

/* ===== PREMIUM HEADER ===== */
.premium-header {
  text-align: center;
  margin-bottom: 80px;
  position: relative;
  z-index: 5;
}

.title-container {
  max-width: 800px;
  margin: 0 auto;
}

.cultural-title {
  font-size: clamp(3.5rem, 7vw, 6rem);
  font-weight: 700;
  color: var(--royal-blue);
  margin: 0 0 2rem 0;
  letter-spacing: -2px;
  line-height: 0.9;
  text-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
  font-family: "Playfair Display", serif;
  position: relative;
}

.cultural-title::before {
  content: "";
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--gold-gradient);
  border-radius: 2px;
}

.cultural-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  gap: 1.5rem;
}

.divider-line {
  flex: 1;
  max-width: 120px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--royal-blue),
    transparent
  );
}

.divider-ornament {
  width: 80px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.batik-icon {
  width: 60px;
  height: 20px;
  color: var(--gold-accent);
}

.cultural-subtitle {
  font-size: 1.4rem;
  color: var(--charcoal);
  font-weight: 400;
  margin: 0;
  font-style: italic;
  letter-spacing: 1px;
  font-family: "Georgia", serif;
  opacity: 0.9;
}

/* ===== PREMIUM CARDS CONTAINER ===== */
.premium-cards-container {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 5;
}

/* ===== PREMIUM CULTURE CARDS ===== */
.premium-culture-card {
  position: relative;
  transition: var(--premium-transition);
  /* Initial hidden state untuk animasi masuk */
  opacity: 0;
  transform: translateX(0) rotateY(0deg);
}

.card-frame {
  background: var(--pearl-white);
  border-radius: 24px;
  box-shadow: var(--premium-shadow);
  overflow: hidden;
  display: grid;
  grid-template-columns: 400px 1fr;
  min-height: 350px;
  position: relative;
  border: 2px solid rgba(212, 175, 55, 0.6);
  transition: var(--premium-transition);
}

.premium-culture-card:hover .card-frame {
  transform: translateY(-8px);
  box-shadow: 0 30px 60px rgba(30, 58, 138, 0.25);
  border: 3px solid var(--gold-accent);
  border-color: var(--gold-accent);
}

/* Cultural Pattern Overlay */
.cultural-pattern-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='%23d4af37' opacity='0.03'%3E%3Cpath d='M50,10 Q60,20 70,10 Q80,20 90,10 Q80,30 70,20 Q60,30 50,20 Q40,30 30,20 Q20,30 10,20 Q20,10 30,20 Q40,10 50,20 Z'/%3E%3Ccircle cx='50' cy='50' r='25' fill='none' stroke='%23d4af37' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 80px 80px;
  z-index: 1;
  pointer-events: none;
  /* Initial hidden state untuk animasi */
  opacity: 0;
  transform: scale(0.8);
}

/* ===== ARTISTIC IMAGE FRAME ===== */
.artistic-image-frame {
  position: relative;
  background: linear-gradient(135deg, var(--ivory-white) 0%, #f0f4f8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.frame-border {
  position: relative;
  width: 90%;
  height: 90%;
  background: var(--pearl-white);
  border-radius: 16px;
  box-shadow: inset 0 0 20px rgba(212, 175, 55, 0.15);
  border: 2px solid rgba(212, 175, 55, 0.4);
  background-clip: padding-box;
}

.frame-border::before {
  content: "";
  position: absolute;
  inset: -3px;
  background: var(--gold-gradient);
  border-radius: 16px;
  z-index: -1;
}

.frame-corners {
  position: absolute;
  inset: 0;
  z-index: 3;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid var(--gold-accent);
  opacity: 0.8;
}

.corner-tl {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.corner-tr {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}

.corner-bl {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}

.corner-br {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}

/* Initial state untuk corners - tidak ada !important */
.premium-culture-card .corner {
  /* Default state untuk corners */
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.cultural-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cultural-image-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(30, 58, 138, 0.1) 0%,
    transparent 30%,
    transparent 70%,
    rgba(212, 175, 55, 0.1) 100%
  );
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  transition: var(--premium-transition);
}

.cultural-image-container:hover::before {
  opacity: 1;
}

.cultural-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: var(--premium-transition);
}

.slideshow-image {
  animation: fadeInImage 0.5s ease-in-out;
  position: relative;
  z-index: 1;
}

.slideshow-image::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
  z-index: 2;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes fadeInImage {
  from {
    opacity: 0;
    transform: scale(1.05);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ===== SLIDESHOW INDICATORS ===== */
.slideshow-indicators {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 3;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  cursor: pointer;
}

.indicator.active {
  background: var(--gold-accent);
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.6);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(30, 58, 138, 0.85) 0%,
    rgba(212, 175, 55, 0.75) 50%,
    rgba(30, 58, 138, 0.85) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--premium-transition);
  border-radius: 12px;
}

.cultural-image-container:hover .image-overlay {
  opacity: 1;
}

.cultural-image-container:hover .cultural-image {
  transform: scale(1.05);
}

.objek-placeholder {
  background: linear-gradient(135deg, #e6f2ff 0%, #cce7ff 100%);
}

.cagar-placeholder {
  background: linear-gradient(135deg, #fff4e6 0%, #ffe7cc 100%);
}

.placeholder-content {
  text-align: center;
  z-index: 2;
  position: relative;
}

.cultural-icon-large {
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--gold-shadow);
  transform: scale(0.9);
  transition: var(--premium-transition);
}

.image-overlay:hover .cultural-icon-large {
  transform: scale(1);
  background: rgba(255, 255, 255, 1);
}

.heritage-symbol {
  width: 60px;
  height: 60px;
  color: var(--royal-blue);
}

.image-caption {
  font-size: 1.1rem;
  color: var(--pearl-white);
  font-weight: 600;
  margin: 0;
  font-family: "Inter", sans-serif;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  transform: translateY(10px);
  transition: var(--premium-transition);
}

.image-overlay:hover .image-caption {
  transform: translateY(0);
}

.placeholder-text {
  font-size: 1.1rem;
  color: var(--charcoal);
  font-weight: 500;
  margin: 0;
  font-family: "Inter", sans-serif;
}

/* ===== PREMIUM CONTENT ===== */
.premium-content {
  padding: 3rem 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.content-header {
  margin-bottom: 2rem;
}

.cultural-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--gold-gradient);
  color: var(--pearl-white);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  box-shadow: var(--gold-shadow);
}

.badge-icon {
  font-size: 1.1rem;
}

.premium-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--royal-blue);
  margin: 0 0 0.8rem 0;
  line-height: 1.2;
  font-family: "Playfair Display", serif;
}

.premium-subtitle {
  font-size: 1.2rem;
  color: var(--charcoal);
  margin: 0;
  font-style: italic;
  opacity: 0.8;
  font-weight: 400;
}

.premium-description {
  flex: 1;
  margin-bottom: 2.5rem;
}

.premium-description p {
  font-size: 1.15rem;
  line-height: 1.8;
  color: var(--charcoal);
  margin: 0;
  font-family: "Georgia", serif;
}

.premium-description strong {
  color: var(--royal-blue);
  font-weight: 600;
}

/* ===== PREMIUM BUTTONS ===== */
.premium-button {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: var(--premium-transition);
  align-self: flex-start;
  font-family: "Inter", sans-serif;
  letter-spacing: 0.5px;
}

.objek-button {
  background: var(--blue-gradient);
  color: var(--pearl-white);
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.4);
}

.cagar-button {
  background: var(--gold-gradient);
  color: var(--pearl-white);
  box-shadow: var(--gold-shadow);
}

.premium-button:hover {
  transform: translateY(-3px);
  color: var(--pearl-white);
  text-decoration: none;
}

.objek-button:hover {
  box-shadow: 0 15px 35px rgba(30, 58, 138, 0.6);
}

.cagar-button:hover {
  box-shadow: 0 15px 35px rgba(212, 175, 55, 0.6);
}

.button-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 50px;
  opacity: 0;
  transition: var(--premium-transition);
}

.premium-button:hover .button-glow {
  opacity: 0.6;
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-icon {
  width: 20px;
  height: 20px;
  transition: var(--premium-transition);
  position: relative;
  z-index: 2;
}

.premium-button:hover .button-icon {
  transform: translateX(5px);
}

/* ===== INITIAL ANIMATION STATES ===== */
/* Set semua elemen ke hidden state untuk animasi masuk yang smooth */
.cultural-badge {
  opacity: 0;
  transform: translateY(-20px);
}

.cultural-image {
  opacity: 0;
  transform: scale(1.1);
}

.premium-title {
  opacity: 0;
  transform: translateY(30px);
}

.premium-subtitle {
  opacity: 0;
  transform: translateY(20px);
}

.premium-description {
  opacity: 0;
  transform: translateY(25px);
}

.premium-button {
  opacity: 0;
  transform: translateY(30px);
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1200px) {
  .card-frame {
    grid-template-columns: 350px 1fr;
    min-height: 320px;
  }

  .premium-content {
    padding: 2.5rem 2rem;
  }

  .cultural-title {
    font-size: clamp(3rem, 6vw, 5rem);
  }
}

@media (max-width: 900px) {
  .card-frame {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .artistic-image-frame {
    height: 250px;
  }

  .premium-content {
    padding: 2rem 1.5rem;
  }

  .premium-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 768px) {
  .cultural-heritage-section {
    padding: 60px 1rem;
  }

  .premium-cards-container {
    gap: 3rem;
  }

  .cultural-title {
    font-size: clamp(2.5rem, 8vw, 4rem);
  }

  .cultural-subtitle {
    font-size: 1.2rem;
  }

  .premium-content {
    padding: 1.5rem;
  }

  .premium-description p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .cultural-heritage-section {
    padding: 40px 1rem;
  }

  .premium-header {
    margin-bottom: 60px;
  }

  .premium-cards-container {
    gap: 2rem;
  }

  .premium-title {
    font-size: 1.5rem;
  }

  .premium-subtitle {
    font-size: 1rem;
  }

  .premium-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }

  .cultural-icon-large {
    width: 80px;
    height: 80px;
  }

  .heritage-symbol {
    width: 50px;
    height: 50px;
  }
}

/* ===== ACCESSIBILITY & PERFORMANCE ===== */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }

  .premium-button:hover {
    transform: none;
  }
}

@media (prefers-contrast: high) {
  .premium-culture-card {
    border: 2px solid var(--royal-blue);
  }

  .premium-title {
    color: #000000;
  }

  .premium-description p {
    color: #000000;
  }
}

.premium-culture-card:focus-within {
  outline: 3px solid var(--gold-accent);
  outline-offset: 4px;
}

.premium-button:focus {
  outline: 2px solid var(--pearl-white);
  outline-offset: 2px;
}

/* ===== PRINT STYLES ===== */
@media print {
  .cultural-heritage-section {
    background: white;
    box-shadow: none;
  }

  .premium-culture-card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #000;
  }

  .premium-button {
    display: none;
  }
}

/* Overlay transisi tidak diperlukan karena warna sudah menyatu */
</style>
