<template>
  <div class="home-view">
    <main>
      <HeroSection />
      <CarouselDestinasi />
      <KebudayaanHero />
      <EventSection />
      <EkonomiKreatifSection />
      <NewsGrid />
      <GallerySection />
      <SocialMediaGrid />
      <GisMapSection />
    </main>
  </div>
</template>

<script setup>
import HeroSection from "../components/home/HeroSection.vue";
import NewsGrid from "../components/home/NewsGrid.vue";
import GallerySection from "../components/home/GallerySection.vue";
import SocialMediaGrid from "../components/home/SocialMediaGrid.vue";
import GisMapSection from "../components/home/GisMapSection.vue";
import CarouselDestinasi from "../components/home/CarouselDestinasi.vue";
import KebudayaanHero from "../components/home/KebudayaanHero.vue";
import EventSection from "../components/home/EventSection.vue";
import EkonomiKreatifSection from "../components/home/EkonomiKreatifSection.vue";
</script>

<style scoped>
.home-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #e0f2fe 50%, #bae6fd 100%);
  color: var(--text-color-dark);
}

main {
  flex: 1;
  position: relative;
}

main > * {
  position: relative;
}

main > *:not(:first-child) {
  margin-top: 0;
}
</style>
/* Smooth section transitions */
