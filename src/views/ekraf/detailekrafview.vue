<template>
  <div class="umkm-detail-page">
    <div class="container">
      <div v-if="loading" class="state-message">
        <div class="spinner"></div>
        <p>Memuat detail UMKM...</p>
      </div>
      
      <div v-if="error" class="state-message error-message">
        <p>❌ Maaf, UMKM tidak ditemukan atau terjadi kesalahan.</p>
        <button @click="goBack" class="back-button">
          Kembali ke Daftar UMKM
        </button>
      </div>

      <div v-if="umkmData && !loading && !error" class="umkm-content">
        <button @click="goBack" class="back-button-top">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>

        <h1 class="umkm-title-main">{{ umkmData.nama_umkm }}</h1>

        <div class="category-badge-iconic" v-if="umkmData.kategoriUMKM">
          <i class="fas fa-tags"></i>
          <span>{{ umkmData.kategoriUMKM.nama_kategori }}</span>
        </div>

        <div class="umkm-meta-header">
          <div class="umkm-meta-stats-inline">
            <p>
              <i class="fas fa-eye"></i> Dilihat: {{ umkmData.jumlah_dilihat || 0 }} kali
            </p>
            <p>
              <i class="fas fa-share-alt"></i> Dibagikan: {{ umkmData.jumlah_share || 0 }} kali
            </p>
          </div>
        </div>

        <div class="umkm-main-image-container">
          <img
            v-if="getMainImage(umkmData)"
            :src="getMainImage(umkmData)"
            :alt="umkmData.nama_umkm"
            @error="handleImageError"
            class="umkm-main-image" />
          <div v-else class="umkm-main-no-image">
            <i class="fas fa-store"></i> Gambar Tidak Tersedia
          </div>
        </div>

        <div class="umkm-body">
          <div class="umkm-description-section">
            <p>{{ umkmData.deskripsi_umkm }}</p>
          </div>

          <!-- Informasi Kontak -->
          <div class="umkm-info-grid">
            <div class="info-item" v-if="umkmData.alamat_umkm">
              <h3 class="info-label"><i class="fas fa-map-marker-alt"></i> Lokasi</h3>
              <p class="info-value">{{ umkmData.alamat_umkm }}</p>
            </div>

            <div class="info-item" v-if="umkmData.kontak_umkm">
              <h3 class="info-label"><i class="fas fa-phone"></i> Kontak</h3>
              <p class="info-value">
                <a :href="`tel:${umkmData.kontak_umkm}`">{{ umkmData.kontak_umkm }}</a>
              </p>
            </div>
            
            <div class="info-item" v-if="umkmData.website_umkm">
              <h3 class="info-label"><i class="fas fa-globe"></i> Website</h3>
              <p class="info-value">
                <a :href="umkmData.website_umkm" target="_blank" rel="noopener">
                  Kunjungi Website <i class="fas fa-external-link-alt"></i>
                </a>
              </p>
            </div>

            <div class="info-item" v-if="umkmData.hari_operasional">
              <h3 class="info-label"><i class="fas fa-calendar-day"></i> Hari Operasional</h3>
              <p class="info-value">{{ umkmData.hari_operasional }}</p>
            </div>

            <div class="info-item" v-if="umkmData.jam_operasional">
              <h3 class="info-label"><i class="fas fa-clock"></i> Jam Operasional</h3>
              <p class="info-value">{{ umkmData.jam_operasional }}</p>
            </div>
          </div>

          <!-- Hashtags -->
          <div v-if="umkmData.hastag_umkm" class="hashtags-section">
            <h2 class="section-heading">Tag Populer</h2>
            <div class="hashtags-container">
              <span
                v-for="(tag, index) in parseHashtags(umkmData.hastag_umkm)"
                :key="index"
                class="hashtag-badge">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Galeri -->
          <div
            v-if="umkmData.galeriUMKM && umkmData.galeriUMKM.length > 0"
            class="gallery-section">
            <h2 class="section-heading">Galeri Produk</h2>
            <div class="gallery-grid">
              <div
                v-for="(media, index) in umkmData.galeriUMKM"
                :key="index"
                class="gallery-item"
                @click="openLightbox(index)">
                <img
                  :src="`http://localhost:5000${media.path_file}`"
                  :alt="media.deskripsi_file || 'Galeri'"
                  @error="handleImageError"
                  class="gallery-image" />
              </div>
            </div>
          </div>

          <!-- Info Admin -->
          <div v-if="umkmData.adminPembuat" class="admin-info">
            <p><strong>Dikelola oleh:</strong> {{ umkmData.adminPembuat.nama_lengkap }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div v-if="lightboxOpen" class="lightbox-modal" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <button class="lightbox-close" @click="closeLightbox">
          <i class="fas fa-times"></i>
        </button>
        <button
          class="lightbox-nav lightbox-prev"
          @click="previousImage"
          v-if="umkmData.galeriUMKM && umkmData.galeriUMKM.length > 1">
          <i class="fas fa-chevron-left"></i>
        </button>
        <img
          v-if="umkmData.galeriUMKM && umkmData.galeriUMKM[currentImageIndex]"
          :src="`http://localhost:5000${umkmData.galeriUMKM[currentImageIndex].path_file}`"
          alt="Galeri"
          class="lightbox-image" />
        <button
          class="lightbox-nav lightbox-next"
          @click="nextImage"
          v-if="umkmData.galeriUMKM && umkmData.galeriUMKM.length > 1">
          <i class="fas fa-chevron-right"></i>
        </button>
        <div class="lightbox-counter" v-if="umkmData.galeriUMKM">
          {{ currentImageIndex + 1 }} / {{ umkmData.galeriUMKM.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const umkmData = ref(null);
const loading = ref(true);
const error = ref(null);
const lightboxOpen = ref(false);
const currentImageIndex = ref(0);

const API_BASE_URL = "http://localhost:5000";

const fetchUMKMDetail = async () => {
  loading.value = true;
  error.value = null;

  try {
    const id = route.params.id;
    const response = await axios.get(`${API_BASE_URL}/api/umkm/${id}`);
    umkmData.value = response.data;
  } catch (err) {
    console.error("Error fetching UMKM detail:", err);
    error.value = "Gagal memuat detail UMKM. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push({ name: "Ekraf" });
};

const getMainImage = (item) => {
  if (item.gambar_sampul) {
    return `${API_BASE_URL}${item.gambar_sampul}`;
  }
  if (item.gambar_produk_utama) {
    return `${API_BASE_URL}${item.gambar_produk_utama}`;
  }
  if (item.galeriUMKM && item.galeriUMKM.length > 0) {
    return `${API_BASE_URL}${item.galeriUMKM[0].path_file}`;
  }
  return null;
};

const handleImageError = (event) => {
  event.target.src = "https://via.placeholder.com/800x600/3b82f6/ffffff?text=UMKM+Magetan";
};

const parseHashtags = (hashtagString) => {
  if (!hashtagString) return [];
  return hashtagString
    .split(/[\s,;]+/)
    .filter(tag => tag.trim().length > 0)
    .map(tag => tag.startsWith('#') ? tag : `#${tag}`);
};

const openLightbox = (index) => {
  currentImageIndex.value = index;
  lightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = '';
};

const nextImage = () => {
  if (umkmData.value.galeriUMKM && currentImageIndex.value < umkmData.value.galeriUMKM.length - 1) {
    currentImageIndex.value++;
  } else {
    currentImageIndex.value = 0;
  }
};

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  } else if (umkmData.value.galeriUMKM) {
    currentImageIndex.value = umkmData.value.galeriUMKM.length - 1;
  }
};

onMounted(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  fetchUMKMDetail();
});
</script>

<style scoped>
/* Base Styles */
.umkm-detail-page {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #f4f7f9;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* State Messages */
.state-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 119, 182, 0.1);
  border-top-color: #0077b6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.state-message p {
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
}

.error-message {
  color: #dc3545;
}

.error-message .back-button {
  margin-top: 20px;
}

/* Content Card */
.umkm-content {
  background: #ffffff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Back Button */
.back-button-top {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #ffffff;
  border: 2px solid #0077b6;
  border-radius: 8px;
  color: #0077b6;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 30px;
}

.back-button-top:hover {
  background-color: #0077b6;
  color: #ffffff;
  transform: translateX(-4px);
}

/* Category Badge Iconic */
.category-badge-iconic {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #0077b6 0%, #005a8c 100%);
  color: #ffffff;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 119, 182, 0.3);
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.category-badge-iconic:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 119, 182, 0.4);
}

.category-badge-iconic i {
  font-size: 1.1rem;
}

/* Title */
.umkm-title-main {
  font-size: 2.8rem;
  font-weight: 700;
  color: #212529;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

/* Meta Header */
.umkm-meta-header {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.umkm-meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
}

.umkm-meta-item i {
  color: #0077b6;
  font-size: 1rem;
}

.umkm-meta-stats-inline {
  display: flex;
  gap: 20px;
  margin-left: auto;
}

.umkm-meta-stats-inline p {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
}

.umkm-meta-stats-inline i {
  color: #0077b6;
}

/* Main Image */
.umkm-main-image-container {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.umkm-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.umkm-main-no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  color: #6c757d;
  font-size: 1rem;
  gap: 10px;
}

.umkm-main-no-image i {
  font-size: 3rem;
}

/* Body Content */
.umkm-body {
  font-size: 1rem;
  line-height: 1.8;
  color: #495057;
}

.umkm-description-section {
  margin-bottom: 40px;
}

.umkm-description-section p {
  margin: 0;
  text-align: justify;
}

/* Info Grid */
.umkm-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.info-item {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #0077b6;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0077b6;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1rem;
  color: #212529;
  margin: 0;
}

.info-value a {
  color: #0077b6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.info-value a:hover {
  color: #005a8c;
  text-decoration: underline;
}

/* Hashtags */
.hashtags-section {
  margin-bottom: 40px;
}

.section-heading {
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
  margin: 0 0 20px 0;
}

.hashtags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hashtag-badge {
  display: inline-block;
  padding: 6px 14px;
  background-color: #e7f5ff;
  color: #0077b6;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.hashtag-badge:hover {
  background-color: #0077b6;
  color: #ffffff;
}

/* Gallery */
.gallery-section {
  margin-bottom: 40px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.gallery-item {
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Admin Info */
.admin-info {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 40px;
  text-align: center;
  font-size: 0.95rem;
}

/* Lightbox Modal */
.lightbox-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox-close {
  position: absolute;
  top: -50px;
  right: 0;
  background-color: transparent;
  border: 2px solid #ffffff;
  color: #ffffff;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.lightbox-close:hover {
  background-color: #ffffff;
  color: #000000;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid #ffffff;
  color: #ffffff;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.lightbox-nav:hover {
  background-color: #ffffff;
  color: #000000;
}

.lightbox-prev {
  left: -70px;
}

.lightbox-next {
  right: -70px;
}

.lightbox-counter {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .umkm-content {
    padding: 30px 20px;
  }

  .umkm-title-main {
    font-size: 2rem;
  }

  .umkm-meta-header {
    flex-direction: column;
    gap: 10px;
  }

  .umkm-meta-stats-inline {
    margin-left: 0;
  }

  .umkm-main-image-container {
    height: 300px;
  }

  .umkm-info-grid {
    grid-template-columns: 1fr;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }

  .lightbox-prev {
    left: 10px;
  }

  .lightbox-next {
    right: 10px;
  }

  .lightbox-close {
    top: 10px;
    right: 10px;
  }
}
</style>

