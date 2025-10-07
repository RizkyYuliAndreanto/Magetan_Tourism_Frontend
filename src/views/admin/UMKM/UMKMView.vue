<template>
  <div class="main-content-inner">
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
          <h2 class="page-title">Manajemen UMKM</h2>
          <p class="page-subtitle">Kelola semua data UMKM dan kategorinya yang ada di website Anda.</p>
        </div>

        <div class="tab-navigation">
          <button
            :class="['tab-button', { 'active': activeTab === 'umkm' }]"
            @click="activeTab = 'umkm'">
            <svg
              class="tab-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M6 2L3 6v14c0 1.1.9 2 2 2h14c0-1.1-.9-2-2-2V6l-3-4H6z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Manajemen UMKM
          </button>
          <button
            :class="['tab-button', { 'active': activeTab === 'kategori' }]"
            @click="activeTab = 'kategori'">
            <svg
              class="tab-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M20.5 12.5l-9.9 9.9c-.8.8-2.2.8-3 0L3.6 15.6c-.8-.8-.8-2.2 0-3L13.1 2.1c.8-.8 2.2-.8 3 0L20.5 5c.8.8.8 2.2 0 3z"/>
              <line x1="14.5" y1="8.5" x2="8.5" y2="14.5"/>
            </svg>
            Manajemen Kategori
          </button>
        </div>
        
        <div class="tab-content">
          <transition name="fade" mode="out-in">
            <div v-if="activeTab === 'umkm'" key="umkm">
              <UMKMManagement />
            </div>
            <div v-else-if="activeTab === 'kategori'" key="kategori">
              <KategoriManagement />
            </div>
          </transition>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import UMKMManagement from './UMKMManagement.vue';
import KategoriManagement from './KategoriManagement.vue';

const toggleSidebar = inject('toggleSidebar');
const activeTab = ref('umkm');

const pageTitle = computed(() => {
  return activeTab.value === 'umkm' ? 'Manajemen UMKM' : 'Manajemen Kategori UMKM';
});
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
  padding-top: var(--navbar-height);
  background-color: var(--background-light); 
  margin-top: 80px;
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
  padding: 2rem;
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

/* Tab Navigation */
.tab-navigation {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
  padding-left: 1.5rem;
}
.tab-button {
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color-muted);
  padding: 0.75rem 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.tab-button::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  transition: background-color 0.3s ease;
}
.tab-button:hover {
  color: var(--primary-blue);
}
.tab-button.active {
  color: var(--primary-blue);
  font-weight: 700;
}
.tab-button.active::after {
  background-color: var(--primary-blue);
}
.tab-icon {
  width: 20px;
  height: 20px;
}

.tab-content {
  background-color: var(--background-dark);
  padding: 2rem;
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
    gap: 0.5rem;
    padding-left: 0;
  }
  .tab-button {
    justify-content: flex-start;
    border-bottom: none;
    border-left: 3px solid transparent;
    padding: 0.75rem 1rem;
  }
  .tab-button.active {
    border-bottom: none;
    border-left: 3px solid var(--primary-blue);
  }
  .tab-button::after {
    display: none;
  }
}
@media (max-width: 576px) {
  .page-title {
    font-size: 1.5rem;
  }
}
</style>