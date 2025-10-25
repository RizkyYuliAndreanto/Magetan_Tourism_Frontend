<template>
  <section class="news-and-features-section">
    <div class="news-features-grid">
      <div class="trending-news-container">
        <h2 class="section-title">Berita Pilihan Terkini</h2>
        <div class="trending-news-grid">
          <div v-for="news in trendingNews" :key="news.id" class="news-card">
            <img :src="news.image" :alt="news.title" class="news-image" />
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
            <svg
              class="feature-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <h3 class="feature-title">Pariwisata</h3>
            <p class="feature-description">
              Menjelajahi keindahan alam Magetan, dari pegunungan hingga danau
              yang memukau.
            </p>
          </div>
          <div class="feature-item">
            <svg
              class="feature-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 4.354a4 4 0 110 5.292V15l-2 2v4h4v-4l-2-2V9.646z"></path>
            </svg>
            <h3 class="feature-title">Kebudayaan</h3>
            <p class="feature-description">
              Menggali dan melestarikan kekayaan budaya dan tradisi lokal yang
              unik dan otentik.
            </p>
          </div>
          <div class="feature-item">
            <svg
              class="feature-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M3 10v11h18V10M3 10l9-7 9 7M3 10h18"></path>
            </svg>
            <h3 class="feature-title">Ekonomi Kreatif</h3>
            <p class="feature-description">
              Mendukung UMKM lokal untuk tumbuh dan berinovasi, menciptakan
              produk unggulan khas Magetan.
            </p>
          </div>
        </div>
      </div>
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
  --premium-sky: #60a5fa;
  --gold-accent: #d4af37;
  --pearl-white: #ffffff;
  --ivory-white: #f8f9fa;
  --soft-gray: #e2e8f0;
  --charcoal: #374151;
  --premium-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
  --gold-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.news-and-features-section {
  padding: 80px 32px;
  background: linear-gradient(
    135deg,
    #f8fafc 0%,
    #e0f2fe 25%,
    #bae6fd 50%,
    #7dd3fc 75%,
    #38bdf8 100%
  );
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.news-features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
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
  background: linear-gradient(
    135deg,
    var(--pearl-white) 0%,
    var(--ivory-white) 100%
  );
  padding: 48px;
  border-radius: 20px;
  box-shadow: var(--premium-shadow);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-align: center;
  border: 1px solid rgba(212, 175, 55, 0.2);
  position: relative;
  overflow: hidden;
}

.feature-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 60px rgba(30, 58, 138, 0.25);
  border-color: var(--gold-accent);
}

.feature-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(212, 175, 55, 0.03) 0%,
    transparent 50%
  );
  z-index: 1;
  pointer-events: none;
}

.feature-item > * {
  position: relative;
  z-index: 2;
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
