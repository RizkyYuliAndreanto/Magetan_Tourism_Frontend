<template>
  <div class="profil-dinas-view">
    <!-- Professional Cultural Background -->
    <div class="official-background">
      <div class="government-mountains"></div>
      <div class="temple-silhouettes"></div>
      <div class="gamelan-ornaments"></div>
      <div class="cultural-patterns"></div>
      <div class="official-glow"></div>
      <div class="heritage-particles"></div>
    </div>

    <div class="container">
      <!-- Professional Header Section -->
      <div class="official-header">
        <div class="header-ornament top"></div>
        <h1 class="official-title">
          <span class="title-main">Profil Dinas</span>
          <span class="title-subtitle">Kebudayaan dan Pariwisata</span>
          <span class="title-location">Kabupaten Magetan</span>
        </h1>
        <p class="official-subtitle">
          Informasi resmi seputar identitas, visi, misi, dan struktur organisasi
          <br />Dinas Kebudayaan dan Pariwisata Kabupaten Magetan
        </p>
        <div class="header-ornament bottom"></div>
      </div>

      <!-- Professional Menu Grid -->
      <div class="official-menu-grid">
        <router-link
          v-for="(item, index) in menuItems"
          :key="item.title"
          :to="item.link"
          class="official-menu-card"
          :style="{ animationDelay: `${index * 0.15}s` }"
          @mouseenter="cardHover"
          @mouseleave="cardLeave"
          @click="handleCardClick">
          <!-- Professional Card Header -->
          <div class="card-header">
            <div class="official-icon-container">
              <div class="icon-glow"></div>
              <img
                v-if="logoPemkab"
                :src="logoPemkab"
                alt="Logo Pemerintah Kabupaten Magetan"
                class="official-logo"
                @error="handleImageError" />
              <div v-else class="logo-fallback">
                <i
                  class="fas fa-building"
                  style="font-size: 2rem; color: #475569"></i>
              </div>
              <div class="icon-badge">
                <i :class="item.icon" class="badge-icon"></i>
              </div>
            </div>
            <div class="card-decoration"></div>
          </div>

          <!-- Professional Content -->
          <div class="card-content">
            <h2 class="official-card-title">{{ item.title }}</h2>
            <p class="official-card-description">{{ item.description }}</p>

            <!-- Professional CTA -->
            <div class="official-cta">
              <span class="cta-text">Lihat Detail</span>
              <svg class="cta-arrow" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
              </svg>
              <div class="cta-underline"></div>
            </div>
          </div>

          <!-- Card Ornaments -->
          <div class="card-ornaments">
            <div class="corner-seal top-left"></div>
            <div class="corner-seal top-right"></div>
            <div class="corner-seal bottom-left"></div>
            <div class="corner-seal bottom-right"></div>
          </div>

          <!-- Hover Effects -->
          <div class="card-shine"></div>
          <div class="card-border-glow"></div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import logoPemkab from "@/assets/LOGO PEMKAB.png";

// Debug logging
onMounted(() => {
  // Scroll ke atas halaman
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  console.log("ProfilDinasView mounted successfully");
  console.log("Logo path:", logoPemkab);
});

const menuItems = ref([
  {
    title: "Profil Dinas",
    description:
      "Informasi dasar mengenai Dinas Kebudayaan dan Pariwisata Kabupaten Magetan termasuk sejarah, tugas pokok, dan fungsi.",
    icon: "fas fa-building",
    link: { name: "DetailProfilDinas" },
  },
  {
    title: "Visi Misi",
    description:
      "Pelajari visi dan misi yang menjadi landasan strategis serta tujuan kerja Dinas Kebudayaan dan Pariwisata.",
    icon: "fas fa-bullseye",
    link: { name: "VisiMisi" },
  },
  {
    title: "Struktur Organisasi",
    description:
      "Lihat bagan struktural organisasi dan pembagian divisi kerja di lingkungan Dinas Kebudayaan dan Pariwisata.",
    icon: "fas fa-sitemap",
    link: { name: "StrukturOrganisasi" },
  },
  {
    title: "Struktur Anggota",
    description:
      "Daftar lengkap pejabat struktural, fungsional, dan anggota yang bertugas di lingkungan dinas.",
    icon: "fas fa-users",
    link: { name: "StrukturAnggota" },
  },
  {
    title: "Pengumuman",
    description:
      "Informasi terkini, pengumuman resmi, dan pemberitahuan penting dari Dinas Kebudayaan dan Pariwisata Kabupaten Magetan.",
    icon: "fas fa-bullhorn",
    link: { name: "pengumuman" },
  },
  {
    title: "PPID",
    description:
      "Pejabat Pengelola Informasi dan Dokumentasi - akses informasi publik dan layanan dokumentasi resmi.",
    icon: "fas fa-info-circle",
    link: { name: "PPID" },
  },
]);

const cardHover = (event) => {
  event.currentTarget.classList.add("hovered");
};

const cardLeave = (event) => {
  event.currentTarget.classList.remove("hovered");
};

const handleImageError = () => {
  console.error("Failed to load logo image");
};

const handleCardClick = () => {
  // Force scroll to top when card is clicked
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>

<style scoped>
/* ========== PROFESSIONAL CULTURAL BACKGROUND ========== */

.profil-dinas-view {
  position: relative;
  min-height: 100vh;
  font-family: "Inter", "Segoe UI", sans-serif;
  overflow-x: hidden; /* Changed from overflow: hidden */
  background: linear-gradient(
    135deg,
    #f8fafc 0%,
    #e2e8f0 25%,
    #cbd5e1 50%,
    #94a3b8 75%,
    #64748b 100%
  );
  padding-top: 80px; /* Add padding to account for navbar */
}

/* Official Cultural Background */
.official-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
}

.government-mountains {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" opacity="0.08"><path d="M0,300 L200,150 L400,200 L600,100 L800,170 L1000,120 L1200,180 L1200,300 Z" fill="%23475569"/><path d="M0,300 L150,220 L350,260 L550,180 L750,240 L950,160 L1200,220 L1200,300 Z" fill="%23334155" opacity="0.7"/></svg>')
    no-repeat center bottom;
  background-size: cover;
  animation: officialMountains 30s ease-in-out infinite;
}

.temple-silhouettes {
  position: absolute;
  top: 25%;
  left: 8%;
  width: 70px;
  height: 90px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 90" opacity="0.06"><rect x="25" y="60" width="20" height="30" fill="%23475569"/><polygon points="35,60 15,40 55,40" fill="%23475569"/><rect x="30" y="40" width="10" height="20" fill="%23475569"/><polygon points="35,40 20,25 50,25" fill="%23475569"/><rect x="32" y="25" width="6" height="15" fill="%23475569"/><polygon points="35,25 25,10 45,10" fill="%23475569"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: templeGlow 25s ease-in-out infinite;
}

.gamelan-ornaments {
  position: absolute;
  bottom: 25%;
  right: 20%;
  width: 60px;
  height: 60px;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" opacity="0.07"><circle cx="30" cy="30" r="25" fill="none" stroke="%23475569" stroke-width="2"/><circle cx="30" cy="30" r="15" fill="none" stroke="%23475569" stroke-width="1"/><circle cx="30" cy="30" r="8" fill="%23475569"/><line x1="15" y1="15" x2="45" y2="45" stroke="%23475569" stroke-width="1"/><line x1="45" y1="15" x2="15" y2="45" stroke="%23475569" stroke-width="1"/></svg>')
    no-repeat center;
  background-size: contain;
  animation: gamelanResonance 18s ease-in-out infinite;
}

.cultural-patterns {
  position: absolute;
  top: 40%;
  left: 15%;
  width: 100%;
  height: 25%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 75" opacity="0.03"><rect x="10" y="30" width="15" height="15" fill="none" stroke="%23475569" stroke-width="1"/><rect x="40" y="20" width="12" height="12" fill="none" stroke="%23475569" stroke-width="1"/><rect x="70" y="35" width="18" height="18" fill="none" stroke="%23475569" stroke-width="1"/><rect x="110" y="25" width="14" height="14" fill="none" stroke="%23475569" stroke-width="1"/><rect x="140" y="40" width="16" height="16" fill="none" stroke="%23475569" stroke-width="1"/></svg>')
    repeat-x;
  animation: patternFlow 35s linear infinite;
}

.official-glow {
  position: absolute;
  top: 20%;
  right: 25%;
  width: 120px;
  height: 120px;
  background: radial-gradient(
    circle,
    rgba(71, 85, 105, 0.2) 0%,
    rgba(51, 65, 85, 0.1) 40%,
    transparent 70%
  );
  border-radius: 50%;
  animation: officialPulse 15s ease-in-out infinite;
}

.heritage-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" opacity="0.02"><circle cx="100" cy="100" r="1.5" fill="%23475569"/><circle cx="300" cy="180" r="1" fill="%23475569"/><circle cx="500" cy="120" r="2" fill="%23475569"/><circle cx="700" cy="250" r="1.5" fill="%23475569"/><circle cx="900" cy="200" r="1" fill="%23475569"/><circle cx="200" cy="350" r="1.5" fill="%23475569"/><circle cx="600" cy="450" r="1" fill="%23475569"/><circle cx="800" cy="550" r="2" fill="%23475569"/></svg>')
    repeat;
  animation: heritageFloat 45s linear infinite;
}

/* Background Animations */
@keyframes officialMountains {
  0%,
  100% {
    transform: translateX(0) scale(1);
  }
  50% {
    transform: translateX(-10px) scale(1.01);
  }
}

@keyframes templeGlow {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.06;
  }
  50% {
    transform: translateY(-8px) rotate(3deg);
    opacity: 0.1;
  }
}

@keyframes gamelanResonance {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.07;
  }
  50% {
    transform: scale(1.1) rotate(180deg);
    opacity: 0.12;
  }
}

@keyframes patternFlow {
  0% {
    transform: translateX(-300px);
  }
  100% {
    transform: translateX(1300px);
  }
}

@keyframes officialPulse {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.2) rotate(360deg);
    opacity: 0.4;
  }
}

@keyframes heritageFloat {
  0% {
    transform: translateY(0) translateX(0);
  }
  100% {
    transform: translateY(-30px) translateX(80px);
  }
}

/* ========== MAIN CONTENT ========== */

.container {
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  min-height: calc(100vh - 160px); /* Ensure minimum height */
}

/* ========== OFFICIAL HEADER ========== */

.official-header {
  padding: 60px 0 60px; /* Reduced from 120px to account for navbar padding */
  text-align: center;
  position: relative;
}

.header-ornament {
  width: 100px;
  height: 3px;
  background: linear-gradient(45deg, #475569, #64748b, #94a3b8);
  margin: 0 auto;
  border-radius: 2px;
  position: relative;
}

.header-ornament.top {
  margin-bottom: 3rem;
  animation: ornamentExpand 2s ease-out;
}

.header-ornament.bottom {
  margin-top: 3rem;
  animation: ornamentExpand 2s ease-out 0.5s both;
}

@keyframes ornamentExpand {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 100px;
    opacity: 1;
  }
}

.official-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 2rem;
  position: relative;
}

.title-main {
  display: block;
  background: linear-gradient(135deg, #1e293b 0%, #475569 50%, #64748b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(71, 85, 105, 0.3);
  animation: titleReveal 1s ease-out;
}

.title-subtitle {
  display: block;
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 0.8em;
  margin-top: 0.5rem;
  animation: titleReveal 1s ease-out 0.3s both;
}

.title-location {
  display: block;
  color: #64748b;
  font-size: 0.6em;
  font-weight: 600;
  margin-top: 0.5rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: titleReveal 1s ease-out 0.6s both;
}

@keyframes titleReveal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.official-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  font-weight: 500;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  animation: subtitleFade 1s ease-out 0.9s both;
}

@keyframes subtitleFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ========== OFFICIAL MENU GRID ========== */

.official-menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2.5rem;
  margin-top: 5rem;
  padding-bottom: 100px;
}

.official-menu-card {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(248, 250, 252, 0.8) 100%
  );
  backdrop-filter: blur(15px);
  border: 1px solid rgba(71, 85, 105, 0.1);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  text-decoration: none;
  color: inherit;
  position: relative;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(71, 85, 105, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04);
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

.official-menu-card.hovered {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 50px rgba(71, 85, 105, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.08);
  border-color: rgba(71, 85, 105, 0.2);
}

.official-menu-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(71, 85, 105, 0.05),
    transparent,
    rgba(100, 116, 139, 0.05)
  );
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

.official-menu-card.hovered::before {
  opacity: 1;
}

/* Professional Card Header */
.card-header {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
}

.official-icon-container {
  position: relative;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
  border: 2px solid rgba(71, 85, 105, 0.1);
}

.official-menu-card.hovered .official-icon-container {
  background: linear-gradient(135deg, #475569 0%, #334155 100%);
  border-color: rgba(71, 85, 105, 0.3);
  transform: scale(1.05);
}

.icon-glow {
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(
    circle,
    rgba(71, 85, 105, 0.2) 0%,
    transparent 70%
  );
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.official-menu-card.hovered .icon-glow {
  opacity: 1;
  animation: iconGlowPulse 2s ease-in-out infinite;
}

@keyframes iconGlowPulse {
  0%,
  100% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.2);
  }
}

.official-logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
  transition: all 0.4s ease;
  filter: opacity(0.8);
}

.logo-fallback {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease;
}

.official-menu-card.hovered .official-logo {
  filter: opacity(1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  transform: scale(1.1);
}

.official-menu-card.hovered .logo-fallback {
  transform: scale(1.1);
}

.icon-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, #475569 0%, #334155 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(71, 85, 105, 0.3);
  transition: all 0.4s ease;
}

.official-menu-card.hovered .icon-badge {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  transform: scale(1.15);
}

.badge-icon {
  font-size: 0.8rem;
}

.card-decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  border: 2px solid rgba(71, 85, 105, 0.1);
  border-radius: 50%;
  opacity: 0;
  transition: all 0.4s ease;
}

.official-menu-card.hovered .card-decoration {
  opacity: 1;
  animation: decorationRotate 3s linear infinite;
}

@keyframes decorationRotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

/* Professional Content */
.card-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.official-card-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.official-menu-card.hovered .official-card-title {
  color: #0f172a;
}

.official-card-description {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 2rem;
  transition: color 0.3s ease;
}

.official-menu-card.hovered .official-card-description {
  color: #475569;
}

/* Professional CTA */
.official-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #475569;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
}

.official-menu-card.hovered .official-cta {
  color: #1e293b;
}

.cta-text {
  transition: transform 0.3s ease;
}

.official-menu-card.hovered .cta-text {
  transform: translateX(-4px);
}

.cta-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.official-menu-card.hovered .cta-arrow {
  transform: translateX(6px);
}

.cta-underline {
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(45deg, #475569, #64748b);
  transition: all 0.4s ease;
  transform: translateX(-50%);
}

.official-menu-card.hovered .cta-underline {
  width: 100%;
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

.corner-seal {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(71, 85, 105, 0.15);
  opacity: 0;
  transition: all 0.4s ease;
}

.corner-seal.top-left {
  top: 15px;
  left: 15px;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 8px;
}

.corner-seal.top-right {
  top: 15px;
  right: 15px;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 8px;
}

.corner-seal.bottom-left {
  bottom: 15px;
  left: 15px;
  border-right: none;
  border-top: none;
  border-bottom-left-radius: 8px;
}

.corner-seal.bottom-right {
  bottom: 15px;
  right: 15px;
  border-left: none;
  border-top: none;
  border-bottom-right-radius: 8px;
}

.official-menu-card.hovered .corner-seal {
  opacity: 1;
  border-color: rgba(71, 85, 105, 0.4);
}

/* Hover Effects */
.card-shine {
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
  pointer-events: none;
}

.official-menu-card.hovered .card-shine {
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

.card-border-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  background: linear-gradient(
    45deg,
    rgba(71, 85, 105, 0.2),
    transparent,
    rgba(100, 116, 139, 0.2)
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.official-menu-card.hovered .card-border-glow {
  opacity: 1;
  animation: borderGlow 2s ease-in-out infinite;
}

@keyframes borderGlow {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.5;
  }
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 1200px) {
  .official-menu-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .official-title {
    font-size: 2.5rem;
  }

  .official-menu-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 3rem;
  }

  .official-menu-card {
    padding: 2.5rem 2rem;
  }

  .official-icon-container {
    width: 100px;
    height: 100px;
  }

  .official-logo {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .official-header {
    padding: 100px 0 80px;
  }

  .official-title {
    font-size: 2rem;
  }

  .official-subtitle {
    font-size: 1rem;
    padding: 0 1rem;
  }

  .official-menu-card {
    padding: 2rem 1.5rem;
  }

  .official-card-title {
    font-size: 1.5rem;
  }

  .official-card-description {
    font-size: 0.95rem;
  }
}
</style>
