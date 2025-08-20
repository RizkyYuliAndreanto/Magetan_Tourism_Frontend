import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import EventView from "../views/admin/event/EventView.vue";
import MediaGaleriView from "../views/admin/MediaGaleriView.vue";
import BeritaKategoriView from "../views/admin/berita/BeritaKategoriView.vue";
import KategoriDestinasiView from "../views/admin/destinasi/KategoriDestinasiView.vue";
import SejarahView from "../views/admin/sejarah/SejarahView.vue";
import UMKMView from "../views/admin/UMKM/UMKMView.vue";
import StrukturAnggotaView from "../views/admin/struktur-anggota/StrukturAnggotaView.vue";
import PengumumanView from "../views/admin/penggumuman/PengumumanView.vue";

//user
import PengumumanUserView from "../views/PengumumanUserView.vue";


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
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  
  //Admin
  {
    path: "/dashboard",
    name: "dashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true }, // Tambahkan ini untuk perlindungan rute
  },
  {
    path: "/admin/berita",
    name: "adminBerita",
    component: BeritaKategoriView,
    meta: { requiresAuth: true }, // Tambahkan ini untuk perlindungan rute
  },
  {
    path: "/admin/destinasi",
    name: "adminDestinasi",
    component: KategoriDestinasiView,
    meta: { requiresAuth: true }, // Tambahkan ini untuk perlindungan rute
  },
  {
    path: "/admin/event",
    name: "adminEvent",
    component: EventView,
    meta: { requiresAuth: true }, // Tambahkan ini untuk perlindungan rute
  },
  {
    path: "/admin/media-galeri",
    name: "adminMediaGaleri",
    component: MediaGaleriView,
    meta: { requiresAuth: true }, // Tambahkan ini untuk perlindungan rute
  },
  {
    path: "/admin/sejarah",
    name: "adminMediaGaleri",
    component: SejarahView,
    meta: { requiresAuth: true }, // Tambahkan ini untuk perlindungan rute
  },
  {
    path: "/admin/UMKM",
    name: "adminMediaGaleri",
    component: UMKMView,
    meta: { requiresAuth: true }, // Tambahkan ini untuk perlindungan rute
  },
  {
    path: "/admin/struktur-anggota",
    name: "adminMediaGaleri",
    component: StrukturAnggotaView,
    meta: { requiresAuth: true }, // Tambahkan ini untuk perlindungan rute
  },
  {
    path: "/admin/pengumuman",
    name: "adminMediaGaleri",
    component: PengumumanView,
    meta: { requiresAuth: true }, // Tambahkan ini untuk perlindungan rute
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // Periksa jika rute membutuhkan autentikasi
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Anda harus login untuk mengakses halaman ini.");
      next("/login");
    } else {
      next(); // Lanjutkan ke rute yang dituju jika sudah login
    }
  } else {
    next(); // Lanjutkan ke rute yang dituju jika tidak membutuhkan autentikasi
  }
});

export default router;
