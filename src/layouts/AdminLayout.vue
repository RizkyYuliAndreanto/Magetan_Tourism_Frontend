<template>
  <div class="admin-layout">
    <AdminSidebar :is-open="sidebarOpen" @close-sidebar="closeSidebar" />
    <div :class="['main-content-wrapper', { 'sidebar-open': sidebarOpen }]">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted } from "vue";
import AdminSidebar from "../components/admin/AdminSidebar.vue";

const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

provide("sidebarOpen", sidebarOpen);
provide("toggleSidebar", toggleSidebar);

const handleResize = () => {
  if (window.innerWidth <= 768) {
    sidebarOpen.value = false;
  } else {
    sidebarOpen.value = true;
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
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
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.main-content-wrapper {
  flex-grow: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.main-content-wrapper.sidebar-open {
  margin-left: var(--sidebar-width);
}
.main-content-wrapper:not(.sidebar-open) {
  margin-left: 0;
}
@media (max-width: 768px) {
  .main-content-wrapper.sidebar-open {
    margin-left: 0;
  }
}
</style>