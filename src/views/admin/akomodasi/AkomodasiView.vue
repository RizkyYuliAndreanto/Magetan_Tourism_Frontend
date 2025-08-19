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
            <h2 class="page-title">Manajemen Akomodasi</h2>
            <p class="page-subtitle">Kelola semua data akomodasi yang ada di website Anda.</p>
          </div>

          <div class="tab-content">
            <AkomodasiManagement />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AdminSidebar from '../../../components/admin/AdminSidebar.vue';
import AkomodasiManagement from './AkomodasiManagement.vue';

const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const pageTitle = computed(() => 'Manajemen Akomodasi');
</script>

<style scoped>
/* Gaya CSS yang sama dari komponen lainnya */
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
}
@media (max-width: 576px) {
  .page-title {
    font-size: 1.5rem;
  }
}
</style>