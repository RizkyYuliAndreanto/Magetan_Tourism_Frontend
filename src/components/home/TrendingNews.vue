<template>
  <section class="trending-news-section">
    <h2 class="section-title">Berita Pilihan Terkini</h2>
    <div class="trending-news-grid">
      <div v-for="news in trendingNews" :key="news.id" class="news-card">
        <img :src="news.image" :alt="news.title" class="news-image" />
        <div class="news-content">
          <h3 class="news-title">{{ news.title }}</h3>
          <p class="news-meta">{{ news.date }} - {{ news.source }}</p>
        </div>
      </div>

      <slot name="social-media-embed"></slot>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const trendingNews = ref([
  {
    id: 1,
    title: "Inovasi Petani Lokal Gairahkan Sektor Pertanian Magetan",
    image: "https://source.unsplash.com/random/400x300?agriculture,magetan",
    date: "2 jam yang lalu",
    source: "detikJatim",
  },
  {
    id: 2,
    title: "Festival Budaya Lereng Lawu Berlangsung Meriah",
    image: "https://source.unsplash.com/random/400x300?culture-festival",
    date: "5 jam yang lalu",
    source: "detikJatim",
  },
  {
    id: 3,
    title: "Ekonomi Kreatif UMKM Tumbuh Pesat Berkat Dukungan Pemerintah",
    image: "https://source.unsplash.com/random/400x300?creative-economy",
    date: "Kemarin",
    source: "detikEkonomi",
  },
]);
</script>

<style scoped>
/* ===== CONSISTENT COLOR VARIABLES ===== */
:root {
  --royal-blue: #1e3a8a;
  --premium-azure: #3b82f6;
  --gold-accent: #d4af37;
  --pearl-white: #ffffff;
  --ivory-white: #f8f9fa;
  --charcoal: #374151;
  --premium-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
}

.trending-news-section {
  padding: 80px 32px;
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    #fefefe 15%,
    #f8fafe 35%,
    #f0f6fe 60%,
    #e8f2fe 80%,
    rgba(30, 58, 138, 0.08) 100%
  );
  position: relative;
  overflow: hidden;
}

.section-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
  color: var(--royal-blue);
  text-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
  font-family: "Playfair Display", serif;
  letter-spacing: -1px;
}

.trending-news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.news-card {
  background-color: var(--pearl-white);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--premium-shadow);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.news-card:hover {
  transform: translateY(-8px);
}

.news-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.news-content {
  padding: 20px;
}

.news-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.news-meta {
  font-size: 0.85rem;
  color: var(--text-color-muted);
}
</style>
