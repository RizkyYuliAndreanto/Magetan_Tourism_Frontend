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
        <div class="header-right"></div>
      </header>
      
      <main class="content-area">
        <div class="content-wrapper">
          <div class="header-container">
            <h2 class="page-title">Manajemen PPID</h2>
            <p class="page-subtitle">Kelola konten dan kategori PPID Anda.</p>
          </div>

          <div class="tab-navigation">
            <button :class="['tab-button', { 'active': currentTab === 'konten' }]" @click="changeTab('konten')">
              <i class="fas fa-file-alt tab-icon"></i> Konten
            </button>
            <button :class="['tab-button', { 'active': currentTab === 'kategori' }]" @click="changeTab('kategori')">
              <i class="fas fa-tags tab-icon"></i> Kategori
            </button>
          </div>

          <div v-if="currentTab === 'konten'" class="tab-content">
            <KontenPpidManagement />
          </div>

          <div v-if="currentTab === 'kategori'" class="tab-content">
            <KategoriPpidManagement />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AdminSidebar from '../../../components/admin/AdminSidebar.vue';
import KontenPpidManagement from './KontenPpidManagement.vue';
import KategoriPpidManagement from './KategoriPpidManagement.vue';

const sidebarOpen = ref(false);
const currentTab = ref('konten');

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const pageTitle = computed(() => 'Manajemen PPID');

const changeTab = (tab) => {
  currentTab.value = tab;
};
</script>

<style scoped>
/* Gaya CSS dari komponen lain */
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
  --green-accent: #28a745;
  --red-accent: #dc3545;
  --yellow-accent: #ffc107;
  --border-radius: 12px;
  --box-shadow: 0 5px 15px var(--shadow-light);
  --transition: all 0.3s ease;
  --sidebar-width: 260px;
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: 90px;
}
.admin-header {
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  z-index: 900;
  height: var(--navbar-height);
  background-color: var(--background-dark);
  padding: 0 30px;
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 4px var(--shadow-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: left 0.3s ease;
}
.main-content.sidebar-open .admin-header {
  left: var(--sidebar-width);
}
.main-content:not(.sidebar-open) .admin-header {
  left: 0;
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
.content-area {
  flex-grow: 1;
  padding: 30px;
  background-color: var(--background-light);
}
.content-wrapper {
  padding: 0;
}
.header-container {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}
.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color-dark);
  margin-bottom: 0.5rem;
}
.page-subtitle {
  font-size: 1rem;
  color: var(--text-color-muted);
  margin: 0;
}
.tab-navigation {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);
  background-color: var(--background-dark);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  overflow: hidden;
}
.tab-button {
  background-color: transparent;
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color-muted);
  cursor: pointer;
  transition: var(--transition);
  border-bottom: 3px solid transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}
.tab-button:hover {
  color: var(--primary-blue);
  background-color: rgba(0, 123, 255, 0.1);
}
.tab-button.active {
  color: var(--primary-blue);
  border-bottom: 3px solid var(--primary-blue);
  background-color: rgba(0, 123, 255, 0.05);
}
.tab-icon {
  font-size: 1.1rem;
}
.tab-content {
  background-color: var(--background-dark);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  border: 1px solid var(--border-color);
}
@media (max-width: 992px) {
  .content-wrapper {
    padding: 1rem;
  }
}
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  .main-content.sidebar-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
  }
  .admin-header {
    left: 0;
  }
  .mobile-menu-btn {
    display: block;
  }
  .header-title {
    font-size: 1.3rem;
  }
  .tab-navigation {
    flex-direction: column;
  }
  .tab-button {
    justify-content: center;
    border-bottom: none;
    border-left: 3px solid transparent;
  }
  .tab-button.active {
    border-bottom: none;
    border-left: 3px solid var(--primary-blue);
  }
}
@media (max-width: 576px) {
  .page-title {
    font-size: 1.5rem;
  }
}
</style>