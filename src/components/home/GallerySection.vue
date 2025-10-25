<template>
  <section class="gallery-section">
    <h2 class="section-title">Media Galeri</h2>
    <div class="gallery-masonry">
      <div
        v-for="(item, idx) in visibleImages"
        :key="item.id_media_galeri"
        :class="['gallery-item', gridAreas[idx]]"
        :ref="(el) => (slideRefs[idx] = el)">
        <img
          :src="item.url"
          :alt="item.alt"
          class="gallery-image"
          loading="lazy" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import axios from "axios";
import { gsap } from "gsap";

const MAX_VISIBLE = 8;
const galleryImages = ref([]);
const currentIndex = ref(0);
const visibleImages = ref([]);
const slideRefs = ref([]);
let autoSlideInterval = null;
let isAnimating = false;

const gridAreas = [
  "area1",
  "area2",
  "area3",
  "area4",
  "area5",
  "area6",
  "area7",
  "area8",
];

const updateVisibleImages = async () => {
  if (!galleryImages.value.length || isAnimating) return;
  isAnimating = true;

  // Hitung gambar baru
  const start = currentIndex.value;
  const newImages = [];
  for (let i = 0; i < MAX_VISIBLE; i++) {
    const idx = (start + i) % galleryImages.value.length;
    newImages.push(galleryImages.value[idx]);
  }

  // Animasi keluar
  await gsap.to(slideRefs.value, {
    opacity: 0,
    scale: 0.9,
    y: 20,
    stagger: { each: 0.05, from: "random" },
    duration: 0.4,
    ease: "power2.inOut",
  });

  // Ganti gambar
  visibleImages.value = newImages;
  await nextTick();

  // Animasi masuk
  await gsap.fromTo(
    slideRefs.value,
    { opacity: 0, scale: 0.9, y: -20 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      stagger: { each: 0.05, from: "random" },
      duration: 0.6,
      ease: "back.out(1.7)",
    }
  );

  isAnimating = false;
};

const nextSlide = () => {
  if (galleryImages.value.length <= MAX_VISIBLE) return;
  currentIndex.value =
    (currentIndex.value + MAX_VISIBLE) % galleryImages.value.length;
};

const startAutoSlide = () => {
  stopAutoSlide();
  autoSlideInterval = setInterval(nextSlide, 5000);
};

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
};

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/media-galeri");
    galleryImages.value = res.data.map((item) => ({
      id_media_galeri: item.id_media_galeri,
      url: `http://localhost:5000${item.path_file}`,
      alt: item.deskripsi_file || `Media Galeri`,
    }));

    // Render awal
    visibleImages.value = galleryImages.value.slice(0, MAX_VISIBLE);
    await nextTick();
    gsap.set(slideRefs.value, { opacity: 1, scale: 1, y: 0 });

    startAutoSlide();
  } catch (err) {
    console.error("Gagal memuat data galeri:", err);
    galleryImages.value = [];
  }
});

onUnmounted(() => {
  stopAutoSlide();
  gsap.killTweensOf(slideRefs.value);
});

watch(currentIndex, updateVisibleImages);
</script>

<style scoped>
/* ===== CONSISTENT COLOR VARIABLES ===== */
:root {
  --royal-blue: #1e3a8a;
  --gold-accent: #d4af37;
  --pearl-white: #ffffff;
  --ivory-white: #f8f9fa;
  --premium-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
}

.gallery-section {
  padding: 120px 32px 80px 32px;
  background: linear-gradient(
    180deg,
    #f0f6fe 0%,
    #eef4fd 3%,
    #ecf2fc 7%,
    #e8f0fb 12%,
    #e4edfa 18%,
    #e0ebf9 25%,
    #dce8f8 33%,
    rgba(30, 58, 138, 0.08) 42%,
    rgba(30, 58, 138, 0.12) 55%,
    rgba(30, 58, 138, 0.15) 68%,
    rgba(30, 58, 138, 0.18) 82%,
    rgba(30, 58, 138, 0.22) 100%
  );
  text-align: center;
  overflow: hidden;
  position: relative;
  margin-top: -80px;
}

/* Transisi menerima dari NewsGrid */
.gallery-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 180px;
  background: linear-gradient(
    to bottom,
    #f0f6fe 0%,
    rgba(240, 246, 254, 0.95) 12%,
    rgba(240, 246, 254, 0.85) 25%,
    rgba(240, 246, 254, 0.7) 40%,
    rgba(240, 246, 254, 0.5) 60%,
    rgba(240, 246, 254, 0.25) 80%,
    transparent 100%
  );
  z-index: 1;
  pointer-events: none;
}

.section-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 40px;
  color: var(--royal-blue);
  text-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
  font-family: "Playfair Display", serif;
  letter-spacing: -1px;
  position: relative;
  z-index: 2;
}

.gallery-masonry {
  display: grid;
  grid-template-areas:
    "area1 area2 area3 area4"
    "area5 area6 area3 area7"
    "area5 area8 area8 area7";
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 200px 200px 200px;
  gap: 12px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.gallery-item {
  overflow: hidden;
  border-radius: 16px;
  box-shadow: var(--premium-shadow);
  background: var(--ivory-white);
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.gallery-item:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 30px 60px rgba(30, 58, 138, 0.25);
  border-color: var(--gold-accent);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.1);
}

.area1 {
  grid-area: area1;
}
.area2 {
  grid-area: area2;
}
.area3 {
  grid-area: area3;
}
.area4 {
  grid-area: area4;
}
.area5 {
  grid-area: area5;
}
.area6 {
  grid-area: area6;
}
.area7 {
  grid-area: area7;
}
.area8 {
  grid-area: area8;
}

@media (max-width: 900px) {
  .gallery-masonry {
    grid-template-areas:
      "area1 area2"
      "area3 area4"
      "area5 area6"
      "area7 area8";
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(4, 160px);
    gap: 12px;
  }
}
@media (max-width: 600px) {
  .gallery-section {
    padding: 24px 4px;
  }
  .gallery-masonry {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .gallery-item {
    min-height: 120px;
    height: 120px;
  }
  .section-title {
    font-size: 1.3rem;
    margin-bottom: 18px;
  }
}
</style>
