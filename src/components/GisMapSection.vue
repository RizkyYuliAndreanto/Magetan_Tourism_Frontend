<template>
  <section class="gis-map-section">
    <h2 class="section-title">Temukan Lokasi Petualangan Kami</h2>
    <div id="map-container" class="map-container"></div>
    <div class="map-legend">
      <p><span class="legend-dot primary-blue-dot"></span> Destinasi Wisata</p>
      <p><span class="legend-dot secondary-blue-dot"></span> UMKM Lokal</p>
      <p><span class="legend-dot light-gray-dot"></span> Pusat Budaya</p>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import L from 'leaflet'; // Import Leaflet library
// Di proyek nyata, data lokasi ini harusnya diambil dari API
// Data lokasi contoh
const locations = [
  { lat: -7.641, lon: 111.334, name: "Telaga Sarangan", type: "wisata" },
  { lat: -7.63, lon: 111.35, name: "Kebun Jeruk Ndelik", type: "umkm" },
  { lat: -7.665, lon: 111.325, name: "Air Terjun Tirtosari", type: "wisata" },
  { lat: -7.64, lon: 111.34, name: "Pusat Kerajinan Bambu", type: "budaya" },
  { lat: -7.66, lon: 111.32, name: "Warung Pecel Bu Siti", type: "umkm" }
];
// ... (logika lainnya tetap sama) ...
onMounted(() => {
  const defaultLat = -7.65;
  const defaultLon = 111.33;
  const defaultZoom = 12;
  const map = L.map('map-container').setView([defaultLat, defaultLon], defaultZoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  locations.forEach(location => {
    let markerColor = '';
    let markerIconUrl = '';
    if (location.type === "wisata") {
      markerColor = 'var(--primary-blue)';
      markerIconUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${encodeURIComponent(markerColor)}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path><circle cx="12" cy="9" r="3"></circle></svg>`;
    } else if (location.type === "umkm") {
      markerColor = 'var(--secondary-blue)';
      markerIconUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${encodeURIComponent(markerColor)}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-bag"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`;
    } else if (location.type === "budaya") {
      markerColor = '#AAAAAA';
      markerIconUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${encodeURIComponent(markerColor)}" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
    }
    const customIcon = L.icon({
      iconUrl: markerIconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
    L.marker([location.lat, location.lon], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<b>${location.name}</b><br>${location.type.toUpperCase()}`)
      .on('mouseover', function (e) {
        this.openPopup();
      })
      .on('mouseout', function (e) {
        this.closePopup();
      });
  });
});
</script>

<style scoped>
/* Gaya CSS tetap sama */
.gis-map-section {
    padding: 80px 20px;
    background-color: var(--pure-white);
    text-align: center;
    color: var(--text-color-dark);
}
.section-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 60px;
    color: var(--text-color-dark);
}
.map-container {
    width: 100%;
    height: 500px;
    max-width: 1200px;
    margin: 0 auto 30px auto;
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    box-shadow: 0 5px 15px var(--box-shadow-light);
}
.map-legend {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 20px;
    flex-wrap: wrap;
    color: var(--text-color-dark);
}
.legend-dot {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-right: 8px;
    vertical-align: middle;
    border: 1px solid rgba(0, 0, 0, 0.2);
}
.primary-blue-dot { background-color: var(--primary-blue); }
.secondary-blue-dot { background-color: var(--secondary-blue); }
.light-gray-dot { background-color: #AAAAAA; }
</style>