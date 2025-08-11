<template>
  <div class="admin-dashboard">
    <AdminSidebar :is-open="sidebarOpen" @close-sidebar="sidebarOpen = false" />
    
    <div :class="['main-content', { 'sidebar-open': sidebarOpen }]">
      <header class="admin-header">
        <button class="mobile-menu-btn" @click="toggleSidebar">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h1 class="header-title">{{ pageTitle }}</h1>
        <div class="header-right">
        </div>
      </header>
      
      <main class="content-area">
        <div v-if="currentRoute === 'dashboard'">
          <h2>Selamat Datang di Dashboard Admin!</h2>
          <p>Ini adalah halaman utama dashboard Anda. Di sini Anda bisa melihat ringkasan data penting.</p>
          <div class="summary-cards">
            <div class="card">
              <h3>Total Berita</h3>
              <p>120</p>
            </div>
            <div class="card">
              <h3>Total Destinasi</h3>
              <p>45</p>
            </div>
            <div class="card">
              <h3>Total Event</h3>
              <p>15</p>
            </div>
          </div>
        </div>
        
        <div v-else-if="currentRoute === 'berita'">
          <h2>Manajemen Berita & Kategori</h2>
          <p>Di sini Anda dapat mengelola berita dan kategori berita.</p>
        </div>
        
        </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AdminSidebar from '../../components/admin/AdminSidebar.vue';

const currentRoute = ref('dashboard');
const sidebarOpen = ref(false);

const handleNavigation = (route) => {
  currentRoute.value = route;
  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 768) {
    sidebarOpen.value = false;
  }
};

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const pageTitle = computed(() => {
  const titles = {
    'dashboard': 'Dashboard Utama',
    'berita': 'Berita & Kategori',
    'destinasi': 'Destinasi & Kategori',
    'event': 'Event',
    'sejarah': 'Sejarah',
    'umkm': 'UMKM',
    'media-galeri': 'Media & Galeri',
    'struktur-anggota': 'Struktur Anggota',
    'pengumuman': 'Pengumuman',
    'visi-misi': 'Visi & Misi',
    'struktur-organisasi': 'Struktur Organisasi',
    'akomodasi': 'Akomodasi',
    'ppid': 'Konten PPID & Kategori',
    'pengaturan-akun': 'Pengaturan Akun'
  };
  return titles[currentRoute.value] || 'Dashboard Admin';
});
</script>

<style scoped>
:root {
  --primary-blue: #007bff;
  --secondary-blue: #17a2b8;
  --background-light: #e9ecef;
  --background-dark: #ffffff;
  --text-color-dark: #343a40;
  --text-color-light: #ffffff;
  --text-color-muted: #6c757d;
  --border-color: #dee2e6;
  --shadow-light: rgba(0, 0, 0, 0.08);
  --shadow-medium: rgba(0, 0, 0, 0.15);
  --sidebar-width: 260px; /* Lebar sidebar disesuaikan */
  --navbar-height: 70px;
}

.admin-dashboard {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background-color: var(--background-light);
}

.main-content {
  flex-grow: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
 padding-top: 90px;
}

.admin-header {
  position: sticky;
  top: 0;
  z-index: 900;
  height: var(--navbar-height);
  background-color: var(--background-dark);
  padding: 0 30px;
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 4px var(--shadow-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color-dark);
  padding: 10px;
}

.mobile-menu-btn svg {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color-dark);
  margin: 0;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-blue);
}

.admin-name {
  font-weight: 500;
  color: var(--text-color-dark);
}

.content-area {
  flex-grow: 1;
  padding: 30px;
  background-color: var(--background-light);
}

.content-area h2 {
  font-size: 1.8rem;
  color: var(--text-color-dark);
  margin-bottom: 20px;
}

.content-area p {
  font-size: 1rem;
  color: var(--text-color-muted);
  line-height: 1.6;
  margin-bottom: 30px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background-color: var(--background-dark);
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 5px 15px var(--shadow-light);
  text-align: center;
}

.card h3 {
  font-size: 1.2rem;
  color: var(--text-color-dark);
  margin-bottom: 10px;
}

.card p {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-blue);
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .main-content.sidebar-open {
    /* Mencegah scrolling konten utama saat sidebar terbuka */
    overflow: hidden;
    position: fixed;
    width: 100%;
  }

  .mobile-menu-btn {
    display: block;
  }

  .header-title {
    font-size: 1.3rem;
  }

  .admin-profile .admin-name {
    display: none;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>