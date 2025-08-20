<template>
  <section class="news-and-features-section">
    <div class="news-features-grid">
      <div class="trending-news-container">
        <h2 class="section-title">Berita Pilihan Terkini</h2>
        <div class="trending-news-grid">
          <div v-for="news in trendingNews" :key="news.id" class="news-card">
            <img :src="news.image" :alt="news.title" class="news-image">
            <div class="news-content">
              <h3 class="news-title">{{ news.title }}</h3>
              <p class="news-meta">{{ news.date }} - {{ news.source }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="features-container">
        <h2 class="section-title">Program Unggulan</h2>
        <div class="features-grid">
          <div class="feature-item">
            <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <h3 class="feature-title">Pariwisata</h3>
            <p class="feature-description">
              Menjelajahi keindahan alam Magetan, dari pegunungan hingga danau yang memukau.
            </p>
          </div>
          <div class="feature-item">
            <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292V15l-2 2v4h4v-4l-2-2V9.646z"></path></svg>
            <h3 class="feature-title">Kebudayaan</h3>
            <p class="feature-description">
              Menggali dan melestarikan kekayaan budaya dan tradisi lokal yang unik dan otentik.
            </p>
          </div>
          <div class="feature-item">
            <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10v11h18V10M3 10l9-7 9 7M3 10h18"></path></svg>
            <h3 class="feature-title">Ekonomi Kreatif</h3>
            <p class="feature-description">
              Mendukung UMKM lokal untuk tumbuh dan berinovasi, menciptakan produk unggulan khas Magetan.
            </p>
          </div>
        </div>
      </div>
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
.news-and-features-section {
  padding: 60px 20px;
  background-color: var(--off-white);
  max-width: 1300px;
  margin: 0 auto;
}

.news-features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
}

/* Trending News */
.trending-news-container {
  grid-column: span 1;
}

.trending-news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
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

/* Feature Cards */
.features-container {
  grid-column: span 1;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.feature-item {
  background-color: var(--pure-white);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 20px var(--box-shadow-light);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
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
}

.feature-description {
  font-size: 1rem;
  color: var(--text-color-muted);
  line-height: 1.6;
}

/* Responsif */
@media screen and (min-width: 768px) {
  .news-features-grid {
    grid-template-columns: 2fr 1fr;
  }
  .section-title {
    text-align: left;
  }
}
</style>