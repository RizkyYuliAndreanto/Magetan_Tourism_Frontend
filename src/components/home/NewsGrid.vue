<template>
  <section class="news-grid-section">
    <div class="main-news-grid">
      <div v-if="loading" class="no-data-message">Memuat berita...</div>
      <div v-else-if="error" class="no-data-message" style="color: #e53e3e">
        {{ error }}
      </div>
      <template v-else>
        <!-- Trending Informasi -->
        <div>
          <div class="section-title">
            <span class="section-title-text">INFORMASI TRENDING</span>
            <span class="section-title-line"></span>
          </div>
          <div class="trending-grid">
            <div v-if="popularNews" class="news-popular-card">
              <img
                :src="getImageUrl(popularNews.gambar_hero_berita)"
                :alt="popularNews.judul"
                class="news-image" />
              <div class="news-content">
                <h3 class="card-subtitle">Informasi Paling Populer</h3>
                <h2 class="news-title">{{ popularNews.judul }}</h2>
                <p class="news-meta">
                  {{ formatDate(popularNews.tanggal_publikasi) }} -
                  {{ popularNews.kategoriBerita?.nama_kategori || "Informasi" }}
                </p>
              </div>
            </div>
            <div class="trending-cards">
              <div
                v-for="news in trendingNews"
                :key="news.id_berita"
                class="news-card-item trending-card">
                <img
                  :src="getImageUrl(news.gambar_hero_berita)"
                  :alt="news.judul"
                  class="card-image" />
                <div class="card-content">
                  <h4 class="card-title-small">{{ news.judul }}</h4>
                  <p class="card-meta-small">
                    {{ formatDate(news.tanggal_publikasi) }} -
                    {{ news.kategoriBerita?.nama_kategori || "Informasi" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Latest Informasi & Instagram -->
        <div>
          <div class="section-title latest">
            <span class="section-title-text active">INFORMASI TERBARU</span>
            <span class="section-title-line"></span>
          </div>
          <div class="latest-instagram-grid">
            <div class="latest-news-cards">
              <div class="card-subtitle">Informasi Terbaru</div>
              <div class="latest-news-subgrid">
                <div
                  v-for="news in latestNews"
                  :key="news.id_berita"
                  class="news-card-item">
                  <img
                    :src="getImageUrl(news.gambar_hero_berita)"
                    :alt="news.judul"
                    class="card-image" />
                  <div class="card-content">
                    <h4 class="card-title-small">{{ news.judul }}</h4>
                    <p class="card-meta-small">
                      {{ formatDate(news.tanggal_publikasi) }} -
                      {{ news.kategoriBerita?.nama_kategori || "Informasi" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="instagram-card-wrapper">
              <blockquote
                class="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink="https://www.instagram.com/p/DN2bK3p3lv1/?utm_source=ig_embed&amp;utm_campaign=loading"
                data-instgrm-version="14"
                style="
                  background: #fff;
                  border: 0;
                  border-radius: 3px;
                  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5),
                    0 1px 10px 0 rgba(0, 0, 0, 0.15);
                  margin: 1px;
                  max-width: 540px;
                  min-width: 326px;
                  padding: 0;
                  width: 99.375%;
                  width: -webkit-calc(100% - 2px);
                  width: calc(100% - 2px);
                ">
                <div style="padding: 16px">
                  <a
                    href="https://www.instagram.com/p/DN2bK3p3lv1/?utm_source=ig_embed&amp;utm_campaign=loading"
                    style="
                      background: #ffffff;
                      line-height: 0;
                      padding: 0 0;
                      text-align: center;
                      text-decoration: none;
                      width: 100%;
                    "
                    target="_blank">
                    <div
                      style="
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                      ">
                      <div
                        style="
                          background-color: #f4f4f4;
                          border-radius: 50%;
                          flex-grow: 0;
                          height: 40px;
                          margin-right: 14px;
                          width: 40px;
                        "></div>
                      <div
                        style="
                          display: flex;
                          flex-direction: column;
                          flex-grow: 1;
                          justify-content: center;
                        ">
                        <div
                          style="
                            background-color: #f4f4f4;
                            border-radius: 4px;
                            flex-grow: 0;
                            height: 14px;
                            margin-bottom: 6px;
                            width: 100px;
                          "></div>
                        <div
                          style="
                            background-color: #f4f4f4;
                            border-radius: 4px;
                            flex-grow: 0;
                            height: 14px;
                            width: 60px;
                          "></div>
                      </div>
                    </div>
                    <div style="padding: 19% 0"></div>
                    <div
                      style="
                        display: block;
                        height: 50px;
                        margin: 0 auto 12px;
                        width: 50px;
                      ">
                      <svg
                        width="50px"
                        height="50px"
                        viewBox="0 0 60 60"
                        version="1.1"
                        xmlns="https://www.w3.org/2000/svg"
                        xmlns:xlink="https://www.w3.org/1999/xlink">
                        <g
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd">
                          <g
                            transform="translate(-511.000000, -20.000000)"
                            fill="#000000">
                            <g>
                              <path
                                d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
                    <div style="padding-top: 8px">
                      <div
                        style="
                          color: #3897f0;
                          font-family: Arial, sans-serif;
                          font-size: 14px;
                          font-style: normal;
                          font-weight: 550;
                          line-height: 18px;
                        ">
                        View this post on Instagram
                      </div>
                    </div>
                    <div style="padding: 12.5% 0"></div>
                    <div
                      style="
                        display: flex;
                        flex-direction: row;
                        margin-bottom: 14px;
                        align-items: center;
                      ">
                      <div>
                        <div
                          style="
                            background-color: #f4f4f4;
                            border-radius: 50%;
                            height: 12.5px;
                            width: 12.5px;
                            transform: translateX(0px) translateY(7px);
                          "></div>
                        <div
                          style="
                            background-color: #f4f4f4;
                            height: 12.5px;
                            transform: rotate(-45deg) translateX(3px)
                              translateY(1px);
                            width: 12.5px;
                            flex-grow: 0;
                            margin-right: 14px;
                            margin-left: 2px;
                          "></div>
                        <div
                          style="
                            background-color: #f4f4f4;
                            border-radius: 50%;
                            height: 12.5px;
                            width: 12.5px;
                            transform: translateX(9px) translateY(-18px);
                          "></div>
                      </div>
                      <div style="margin-left: 8px">
                        <div
                          style="
                            background-color: #f4f4f4;
                            border-radius: 50%;
                            flex-grow: 0;
                            height: 20px;
                            width: 20px;
                          "></div>
                        <div
                          style="
                            width: 0;
                            height: 0;
                            border-top: 2px solid transparent;
                            border-left: 6px solid #f4f4f4;
                            border-bottom: 2px solid transparent;
                            transform: translateX(16px) translateY(-4px)
                              rotate(30deg);
                          "></div>
                      </div>
                      <div style="margin-left: auto">
                        <div
                          style="
                            width: 0px;
                            border-top: 8px solid #f4f4f4;
                            border-right: 8px solid transparent;
                            transform: translateY(16px);
                          "></div>
                        <div
                          style="
                            background-color: #f4f4f4;
                            flex-grow: 0;
                            height: 12px;
                            width: 16px;
                            transform: translateY(-4px);
                          "></div>
                        <div
                          style="
                            width: 0;
                            height: 0;
                            border-top: 8px solid #f4f4f4;
                            border-left: 8px solid transparent;
                            transform: translateY(-4px) translateX(8px);
                          "></div>
                      </div>
                    </div>
                    <div
                      style="
                        display: flex;
                        flex-direction: column;
                        flex-grow: 1;
                        justify-content: center;
                        margin-bottom: 24px;
                      ">
                      <div
                        style="
                          background-color: #f4f4f4;
                          border-radius: 4px;
                          flex-grow: 0;
                          height: 14px;
                          margin-bottom: 6px;
                          width: 224px;
                        "></div>
                      <div
                        style="
                          background-color: #f4f4f4;
                          border-radius: 4px;
                          flex-grow: 0;
                          height: 14px;
                          width: 144px;
                        "></div></div
                  ></a>
                  <p
                    style="
                      color: #c9c8cd;
                      font-family: Arial, sans-serif;
                      font-size: 14px;
                      line-height: 17px;
                      margin-bottom: 0;
                      margin-top: 8px;
                      overflow: hidden;
                      padding: 8px 0 7px;
                      text-align: center;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    ">
                    <a
                      href="https://www.instagram.com/p/DN2bK3p3lv1/?utm_source=ig_embed&amp;utm_campaign=loading"
                      style="
                        color: #c9c8cd;
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: normal;
                        line-height: 17px;
                        text-decoration: none;
                      "
                      target="_blank"
                      >A post shared by Dinas Kebudayaan dan Pariwisata
                      (@magetantourism)</a
                    >
                  </p>
                </div>
              </blockquote>
            </div>
          </div>

          <!-- View More Button -->
          <div class="view-more-section">
            <button @click="viewMoreNews" class="view-more-btn">
              <span class="view-more-text">Lihat Semua Informasi</span>
              <svg
                class="view-more-arrow"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
              </svg>
            </button>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";
const router = useRouter();
const beritaList = ref([]);
const popularNews = ref(null);
const trendingNews = ref([]);
const latestNews = ref([]);
const loading = ref(true);
const error = ref(null);

function getImageUrl(path) {
  if (!path) return "https://via.placeholder.com/800x600?text=No+Image";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}

function formatDate(dateString) {
  if (!dateString) return "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  return d.toLocaleDateString("id-ID", options);
}

// Load Instagram embed script
const loadInstagramEmbed = () => {
  if (!window.instgrm) {
    const script = document.createElement("script");
    script.async = true;
    script.src = "//www.instagram.com/embed.js";
    document.head.appendChild(script);
  } else {
    // If already loaded, process embeds
    window.instgrm.Embeds.process();
  }
};

const fetchBerita = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/berita`);
    const data = response.data;
    beritaList.value = data;
    // Populer: berita dengan jumlah_dilihat terbanyak
    const sortedByViews = [...data].sort(
      (a, b) => (b.jumlah_dilihat || 0) - (a.jumlah_dilihat || 0)
    );
    popularNews.value = sortedByViews[0] || null;
    // Trending: 4 berita terbaru setelah populer
    const sortedByDate = [...data].sort(
      (a, b) => new Date(b.tanggal_publikasi) - new Date(a.tanggal_publikasi)
    );
    trendingNews.value = sortedByDate
      .filter((b) => b.id_berita !== popularNews.value?.id_berita)
      .slice(0, 4);
    // Terbaru: sisanya
    latestNews.value = sortedByDate.filter(
      (b) =>
        b.id_berita !== popularNews.value?.id_berita &&
        !trendingNews.value.map((t) => t.id_berita).includes(b.id_berita)
    );
  } catch (err) {
    error.value = "Gagal memuat data berita dari server.";
    console.error("Kesalahan API:", err);
  } finally {
    loading.value = false;
    // Load Instagram embed after component is loaded
    setTimeout(loadInstagramEmbed, 100);
  }
};

onMounted(() => {
  fetchBerita();
});

// Navigate to news/berita view
const viewMoreNews = () => {
  router.push({ name: "Informasi" });
};
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
  position: relative;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  min-height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.instagram-card-wrapper::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url("/src/assets/Logo Wonderful indonesia Final.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  opacity: 1;
}

.instagram-card-wrapper > * {
  position: relative;
  z-index: 1;
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
  margin-top: 0;
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

/* View More Button */
.view-more-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 32px;
  padding: 16px 0;
}

.view-more-btn {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  position: relative;
  overflow: hidden;
}

.view-more-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.view-more-btn:hover::before {
  left: 100%;
}

.view-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
  background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
}

.view-more-btn:active {
  transform: translateY(0);
}

.view-more-text {
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;
}

.view-more-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.view-more-btn:hover .view-more-arrow {
  transform: translateX(4px);
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
  .view-more-btn {
    padding: 14px 28px;
    font-size: 1rem;
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
  .view-more-btn {
    padding: 12px 24px;
    font-size: 0.95rem;
  }
  .view-more-arrow {
    width: 18px;
    height: 18px;
  }
}
</style>
