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
  --pearl-white: #ffffff;
}

/* ===== MAIN EVENT SECTION ===== */
.event-section {
  position: relative;
  min-height: 650px;
  font-family: "Playfair Display", "Georgia", serif;
  color: #374151;
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

.event-header {
  position: relative;
  padding: 10px 2rem 60px 2rem;
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
</style>