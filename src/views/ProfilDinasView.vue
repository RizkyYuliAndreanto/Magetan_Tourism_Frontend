<template>
  <div class="profil-dinas-view">
    <div class="container">
      <h1 class="page-title">Profil Dinas Kebudayaan dan Pariwisata</h1>
      <p class="page-subtitle">Informasi seputar identitas, visi, misi, dan struktur organisasi.</p>
      
      <div class="menu-grid">
        <router-link 
          v-for="item in menuItems" 
          :key="item.title" 
          :to="item.link" 
          class="menu-card"
        >
          <div class="card-icon">
            <img :src="logoPemkab" alt="Logo Pemkab">
          </div>
          <h2 class="card-title">{{ item.title }}</h2>
          <p class="card-description">{{ item.description }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import logoPemkab from '@/assets/LOGO PEMKAB.png';

const menuItems = ref([
  {
    title: 'Profil Dinas',
    description: 'Informasi dasar mengenai Dinas Kebudayaan dan Pariwisata Kabupaten Magetan.',
    icon: 'fas fa-building',
    link: { name: 'DetailProfilDinas' }
  },
  {
    title: 'Visi Misi',
    description: 'Pelajari visi dan misi yang menjadi landasan dan tujuan kerja kami.',
    icon: 'fas fa-bullseye',
    link: { name: 'VisiMisi' }
  },
  {
    title: 'Struktur Organisasi',
    description: 'Lihat bagan struktural organisasi dan divisi di dalam dinas.',
    icon: 'fas fa-sitemap',
    link: { name: 'StrukturOrganisasi' }
  },
  {
    title: 'Struktur Anggota',
    description: 'Daftar lengkap anggota dan jabatan yang ada di lingkungan dinas.',
    icon: 'fas fa-users',
    link: { name: 'StrukturAnggota' }
  },
  {
    title: 'PPID',
    description: 'Informasi dan dokumentasi publik yang dapat diakses oleh masyarakat.',
    icon: 'fas fa-info-circle',
    link: { name: 'PPID' }
  }
]);
</script>

<style scoped>
/* Base styling */
.profil-dinas-view {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #f4f7f9;
  color: #333;
}

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #0077b6;
  text-align: center;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  text-align: center;
  margin-bottom: 50px;
}

/* Menu grid layout */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); /* Diperbesar dari 280px */
  gap: 30px;
}

.menu-card {
  display: block;
  background: white;
  padding: 40px; /* Padding diperbesar */
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
  text-align: center;
}

.menu-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-icon {
  width: 120px; /* Diperbesar dari 100px */
  height: 120px; /* Diperbesar dari 100px */
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px; /* Margin diperbesar */
  transition: background-color 0.3s ease;
  background-color: #e6f3fa;
  margin-left: auto;
  margin-right: auto;
}

.menu-card:hover .card-icon {
  background-color: #0077b6;
}

.card-icon img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.card-title {
  font-size: 1.8rem; /* Ukuran font diperbesar */
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px; /* Margin disesuaikan */
}

.card-description {
  font-size: 1.1rem; /* Ukuran font diperbesar */
  color: #6c757d;
  line-height: 1.6;
}
</style>