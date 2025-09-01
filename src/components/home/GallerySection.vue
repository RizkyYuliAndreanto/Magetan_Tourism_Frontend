<template>
  <section class="gallery-section">
    <h2 class="section-title">Media Galeri</h2>
    <div class="gallery-masonry">
      <div
        v-for="(item, idx) in visibleImages"
        :key="idx"
        :class="['gallery-item', gridAreas[idx]]"
        :ref="(el) => (slideRefs[idx] = el)">
        <img :src="item.url" :alt="item.alt" class="gallery-image" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import gsap from "gsap";

const MAX_VISIBLE = 8; // jumlah grid sesuai firmware
const galleryImages = ref([]);
const currentIndex = ref(0);
const slideRefs = ref([]);

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

const visibleImages = computed(() => {
  // Ambil MAX_VISIBLE gambar mulai dari currentIndex
  if (galleryImages.value.length <= MAX_VISIBLE) return galleryImages.value;
  let arr = [];
  for (let i = 0; i < MAX_VISIBLE; i++) {
    arr.push(
      galleryImages.value[(currentIndex.value + i) % galleryImages.value.length]
    );
  }
  return arr;
});

onMounted(async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/media-galeri");
    galleryImages.value = res.data.map((item, idx) => ({
      url: `http://localhost:5000${item.path_file}`,
      alt: item.deskripsi_file || `Media Galeri ${idx + 1}`,
    }));
    startAutoSlide();
  } catch (err) {
    galleryImages.value = [];
  }
});

function startAutoSlide() {
  setInterval(() => {
    // GSAP animasi keluar
    slideRefs.value.forEach((el, i) => {
      if (el) {
        gsap.to(el, { opacity: 0, scale: 0.95, duration: 0.5 });
      }
    });
    setTimeout(() => {
      currentIndex.value =
        (currentIndex.value + MAX_VISIBLE) % galleryImages.value.length;
      // GSAP animasi masuk
      slideRefs.value.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, scale: 1.05 },
            { opacity: 1, scale: 1, duration: 0.7 }
          );
        }
      });
    }, 500);
  }, 9000); // ganti gambar tiap 4 detik
}
</script>

<style scoped>
.gallery-section {
  padding: 48px 20px;
  background: #fafbfc;
  text-align: left;
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
}

.gallery-item {
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.07);
  background: #e3e3e3;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  transition: box-shadow 0.2s;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* gambar proporsional, crop jika perlu */
  display: block;
  background: #fff;
}

/* Area grid sesuai firmware */
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

/* Responsive */
@media (max-width: 900px) {
  .gallery-masonry {
    grid-template-areas:
      "area1 area2"
      "area3 area4"
      "area5 area6"
      "area7 area8";
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(4, 160px);
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
