<template>
  <nav :class="['navbar', { 'menu-active': isOpen }]">
    <div class="navbar-container">
      <div class="navbar-logo-group">
        <img :src="logoMagetanTourismPng" alt="Logo Magetan Tourism" />
        <img :src="logoMagetanNgangeniOutline" alt="Logo Magetan Ngangeni" />
        <img :src="logoWonderfulIndonesiaFinal" alt="Logo Wonderful Indonesia" />
        <img :src="logoPemkab" alt="Logo Pemkab" />
      </div>

      <div class="navbar-search-mobile">
        <input type="text" placeholder="Search..." />
        <i class="fas fa-search search-icon"></i>
      </div>

      <div class="menu-toggle" @click="toggleMenu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>

      <ul :class="['navbar-menu', { active: isOpen }]">
        <li class="navbar-item navbar-search-desktop">
          <input type="text" placeholder="Search..." />
          <i class="fas fa-search search-icon"></i>
        </li>
        <li class="navbar-item active">
          <router-link to="/" class="navbar-links" @click="closeMenu">Berita</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/destinasi" class="navbar-links" @click="closeMenu">Destinasi</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/event" class="navbar-links" @click="closeMenu">Event</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/profil-dinas" class="navbar-links" @click="closeMenu">Profil Dinas</router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/pengumuman" class="navbar-links" @click="closeMenu">pengumuman</router-link>
        </li>

        <li class="navbar-item navbar-login">
          <router-link v-if="!isLoggedIn" to="/login" class="navbar-links button-login" @click="closeMenu">Login</router-link>
          
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
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import logoMagetanTourismPng from "../assets/Logo Magetan Tourism (png).png";
import logoMagetanNgangeniOutline from "../assets/LOGO MAGETAN NGANGENI outline.png";
import logoWonderfulIndonesiaFinal from "../assets/Logo Wonderful indonesia Final.png";
import logoPemkab from "../assets/LOGO PEMKAB.png";

const isOpen = ref(false);
const isLoggedIn = ref(false);
const username = ref("");
const avatarUrl = ref("https://placehold.co/40x40/cccccc/ffffff?text=AD");
const router = useRouter();

const checkLoginStatus = () => {
  const token = localStorage.getItem("access_token");
  const userData = localStorage.getItem("user");

  if (token && userData) {
    isLoggedIn.value = true;
    try {
      const user = JSON.parse(userData);
      username.value = user.username || "Admin";
      avatarUrl.value = user.photoUrl || "https://placehold.co/40x40/cccccc/ffffff?text=AD";
    } catch (e) {
      username.value = "Admin";
      avatarUrl.value = "https://placehold.co/40x40/cccccc/ffffff?text=AD";
    }
  } else {
    isLoggedIn.value = false;
    username.value = "";
    avatarUrl.value = "https://placehold.co/40x40/cccccc/ffffff?text=AD";
  }
};

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

onMounted(() => {
  checkLoginStatus();
  window.addEventListener('storage', checkLoginStatus);
});

onBeforeUnmount(() => {
  window.removeEventListener('storage', checkLoginStatus);
});

router.beforeEach((to, from, next) => {
  checkLoginStatus();
  next();
});
</script>

<style scoped>
.navbar {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 10px 20px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  height: 80px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease-in-out;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 100%;
  max-width: 1300px;
  padding: 0 24px;
}

.navbar-logo-group {
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 2;
}

.navbar-logo-group img {
  height: 35px;
  width: auto;
  max-height: 100%;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.navbar-logo-group img:hover {
  transform: scale(1.1);
}

.navbar-search-mobile {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 250px;
  margin-right: 20px;
  z-index: 1;
}

.navbar-search-mobile input {
  width: 100%;
  padding: 8px 15px 8px 35px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  background-color: #f1f3f5;
  color: #333;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
}

.navbar-search-mobile input::placeholder {
  color: #888;
}

.navbar-search-mobile .search-icon {
  position: absolute;
  left: 12px;
  color: #888;
  font-size: 0.9rem;
}

.menu-toggle {
  display: none;
  width: 40px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  z-index: 999;
}

.menu-toggle .bar {
  width: 100%;
  height: 4px;
  background-color: #0077b6;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
}

.menu-active .menu-toggle .bar:nth-child(1) {
  transform: translateY(13px) rotate(45deg);
}
.menu-active .menu-toggle .bar:nth-child(2) {
  opacity: 0;
}
.menu-active .menu-toggle .bar:nth-child(3) {
  transform: translateY(-13px) rotate(-45deg);
}

.navbar-menu {
  display: none;
  list-style: none;
  text-align: center;
  justify-content: end;
  margin-left: auto;
}

.navbar-item {
  height: 80px;
  display: flex;
  align-items: center;
}

.navbar-links {
  color: #333;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.navbar-links::after {
  content: "";
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  height: 3px;
  width: 0;
  background-color: #0077b6;
  transition: width 0.3s ease-out;
}

.navbar-links:hover,
.navbar-item.active .navbar-links {
  color: #0077b6;
}

.navbar-links:hover::after,
.navbar-item.active .navbar-links::after {
  width: 100%;
}

.button-login {
  border: 1px solid #0077b6;
  padding: 8px 20px;
  border-radius: 8px;
  margin-left: 15px;
  color: #0077b6;
  transition: all 0.3s ease;
}

.button-login:hover {
  background-color: #0077b6;
  color: white;
  border-color: #0077b6;
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

@media screen and (max-width: 768px) {
  .navbar-container {
    justify-content: space-between;
  }
  .navbar-menu {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    position: absolute;
    top: 80px;
    left: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(8px);
    transition: all 0.5s ease-in-out;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-100%);
    padding: 20px 0;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  .navbar-menu.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  .navbar-item {
    height: auto;
    padding: 15px 0;
    justify-content: center;
    width: 100%;
  }
  .navbar-links {
    text-align: center;
    padding: 0;
    width: 100%;
    font-size: 1.2rem;
  }
  .navbar-links::after {
    bottom: 5px;
  }
  .navbar-login {
    margin-top: 20px;
    margin-left: 0;
  }
  .button-login {
    width: 80%;
    text-align: center;
    padding: 12px 20px;
    font-size: 1.1rem;
    border-radius: 8px;
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
    order: 2;
    justify-content: flex-end;
    flex-grow: 1;
    margin-right: 0;
    max-width: none;
  }
  .navbar-search-mobile input {
    width: calc(100% - 60px);
    margin-left: auto;
  }
}
@media screen and (max-width: 480px) {
  .navbar-search-mobile input {
    width: 180px;
    font-size: 0.8rem;
  }
  .navbar-search-mobile .search-icon {
    left: 8px;
  }
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