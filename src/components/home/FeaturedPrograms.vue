<template>
  <section class="featured-programs-section">
    <h2 class="section-title">Program Unggulan</h2>
    <div class="program-grid">
      <div class="program-card program-pariwisata">
        <div class="card-content">
          <h3 class="card-title">Pariwisata</h3>
          <p class="card-description">
            Mendukung pengembangan destinasi wisata alam dan buatan.
          </p>
        </div>
      </div>
      <div class="program-card program-budaya">
        <div class="card-content">
          <h3 class="card-title">Budaya</h3>
          <p class="card-description">
            Melestarikan tradisi, seni, dan warisan budaya lokal.
          </p>
        </div>
      </div>
      <div class="program-card program-ekonomi-kreatif">
        <div class="card-content">
          <h3 class="card-title">Ekonomi Kreatif</h3>
          <p class="card-description">
            Mendorong UMKM dan industri kreatif lokal untuk maju.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Tidak ada logika JavaScript khusus yang dibutuhkan di sini.
</script>

<style scoped>
/* ===== CONSISTENT COLOR VARIABLES ===== */
:root {
  --royal-blue: #1e3a8a;
  --gold-accent: #d4af37;
  --pearl-white: #ffffff;
  --ivory-white: #f8f9fa;
  --premium-shadow: 0 20px 40px rgba(30, 58, 138, 0.15);
  --gold-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.featured-programs-section {
  padding: 80px 32px;
  background: linear-gradient(
    135deg,
    var(--ivory-white) 0%,
    #e6f2ff 50%,
    #f0f6fe 100%
  );
  text-align: center;
  position: relative;
  overflow: hidden;
}

.section-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 40px;
  color: var(--royal-blue);
  text-shadow: 0 4px 15px rgba(30, 58, 138, 0.3);
  font-family: "Playfair Display", serif;
  letter-spacing: -1px;
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
  max-width: 380px;
  min-height: 240px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--premium-shadow);
  color: #fff;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-size: cover;
  background-position: center;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 2px solid rgba(212, 175, 55, 0.2);
  position: relative;
}

.program-card:hover {
  transform: translateY(-8px);
}

.program-pariwisata {
  background-image: url("https://source.unsplash.com/random/400x300?magetan-tourism");
}

.program-budaya {
  background-image: url("https://source.unsplash.com/random/400x300?magetan-culture");
}

.program-ekonomi-kreatif {
  background-image: url("https://source.unsplash.com/random/400x300?magetan-crafts");
}

.card-content {
  background: linear-gradient(
    135deg,
    rgba(30, 58, 138, 0.85) 0%,
    rgba(212, 175, 55, 0.75) 50%,
    rgba(30, 58, 138, 0.85) 100%
  );
  width: 100%;
  padding: 32px;
  text-align: center;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
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
