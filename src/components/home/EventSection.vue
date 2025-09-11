<template>
  <section class="event-section">
    <div class="event-header">
      <div class="header-background"></div>
      <div class="header-content">
        <h1 class="section-title">Event</h1>
        <p class="section-subtitle-main">
          Temukan berbagai event menarik di Magetan
        </p>
      </div>
    </div>

    <div class="coming-soon-section">
      <div class="section-header">
        <h2 class="section-title-elegant">Event Mendatang</h2>
      </div>

      <div v-if="comingSoonEvents.length > 0" class="portrait-events-grid">
        <div
          v-for="event in comingSoonEvents.slice(0, 6)"
          :key="event.id_event"
          class="portrait-event-card"
          ref="eventCards">
          <div class="portrait-date-badge">
            <div class="date-day">
              {{ formatDate(event.tanggal_mulai, "day") }}
            </div>
            <div class="date-month">
              {{ formatDate(event.tanggal_mulai, "monthYear") }}
            </div>
          </div>

          <div class="portrait-image-container">
            <img
              v-if="event.gambar_event"
              :src="getEventImage(event.gambar_event)"
              :alt="event.nama_event"
              class="portrait-event-image" />
            <div v-else class="portrait-no-image">
              <div class="no-image-content">
                <span class="no-image-icon">🎉</span>
                <span class="no-image-text">Event Image</span>
              </div>
            </div>
          </div>

          <div class="portrait-event-overlay">
            <h3 class="portrait-event-title">{{ event.nama_event }}</h3>
            <p class="portrait-event-description">
              {{
                event.deskripsi_event
                  ? event.deskripsi_event.substring(0, 100) + "..."
                  : "Deskripsi event akan segera tersedia"
              }}
            </p>
            <div class="portrait-event-details">
              <div class="event-location" v-if="event.lokasi">
                <span class="location-icon">📍</span>
                {{ event.lokasi }}
              </div>
              <div class="event-time" v-if="event.waktu_mulai">
                <span class="time-icon">⏰</span>
                {{ event.waktu_mulai }}
              </div>
            </div>
          </div>

          <div class="portrait-hover-overlay">
            <router-link
              :to="`/event/${event.id_event}`"
              class="portrait-detail-button">
              Lihat Detail
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="no-events-elegant">
        <span class="no-events-icon">📅</span>
        <p class="no-events-text">Belum ada event mendatang</p>
        <p class="no-events-subtext">Stay tuned untuk event-event menarik!</p>
      </div>
    </div>

    <div class="past-events-section">
      <div class="section-header">
        <h2 class="section-title-elegant">Event Sebelumnya</h2>
      </div>

      <div v-if="pastEvents.length > 0" class="past-events-layout">
        <div class="featured-past-event">
          <div class="portrait-event-card">
            <div class="portrait-date-badge">
              <div class="date-day">
                {{ formatDate(pastEvents[0].tanggal_mulai, "day") }}
              </div>
              <div class="date-month">
                {{ formatDate(pastEvents[0].tanggal_mulai, "monthYear") }}
              </div>
            </div>

            <div class="portrait-image-container">
              <img
                v-if="pastEvents[0].gambar_event"
                :src="getEventImage(pastEvents[0].gambar_event)"
                :alt="pastEvents[0].nama_event"
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
                {{ pastEvents[0].nama_event }}
              </h3>
              <p class="portrait-event-description">
                {{
                  pastEvents[0].deskripsi_event
                    ? pastEvents[0].deskripsi_event.substring(0, 100) + "..."
                    : "Deskripsi event akan segera tersedia"
                }}
              </p>
              <div class="portrait-event-details">
                <div class="event-location" v-if="pastEvents[0].lokasi_event">
                  <span class="location-icon">📍</span>
                  {{ pastEvents[0].lokasi_event }}
                </div>
                <div
                  class="event-gallery"
                  v-if="
                    pastEvents[0].galeriEvent &&
                    pastEvents[0].galeriEvent.length > 0
                  ">
                  <span class="gallery-icon">🖼️</span>
                  {{ pastEvents[0].galeriEvent.length }} Foto
                </div>
              </div>
            </div>

            <div class="portrait-hover-overlay">
              <router-link
                :to="`/event/${pastEvents[0].id_event}`"
                class="portrait-detail-button">
                Lihat Detail
              </router-link>
            </div>
          </div>
        </div>

        <div class="media-gallery-section">
          <div
            v-if="
              pastEvents[0].galeriEvent && pastEvents[0].galeriEvent.length > 0
            "
            class="gallery-grid">
            <div
              v-for="(media, index) in pastEvents[0].galeriEvent.slice(0, 6)"
              :key="index"
              class="gallery-item"
              :class="{
                'gallery-more':
                  index === 5 && pastEvents[0].galeriEvent.length > 6,
              }">
              <div class="gallery-image-container">
                <img
                  :src="getEventImage(media.path_file)"
                  :alt="`Gallery ${index + 1}`"
                  class="gallery-image" />

                <div
                  v-if="index === 5 && pastEvents[0].galeriEvent.length > 6"
                  class="gallery-more-overlay">
                  <div class="more-count">
                    +{{ pastEvents[0].galeriEvent.length - 5 }}
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

      <div v-else class="no-events-elegant">
        <span class="no-events-icon">📚</span>
        <p class="no-events-text">Belum ada event sebelumnya</p>
        <p class="no-events-subtext">
          Event yang telah berlalu akan muncul di sini
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const comingSoonEvents = ref([]);
const pastEvents = ref([]);
const eventCards = ref([]);
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

const fetchEvents = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/event`);
    const events = response.data;
    const now = new Date();

    const upcoming = events.filter(
      (event) => new Date(event.tanggal_selesai) >= now
    );
    const passed = events.filter(
      (event) => new Date(event.tanggal_selesai) < now
    );

    comingSoonEvents.value = upcoming.sort(
      (a, b) => new Date(a.tanggal_mulai) - new Date(b.tanggal_mulai)
    );
    pastEvents.value = passed.sort(
      (a, b) => new Date(b.tanggal_selesai) - new Date(a.tanggal_selesai)
    );
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

onMounted(() => {
  fetchEvents();

  // Initialize premium animations
  initPremiumAnimations();
});

const initPremiumAnimations = () => {
  // Header entrance animation
  const headerTl = gsap.timeline();

  headerTl
    .from(".section-title", {
      opacity: 0,
      y: -50,
      scale: 0.9,
      duration: 1,
      ease: "back.out(1.7)",
    })
    .from(
      ".section-subtitle-main",
      {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.5"
    );

  // Premium event cards animation
  gsap.from(".premium-event-card", {
    opacity: 0,
    y: 80,
    rotationY: 15,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".premium-events-grid",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  // Animated date badges
  gsap.from(".animated-date-badge", {
    opacity: 0,
    scale: 0,
    rotation: 180,
    duration: 1,
    ease: "back.out(2)",
    stagger: 0.15,
    delay: 0.5,
    scrollTrigger: {
      trigger: ".premium-events-grid",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  // Gallery items animation
  gsap.from(".refined-gallery-item", {
    opacity: 0,
    scale: 0.8,
    y: 30,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".refined-gallery-masonry",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });

  // Featured past event animation
  gsap.from(".featured-past-event", {
    opacity: 0,
    x: -60,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".premium-past-grid",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  // Continuous animations
  gsap.to(".date-glow", {
    opacity: 0.8,
    scale: 1.2,
    duration: 2,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
    stagger: 0.3,
  });

  gsap.to(".button-shine", {
    x: "200%",
    duration: 2,
    ease: "power2.inOut",
    repeat: -1,
    repeatDelay: 3,
    stagger: 0.5,
  });
};
</script>

<style scoped>
/* ===== PREMIUM VARIABLES ===== */
:root {
  --royal-blue: #1e3a8a;
  --deep-navy: #1e293b;
  --ivory-white: #f8fafc;
  --gold-accent: #d4af37;
  --bronze-gold: #cd7f32;
  --pearl-white: #ffffff;
  --soft-gray: #e2e8f0;
  --charcoal: #374151;
  --sapphire: #0f4c75;

  --cultural-gradient: linear-gradient(
    135deg,
    var(--ivory-white) 0%,
    #e6f2ff 50%,
    var(--soft-gray) 100%
  );
  --gold-gradient: linear-gradient(
    135deg,
    var(--gold-accent) 0%,
    var(--bronze-gold) 100%
  );
  --blue-gradient: linear-gradient(
    135deg,
    var(--royal-blue) 0%,
    var(--sapphire) 100%
  );

  --premium-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
  --gold-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  --cultural-glow: 0 0 30px rgba(212, 175, 55, 0.4);

  --premium-transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --smooth-ease: cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== MAIN EVENT SECTION ===== */
.event-section {
  position: relative;
  min-height: 650px;
  font-family: "Playfair Display", "Georgia", serif;
  color: var(--charcoal);
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #1e3a8a 0%,
    #2563eb 15%,
    #3b82f6 35%,
    #60a5fa 55%,
    #93c5fd 75%,
    #dbeafe 95%,
    #f0f9ff 100%
  );
}

/* Cultural Animated Background */
.event-section::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
}

.event-section::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

/* ===== PREMIUM HEADER ===== */
.event-header {
  position: relative;
  padding: 10px 2rem 60px 2rem;
  text-align: center;
  z-index: 5;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.header-content {
  position: relative;
  z-index: 5;
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 700;
  color: var(--pearl-white);
  margin: 0 0 1rem 0;
  letter-spacing: -1px;
  line-height: 0.9;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #dbeafe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
}

.section-subtitle-main {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  margin: 0 0 2rem 0;
  font-style: italic;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* ===== SECTION HEADERS ===== */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 5;
}

.section-title-elegant {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--pearl-white);
  margin: 0 0 1.5rem 0;
  line-height: 1.2;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #dbeafe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
}

/* ===== MODERN EVENT SECTION ===== */
.modern-events-section {
  max-width: 650px;
  margin: 0 auto;
  padding: 4rem 2rem;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05) 0%,
    rgba(147, 51, 234, 0.05) 50%,
    rgba(6, 182, 212, 0.05) 100%
  );
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}

.modern-events-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 30%,
      rgba(59, 130, 246, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(147, 51, 234, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 50% 50%,
      rgba(6, 182, 212, 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.section-header-modern {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
}

.section-title-modern {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #9333ea, #06b6d4);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.title-underline {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #9333ea, #06b6d4);
  margin: 0 auto;
  border-radius: 2px;
  animation: glow-pulse 2s ease-in-out infinite alternate;
}

@keyframes glow-pulse {
  from {
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }
  to {
    box-shadow: 0 0 20px rgba(147, 51, 234, 0.8);
  }
}

/* ===== MODERN EVENTS GRID ===== */
.modern-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 2;
}

/* ===== MODERN EVENT CARDS ===== */
.modern-event-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modern-event-card:hover {
  transform: translateY(-15px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

/* ===== MODERN DATE BADGE ===== */
.modern-date-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}

.date-circle {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.date-day {
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1;
}

.date-month {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.9;
}

/* ===== MODERN IMAGE CONTAINER ===== */
.modern-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.modern-event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.modern-event-card:hover .modern-event-image {
  transform: scale(1.1);
}

.modern-no-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-image-content {
  text-align: center;
  color: #6b7280;
}

.no-image-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.no-image-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.image-gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
  pointer-events: none;
}

/* ===== MODERN EVENT CONTENT ===== */
.modern-event-content {
  padding: 1.5rem;
  position: relative;
  z-index: 2;
}

.modern-event-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modern-event-description {
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.meta-icon {
  font-size: 0.9rem;
  width: 16px;
  text-align: center;
}

.meta-text {
  font-weight: 500;
}

/* ===== HOVER DETAIL OVERLAY ===== */
.hover-detail-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
  padding: 1rem 1.5rem;
  transform: translateY(100%);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modern-event-card:hover .hover-detail-overlay {
  transform: translateY(0);
}

.modern-detail-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.modern-detail-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.button-arrow {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.modern-detail-button:hover .button-arrow {
  transform: translateX(3px);
}

/* ===== PORTRAIT EVENT CARDS ===== */
.portrait-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 320px));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  justify-content: center;
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

/* Portrait Date Badge */
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

.portrait-date-badge .date-day {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--royal-blue);
  line-height: 1;
}

.portrait-date-badge .date-month {
  display: block;
  font-size: 0.75rem;
  color: var(--charcoal);
  text-transform: uppercase;
  margin-top: 0.2rem;
}

/* Portrait Event Content - Always Visible */
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

/* Portrait Hover Overlay - Only for Button */
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

/* ===== PAST EVENT CARDS ===== */
.past-event-card {
  opacity: 0.9;
}

.past-event-card:hover {
  opacity: 1;
}

.past-date-badge {
  background: linear-gradient(135deg, #6b7280, #4b5563);
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

/* ===== FEATURED PAST EVENT ===== */
.past-events-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 650px;
  margin: 0 auto;
  padding: 0 1rem;
}

.featured-past-event {
  position: relative;
}

.featured-card-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--premium-shadow);
  transition: var(--premium-transition);
  aspect-ratio: 3 / 4;
}

.featured-card-wrapper:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(30, 58, 138, 0.25);
}

.featured-background-pattern {
  position: absolute;
  inset: 0;
  background: var(--cultural-gradient);
  opacity: 0.05;
}

.featured-date-badge {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 3;
}

.featured-date-day {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--royal-blue);
  line-height: 1;
}

.featured-date-month {
  display: block;
  font-size: 0.8rem;
  color: var(--charcoal);
  text-transform: uppercase;
  margin-top: 0.2rem;
}

.featured-image-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.featured-event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.featured-card-wrapper:hover .featured-event-image {
  transform: scale(1.1);
}

.featured-no-image {
  width: 100%;
  height: 100%;
  background: var(--cultural-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
}

.featured-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    transparent 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 2;
}

.featured-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    transparent 0%,
    rgba(0, 0, 0, 0.4) 40%,
    rgba(0, 0, 0, 0.8) 100%
  );
  padding: 2rem 1.5rem 1.5rem;
  color: white;
}

.featured-category {
  font-size: 0.8rem;
  color: var(--gold-accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.featured-event-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--pearl-white);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.featured-event-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1rem 0;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.featured-event-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--gold-gradient);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  align-self: flex-start;
}

.featured-event-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.button-icon {
  transition: transform 0.3s ease;
}

.featured-event-button:hover .button-icon {
  transform: translateX(3px);
}

/* ===== ELEGANT GALLERY CONTAINER ===== */
.elegant-gallery-container {
  position: relative;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.gallery-header {
  text-align: center;
  margin-bottom: 2rem;
}

.gallery-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--pearl-white);
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.refined-gallery-masonry {
  display: grid;
  gap: 1rem;
  border-radius: 12px;
  overflow: hidden;
}

/* Gallery Grid Layouts */
.gallery-count-1 {
  grid-template-columns: 1fr;
  grid-template-rows: 250px;
}

.gallery-count-2 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 200px;
}

.gallery-count-3 {
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 150px 150px;
}

.gallery-count-3 .refined-gallery-item:nth-child(1) {
  grid-row: 1 / 3;
}
.gallery-count-3 .refined-gallery-item:nth-child(2) {
  grid-row: 1;
}
.gallery-count-3 .refined-gallery-item:nth-child(3) {
  grid-row: 2;
}

.gallery-count-4 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 150px 150px;
}

.gallery-count-5 {
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 120px 120px 120px;
}

.gallery-count-5 .refined-gallery-item:nth-child(1) {
  grid-row: 1 / 3;
}
.gallery-count-5 .refined-gallery-item:nth-child(2) {
  grid-row: 1;
}
.gallery-count-5 .refined-gallery-item:nth-child(3) {
  grid-row: 2;
}
.gallery-count-5 .refined-gallery-item:nth-child(4) {
  grid-row: 3;
  grid-column: 2;
}
.gallery-count-5 .refined-gallery-item:nth-child(5) {
  grid-row: 3;
  grid-column: 3;
}

.refined-gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.refined-gallery-item:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.gallery-image-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.refined-gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.refined-gallery-item:hover .refined-gallery-image {
  transform: scale(1.1);
}

.gallery-image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.refined-gallery-item:hover .gallery-image-overlay {
  opacity: 1;
}

.overlay-icon {
  color: white;
  font-size: 2rem;
}

.view-icon {
  width: 2rem;
  height: 2rem;
}

.gallery-more-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.more-count {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.more-text {
  font-size: 0.9rem;
  opacity: 0.9;
}

.placeholder-item .gallery-image-frame {
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.5);
}

.placeholder-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.placeholder-text {
  font-size: 0.8rem;
}

/* ===== NEW RESPONSIVE DESIGN ===== */
@media (max-width: 1200px) {
  .past-events-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .portrait-events-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 300px));
    gap: 1.5rem;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .portrait-events-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 280px));
    gap: 1rem;
    justify-content: center;
  }

  .portrait-event-card {
    aspect-ratio: 3/4;
  }

  .gallery-count-3,
  .gallery-count-5 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(3, 120px);
  }

  .gallery-count-3 .refined-gallery-item:nth-child(1),
  .gallery-count-5 .refined-gallery-item:nth-child(1) {
    grid-row: 1;
    grid-column: 1 / 3;
  }
}

@media (max-width: 480px) {
  .portrait-events-grid {
    grid-template-columns: 1fr;
  }

  .refined-gallery-masonry {
    grid-template-columns: 1fr !important;
    grid-template-rows: repeat(auto, 150px) !important;
  }

  .refined-gallery-item {
    grid-row: auto !important;
    grid-column: auto !important;
  }
}

/* ===== COMPACT STYLES - UPDATED ===== */
.section-title-compact {
  font-size: 2rem;
  font-weight: 600;
  color: var(--pearl-white);
  margin: 0 0 2rem 0;
  line-height: 1.2;
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #dbeafe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Events Grid Container */
.events-grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Modern Event Card */
.modern-event-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.modern-event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

/* Compact Date Badge */
.compact-date-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, var(--royal-blue), var(--sapphire));
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  z-index: 3;
  text-align: center;
  min-width: 60px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.date-day {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  display: block;
  font-size: 0.75rem;
  opacity: 0.9;
  text-transform: uppercase;
}

/* Event Image Container */
.event-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.modern-event-card:hover .event-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

/* Event Content */
.event-content {
  padding: 1.25rem;
}

.event-category-tag {
  font-size: 0.75rem;
  color: var(--royal-blue);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.event-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--charcoal);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.event-description {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.detail-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--royal-blue), var(--sapphire));
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.detail-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
}

/* Past Events Grid */
.past-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.past-event-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.past-event-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.past-event-image-container {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.past-event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.past-event-card:hover .past-event-image {
  transform: scale(1.05);
}

.past-event-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 40%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 1rem;
}

.overlay-date {
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.past-event-content {
  padding: 1rem;
}

.past-event-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--charcoal);
  margin: 0 0 0.8rem 0;
  line-height: 1.3;
}

.past-event-link {
  color: var(--royal-blue);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.past-event-link:hover {
  color: var(--sapphire);
}

/* No Events Message */
.no-events-message {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.no-events-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-events-message p {
  font-size: 1.1rem;
  margin: 0;
}

/* ===== PREMIUM COMING SOON SECTION ===== */
.coming-soon-section {
  padding: 1rem 1rem;
  position: relative;
  z-index: 5;
}

.premium-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* ===== PREMIUM EVENT CARDS ===== */
.premium-event-card {
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 24px;
  overflow: hidden;
  transition: var(--premium-transition);
  min-height: 450px;
  display: flex;
  flex-direction: column;
}

.premium-event-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: var(--premium-shadow);
  border-color: var(--gold-accent);
}

.card-background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23d4af37' opacity='0.03'%3E%3Cpath d='M30,5 Q35,10 40,5 Q45,10 50,5 Q45,20 40,15 Q35,20 30,15 Q25,20 20,15 Q15,20 10,15 Q15,5 20,10 Q25,5 30,10 Z'/%3E%3Ccircle cx='30' cy='30' r='15' fill='none' stroke='%23d4af37' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 60px 60px;
  z-index: 1;
  pointer-events: none;
}

.animated-date-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
}

.date-ring {
  position: relative;
  width: 80px;
  height: 80px;
  background: var(--gold-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--gold-shadow);
  border: 3px solid var(--pearl-white);
}

.date-content {
  text-align: center;
  color: var(--pearl-white);
}

.date-day {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2px;
}

.date-glow {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: var(--gold-gradient);
  border-radius: 50%;
  opacity: 0;
  z-index: -1;
}

.premium-image-container {
  position: relative;
  height: 200px;
  margin: 20px;
  margin-bottom: 0;
  z-index: 2;
}

.image-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(212, 175, 55, 0.3);
}

.premium-event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--premium-transition);
}

.premium-event-card:hover .premium-event-image {
  transform: scale(1.1);
}

.image-glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%,
    rgba(30, 58, 138, 0.1) 100%
  );
  z-index: 2;
}

.image-border-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: var(--gold-gradient);
  border-radius: 16px;
  opacity: 0;
  transition: var(--premium-transition);
  z-index: -1;
}

.premium-event-card:hover .image-border-glow {
  opacity: 0.5;
}

.glassmorphism-content {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  flex: 1;
  display: flex;
  flex-direction: column;
  z-index: 3;
}

.content-header {
  margin-bottom: 1rem;
}

.event-category {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--blue-gradient);
  color: var(--pearl-white);
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.category-icon {
  font-size: 1rem;
}

.premium-event-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--royal-blue);
  margin: 0;
  line-height: 1.3;
}

.premium-event-desc {
  font-size: 1rem;
  color: var(--charcoal);
  line-height: 1.6;
  margin: 1rem 0;
  flex: 1;
  opacity: 0.9;
}

.premium-event-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--blue-gradient);
  color: var(--pearl-white);
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: var(--premium-transition);
  position: relative;
  overflow: hidden;
  align-self: flex-start;
  box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
}

.premium-event-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.4);
  color: var(--pearl-white);
  text-decoration: none;
}

.button-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.6s ease;
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-icon {
  width: 18px;
  height: 18px;
  transition: var(--premium-transition);
  position: relative;
  z-index: 2;
}

.premium-event-button:hover .button-icon {
  transform: translateX(3px);
}

.card-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(212, 175, 55, 0.1),
    transparent
  );
  opacity: 0;
  transition: var(--premium-transition);
  z-index: 2;
  pointer-events: none;
}

.premium-event-card:hover .card-hover-overlay {
  opacity: 1;
}

/* ===== NO EVENTS ELEGANT ===== */
.no-events-elegant {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.9);
}

.no-events-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.no-events-text {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--pearl-white);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.no-events-subtext {
  font-size: 1rem;
  margin: 0;
  opacity: 0.8;
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
}

/* ===== PREMIUM PAST EVENTS SECTION ===== */
.past-events-section {
  padding: 4rem 2rem;
  background: rgba(248, 250, 252, 0.5);
  position: relative;
  z-index: 5;
  max-width: 1400px;
  margin: 0 auto;
}

/* Past Events Layout */
.past-events-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: start;
}

/* Featured Past Event (Left Side) */
.featured-past-event {
  position: relative;
  height: 100%;
}

.featured-event-card {
  position: relative;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--premium-shadow);
  transition: var(--premium-transition);
  cursor: pointer;
  max-width: 400px;
  width: 100%;
}

.featured-event-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 25px 50px rgba(30, 58, 138, 0.25);
}

.featured-date-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(212, 175, 55, 0.95);
  backdrop-filter: blur(10px);
  padding: 0.8rem;
  border-radius: 12px;
  text-align: center;
  min-width: 60px;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 3;
}

.featured-date-badge .date-day {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.featured-date-badge .date-month {
  display: block;
  font-size: 0.75rem;
  color: white;
  text-transform: uppercase;
  margin-top: 0.2rem;
  opacity: 0.9;
}

.featured-image-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.featured-event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.6s ease;
}

.featured-event-card:hover .featured-event-image {
  transform: scale(1.1);
}

.featured-no-image {
  width: 100%;
  height: 100%;
  background: var(--cultural-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
}

.featured-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    transparent 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 2;
}

.featured-content {
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
}

.featured-category {
  font-size: 0.8rem;
  color: var(--gold-accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.featured-event-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--pearl-white);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.featured-event-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1rem 0;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.featured-event-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--gold-gradient);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  align-self: flex-start;
}

.featured-event-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.button-icon {
  transition: transform 0.3s ease;
}

.featured-event-button:hover .button-icon {
  transform: translateX(3px);
}

/* Media Gallery Section (Right Side) */
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

.premium-past-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  align-items: start;
}

/* ===== FEATURED PAST EVENT ===== */
.featured-past-event {
  position: relative;
}

.featured-card-wrapper {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 24px;
  overflow: hidden;
  transition: var(--premium-transition);
  position: relative;
}

.featured-card-wrapper:hover {
  transform: translateY(-8px);
  box-shadow: var(--premium-shadow);
  border-color: var(--gold-accent);
}

.featured-background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%231e3a8a' opacity='0.02'%3E%3Cpath d='M40,10 Q50,20 60,10 Q70,20 80,10 Q70,40 60,30 Q50,40 40,30 Q30,40 20,30 Q10,40 0,30 Q10,10 20,20 Q30,10 40,20 Z'/%3E%3Ccircle cx='40' cy='40' r='20' fill='none' stroke='%231e3a8a' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 80px 80px;
  z-index: 1;
  pointer-events: none;
}

.featured-date-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  background: var(--gold-gradient);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--gold-shadow);
  border: 3px solid var(--pearl-white);
}

.featured-date-content {
  text-align: center;
  color: var(--pearl-white);
}

.featured-date-day {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.featured-date-month {
  display: block;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2px;
}

.featured-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.featured-event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--premium-transition);
}

.featured-card-wrapper:hover .featured-event-image {
  transform: scale(1.05);
}

.featured-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(30, 58, 138, 0.1) 100%
  );
  z-index: 2;
}

.featured-content {
  padding: 2rem;
  position: relative;
  z-index: 3;
}

.featured-category {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--gold-gradient);
  color: var(--pearl-white);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.featured-event-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--pearl-white);
  margin: 0 0 1rem 0;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.featured-event-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0 0 2rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.featured-event-button {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  background: var(--blue-gradient);
  color: var(--pearl-white);
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: var(--premium-transition);
  box-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
}

.featured-event-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(30, 58, 138, 0.4);
  color: var(--pearl-white);
  text-decoration: none;
}

/* ===== ELEGANT GALLERY CONTAINER ===== */
.elegant-gallery-container {
  position: relative;
}

.gallery-header {
  text-align: center;
  margin-bottom: 2rem;
}

.gallery-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--royal-blue);
  margin: 0 0 1rem 0;
}

.refined-gallery-masonry {
  display: grid;
  gap: 1rem;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.gallery-count-1 {
  grid-template-columns: 1fr;
  grid-template-rows: 300px;
}

.gallery-count-2 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 200px;
}

.gallery-count-3 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 150px 150px;
  grid-template-areas: "a b" "c c";
}

.gallery-count-3 .refined-gallery-item:nth-child(1) {
  grid-area: a;
}
.gallery-count-3 .refined-gallery-item:nth-child(2) {
  grid-area: b;
}
.gallery-count-3 .refined-gallery-item:nth-child(3) {
  grid-area: c;
}

.gallery-count-4 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 120px 120px;
}

.gallery-count-5 {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100px 100px;
  grid-template-areas: "a b c" "d e e";
}

.gallery-count-5 .refined-gallery-item:nth-child(1) {
  grid-area: a;
}
.gallery-count-5 .refined-gallery-item:nth-child(2) {
  grid-area: b;
}
.gallery-count-5 .refined-gallery-item:nth-child(3) {
  grid-area: c;
}
.gallery-count-5 .refined-gallery-item:nth-child(4) {
  grid-area: d;
}
.gallery-count-5 .refined-gallery-item:nth-child(5) {
  grid-area: e;
}

.gallery-count-6 {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 100px 100px;
}

.refined-gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: var(--premium-transition);
}

.refined-gallery-item:hover {
  transform: scale(1.05);
  z-index: 10;
}

.gallery-image-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  overflow: hidden;
}

.refined-gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--premium-transition);
}

.refined-gallery-item:hover .refined-gallery-image {
  transform: scale(1.1);
}

.gallery-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 58, 138, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--premium-transition);
}

.refined-gallery-item:hover .gallery-image-overlay {
  opacity: 1;
}

.overlay-icon {
  width: 40px;
  height: 40px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-icon {
  width: 24px;
  height: 24px;
  color: var(--royal-blue);
}

.gallery-more-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 58, 138, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--pearl-white);
  border-radius: 12px;
}

.more-count {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.more-text {
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.placeholder-item .gallery-image-frame {
  background: var(--soft-gray);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  color: var(--charcoal);
  opacity: 0.7;
}

.placeholder-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.placeholder-text {
  font-size: 0.9rem;
  margin: 0;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1200px) {
  .premium-events-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .premium-past-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .event-header {
    padding: 60px 1rem 40px 1rem;
  }

  .section-title {
    font-size: clamp(2.5rem, 8vw, 3.5rem);
  }

  .coming-soon-section,
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

  .premium-events-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .section-title-elegant {
    font-size: 2rem;
  }

  .premium-event-card {
    min-height: 400px;
  }

  .refined-gallery-masonry {
    grid-template-columns: 1fr 1fr !important;
    grid-template-areas: none !important;
  }

  .gallery-count-3 .refined-gallery-item:nth-child(3),
  .gallery-count-5 .refined-gallery-item:nth-child(5) {
    grid-area: auto;
  }
}

@media (max-width: 480px) {
  .event-header {
    padding: 40px 1rem 30px 1rem;
  }

  .section-title {
    font-size: clamp(2rem, 8vw, 2.8rem);
  }

  .section-subtitle-main {
    font-size: 1.1rem;
  }

  .coming-soon-section,
  .past-events-section {
    padding: 2rem 1rem;
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

  .section-header {
    margin-bottom: 2rem;
  }

  .section-title-elegant {
    font-size: 1.8rem;
  }

  .premium-event-card {
    min-height: 350px;
  }

  .animated-date-badge {
    top: 15px;
    left: 15px;
  }

  .date-ring {
    width: 70px;
    height: 70px;
  }

  .date-day {
    font-size: 1.6rem;
  }

  .premium-image-container {
    height: 160px;
    margin: 15px;
  }

  .glassmorphism-content {
    padding: 1.2rem;
  }

  .premium-event-title {
    font-size: 1.2rem;
  }

  .refined-gallery-masonry {
    grid-template-columns: 1fr !important;
    grid-template-areas: none !important;
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

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

@media (prefers-contrast: high) {
  .premium-event-card,
  .featured-card-wrapper {
    border: 2px solid var(--royal-blue);
  }

  .premium-event-title,
  .featured-event-title {
    color: #000000;
  }
}

.premium-event-card:focus-within,
.refined-gallery-item:focus-within {
  outline: 3px solid var(--gold-accent);
  outline-offset: 4px;
}

/* ===== PRINT STYLES ===== */
@media print {
  .event-section {
    background: white;
    box-shadow: none;
  }

  .premium-event-card,
  .featured-card-wrapper {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #000;
  }

  .premium-event-button,
  .featured-event-button {
    display: none;
  }
}
</style>
