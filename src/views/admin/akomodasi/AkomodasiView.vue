<template>
  <div class="main-content-inner">
    <header class="admin-header">
      <button class="mobile-menu-btn" @click="toggleSidebar">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"></path>
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
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import AkomodasiManagement from './AkomodasiManagement.vue';

const toggleSidebar = inject('toggleSidebar');

const pageTitle = computed(() => 'Manajemen Akomodasi');
</script>

<style scoped>
/* Variabel CSS yang disesuaikan dari BeritaKategoriView.vue */
:root {
  --primary-blue: #007bff;
  --background-light: #f8f9fa;
  --background-dark: #ffffff;
  --text-color-dark: #212529;
  --text-color-muted: #6c757d;
  --border-color: #e9ecef;
  --shadow-light: rgba(0, 0, 0, 0.08);
  --box-shadow: 0 4px 15px var(--shadow-light);
  --sidebar-width: 260px;
  --navbar-height: 70px;
}
.main-content-inner {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--background-light); 
  padding-top: calc(var(--navbar-height) + 2rem);
  margin-top: 80px; /* Tambahkan margin atas untuk menghindari tumpang tindih dengan header */
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
  padding: 0 2rem 2rem 2rem;
  background-color: var(--background-light);
}
.content-wrapper {
  padding: 0;
}
.header-container {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  margin-top: 32px;
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
  padding: 2rem;
  border-radius: 12px;
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
  .main-content-inner {
    padding-top: calc(var(--navbar-height) + 1rem); /* Sesuaikan padding atas untuk mobile */
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
  .content-area {
    padding: 0 1rem 1rem 1rem;
  }
}
@media (max-width: 576px) {
  .page-title {
    font-size: 1.5rem;
  }
}
</style>