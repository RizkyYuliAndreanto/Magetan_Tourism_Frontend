<template>
  <section class="trending-news-section">
    <h2 class="section-title">Berita Pilihan Terkini</h2>
    <div class="trending-news-grid">
      <div v-for="news in trendingNews" :key="news.id" class="news-card">
        <img :src="news.image" :alt="news.title" class="news-image">
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
import { ref } from 'vue';

const trendingNews = ref([
  { id: 1, title: 'Inovasi Petani Lokal Gairahkan Sektor Pertanian Magetan', image: 'https://source.unsplash.com/random/400x300?agriculture,magetan', date: '2 jam yang lalu', source: 'detikJatim' },
  { id: 2, title: 'Festival Budaya Lereng Lawu Berlangsung Meriah', image: 'https://source.unsplash.com/random/400x300?culture-festival', date: '5 jam yang lalu', source: 'detikJatim' },
  { id: 3, title: 'Ekonomi Kreatif UMKM Tumbuh Pesat Berkat Dukungan Pemerintah', image: 'https://source.unsplash.com/random/400x300?creative-economy', date: 'Kemarin', source: 'detikEkonomi' },
]);
</script>

<style scoped>
.trending-news-section {
  padding: 60px 20px;
  background-color: var(--off-white);
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
}

.trending-news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.news-card {
  background-color: var(--pure-white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
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