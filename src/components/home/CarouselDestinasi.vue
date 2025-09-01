<template>
  <section class="pariwisata-section">
    <div class="section-title">
      <span class="section-title-line"></span>
      <h2 class="section-title-text">Pariwisata</h2>
      <span class="section-title-line"></span>
    </div>

    <div class="carousel-container">
      <button
        class="carousel-nav left"
        @click="prevSlide"
        :disabled="loading || error">
        &#8592;
      </button>
      <div class="carousel-track-wrapper">
        <div ref="carouselTrack" class="carousel-track">
          <template v-if="loading">
            <div class="loading-animation">
              <div class="spinner"></div>
              <span>Memuat data...</span>
            </div>
          </template>
          <template v-else-if="error">
            <div class="no-data-message" style="color: #e53e3e">
              {{ error }}
            </div>
          </template>
          <template v-else>
            <div
              v-for="kategori in kategoriList"
              :key="kategori.id_kategori_destinasi"
              class="pariwisata-card firmware-style">
              <div class="card-image firmware-image">
                <svg
                  :style="{
                    stroke:
                      svgColors[
                        kategori.id_kategori_destinasi % svgColors.length
                      ],
                  }"
                  width="40"
                  height="40"
                  fill="none"
                  stroke-width="2"
                  viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 15c1.333-2 2.667-2 4 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div class="card-content firmware-content">
                <h3 class="card-title firmware-title">
                  {{ kategori.nama_kategori }}
                </h3>
                <div class="details-button-wrapper">
                  <router-link
                    :to="`/destinasi?kategori=${kategori.id_kategori_destinasi}`"
                    class="details-button firmware-button">
                    Details
                  </router-link>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <button
        class="carousel-nav right"
        @click="nextSlide"
        :disabled="loading || error">
        &#8594;
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import axios from "axios";
import { gsap } from "gsap";

const kategoriList = ref([]);
const loading = ref(true);
const error = ref(null);
const carouselTrack = ref(null);

const svgColors = [
  "#007bff",
  "#28c76f",
  "#ff9f43",
  "#7367f0",
  "#009fe3",
  "#ff6384",
  "#ff0000",
  "#00ff00",
  "#0000ff",
];

const cardWidth = 230;
const slidesPerView = 5;

const animateSlide = (direction) => {
  const track = carouselTrack.value;
  if (!track) return;

  const currentX = gsap.getProperty(track, "x");
  let newX;

  if (direction === "next") {
    newX = currentX - cardWidth;
    if (
      Math.abs(newX) >
      (kategoriList.value.length - slidesPerView) * cardWidth
    ) {
      newX = 0;
    }
  } else if (direction === "prev") {
    newX = currentX + cardWidth;
    if (newX > 0) {
      newX = -(kategoriList.value.length - slidesPerView) * cardWidth;
    }
  }

  gsap.to(track, {
    x: newX,
    duration: 0.8,
    ease: "power2.inOut",
    overwrite: true,
  });
};

const nextSlide = () => {
  animateSlide("next");
};

const prevSlide = () => {
  animateSlide("prev");
};

const animateCardsIn = () => {
  gsap.from(".pariwisata-card", {
    y: 50,
    opacity: 0,
    scale: 0.95,
    stagger: 0.1,
    duration: 0.6,
    ease: "back.out(1.2)",
    delay: 0.3,
  });
};

let intervalId = null;

onMounted(async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/kategori-destinasi/"
    );
    kategoriList.value = response.data;
    await nextTick();
    if (kategoriList.value.length > 0) {
      animateCardsIn();
    }
  } catch (err) {
    error.value = "Gagal memuat data kategori destinasi.";
    console.error(err);
  } finally {
    loading.value = false;
  }
  intervalId = setInterval(nextSlide, 3500);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
/* Struktur & Umum */
.pariwisata-section {
  padding: 60px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e3f0fb 100%);
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 123, 255, 0.08);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 50px;
}

.section-title-text {
  font-size: 2.8rem;
  font-weight: 800;
  color: #007bff;
  letter-spacing: 1.2px;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  position: relative;
  z-index: 1;
}

.section-title-line {
  flex-grow: 1;
  height: 4px;
  background: linear-gradient(90deg, #007bff 0%, #009fe3 100%);
  max-width: 150px;
  border-radius: 3px;
  opacity: 0.8;
}

/* Carousel */
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.carousel-track-wrapper {
  overflow: hidden;
  width: 100%;
  max-width: 1150px;
  position: relative;
}

.carousel-track {
  display: flex;
  gap: 20px;
  padding: 10px;
}

.carousel-nav {
  background: #fff;
  border: 1px solid #e3eaf5;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #007bff;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
  transition: transform 0.3s ease, background 0.3s ease;
  z-index: 10;
  margin: 0 15px;
}

.carousel-nav:hover {
  transform: scale(1.1);
  background: #e9f5ff;
  color: #0060d3;
}

.carousel-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

/* Kartu */
.pariwisata-card.firmware-style {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff 60%, #f0f8ff 100%);
  border-radius: 18px;
  padding: 24px 15px;
  min-width: 210px;
  min-height: 330px;
  box-shadow: 0 6px 24px rgba(0, 123, 255, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  position: relative;
  border: 1px solid #e3eaf5;
  flex-shrink: 0;
}

.pariwisata-card.firmware-style:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 16px 48px rgba(0, 123, 255, 0.15);
  border-color: #cce0ff;
}

/* Teks dan Konten Kartu */
.card-image.firmware-image {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  min-height: 60px;
}

.card-title.firmware-title {
  font-size: 1.15rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 22px;
  letter-spacing: 0.8px;
  font-family: 'Poppins', sans-serif;
}

.details-button.firmware-button {
  display: inline-block;
  padding: 10px 24px;
  background: linear-gradient(90deg, #007bff 0%, #009fe3 100%);
  color: #fff;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  border: none;
  margin-top: 50px;
}


.details-button-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-top: 48px;
  margin-bottom: 0;
  min-height: 48px;
}
.details-button.firmware-button {
  display: inline-block;
  padding: 10px 28px;
  background: #f3f3f3;
  color: #222;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  border: none;
}
.details-button.firmware-button:hover {
  background: #e0e0e0;
  color: #007bff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.13);
  transform: translateY(-2px);
}

.spinner {
  border: 5px solid #e3eaf5;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media screen and (max-width: 1024px) {
  .carousel-track {
    gap: 15px;
  }
}

@media screen and (max-width: 768px) {
  .section-title-text {
    font-size: 2rem;
  }
  .pariwisata-card.firmware-style {
    min-width: 180px;
    min-height: 220px;
  }
}

@media screen and (max-width: 600px) {
  .pariwisata-section {
    padding: 24px 10px;
  }
  .section-title-text {
    font-size: 1.5rem;
  }
  .section-title-line {
    max-width: 80px;
  }
  .carousel-nav {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
</style>
