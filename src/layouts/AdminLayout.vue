<template>
  <div class="admin-layout">
    <Navbar />
    <div class="admin-content">
      <AdminSidebar :is-open="sidebarOpen" @close-sidebar="closeSidebar" />
      <div :class="['main-content-wrapper', { 'sidebar-open': sidebarOpen }]">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted } from "vue";
import AdminSidebar from "../components/admin/AdminSidebar.vue";
import Navbar from "../components/Navbar.vue";

const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

provide("sidebarOpen", sidebarOpen);
provide("toggleSidebar", toggleSidebar);

// Provide scroll utilities
const scrollToTop = () => {
  const mainContent = document.querySelector(".main-content-wrapper");
  if (mainContent) {
    mainContent.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const ensureScrollable = () => {
  fixScrollIssues();
};

provide("scrollToTop", scrollToTop);
provide("ensureScrollable", ensureScrollable);

const handleResize = () => {
  if (window.innerWidth <= 768) {
    sidebarOpen.value = false;
  } else {
    sidebarOpen.value = true;
  }
};

// Fix scroll issues
const fixScrollIssues = () => {
  // Ensure body doesn't have overflow hidden from modal overlays
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";

  // Ensure main content wrapper can scroll
  const mainContent = document.querySelector(".main-content-wrapper");
  if (mainContent) {
    mainContent.scrollTop = 0;
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();

  // Fix scroll issues on mount
  fixScrollIssues();

  // Fix scroll issues when route changes
  const unwatch = () => {
    setTimeout(fixScrollIssues, 100);
  };

  // Listen for route changes (if using Vue Router)
  if (window.Vue && window.Vue.nextTick) {
    window.Vue.nextTick(unwatch);
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style>
:root {
  --sidebar-width: 260px;
  --background-light: #e9ecef;
}

/* Remove global HTML/body restrictions */

/* Reset any potential scroll-blocking styles */
* {
  scroll-behavior: smooth;
}

/* AdminLayout specific container */

.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
}

.admin-content {
  display: flex;
  flex: 1;
  margin-top: 70px; /* Space for navbar */
}

.main-content-wrapper {
  flex-grow: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 70px);
  height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}
.main-content-wrapper.sidebar-open {
  margin-left: var(--sidebar-width);
}
.main-content-wrapper:not(.sidebar-open) {
  margin-left: 0;
}
/* Ensure proper scrolling behavior */
.main-content-wrapper::-webkit-scrollbar {
  width: 8px;
}

.main-content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.main-content-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.main-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Ensure content inside can be scrolled */
.main-content-wrapper > * {
  flex-shrink: 0;
  min-height: fit-content;
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

/* Fix for management pages */
.main-content-wrapper .admin-dashboard-container,
.main-content-wrapper .destinasi-management-container,
.main-content-wrapper > div:not(.form-overlay) {
  max-width: 100%;
  overflow-x: hidden;
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .main-content-wrapper.sidebar-open {
    margin-left: 0;
  }

  .main-content-wrapper {
    height: 100vh;
    overflow-y: auto;
  }
}
</style>
