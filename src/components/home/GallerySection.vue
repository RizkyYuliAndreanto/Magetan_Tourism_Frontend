<template>
  <section class="gallery-section">
    <h2 class="section-title">Galeri Foto</h2>
    <div class="gallery-grid">
      <img src="https://source.unsplash.com/random/400x300?magetan-lake" alt="Gallery Image 1" class="gallery-image">
      <img src="https://source.unsplash.com/random/400x300?magetan-culture" alt="Gallery Image 2" class="gallery-image">
      <img src="https://source.unsplash.com/random/400x300?magetan-mountains" alt="Gallery Image 3" class="gallery-image">
      <img src="https://source.unsplash.com/random/400x300?magetan-city" alt="Gallery Image 4" class="gallery-image">
      <img src="https://source.unsplash.com/random/400x300?magetan-nature" alt="Gallery Image 5" class="gallery-image">
      <img src="https://source.unsplash.com/random/400x300?magetan-scenery" alt="Gallery Image 6" class="gallery-image">
    </div>
  </section>
</template>

<script setup>
// Tidak ada logika JavaScript khusus yang dibutuhkan di sini.
</script>

<style scoped>
.gallery-section {
  padding: 80px 20px;
  background-color: var(--pure-white);
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 60px;
  color: var(--text-color-dark);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 5px 15px var(--box-shadow-light);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.gallery-image:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px var(--box-shadow-medium);
}
</style>