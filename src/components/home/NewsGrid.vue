<template>
  <section class="news-grid-section">
    <div class="main-news-grid">
      <!-- Trending News -->
      <div>
        <div class="section-title">
          <span class="section-title-text">TRENDING NEWS</span>
          <span class="section-title-line"></span>
        </div>
        <div class="trending-grid">
          <div class="news-popular-card">
            <img
              :src="popularNews.image"
              :alt="popularNews.title"
              class="news-image" />
            <div class="news-content">
              <h3 class="card-subtitle">Berita Paling Populer</h3>
              <h2 class="news-title">{{ popularNews.title }}</h2>
              <p class="news-meta">
                {{ popularNews.date }} - {{ popularNews.source }}
              </p>
            </div>
          </div>
          <div class="trending-cards">
            <div
              v-for="news in trendingNews"
              :key="news.id"
              class="news-card-item trending-card">
              <img :src="news.image" :alt="news.title" class="card-image" />
              <div class="card-content">
                <h4 class="card-title-small">{{ news.title }}</h4>
                <p class="card-meta-small">
                  {{ news.date }} - {{ news.source }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Latest News & Instagram -->
      <div>
        <div class="section-title latest">
          <span class="section-title-text active">LATEST NEWS</span>
          <span class="section-title-line"></span>
        </div>
        <div class="latest-instagram-grid">
          <div class="latest-news-cards">
            <div class="card-subtitle" style="display: none">
              Berita Terbaru
            </div>
            <div class="latest-news-subgrid">
              <div
                v-for="news in latestNews"
                :key="news.id"
                class="news-card-item">
                <img :src="news.image" :alt="news.title" class="card-image" />
                <div class="card-content">
                  <h4 class="card-title-small">{{ news.title }}</h4>
                  <p class="card-meta-small">
                    {{ news.date }} - {{ news.source }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="instagram-card-wrapper">
            <blockquote
              class="instagram-media"
              data-instgrm-captioned
              data-instgrm-permalink="https://www.instagram.com/p/DNPM5_zvp5w/?utm_source=ig_embed&amp;utm_campaign=loading"
              data-instgrm-version="14"></blockquote>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const popularNews = ref({
  id: 1,
  title:
    "Danau Sarangan Kembali Dibuka untuk Wisatawan, Simak Aturan Terbarunya!",
  image: "https://source.unsplash.com/random/800x600?sarangan-lake",
  date: "1 jam yang lalu",
  source: "detikTravel",
});

const trendingNews = ref([
  {
    id: 2,
    title: "Inovasi Petani Lokal Gairahkan Sektor Pertanian Magetan",
    image: "https://source.unsplash.com/random/400x300?agriculture,magetan",
    date: "2 jam yang lalu",
    source: "detikJatim",
  },
  {
    id: 3,
    title: "Festival Budaya Lereng Lawu Berlangsung Meriah",
    image: "https://source.unsplash.com/random/400x300?culture-festival",
    date: "5 jam yang lalu",
    source: "detikJatim",
  },
  {
    id: 4,
    title: "Ekonomi Kreatif UMKM Tumbuh Pesat Berkat Dukungan Pemerintah",
    image: "https://source.unsplash.com/random/400x300?creative-economy",
    date: "Kemarin",
    source: "detikEkonomi",
  },
  {
    id: 9,
    title: "Wisata Alam Magetan Makin Diminati",
    image: "https://source.unsplash.com/random/400x300?nature,magetan",
    date: "Hari ini",
    source: "Magetan News",
  },
]);

const latestNews = ref([
  {
    id: 5,
    title: "Tari Tradisional Baru Memukau Warga Magetan",
    image: "https://source.unsplash.com/random/400x300?traditional-dance",
    date: "10 menit yang lalu",
    source: "Magetan News",
  },
  {
    id: 6,
    title: "Peluncuran Aplikasi Wisata Magetan",
    image: "https://source.unsplash.com/random/400x300?mobile-app",
    date: "20 menit yang lalu",
    source: "Info Magetan",
  },
  {
    id: 7,
    title: "Peningkatan Infrastruktur Jalan Menuju Destinasi",
    image: "https://source.unsplash.com/random/400x300?road-construction",
    date: "30 menit yang lalu",
    source: "Dinas PU",
  },
  {
    id: 8,
    title: "Rangkaian Acara Hut Kabupaten Magetan",
    image: "https://source.unsplash.com/random/400x300?celebration",
    date: "45 menit yang lalu",
    source: "Magetan Official",
  },
  {
    id: 10,
    title: "Magetan Raih Penghargaan Pariwisata",
    image: "https://source.unsplash.com/random/400x300?award",
    date: "1 jam yang lalu",
    source: "Magetan Official",
  },
  {
    id: 11,
    title: "Kuliner Khas Magetan Jadi Primadona",
    image: "https://source.unsplash.com/random/400x300?culinary",
    date: "2 jam yang lalu",
    source: "Kuliner Magetan",
  },
]);

onMounted(() => {
  const instagramScript = document.createElement("script");
  instagramScript.async = true;
  instagramScript.src = "//www.instagram.com/embed.js";
  document.head.appendChild(instagramScript);
  if (window.instgrm) {
    window.instgrm.Embeds.process();
  }
});
</script>

<style scoped>
.news-grid-section {
  padding: 40px 20px;
  background-color: #fff;
  max-width: 1200px;
  margin: 0 auto;
}

.main-news-grid {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Trending News Grid */
.trending-grid {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 24px;
  align-items: stretch;
  margin-bottom: 0;
}

.news-popular-card {
  background-color: #f4f4f4;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
.news-popular-card .news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.news-popular-card .news-content {
  position: relative;
  z-index: 2;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.1));
  color: #fff;
  padding: 24px;
  border-radius: 0 0 12px 12px;
}
.news-popular-card .news-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #fff;
}
.news-popular-card .card-subtitle,
.news-popular-card .news-meta {
  color: #fff;
  font-size: 1rem;
  margin-bottom: 4px;
}

/* Trending Cards */
.trending-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 18px;
}
.trending-card {
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;
  min-height: 120px;
}
.trending-card:hover {
  transform: translateY(-5px);
}
.trending-card .card-image {
  width: 100%;
  height: 90px;
  object-fit: cover;
}
.trending-card .card-content {
  padding: 10px;
}
.trending-card .card-title-small {
  font-size: 1rem;
  font-weight: bold;
}
.trending-card .card-meta-small {
  font-size: 0.75rem;
  color: #888;
}

/* Latest News & Instagram Grid */
.latest-instagram-grid {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 24px;
  align-items: stretch;
}

/* Latest News Cards */
.latest-news-cards {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 18px;
  display: flex;
  flex-direction: column;
}
.latest-news-cards .card-subtitle {
  font-weight: 600;
  font-size: 1.1rem;
  color: #222;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.latest-news-subgrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(3, 1fr);
  gap: 14px;
}
.news-card-item {
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease;
  min-height: 100px;
}
.news-card-item:hover {
  transform: translateY(-5px);
}
.card-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
}
.card-content {
  padding: 8px;
}
.card-title-small {
  font-size: 0.95rem;
  font-weight: bold;
}
.card-meta-small {
  font-size: 0.75rem;
  color: #888;
}

/* Instagram Card */
.instagram-card-wrapper {
  background-color: #f4f4f4;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  min-height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
 
}
:deep(.instagram-media) {
  width: 300px !important;
  height: 600px !important;
  margin: 0 !important;
  object-fit: contain;
}

/* Section Title */
.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  margin-top  : 0;
}
.section-title-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111;
  letter-spacing: 1px;
  margin-right: 12px;
  position: relative;
  z-index: 2;
  background: #fff;
  padding-bottom: 2px;
}
.section-title-line {
  flex: 1;
  height: 4px;
  background: #111;
  border-radius: 2px;
  margin-left: 0;
  margin-top: 0.2em;
  z-index: 1;
}
.section-title-text.active {
  color: #111;
  padding-bottom: 0;
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .main-news-grid,
  .trending-grid,
  .latest-instagram-grid {
    display: block;
  }
  .trending-cards,
  .latest-news-subgrid {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
  .instagram-card-wrapper {
    min-height: 220px;
    margin-top: 20px;
  }
}
@media screen and (max-width: 600px) {
  .news-grid-section {
    padding: 10px;
  }
  .news-popular-card .news-content {
    padding: 12px;
  }
  .latest-news-cards {
    padding: 10px;
  }
  .instagram-card-wrapper {
    min-height: 180px;
  }
}
</style>
