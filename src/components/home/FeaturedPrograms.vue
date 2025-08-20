<template>
  <section class="featured-programs-section">
    <h2 class="section-title">Program Unggulan</h2>
    <div class="program-grid">
      <div class="program-card program-pariwisata">
        <div class="card-content">
          <h3 class="card-title">Pariwisata</h3>
          <p class="card-description">Mendukung pengembangan destinasi wisata alam dan buatan.</p>
        </div>
      </div>
      <div class="program-card program-budaya">
        <div class="card-content">
          <h3 class="card-title">Budaya</h3>
          <p class="card-description">Melestarikan tradisi, seni, dan warisan budaya lokal.</p>
        </div>
      </div>
      <div class="program-card program-ekonomi-kreatif">
        <div class="card-content">
          <h3 class="card-title">Ekonomi Kreatif</h3>
          <p class="card-description">Mendorong UMKM dan industri kreatif lokal untuk maju.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Tidak ada logika JavaScript khusus yang dibutuhkan di sini.
</script>

<style scoped>
.featured-programs-section {
  padding: 60px 20px;
  background-color: var(--pure-white);
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 30px;
}

.program-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.program-card {
  width: 100%;
  max-width: 350px;
  min-height: 200px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  color: #fff;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;
}

.program-card:hover {
  transform: translateY(-8px);
}

.program-pariwisata {
  background-image: url('https://source.unsplash.com/random/400x300?magetan-tourism');
}

.program-budaya {
  background-image: url('https://source.unsplash.com/random/400x300?magetan-culture');
}

.program-ekonomi-kreatif {
  background-image: url('https://source.unsplash.com/random/400x300?magetan-crafts');
}

.card-content {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  padding: 20px;
  text-align: center;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.card-description {
  font-size: 0.9rem;
  font-style: italic;
}
</style>