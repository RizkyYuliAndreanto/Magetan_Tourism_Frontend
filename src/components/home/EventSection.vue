<template>
  <section class="event-section">
    <div class="event-header">
      <h2 class="section-title">Event</h2>
    </div>

    <div class="coming-soon-section">
      <div class="section-divider">
        <h3 class="section-subtitle">Coming soon</h3>
        <span class="divider-line"></span>
      </div>
      <div class="coming-soon-grid">
        <div
          v-for="(event, index) in comingSoonEvents.slice(0, 3)"
          :key="event.id_event"
          class="event-card">
          <div class="card-date">
            <span class="day">{{
              formatDate(event.tanggal_mulai, "day")
            }}</span>
            <span class="month">{{
              formatDate(event.tanggal_mulai, "monthYear")
            }}</span>
          </div>
          <div class="card-image-wrapper">
            <img
              :src="getEventImage(event.gambar_event)"
              :alt="`Flyer ${event.nama_event}`"
              class="event-flyer" />
          </div>
          <p class="event-title">{{ event.nama_event }}</p>
        </div>
      </div>
      <p v-if="comingSoonEvents.length === 0" class="no-events-message">
        Tidak ada event yang akan datang saat ini.
      </p>
    </div>

    <div class="past-events-section">
      <div class="section-divider">
        <h3 class="section-subtitle">Past Events</h3>
        <span class="divider-line"></span>
      </div>
      <div v-if="pastEvents.length > 0" class="past-events-grid">
        <div class="past-card-left">
          <div class="card-date">
            <span class="day">{{
              formatDate(pastEvents[0].tanggal_mulai, "day")
            }}</span>
            <span class="month">{{
              formatDate(pastEvents[0].tanggal_mulai, "monthYear")
            }}</span>
          </div>
          <div class="card-image-wrapper">
            <img
              :src="getEventImage(pastEvents[0].gambar_event)"
              :alt="`Flyer ${pastEvents[0].nama_event}`"
              class="event-flyer" />
          </div>
          <p class="event-title">{{ pastEvents[0].nama_event }}</p>
        </div>
        <div class="divider-vertical"></div>
        <div class="past-card-right">
          <div
            class="gallery-masonry"
            :class="`gallery-count-${Math.min(
              pastEvents[0].galeriEvent.length,
              5
            )}`">
            <template
              v-for="(media, idx) in pastEvents[0].galeriEvent.slice(0, 5)"
              :key="idx">
              <div class="gallery-item">
                <img
                  :src="`${backendUrl}${media.path_file}`"
                  :alt="media.deskripsi_file || 'Media Galeri'"
                  class="gallery-image" />
                <div
                  v-if="idx === 4 && pastEvents[0].galeriEvent.length > 5"
                  class="gallery-overlay">
                  +{{ pastEvents[0].galeriEvent.length - 5 }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <p v-else class="no-events-message">
        Tidak ada event yang sudah berlalu.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const comingSoonEvents = ref([]);
const pastEvents = ref([]);
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
});
</script>

<style scoped>
.event-section {
  padding: 0;
  background: #fff;
  font-family: "Poppins", Arial, sans-serif;
  color: #222;
}

.event-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 0 0 0;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
}

.coming-soon-section {
  background: #cfcfcf;
  padding: 24px 0 32px 0;
}

.section-divider {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  padding-left: 32px;
}

.section-subtitle {
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  margin-right: 18px;
}

.divider-line {
  flex-grow: 1;
  height: 3px;
  background: #222;
  border-radius: 2px;
}

.coming-soon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 0 32px;
}

.event-card {
  background: #dedede;
  border-radius: 24px;
  padding: 24px 12px 18px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  text-align: center;
  min-height: 260px;
  position: relative;
}

.card-date {
  background: #8c8c8c;
  color: #fff;
  padding: 10px 18px 6px 18px;
  border-radius: 16px 16px 8px 8px;
  font-weight: bold;
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
  position: absolute;
  left: 18px;
  top: 18px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
}

.day {
  font-size: 1.5rem;
  line-height: 1;
  font-weight: 700;
}

.month {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2px;
}

.card-image-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1.2;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 10px;
  margin-top: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
}

.event-flyer {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #fff;
}

.event-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 18px 0 0 0;
  color: #222;
}

/* Past Events */
.past-events-section {
  background: #fff;
  padding: 24px 0 32px 0;
}

.past-events-grid {
  display: grid;
  grid-template-columns: 1fr 8px 2fr;
  gap: 0;
  padding: 0 32px;
  align-items: stretch;
}

.past-card-left {
  background: #dedede;
  border-radius: 24px 0 0 24px;
  padding: 24px 12px 18px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 220px;
  position: relative;
  justify-content: center;
}

.past-card-right {
  background: #dedede;
  border-radius: 0 24px 24px 0;
  padding: 24px 24px 18px 24px;
  display: flex;
  align-items: center;
  min-height: 220px;
  justify-content: center;
  text-align: center;
}

/* Grid media galeri */
.gallery-masonry {
  display: grid;
  width: 100%;
  height: 100%;
  gap: 12px;
}

.gallery-count-1 {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}
.gallery-count-2 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
}
.gallery-count-3 {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
}
.gallery-count-4 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
.gallery-count-5 {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.gallery-item {
  background: #e3e3e3;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #fff;
  display: block;
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: rgba(30, 30, 30, 0.55);
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  z-index: 2;
}

/* Responsive */
@media (max-width: 900px) {
  .coming-soon-grid {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 0 8px;
  }
  .past-events-grid {
    grid-template-columns: 1fr;
    gap: 0;
    padding: 0 8px;
  }
  .past-card-left,
  .past-card-right {
    border-radius: 24px;
    min-height: 160px;
    margin-bottom: 12px;
  }
  .divider-vertical {
    display: none;
  }
  .gallery-masonry {
    gap: 8px;
  }
  .gallery-count-1,
  .gallery-count-2,
  .gallery-count-3 {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fit, minmax(80px, 1fr));
  }
  .gallery-count-4,
  .gallery-count-5 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
  .gallery-item {
    min-height: 80px;
  }
}
@media (max-width: 600px) {
  .event-header {
    padding: 18px 0 0 0;
  }
  .section-title {
    font-size: 1.3rem;
  }
  .section-subtitle {
    font-size: 1.1rem;
  }
  .coming-soon-section,
  .past-events-section {
    padding: 12px 0 18px 0;
  }
  .card-date {
    font-size: 1rem;
    padding: 7px 10px 4px 10px;
    left: 10px;
    top: 10px;
    min-width: 50px;
  }
  .event-title,
  .event-description {
    font-size: 1rem;
  }
  .gallery-masonry {
    gap: 6px;
  }
  .gallery-count-1,
  .gallery-count-2,
  .gallery-count-3,
  .gallery-count-4,
  .gallery-count-5 {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(auto-fit, minmax(60px, 1fr));
  }
  .gallery-item {
    min-height: 60px;
  }
}
</style>
