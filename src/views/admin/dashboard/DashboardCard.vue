<template>
  <div class="dashboard-card" :style="{ '--card-color': color }">
    <div class="card-icon">
      <i :class="icon"></i>
    </div>
    <div class="card-content">
      <h4 class="card-title">{{ title }}</h4>
      <p class="card-value">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  color: String,
});
</script>
<style scoped>
.dashboard-card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 16px; /* Sudut lebih membulat */
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08); /* Bayangan lebih jelas */
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #e9ecef; /* Border yang jelas */
}

.dashboard-card:hover {
  transform: translateY(-8px); /* Efek hover yang lebih dramatis */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); /* Bayangan saat hover */
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--card-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.75rem; /* Ukuran ikon lebih besar */
}

.card-content {
  flex-grow: 1;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 500;
  color: #6c757d; /* Warna teks yang jelas */
  margin: 0 0 0.5rem 0;
}

.card-value {
  font-size: 2.25rem; /* Nilai lebih besar dan menonjol */
  font-weight: 700;
  color: #212529; /* Teks yang sangat jelas */
  margin: 0;
}
</style>