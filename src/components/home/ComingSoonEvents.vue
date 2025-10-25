<template>
  <div class="coming-soon-section">
    <div class="section-header">
      <h2 class="section-title-elegant">Event Mendatang</h2>
    </div>

    <div v-if="events.length > 0" class="portrait-events-grid">
      <div
        v-for="event in events.slice(0, 6)"
        :key="event.id_event"
        class="portrait-event-card">
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
  gsap.from(".portrait-event-card", {
    opacity: 0,
    y: 80,
    rotationY: 15,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".portrait-events-grid",
      start: "top 80%",
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

.coming-soon-section {
  padding: 1rem 1rem;
  position: relative;
  z-index: 5;
}

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

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1200px) {
  .portrait-events-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 300px));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .coming-soon-section {
    padding: 3rem 1rem;
  }
  .portrait-events-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 280px));
    gap: 1rem;
  }
  .portrait-event-card {
    aspect-ratio: 3/4;
  }
}

@media (max-width: 480px) {
  .coming-soon-section {
    padding: 2rem 1rem;
  }
  .portrait-events-grid {
    grid-template-columns: 1fr;
  }
  .section-title-elegant {
    font-size: 1.8rem;
  }
}
</style>
