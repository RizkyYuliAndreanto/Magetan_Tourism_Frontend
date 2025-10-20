<template>
  <div class="event-view-user">
    <!-- Luxurious Cultural Background -->
    <div class="cultural-background">
      <div class="mountain-silhouettes"></div>
      <div class="temple-ornaments"></div>
      <div class="wayang-shadows"></div>
      <div class="gamelan-patterns"></div>
      <div class="batik-motifs"></div>
      <div class="floating-clouds"></div>
      <div class="cultural-glow"></div>
      <div class="tradition-particles"></div>
    </div>

    <div class="container">
      <div class="hero-section">
        <h1 class="page-title">
          <span class="title-gradient">Daftar Event</span>
          <span class="title-accent">Kebudayaan & Pariwisata</span>
        </h1>
        <p class="page-subtitle">
          Temukan informasi event menarik yang akan datang dan yang telah
          diselenggarakan
        </p>
        <div class="hero-ornament"></div>
      </div>

      <div v-if="loading" class="luxury-loading">
        <div class="cultural-spinner"></div>
        <p>Memuat daftar event...</p>
      </div>

      <div v-if="error" class="luxury-error">
        <div class="error-icon">❌</div>
        <p>
          Maaf, terjadi kesalahan saat memuat data event. Silakan coba kembali.
        </p>
      </div>

      <div
        v-if="!loading && !error && eventList.length === 0"
        class="luxury-empty">
        <div class="empty-icon">📋</div>
        <p>Belum ada event yang tersedia saat ini.</p>
      </div>

      <section class="luxury-events-section" v-if="comingSoonEvents.length > 0">
        <div class="section-header">
          <h2 class="luxury-section-title">
            <span class="title-shimmer">Coming Soon</span>
            <div class="animated-divider">
              <div class="glow-line"></div>
              <div class="cultural-icon">🎭</div>
              <div class="glow-line"></div>
            </div>
          </h2>
        </div>

        <div class="luxury-event-grid">
          <div
            v-for="(event, index) in comingSoonEvents"
            :key="event.id_event"
            class="luxury-event-card"
            :style="{ animationDelay: `${index * 0.15}s` }"
            @mouseenter="cardHover"
            @mouseleave="cardLeave">
            <!-- Premium Date Badge -->
            <div class="premium-date-badge">
              <div class="date-glow"></div>
              <span class="date-day">{{
                formatDate(event.tanggal_mulai, "day")
              }}</span>
              <span class="date-month">{{
                formatDate(event.tanggal_mulai, "monthYear")
              }}</span>
              <div class="date-ornament"></div>
            </div>

            <!-- Luxury Image Container -->
            <div class="luxury-image-container">
              <div class="image-overlay"></div>
              <img
                v-if="event.gambar_event"
                :src="baseUrl + event.gambar_event"
                :alt="`Flyer ${event.nama_event}`"
                class="luxury-event-image" />
              <div v-else class="luxury-no-image">
                <div class="no-image-icon">🎨</div>
                <span>Event Visual</span>
              </div>
              <div class="image-shine"></div>
            </div>

            <!-- Premium Content -->
            <div class="luxury-card-content">
              <h3 class="luxury-event-title">
                {{ truncateText(event.nama_event, 50) }}
              </h3>
              <p class="luxury-event-location">
                <span class="location-icon">📍</span>
                {{ event.lokasi_event }}
              </p>

              <!-- Premium Action Buttons -->
              <div class="luxury-card-actions">
                <button
                  @click="viewEventDetail(event.id_event)"
                  class="luxury-detail-button">
                  <span class="button-text">Detail</span>
                  <div class="button-ripple"></div>
                  <div class="button-glow"></div>
                  <svg
                    class="button-arrow"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path
                      d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
                  </svg>
                </button>

                <a
                  v-if="event.brosur_event"
                  :href="baseUrl + event.brosur_event"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="luxury-brosur-button">
                  <span class="button-text">Brosur</span>
                  <div class="button-ripple"></div>
                  <div class="button-glow"></div>
                  <svg
                    class="button-download"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path
                      d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </a>
              </div>
            </div>

            <!-- Card Decorative Elements -->
            <div class="card-ornaments">
              <div class="corner-decoration top-left"></div>
              <div class="corner-decoration top-right"></div>
              <div class="corner-decoration bottom-left"></div>
              <div class="corner-decoration bottom-right"></div>
            </div>
          </div>
        </div>
      </section>

      <section
        class="luxury-events-section past-events-section"
        v-if="pastEvents.length > 0">
        <div class="section-header">
          <h2 class="luxury-section-title">
            <span class="title-shimmer">Past Events</span>
            <div class="animated-divider">
              <div class="glow-line"></div>
              <div class="cultural-icon">🏛️</div>
              <div class="glow-line"></div>
            </div>
          </h2>
        </div>

        <div class="luxury-past-events">
          <div
            v-for="(event, index) in pastEvents"
            :key="event.id_event"
            class="luxury-past-event-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @mouseenter="cardHover"
            @mouseleave="cardLeave">
            <div class="past-event-left">
              <!-- Premium Past Date Badge -->
              <div class="past-date-badge">
                <div class="past-date-glow"></div>
                <span class="past-date-day">{{
                  formatDate(event.tanggal_mulai, "day")
                }}</span>
                <span class="past-date-month">{{
                  formatDate(event.tanggal_mulai, "monthYear")
                }}</span>
              </div>

              <!-- Past Event Image -->
              <div class="past-image-container">
                <img
                  v-if="event.gambar_event"
                  :src="baseUrl + event.gambar_event"
                  :alt="`Flyer ${event.nama_event}`"
                  class="past-event-image" />
                <div v-else class="past-no-image">
                  <div class="no-image-icon">🎨</div>
                  <span>Event Visual</span>
                </div>
                <div class="past-image-overlay"></div>
                <div class="past-image-shine"></div>
              </div>
            </div>

            <div class="past-event-right">
              <h3 class="past-event-title">
                {{ truncateText(event.nama_event, 70) }}
              </h3>
              <p class="past-event-location">
                <span class="location-icon">📍</span>
                {{ event.lokasi_event }}
              </p>
              <p class="past-event-description">
                {{ truncateText(event.deskripsi_event, 250) }}
              </p>

              <!-- Past Event Actions -->
              <div class="past-card-actions">
                <button
                  @click="viewEventDetail(event.id_event)"
                  class="past-detail-button">
                  <span class="button-text">Detail</span>
                  <div class="button-ripple"></div>
                  <svg
                    class="button-arrow"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path
                      d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
                  </svg>
                </button>

                <a
                  v-if="event.brosur_event"
                  :href="baseUrl + event.brosur_event"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="past-brosur-button">
                  <span class="button-text">Brosur</span>
                  <div class="button-ripple"></div>
                  <svg
                    class="button-download"
                    viewBox="0 0 24 24"
                    fill="currentColor">
                    <path
                      d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </a>
              </div>
            </div>

            <!-- Past Card Ornaments -->
            <div class="past-card-ornaments">
              <div class="cultural-pattern left"></div>
              <div class="cultural-pattern right"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const eventList = ref([]);
const loading = ref(true);
const error = ref(false);
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const fetchEvents = async () => {
  loading.value = true;
  error.value = false;
  try {
    const response = await axios.get(`${baseUrl}/api/event`);
    eventList.value = response.data;
  } catch (err) {
    console.error("Error fetching events:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString, part) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const optionsMonth = { month: "short" };
  const optionsYear = { year: "numeric" };

  if (part === "day") {
    return date.getDate();
  } else if (part === "monthYear") {
    return `${date.toLocaleDateString(
      "id-ID",
      optionsMonth
    )} ${date.toLocaleDateString("id-ID", optionsYear)}`;
  }
  return date.toLocaleDateString("id-ID");
};

const truncateText = (text, length = 100) => {
  if (!text) return "";
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + "...";
};

const comingSoonEvents = computed(() => {
  const now = new Date();
  return eventList.value
    .filter((event) => {
      const startDate = new Date(event.tanggal_mulai);
      const endDate = event.tanggal_selesai
        ? new Date(event.tanggal_selesai)
        : startDate;
      return endDate >= now;
    })
    .sort((a, b) => new Date(a.tanggal_mulai) - new Date(b.tanggal_mulai));
});

const pastEvents = computed(() => {
  const now = new Date();
  return eventList.value
    .filter((event) => {
      const endDate = event.tanggal_selesai
        ? new Date(event.tanggal_selesai)
        : new Date(event.tanggal_mulai);
      return endDate < now;
    })
    .sort((a, b) => new Date(b.tanggal_mulai) - new Date(a.tanggal_mulai));
});

const viewEventDetail = (eventId) => {
  router.push({ name: "EventDetail", params: { id: eventId } });
};

const cardHover = (event) => {
  event.currentTarget.classList.add("hovered");
};

const cardLeave = (event) => {
  event.currentTarget.classList.remove("hovered");
};

onMounted(() => {
  // Scroll ke atas halaman
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  fetchEvents();
});
</script>

<style scoped>
/* ========== LUXURY CULTURAL BACKGROUND ========== */

.event-view-user {
  position: relative;
  min-height: 100vh;
  font-family: "Inter", "Poppins", sans-serif;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0f172a 0%,
    #1e3a8a 25%,
    #3b82f6 50%,
    #dbeafe 75%,
    #ffffff 100%
  );
}

/* Cultural Animated Background */
.cultural-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
}

.mountain-silhouettes {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 35%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 350" opacity="0.12"><path d="M0,350 L180,180 L360,220 L540,140 L720,190 L900,120 L1080,160 L1200,350 Z" fill="%23FFFFFF"/><path d="M0,350 L150,260 L330,300 L510,200 L690,260 L870,160 L1050,230 L1200,350 Z" fill="%23F1F5F9" opacity="0.8"/></svg>')
    no-repeat center bottom;
  background-size: cover;
  animation: mountainSway 25s ease-in-out infinite;
}

.temple-ornaments {
  position: absolute;
  top: 20%;
  left: 10%;
  width: 80px;
  height: 80px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.08"><polygon points="50,10 65,30 85,25 75,45 95,55 75,65 85,85 65,80 50,100 35,80 15,85 25,65 5,55 25,45 15,25 35,30" fill="%233B82F6"/><circle cx="50" cy="50" r="15" fill="none" stroke="%233B82F6" stroke-width="2"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: templeFloat 20s ease-in-out infinite;
}

.wayang-shadows {
  position: absolute;
  top: 30%;
  right: 15%;
  width: 60px;
  height: 100px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 100" opacity="0.06"><path d="M30,10 Q20,20 25,35 Q15,45 20,60 Q10,70 15,85 Q25,95 30,90 Q35,95 45,85 Q40,70 50,60 Q45,45 55,35 Q40,20 30,10 Z" fill="%231E3A8A"/><circle cx="30" cy="25" r="3" fill="%23FFFFFF"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: wayangDance 18s ease-in-out infinite;
}

.gamelan-patterns {
  position: absolute;
  bottom: 20%;
  right: 25%;
  width: 70px;
  height: 70px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.07"><circle cx="50" cy="50" r="40" fill="none" stroke="%233B82F6" stroke-width="3"/><circle cx="50" cy="50" r="25" fill="none" stroke="%233B82F6" stroke-width="2"/><circle cx="50" cy="50" r="12" fill="%233B82F6"/><path d="M30,30 L70,70 M70,30 L30,70" stroke="%233B82F6" stroke-width="1"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: gamelanPulse 15s ease-in-out infinite;
}

.batik-motifs {
  position: absolute;
  top: 40%;
  left: 20%;
  width: 100%;
  height: 30%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" opacity="0.04"><circle cx="20" cy="30" r="8" fill="none" stroke="%233B82F6" stroke-width="1"/><circle cx="60" cy="15" r="6" fill="none" stroke="%233B82F6" stroke-width="1"/><circle cx="100" cy="45" r="7" fill="none" stroke="%233B82F6" stroke-width="1"/><circle cx="140" cy="20" r="5" fill="none" stroke="%233B82F6" stroke-width="1"/><circle cx="180" cy="40" r="9" fill="none" stroke="%233B82F6" stroke-width="1"/></svg>')
    repeat-x;
  animation: batikFlow 30s linear infinite;
}

.floating-clouds {
  position: absolute;
  top: 15%;
  left: 0;
  width: 100%;
  height: 25%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 250" opacity="0.08"><ellipse cx="200" cy="100" rx="70" ry="25" fill="%23FFFFFF"/><ellipse cx="500" cy="130" rx="90" ry="35" fill="%23FFFFFF"/><ellipse cx="800" cy="80" rx="80" ry="30" fill="%23FFFFFF"/><ellipse cx="1100" cy="150" rx="60" ry="20" fill="%23FFFFFF"/></svg>')
    repeat-x;
  animation: cloudDrift 35s linear infinite;
}

.cultural-glow {
  position: absolute;
  top: 25%;
  right: 20%;
  width: 150px;
  height: 150px;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.3) 0%,
    rgba(147, 197, 253, 0.2) 40%,
    transparent 70%
  );
  border-radius: 50%;
  animation: culturalPulse 12s ease-in-out infinite;
}

.tradition-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" opacity="0.03"><circle cx="100" cy="100" r="2" fill="%233B82F6"/><circle cx="300" cy="200" r="1.5" fill="%233B82F6"/><circle cx="500" cy="150" r="2.5" fill="%233B82F6"/><circle cx="700" cy="300" r="1" fill="%233B82F6"/><circle cx="900" cy="250" r="2" fill="%233B82F6"/><circle cx="200" cy="400" r="1.5" fill="%233B82F6"/><circle cx="600" cy="500" r="2" fill="%233B82F6"/><circle cx="800" cy="600" r="1" fill="%233B82F6"/></svg>')
    repeat;
  animation: particleFloat 40s linear infinite;
}

/* Background Animations */
@keyframes mountainSway {
  0%,
  100% {
    transform: translateX(0) scale(1);
  }
  50% {
    transform: translateX(-15px) scale(1.02);
  }
}

@keyframes templeFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(5deg);
  }
}

@keyframes wayangDance {
  0%,
  100% {
    transform: translateY(0) scaleX(1);
  }
  25% {
    transform: translateY(-8px) scaleX(1.1);
  }
  75% {
    transform: translateY(-5px) scaleX(0.9);
  }
}

@keyframes gamelanPulse {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.07;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.12;
  }
}

@keyframes batikFlow {
  0% {
    transform: translateX(-200px);
  }
  100% {
    transform: translateX(1400px);
  }
}

@keyframes cloudDrift {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(1300px);
  }
}

@keyframes culturalPulse {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.3) rotate(360deg);
    opacity: 0.5;
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) translateX(0);
  }
  100% {
    transform: translateY(-50px) translateX(100px);
  }
}

/* ========== MAIN CONTENT ========== */

.container {
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ========== HERO SECTION ========== */

.hero-section {
  padding: 140px 0 100px;
  text-align: center;
  position: relative;
}

.page-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 2rem;
}

.title-gradient {
  background: linear-gradient(
    135deg,
    #60a5fa 0%,
    #93c5fd 30%,
    #dbeafe 70%,
    #ffffff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  text-shadow: 0 0 25px rgba(147, 197, 253, 0.9),
    0 0 50px rgba(59, 130, 246, 0.7), 0 4px 12px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
  animation: titleShimmer 3s ease-in-out infinite;
}

.title-accent {
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #dbeafe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  margin-top: 0.5rem;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.9),
    0 0 40px rgba(219, 234, 254, 0.7), 0 2px 8px rgba(0, 0, 0, 0.2);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
  animation: titleFloat 4s ease-in-out infinite;
}

@keyframes titleShimmer {
  0%,
  100% {
    filter: brightness(1) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
    text-shadow: 0 0 25px rgba(147, 197, 253, 0.9),
      0 0 50px rgba(59, 130, 246, 0.7), 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  50% {
    filter: brightness(1.4) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    text-shadow: 0 0 35px rgba(147, 197, 253, 1),
      0 0 70px rgba(59, 130, 246, 0.9), 0 6px 16px rgba(0, 0, 0, 0.4);
  }
}

@keyframes titleFloat {
  0%,
  100% {
    transform: translateY(0);
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.9),
      0 0 40px rgba(219, 234, 254, 0.7), 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: translateY(-8px);
    text-shadow: 0 0 30px rgba(255, 255, 255, 1),
      0 0 60px rgba(219, 234, 254, 0.9), 0 4px 12px rgba(0, 0, 0, 0.25);
  }
}

.page-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 3rem;
}

.hero-ornament {
  width: 80px;
  height: 4px;
  background: linear-gradient(45deg, #3b82f6, #60a5fa, #93c5fd);
  margin: 2rem auto;
  border-radius: 2px;
  animation: ornamentGlow 2s ease-in-out infinite;
}

@keyframes ornamentGlow {
  0%,
  100% {
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  }
}

/* ========== LUXURY LOADING & ERROR STATES ========== */

.luxury-loading {
  text-align: center;
  padding: 6rem 0;
  color: rgba(255, 255, 255, 0.9);
}

.cultural-spinner {
  width: 80px;
  height: 80px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #60a5fa;
  border-radius: 50%;
  animation: culturalSpin 1.5s ease-in-out infinite;
  margin: 0 auto 2rem;
}

@keyframes culturalSpin {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.luxury-error,
.luxury-empty {
  text-align: center;
  padding: 6rem 0;
  color: rgba(255, 255, 255, 0.8);
}

.error-icon,
.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  display: block;
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* ========== LUXURY EVENTS SECTION ========== */

.luxury-events-section {
  padding: 80px 0;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.luxury-section-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
}

.title-shimmer {
  background: linear-gradient(
    135deg,
    #60a5fa 0%,
    #93c5fd 30%,
    #dbeafe 70%,
    #ffffff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  text-shadow: 0 0 30px rgba(147, 197, 253, 0.9),
    0 0 60px rgba(59, 130, 246, 0.7), 0 4px 12px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
  animation: textShimmer 3s ease-in-out infinite;
}

@keyframes textShimmer {
  0%,
  100% {
    background-position: 0% 50%;
    filter: brightness(1) drop-shadow(0 3px 6px rgba(0, 0, 0, 0.25));
  }
  50% {
    background-position: 100% 50%;
    filter: brightness(1.3) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }
}

.animated-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 1rem;
}

.glow-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(45deg, transparent, #60a5fa, transparent);
  animation: lineGlow 2s ease-in-out infinite;
}

@keyframes lineGlow {
  0%,
  100% {
    opacity: 0.5;
    transform: scaleX(1);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.2);
  }
}

.cultural-icon {
  font-size: 2rem;
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
}

/* ========== LUXURY EVENT CARDS ========== */

.luxury-event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
  margin-top: 4rem;
}

.luxury-event-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(59, 130, 246, 0.1);
  opacity: 0;
  transform: translateY(50px);
  animation: cardReveal 0.8s ease-out forwards;
}

@keyframes cardReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.luxury-event-card.hovered {
  transform: translateY(-15px) scale(1.02);
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.15),
    0 20px 40px rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

.luxury-event-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(59, 130, 246, 0.1),
    transparent,
    rgba(147, 197, 253, 0.1)
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

.luxury-event-card.hovered::before {
  opacity: 1;
}

/* Premium Date Badge */
.premium-date-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
  color: #ffffff;
  padding: 15px 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  overflow: hidden;
}

.luxury-event-card.hovered .premium-date-badge {
  transform: scale(1.1) rotate(-3deg);
  animation: dateBounce 0.6s ease-out;
}

@keyframes dateBounce {
  0%,
  100% {
    transform: scale(1.1) rotate(-3deg);
  }
  50% {
    transform: scale(1.2) rotate(-5deg);
  }
}

.date-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.luxury-event-card.hovered .date-glow {
  opacity: 1;
  animation: glowPulse 1.5s ease-in-out infinite;
}

@keyframes glowPulse {
  0%,
  100% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.2);
  }
}

.date-day {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
}

.date-month {
  font-size: 0.9rem;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  opacity: 0.9;
}

.date-ornament {
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: linear-gradient(45deg, #60a5fa, #93c5fd);
  border-radius: 2px;
}

/* Luxury Image Container */
.luxury-image-container {
  position: relative;
  height: 280px;
  overflow: hidden;
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(30, 58, 138, 0.3) 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 2;
}

.luxury-event-card.hovered .image-overlay {
  opacity: 1;
}

.luxury-event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  filter: brightness(1) contrast(1.05);
}

.luxury-event-card.hovered .luxury-event-image {
  transform: scale(1.1) rotate(1deg);
  filter: brightness(1.1) contrast(1.1) saturate(1.2);
}

.luxury-no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  font-weight: 500;
}

.no-image-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.image-shine {
  position: absolute;
  top: -100%;
  left: -100%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 60%
  );
  opacity: 0;
  transition: all 0.6s ease;
}

.luxury-event-card.hovered .image-shine {
  opacity: 1;
  animation: shine 1.5s ease-out;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%);
  }
  100% {
    transform: translateX(100%) translateY(100%);
  }
}

/* Premium Content */
.luxury-card-content {
  padding: 2.5rem 2rem;
  position: relative;
  z-index: 3;
}

.luxury-event-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1rem;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.luxury-event-location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.location-icon {
  font-size: 1.2rem;
}

/* Premium Action Buttons */
.luxury-card-actions {
  display: flex;
  gap: 15px;
  margin-top: 2rem;
}

.luxury-detail-button,
.luxury-brosur-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.luxury-detail-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
  color: #ffffff;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.luxury-detail-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}

.luxury-brosur-button {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  color: #ffffff;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.luxury-brosur-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}

.button-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
}

.luxury-detail-button:active .button-ripple,
.luxury-brosur-button:active .button-ripple {
  width: 200px;
  height: 200px;
}

.button-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.luxury-detail-button:hover .button-glow,
.luxury-brosur-button:hover .button-glow {
  opacity: 1;
  animation: buttonGlowPulse 1.5s ease-in-out infinite;
}

@keyframes buttonGlowPulse {
  0%,
  100% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.2);
  }
}

.button-arrow,
.button-download {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.luxury-detail-button:hover .button-arrow,
.luxury-brosur-button:hover .button-download {
  transform: translateX(4px);
}

/* Card Ornaments */
.card-ornaments {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.corner-decoration {
  position: absolute;
  width: 25px;
  height: 25px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  opacity: 0;
  transition: all 0.4s ease;
}

.corner-decoration.top-left {
  top: 20px;
  left: 20px;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 10px;
}

.corner-decoration.top-right {
  top: 20px;
  right: 20px;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 10px;
}

.corner-decoration.bottom-left {
  bottom: 20px;
  left: 20px;
  border-right: none;
  border-top: none;
  border-bottom-left-radius: 10px;
}

.corner-decoration.bottom-right {
  bottom: 20px;
  right: 20px;
  border-left: none;
  border-top: none;
  border-bottom-right-radius: 10px;
}

.luxury-event-card.hovered .corner-decoration {
  opacity: 1;
  border-color: rgba(59, 130, 246, 0.6);
}

/* ========== PAST EVENTS SECTION ========== */

.past-events-section {
  background: linear-gradient(
    135deg,
    rgba(30, 58, 138, 0.1) 0%,
    rgba(59, 130, 246, 0.05) 100%
  );
  border-radius: 40px;
  margin-top: 100px;
  padding: 100px 40px 80px;
  position: relative;
}

.luxury-past-events {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-top: 4rem;
}

.luxury-past-event-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  position: relative;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  opacity: 0;
  transform: translateX(-50px);
  animation: pastCardReveal 0.8s ease-out forwards;
}

@keyframes pastCardReveal {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.luxury-past-event-card.hovered {
  transform: translateY(-10px) scale(1.01);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
  border-color: rgba(59, 130, 246, 0.3);
}

.past-event-left {
  position: relative;
  width: 350px;
  height: 280px;
  flex-shrink: 0;
}

.past-date-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: linear-gradient(135deg, #6b7280 0%, #374151 100%);
  color: #ffffff;
  padding: 12px 16px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  box-shadow: 0 8px 20px rgba(107, 114, 128, 0.3);
  transition: all 0.3s ease;
}

.luxury-past-event-card.hovered .past-date-badge {
  transform: scale(1.05);
}

.past-date-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.luxury-past-event-card.hovered .past-date-glow {
  opacity: 1;
}

.past-date-day {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}

.past-date-month {
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 600;
  opacity: 0.9;
}

.past-image-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #6b7280 0%, #374151 100%);
}

.past-event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
  filter: brightness(0.8) contrast(1.1);
}

.luxury-past-event-card.hovered .past-event-image {
  transform: scale(1.05);
  filter: brightness(0.9) contrast(1.15);
}

.past-no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
}

.past-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(107, 114, 128, 0.2) 0%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

.luxury-past-event-card.hovered .past-image-overlay {
  opacity: 1;
}

.past-image-shine {
  position: absolute;
  top: -100%;
  left: -100%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 40%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 60%
  );
  opacity: 0;
  transition: all 0.6s ease;
}

.luxury-past-event-card.hovered .past-image-shine {
  opacity: 1;
  animation: pastShine 1.5s ease-out;
}

@keyframes pastShine {
  0% {
    transform: translateX(-100%) translateY(-100%);
  }
  100% {
    transform: translateX(100%) translateY(100%);
  }
}

.past-event-right {
  flex: 1;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
}

.past-event-title {
  font-size: 2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1rem;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.past-event-location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.past-event-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.past-card-actions {
  display: flex;
  gap: 15px;
  margin-top: auto;
}

.past-detail-button,
.past-brosur-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.past-detail-button {
  background: linear-gradient(135deg, #6b7280 0%, #374151 100%);
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(107, 114, 128, 0.3);
}

.past-detail-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(107, 114, 128, 0.4);
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
}

.past-brosur-button {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(5, 150, 105, 0.3);
}

.past-brosur-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(5, 150, 105, 0.4);
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

/* Past Card Ornaments */
.past-card-ornaments {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.cultural-pattern {
  position: absolute;
  width: 60px;
  height: 60px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" opacity="0.1"><circle cx="30" cy="30" r="20" fill="none" stroke="%23FFFFFF" stroke-width="2"/><circle cx="30" cy="30" r="10" fill="none" stroke="%23FFFFFF" stroke-width="1"/><path d="M20,20 L40,40 M40,20 L20,40" stroke="%23FFFFFF" stroke-width="1"/></svg>')
    no-repeat center;
  background-size: contain;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.cultural-pattern.left {
  top: 50%;
  left: -30px;
  transform: translateY(-50%);
}

.cultural-pattern.right {
  top: 50%;
  right: -30px;
  transform: translateY(-50%);
}

.luxury-past-event-card.hovered .cultural-pattern {
  opacity: 1;
  animation: patternRotate 3s linear infinite;
}

@keyframes patternRotate {
  0% {
    transform: translateY(-50%) rotate(0deg);
  }
  100% {
    transform: translateY(-50%) rotate(360deg);
  }
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 1200px) {
  .luxury-event-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2.5rem;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .luxury-event-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .luxury-past-event-card {
    flex-direction: column;
  }

  .past-event-left {
    width: 100%;
    height: 250px;
  }

  .past-event-right {
    padding: 2rem;
  }

  .luxury-section-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 120px 0 80px;
  }

  .page-title {
    font-size: 2rem;
  }

  .luxury-section-title {
    font-size: 2rem;
  }

  .luxury-card-content {
    padding: 2rem 1.5rem;
  }

  .luxury-card-actions {
    flex-direction: column;
    gap: 10px;
  }

  .past-events-section {
    padding: 80px 20px 60px;
    margin-top: 60px;
  }
}
</style>
<style scoped>
.event-view-user {
  overflow-y: auto;
}
</style>
