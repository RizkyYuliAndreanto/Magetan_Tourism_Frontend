import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import AdminDashboard from "../views/admin/dashboard/AdminDashboard.vue";
import EventView from "../views/admin/event/EventView.vue";
import MediaGaleriView from "../views/admin/media-galeri/MediaGaleriView.vue";
import BeritaKategoriView from "../views/admin/berita/BeritaKategoriView.vue";
import KategoriDestinasiView from "../views/admin/destinasi/KategoriDestinasiView.vue";

import UMKMView from "../views/admin/UMKM/UMKMView.vue";
import StrukturAnggotaView from "../views/admin/struktur-anggota/StrukturAnggotaView.vue";
import PengumumanView from "../views/admin/penggumuman/PengumumanView.vue";
import VisiMisiView from "../views/admin/visi-misi/VisiMisiView.vue";
import StrukturOrganisasiView from "../views/admin/struktur-organisasi/StrukturOrganisasiView.vue";
import AkomodasiView from "../views/admin/akomodasi/AkomodasiView.vue";
import KontenPpidView from "../views/admin/ppid/KontenPpidView.vue";
import AdminBudayaView from "../views/admin/budaya/BudayaView.vue";

//user
import PengumumanUserView from "../views/pengumuman/PengumumanUserView.vue";
import EventUserView from "../views/event/EventUserView.vue";
import DetailEventUserView from "../views/event/DetailEventUserView.vue";
import ProfilDinasView from "../views/ProfilDinas/ProfilDinasView.vue";
import DetailProfilDinasView from "../views/profilDinas/DetailProfilDinasView.vue";
import VisiMisiUserView from "../views/visi-misi/VisiMisiUserView.vue";
import StrukturOrganisasiUserView from "../views/struktur-organisasi/StrukturOrganisasiUserView.vue";
import StrukturAnggotaUserView from "../views/struktur-anggota/StrukturAnggotaUserView.vue";
import PpidView from "../views/ppid/PpidView.vue";
import PariwisataView from "../views/Pariwisata/PariwisataView.vue";
import DetailPariwisata from "../views/Pariwisata/DetailPariwisata.vue";
import BudayaView from "../views/budaya/BudayaView.vue";
import DetailBudayaView from "../views/budaya/DetailBudayaView.vue";
import Ekrafview from "../views/ekraf/ekrafview.vue";
import InformasiView from "../views/informasi/InformasiView.vue";
import DetailInformasiView from "../views/informasi/DetailInformasiView.vue";

const routes = [
  //User
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/pengumuman", // Rute publik
    name: "pengumuman",
    component: PengumumanUserView,
  },
  {
    path: "/event",
    name: "EventViewUser", // Nama rute tidak harus diubah
    component: EventUserView, // Ubah nama komponen di sini
  },
  {
    path: "/event/:id", // Rute dinamis untuk detail event
    name: "EventDetail",
    component: DetailEventUserView,
    props: true, // Mengaktifkan props untuk mengambil ID dari URL
  },
  {
    path: "/profil-dinas",
    name: "ProfilDinas",
    component: ProfilDinasView,
  },
  {
    path: "/profil-dinas/detail",
    name: "DetailProfilDinas",
    component: DetailProfilDinasView,
  },
  {
    path: "/profil-dinas/visimisi",
    name: "VisiMisi",
    component: VisiMisiUserView,
  },
  {
    path: "/profil-dinas/struktur-organisasi",
    name: "StrukturOrganisasi",
    component: StrukturOrganisasiUserView,
  },
  {
    path: "/profil-dinas/struktur-anggota",
    name: "StrukturAnggota",
    component: StrukturAnggotaUserView,
  },
  {
    path: "/profil-dinas/ppid",
    name: "PPID",
    component: PpidView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: LoginView, // Sementara redirect ke login, bisa dibuat komponen terpisah nanti
  },
  {
    path: "/destinasi",
    name: "Destinasi",
    component: PariwisataView,
  },
  {
    path: "/destinasi/:id",
    name: "DetailPariwisata",
    component: DetailPariwisata,
    props: true,
  },
  {
    path: "/budaya",
    name: "Budaya",
    component: BudayaView,
    props: true,
  },
  {
    path: "/budaya/:id",
    name: "DetailBudaya",
    component: DetailBudayaView,
    props: true,
  },
  {
    path: "/ekonomi-kreatif",
    name: "Ekraf",
    component: Ekrafview,
    props: true,
  },
  {
    path: "/informasi",
    name: "Informasi",
    component: InformasiView,
    props: true,
  },
  {
    path: "/informasi/:id",
    name: "DetailInformasi",
    component: DetailInformasiView,
    props: true,
  },
  // {
  //   path: "/budaya/:id",
  //   name: "DetailBudaya",
  //   component: BudayaView,
  //   props: true,
  // },

  //Admin
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "/admin/dashboard",
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: AdminDashboard,
      },
      {
        path: "berita",
        name: "adminBerita",
        component: BeritaKategoriView,
      },
      {
        path: "destinasi",
        name: "adminDestinasi",
        component: KategoriDestinasiView,
      },
      {
        path: "budaya",
        name: "adminBudaya",
        component: AdminBudayaView,
      },
      {
        path: "event",
        name: "adminEvent",
        component: EventView,
      },
      {
        path: "media-galeri",
        name: "adminMediaGaleri",
        component: MediaGaleriView,
      },

      {
        path: "umkm",
        name: "adminUMKM",
        component: UMKMView,
      },
      {
        path: "struktur-anggota",
        name: "adminStrukturAnggota",
        component: StrukturAnggotaView,
      },
      {
        path: "pengumuman",
        name: "adminPengumuman",
        component: PengumumanView,
      },
      {
        path: "visi-misi",
        name: "adminVisiMisi",
        component: VisiMisiView,
      },
      {
        path: "struktur-organisasi",
        name: "adminStrukturOrganisasi",
        component: StrukturOrganisasiView,
      },
      {
        path: "akomodasi",
        name: "adminAkomodasi",
        component: AkomodasiView,
      },
      {
        path: "ppid",
        name: "adminKontenPpid",
        component: KontenPpidView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If there's a saved position (back/forward navigation), use it
    if (savedPosition) {
      return savedPosition;
    }
    // If navigating to a hash anchor
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    // For all other navigations, scroll to top
    return {
      top: 0,
      behavior: "smooth",
    };
  },
});

router.beforeEach(async (to, from, next) => {
  // Skip auth checks during login process to prevent interference
  if (window.isLoggingIn) {
    console.log("🛡️ Skipping router auth check - login in progress");
    next();
    return;
  }

  console.log(
    `🛡️ Router guard check for ${to.path}, isLoggingIn: ${window.isLoggingIn}`
  );

  // Import auth utilities dynamically to avoid circular imports
  const { canAccessAdmin, checkLoginStatus, clearSession } = await import(
    "../utils/auth.js"
  );

  if (to.path.startsWith("/admin") || to.meta.requiresAuth) {
    try {
      // Check if user can access admin pages (validates token and expiry)
      const hasAccess = await canAccessAdmin();

      if (!hasAccess) {
        // Clear any invalid session data
        clearSession(true, "router_guard_no_access");
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        next("/login");
        return;
      }

      // Additional check for token validity with backend
      const loginStatus = await checkLoginStatus();
      if (!loginStatus.isLoggedIn) {
        clearSession(true, "router_guard_invalid_login");
        alert("Sesi Anda tidak valid. Silakan login kembali.");
        next("/login");
        return;
      }

      next();
    } catch (error) {
      console.error("Error checking admin access:", error);
      clearSession(true, "router_guard_error");
      alert("Terjadi kesalahan autentikasi. Silakan login kembali.");
      next("/login");
    }
  } else {
    next();
  }
});

// Force scroll to top after each route navigation with enhanced timing
router.afterEach((to, from) => {
  // Enhanced scroll management for all route transitions
  setTimeout(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, 50); // Reduced timeout for faster response
});

export default router;
