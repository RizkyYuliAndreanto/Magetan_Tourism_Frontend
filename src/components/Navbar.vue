<template>
  <nav :class="['navbar', { 'menu-active': isOpen }]">
    <div class="navbar-container">
      <div class="navbar-logo-group">
        <img :src="logoMagetanTourismPng" alt="Logo Magetan Tourism" />
        <img :src="logoMagetanNgangeniOutline" alt="Logo Magetan Ngangeni" />
        <img
          :src="logoWonderfulIndonesiaFinal"
          alt="Logo Wonderful Indonesia" />
        <img :src="logoPemkab" alt="Logo Pemkab" />
      </div>

      <div class="navbar-right">
        <div class="navbar-search-mobile">
          <input type="text" placeholder="Search..." />
          <i class="fas fa-search search-icon"></i>
        </div>

        <div class="menu-toggle" @click="toggleMenu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </div>

      <ul :class="['navbar-menu', { active: isOpen }]">
        <li class="navbar-item navbar-search-desktop">
          <input type="text" placeholder="Search..." />
          <i class="fas fa-search search-icon"></i>
        </li>
        <li :class="['navbar-item', { active: isActive('/') }]">
          <router-link to="/" class="navbar-links" @click="closeMenu"
            >Beranda</router-link
          >
        </li>
        <li :class="['navbar-item', { active: isActive('/profil-dinas') }]">
          <router-link
            to="/profil-dinas"
            class="navbar-links"
            @click="closeMenu"
            >Profil</router-link
          >
        </li>
        <li :class="['navbar-item', { active: isActive('/destinasi') }]">
          <router-link to="/destinasi" class="navbar-links" @click="closeMenu"
            >Destinasi</router-link
          >
        </li>
        <li :class="['navbar-item', { active: isActive('/event') }]">
          <router-link to="/event" class="navbar-links" @click="closeMenu"
            >Event</router-link
          >
        </li>

        <li :class="['navbar-item', { active: isActive('/budaya') }]">
          <router-link to="/budaya" class="navbar-links" @click="closeMenu"
            >Budaya</router-link
          >
        </li>
        <li :class="['navbar-item', { active: isActive('/ekonomi-kreatif') }]">
          <router-link
            to="/ekonomi-kreatif"
            class="navbar-links"
            @click="closeMenu"
            >Ekraf</router-link
          >
        </li>
        <li :class="['navbar-item', { active: isActive('/informasi') }]">
          <router-link to="/informasi" class="navbar-links" @click="closeMenu"
            >Informasi</router-link
          >
        </li>

        <li class="navbar-item navbar-login">
          <router-link
            v-if="!isLoggedIn"
            to="/login"
            class="navbar-links button-login"
            @click="closeMenu"
            >Login</router-link
          >

          <div v-else class="admin-profile">
            <router-link to="/admin" class="user-icon-link" @click="closeMenu">
              <img :src="avatarUrl" alt="Admin Avatar" class="admin-avatar" />
            </router-link>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  checkLoginStatus,
  isTokenExpired,
  clearSession,
  onLoginSuccess,
} from "../utils/auth.js";
import logoMagetanTourismPng from "../assets/Logo Magetan Tourism (png).png";
import logoMagetanNgangeniOutline from "../assets/LOGO MAGETAN NGANGENI outline.png";
import logoWonderfulIndonesiaFinal from "../assets/Logo Wonderful indonesia Final.png";
import logoPemkab from "../assets/LOGO PEMKAB.png";

const isOpen = ref(false);
const isLoggedIn = ref(false);
const username = ref("");
const avatarUrl = ref("https://placehold.co/40x40/cccccc/ffffff?text=AD");
const router = useRouter();
const route = useRoute();

// Computed property untuk menentukan menu yang aktif
const isActive = (path) => {
  return (
    route.path === path ||
    (path === "/profil-dinas" && route.path.startsWith("/profil-dinas"))
  );
};

// Updated login status check using auth utility
const updateLoginStatus = () => {
  try {
    const loginStatus = checkLoginStatus();

    if (loginStatus.isLoggedIn) {
      isLoggedIn.value = true;
      const userData = localStorage.getItem("user");

      if (userData) {
        try {
          const user = JSON.parse(userData);
          username.value = user.username || "Admin";
          avatarUrl.value =
            user.photoUrl || "https://placehold.co/40x40/cccccc/ffffff?text=AD";
        } catch (e) {
          username.value = "Admin";
          avatarUrl.value = "https://placehold.co/40x40/cccccc/ffffff?text=AD";
        }
      }
    } else {
      // Session expired or invalid - clear everything
      isLoggedIn.value = false;
      username.value = "";
      avatarUrl.value = "https://placehold.co/40x40/cccccc/ffffff?text=AD";

      // If user was logged in and now session is expired, redirect to login if on admin page
      if (route.path.startsWith("/admin")) {
        router.push("/login");
      }
    }
  } catch (error) {
    isLoggedIn.value = false;
    username.value = "";
    avatarUrl.value = "https://placehold.co/40x40/cccccc/ffffff?text=AD";
  }
};

// Handle storage changes (for multi-tab synchronization)
const handleStorageChange = (event) => {
  if (event.key === "access_token" || event.key === "user") {
    updateLoginStatus();
  }
};

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

onMounted(() => {
  // Initial login status check
  updateLoginStatus();

  // Listen for storage changes (multi-tab sync)
  window.addEventListener("storage", handleStorageChange);

  // Listen for auth events from auth.js
  window.addEventListener("authLoginSuccess", updateLoginStatus);
  window.addEventListener("authSessionExpired", () => {
    isLoggedIn.value = false;
    username.value = "";
    avatarUrl.value = "https://placehold.co/40x40/cccccc/ffffff?text=AD";

    if (route.path.startsWith("/admin")) {
      router.push("/login");
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("storage", handleStorageChange);
  window.removeEventListener("authLoginSuccess", updateLoginStatus);
  window.removeEventListener("authSessionExpired", () => {});
});

// Watch route changes for login status updates
watch(
  () => route.path,
  () => {
    updateLoginStatus();
  }
);
</script>

<style scoped>
.navbar {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 8px 20px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 70px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-bottom: 1px solid rgba(0, 119, 182, 0.1);
}

.navbar:hover {
  background-color: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 32px);
  position: relative;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.navbar-logo-group {
  display: flex;
  align-items: center;
  gap: clamp(6px, 2vw, 12px);
  z-index: 2;
  flex-shrink: 0;
}

.navbar-logo-group img {
  height: clamp(28px, 4vw, 38px);
  width: auto;
  max-height: 100%;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.navbar-logo-group img:hover {
  transform: scale(1.1) translateY(-2px);
  filter: drop-shadow(0 4px 8px rgba(0, 119, 182, 0.3));
}

.navbar-search-mobile {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: clamp(180px, 35vw, 240px);
  z-index: 1;
}

.navbar-search-mobile input {
  width: 100%;
  padding: clamp(6px, 2vw, 10px) clamp(12px, 3vw, 18px) clamp(6px, 2vw, 10px)
    clamp(30px, 8vw, 40px);
  border-radius: 25px;
  border: 2px solid transparent;
  background-color: rgba(241, 243, 245, 0.9);
  color: #333;
  font-size: clamp(0.8rem, 2.5vw, 0.95rem);
  outline: none;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(8px);
}

.navbar-search-mobile input:focus {
  background-color: rgba(255, 255, 255, 0.95);
  border-color: #0077b6;
  box-shadow: 0 0 0 3px rgba(0, 119, 182, 0.1);
  transform: scale(1.02);
}

.navbar-search-mobile input::placeholder {
  color: #888;
  transition: opacity 0.3s ease;
}

.navbar-search-mobile input:focus::placeholder {
  opacity: 0.7;
}

.navbar-search-mobile .search-icon {
  position: absolute;
  left: clamp(10px, 3vw, 15px);
  color: #888;
  font-size: clamp(0.8rem, 2.5vw, 0.95rem);
  transition: all 0.3s ease;
  pointer-events: none;
}

.navbar-search-mobile input:focus + .search-icon {
  color: #0077b6;
  transform: scale(1.1);
}

.menu-toggle {
  display: none;
  width: 32px;
  height: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  z-index: 1001;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.menu-toggle:hover {
  background-color: rgba(0, 119, 182, 0.1);
  transform: scale(1.1);
}

.menu-toggle .bar {
  width: 100%;
  height: 3px;
  background: linear-gradient(135deg, #0077b6, #00a8cc);
  border-radius: 3px;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-origin: center;
}

.menu-active .menu-toggle .bar:nth-child(1) {
  transform: translateY(10.5px) rotate(45deg);
  background: linear-gradient(135deg, #dc3545, #e74c3c);
}
.menu-active .menu-toggle .bar:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}
.menu-active .menu-toggle .bar:nth-child(3) {
  transform: translateY(-10.5px) rotate(-45deg);
  background: linear-gradient(135deg, #dc3545, #e74c3c);
}

.navbar-menu {
  display: none;
  list-style: none;
  text-align: center;
  justify-content: end;
  margin-left: auto;
  gap: clamp(8px, 2vw, 16px);
}

.navbar-item {
  height: 70px;
  display: flex;
  align-items: center;
  position: relative;
}

.navbar-links {
  color: #333;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 clamp(0.8rem, 2vw, 1.2rem);
  height: 100%;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  font-weight: 500;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  border-radius: 8px;
}

.navbar-links::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 119, 182, 0.1),
    transparent
  );
  transition: left 0.6s ease;
}

.navbar-links:hover::before {
  left: 100%;
}

.navbar-links::after {
  content: "";
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  height: 3px;
  width: 0;
  background: linear-gradient(135deg, #0077b6, #00a8cc);
  border-radius: 2px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.navbar-links:hover,
.navbar-item.active .navbar-links {
  color: #0077b6;
  background-color: rgba(0, 119, 182, 0.05);
  transform: translateY(-2px);
}

.navbar-links:hover::after,
.navbar-item.active .navbar-links::after {
  width: 80%;
}

.button-login {
  border: 2px solid #0077b6;
  padding: clamp(6px, 2vw, 10px) clamp(16px, 4vw, 24px);
  border-radius: 25px;
  margin-left: 15px; /* Gunakan margin positif ini untuk spasi */
  color: #0077b6;
  font-weight: 600;
  background: linear-gradient(135deg, transparent, transparent);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  margin-left: -20px;
  z-index: 1; /* z-index yang terlalu tinggi tidak diperlukan di sini */
}

.button-login::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0077b6, #00a8cc);
  transition: left 0.4s ease;
  z-index: -1;
}

.button-login:hover {
  color: white;
  border-color: #0077b6;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 119, 182, 0.3);
}

.button-login:hover::before {
  left: 0;
}

.user-menu-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-icon-link {
  color: #333;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
  padding: 8px 10px;
  border-radius: 8px;
}

.user-icon-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #0077b6;
}

.user-icon {
  width: 24px;
  height: 24px;
}

.navbar-search-desktop {
  position: relative;
  margin-right: 20px;
  display: none;
}

.navbar-search-desktop input {
  width: 250px;
  padding: 8px 15px 8px 35px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  background-color: #f1f3f5;
  color: #333;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
}
.navbar-search-desktop input::placeholder {
  color: #888;
}
.navbar-search-desktop .search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 0.9rem;
}

/* Media Queries untuk Responsivitas */
@media screen and (min-width: 1200px) {
  .navbar-container {
    padding: 0 40px;
  }
  .navbar-menu {
    gap: 20px;
  }
}

@media screen and (min-width: 768px) {
  .menu-toggle {
    display: none;
  }
  .navbar-menu {
    display: flex;
  }
  .navbar-search-mobile {
    display: none;
  }
  .navbar-search-desktop {
    display: flex;
    align-items: center;
  }
}

@media screen and (max-width: 1024px) {
  .navbar-logo-group {
    gap: 8px;
  }
  .navbar-logo-group img {
    height: clamp(24px, 3.5vw, 32px);
  }
}

@media screen and (max-width: 768px) {
  .navbar {
    height: 65px;
    padding: 6px 16px;
  }

  .navbar-container {
    justify-content: space-between;
    padding: 0 12px;
  }

  .navbar-logo-group {
    gap: 6px;
    flex-shrink: 0;
  }

  .navbar-logo-group img {
    height: clamp(22px, 4vw, 28px);
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .menu-toggle {
    display: flex;
    order: 2; /* Pastikan hamburger menu di paling kanan */
  }

  .navbar-search-desktop {
    display: none !important; /* Sembunyikan search desktop di mobile */
  }

  .navbar-menu {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    position: absolute;
    top: 65px;
    left: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-20px);
    padding: 24px 0;
    border-bottom: 1px solid rgba(0, 119, 182, 0.1);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    max-height: calc(100vh - 65px);
    overflow-y: auto;
  }

  .navbar-menu.active {
    padding: 24px 12px 24px 12px;
    visibility: visible;
    transform: translateY(0);
  }
  .navbar-login {
    margin-top: 12px;
    margin-left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    padding-right: 8px;
  }
  .button-login {
    width: 100%;
    max-width: 180px;
    text-align: center;
    padding: 12px 12px;
    font-size: 1rem;
    border-radius: 25px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .navbar-menu.active .navbar-item:nth-child(1) {
    transition-delay: 0.1s;
  }
  .navbar-menu.active .navbar-item:nth-child(2) {
    transition-delay: 0.2s;
  }
  .navbar-menu.active .navbar-item:nth-child(3) {
    transition-delay: 0.3s;
  }
  .navbar-menu.active .navbar-item:nth-child(4) {
    transition-delay: 0.4s;
  }
  .navbar-menu.active .navbar-item:nth-child(5) {
    transition-delay: 0.5s;
  }
  .navbar-menu.active .navbar-item:nth-child(6) {
    transition-delay: 0.6s;
  }
  .navbar-menu.active .navbar-item:nth-child(7) {
    transition-delay: 0.7s;
  }

  .navbar-links {
    padding: 20px 8px 20px 8px;
    padding: 12px 20px;
    width: 90%;
    font-size: 1.1rem;
    width: 100%;
    max-width: 150px;
    padding: 10px 8px;
    font-size: 0.95rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .navbar-login {
    margin-top: 12px;
    margin-left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .button-login {
    width: 100%;
    max-width: 220px;
    text-align: center;
    padding: 12px 16px;
    font-size: 1rem;
    border-radius: 25px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .user-menu-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .user-icon-link {
    font-size: 2.5rem;
  }

  .user-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .navbar-search-mobile {
    display: flex;
    max-width: 180px;
    order: 1; /* Search di sebelah kiri hamburger */
  }

  .navbar-search-mobile input {
    width: 100%;
  }
}
@media screen and (max-width: 480px) {
  .navbar {
    height: 60px;
    padding: 4px 12px;
  }

  .navbar-container {
    padding: 0 8px;
  }

  .navbar-logo-group {
    gap: 4px;
  }

  .navbar-logo-group img {
    height: clamp(20px, 5vw, 26px);
  }

  .navbar-search-mobile {
    max-width: 160px;
    margin-right: 8px;
  }

  .navbar-search-mobile input {
    font-size: 0.8rem;
    padding: 6px 12px 6px 28px;
  }

  .navbar-search-mobile .search-icon {
    left: 8px;
    font-size: 0.8rem;
  }

  .menu-toggle {
    width: 28px;
    height: 20px;
  }

  .navbar-menu {
    top: 60px;
    padding: 20px 0;
  }

  .navbar-links {
    font-size: 1rem;
    padding: 10px 16px;
  }

  .button-login {
    width: 100%;
    max-width: 180px;
    padding: 10px 10px;
    font-size: 0.95rem;
    margin: 0 auto;
    box-sizing: border-box;
  }
}

/* Animasi tambahan untuk pengalaman yang lebih menarik */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.navbar-logo-group img:hover {
  animation: pulse 0.6s ease-in-out;
}

.navbar-menu.active .navbar-item {
  animation: fadeInUp 0.4s ease forwards;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 15px;
}

.admin-profile .user-icon-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  transition: color 0.3s ease;
  gap: 10px;
}

.admin-profile .user-icon-link:hover {
  color: #0077b6;
}

.admin-profile .admin-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0077b6;
  transition: border-color 0.3s ease;
}

.admin-profile .admin-avatar:hover {
  border-color: #333;
}

.admin-profile {
  font-weight: 500;
  color: #333;
  display: none;
}

@media screen and (min-width: 768px) {
  .admin-profile {
    display: block;
  }
}

@media screen and (max-width: 768px) {
  .admin-profile {
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-left: 0;
  }
  .admin-profile .user-icon-link {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .admin-profile .admin-avatar {
    width: 60px;
    height: 60px;
  }
  .admin-profile {
    display: block;
    font-size: 1.2rem;
    margin-top: 5px;
  }
}
</style>
