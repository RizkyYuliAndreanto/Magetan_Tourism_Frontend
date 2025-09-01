<template>
  <section class="culture-hero-section">
    <div class="header-line">
      <h1 class="section-title">Kebudayaan</h1>
      <span class="line"></span>
    </div>

    <div class="culture-card-grid">
      <!-- Baris 1: Objek Pemajuan Kebudayaan -->
      <router-link
        to="/budaya/objek"
        class="culture-card card-objek"
        ref="objekCard"
        tabindex="0">
        <div
          class="card-bg"
          style="
            background-image: url('https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80');
          "></div>
        <div class="card-col card-left">
          <p class="card-title">Objek Pemajuan Kebudayaan</p>
          <p class="card-subtitle">Mengenal Kekayaan Tradisi Magetan</p>
        </div>
        <div class="card-divider"></div>
        <div class="card-col card-right">
          <p class="card-description">
            Magetan kaya akan <b>Objek Pemajuan Kebudayaan</b> seperti tradisi
            lisan, manuskrip kuno, adat istiadat yang diwariskan turun-temurun,
            seni pertunjukan lokal, dan kerajinan tangan khas. Semua ini adalah
            bagian tak terpisahkan dari identitas budaya masyarakat Magetan.
            <span class="card-link">Lihat Detail &rarr;</span>
          </p>
        </div>
      </router-link>
      <!-- Baris 2: Cagar Budaya -->
      <router-link
        to="/budaya/cagar"
        class="culture-card card-cagar"
        ref="cagarCard"
        tabindex="0">
        <div
          class="card-bg"
          style="
            background-image: url('https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80');
          "></div>
        <div class="card-col card-left">
          <p class="card-description">
            Jelajahi <b>Cagar Budaya</b> yang tersebar di seluruh penjuru
            Magetan, mulai dari situs-situs bersejarah, bangunan-bangunan
            peninggalan masa lalu, hingga kawasan yang dilindungi karena nilai
            budaya dan sejarahnya yang tinggi.
            <span class="card-link">Lihat Detail &rarr;</span>
          </p>
        </div>
        <div class="card-divider"></div>
        <div class="card-col card-right">
          <p class="card-title">Cagar Budaya</p>
          <p class="card-subtitle">Jejak Sejarah yang Terlestarikan</p>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { gsap } from "gsap";

const objekCard = ref(null);
const cagarCard = ref(null);

onMounted(() => {
  gsap.from(".header-line h1, .header-line .line", {
    opacity: 0,
    y: -20,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
  });

  gsap.from(objekCard.value, {
    opacity: 0,
    x: -50,
    duration: 1,
    delay: 0.5,
    ease: "power3.out",
  });

  gsap.from(cagarCard.value, {
    opacity: 0,
    x: 50,
    duration: 1,
    delay: 0.7,
    ease: "power3.out",
  });
});
</script>

<style scoped>
.culture-hero-section {
  padding: 48px 0 32px 0;
  background: url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80")
    center/cover no-repeat;
  font-family: "Poppins", Arial, sans-serif;
  color: #222;
  position: relative;
}

.culture-hero-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(219, 219, 219, 0.85);
  z-index: 0;
}

.header-line,
.culture-card-grid {
  position: relative;
  z-index: 1;
}

.header-line {
  display: flex;
  align-items: center;
  margin-bottom: 36px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 2.2em;
  font-weight: 700;
  color: #222;
  margin-right: 20px;
  letter-spacing: 1px;
}

.line {
  flex-grow: 1;
  height: 3px;
  background: #222;
  border-radius: 2px;
}

.culture-card-grid {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.culture-card {
  display: grid;
  grid-template-columns: 1fr 16px 2fr;
  background: rgba(243, 243, 243, 0.95);
  border-radius: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  min-height: 160px;
  align-items: stretch;
  transition: box-shadow 0.3s, transform 0.3s;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
}

.culture-card:hover,
.culture-card:focus {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13);
  transform: translateY(-4px) scale(1.015);
  border: 2px solid #007bff;
}

.card-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.22;
  border-radius: 32px;
  pointer-events: none;
  transition: opacity 0.3s;
}

.culture-card:hover .card-bg,
.culture-card:focus .card-bg {
  opacity: 0.32;
}

.card-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 24px;
  text-align: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.card-title {
  font-size: 1.5em;
  font-weight: 700;
  color: #222;
  line-height: 1.3;
}

.card-subtitle {
  font-size: 1em;
  color: #7f8c8d;
  margin-top: -5px;
}

.card-description {
  font-size: 1em;
  color: #444;
  line-height: 1.7;
  text-align: center;
}

.card-link {
  display: block;
  margin-top: 12px;
  color: #007bff;
  font-weight: 600;
  font-size: 0.97em;
  text-decoration: underline;
  transition: color 0.2s;
}

.culture-card:hover .card-link,
.culture-card:focus .card-link {
  color: #0056b3;
}

.card-divider {
  width: 2px;
  background: #222;
  border-radius: 1px;
  margin: auto 0;
  height: 70%;
  align-self: center;
  position: relative;
  z-index: 1;
}

@media (max-width: 900px) {
  .culture-card {
    grid-template-columns: 1fr 10px 1fr;
    min-height: 110px;
    border-radius: 18px;
  }
  .card-bg {
    border-radius: 18px;
  }
  .card-col {
    padding: 18px 10px;
    font-size: 0.95em;
  }
  .section-title {
    font-size: 1.3em;
  }
}

@media (max-width: 700px) {
  .culture-card-grid {
    gap: 18px;
  }
  .culture-card {
    display: flex;
    flex-direction: column;
    min-height: 0;
    border-radius: 16px;
  }
  .card-bg {
    border-radius: 16px;
  }
  .card-col {
    padding: 16px 8px;
    font-size: 0.92em;
  }
  .card-divider {
    width: 80%;
    height: 2px;
    margin: 0 auto;
    background: #222;
    align-self: center;
  }
}

@media (max-width: 480px) {
  .culture-hero-section {
    padding: 24px 0 16px 0;
  }
  .section-title {
    font-size: 1em;
  }
  .card-title {
    font-size: 1.1em;
  }
  .card-subtitle {
    font-size: 0.9em;
  }
  .card-description {
    font-size: 0.85em;
  }
}
</style>
