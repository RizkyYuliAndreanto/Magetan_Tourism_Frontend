// src/routes/index.js
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
import VisiMisiView from "../views/admin/visi-misi/VisiMisiView.vue";
import StrukturOrganisasiView from "../views/admin/struktur-organisasi/StrukturOrganisasiView.vue";
import AkomodasiView from "../views/admin/akomodasi/AkomodasiView.vue";
import KontenPpidView from "../views/admin/ppid/KontenPpidView.vue";

//user
import PengumumanUserView from "../views/PengumumanUserView.vue";
import EventUserView from '../views/EventUserView.vue';
import DetailEventUserView from '../views/DetailEventUserView.vue';
import ProfilDinasView from '../views/ProfilDinasView.vue';
import DetailProfilDinasView from '../views/DetailProfilDinasView.vue';
import VisiMisiUserView from '../views/VisiMisiUserView.vue';
import StrukturOrganisasiUserView from '../views/StrukturOrganisasiUserView.vue';
import StrukturAnggotaUserView from '../views/StrukturAnggotaUserView.vue';
import PpidView from '../views/PpidView.vue';

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
    path: '/event',
    name: 'EventViewUser', // Nama rute tidak harus diubah
    component: EventUserView, // Ubah nama komponen di sini
  },
    {
    path: '/event/:id', // Rute dinamis untuk detail event
    name: 'EventDetail',
    component: DetailEventUserView,
    props: true, // Mengaktifkan props untuk mengambil ID dari URL
  },
  {
    path: '/profil-dinas',
    name: 'ProfilDinas',
    component: ProfilDinasView
  },
  {
    path: '/profil-dinas/detail',
    name: 'DetailProfilDinas',
    component: DetailProfilDinasView
  },
  {
    path: '/profil-dinas/visimisi',
    name: 'VisiMisi',
    component: VisiMisiUserView
  },
  {
    path: '/profil-dinas/struktur-organisasi',
    name: 'StrukturOrganisasi',
    component: StrukturOrganisasiUserView
  },
  {
    path: '/profil-dinas/struktur-anggota',
    name: 'StrukturAnggota',
    component: StrukturAnggotaUserView
  },
  {
    path: '/profil-dinas/ppid',
    name: 'PPID',
    component: PpidView
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
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/berita",
    name: "adminBerita",
    component: BeritaKategoriView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/destinasi",
    name: "adminDestinasi",
    component: KategoriDestinasiView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/event",
    name: "adminEvent",
    component: EventView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/media-galeri",
    name: "adminMediaGaleri",
    component: MediaGaleriView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/sejarah",
    name: "adminSejarah", // <-- KOREKSI: Mengganti nama rute
    component: SejarahView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/umkm",
    name: "adminUMKM", // <-- KOREKSI: Mengganti nama rute
    component: UMKMView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/struktur-anggota",
    name: "adminStrukturAnggota", // <-- KOREKSI: Mengganti nama rute
    component: StrukturAnggotaView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/pengumuman",
    name: "adminPengumuman", // <-- KOREKSI: Mengganti nama rute
    component: PengumumanView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/visi-misi",
    name: "adminVisiMisi", // <-- KOREKSI: Mengganti nama rute
    component: VisiMisiView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/struktur-organisasi",
    name: "adminStrukturOrganisasi", // <-- KOREKSI: Mengganti nama rute
    component: StrukturOrganisasiView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/akomodasi",
    name: "adminAkomodasi", // <-- KOREKSI: Mengganti nama rute
    component: AkomodasiView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/ppid",
    name: "adminKontenPpid", // <-- KOREKSI: Mengganti nama rute
    component: KontenPpidView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Anda harus login untuk mengakses halaman ini.");
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
