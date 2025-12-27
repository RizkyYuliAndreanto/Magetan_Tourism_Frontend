<template>
  <section class="ekonomi-kreatif-section">
    <div class="ekonomi-kreatif-container">
      <div class="carousel-ekraf-container">
        <button
          v-if="kategoriList.length > 1"
          class="carousel-nav nav-left"
          @click="prevSlide"
          aria-label="Sebelumnya">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" />
          </svg>
        </button>
        <div 
          class="carousel-track-wrapper-ekraf" 
          ref="trackWrapper"
          @mouseenter="pauseAutoSlide"
          @mouseleave="resumeAutoSlide"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd">
          <div ref="carouselTrack" class="carousel-track-ekraf">
            <template v-if="loading">
              <div class="no-data-message">Memuat data...</div>
            </template>
            <template v-else-if="error">
              <div class="no-data-message" style="color: #e53e3e">
                {{ error }}
              </div>
            </template>
            <template v-else-if="kategoriList.length === 0">
              <div class="no-data-message">Tidak ada data kategori.</div>
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
          v-if="kategoriList.length > 1"
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
      slideCount: 0, // Will be calculated based on available items
      isSliding: false,
      autoSlideInterval: null,
      touchStartX: 0,
      touchEndX: 0,
    };
  },
  computed: {
    effectiveSlideCount() {
      // Use minimum of 4 or actual item count
      return Math.min(4, this.kategoriList.length);
    },
    clonedKategoriListStart() {
      // Kloning beberapa elemen dari akhir ke awal
      if (this.kategoriList.length > 4) {
        return this.kategoriList.slice(0, this.effectiveSlideCount);
      }
      return [];
    },
    clonedKategoriListEnd() {
      // Kloning beberapa elemen dari awal ke akhir
      if (this.kategoriList.length > 4) {
        return this.kategoriList.slice(-this.effectiveSlideCount);
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
        console.log("Kategori loaded:", this.kategoriList.length);
      } catch (err) {
        this.error = "Gagal memuat data kategori UMKM.";
        console.error("Error loading kategori:", err);
      } finally {
        this.loading = false;
        this.$nextTick(() => {
          if (this.kategoriList.length > 0) {
            this.initializeCarousel();
          }
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
      this.pauseAutoSlide();
      
      const totalItems = this.kategoriList.length;
      
      if (totalItems > 4) {
        // Carousel mode with cloning
        if (this.currentSlideIndex >= totalItems) {
          this.currentSlideIndex = totalItems;
        } else {
          this.currentSlideIndex++;
        }
        this.slideTo(this.currentSlideIndex);
      } else {
        // Simple mode for <= 4 items
        this.currentSlideIndex = (this.currentSlideIndex + 1) % totalItems;
        this.simpleSlide();
      }
    },
    prevSlide() {
      if (this.isSliding) return;
      this.isSliding = true;
      this.pauseAutoSlide();
      
      const totalItems = this.kategoriList.length;
      
      if (totalItems > 4) {
        // Carousel mode with cloning
        if (this.currentSlideIndex <= -1) {
          this.currentSlideIndex = -1;
        } else {
          this.currentSlideIndex--;
        }
        this.slideTo(this.currentSlideIndex);
      } else {
        // Simple mode for <= 4 items
        this.currentSlideIndex = (this.currentSlideIndex - 1 + totalItems) % totalItems;
        this.simpleSlide();
      }
    },
    slideTo(index) {
      const track = this.$refs.carouselTrack;
      if (!track) return;
      const card = track.querySelector(".kategori-card:not(.cloned)");
      if (!card) return;
      const cardWidth = card.offsetWidth + 48; // gap
      const targetX = -(index + this.effectiveSlideCount) * cardWidth;

      track.style.transition = `transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)`;
      track.style.transform = `translateX(${targetX}px)`;

      // Logic to snap back to the start/end without transition
      track.ontransitionend = () => {
        if (index >= this.kategoriList.length) {
          track.style.transition = "none";
          this.currentSlideIndex = 0;
          const newTargetX =
            -(this.currentSlideIndex + this.effectiveSlideCount) * cardWidth;
          track.style.transform = `translateX(${newTargetX}px)`;
        } else if (index < 0) {
          track.style.transition = "none";
          this.currentSlideIndex = this.kategoriList.length - 1;
          const newTargetX =
            -(this.currentSlideIndex + this.effectiveSlideCount) * cardWidth;
          track.style.transform = `translateX(${newTargetX}px)`;
        }
        this.isSliding = false;
        this.resumeAutoSlide();
        track.ontransitionend = null;
      };
    },
    simpleSlide() {
      // For cases with <= 4 items, just fade or simple transition
      const track = this.$refs.carouselTrack;
      if (!track) return;
      
      const card = track.querySelector(".kategori-card:not(.cloned)");
      if (!card) return;
      
      const cardWidth = card.offsetWidth + 48;
      const targetX = -this.currentSlideIndex * cardWidth;
      
      track.style.transition = `transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)`;
      track.style.transform = `translateX(${targetX}px)`;
      
      setTimeout(() => {
        this.isSliding = false;
        this.resumeAutoSlide();
      }, 500);
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
      // Cek apakah refs tersedia
      if (!this.$refs.carouselTrack) {
        console.error("Carousel track ref not found");
        return;
      }
      
      const firstCard = this.$refs.carouselTrack.querySelector(".kategori-card:not(.cloned)");
      if (!firstCard) {
        console.error("No cards found in carousel");
        return;
      }
      
      // Set initial position
      this.currentSlideIndex = 0;
      const cardWidth = firstCard.offsetWidth + 48; // card width + gap
      
      // If items <= 4, don't offset (no cloning)
      // If items > 4, offset by cloned items
      let initialX = 0;
      if (this.kategoriList.length > 4) {
        initialX = -this.effectiveSlideCount * cardWidth;
      }
      
      console.log("Initializing carousel:", { 
        cardWidth, 
        initialX, 
        effectiveSlideCount: this.effectiveSlideCount,
        totalCards: this.kategoriList.length 
      });
      
      this.$refs.carouselTrack.style.transition = "none";
      this.$refs.carouselTrack.style.transform = `translateX(${initialX}px)`;
      
      // Force reflow
      this.$refs.carouselTrack.offsetHeight;
      
      // Start auto-slide if more than 1 item
      if (this.kategoriList.length > 1) {
        this.startAutoSlide();
      }
    },
    startAutoSlide() {
      // Clear existing interval
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval);
      }
      
      // Only auto-slide if we have items
      if (this.kategoriList.length > 1) {
        this.autoSlideInterval = setInterval(() => {
          this.nextSlide();
        }, 4000); // Auto-slide every 4 seconds
      }
    },
    pauseAutoSlide() {
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval);
        this.autoSlideInterval = null;
      }
    },
    resumeAutoSlide() {
      this.startAutoSlide();
    },
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
      this.pauseAutoSlide();
    },
    handleTouchMove(event) {
      // Optional: add visual feedback during touch move
    },
    handleTouchEnd(event) {
      this.touchEndX = event.changedTouches[0].clientX;
      const deltaX = this.touchEndX - this.touchStartX;
      
      // Threshold for swipe
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe right - previous
          this.prevSlide();
        } else {
          // Swipe left - next
          this.nextSlide();
        }
      }
      
      this.resumeAutoSlide();
    },
  },
  mounted() {
    this.fetchKategori();
  },
  beforeUnmount() {
    // Clean up auto-slide interval
    this.pauseAutoSlide();
  },
};
</script>
text-xl
<style scoped>
.ekonomi-kreatif-section {
  position: relative;
  margin-top: -40px;
  padding: 80px 32px 64px 32px;
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
  z-index: 5;
  overflow: visible;
}

/* Top wave transition dari EventSection */
.ekonomi-kreatif-section::before {
  content: "";
  position: absolute;
  top: -15px;
  left: 0;
  right: 0;
  height: 60px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 60'%3E%3Cpath d='M0,35 C300,50 600,10 900,40 C1000,50 1100,25 1200,35 L1200,0 L0,0 Z' fill='%23ffffff'/%3E%3C/svg%3E")
    no-repeat center top;
  background-size: cover;
  z-index: 2;
  pointer-events: none;
}

/* Bottom transition ke NewsGrid - gradasi halus ke biru NewsGrid */
.ekonomi-kreatif-section::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(248, 250, 255, 0.3) 50%,
    rgba(240, 246, 254, 0.6) 75%,
    #e0f0ff 100%
  );
  z-index: 6;
  pointer-events: none;
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
  background-color: #ffffff;
  border-radius: 24px;
  width: 280px;
  height: 480px;
  box-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border: 2px solid transparent;
  flex-shrink: 0;
  z-index: 10;
  transform-style: preserve-3d;
}

.card-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 22px;
}

.card-image-container::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 30%,
    transparent 70%
  );
  z-index: 1;
  pointer-events: none;
  transition: all 0.5s ease;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}
.kategori-card.portrait-card:hover {
  box-shadow: 0 25px 50px rgba(30, 58, 138, 0.25),
    0 15px 30px rgba(0, 0, 0, 0.15), 0 0 40px rgba(37, 99, 235, 0.2);
  transform: translateY(-10px) scale(1.02);
  border-color: rgba(37, 99, 235, 0.3);
}

.kategori-card.portrait-card:hover .card-image-container::after {
  background: linear-gradient(
    to top,
    rgba(30, 58, 138, 0.95) 0%,
    rgba(30, 58, 138, 0.7) 25%,
    rgba(0, 0, 0, 0.3) 50%,
    transparent 75%
  );
}

.kategori-card.portrait-card:hover .card-image {
  transform: scale(1.1);
}
.portrait-label {
  width: 100%;
  background: transparent;
  backdrop-filter: none;
  border-radius: 0 0 22px 22px;
  text-align: center;
  padding: 2.5rem 2rem;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
  box-sizing: border-box;
  border-top: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.kategori-card.portrait-card:hover .portrait-label {
  background: linear-gradient(
    to top,
    rgba(30, 58, 138, 0.95) 0%,
    rgba(30, 58, 138, 0.7) 50%,
    transparent 100%
  );
  backdrop-filter: blur(15px);
  padding: 3rem 2rem;
}
.portrait-label .kategori-nama {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 1rem 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  line-height: 1.2;
  letter-spacing: 0.5px;
  transition: all 0.4s ease;
}

.kategori-deskripsi {
  font-size: 1rem;
  color: #ffffff;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  opacity: 0;
  font-weight: 400;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  letter-spacing: 0.3px;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.kategori-card.portrait-card:hover .kategori-deskripsi {
  opacity: 0.95;
  transform: translateY(0);
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
  color: #1e3a8a;
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
  z-index: 10;
}
.carousel-track-wrapper-ekraf {
  overflow: hidden;
  width: 100%;
  max-width: 900px;
  position: relative;
  z-index: 10;
}
.carousel-track-ekraf {
  display: flex;
  gap: 48px;
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform;
  position: relative;
  z-index: 10;
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

/* Wave animation */
@keyframes complementaryWave {
  0% {
    transform: translateX(3px) scaleX(1.005);
    opacity: 0.9;
  }
  50% {
    transform: translateX(0px) scaleX(1);
    opacity: 1;
  }
  100% {
    transform: translateX(-3px) scaleX(1.005);
    opacity: 0.9;
  }
}
</style>
