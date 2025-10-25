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
// Mengimpor semua komponen yang diperlukan secara langsung
import HeroSection from "../components/home/HeroSection.vue";
import NewsGrid from "../components/home/NewsGrid.vue";
import GallerySection from "../components/home/GallerySection.vue";
import SocialMediaGrid from "../components/home/SocialMediaGrid.vue";
import GisMapSection from "../components/home/GisMapSection.vue";
import CarouselDestinasi from "../components/home/CarouselDestinasi.vue";
import KebudayaanHero from "../components/home/KebudayaanHero.vue";
import EventSection from "../components/home/EventSection.vue";
import EkonomiKreatifSection from "../components/home/EkonomiKreatifSection.vue";
import { onMounted } from "vue";

// Catatan: Anda tidak perlu mengimpor TrendingNews dan InstagramCard lagi
// karena keduanya sudah menjadi bagian dari NewsGrid.vue

onMounted(() => {
  // Debug scroll issues
  console.log("HomeView mounted - Debug Scroll");
  console.log("document.body.overflow:", document.body.style.overflow);
  console.log(
    "html overflow-y:",
    window.getComputedStyle(document.documentElement).overflowY
  );
  console.log(
    "body overflow-y:",
    window.getComputedStyle(document.body).overflowY
  );
  console.log("document height:", document.documentElement.scrollHeight);
  console.log("window innerHeight:", window.innerHeight);
});
</script>

<style scoped>
/* Gaya CSS untuk tata letak halaman utama */
.home-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 60px;
  background: linear-gradient(180deg, #f8fafc 0%, #e0f2fe 50%, #bae6fd 100%);
  color: var(--text-color-dark);
  overflow-y: auto;
}

main {
  flex-grow: 1;
  position: relative;
}

/* Smooth section transitions */
main > * {
  position: relative;
  z-index: 1;
}

/* Ensure seamless flow between sections */
main > *:not(:first-child) {
  margin-top: 0;
}
</style>
