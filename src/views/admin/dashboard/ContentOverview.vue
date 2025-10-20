<template>
  <div class="content-overview">
    <div class="overview-header">
      <h3 class="overview-title">
        <i class="fas fa-chart-bar"></i>
        Ringkasan Konten Website
      </h3>
      <p class="overview-subtitle">
        Pantau semua konten dan aktivitas yang ada di website Magetan Tourism
      </p>
    </div>

    <!-- Statistics Grid -->
    <div v-if="loading" class="loading-state">
      <div class="loading-card" v-for="n in 12" :key="n">
        <div class="loading-icon"></div>
        <div class="loading-content">
          <div class="loading-title"></div>
          <div class="loading-value"></div>
          <div class="loading-subtitle"></div>
        </div>
      </div>
    </div>
    <div v-else class="stats-grid">
      <DashboardCard
        title="Destinasi Wisata"
        :value="stats.destinasi"
        icon="map-pin"
        variant="primary"
        :subtitle="`${stats.destinasiAktif} aktif dari ${stats.destinasi} total`"
        :trend="getDestinationTrend()"
        :trend-direction="
          getTrendDirection(stats.destinasiBulanIni, stats.destinasiBulanLalu)
        " />

      <DashboardCard
        title="Berita & Artikel"
        :value="stats.berita"
        icon="file-text"
        variant="info"
        :subtitle="`${stats.beritaBulanIni} berita bulan ini`"
        :trend="getNewsTrend()"
        :trend-direction="
          getTrendDirection(stats.beritaBulanIni, stats.beritaBulanLalu)
        " />

      <DashboardCard
        title="Event & Kegiatan"
        :value="stats.event"
        icon="calendar"
        variant="warning"
        :subtitle="`${stats.eventAktif} event aktif`"
        :trend="getEventTrend()"
        :trend-direction="
          getTrendDirection(stats.eventBulanIni, stats.eventBulanLalu)
        " />

      <DashboardCard
        title="Akomodasi"
        :value="stats.akomodasi"
        icon="home"
        variant="success"
        :subtitle="`Rating rata-rata: ${stats.ratingAkomodasi}`"
        :trend="getAccommodationTrend()"
        :trend-direction="
          getTrendDirection(stats.akomodasiBulanIni, stats.akomodasiBulanLalu)
        " />

      <DashboardCard
        title="UMKM & Produk"
        :value="stats.umkm"
        icon="shopping-bag"
        variant="warning"
        :subtitle="`${stats.umkmVerified} terverifikasi`"
        :trend="getUmkmTrend()"
        :trend-direction="
          getTrendDirection(stats.umkmBulanIni, stats.umkmBulanLalu)
        " />

      <DashboardCard
        title="Media Galeri"
        :value="stats.mediaGaleri"
        icon="image"
        variant="info"
        :subtitle="`${stats.mediaGambar} gambar, ${stats.mediaVideo} video`"
        :trend="getMediaTrend()"
        :trend-direction="
          getTrendDirection(
            stats.mediaGaleriBulanIni,
            stats.mediaGaleriBulanLalu
          )
        " />

      <DashboardCard
        title="Budaya Daerah"
        :value="stats.budaya"
        icon="book-open"
        variant="success"
        :subtitle="`${stats.budayaAktif} budaya aktif`"
        :trend="getCultureTrend()"
        :trend-direction="
          getTrendDirection(stats.budayaBulanIni, stats.budayaBulanLalu)
        " />

      <DashboardCard
        title="Pengumuman"
        :value="stats.pengumuman"
        icon="bell"
        variant="warning"
        :subtitle="`${stats.pengumumanAktif} pengumuman aktif`"
        :trend="getAnnouncementTrend()"
        :trend-direction="
          getTrendDirection(stats.pengumumanBulanIni, stats.pengumumanBulanLalu)
        " />

      <DashboardCard
        title="Konten PPID"
        :value="stats.ppid"
        icon="info"
        variant="info"
        :subtitle="`${stats.ppidAktif} konten aktif`"
        :trend="getPpidTrend()"
        :trend-direction="
          getTrendDirection(stats.ppidBulanIni, stats.ppidBulanLalu)
        " />

      <DashboardCard
        title="Struktur Anggota"
        :value="stats.strukturAnggota"
        icon="users"
        variant="success"
        :subtitle="`${stats.strukturAnggotaAktif} anggota aktif`"
        :trend="getStrukturAnggotaTrend()"
        :trend-direction="
          getTrendDirection(
            stats.strukturAnggotaBulanIni,
            stats.strukturAnggotaBulanLalu
          )
        " />

      <DashboardCard
        title="Struktur Organisasi"
        :value="stats.strukturOrganisasi ? '1' : '0'"
        icon="building"
        variant="info"
        :subtitle="stats.strukturOrganisasi ? 'Sudah diatur' : 'Belum diatur'"
        :trend="getStrukturOrganisasiTrend()"
        trend-direction="neutral" />

      <DashboardCard
        title="Visi & Misi"
        :value="stats.visiMisi ? '1' : '0'"
        icon="info"
        variant="warning"
        :subtitle="stats.visiMisi ? 'Sudah diatur' : 'Belum diatur'"
        :trend="getVisiMisiTrend()"
        trend-direction="neutral" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import DashboardCard from "./DashboardCard.vue";

const stats = ref({
  destinasi: 0,
  destinasiAktif: 0,
  destinasiBulanIni: 0,
  destinasiBulanLalu: 0,
  berita: 0,
  beritaBulanIni: 0,
  beritaBulanLalu: 0,
  event: 0,
  eventAktif: 0,
  eventBulanIni: 0,
  eventBulanLalu: 0,
  akomodasi: 0,
  ratingAkomodasi: "0.0",
  akomodasiBulanIni: 0,
  akomodasiBulanLalu: 0,
  umkm: 0,
  umkmVerified: 0,
  umkmBulanIni: 0,
  umkmBulanLalu: 0,
  mediaGaleri: 0,
  mediaGambar: 0,
  mediaVideo: 0,
  mediaGaleriBulanIni: 0,
  mediaGaleriBulanLalu: 0,
  budaya: 0,
  budayaAktif: 0,
  budayaBulanIni: 0,
  budayaBulanLalu: 0,
  pengumuman: 0,
  pengumumanAktif: 0,
  pengumumanBulanIni: 0,
  pengumumanBulanLalu: 0,
  ppid: 0,
  ppidAktif: 0,
  ppidBulanIni: 0,
  ppidBulanLalu: 0,
  strukturAnggota: 0,
  strukturAnggotaAktif: 0,
  strukturAnggotaBulanIni: 0,
  strukturAnggotaBulanLalu: 0,
  strukturOrganisasi: null,
  visiMisi: null,
});

const loading = ref(true);

// Trend calculation functions
const getTrendDirection = (current, previous) => {
  if (loading.value || !stats.value) return "neutral";
  const curr = Number(current) || 0;
  const prev = Number(previous) || 0;
  if (curr > prev) return "up";
  if (curr < prev) return "down";
  return "neutral";
};

const getDestinationTrend = () => {
  if (loading.value || !stats.value) return "Memuat...";
  const diff =
    (stats.value.destinasiBulanIni || 0) -
    (stats.value.destinasiBulanLalu || 0);
  if (diff > 0) return `+${diff} bulan ini`;
  if (diff < 0) return `${diff} bulan ini`;
  return "Tidak ada perubahan";
};

const getNewsTrend = () => {
  if (loading.value || !stats.value) return "Memuat...";
  const diff =
    (stats.value.beritaBulanIni || 0) - (stats.value.beritaBulanLalu || 0);
  if (diff > 0) return `+${diff} bulan ini`;
  if (diff < 0) return `${diff} bulan ini`;
  return "Tidak ada perubahan";
};

const getEventTrend = () => {
  if (loading.value || !stats.value) return "Memuat...";
  const diff =
    (stats.value.eventBulanIni || 0) - (stats.value.eventBulanLalu || 0);
  if (diff > 0) return `+${diff} bulan ini`;
  if (diff < 0) return `${diff} bulan ini`;
  return "Tidak ada perubahan";
};

const getAccommodationTrend = () => {
  if (loading.value || !stats.value) return "Memuat...";
  const diff =
    (stats.value.akomodasiBulanIni || 0) -
    (stats.value.akomodasiBulanLalu || 0);
  if (diff > 0) return `+${diff} bulan ini`;
  if (diff < 0) return `${diff} bulan ini`;
  return "Tidak ada perubahan";
};

const getUmkmTrend = () => {
  if (loading.value || !stats.value) return "Memuat...";
  const diff =
    (stats.value.umkmBulanIni || 0) - (stats.value.umkmBulanLalu || 0);
  if (diff > 0) return `+${diff} bulan ini`;
  if (diff < 0) return `${diff} bulan ini`;
  return "Tidak ada perubahan";
};

const getMediaTrend = () => {
  if (loading.value || !stats.value) return "Memuat...";
  const diff =
    (stats.value.mediaGaleriBulanIni || 0) -
    (stats.value.mediaGaleriBulanLalu || 0);
  if (diff > 0) return `+${diff} bulan ini`;
  if (diff < 0) return `${diff} bulan ini`;
  return "Tidak ada perubahan";
};

const getCultureTrend = () => {
  if (loading.value || !stats.value) return "Memuat...";
  const diff =
    (stats.value.budayaBulanIni || 0) - (stats.value.budayaBulanLalu || 0);
  if (diff > 0) return `+${diff} bulan ini`;
  if (diff < 0) return `${diff} bulan ini`;
  return "Tidak ada perubahan";
};

const getAnnouncementTrend = () => {
  if (loading.value || !stats.value) return "Memuat...";
  const diff =
    (stats.value.pengumumanBulanIni || 0) -
    (stats.value.pengumumanBulanLalu || 0);
  if (diff > 0) return `+${diff} bulan ini`;
  if (diff < 0) return `${diff} bulan ini`;
  return "Tidak ada perubahan";
};

const getPpidTrend = () => {
  if (loading.value || !stats.value) return "Memuat...";
  const diff =
    (stats.value.ppidBulanIni || 0) - (stats.value.ppidBulanLalu || 0);
  if (diff > 0) return `+${diff} bulan ini`;
  if (diff < 0) return `${diff} bulan ini`;
  return "Tidak ada perubahan";
};

const getStrukturAnggotaTrend = () => {
  if (loading.value || !stats.value) return "Memuat...";
  const diff =
    (stats.value.strukturAnggotaBulanIni || 0) -
    (stats.value.strukturAnggotaBulanLalu || 0);
  if (diff > 0) return `+${diff} bulan ini`;
  if (diff < 0) return `${diff} bulan ini`;
  return "Tidak ada perubahan";
};

const getStrukturOrganisasiTrend = () => {
  if (loading.value || !stats.value) return "Memuat...";
  return stats.value.strukturOrganisasi
    ? "Sudah dikonfigurasi"
    : "Perlu dikonfigurasi";
};

const getVisiMisiTrend = () => {
  if (loading.value || !stats.value) return "Memuat...";
  return stats.value.visiMisi ? "Sudah dikonfigurasi" : "Perlu dikonfigurasi";
};

// Fetch all statistics
const fetchAllStats = async () => {
  loading.value = true;
  try {
    const [
      destinasiRes,
      beritaRes,
      eventRes,
      akomodasiRes,
      umkmRes,
      mediaRes,
      budayaRes,
      pengumumanRes,
      ppidRes,
      strukturAnggotaRes,
      strukturOrganisasiRes,
      visiMisiRes,
    ] = await Promise.allSettled([
      axios.get("http://localhost:5000/api/destinasi"),
      axios.get("http://localhost:5000/api/berita"),
      axios.get("http://localhost:5000/api/event"),
      axios.get("http://localhost:5000/api/akomodasi"),
      axios.get("http://localhost:5000/api/umkm"),
      axios.get("http://localhost:5000/api/media-galeri"),
      axios.get("http://localhost:5000/api/budaya"),
      axios.get("http://localhost:5000/api/pengumuman"),
      axios.get("http://localhost:5000/api/konten-ppid"),
      axios.get("http://localhost:5000/api/struktur-anggota"),
      axios.get("http://localhost:5000/api/struktur-organisasi"),
      axios.get("http://localhost:5000/api/visi-misi"),
    ]);

    // Process destinasi stats
    if (destinasiRes.status === "fulfilled") {
      const destinasiData = destinasiRes.value.data;
      stats.value.destinasi = destinasiData.length;
      stats.value.destinasiAktif = destinasiData.filter(
        (d) => d.status === "aktif" || !d.status
      ).length;

      const bulanIni = new Date();
      bulanIni.setDate(1);
      bulanIni.setHours(0, 0, 0, 0);

      const bulanLalu = new Date(bulanIni);
      bulanLalu.setMonth(bulanLalu.getMonth() - 1);

      stats.value.destinasiBulanIni = destinasiData.filter(
        (d) => new Date(d.created_at) >= bulanIni
      ).length;

      stats.value.destinasiBulanLalu = destinasiData.filter((d) => {
        const created = new Date(d.created_at);
        return created >= bulanLalu && created < bulanIni;
      }).length;
    }

    // Process berita stats
    if (beritaRes.status === "fulfilled") {
      const beritaData = beritaRes.value.data;
      stats.value.berita = beritaData.length;

      const bulanIni = new Date();
      bulanIni.setDate(1);
      bulanIni.setHours(0, 0, 0, 0);

      const bulanLalu = new Date(bulanIni);
      bulanLalu.setMonth(bulanLalu.getMonth() - 1);

      stats.value.beritaBulanIni = beritaData.filter(
        (b) => new Date(b.created_at) >= bulanIni
      ).length;

      stats.value.beritaBulanLalu = beritaData.filter((b) => {
        const created = new Date(b.created_at);
        return created >= bulanLalu && created < bulanIni;
      }).length;
    }

    // Process other stats similarly...
    if (eventRes.status === "fulfilled") {
      const eventData = eventRes.value.data;
      stats.value.event = eventData.length;
      stats.value.eventAktif = eventData.filter((e) => {
        const endDate = new Date(e.tanggal_selesai);
        return endDate >= new Date();
      }).length;
    }

    if (akomodasiRes.status === "fulfilled") {
      const akomodasiData = akomodasiRes.value.data;
      stats.value.akomodasi = akomodasiData.length;
      const totalRating = akomodasiData.reduce(
        (sum, a) => sum + (a.rating || 4.5),
        0
      );
      stats.value.ratingAkomodasi =
        akomodasiData.length > 0
          ? (totalRating / akomodasiData.length).toFixed(1)
          : "0.0";
    }

    if (umkmRes.status === "fulfilled") {
      const umkmData = umkmRes.value.data;
      stats.value.umkm = umkmData.length;
      stats.value.umkmVerified = umkmData.filter(
        (u) => u.status_verifikasi === "terverifikasi"
      ).length;
    }

    if (mediaRes.status === "fulfilled") {
      const mediaData = mediaRes.value.data;
      stats.value.mediaGaleri = mediaData.length;
      stats.value.mediaGambar = mediaData.filter(
        (m) => m.jenis_file === "gambar"
      ).length;
      stats.value.mediaVideo = mediaData.filter(
        (m) => m.jenis_file === "video"
      ).length;
    }

    if (budayaRes.status === "fulfilled") {
      const budayaData = budayaRes.value.data;
      stats.value.budaya = budayaData.length;
      stats.value.budayaAktif = budayaData.filter(
        (b) => b.status === "aktif" || !b.status
      ).length;
    }

    if (pengumumanRes.status === "fulfilled") {
      const pengumumanData = pengumumanRes.value.data;
      stats.value.pengumuman = pengumumanData.length;
      stats.value.pengumumanAktif = pengumumanData.filter(
        (p) => p.status === "aktif" || !p.status
      ).length;
    }

    // Process PPID stats
    if (ppidRes.status === "fulfilled") {
      const ppidData = ppidRes.value.data;
      stats.value.ppid = ppidData.length;
      stats.value.ppidAktif = ppidData.filter(
        (p) => p.status === "aktif" || !p.status
      ).length;

      const bulanIni = new Date();
      bulanIni.setDate(1);
      bulanIni.setHours(0, 0, 0, 0);

      const bulanLalu = new Date(bulanIni);
      bulanLalu.setMonth(bulanLalu.getMonth() - 1);

      stats.value.ppidBulanIni = ppidData.filter(
        (p) => new Date(p.created_at) >= bulanIni
      ).length;

      stats.value.ppidBulanLalu = ppidData.filter((p) => {
        const created = new Date(p.created_at);
        return created >= bulanLalu && created < bulanIni;
      }).length;
    }

    // Process Struktur Anggota stats
    if (strukturAnggotaRes.status === "fulfilled") {
      const strukturAnggotaData = strukturAnggotaRes.value.data;
      stats.value.strukturAnggota = strukturAnggotaData.length;
      stats.value.strukturAnggotaAktif = strukturAnggotaData.filter(
        (s) => s.status === "aktif" || !s.status
      ).length;

      const bulanIni = new Date();
      bulanIni.setDate(1);
      bulanIni.setHours(0, 0, 0, 0);

      const bulanLalu = new Date(bulanIni);
      bulanLalu.setMonth(bulanLalu.getMonth() - 1);

      stats.value.strukturAnggotaBulanIni = strukturAnggotaData.filter(
        (s) => new Date(s.created_at) >= bulanIni
      ).length;

      stats.value.strukturAnggotaBulanLalu = strukturAnggotaData.filter((s) => {
        const created = new Date(s.created_at);
        return created >= bulanLalu && created < bulanIni;
      }).length;
    }

    // Process Struktur Organisasi stats
    if (strukturOrganisasiRes.status === "fulfilled") {
      stats.value.strukturOrganisasi = strukturOrganisasiRes.value.data;
    }

    // Process Visi Misi stats
    if (visiMisiRes.status === "fulfilled") {
      stats.value.visiMisi = visiMisiRes.value.data;
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // Wait for next tick to ensure DOM is fully rendered
  await new Promise((resolve) => setTimeout(resolve, 100));
  fetchAllStats();
});
</script>

<style scoped>
.content-overview {
  margin-bottom: 2rem;
}

.overview-header {
  margin-bottom: 2rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1.5rem;
}

.overview-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.overview-title i {
  color: #3b82f6;
  font-size: 1.25rem;
}

.overview-subtitle {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  font-weight: 400;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Responsive Grid Layout */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* Loading State */
.loading-state {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.loading-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 1.75rem;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  min-height: 100px;
}

.loading-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.8s infinite ease-in-out;
  flex-shrink: 0;
}

.loading-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.loading-title,
.loading-value,
.loading-subtitle {
  border-radius: 4px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.8s infinite ease-in-out;
}

.loading-title {
  height: 14px;
  width: 140px;
  margin-bottom: 10px;
}

.loading-value {
  height: 28px;
  width: 90px;
  margin-bottom: 8px;
}

.loading-subtitle {
  height: 12px;
  width: 180px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .stats-grid,
  .loading-state {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .overview-header {
    text-align: center;
    padding-bottom: 1.25rem;
  }

  .overview-title {
    justify-content: center;
    font-size: 1.375rem;
  }

  .stats-grid,
  .loading-state {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .overview-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  .overview-title {
    font-size: 1.25rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .overview-subtitle {
    font-size: 0.875rem;
  }
}
</style>
