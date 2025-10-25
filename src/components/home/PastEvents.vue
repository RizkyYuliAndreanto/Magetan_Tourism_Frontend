<template>
  <div class="past-events-section">
    <div class="section-header">
      <h2 class="section-title-elegant">Event Sebelumnya</h2>
    </div>

    <!-- ganti: tetap pakai wrapper, tapi tanpa transform/scale -->
    <div v-if="events.length > 0" class="desktop-scale-box">
      <div class="past-events-layout desktop-canvas">
        <div class="featured-past-event">
          <div class="portrait-event-card">
            <div class="portrait-date-badge">
              <div class="date-day">
                {{ formatDate(events[0].tanggal_mulai, "day") }}
              </div>
              <div class="date-month">
                {{ formatDate(events[0].tanggal_mulai, "monthYear") }}
              </div>
            </div>

            <div class="portrait-image-container">
              <img
                v-if="events[0].gambar_event"
                :src="getEventImage(events[0].gambar_event)"
                :alt="events[0].nama_event"
                class="portrait-event-image" />
              <div v-else class="portrait-no-image">
                <div class="no-image-content">
                  <span class="no-image-icon">🎉</span>
                  <span class="no-image-text">Event Image</span>
                </div>
              </div>
            </div>

            <div class="portrait-event-overlay">
              <h3 class="portrait-event-title">
                {{ events[0].nama_event }}
              </h3>
              <p class="portrait-event-description">
                {{
                  events[0].deskripsi_event
                    ? events[0].deskripsi_event.substring(0, 100) + "..."
                    : "Deskripsi event akan segera tersedia"
                }}
              </p>
              <div class="portrait-event-details">
                <div class="event-location" v-if="events[0].lokasi_event">
                  <span class="location-icon">📍</span>
                  {{ events[0].lokasi_event }}
                </div>
                <div
                  class="event-gallery"
                  v-if="
                    events[0].galeriEvent && events[0].galeriEvent.length > 0
                  ">
                  <span class="gallery-icon">🖼️</span>
                  {{ events[0].galeriEvent.length }} Foto
                </div>
              </div>
            </div>

            <div class="portrait-hover-overlay">
              <router-link
                :to="`/event/${events[0].id_event}`"
                class="portrait-detail-button">
                Lihat Detail
              </router-link>
            </div>
          </div>
        </div>

        <div class="media-gallery-section">
          <div
            v-if="events[0].galeriEvent && events[0].galeriEvent.length > 0"
            class="gallery-grid">
            <div
              v-for="(media, index) in events[0].galeriEvent.slice(0, 6)"
              :key="index"
              class="gallery-item"
              :class="{
                'gallery-more': index === 5 && events[0].galeriEvent.length > 6,
              }">
              <div class="gallery-image-container">
                <img
                  :src="getEventImage(media.path_file)"
                  :alt="`Gallery ${index + 1}`"
                  class="gallery-image" />

                <div
                  v-if="index === 5 && events[0].galeriEvent.length > 6"
                  class="gallery-more-overlay">
                  <div class="more-count">
                    +{{ events[0].galeriEvent.length - 5 }}
                  </div>
                  <div class="more-text">Foto</div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="no-gallery">
            <div class="no-gallery-content">
              <span class="no-gallery-icon">🖼️</span>
              <p class="no-gallery-text">Belum ada galeri</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-events-elegant">
      <span class="no-events-icon">📚</span>
      <p class="no-events-text">Belum ada event sebelumnya</p>
      <p class="no-events-subtext">
        Event yang telah berlalu akan muncul di sini
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
  events: {
    type: Array,
    required: true,
  },
});

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const formatDate = (dateString, type) => {
  const date = new Date(dateString);
  if (type === "day") {
    return date.getDate();
  } else if (type === "monthYear") {
    return date.toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });
  }
};

const getEventImage = (path) => {
  if (!path) {
    return "https://via.placeholder.com/250x350.png?text=No+Image";
  }
  return `${backendUrl}${path}`;
};

const initAnimations = () => {
  gsap.from(".featured-past-event", {
    opacity: 0,
    x: -60,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".past-events-layout",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.from(".gallery-item", {
    opacity: 0,
    scale: 0.8,
    y: 30,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".media-gallery-section",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });
};

onMounted(() => {
  if (props.events.length > 0) {
    initAnimations();
  }
});
</script>

<style scoped>
/* ===== VARIABLES & MIXINS ===== */
:root {
  --royal-blue: #1e3a8a;
  --gold-accent: #d4af37;
  --bronze-gold: #cd7f32;
  --pearl-white: #ffffff;
  --soft-gray: #e2e8f0;
  --charcoal: #374151;
  --cultural-gradient: linear-gradient(
    135deg,
    #f8fafc 0%,
    #e6f2ff 50%,
    #e2e8f0 100%
  );
  --gold-gradient: linear-gradient(
    135deg,
    var(--gold-accent) 0%,
    var(--bronze-gold) 100%
  );
  --premium-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
  --premium-transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* ===== COMPONENTS ===== */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 5;
}

.section-title-elegant {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--royal-blue);
  margin: 0 0 1.5rem 0;
  line-height: 1.2;
  text-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
}

.past-events-section {
  padding: 4rem 2rem;
  background: rgba(248, 250, 252, 0.5);
  position: relative;
  z-index: 5;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: -20px;
}

.past-events-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: start;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 0.5rem;
}

.featured-past-event {
  position: relative;
  height: 100%;
}

.portrait-event-card {
  position: relative;
  aspect-ratio: 3/4;
  height: auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--premium-shadow);
  transition: var(--premium-transition);
  cursor: pointer;
}

.portrait-event-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 25px 50px rgba(30, 58, 138, 0.25);
}

.portrait-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.portrait-event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.portrait-event-card:hover .portrait-event-image {
  transform: scale(1.1);
}

.portrait-no-image {
  width: 100%;
  height: 100%;
  background: var(--cultural-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}

.portrait-date-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.8rem;
  border-radius: 12px;
  text-align: center;
  min-width: 60px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 3;
}

.date-day {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--royal-blue);
  line-height: 1;
}

.date-month {
  display: block;
  font-size: 0.75rem;
  color: var(--charcoal);
  text-transform: uppercase;
  margin-top: 0.2rem;
}

.portrait-event-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    transparent 0%,
    rgba(0, 0, 0, 0.4) 40%,
    rgba(0, 0, 0, 0.8) 100%
  );
  padding: 2rem 1rem 1rem;
  color: white;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease;
}

.portrait-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

.portrait-event-card:hover .portrait-hover-overlay {
  opacity: 1;
  pointer-events: all;
}

.portrait-event-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.portrait-event-description {
  font-size: 0.8rem;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  opacity: 0.9;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.portrait-event-details {
  margin-bottom: 0;
}

.event-location,
.event-time {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  margin-bottom: 0.2rem;
  opacity: 0.85;
}

.location-icon,
.time-icon {
  font-size: 1rem;
}

.portrait-detail-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--gold-gradient);
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.portrait-detail-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.no-events-elegant {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--royal-blue);
}

.no-events-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.8;
  color: var(--gold-accent);
}

.no-events-text {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--royal-blue);
  text-shadow: 0 2px 4px rgba(30, 58, 138, 0.3);
}

.no-events-subtext {
  font-size: 1rem;
  margin: 0;
  opacity: 0.8;
  font-style: italic;
  color: var(--charcoal);
}

.event-gallery {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  margin-bottom: 0.2rem;
  opacity: 0.85;
  color: #fbbf24;
}

.gallery-icon {
  font-size: 0.8rem;
}

.media-gallery-section {
  position: relative;
  height: 100%;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 0.5rem;
  height: 100%;
}

.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
  z-index: 2;
}

.gallery-item:nth-child(1) {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
}

.gallery-item:nth-child(2) {
  grid-column: 3;
  grid-row: 1;
}

.gallery-item:nth-child(3) {
  grid-column: 3;
  grid-row: 2;
}

.gallery-item:nth-child(4) {
  grid-column: 1;
  grid-row: 3;
}

.gallery-item:nth-child(5) {
  grid-column: 2;
  grid-row: 3;
}

.gallery-item:nth-child(6) {
  grid-column: 3;
  grid-row: 3;
}

.gallery-image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.1);
}

.gallery-more-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.more-count {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.more-text {
  font-size: 0.9rem;
  opacity: 0.9;
}

.no-gallery {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: rgba(243, 244, 246, 0.5);
  border-radius: 12px;
  border: 2px dashed rgba(156, 163, 175, 0.5);
}

.no-gallery-content {
  text-align: center;
  color: #6b7280;
}

.no-gallery-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.no-gallery-text {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1200px) {
  .past-events-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .past-events-section {
    padding: 3rem 1rem;
  }
  .past-events-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    min-height: 300px;
  }
  .gallery-item:nth-child(1) {
    grid-column: 1 / 3;
    grid-row: 1;
  }
  .gallery-item:nth-child(2) {
    grid-column: 1;
    grid-row: 2;
  }
  .gallery-item:nth-child(3) {
    grid-column: 2;
    grid-row: 2;
  }
  .gallery-item:nth-child(4) {
    grid-column: 1;
    grid-row: 3;
  }
  .gallery-item:nth-child(5) {
    grid-column: 2;
    grid-row: 3;
  }
  .gallery-item:nth-child(6) {
    display: none;
  }
  .section-title-elegant {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .past-events-section {
    padding: 2rem 1rem;
  }
  .past-events-layout {
    padding: 0 1rem;
  }
  .gallery-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
    gap: 0.75rem;
    min-height: 350px;
  }
  .gallery-item:nth-child(1) {
    grid-column: 1;
    grid-row: 1 / 3;
  }
  .gallery-item:nth-child(2),
  .gallery-item:nth-child(3),
  .gallery-item:nth-child(4),
  .gallery-item:nth-child(5) {
    grid-column: 1;
    grid-row: auto;
  }
  .gallery-item:nth-child(6) {
    display: none;
  }
  .featured-image-container {
    height: 200px;
  }
  .featured-content {
    padding: 1.5rem;
  }
  .featured-event-title {
    font-size: 1.4rem;
  }
}

/* ===== Force desktop composition, fluid tanpa transform (baru) ===== */
/* Wrapper full width, tanpa scale transform agar tidak terpotong di mobile */
.desktop-scale-box {
  width: 100%;
}

/* Kanvas mengikuti lebar container sampai 900px, tetap center */
.desktop-canvas {
  width: min(100%, 900px);
  max-width: 900px;
  margin: 0 auto;
}

/* Pertahankan 2 kolom di semua viewport dan pakai gap/fluid ukuran */
.desktop-canvas.past-events-layout {
  grid-template-columns: repeat(2, minmax(240px, 1fr)) !important;
  gap: clamp(0.75rem, 2vw, 1rem) !important;
  padding: 0 clamp(0.25rem, 1vw, 0.5rem) !important;
}

/* Galeri tetap 3x2 di semua viewport */
.desktop-canvas .gallery-grid {
  grid-template-columns: repeat(3, 1fr) !important;
  grid-template-rows: repeat(2, 1fr) !important;
  gap: clamp(0.4rem, 1vw, 0.5rem) !important;
  min-height: 100% !important;
}

/* Posisi item galeri seperti desktop dan item ke-6 tetap muncul */
.desktop-canvas .gallery-item:nth-child(1) {
  grid-column: 1 / 3 !important;
  grid-row: 1 / 3 !important;
}
.desktop-canvas .gallery-item:nth-child(2) {
  grid-column: 3 !important;
  grid-row: 1 !important;
}
.desktop-canvas .gallery-item:nth-child(3) {
  grid-column: 3 !important;
  grid-row: 2 !important;
}
.desktop-canvas .gallery-item:nth-child(4) {
  grid-column: 1 !important;
  grid-row: 3 !important;
}
.desktop-canvas .gallery-item:nth-child(5) {
  grid-column: 2 !important;
  grid-row: 3 !important;
}
.desktop-canvas .gallery-item:nth-child(6) {
  grid-column: 3 !important;
  grid-row: 3 !important;
  display: block !important;
}

/* Fluid sizing komponen agar proporsional di layar kecil */
.desktop-canvas .portrait-event-card {
  border-radius: clamp(14px, 2vw, 20px);
}
.desktop-canvas .portrait-event-title {
  font-size: clamp(0.95rem, 1.6vw, 1.1rem);
}
.desktop-canvas .portrait-event-description {
  font-size: clamp(0.78rem, 1.3vw, 0.9rem);
}
.desktop-canvas .event-location,
.desktop-canvas .event-time {
  font-size: clamp(0.7rem, 1.2vw, 0.8rem);
}
.desktop-canvas .portrait-detail-button {
  padding: clamp(0.5rem, 1vw, 0.7rem) clamp(1rem, 2vw, 1.5rem);
  font-size: clamp(0.8rem, 1.4vw, 0.9rem);
}

/* Badge tanggal ikut mengecil */
.desktop-canvas .portrait-date-badge {
  padding: clamp(0.5rem, 1.2vw, 0.8rem);
  min-width: clamp(48px, 6vw, 60px);
}
.desktop-canvas .date-day {
  font-size: clamp(1.1rem, 2.4vw, 1.5rem);
}
.desktop-canvas .date-month {
  font-size: clamp(0.6rem, 1.2vw, 0.75rem);
}
/* ===== end Force desktop composition ===== */
</style>
