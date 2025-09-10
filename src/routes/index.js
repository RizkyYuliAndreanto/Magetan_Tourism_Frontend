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
import SejarahView from "../views/admin/sejarah/SejarahView.vue";
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
    path: "/destinasi",
    name: "register",
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
        path: "sejarah",
        name: "adminSejarah",
        component: SejarahView,
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
});

router.beforeEach((to, from, next) => {
  if (to.path.startsWith("/admin")) {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Anda harus login untuk mengakses halaman admin.");
      next("/"); // Redirect ke home jika belum login
      return;
    }
  }
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
