<template>
  <div class="home-view">
    <main>
      <HeroSection />
      <CarouselDestinasi />
      <KebudayaanHero />
      <EventSection />
      <EkonimiKreatifSection />
      <FeaturedPrograms />
      <NewsGrid />
      <GallerySection />
      <SocialMediaGrid />
      <GisMapSection />
    </main>
  </div>
</template>

<script setup>
// Mengimpor semua komponen yang diperlukan secara langsung
import HeroSection from "../components/home/HeroSection.vue";
import FeaturedPrograms from "../components/home/FeaturedPrograms.vue";
import NewsGrid from "../components/home/NewsGrid.vue";
import GallerySection from "../components/home/GallerySection.vue";
import SocialMediaGrid from "../components/home/SocialMediaGrid.vue";
import GisMapSection from "../components/home/GisMapSection.vue";
import CarouselDestinasi from "../components/home/CarouselDestinasi.vue";
import KebudayaanHero from "../components/home/KebudayaanHero.vue";
import EventSection from "../components/home/EventSection.vue";
import EkonimiKreatifSection from "../components/home/EkonimiKreatifSection.vue";
// Catatan: Anda tidak perlu mengimpor TrendingNews dan InstagramCard lagi
// karena keduanya sudah menjadi bagian dari NewsGrid.vue

</script>

<style scoped>
/* Gaya CSS untuk tata letak halaman utama */
.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 80px; /* Padding untuk navbar fixed */
  background-color: var(--off-white);
  color: var(--text-color-dark);
}

main {
  flex-grow: 1;
}
</style>