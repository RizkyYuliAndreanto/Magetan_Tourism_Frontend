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
            <i :class="item.icon"></i>
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
  max-width: 1000px;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.menu-card {
  display: block;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.menu-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-icon {
  width: 60px;
  height: 60px;
  background-color: #e6f3fa;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
}

.menu-card:hover .card-icon {
  background-color: #0077b6;
}

.card-icon i {
  font-size: 2rem;
  color: #0077b6;
  transition: color 0.3s ease;
}

.menu-card:hover .card-icon i {
  color: white;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.card-description {
  font-size: 1rem;
  color: #6c757d;
  line-height: 1.6;
}
</style>