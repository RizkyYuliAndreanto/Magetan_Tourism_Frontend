<template>
  <div class="detail-page-container">
    <div class="content-wrapper">
      <button @click="goBack" class="back-button">
        <i class="fas fa-arrow-left"></i> Kembali
      </button>
      <h1 class="page-main-title">PPID</h1>
      <p class="page-description">
        Pejabat Pengelola Informasi dan Dokumentasi (PPID) adalah unit kerja yang bertanggung jawab dalam mengelola dan melayani permintaan informasi serta mendokumentasikan informasi di Dinas Kebudayaan dan Pariwisata.
      </p>
      
      <div class="ppid-info-box">
        <p><strong>Nama PPID:</strong> [Nama Pejabat]</p>
        <p><strong>Kontak:</strong> [Nomor Telepon]</p>
        <p><strong>Email:</strong> [Alamat Email]</p>
      </div>
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
.ppid-info-box {
  background-color: #e6f3fa;
  border-left: 5px solid #0077b6;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}
.ppid-info-box p {
  margin: 5px 0;
  font-size: 1rem;
  color: #333;
}
.ppid-info-box p strong {
  color: #0077b6;
}
</style>