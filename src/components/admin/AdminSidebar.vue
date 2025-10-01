<template>
  <aside :class="['admin-sidebar', { 'is-open': isOpen }]">
    <div class="sidebar-logo">
      <img
        src="https://placehold.co/40x40/cccccc/ffffff?text=AD"
        alt="Admin Logo" />
      <span>Admin Panel</span>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li v-for="item in menuItems" :key="item.route">
          <a
            href="#"
            @click.prevent="handleNavigation(item.route)"
            :class="[
              'nav-item',
              { active: activeRoute.startsWith(item.route) },
            ]">
            <svg
              class="nav-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="item.icon"></path>
            </svg>
            <span class="nav-text">{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="sidebar-footer">
      <a
        href="#"
        @click.prevent="handleNavigation('/admin/pengaturan-akun')"
        :class="[
          'nav-item',
          { active: activeRoute.startsWith('/admin/pengaturan-akun') },
        ]">
        <svg
          class="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <span class="nav-text">Pengaturan Akun</span>
      </a>
      <button @click="handleLogout" class="nav-item logout-btn">
        <svg
          class="nav-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        <span class="nav-text">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, inject, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const props = defineProps({
  isOpen: Boolean,
});
const toggleSidebar = inject("toggleSidebar");

const router = useRouter();
const route = useRoute();

const activeRoute = ref(route.path);
watch(
  () => route.path,
  (newPath) => {
    activeRoute.value = newPath;
  }
);

const menuItems = [
  {
    route: "/admin/dashboard",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    route: "/admin/berita",
    label: "Berita & Kategori",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2-2l-3 3m0 0l-3-3m3 3V2h2",
  },
  {
    route: "/admin/destinasi",
    label: "Destinasi & Kategori",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    route: "/admin/budaya",
    label: "Budaya & Kategori",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    route: "/admin/event",
    label: "Event",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    route: "/admin/umkm",
    label: "Ekonomi Kreatif",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    route: "/admin/media-galeri",
    label: "Media & Galeri",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    route: "/admin/struktur-anggota",
    label: "Struktur Anggota",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a4 4 0 014-4h12.713M17 20v-2c0-.653-.146-1.288-.423-1.857M9.5 10a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm10 0a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
  },
  {
    route: "/admin/pengumuman",
    label: "Pengumuman",
    icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6 3 3 0 000 6zm-5 8v-6a1.76 1.76 0 01-3.417.592L10 21h4",
  },
  {
    route: "/admin/visi-misi",
    label: "Visi & Misi",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  },
  {
    route: "/admin/struktur-organisasi",
    label: "Struktur Organisasi",
    icon: "M4 6h16M4 10h16M4 14h16M4 18h16",
  },
  {
    route: "/admin/akomodasi",
    label: "Akomodasi",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m-1 4h1m-1-10h2m-2 4h2m-2 4h2m-2 4h2",
  },
  {
    route: "/admin/ppid",
    label: "Konten PPID & Kategori",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
];

const handleNavigation = (route) => {
  router.push(route);
  if (window.innerWidth <= 768) {
    toggleSidebar();
  }
};

const handleLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("storage"));
  router.push("/");
  toggleSidebar();
};
</script>

<style scoped>
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
  --sidebar-width: 260px;
  --navbar-height: 70px;
}
.admin-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: var(--sidebar-width);
  overflow-y: auto;
  background-color: var(--background-dark);
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  border-right: 1px solid var(--border-color);
  z-index: 990;
  transition: transform 0.3s ease-in-out;
  flex-shrink: 0;
  padding-top: 90px;
}
.admin-sidebar:not(.is-open) {
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}
.sidebar-logo {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  padding: 10px 0;
  color: var(--text-color-dark);
  font-weight: bold;
  font-size: 1.3em;
}

.sidebar-logo img {
  height: 40px;
  width: 40px;
  object-fit: contain;
  border-radius: 50%;
  border: 2px solid var(--primary-blue);
}

.sidebar-nav {
  flex-grow: 1;
  padding-right: 10px;
  box-sizing: border-box;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  margin-bottom: 8px;
  border-radius: 10px;
  color: var(--text-color-dark);
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-item i,
.nav-item svg {
  font-size: 1.2em;
  color: var(--text-color-muted);
  transition: color 0.3s ease;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.nav-item .nav-text {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
  min-width: 0;
}

.nav-item:hover {
  background-color: var(--primary-blue);
  color: var(--text-color-light);
}

.nav-item:hover i,
.nav-item:hover svg {
  color: var(--text-color-light);
}

.nav-item.active {
  background-color: var(--primary-blue);
  color: var(--text-color-light);
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2);
}

.nav-item.active i,
.nav-item.active svg {
  color: var(--text-color-light);
}

.sidebar-footer {
  flex-shrink: 0;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  margin-top: 20px;
}

.logout-btn {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 10px;
  color: #dc3545;
  font-size: 1em;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #dc3545;
  color: var(--text-color-light);
}

.logout-btn:hover i,
.logout-btn:hover svg {
  color: var(--text-color-light);
}
@media (max-width: 768px) {
  .admin-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 250px;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    background-color: var(--background-dark);
    z-index: 1050;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
    padding-bottom: 20px;
    box-sizing: border-box;
  }
  .admin-sidebar.is-open {
    transform: translateX(0%);
  }
  .sidebar-logo span,
  .nav-text {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .nav-item {
    justify-content: flex-start;
  }
  .logout-btn {
    justify-content: flex-start;
  }
}
</style>
