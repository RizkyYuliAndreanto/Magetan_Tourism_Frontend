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
            <h2 class="page-title">Manajemen Berita & Kategori</h2>
            <p class="page-subtitle">Kelola semua berita dan kategori yang ada di website Anda.</p>
          </div>

          <div class="tab-navigation">
            <button :class="['tab-button', { 'active': currentTab === 'berita' }]" @click="changeTab('berita')">
              <i class="fas fa-newspaper tab-icon"></i> Berita
            </button>
            <button :class="['tab-button', { 'active': currentTab === 'kategori' }]" @click="changeTab('kategori')">
              <i class="fas fa-tags tab-icon"></i> Kategori
            </button>
          </div>

          <div class="tab-content">
            <NewsManagement v-if="currentTab === 'berita'" />
            <CategoryManagement v-if="currentTab === 'kategori'" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AdminSidebar from '../../../components/admin/AdminSidebar.vue';
import NewsManagement from './NewsManagement.vue';
import CategoryManagement from './CategoryManagement.vue';

const sidebarOpen = ref(false);
const currentTab = ref('berita');

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const pageTitle = computed(() => {
  return 'Berita & Kategori';
});

const changeTab = (tab) => {
  currentTab.value = tab;
};
</script>

<style scoped>
:root {
  --primary-blue: #2563eb;
  --secondary-blue: #3b82f6;
  --background-light: #f8fafc;
  --background-dark: #ffffff;
  --text-color-dark: #1e293b;
  --text-color-light: #ffffff;
  --text-color-muted: #64748b;
  --border-color: #e2e8f0;
  --shadow-light: rgba(0, 0, 0, 0.05);
  --shadow-medium: rgba(0, 0, 0, 0.1);
  --green-accent: #10b981;
  --red-accent: #ef4444;
  --yellow-accent: #f59e0b;
  --border-radius: 8px;
  --box-shadow: 0 1px 3px var(--shadow-light);
  --transition: all 0.2s ease;
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
  box-shadow: 0 1px 2px var(--shadow-light);
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
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color-dark);
  margin: 0;
}

.content-area {
  flex-grow: 1;
  padding: 24px;
  background-color: var(--background-light);
}

.content-wrapper {
  padding: 0;
}

.header-container {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color-dark);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--text-color-muted);
  margin: 0;
}

.tab-navigation {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--background-dark);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  overflow: hidden;
}

.tab-button {
  background-color: transparent;
  border: none;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color-muted);
  cursor: pointer;
  transition: var(--transition);
  border-bottom: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-button:hover {
  color: var(--primary-blue);
}

.tab-button.active {
  color: var(--primary-blue);
  border-bottom: 2px solid var(--primary-blue);
}

.tab-icon {
  font-size: 1rem;
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
    font-size: 1.125rem;
  }

  .tab-navigation {
    flex-direction: column;
  }

  .tab-button {
    justify-content: center;
    border-bottom: none;
    border-left: 2px solid transparent;
  }

  .tab-button.active {
    border-bottom: none;
    border-left: 2px solid var(--primary-blue);
  }
}

@media (max-width: 576px) {
  .page-title {
    font-size: 1.25rem;
  }
}
</style>