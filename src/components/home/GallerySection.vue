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
  "area1", "area2", "area3", "area4",
  "area5", "area6", "area7", "area8",
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
  currentIndex.value = (currentIndex.value + MAX_VISIBLE) % galleryImages.value.length;
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
/* CSS sama seperti punyamu, tidak diubah */
.gallery-section {
  padding: 48px 20px;
  background: linear-gradient(135deg, #f7f7f7, #ececec);
  text-align: center;
  overflow: hidden;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: #222;
  font-family: "Segoe UI", Arial, sans-serif;
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
}

.gallery-item {
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.07);
  background: #e3e3e3;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.gallery-item:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
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

.area1 { grid-area: area1; }
.area2 { grid-area: area2; }
.area3 { grid-area: area3; }
.area4 { grid-area: area4; }
.area5 { grid-area: area5; }
.area6 { grid-area: area6; }
.area7 { grid-area: area7; }
.area8 { grid-area: area8; }

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
