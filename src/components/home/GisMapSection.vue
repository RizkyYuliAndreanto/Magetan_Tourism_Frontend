<template>
  <section class="map-section">
    <h2 class="section-title">Jelajahi Peta Wisata Magetan</h2>
    <div class="map-container">
      <div id="leaflet-map-container"></div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

const mapInstance = ref(null);
const destinasiData = ref([]);

const fetchDestinasiData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/destinasi');
    destinasiData.value = response.data; // Asumsi API mengembalikan array data destinasi
  } catch (error) {
    console.error('Gagal memuat data destinasi:', error);
  }
};

const initializeMap = () => {
  if (mapInstance.value) {
    mapInstance.value.remove();
  }

  const defaultLat = -7.6534;
  const defaultLng = 111.4116;
  const defaultZoom = 13;

  mapInstance.value = L.map('leaflet-map-container').setView([defaultLat, defaultLng], defaultZoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance.value);

  // Tambahkan marker untuk setiap data destinasi
  destinasiData.value.forEach(destinasi => {
    // Pastikan koordinat ada dan valid
    if (destinasi.koordinat_lokasi) {
      const [lat, lng] = destinasi.koordinat_lokasi.split(',').map(Number);
      
      // Ikon kustom untuk setiap destinasi (mengambil dari backend)
      const customIcon = L.icon({
        iconUrl: `http://localhost:5000${destinasi.gambar_utama}`, // Asumsi gambar_utama adalah path ikon
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
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
.map-section {
  padding: 60px 20px;
  background-color: var(--off-white);
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 60px;
  color: var(--text-color-dark);
}

.map-container {
  max-width: 1200px;
  height: 500px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
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