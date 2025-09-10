<template>
  <section class="hero-section">
    <!-- Dynamic Background Carousel -->
    <div class="hero-background">
      <div class="background-carousel">
        <div
          class="carousel-slide active"
          style="
            background-image: url('/src/assets/carousel5.jpg');
          "></div>
        <div
          class="carousel-slide"
          style="background-image: url('/src/assets/BG.jpg')"></div>
        <div
          class="carousel-slide"
          style="background-image: url('/src/assets/carousel1.jpg')"></div>
        <div
          class="carousel-slide"
          style="background-image: url('/src/assets/carousel2.jpg')"></div>
        <div
          class="carousel-slide"
          style="background-image: url('/src/assets/carousel3.jpg')"></div>
      </div>

      <!-- Sophisticated Gradient Overlay -->
      <div class="hero-overlay"></div>
    </div>

    <!-- Hero Content -->
    <div class="hero-content">
      <div class="content-wrapper">
        <!-- Refined Logo Section -->
        <div class="logo-section">
          <div class="logo-container">
            <img
              src="/src/assets/LOGO MAGETAN NGANGENI outline.png"
              alt="Logo Magetan Ngangeni"
              class="main-logo" />
            <img
              src="/src/assets/Logo Magetan Tourism (png).png"
              alt="Logo Magetan Tourism"
              class="tourism-logo" />
            <img
              src="/src/assets/LOGO PEMKAB.png"
              alt="Logo Pemkab Magetan"
              class="pemkab-logo" />
          </div>
        </div>

        <!-- Elegant Title with Letter Animation -->
        <h1 class="hero-title">
          <span class="title-text">Dinas Kebudayaan Dan Pariwisata</span>
          <span class="title-emphasis">Kabupaten Magetan</span>
        </h1>

        <!-- Luxurious Tagline -->
        <p class="hero-tagline">
          Discover Magetan's exquisite beauty and cultural heritage
        </p>

        <!-- Sophisticated Call to Action -->
        <div class="hero-actions">
          <button class="hero-button primary-button">
            <span class="button-text">Start Your Journey</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const isLoaded = ref(false);
const currentSlide = ref(0);
let carouselInterval = null;

onMounted(() => {
  // Initialize hero animations
  initializeHeroAnimations();

  // Start background carousel
  initializeCarousel();

  // Handle reduced motion preference
  handleReducedMotion();

  // Mark as loaded
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

function initializeCarousel() {
  const slides = document.querySelectorAll(".carousel-slide");
  const totalSlides = slides.length;

  if (totalSlides <= 1) return;

  carouselInterval = setInterval(() => {
    // Remove active class from current slide
    slides[currentSlide.value].classList.remove("active");

    // Move to next slide
    currentSlide.value = (currentSlide.value + 1) % totalSlides;

    // Add active class to new slide
    slides[currentSlide.value].classList.add("active");
  }, 6000); // Change image every 6 seconds for luxurious pacing
}

function initializeHeroAnimations() {
  // Logo animations
  setTimeout(() => {
    const logoSection = document.querySelector(".logo-section");
    if (logoSection) logoSection.classList.add("animate-in");
  }, 300);

  // Title animation with letter reveal effect
  setTimeout(() => {
    const titleText = document.querySelector(".title-text");
    const titleEmphasis = document.querySelector(".title-emphasis");
    if (titleText) titleText.classList.add("animate-in");
    if (titleEmphasis) {
      setTimeout(() => titleEmphasis.classList.add("animate-in"), 200);
    }
  }, 800);

  // Tagline animation
  setTimeout(() => {
    const tagline = document.querySelector(".hero-tagline");
    if (tagline) tagline.classList.add("animate-in");
  }, 1400);

  // Button animation
  setTimeout(() => {
    const button = document.querySelector(".hero-button");
    if (button) button.classList.add("animate-in");
  }, 1800);
}

function handleReducedMotion() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) {
    document.body.classList.add("reduced-motion");
    if (carouselInterval) {
      clearInterval(carouselInterval);
    }
  }
}

onUnmounted(() => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
});
</script>

<style scoped>
/* Import Google Fonts for luxury typography */
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap");

/* Hero Section Layout */
.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  z-index: 1;
  isolation: isolate;
}

/* Dynamic Background Carousel */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
}

.background-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 2s ease-in-out;
  transform: scale(1.05);
}

.carousel-slide.active {
  opacity: 1;
}

/* Sophisticated Gradient Overlay */
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 48, 135, 0.75) 0%,
    rgba(0, 86, 179, 0.65) 25%,
    rgba(30, 64, 175, 0.7) 50%,
    rgba(37, 99, 235, 0.6) 75%,
    rgba(59, 130, 246, 0.55) 100%
  );
  z-index: -1;
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 100;
  text-align: center;
  color: white;
  max-width: 1200px;
  width: 100%;
  padding: 0 2rem;
  margin: 0 auto;
}

.content-wrapper {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  padding: 4rem 3rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  width: 100%;
  max-width: 100%;
}

/* Refined Logo Section */
.logo-section {
  position: relative;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.logo-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.logo-container img {
  filter: drop-shadow(0 8px 32px rgba(255, 255, 255, 0.1));
  transition: all 0.4s ease;
}

.logo-container img:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 12px 40px rgba(255, 255, 255, 0.2));
}

.main-logo {
  height: 80px;
  width: auto;
}

.tourism-logo {
  height: 70px;
  width: auto;
}

.pemkab-logo {
  height: 65px;
  width: auto;
}

/* Elegant Title */
.hero-title {
  font-family: "Playfair Display", serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.title-text,
.title-emphasis {
  display: block;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.title-text.animate-in,
.title-emphasis.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.title-emphasis {
  font-weight: 800;
  margin-top: 0.5rem;
  font-size: 1.1em;
}

/* Luxurious Tagline */
.hero-tagline {
  font-family: "Inter", sans-serif;
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  font-weight: 400;
  line-height: 1.6;
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease 0.4s;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hero-tagline.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Sophisticated Call to Action */
.hero-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 0;
}

.hero-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.2rem 3rem;
  border: none;
  border-radius: 50px;
  font-family: "Inter", sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  text-decoration: none;
  backdrop-filter: blur(20px);
  letter-spacing: 0.5px;
}

.hero-button.animate-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.primary-button {
  background: linear-gradient(135deg, #0056b3 0%, #003d82 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 86, 179, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.primary-button:hover {
  background: linear-gradient(135deg, #004a9f 0%, #003570 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 86, 179, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.25);
}

.primary-button:active {
  transform: translateY(-1px) scale(1.01);
}

.button-text {
  position: relative;
  z-index: 2;
}

/* Responsive Design */
@media (min-width: 1400px) {
  .content-wrapper {
    padding: 5rem 4rem;
  }

  .logo-container {
    gap: 3rem;
  }

  .main-logo {
    height: 90px;
  }

  .tourism-logo {
    height: 80px;
  }

  .pemkab-logo {
    height: 75px;
  }

  .hero-title {
    font-size: 4.5rem;
  }

  .hero-tagline {
    font-size: 1.7rem;
  }
}

@media (max-width: 1200px) {
  .content-wrapper {
    padding: 3rem 2.5rem;
  }

  .logo-container {
    gap: 2rem;
  }
}

@media (max-width: 992px) {
  .hero-content {
    max-width: 900px;
    padding: 0 1.5rem;
  }

  .content-wrapper {
    padding: 2.5rem 2rem;
  }

  .logo-container {
    gap: 1.5rem;
  }

  .main-logo {
    height: 70px;
  }

  .tourism-logo {
    height: 60px;
  }

  .pemkab-logo {
    height: 55px;
  }

  .hero-title {
    font-size: clamp(2.2rem, 5vw, 3.2rem);
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 100vh;
    min-height: 600px;
  }

  .content-wrapper {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
    border-radius: 20px;
  }

  .logo-container {
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .main-logo {
    height: 60px;
  }

  .tourism-logo {
    height: 50px;
  }

  .pemkab-logo {
    height: 45px;
  }

  .hero-title {
    font-size: clamp(2rem, 6vw, 2.8rem);
    margin-bottom: 1.5rem;
  }

  .hero-tagline {
    font-size: clamp(1.1rem, 3vw, 1.3rem);
    margin-bottom: 2.5rem;
  }

  .hero-button {
    padding: 1.2rem 2.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 1.5rem 1rem;
    margin: 0 0.5rem;
  }

  .logo-container {
    flex-direction: column;
    gap: 0.8rem;
  }

  .main-logo {
    height: 50px;
  }

  .tourism-logo {
    height: 45px;
  }

  .pemkab-logo {
    height: 40px;
  }

  .hero-title {
    font-size: clamp(1.8rem, 8vw, 2.4rem);
    line-height: 1.3;
  }

  .hero-tagline {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .hero-button {
    padding: 1rem 2rem;
    width: 100%;
    max-width: 280px;
  }

  .carousel-slide {
    transform: scale(1.1);
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .carousel-slide {
    transition: none;
  }

  .title-text,
  .title-emphasis,
  .hero-tagline,
  .hero-button,
  .logo-section {
    animation: none;
    transition: opacity 0.3s ease;
  }
}

/* Performance Optimizations */
.hero-section * {
  will-change: transform, opacity;
}

.carousel-slide {
  will-change: opacity;
}

.logo-container img {
  will-change: transform;
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .content-wrapper {
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid rgba(255, 255, 255, 0.8);
  }

  .hero-button {
    border-width: 3px;
  }

  .hero-overlay {
    background: rgba(0, 0, 0, 0.8);
  }
}

/* Print Styles */
@media print {
  .hero-section {
    background: #0056b3;
    color: white;
    height: auto;
    padding: 2rem;
  }

  .hero-background,
  .hero-overlay {
    display: none;
  }

  .content-wrapper {
    background: white;
    color: #0056b3;
    border: 2px solid #0056b3;
  }

  .logo-container img {
    filter: grayscale(1);
  }
}
</style>
