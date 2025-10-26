<template>
  <section
    class="premium-tourism-section"
    aria-label="Destinasi Wisata Carousel"
    @mouseenter="pauseAutoSlide"
    @mouseleave="resumeAutoSlide">
    <!-- Immersive Background Elements -->
    <div class="immersive-backdrop">
      <div class="backdrop-element"></div>
      <div class="backdrop-element"></div>
      <div class="backdrop-element"></div>
      <div class="cinematic-overlay"></div>
    </div>

    <!-- Premium Section Header -->
    <div class="premium-header" ref="headerRef">
      <h2 class="premium-title">Destinasi Wisata</h2>
      <p class="premium-subtitle">Jelajahi Keindahan Magetan Yang Memukau</p>
      <div class="premium-accent-line"></div>
    </div>

    <!-- Premium Loading State -->
    <template v-if="loading">
      <div class="premium-loading">
        <div class="loading-spinner"></div>
        <p class="loading-text">Memuat destinasi wisata...</p>
      </div>
    </template>

    <!-- Main Carousel Container -->
    <template v-else-if="!error && destinations.length > 0">
      <div
        class="premium-carousel-container"
        role="group"
        aria-roledescription="carousel">
        <!-- Modern Navigation Controls -->
        <button
          class="premium-nav-button nav-previous"
          @click="navigateSlide('prev')"
          aria-label="Destinasi Sebelumnya"
          :disabled="isTransitioning || destinations.length <= 1">
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
        </button>

        <button
          class="premium-nav-button nav-next"
          @click="navigateSlide('next')"
          aria-label="Destinasi Selanjutnya"
          :disabled="isTransitioning || destinations.length <= 1">
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
        </button>

        <!-- Carousel Viewport -->
        <div
          class="premium-carousel-viewport"
          ref="containerRef"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd">
          <div class="premium-carousel-track" ref="trackRef">
            <div
              v-for="(destination, index) in extendedDestinations"
              :key="`dest-${index}-${destination.id}`"
              class="premium-destination-wrapper"
              :class="{
                'is-center': isCenterCard(index),
                'is-adjacent': isAdjacentCard(index),
                'is-distant': isDistantCard(index),
                'is-hidden': isHiddenCard(index),
              }">
              <div
                class="premium-destination-card"
                @mouseenter="handleCardHover"
                @mouseleave="handleCardLeave">
                <!-- Full Portrait Image Container -->
                <div class="card-portrait-container">
                  <div
                    class="card-portrait-image"
                    :style="{
                      backgroundImage: `url(${destination.image})`,
                    }"></div>
                  <div class="card-gradient-overlay"></div>

                  <!-- Content Overlay -->
                  <div class="card-content-overlay">
                    <p class="destination-description">
                      {{ destination.description }}
                    </p>

                    <router-link
                      :to="destination.link"
                      class="premium-explore-button"
                      @click="trackDestinationClick(destination)">
                      <span>Jelajahi</span>
                      <div class="button-icon">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fill-rule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                        </svg>
                      </div>
                    </router-link>
                  </div>
                </div>

                <!-- Premium Card Border -->
                <div class="card-premium-border"></div>
              </div>

              <!-- External Category Title -->
              <h3 class="destination-title-external">{{ destination.name }}</h3>
            </div>
          </div>
        </div>

        <!-- Modern Pagination Indicators -->
        <div class="premium-pagination">
          <div class="pagination-track">
            <button
              v-for="(destination, index) in destinations"
              :key="`indicator-${destination.id}`"
              class="pagination-indicator"
              :class="{ 'is-active': index === currentIndex }"
              @click="goToSlide(index)"
              :aria-label="`Ke destinasi ${destination.name}`">
              <div class="indicator-fill"></div>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Error State -->
    <div v-else-if="error" class="premium-error">
      <div class="error-icon">⚠</div>
      <p class="error-text">{{ error }}</p>
      <button class="error-retry-button" @click="fetchDestinations">
        Coba Lagi
      </button>
    </div>

    <!-- Empty State -->
    <div v-else class="premium-empty">
      <div class="empty-icon">◇</div>
      <p class="empty-text">Belum ada destinasi wisata tersedia</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Reactive state
const destinations = ref([]);
const loading = ref(true);
const error = ref(null);
const currentIndex = ref(0);
const isTransitioning = ref(false);

// Template refs
const headerRef = ref(null);
const containerRef = ref(null);
const trackRef = ref(null);

// Auto-slide configuration
const autoSlideInterval = ref(null);
const AUTO_SLIDE_DURATION = 5000;
const TRANSITION_DURATION = 0.8;

// Touch handling
let touchStartX = 0;
let touchStartY = 0;

// Remove background sync as we're using pure gradient now

// Sample destinations data (replace with API call)
const defaultDestinations = [
  {
    id: 1,
    name: "Wisata Alam",
    description:
      "Nikmati keindahan alam yang memukau dengan pemandangan hijau dan udara segar",
    image: "/src/assets/carousel1.jpg",
    link: "/destinasi?kategori=alam",
  },
  {
    id: 2,
    name: "Wisata Gunung",
    description:
      "Jelajahi puncak-puncak gunung dengan panorama yang menakjubkan",
    image: "/src/assets/carousel2.jpg",
    link: "/destinasi?kategori=gunung",
  },
  {
    id: 3,
    name: "Wisata Budaya",
    description:
      "Temukan kekayaan budaya dan tradisi yang masih terjaga dengan baik",
    image: "/src/assets/carousel3.jpg",
    link: "/destinasi?kategori=budaya",
  },
  {
    id: 4,
    name: "Wisata Sejarah",
    description:
      "Kunjungi situs-situs bersejarah yang menyimpan cerita masa lampau",
    image: "/src/assets/BG.jpg",
    link: "/destinasi?kategori=sejarah",
  },
  {
    id: 5,
    name: "Wisata Kuliner",
    description:
      "Rasakan cita rasa autentik kuliner khas daerah yang menggugah selera",
    image: "/src/assets/WhatsApp Image 2025-07-18 at 10.45.26_01d937fa.jpg",
    link: "/destinasi?kategori=kuliner",
  },
];

// Extended destinations for infinite scroll effect
const extendedDestinations = computed(() => {
  if (destinations.value.length === 0) return [];
  return [
    ...destinations.value.slice(-3), // Last 3 items at beginning
    ...destinations.value, // Original items
    ...destinations.value.slice(0, 3), // First 3 items at end
  ];
});

// Card position helpers
const isCenterCard = (index) => {
  const offset = 3; // Offset for prepended items
  return index === currentIndex.value + offset;
};

const isAdjacentCard = (index) => {
  const offset = 3;
  const centerIndex = currentIndex.value + offset;
  return index === centerIndex - 1 || index === centerIndex + 1;
};

const isDistantCard = (index) => {
  const offset = 3;
  const centerIndex = currentIndex.value + offset;
  return index === centerIndex - 2 || index === centerIndex + 2;
};

const isHiddenCard = (index) => {
  const offset = 3;
  const centerIndex = currentIndex.value + offset;
  return Math.abs(index - centerIndex) > 2;
};

// Fetch destinations from API
const fetchDestinations = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Replace with actual API call
    const response = await axios.get(
      "http://localhost:5000/api/kategori-destinasi/"
    );

    if (response.data && response.data.length > 0) {
      destinations.value = response.data.map((item, index) => ({
        id: item.id_kategori_destinasi,
        name: item.nama_kategori,
        description: `Jelajahi keindahan ${item.nama_kategori.toLowerCase()} yang memukau di Magetan`,
        image: `http://localhost:5000${item.sampul_kategori}`,
        link: `/destinasi?kategori=${item.id_kategori_destinasi}`,
      }));
    } else {
      // Fallback to default destinations if API returns no data
      destinations.value = defaultDestinations;
    }

    await nextTick();
    initializeAnimations();
    initializeCarouselPosition();
    startAutoSlide();
  } catch (err) {
    console.error("Error fetching destinations:", err);
    // Use default destinations as fallback
    destinations.value = defaultDestinations;
    await nextTick();
    initializeAnimations();
    initializeCarouselPosition();
    startAutoSlide();
  } finally {
    loading.value = false;
  }
};

// Initialize GSAP animations
const initializeAnimations = () => {
  if (!headerRef.value || !trackRef.value) return;

  // Animate header entrance with staggered effect
  gsap.fromTo(
    headerRef.value.children,
    {
      y: 80,
      opacity: 0,
      scale: 0.8,
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      stagger: 0.3,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: headerRef.value,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Animate premium background elements with parallax
  gsap.fromTo(
    ".immersive-backdrop .backdrop-element",
    {
      y: 50,
      opacity: 0,
      scale: 0.6,
      rotation: -10,
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 2,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".premium-tourism-section",
        start: "top 95%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Animate carousel cards entrance with enhanced effect
  gsap.fromTo(
    ".premium-destination-wrapper",
    {
      y: 120,
      opacity: 0,
      scale: 0.7,
      rotationY: 25,
      rotationX: 15,
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      rotationY: 0,
      rotationX: 0,
      duration: 1.4,
      stagger: 0.2,
      ease: "back.out(1.4)",
      scrollTrigger: {
        trigger: ".premium-carousel-container",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    }
  );

  // Enhanced parallax effect for background elements
  gsap.to(".immersive-backdrop .backdrop-element", {
    y: -60,
    rotation: 360,
    duration: 2,
    scrollTrigger: {
      trigger: ".premium-tourism-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5,
    },
  });

  // Parallax for tourism silhouettes
  gsap.to(".immersive-backdrop::before", {
    y: -40,
    scrollTrigger: {
      trigger: ".premium-tourism-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 2,
    },
  });

  gsap.to(".immersive-backdrop::after", {
    y: -25,
    x: 15,
    rotation: 5,
    scrollTrigger: {
      trigger: ".premium-tourism-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.8,
    },
  });
};

// Initialize carousel position
const initializeCarouselPosition = () => {
  nextTick(() => {
    animateSlideTransition();
  });
};

// Navigation functions
const navigateSlide = (direction) => {
  if (isTransitioning.value || destinations.value.length === 0) return;

  isTransitioning.value = true;
  pauseAutoSlide();

  const prevIndex = currentIndex.value;

  if (direction === "next") {
    currentIndex.value = (currentIndex.value + 1) % destinations.value.length;
  } else {
    currentIndex.value =
      currentIndex.value === 0
        ? destinations.value.length - 1
        : currentIndex.value - 1;
  }

  // Only animate if index actually changed
  if (prevIndex !== currentIndex.value) {
    animateSlideTransition();
  }

  setTimeout(() => {
    isTransitioning.value = false;
    resumeAutoSlide();
  }, TRANSITION_DURATION * 1000);
};

const goToSlide = (index) => {
  if (
    isTransitioning.value ||
    index === currentIndex.value ||
    index < 0 ||
    index >= destinations.value.length
  )
    return;

  isTransitioning.value = true;
  pauseAutoSlide();

  currentIndex.value = index;
  animateSlideTransition();

  setTimeout(() => {
    isTransitioning.value = false;
    resumeAutoSlide();
  }, TRANSITION_DURATION * 1000);
};

// Animate slide transition
const animateSlideTransition = () => {
  const wrappers = document.querySelectorAll(".premium-destination-wrapper");
  const activeIndex = currentIndex.value + 3; // Account for offset

  wrappers.forEach((wrapper, index) => {
    const isCenterIndex = index === activeIndex;
    const isAdjacentIndex = Math.abs(index - activeIndex) === 1;
    const isDistantIndex = Math.abs(index - activeIndex) === 2;
    const isHiddenIndex = Math.abs(index - activeIndex) > 2;

    let scale, opacity, zIndex, yOffset, rotationY;

    if (isCenterIndex) {
      scale = 1.15;
      opacity = 1;
      zIndex = 100;
      yOffset = -20;
      rotationY = 0;
    } else if (isAdjacentIndex) {
      scale = 0.95;
      opacity = 0.85;
      zIndex = 50;
      yOffset = 0;
      rotationY = index < activeIndex ? 5 : -5;
    } else if (isDistantIndex) {
      scale = 0.8;
      opacity = 0.6;
      zIndex = 25;
      yOffset = 10;
      rotationY = index < activeIndex ? 10 : -10;
    } else {
      scale = 0.7;
      opacity = 0.3;
      zIndex = 1;
      yOffset = 20;
      rotationY = index < activeIndex ? 15 : -15;
    }

    gsap.to(wrapper, {
      scale: scale,
      opacity: opacity,
      z: zIndex,
      y: yOffset,
      rotationY: rotationY,
      duration: TRANSITION_DURATION,
      ease: "power2.inOut",
    });

    // Update wrapper classes for styling
    wrapper.classList.toggle("is-center", isCenterIndex);
    wrapper.classList.toggle("is-adjacent", isAdjacentIndex);
    wrapper.classList.toggle("is-distant", isDistantIndex);
    wrapper.classList.toggle("is-hidden", isHiddenIndex);
  });

  // Update track position for premium layout
  if (trackRef.value) {
    const cardWidth = 300; // Adjusted card width + gap for 5-card display
    const centerOffset =
      Math.floor(wrappers.length / 2) - currentIndex.value - 3;
    const offset = centerOffset * cardWidth;

    gsap.to(trackRef.value, {
      x: offset,
      duration: TRANSITION_DURATION,
      ease: "power2.inOut",
    });
  }
};

// Auto-slide functionality
const startAutoSlide = () => {
  if (autoSlideInterval.value) clearInterval(autoSlideInterval.value);

  autoSlideInterval.value = setInterval(() => {
    if (!isTransitioning.value && destinations.value.length > 1) {
      navigateSlide("next");
    }
  }, AUTO_SLIDE_DURATION);
};

const pauseAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value);
    autoSlideInterval.value = null;
  }
};

const resumeAutoSlide = () => {
  startAutoSlide();
};

// Enhanced card hover effects
const handleCardHover = (event) => {
  const card = event.currentTarget;
  const cardImage = card.querySelector(".card-portrait-image");
  const cardContent = card.querySelector(".card-content-overlay");
  const cardButton = card.querySelector(".premium-explore-button");

  // Main card hover animation
  gsap.to(card, {
    y: -15,
    scale: 1.03,
    rotationY: 2,
    duration: 0.6,
    ease: "power2.out",
  });

  // Image zoom and glow effect
  gsap.to(cardImage, {
    scale: 1.15,
    duration: 0.8,
    ease: "power2.out",
  });

  // Content overlay animation
  gsap.to(cardContent, {
    y: -8,
    duration: 0.5,
    ease: "power2.out",
  });

  // Button glow animation
  if (cardButton) {
    gsap.to(cardButton, {
      scale: 1.05,
      boxShadow:
        "0 20px 40px rgba(30, 58, 138, 0.3), 0 10px 25px rgba(0, 0, 0, 0.2)",
      duration: 0.4,
      ease: "power2.out",
    });
  }
};

const handleCardLeave = (event) => {
  const card = event.currentTarget;
  const cardImage = card.querySelector(".card-portrait-image");
  const cardContent = card.querySelector(".card-content-overlay");
  const cardButton = card.querySelector(".premium-explore-button");

  // Reset card position and scale
  gsap.to(card, {
    y: 0,
    scale: 1,
    rotationY: 0,
    duration: 0.6,
    ease: "power2.out",
  });

  // Reset image scale
  gsap.to(cardImage, {
    scale: 1,
    duration: 0.8,
    ease: "power2.out",
  });

  // Reset content overlay
  gsap.to(cardContent, {
    y: 0,
    duration: 0.5,
    ease: "power2.out",
  });

  // Reset button
  if (cardButton) {
    gsap.to(cardButton, {
      scale: 1,
      boxShadow:
        "0 8px 25px rgba(30, 58, 138, 0.2), 0 4px 10px rgba(0, 0, 0, 0.1)",
      duration: 0.4,
      ease: "power2.out",
    });
  }
};

// Touch handling for mobile
const handleTouchStart = (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
  pauseAutoSlide();
};

const handleTouchMove = (event) => {
  event.preventDefault();
};

const handleTouchEnd = (event) => {
  if (isTransitioning.value) return; // Prevent touch while transitioning

  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // Check if horizontal swipe is more significant than vertical
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      navigateSlide("prev");
    } else {
      navigateSlide("next");
    }
  } else {
    resumeAutoSlide(); // Resume if no valid swipe
  }
};

// Analytics tracking
const trackDestinationClick = (destination) => {
  // Add your analytics tracking here
  console.log("Destination clicked:", destination.name);
};

// Keyboard navigation
const handleKeydown = (event) => {
  if (isTransitioning.value) return; // Prevent keyboard nav while transitioning

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    navigateSlide("prev");
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    navigateSlide("next");
  }
};

// Removed background sync functions - using pure gradient approach

// Enhanced transition effects on scroll
const initializeTransitionEffects = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Enhanced animation when section comes into view
          entry.target.classList.add("section-visible");

          // Trigger enhanced wave animation
          const waveElement = entry.target.querySelector(
            ".premium-tourism-section::before"
          );
          if (waveElement) {
            waveElement.style.animationDelay = "0s";
            waveElement.style.animationDuration = "6s";
          }
        } else {
          entry.target.classList.remove("section-visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "50px 0px -50px 0px",
    }
  );

  nextTick(() => {
    const section = document.querySelector(".premium-tourism-section");
    if (section) {
      observer.observe(section);
    }
  });

  return observer;
};

// Lifecycle hooks
onMounted(() => {
  fetchDestinations();
  window.addEventListener("keydown", handleKeydown);

  // Initialize enhanced transition effects
  const observer = initializeTransitionEffects();

  // Store observer for cleanup
  onUnmounted(() => {
    observer.disconnect();
  });
});

onUnmounted(() => {
  pauseAutoSlide();
  window.removeEventListener("keydown", handleKeydown);
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});

// Watch for destination changes
watch(destinations, (newDestinations) => {
  if (newDestinations.length > 0) {
    nextTick(() => {
      initializeCarouselPosition();
    });
  }
});

// Watch for current index changes to prevent unwanted jumps
watch(currentIndex, (newIndex, oldIndex) => {
  if (Math.abs(newIndex - oldIndex) > 1 && !isTransitioning.value) {
    // This might be an unwanted jump, let's animate it smoothly
    nextTick(() => {
      animateSlideTransition();
    });
  }
});
</script>
<style scoped>
/* ===== CSS CUSTOM PROPERTIES ===== */
:root {
  --premium-navy: #1e3a8a;
  --premium-royal: #2563eb;
  --premium-azure: #3b82f6;
  --premium-sky: #60a5fa;
  --premium-white: #ffffff;
  --premium-ice: #f8fafc;
  --premium-silver: #e2e8f0;
  --premium-charcoal: #1e293b;
  --premium-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
  --premium-glow: 0 0 30px rgba(37, 99, 235, 0.4);
  --immersive-gradient: linear-gradient(
    135deg,
    #f8fafc 0%,
    #e0f2fe 30%,
    #bae6fd 70%,
    #7dd3fc 100%
  );
  --glass-effect: rgba(255, 255, 255, 0.1);
  --backdrop-blur: blur(20px);
  --transition-premium: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-luxury: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* ===== MAIN SECTION LAYOUT ===== */
.premium-tourism-section {
  position: relative;
  min-height: 100vh;
  height: auto;
  padding: 20px 32px 64px 32px;
  margin-top: -40px;
  background: linear-gradient(
    135deg,
    rgba(186, 230, 253, 0.95) 0%,
    rgba(147, 197, 253, 0.9) 25%,
    rgba(96, 165, 250, 0.85) 50%,
    rgba(59, 130, 246, 0.8) 75%,
    rgba(37, 99, 235, 0.75) 100%
  );
  overflow: visible;
  font-family: "Inter", "SF Pro Display", sans-serif;
  z-index: 5;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Dynamic background overlay for better photo-to-gradient transition */
.premium-tourism-section::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 30%,
    rgba(248, 250, 254, 0.4) 60%,
    rgba(248, 250, 254, 0.7) 80%,
    #ffffff 100%
  );
  z-index: 1;
  pointer-events: none;
}

/* Enhanced state when section is visible */
.premium-tourism-section.section-visible {
  transform: translateY(0);
}

.premium-tourism-section.section-visible::before {
  animation-play-state: running;
}

.premium-tourism-section.section-visible .premium-header {
  transform: translateY(0);
  opacity: 1;
}

.premium-tourism-section::before {
  content: "";
  position: absolute;
  top: -15px;
  left: 0;
  right: 0;
  height: 60px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 60'%3E%3Cpath d='M0,35 C300,50 600,10 900,40 C1000,50 1100,25 1200,35 L1200,0 L0,0 Z' fill='rgba(186,230,253,0.9)'/%3E%3C/svg%3E")
    no-repeat center top;
  background-size: cover;
  z-index: 2;
  pointer-events: none;
  animation: complementaryWave 12s ease-in-out infinite alternate;
}

.premium-tourism-section::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 40%,
    rgba(248, 250, 254, 0.7) 70%,
    #ffffff 100%
  );
  z-index: 10;
  pointer-events: none;
}

/* ===== IMMERSIVE BACKGROUND ELEMENTS ===== */
.immersive-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.backdrop-element {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(37, 99, 235, 0.08) 50%,
    transparent 70%
  );
  animation: floatElement 20s ease-in-out infinite;
}

.backdrop-element:nth-child(1) {
  width: 500px;
  height: 500px;
  top: -10%;
  left: -15%;
  animation-delay: 0s;
  background: radial-gradient(
    ellipse,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(37, 99, 235, 0.1) 50%,
    transparent 70%
  );
}

.backdrop-element:nth-child(2) {
  width: 350px;
  height: 350px;
  top: 50%;
  right: -10%;
  animation-delay: -7s;
  background: radial-gradient(
    ellipse,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(59, 130, 246, 0.08) 50%,
    transparent 70%
  );
}

.backdrop-element:nth-child(3) {
  width: 250px;
  height: 250px;
  top: 20%;
  left: 70%;
  animation-delay: -14s;
  background: radial-gradient(
    ellipse,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(96, 165, 250, 0.1) 50%,
    transparent 70%
  );
}

.cinematic-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.1) 0%,
    transparent 30%,
    transparent 70%,
    rgba(30, 58, 138, 0.05) 100%
  );
  pointer-events: none;
}

/* Tourism Silhouettes */
.immersive-backdrop::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 200'%3E%3Cpath d='M0,200 L0,150 Q100,120 200,140 T400,130 Q500,110 600,125 T800,120 Q900,100 1000,115 T1200,110 L1200,200 Z' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E")
    no-repeat center bottom;
  background-size: cover;
  opacity: 0.6;
  animation: mountainBreathing 12s ease-in-out infinite alternate;
}

.immersive-backdrop::after {
  content: "";
  position: absolute;
  top: 15%;
  right: 8%;
  width: 120px;
  height: 150px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 150'%3E%3Cpath d='M60,10 L20,40 L20,140 L100,140 L100,40 Z M40,50 L80,50 L80,70 L40,70 Z M45,80 L75,80 L75,100 L45,100 Z' fill='rgba(255,255,255,0.08)'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: contain;
  opacity: 0.4;
  animation: templeFloat 8s ease-in-out infinite;
}

/* ===== PREMIUM HEADER ===== */
.premium-header {
  position: relative;
  z-index: 20;
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 80px;
}

.premium-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  color: #1e3a8a;
  margin: 1.5rem 0;
  letter-spacing: -2px;
  line-height: 1.1;
  text-shadow: 0 4px 8px rgba(30, 58, 138, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1e3a8a 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: titleGlow 3s ease-in-out infinite alternate;
}

.premium-subtitle {
  font-size: 1.4rem;
  color: #1e293b;
  font-weight: 700;
  letter-spacing: 1px;
  margin-top: 1rem;
  text-shadow: 0 2px 4px rgba(30, 41, 59, 0.2);
  opacity: 0.9;
}

.premium-accent-line {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #2563eb, #3b82f6, #2563eb);
  margin: 2rem auto;
  border-radius: 3px;
  position: relative;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.premium-accent-line::before {
  content: "";
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(90deg, #2563eb, #3b82f6, #2563eb);
  border-radius: 6px;
  z-index: -1;
  filter: blur(10px);
  opacity: 0.6;
}

/* ===== PREMIUM LOADING STATE ===== */
.premium-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  z-index: 10;
  position: relative;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  border: 6px solid var(--premium-silver);
  border-top: 6px solid var(--premium-royal);
  border-radius: 50%;
  animation: premiumSpin 1.2s linear infinite;
  margin-bottom: 2rem;
  position: relative;
}

.loading-spinner::before {
  content: "";
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border: 2px solid transparent;
  border-top: 2px solid var(--premium-azure);
  border-radius: 50%;
  animation: premiumSpin 2s linear infinite reverse;
}

.loading-text {
  color: var(--premium-charcoal);
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 1px;
}

/* ===== PREMIUM CAROUSEL CONTAINER ===== */
.premium-carousel-container {
  position: relative;
  z-index: 20;
  max-width: 1600px;
  margin: 0 auto;
}

/* ===== MODERN NAVIGATION ===== */
.premium-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: var(--backdrop-blur);
  border: 2px solid var(--premium-royal);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-premium);
  box-shadow: var(--premium-shadow);
}

.nav-previous {
  left: -35px;
}

.nav-next {
  right: -35px;
}

.premium-nav-button:hover {
  background: var(--premium-royal);
  transform: translateY(-50%) scale(1.1);
  box-shadow: var(--premium-glow);
}

.premium-nav-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: translateY(-50%) scale(1);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.nav-icon svg {
  width: 28px;
  height: 28px;
  color: var(--premium-royal);
  transition: var(--transition-premium);
}

.premium-nav-button:hover .nav-icon svg {
  color: var(--premium-white);
}

/* ===== PREMIUM CAROUSEL VIEWPORT ===== */
.premium-carousel-viewport {
  overflow: hidden;
  padding: 2rem 0;
  cursor: grab;
  position: relative;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.premium-carousel-viewport:active {
  cursor: grabbing;
}

.premium-carousel-track {
  display: flex;
  gap: 2rem;
  padding: 0 2rem;
  will-change: transform;
  align-items: center;
  justify-content: center;
}

/* ===== PREMIUM DESTINATION CARDS ===== */
.premium-destination-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: var(--transition-luxury);
  transform-style: preserve-3d;
}

.premium-destination-wrapper.is-center {
  transform: scale(1.15) translateY(-20px);
  z-index: 100;
  opacity: 1;
}

.premium-destination-wrapper.is-adjacent {
  opacity: 0.85;
  transform: scale(0.95);
  z-index: 50;
}

.premium-destination-wrapper.is-distant {
  opacity: 0.6;
  transform: scale(0.8) translateY(10px);
  z-index: 25;
}

.premium-destination-wrapper.is-hidden {
  opacity: 0.3;
  transform: scale(0.7) translateY(20px);
  z-index: 1;
}

.premium-destination-card {
  position: relative;
  width: 100%;
  height: 480px;
  border-radius: 24px;
  overflow: hidden;
  background: var(--premium-white);
  box-shadow: var(--premium-shadow);
  transition: var(--transition-luxury);
  transform-style: preserve-3d;
  cursor: pointer;
}

/* Enhanced center card styling */
.premium-destination-wrapper.is-center .premium-destination-card {
  box-shadow: 0 25px 50px rgba(30, 58, 138, 0.25),
    0 15px 30px rgba(0, 0, 0, 0.15), 0 0 40px rgba(37, 99, 235, 0.2);
  border: 3px solid rgba(37, 99, 235, 0.3);
}

.premium-destination-wrapper.is-center .destination-title-external {
  color: #2563eb;
  font-size: 2rem;
  font-weight: 800;
  text-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
  transform: translateY(-15px);
}

/* Adjacent cards styling */
.premium-destination-wrapper.is-adjacent .premium-destination-card {
  box-shadow: 0 15px 30px rgba(30, 58, 138, 0.15);
}

/* Distant cards styling */
.premium-destination-wrapper.is-distant .premium-destination-card {
  box-shadow: 0 10px 20px rgba(30, 58, 138, 0.1);
}

/* Hidden cards styling */
.premium-destination-wrapper.is-hidden .premium-destination-card {
  box-shadow: 0 5px 15px rgba(30, 58, 138, 0.05);
}

/* ===== FULL PORTRAIT IMAGE ===== */
.card-portrait-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.card-portrait-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: var(--transition-luxury);
}

.card-gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  transition: all 0.5s ease;
}

/* ===== CONTENT OVERLAY ===== */
.card-content-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3rem 2.5rem;
  color: #ffffff;
  background: transparent;
  backdrop-filter: none;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.destination-description {
  font-size: 1.2rem;
  line-height: 1.7;
  margin-bottom: 2.5rem;
  color: #ffffff;
  opacity: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  font-weight: 400;
  letter-spacing: 0.3px;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== EXTERNAL CATEGORY TITLE ===== */
.destination-title-external {
  margin-top: 1.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e3a8a;
  text-align: center;
  text-transform: capitalize;
  letter-spacing: 0.5px;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(30, 58, 138, 0.2);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: translateY(0);
}

/* ===== PREMIUM EXPLORE BUTTON ===== */
.premium-explore-button {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  color: #1e3a8a;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.2), 0 4px 10px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  opacity: 0;
  transform: translateY(20px);
}

.premium-explore-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(30, 58, 138, 0.1),
    transparent
  );
  transition: all 0.6s ease;
}

.premium-explore-button:hover {
  background: #1e3a8a;
  color: #ffffff;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 15px 35px rgba(30, 58, 138, 0.4), 0 8px 20px rgba(0, 0, 0, 0.15),
    0 0 25px rgba(37, 99, 235, 0.3);
  border-color: #1e3a8a;
}

.premium-explore-button:hover::before {
  left: 100%;
}

.premium-explore-button:active {
  transform: translateY(-2px) scale(1.02);
}

.button-icon {
  display: flex;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.button-icon svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
}

.premium-explore-button:hover .button-icon {
  transform: translateX(8px) scale(1.1);
}

/* ===== CARD HOVER EFFECTS ===== */
.premium-destination-card:hover .destination-description {
  opacity: 0.95;
  transform: translateY(0);
}

.premium-destination-card:hover .premium-explore-button {
  opacity: 1;
  transform: translateY(0);
}

.premium-destination-card:hover .card-content-overlay {
  background: linear-gradient(
    to top,
    rgba(30, 58, 138, 0.98) 0%,
    rgba(30, 58, 138, 0.9) 40%,
    rgba(0, 0, 0, 0.7) 70%,
    transparent 100%
  );
  backdrop-filter: blur(15px);
}

.premium-destination-card:hover .card-gradient-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.2) 25%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.8) 75%,
    rgba(30, 58, 138, 0.95) 100%
  );
}

.premium-destination-wrapper:hover .destination-title-external {
  transform: translateY(-10px);
  color: #2563eb;
  text-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
}

/* ===== CARD PREMIUM BORDER ===== */
.card-premium-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid transparent;
  border-radius: 24px;
  pointer-events: none;
  opacity: 0;
  transition: var(--transition-premium);
  background: linear-gradient(var(--premium-white), var(--premium-white))
      padding-box,
    linear-gradient(135deg, var(--premium-royal), var(--premium-azure))
      border-box;
}

.premium-destination-card:hover .card-premium-border {
  opacity: 1;
}

/* ===== MODERN PAGINATION ===== */
.premium-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2.5rem;
  position: relative;
  z-index: 10;
}

.pagination-track {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: var(--backdrop-blur);
  border-radius: 50px;
  border: 1px solid var(--premium-silver);
  box-shadow: var(--premium-shadow);
}

.pagination-indicator {
  position: relative;
  width: 12px;
  height: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: var(--transition-premium);
  border-radius: 50%;
}

.indicator-fill {
  width: 100%;
  height: 100%;
  background: var(--premium-silver);
  border-radius: 50%;
  transition: var(--transition-premium);
  position: relative;
}

.indicator-fill::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  background: var(--premium-royal);
  border-radius: 50%;
  transition: var(--transition-premium);
}

.pagination-indicator.is-active .indicator-fill {
  background: var(--premium-royal);
  transform: scale(1.3);
}

.pagination-indicator.is-active .indicator-fill::before {
  width: 120%;
  height: 120%;
  opacity: 0.3;
  animation: indicatorPulse 2s ease-in-out infinite;
}

.pagination-indicator:hover .indicator-fill {
  background: var(--premium-azure);
  transform: scale(1.1);
}

/* ===== ERROR & EMPTY STATES ===== */
.premium-error,
.premium-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  z-index: 10;
  position: relative;
}

.error-icon,
.empty-icon {
  font-size: 4rem;
  color: var(--premium-royal);
  margin-bottom: 2rem;
  opacity: 0.7;
}

.error-text,
.empty-text {
  font-size: 1.3rem;
  color: var(--premium-charcoal);
  margin-bottom: 2rem;
  font-weight: 500;
}

.error-retry-button {
  padding: 1rem 2rem;
  background: var(--premium-royal);
  color: var(--premium-white);
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition-premium);
  box-shadow: var(--premium-shadow);
}

.error-retry-button:hover {
  background: var(--premium-navy);
  transform: translateY(-2px);
  box-shadow: var(--premium-glow);
}

/* ===== ANIMATIONS ===== */
@keyframes floatElement {
  0%,
  100% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-40px) translateX(25px) rotate(90deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-20px) translateX(50px) rotate(180deg);
    opacity: 0.9;
  }
  75% {
    transform: translateY(30px) translateX(-20px) rotate(270deg);
    opacity: 0.7;
  }
}

@keyframes mountainBreathing {
  0%,
  100% {
    opacity: 0.6;
    transform: scaleY(1) translateY(0px);
  }
  50% {
    opacity: 0.8;
    transform: scaleY(1.05) translateY(-5px);
  }
}

@keyframes templeFloat {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.4;
  }
  33% {
    transform: translateY(-15px) rotate(2deg);
    opacity: 0.6;
  }
  66% {
    transform: translateY(10px) rotate(-1deg);
    opacity: 0.5;
  }
}

@keyframes premiumSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes indicatorPulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0.1;
  }
}

@keyframes titleGlow {
  0%,
  100% {
    text-shadow: 0 4px 8px rgba(30, 58, 138, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  50% {
    text-shadow: 0 6px 12px rgba(30, 58, 138, 0.5), 0 3px 6px rgba(0, 0, 0, 0.2),
      0 0 20px rgba(37, 99, 235, 0.3);
  }
}

@keyframes cardEntrance {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.8) rotateY(15deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1) rotateY(0deg);
  }
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1200px) {
  .premium-nav-button {
    width: 60px;
    height: 60px;
  }

  .nav-previous {
    left: -30px;
  }

  .nav-next {
    right: -30px;
  }

  .premium-destination-wrapper {
    width: 260px;
  }

  .premium-destination-card {
    height: 450px;
  }

  .destination-title-external {
    font-size: 1.6rem;
  }

  .premium-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
  }
}

@media (max-width: 768px) {
  .premium-tourism-section {
    padding: 32px 16px;
    background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 40%, #bae6fd 100%);
  }

  .premium-title {
    font-size: clamp(1.8rem, 7vw, 3rem);
    letter-spacing: -1px;
  }

  .premium-subtitle {
    font-size: 1.1rem;
    margin-top: 0.8rem;
  }

  .premium-header {
    margin-bottom: 2rem;
  }

  .premium-nav-button {
    display: none;
  }

  .premium-carousel-track {
    gap: 1rem;
    padding: 0 1rem;
  }

  .premium-destination-wrapper {
    width: 220px;
  }

  .premium-destination-card {
    height: 380px;
  }

  .destination-title-external {
    font-size: 1.5rem;
    margin-top: 1rem;
  }

  .card-content-overlay {
    padding: 2rem 1.5rem;
  }

  .destination-title {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  .destination-description {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .premium-explore-button {
    padding: 1rem 2rem;
    font-size: 1rem;
  }

  /* Mobile: Show description and button on tap/touch */
  .premium-destination-card:active .destination-description,
  .premium-destination-card.touched .destination-description {
    opacity: 0.95;
    transform: translateY(0);
  }

  .premium-destination-card:active .premium-explore-button,
  .premium-destination-card.touched .premium-explore-button {
    opacity: 1;
    transform: translateY(0);
  }

  .premium-destination-card:active .card-content-overlay,
  .premium-destination-card.touched .card-content-overlay {
    background: linear-gradient(
      to top,
      rgba(30, 58, 138, 0.98) 0%,
      rgba(30, 58, 138, 0.9) 40%,
      rgba(0, 0, 0, 0.7) 70%,
      transparent 100%
    );
    backdrop-filter: blur(15px);
  }

  .premium-destination-card:active .card-gradient-overlay,
  .premium-destination-card.touched .card-gradient-overlay {
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.2) 25%,
      rgba(0, 0, 0, 0.5) 50%,
      rgba(0, 0, 0, 0.8) 75%,
      rgba(30, 58, 138, 0.95) 100%
    );
  }
}

@media (max-width: 480px) {
  .premium-tourism-section {
    padding: 20px 10px;
    min-height: 400px;
  }

  .premium-header {
    margin-bottom: 1.5rem;
  }

  .premium-title {
    font-size: clamp(1.5rem, 6vw, 2.5rem);
    margin: 1rem 0;
  }

  .premium-subtitle {
    font-size: 1rem;
  }

  .premium-destination-wrapper {
    width: 220px;
  }

  .premium-destination-card {
    height: 380px;
  }

  .destination-title-external {
    font-size: 1.4rem;
    margin-top: 1rem;
  }

  .premium-accent-line {
    width: 60px;
    height: 3px;
  }

  .card-content-overlay {
    padding: 1.5rem 1.5rem;
  }

  .destination-title {
    font-size: 1.6rem;
  }

  .destination-description {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .premium-explore-button {
    padding: 0.9rem 1.8rem;
    font-size: 0.95rem;
    gap: 0.8rem;
  }

  .pagination-track {
    gap: 0.8rem;
    padding: 0.8rem 1.5rem;
  }

  .pagination-indicator {
    width: 10px;
    height: 10px;
  }

  /* Reduce background elements on mobile */
  .backdrop-element:nth-child(2),
  .backdrop-element:nth-child(3) {
    display: none;
  }
}

/* ===== ACCESSIBILITY IMPROVEMENTS ===== */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .premium-title {
    animation: none;
  }
}

@media (prefers-contrast: high) {
  .premium-destination-card {
    border: 3px solid #1e3a8a;
  }

  .premium-explore-button {
    border: 2px solid #1e3a8a;
    background: #ffffff;
    color: #1e3a8a;
  }

  .premium-title {
    color: #1e3a8a;
    -webkit-text-fill-color: #1e3a8a;
  }
}

/* ===== PERFORMANCE OPTIMIZATIONS ===== */
.premium-destination-card,
.card-portrait-image,
.premium-carousel-track {
  will-change: transform;
}

.premium-destination-card {
  contain: layout style paint;
  backface-visibility: hidden;
  perspective: 1000px;
}

.card-portrait-image {
  transform-origin: center;
  backface-visibility: hidden;
}

/* ===== ENHANCED FOCUS STYLES ===== */
.premium-explore-button:focus,
.premium-nav-button:focus,
.pagination-indicator:focus {
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
}

/* ===== TRANSITION ANIMATIONS ===== */
@keyframes complementaryWave {
  0% {
    transform: translateX(3px) scaleX(1.005);
    opacity: 0.8;
  }
  50% {
    transform: translateX(0px) scaleX(1);
    opacity: 1;
  }
  100% {
    transform: translateX(-3px) scaleX(1.005);
    opacity: 0.8;
  }
}
</style>
