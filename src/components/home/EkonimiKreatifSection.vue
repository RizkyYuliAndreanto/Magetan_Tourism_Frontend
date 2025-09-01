<template>
  <section class="ekonomi-kreatif-section">
    <div class="ekonomi-kreatif-container">
      <div class="cards-wrapper">
        <template v-if="loading">
          <div class="no-data-message">Memuat data...</div>
        </template>
        <template v-else-if="error">
          <div class="no-data-message" style="color: #e53e3e">{{ error }}</div>
        </template>
        <template v-else>
          <div
            v-for="kategori in kategoriList"
            :key="kategori.id_kategori_umkm"
            class="kategori-card">
            <div class="card-image-wrapper">
              <img
                :src="getImageUrl(kategori.gambar_sampul)"
                :alt="kategori.nama_kategori"
                class="kategori-logo" />
            </div>
            <div class="card-label">
              <p class="kategori-nama">{{ kategori.nama_kategori }}</p>
            </div>
          </div>
        </template>
      </div>
      <div class="title-wrapper">
        <h2 class="section-title">Ekonomi Kreatif</h2>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "EkonimiKreatifSection",
  data() {
    return {
      kategoriList: [],
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchKategori() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/kategori-umkm/"
        );
        this.kategoriList = response.data;
      } catch (err) {
        this.error = "Gagal memuat data kategori UMKM.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    getImageUrl(gambar) {
      if (!gambar) return "https://via.placeholder.com/400x300?text=No+Image";
      if (gambar.startsWith("http")) return gambar;
      // Koreksi path jika mengandung kategori-sampul
      let fixedPath = gambar.replace(
        "/uploads/umkm/kategori-sampul/",
        "/uploads/umkm/gambar-sampul/"
      );
      return `http://localhost:5000${fixedPath}`;
    },
  },
  created() {
    this.fetchKategori();
  },
};
</script>
text-xl
<style scoped>
.ekonomi-kreatif-section {
  padding: 40px 20px;
  background-color: #e0e0e0;
  font-family: Arial, sans-serif;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ekonomi-kreatif-container {
  display: flex;
  align-items: flex-end;
  max-width: 1200px;
  width: 100%;
  justify-content: space-between;
}

.cards-wrapper {
  display: flex;
  gap: 32px;
  flex-grow: 1;
  justify-content: flex-start;
  align-items: flex-end;
}

.kategori-card {
  background-color: #f3f3f3;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;
  cursor: pointer;
  text-decoration: none;
  transition: box-shadow 0.2s, transform 0.2s;
}

.kategori-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13);
  transform: translateY(-4px) scale(1.03);
}

.card-image-wrapper {
  background-color: #dcdcdc;
  border-radius: 12px;
  width: 140px;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  overflow: hidden;
}

.kategori-logo {
  width: 80%;
  height: 80%;
  object-fit: contain;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-label {
  width: 100%;
  background-color: #dcdcdc;
  border-radius: 8px;
  text-align: center;
  padding: 8px;
}

.kategori-nama {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.title-wrapper {
  margin-left: 48px;
  display: flex;
  align-items: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #222;
  line-height: 1.1;
  text-align: left;
  margin: 0;
}

.no-data-message {
  text-align: center;
  width: 100%;
  color: #888;
  font-size: 1.2rem;
  margin-top: 20px;
}

@media (max-width: 992px) {
  .ekonomi-kreatif-container {
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
  }
  .cards-wrapper {
    justify-content: center;
    margin-top: 32px;
    gap: 18px;
  }
  .title-wrapper {
    margin-left: 0;
    text-align: center;
    justify-content: center;
  }
  .section-title {
    font-size: 2rem;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .cards-wrapper {
    flex-wrap: wrap;
    justify-content: center;
  }
  .kategori-card {
    min-width: 140px;
    padding: 12px;
  }
  .kategori-nama {
    font-size: 0.9rem;
  }
  .section-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .ekonomi-kreatif-section {
    padding: 20px 10px;
  }
  .kategori-card {
    min-width: 120px;
  }
  .section-title {
    font-size: 1.1rem;
  }
}
</style>
