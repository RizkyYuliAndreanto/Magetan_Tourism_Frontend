<template>
  <div class="detail-page-container">
    <div class="content-wrapper">
      <button @click="goBack" class="back-button">
        <i class="fas fa-arrow-left"></i> Kembali
      </button>
      <h1 class="page-main-title">Profil Dinas</h1>
      <p class="page-description">
        Dinas Kebudayaan dan Pariwisata Kabupaten Magetan adalah entitas pemerintah yang bertanggung jawab atas pengembangan dan pelestarian kebudayaan serta sektor pariwisata di wilayah Magetan.
      </p>
      <p class="page-description">
        Kami bertekad untuk menjadikan Magetan sebagai destinasi wisata unggulan yang kaya akan nilai-nilai lokal dan memberikan pengalaman tak terlupakan bagi setiap pengunjung.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goBack = () => {
  router.back();
};
</script>

<style scoped>
.detail-page-container {
  padding-top: 80px;
  min-height: 100vh;
  background-color: #f4f7f9;
  color: #333;
}
.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 25px;
  transition: background-color 0.3s ease;
}
.back-button:hover {
  background-color: #5a6268;
}
.page-main-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #0077b6;
  margin-bottom: 20px;
}
.page-description {
  font-size: 1rem;
  color: #495057;
  line-height: 1.8;
  margin-bottom: 20px;
}
</style>