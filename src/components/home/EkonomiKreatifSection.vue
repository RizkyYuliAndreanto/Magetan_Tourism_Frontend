<template>
  <section class="ekonomi-kreatif-section">
    <div class="ekonomi-kreatif-container">
      <div class="carousel-ekraf-container">
        <button
          v-if="kategoriList.length > 4"
          class="carousel-nav nav-left"
          @click="prevSlide"
          aria-label="Sebelumnya">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" />
          </svg>
        </button>
        <div class="carousel-track-wrapper-ekraf" ref="trackWrapper">
          <div ref="carouselTrack" class="carousel-track-ekraf">
            <template v-if="loading">
              <div class="no-data-message">Memuat data...</div>
            </template>
            <template v-else-if="error">
              <div class="no-data-message" style="color: #e53e3e">
                {{ error }}
              </div>
            </template>
            <template v-else>
              <div
                v-for="kategori in clonedKategoriListEnd"
                :key="kategori.id_kategori_umkm + '_cloned_end'"
                class="kategori-card portrait-card cloned">
                <div class="card-image-container">
                  <img
                    :src="getImageUrl(kategori.gambar_sampul)"
                    :alt="kategori.nama_kategori"
                    class="card-image"
                    @error="handleImageError" />
                </div>
                <div class="card-label portrait-label">
                  <p class="kategori-nama">{{ kategori.nama_kategori }}</p>
                  <p class="kategori-deskripsi" v-if="kategori.deskripsi">
                    {{ getShortDescription(kategori.deskripsi) }}
                  </p>
                </div>
              </div>

              <div
                v-for="(kategori, index) in kategoriList"
                :key="kategori.id_kategori_umkm"
                class="kategori-card portrait-card">
                <div class="card-image-container">
                  <img
                    :src="getImageUrl(kategori.gambar_sampul)"
                    :alt="kategori.nama_kategori"
                    class="card-image"
                    @error="handleImageError" />
                </div>
                <div class="card-label portrait-label">
                  <p class="kategori-nama">{{ kategori.nama_kategori }}</p>
                  <p class="kategori-deskripsi" v-if="kategori.deskripsi">
                    {{ getShortDescription(kategori.deskripsi) }}
                  </p>
                </div>
              </div>

              <div
                v-for="kategori in clonedKategoriListStart"
                :key="kategori.id_kategori_umkm + '_cloned_start'"
                class="kategori-card portrait-card cloned">
                <div class="card-image-container">
                  <img
                    :src="getImageUrl(kategori.gambar_sampul)"
                    :alt="kategori.nama_kategori"
                    class="card-image"
                    @error="handleImageError" />
                </div>
                <div class="card-label portrait-label">
                  <p class="kategori-nama">{{ kategori.nama_kategori }}</p>
                  <p class="kategori-deskripsi" v-if="kategori.deskripsi">
                    {{ getShortDescription(kategori.deskripsi) }}
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
        <button
          v-if="kategoriList.length > 4"
          class="carousel-nav nav-right"
          @click="nextSlide"
          aria-label="Berikutnya">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
          </svg>
        </button>
      </div>
      <div class="title-wrapper">
        <div class="logo-ekraf-wrapper">
          <img
            v-if="logoEkraf"
            :src="logoEkraf"
            alt="Logo Ekonomi Kreatif"
            class="logo-ekraf" />
        </div>
        <h2 class="section-title">Ekonomi Kreatif</h2>
        <router-link to="/ekonomi-kreatif" class="view-more-button">
          <span class="button-text">View More</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="button-icon">
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import logoEkraf from "../../assets/logoEkraf.png";
import { ref, onMounted } from "vue";

export default {
  name: "EkonimiKreatifSection",
  data() {
    return {
      kategoriList: [],
      loading: true,
      error: null,
      logoEkraf: logoEkraf,
      currentSlideIndex: 0,
      slideCount: 4, // Jumlah slide yang terlihat
      isSliding: false,
    };
  },
  computed: {
    clonedKategoriListStart() {
      // Kloning beberapa elemen dari akhir ke awal
      if (this.kategoriList.length > 0) {
        return this.kategoriList.slice(0, this.slideCount);
      }
      return [];
    },
    clonedKategoriListEnd() {
      // Kloning beberapa elemen dari awal ke akhir
      if (this.kategoriList.length > 0) {
        return this.kategoriList.slice(-this.slideCount);
      }
      return [];
    },
  },
  methods: {
    async fetchKategori() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/kategori-umkm/"
        );
        this.kategoriList = response.data;
      } catch (err) {
        this.error = "Gagal memuat data kategori UMKM.";
        console.error(err);
      } finally {
        this.loading = false;
        this.$nextTick(() => {
          this.initializeCarousel();
        });
      }
    },
    getImageUrl(gambar) {
      if (!gambar) return "https://via.placeholder.com/400x300?text=No+Image";
      if (gambar.startsWith("http")) return gambar;
      let fixedPath = gambar.replace(
        "/uploads/umkm/kategori-sampul/",
        "/uploads/umkm/gambar-sampul/"
      );
      return `http://localhost:5000${fixedPath}`;
    },
    nextSlide() {
      if (this.isSliding) return;
      this.isSliding = true;
      const totalItems = this.kategoriList.length;
      if (this.currentSlideIndex >= totalItems) {
        this.currentSlideIndex = totalItems;
      } else {
        this.currentSlideIndex++;
      }
      this.slideTo(this.currentSlideIndex);
    },
    prevSlide() {
      if (this.isSliding) return;
      this.isSliding = true;
      if (this.currentSlideIndex <= -1) {
        this.currentSlideIndex = -1;
      } else {
        this.currentSlideIndex--;
      }
      this.slideTo(this.currentSlideIndex);
    },
    slideTo(index) {
      const track = this.$refs.carouselTrack;
      if (!track) return;
      const card = track.querySelector(".kategori-card:not(.cloned)");
      if (!card) return;
      const cardWidth = card.offsetWidth + 48; // gap
      const targetX = -(index + this.slideCount) * cardWidth;

      track.style.transition = `transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)`;
      track.style.transform = `translateX(${targetX}px)`;

      // Logic to snap back to the start/end without transition
      track.ontransitionend = () => {
        if (index >= this.kategoriList.length) {
          track.style.transition = "none";
          this.currentSlideIndex = 0;
          const newTargetX =
            -(this.currentSlideIndex + this.slideCount) * cardWidth;
          track.style.transform = `translateX(${newTargetX}px)`;
        } else if (index < 0) {
          track.style.transition = "none";
          this.currentSlideIndex = this.kategoriList.length - 1;
          const newTargetX =
            -(this.currentSlideIndex + this.slideCount) * cardWidth;
          track.style.transform = `translateX(${newTargetX}px)`;
        }
        this.isSliding = false;
        track.ontransitionend = null;
      };
    },
    handleImageError(event) {
      // Set placeholder image jika gambar gagal dimuat
      event.target.src =
        "https://via.placeholder.com/220x360/f3f3f3/333333?text=No+Image";
    },
    getShortDescription(description) {
      if (!description) return "";
      // Potong deskripsi maksimal 60 karakter dan tambahkan "..."
      return description.length > 60
        ? description.substring(0, 60).trim() + "..."
        : description;
    },
    initializeCarousel() {
      // Geser ke posisi awal yang benar
      this.currentSlideIndex = 0;
      this.slideTo(this.currentSlideIndex);
      this.$refs.carouselTrack.style.transition = "none";
      const cardWidth =
        this.$refs.carouselTrack.querySelector(".kategori-card:not(.cloned)")
          .offsetWidth + 48;
      const initialX = -this.slideCount * cardWidth;
      this.$refs.carouselTrack.style.transform = `translateX(${initialX}px)`;
    },
  },
  mounted() {
    this.fetchKategori();
  },
};
</script>
text-xl
<style scoped>
.ekonomi-kreatif-section {
  padding: 64px 32px;
  background-color: #e0e0e0;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("../../assets/ekraf.jpg");
  background-size: cover;
  background-position: center;
  font-family: Arial, sans-serif;
  min-height: 650px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ekonomi-kreatif-container {
  display: flex;
  align-items: flex-end;
  max-width: 1400px;
  width: 100%;
  justify-content: space-between;
}

.cards-wrapper {
  display: flex;
  gap: 48px;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: flex-end;
}

.kategori-card.portrait-card {
  position: relative;
  background-color: #f3f3f3;
  border-radius: 22px;
  min-width: 180px;
  min-height: 320px;
  max-width: 220px;
  max-height: 360px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  text-decoration: none;
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
  overflow: hidden;
  border: 3px solid #bdbdbd;
}

.card-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 19px; /* Sedikit lebih kecil dari border card */
}

.card-image-container::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    transparent 100%
  );
  z-index: 1;
  pointer-events: none;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}
.kategori-card.portrait-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
  transform: translateY(-6px) scale(1.05);
  border-color: #007bff;
}

.kategori-card.portrait-card:hover .card-image {
  transform: scale(1.1);
}
.portrait-label {
  width: 100%;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.85) 100%
  );
  backdrop-filter: blur(10px);
  border-radius: 0 0 18px 18px;
  text-align: center;
  padding: 16px 8px 12px 8px;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
  box-sizing: border-box;
  border-top: 1px solid rgba(255, 255, 255, 0.8);
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.portrait-label .kategori-nama {
  font-size: 1.15rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  line-height: 1.2;
}

.kategori-deskripsi {
  font-size: 0.85rem;
  color: #555;
  margin: 0;
  line-height: 1.3;
  opacity: 0.9;
  font-weight: 400;
  text-align: center;
}

.kategori-nama {
  font-size: 1.15rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.title-wrapper {
  margin-left: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-ekraf-wrapper {
  width: 400px;
  height: 400px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-ekraf {
  width: 100%;
  height: 100%;
  object-fit: contain;
  margin-left: 0;
  margin-right: 50px;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  color: #222;
  line-height: 1.1;
  text-align: center;
  margin: 0 0 20px 0;
}

.view-more-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.view-more-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
  color: white;
  text-decoration: none;
}

.view-more-button::before {
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
  transition: left 0.5s;
}

.view-more-button:hover::before {
  left: 100%;
}

.view-more-button .button-text {
  position: relative;
  z-index: 2;
}

.view-more-button .button-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;
}

.view-more-button:hover .button-icon {
  transform: translateX(4px);
}

.no-data-message {
  text-align: center;
  width: 100%;
  color: #888;
  font-size: 1.3rem;
  margin-top: 24px;
}

@media (max-width: 1200px) {
  .ekonomi-kreatif-container {
    max-width: 1000px;
  }
  .cards-wrapper {
    gap: 32px;
  }
  .title-wrapper {
    margin-left: 32px;
  }
}

@media (max-width: 992px) {
  .ekonomi-kreatif-container {
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    max-width: 100%;
  }
  .cards-wrapper {
    justify-content: center;
    margin-top: 32px;
    gap: 24px;
  }
  .title-wrapper {
    margin-left: 0;
    text-align: center;
    justify-content: center;
  }
  .section-title {
    font-size: 2.2rem;
    text-align: center;
  }
  .logo-ekraf-wrapper {
    width: 90px;
    height: 90px;
    margin-bottom: 12px;
  }
}

@media (max-width: 768px) {
  .cards-wrapper {
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
  }
  .kategori-card {
    min-width: 140px;
    padding: 14px;
  }
  .kategori-card.portrait-card {
    min-width: 140px;
    min-height: 240px;
    max-width: 160px;
    max-height: 280px;
  }
  .card-image-container::after {
    height: 60px;
  }
  .kategori-nama {
    font-size: 1rem;
  }
  .section-title {
    font-size: 1.5rem;
  }
  .logo-ekraf-wrapper {
    width: 60px;
    height: 60px;
    margin-bottom: 8px;
  }
}

@media (max-width: 480px) {
  .ekonomi-kreatif-section {
    padding: 20px 10px;
    min-height: 400px;
  }
  .kategori-card {
    min-width: 120px;
    padding: 8px;
  }
  .kategori-card.portrait-card {
    min-width: 120px;
    min-height: 200px;
    max-width: 140px;
    max-height: 240px;
  }
  .card-image-container::after {
    height: 50px;
  }
  .portrait-label {
    padding: 12px 6px 8px 6px;
  }
  .portrait-label .kategori-nama {
    font-size: 0.9rem;
  }
  .section-title {
    font-size: 1.1rem;
  }
  .logo-ekraf-wrapper {
    width: 40px;
    height: 40px;
    margin-bottom: 4px;
  }
}
.carousel-ekraf-container {
  display: flex;
  align-items: flex-end;
  flex-grow: 1;
  position: relative;
  width: 100%;
}
.carousel-track-wrapper-ekraf {
  overflow: hidden;
  width: 100%;
  max-width: 900px;
  position: relative;
}
.carousel-track-ekraf {
  display: flex;
  gap: 48px;
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform;
}
.carousel-nav {
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #007bff;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
  transition: transform 0.3s, background 0.3s, box-shadow 0.3s;
  z-index: 10;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.nav-left {
  left: -24px;
}
.nav-right {
  right: -24px;
}
</style>
