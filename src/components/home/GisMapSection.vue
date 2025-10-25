<template>
  <section class="map-section">
    <h2 class="section-title">Jelajahi Peta Wisata Magetan</h2>
    <div class="map-container">
      <div id="leaflet-map-container"></div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const mapInstance = ref(null);
const destinasiData = ref([]);

const fetchDestinasiData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/destinasi");
    destinasiData.value = response.data; // Asumsi API mengembalikan array data destinasi
  } catch (error) {
    console.error("Gagal memuat data destinasi:", error);
  }
};

const initializeMap = () => {
  if (mapInstance.value) {
    mapInstance.value.remove();
  }

  const defaultLat = -7.6534;
  const defaultLng = 111.4116;
  const defaultZoom = 13;

  mapInstance.value = L.map("leaflet-map-container").setView(
    [defaultLat, defaultLng],
    defaultZoom
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapInstance.value);

  // Tambahkan marker untuk setiap data destinasi
  destinasiData.value.forEach((destinasi) => {
    // Pastikan koordinat ada dan valid
    if (destinasi.koordinat_lokasi) {
      const [lat, lng] = destinasi.koordinat_lokasi.split(",").map(Number);

      // Ikon kustom untuk setiap destinasi (mengambil dari backend)
      const customIcon = L.icon({
        iconUrl: `http://localhost:5000${destinasi.gambar_utama}`, // Asumsi gambar_utama adalah path ikon
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      // Tambahkan marker ke peta
      L.marker([lat, lng], { icon: customIcon })
        .addTo(mapInstance.value)
        .bindPopup(`<b>${destinasi.nama_destinasi}</b><br>${destinasi.alamat}`);
    }
  });
};

const destroyMap = () => {
  if (mapInstance.value) {
    mapInstance.value.remove();
    mapInstance.value = null;
  }
};

onMounted(async () => {
  await fetchDestinasiData();
  nextTick(() => {
    initializeMap();
  });
});

onUnmounted(() => {
  destroyMap();
});
</script>

<style scoped>
/* ===== CONSISTENT COLOR VARIABLES ===== */
:root {
  --royal-blue: #1e3a8a;
  --gold-accent: #d4af37;
  --pearl-white: #ffffff;
  --ivory-white: #f8f9fa;
  --premium-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
}

.map-section {
  padding: 80px 32px;
  background: linear-gradient(
    135deg,
    #f8fafc 0%,
    #e0f2fe 25%,
    #bae6fd 50%,
    #7dd3fc 75%,
    #38bdf8 100%
  );
  text-align: center;
  position: relative;
  overflow: hidden;
}

.section-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 60px;
  color: var(--royal-blue);
  text-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
  font-family: "Playfair Display", serif;
  letter-spacing: -1px;
}

.map-container {
  max-width: 1400px;
  height: 500px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--premium-shadow);
  border: 2px solid rgba(212, 175, 55, 0.2);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.map-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px rgba(30, 58, 138, 0.25);
  border-color: var(--gold-accent);
}

#leaflet-map-container {
  height: 100%;
  width: 100%;
}

@media screen and (max-width: 768px) {
  .map-container {
    height: 350px;
  }
}
</style>
