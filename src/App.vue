<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";
import MainFooter from "./components/MainFooter.vue";

const route = useRoute();
const isAdminPage = computed(
  () =>
    route.path.startsWith("/admin") ||
    route.path === "/login" ||
    route.path === "/register"
);
</script>

<template>
  <div id="app" class="app-container">
    <Navbar v-if="!isAdminPage" />
    <main class="main-content">
      <router-view />
    </main>
    <MainFooter v-if="!isAdminPage" />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  line-height: 1.5;
  background-color: #00bfff;
  color: rgba(255, 255, 255, 0.87);
  overflow-x: hidden;
}

.app-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow-y: auto;
}
</style>
