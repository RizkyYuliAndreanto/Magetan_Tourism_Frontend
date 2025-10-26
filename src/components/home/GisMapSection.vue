<template>
  <section class="map-section">
    <h2 class="section-title">Jelajahi Peta Wisata Magetan</h2>
    <div class="map-container">
      <div id="leaflet-map-container"></div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref, nextTick, watch } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

const mapInstance = ref(null);
const lokasiData = ref([]);

const fetchAllLokasiData = async () => {
  try {
    console.log("Fetching data from backend...");
    
    // Fetch data dari semua endpoint
    const [destinasiResponse, eventResponse, akomodasiResponse] =
      await Promise.all([
        axios.get("http://localhost:5000/api/destinasi"),
        axios.get("http://localhost:5000/api/event"),
        axios.get("http://localhost:5000/api/akomodasi"),
      ]);

    console.log("Raw API responses:", {
      destinasi: destinasiResponse.data,
      event: eventResponse.data,
      akomodasi: akomodasiResponse.data
    });

    // Gabungkan semua data dengan format yang konsisten
    const allLokasi = [];

    // Format data destinasi
    destinasiResponse.data.forEach((item) => {
      if (item.koordinat_lokasi) {
        allLokasi.push({
          id: item.id_destinasi,
          nama: item.nama_destinasi,
          koordinat: item.koordinat_lokasi,
          gambar: item.gambar_utama,
          type: "destinasi",
          route: `/destinasi/${item.id_destinasi}`,
        });
      }
    });

    // Format data event
    eventResponse.data.forEach((item) => {
      if (item.koordinat_lokasi) {
        allLokasi.push({
          id: item.id_event,
          nama: item.nama_event,
          koordinat: item.koordinat_lokasi,
          gambar: item.gambar_event,
          type: "event",
          route: `/event/${item.id_event}`,
        });
      }
    });

    // Format data akomodasi
    akomodasiResponse.data.forEach((item) => {
      if (item.koordinat_lokasi) {
        allLokasi.push({
          id: item.id_akomodasi,
          nama: item.nama_hotel,
          koordinat: item.koordinat_lokasi,
          gambar: item.gambar_utama_hotel,
          type: "akomodasi",
          route: `/ekonomi-kreatif`, // Untuk sekarang arahkan ke halaman umum akomodasi
        });
      }
    });

    lokasiData.value = allLokasi;
    console.log("Final processed lokasi data:", allLokasi);
  } catch (error) {
    console.error("Gagal memuat data lokasi:", error);
  }
};

const initializeMap = () => {
  if (mapInstance.value) {
    mapInstance.value.remove();
  }

  // Koordinat pusat Kabupaten Magetan, Jawa Timur
  const defaultLat = -7.638722;
  const defaultLng = 111.336998;
  const defaultZoom = 13;

  mapInstance.value = L.map("leaflet-map-container").setView(
    [defaultLat, defaultLng],
    defaultZoom
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapInstance.value);

  // Debug: Cek data lokasi yang akan diproses
  console.log("Total lokasi data:", lokasiData.value.length);
  console.log("All lokasi data:", lokasiData.value);

  // Tambahkan marker untuk setiap lokasi
  lokasiData.value.forEach((lokasi) => {
    if (lokasi.koordinat) {
      const [lat, lng] = lokasi.koordinat
        .split(",")
        .map((s) => Number(s.trim()));
      
      // Debug koordinat dan validasi
      console.log("Processing marker:", {
        nama: lokasi.nama,
        koordinat_raw: lokasi.koordinat,
        lat: lat,
        lng: lng,
        isValidLat: !isNaN(lat) && lat >= -90 && lat <= 90,
        isValidLng: !isNaN(lng) && lng >= -180 && lng <= 180
      });

      // Debug: Cek apakah koordinat berada dalam view map saat ini
      const mapBounds = mapInstance.value.getBounds();
      const isInView = mapBounds.contains([lat, lng]);
      console.log("Is marker in current map view?", isInView);
      console.log("Map bounds:", mapBounds);
      console.log("Marker position:", [lat, lng]);

      // Validasi koordinat sebelum membuat marker
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.error("Invalid coordinates for:", lokasi.nama, "lat:", lat, "lng:", lng);
        return; // Skip marker ini jika koordinat tidak valid
      }

      // Buat ikon berdasarkan type lokasi
      let iconColor = "#1e3a8a"; // Default royal blue
      let iconSymbol = "📍";

      switch (lokasi.type) {
        case "destinasi":
          iconColor = "#1e3a8a"; // Royal blue
          iconSymbol = "🏞️";
          break;
        case "event":
          iconColor = "#d4af37"; // Gold
          iconSymbol = "🎪";
          break;
        case "akomodasi":
          iconColor = "#059669"; // Green
          iconSymbol = "🏨";
          break;
      }

      // Buat custom icon dengan anchor yang stabil
      const customIcon = L.divIcon({
        className: "custom-map-marker",
        html: `
          <div class="marker-pin" style="
            position: relative;
            width: 40px;
            height: 50px;
          ">
            <div style="
              background-color: ${iconColor};
              width: 40px;
              height: 40px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              top: 0;
              left: 0;
            ">
              <span style="
                transform: rotate(45deg);
                font-size: 16px;
                filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.5));
              ">${iconSymbol}</span>
            </div>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 50], // ujung bawah pin (titik koordinat)
        popupAnchor: [0, -50],
      });

      // Buat popup content dengan gambar dan info
      const popupContent = `
        <div style="min-width: 200px; text-align: center;">
          <img src="http://localhost:5000${
            lokasi.gambar || "/uploads/default-image.jpg"
          }" 
               alt="${lokasi.nama}"
               style="
                 width: 180px; 
                 height: 120px; 
                 object-fit: cover; 
                 border-radius: 8px;
                 margin-bottom: 8px;
               "
               onerror="this.src='https://placehold.co/180x120/cccccc/ffffff?text=No+Image'"
          />
          <h4 style="margin: 8px 0; color: #1e3a8a; font-size: 14px;">${
            lokasi.nama
          }</h4>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">
            ${
              lokasi.type === "destinasi"
                ? "Destinasi Wisata"
                : lokasi.type === "event"
                ? "Event"
                : "Akomodasi"
            }
          </p>
          <button onclick="window.location.href='${lokasi.route}'" 
                  style="
                    background: linear-gradient(135deg, #1e3a8a, #3b82f6);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-top: 8px;
                    transition: all 0.3s ease;
                  "
                  onmouseover="this.style.transform='translateY(-2px)'"
                  onmouseout="this.style.transform='translateY(0)'"
          >
            Lihat Detail
          </button>
        </div>
      `;

      // Tambahkan marker ke peta dengan popup dan auto zoom saat diklik
      try {
        const marker = L.marker([lat, lng], { icon: customIcon })
          .addTo(mapInstance.value)
          .bindPopup(popupContent, {
            maxWidth: 220,
            className: "custom-popup",
          });

        // Event listener untuk auto zoom saat marker diklik
        marker.on('click', function(e) {
          console.log("Marker clicked:", lokasi.nama, "zooming to:", [lat, lng]);
          // Zoom ke marker dengan animasi smooth
          mapInstance.value.setView([lat, lng], 16, {
            animate: true,
            duration: 0.8, // durasi animasi dalam detik
            easeLinearity: 0.3
          });
        });

        // Event listener untuk auto zoom saat popup dibuka
        marker.on('popupopen', function(e) {
          console.log("Popup opened for:", lokasi.nama, "adjusting view");
          // Zoom lebih dekat saat popup terbuka
          mapInstance.value.setView([lat, lng], 17, {
            animate: true,
            duration: 0.6,
            easeLinearity: 0.25
          });
        });
        
        console.log("Marker berhasil dibuat untuk:", lokasi.nama, "at position:", [lat, lng]);
        
        // Debug: Auto fit bounds ke marker jika hanya 1 marker
        if (lokasiData.value.length === 1) {
          console.log("Auto fitting map to single marker position");
          mapInstance.value.setView([lat, lng], 14);
        }
      } catch (error) {
        console.error("Error creating marker for:", lokasi.nama, error);
      }
    } else {
      console.log("Koordinat tidak tersedia untuk:", lokasi.nama);
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
  await fetchAllLokasiData();
});

// Watcher agar marker selalu update saat data sudah siap
watch(lokasiData, () => {
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

/* Custom popup styling */
:deep(.custom-popup .leaflet-popup-content-wrapper) {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(30, 58, 138, 0.2);
  border: 2px solid rgba(212, 175, 55, 0.3);
}

:deep(.custom-popup .leaflet-popup-tip) {
  background: white;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-top: none;
  border-right: none;
}

:deep(.custom-popup .leaflet-popup-content) {
  margin: 12px;
  font-family: "Poppins", sans-serif;
}

:deep(.custom-popup .leaflet-popup-close-button) {
  color: var(--royal-blue);
  font-size: 18px;
  font-weight: bold;
  padding: 8px;
}

:deep(.custom-popup .leaflet-popup-close-button:hover) {
  color: var(--gold-accent);
}

/* Custom marker styling - stable positioning */
:deep(.custom-map-marker) {
  /* Disable animation to prevent position shifts during zoom */
  pointer-events: auto;
}

/* Ensure marker positioning is stable */
:deep(.custom-map-marker .marker-pin) {
  transform-origin: center bottom;
}

@keyframes markerBounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@media screen and (max-width: 768px) {
  .map-container {
    height: 350px;
  }

  .section-title {
    font-size: 2.2rem;
    margin-bottom: 40px;
  }
}
</style>
