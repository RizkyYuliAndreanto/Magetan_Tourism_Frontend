<template>
  <section class="event-section">
    <div class="event-header">
      <div class="header-content">
        <h1 class="section-title">Event</h1>
        <p class="section-subtitle-main">
          Temukan berbagai event menarik di Magetan
        </p>
      </div>
    </div>

    <ComingSoonEvents :events="comingSoonEvents" />

    <PastEvents :events="pastEvents" />
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import ComingSoonEvents from "./ComingSoonEvents.vue";
import PastEvents from "./PastEvents.vue";

const comingSoonEvents = ref([]);
const pastEvents = ref([]);
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
});
</script>

<style scoped>
/* ===== VARIABLES ===== */
:root {
  --royal-blue: #1e3a8a;
  --gold-accent: #d4af37;
  --pearl-white: #ffffff;
  --transition-blue-start: #60a5fa;
  --transition-blue-end: #1e3a8a;
  --smooth-transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* ===== MAIN EVENT SECTION ===== */
.event-section {
  position: relative;
  min-height: 650px;
  margin-top: -80px;
  padding-top: 140px;
  padding-bottom: 60px;
  font-family: "Playfair Display", "Georgia", serif;
  color: #374151;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0ea5e9 0%,
    #38bdf8 15%,
    #7dd3fc 30%,
    #bae6fd 50%,
    #e6f2ff 70%,
    #f8fafc 85%,
    #ffffff 100%
  );
  border-top: none;
  margin-bottom: 0;
  z-index: 6;
}

/* Overlay transisi tidak diperlukan karena warna sudah menyatu */

/* Bottom gradient overlay untuk transisi smooth ke section berikutnya */
.event-section::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 30%,
    rgba(248, 250, 254, 0.4) 60%,
    rgba(248, 250, 254, 0.7) 80%,
    #ffffff 100%
  );
  z-index: 1;
  pointer-events: none;
}

.event-header {
  position: relative;
  padding: 100px 2rem 60px 2rem;
  text-align: center;
  z-index: 5;
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
  color: var(--royal-blue);
  margin: 0 0 1rem 0;
  letter-spacing: -1px;
  line-height: 0.9;
  text-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
}

.section-subtitle-main {
  font-size: 1.3rem;
  color: var(--royal-blue);
  font-weight: 400;
  margin: 0 0 2rem 0;
  font-style: italic;
  text-shadow: 0 2px 4px rgba(30, 58, 138, 0.3);
  opacity: 0.8;
}

@media (max-width: 768px) {
  .event-header {
    padding: 60px 1rem 40px 1rem;
  }
  .section-title {
    font-size: clamp(2.5rem, 8vw, 3.5rem);
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
}

/* ===== WAVE ANIMATION ===== */
@keyframes complementaryWave {
  0% {
    transform: translateX(3px) scaleX(1.005);
    opacity: 0.8;
  }
  50% {
    transform: translateX(0px) scaleX(1);
    opacity: 1;
  }
  100% {
    transform: translateX(-3px) scaleX(1.005);
    opacity: 0.8;
  }
}
</style>
