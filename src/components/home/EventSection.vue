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
          class="event-card"
          :style="{
            backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.7) 60%, rgba(0,123,255,0.08) 100%), url(${getEventImage(
              event.gambar_event
            )})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }">
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
            <div class="image-overlay"></div>
          </div>
          <div class="event-info">
            <p class="event-title">{{ event.nama_event }}</p>
            <p v-if="event.deskripsi_event" class="event-desc">
              {{ event.deskripsi_event.slice(0, 80) }}...
            </p>
            <router-link
              :to="`/event/${event.id_event}`"
              class="event-detail-btn"
              >Lihat Detail</router-link
            >
          </div>
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
        <div
          class="event-card past-card-left"
          :style="{
            backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.7) 60%, rgba(0,123,255,0.08) 100%), url(${getEventImage(
              pastEvents[0].gambar_event
            )})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }">
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
            <div class="image-overlay"></div>
          </div>
          <div class="event-info">
            <p class="event-title">{{ pastEvents[0].nama_event }}</p>
            <p v-if="pastEvents[0].deskripsi_event" class="event-desc">
              {{ pastEvents[0].deskripsi_event.slice(0, 80) }}...
            </p>
            <router-link
              :to="`/event/${pastEvents[0].id_event}`"
              class="event-detail-btn"
              >Lihat Detail</router-link
            >
          </div>
        </div>
        <div class="divider-vertical"></div>
        <div class="past-card-right">
          <div
            class="gallery-masonry"
            :class="`gallery-count-${Math.min(pastGallery.length || 1, 5)}`">
            <template v-if="pastGallery.length">
              <div
                v-for="(img, idx) in pastGallery.slice(0, 5)"
                :key="`past-gallery-${idx}`"
                class="gallery-item">
                <img :src="img" alt="Media galeri" class="gallery-image" />
                <div
                  v-if="idx === 4 && pastGallery.length > 5"
                  class="gallery-overlay">
                  +{{ pastGallery.length - 5 }}
                </div>
              </div>
            </template>
            <template v-else>
              <div class="gallery-item">
                <img
                  src="https://via.placeholder.com/200x140.png?text=Tidak+ada+media"
                  alt="Tidak ada media"
                  class="gallery-image" />
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
import { ref, onMounted, computed } from "vue";
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

// Computed gallery for past event (first item)
const pastGallery = computed(() => {
  const ev = pastEvents.value?.[0] || {};
  const list = ev.galeriEvent || ev.galeri || ev.media_galeri || ev.media || [];
  if (!Array.isArray(list)) return [];
  return list
    .map((m) => {
      const src = m?.path_file || m?.url || m?.gambar || m?.src;
      if (!src) return null;
      return src.startsWith("http") ? src : `${backendUrl}${src}`;
    })
    .filter(Boolean);
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
  
  color: #fff;
  border-radius: 0 0 32px 32px;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.09);
  margin-bottom: 0;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  color: #060202;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.13);
  padding: 18px 0 8px 0;
}

.coming-soon-section {
  background: linear-gradient(135deg, #e3f0fb 0%, #cfcfcf 100%);
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
  background: linear-gradient(180deg, #dedede 80%, #e3f0fb 100%);
  border-radius: 24px;
  padding: 24px 12px 18px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 123, 255, 0.08);
  text-align: center;
  min-height: 260px;
  position: relative;
  border: 2px solid #e3eaf5;
  overflow: hidden;
  transition: box-shadow 0.3s, border-color 0.3s, transform 0.3s;
}

.event-card:hover {
  box-shadow: 0 8px 32px rgba(0, 123, 255, 0.18);
  border-color: #007bff;
  transform: translateY(-6px) scale(1.03);
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
  margin-bottom: 0;
  margin-top: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e3f0fb;
  position: relative;
  min-height: 180px;
}

.event-flyer {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: transparent;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.08);
}

.image-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    0deg,
    rgba(0, 123, 255, 0.08) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  border-radius: 12px;
  pointer-events: none;
}

.event-info {
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 0 0 18px 18px;
  padding: 12px 8px 16px 8px;
  margin-top: -8px;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.event-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #007bff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.event-desc {
  font-size: 0.95rem;
  color: #222;
  margin: 0 0 8px 0;
  font-style: italic;
  opacity: 0.85;
  text-align: center;
}

.event-detail-btn {
  margin-top: 0;
  padding: 8px 22px;
  background: linear-gradient(90deg, #007bff 0%, #009fe3 100%);
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.09);
  border: none;
  transition: background 0.2s, box-shadow 0.2s, transform 0.2s;
  display: inline-block;
}

.event-detail-btn:hover {
  background: linear-gradient(90deg, #009fe3 0%, #007bff 100%);
  color: #fff;
  transform: translateY(-2px) scale(1.05);
}

/* Past Events */
.past-events-section {
  background: #fff;
  padding: 24px 0 32px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.past-events-grid {
  display: grid;
  grid-template-columns: 1fr 8px 2fr;
  gap: 0;
  padding: 0 32px;
  align-items: stretch;
  max-width: 100%;
  box-sizing: border-box;
}

.past-card-left {
  background: linear-gradient(180deg, #dedede 80%, #e3f0fb 100%);
  border-radius: 24px;
  padding: 24px 12px 18px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 260px;
  position: relative;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 123, 255, 0.08);
  border: 2px solid #e3eaf5;
  overflow: hidden;
  transition: box-shadow 0.3s, border-color 0.3s, transform 0.3s;
}

.past-card-left:hover {
  box-shadow: 0 8px 32px rgba(0, 123, 255, 0.18);
  border-color: #007bff;
  transform: translateY(-6px) scale(1.03);
}

.past-card-right {
  background: #dedede;
  border-radius: 24px;
  padding: 24px 24px 18px 24px;
  display: flex;
  align-items: stretch; /* let child fill height */
  min-height: 220px;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  position: relative; /* anchor absolute gallery */
}

/* Grid media galeri */
.gallery-masonry {
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 100%;
  gap: 12px;
  max-width: 100%;
  /* grid fills the card; remove explicit max height so it matches parent */
  overflow: hidden;
  box-sizing: border-box;
  position: absolute; /* prevent parent growth by content */
  inset: 0; /* fill past-card-right */
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
  /* 5 item: tata letak 3 kolom x 2 baris, item ke-5 melebar 2 kolom */
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-template-areas:
    "a b c"
    "d e e";
}

/* Pemetaan area untuk 5 item */
.gallery-count-5 .gallery-item:nth-child(1) {
  grid-area: a;
}
.gallery-count-5 .gallery-item:nth-child(2) {
  grid-area: b;
}
.gallery-count-5 .gallery-item:nth-child(3) {
  grid-area: c;
}
.gallery-count-5 .gallery-item:nth-child(4) {
  grid-area: d;
}
.gallery-count-5 .gallery-item:nth-child(5) {
  grid-area: e;
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
  min-height: 60px;
  min-width: 60px;
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
  .gallery-count-4 {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
  .gallery-count-5 {
    /* 5 item pada tablet: 2 kolom x 3 baris, item ke-5 melebar 2 kolom */
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-areas:
      "a b"
      "c d"
      "e e";
  }
  .gallery-count-5 .gallery-item:nth-child(1) {
    grid-area: a;
  }
  .gallery-count-5 .gallery-item:nth-child(2) {
    grid-area: b;
  }
  .gallery-count-5 .gallery-item:nth-child(3) {
    grid-area: c;
  }
  .gallery-count-5 .gallery-item:nth-child(4) {
    grid-area: d;
  }
  .gallery-count-5 .gallery-item:nth-child(5) {
    grid-area: e;
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
