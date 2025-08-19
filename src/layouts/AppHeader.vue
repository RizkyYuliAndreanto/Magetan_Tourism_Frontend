<template>
  <header class="app-header">
    <div class="header-left">
      <div class="logo">
        <img src="https://placehold.co/40x40/cccccc/ffffff?text=AD" alt="Logo" class="logo-image" />
        <span class="site-title">Magetan Tourism</span>
      </div>
    </div>
    <nav class="main-nav">
      <ul>
        <li><router-link to="/" class="nav-link">Beranda</router-link></li>
        <li><router-link to="/berita" class="nav-link">Berita</router-link></li>
        <li><router-link to="/destinasi" class="nav-link">Destinasi</router-link></li>
        <li><router-link to="/event" class="nav-link">Event</router-link></li>
        <li><router-link to="/profil" class="nav-link">Profil Dinas</router-link></li>
        <li><router-link to="/pengumuman" class="nav-link">Pengumuman</router-link></li>
      </ul>
    </nav>
    <div class="header-right">
      <div class="search-bar">
        <input type="text" placeholder="Cari..." class="search-input" />
        <button class="search-button">
          <i class="fas fa-search"></i>
        </button>
      </div>
      <router-link to="/login" class="admin-link">
        <i class="fas fa-user-circle"></i>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: var(--pure-white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-image {
  width: 40px;
  height: 40px;
}

.site-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-color-dark);
}

.main-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color-dark);
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.nav-link:hover, .nav-link.router-link-active {
  color: var(--primary-blue);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  border: 1px solid var(--border-color);
  border-radius: 50px;
  padding: 8px 15px;
  padding-right: 40px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.search-button {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: var(--text-color-muted);
  cursor: pointer;
}

.admin-link {
  font-size: 1.5rem;
  color: var(--text-color-dark);
  transition: color 0.3s ease;
}

.admin-link:hover {
  color: var(--primary-blue);
}

/* Responsive */
@media (max-width: 1024px) {
  .main-nav {
    display: none;
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 20px;
  }
  .site-title {
    display: none;
  }
}
</style>