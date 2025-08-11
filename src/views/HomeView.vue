<template>
  <div class="home-view">
    <HeroSection />

    <section class="features-section">
      <h2 class="section-title">Why Choose Us?</h2>
      <div class="features-grid">
        <div class="feature-item">
          <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <h3 class="feature-title">Thrilling Expeditions</h3>
          <p class="feature-description">
            From challenging mountain climbs to serene jungle treks, we offer adventures for every spirit.
          </p>
        </div>
        <div class="feature-item">
          <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292V15l-2 2v4h4v-4l-2-2V9.646z"></path></svg>
          <h3 class="feature-title">Experienced Guides</h3>
          <p class="feature-description">
            Our certified guides ensure your safety and enrich your journey with their expertise.
          </p>
        </div>
        <div class="feature-item">
          <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10v11h18V10M3 10l9-7 9 7M3 10h18"></path></svg>
          <h3 class="feature-title">Unforgettable Memories</h3>
          <p class="feature-description">
            We craft unique itineraries that promise breathtaking views and lasting memories.
          </p>
        </div>
      </div>
    </section>

    <section class="gallery-section">
      <h2 class="section-title">Our Photo Gallery</h2>
      <div class="gallery-grid">
        <img src="https://source.unsplash.com/random/400x300?mountain,trek" alt="Gallery Image 1" class="gallery-image">
        <img src="https://source.unsplash.com/random/400x300?forest,river" alt="Gallery Image 2" class="gallery-image">
        <img src="https://source.unsplash.com/random/400x300?ocean,island" alt="Gallery Image 3" class="gallery-image">
        <img src="https://source.unsplash.com/random/400x300?desert,sunrise" alt="Gallery Image 4" class="gallery-image">
        <img src="https://source.unsplash.com/random/400x300?snow,peak" alt="Gallery Image 5" class="gallery-image">
        <img src="https://source.unsplash.com/random/400x300?canyon,adventure" alt="Gallery Image 6" class="gallery-image">
      </div>
    </section>

    <SocialMediaSection />

    <GisMapSection />
  </div>
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue';
import SocialMediaSection from '../components/SocialMediaSection.vue'; // Import komponen baru
import GisMapSection from '../components/GisMapSection.vue';       // Import komponen baru
</script>

<style scoped>
/* Variabel CSS sudah dipindahkan ke style.css global */

.home-view {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding-top: 80px; /* Padding untuk navbar fixed */
    background-color: var(--off-white);
    color: var(--text-color-dark);
}

/* Features Section (Gaya yang sudah ada dan tidak berubah) */
.features-section {
    padding: 80px 20px;
    background-color: var(--pure-white);
    text-align: center;
}

.section-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 60px;
    color: var(--text-color-dark);
}

.features-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
}

.feature-item {
    background-color: var(--off-white);
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 8px 20px var(--box-shadow-light);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-item:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px var(--box-shadow-medium);
}

.feature-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 30px auto;
    color: var(--primary-blue);
}

.feature-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 15px;
    color: var(--text-color-dark);
}

.feature-description {
    font-size: 1rem;
    color: var(--text-color-muted);
    line-height: 1.6;
}

/* Gallery Section (Gaya yang sudah ada dan tidak berubah) */
.gallery-section {
    padding: 80px 20px;
    background-color: var(--pure-white);
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.gallery-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 5px 15px var(--box-shadow-light);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.gallery-image:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 25px var(--box-shadow-medium);
}

/* ----- Responsive Media Queries for HomeView ----- */
/* Media queries di HomeView hanya untuk features dan gallery grid. */

/* Tablet (menengah) */
@media screen and (min-width: 768px) {
    .features-grid {
        grid-template-columns: 1fr 1fr;
    }
    .gallery-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
}

/* Desktop (besar) */
@media screen and (min-width: 1024px) {
    .features-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    .gallery-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
}
</style>