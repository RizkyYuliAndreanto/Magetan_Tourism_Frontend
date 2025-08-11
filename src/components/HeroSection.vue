<template>
  <section class="hero-section">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">Dinas Kebudayaan Dan Pariwisata Kabupaten Magetan</h1>
      <p class="hero-subtitle">Your journey to extraordinary destinations begins here.</p>
      <button class="hero-button">Start Your Adventure</button>
    </div>
  </section>
</template>

<script setup>
// Tidak ada logika JavaScript khusus yang dibutuhkan di sini.
</script>

<style scoped>
.hero-section {
    position: relative;
    height: calc(100vh - 80px);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-image: url('/src/assets/WhatsApp\ Image\ 2025-07-18\ at\ 10.45.26_01d937fa.jpg');
    background-size: cover;
    background-position: center;
    overflow: hidden;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--hero-overlay-transparent);
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 900px;
    padding: 20px;
    color: var(--text-color-light);
}

.hero-title {
    font-size: 3.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    line-height: 1.2;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInFromBottom 0.8s ease-out forwards;
}

.hero-subtitle {
    font-size: 1.2rem;
    font-weight: 300;
    margin-bottom: 40px;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInFromBottom 0.8s ease-out forwards 0.2s;
}

.hero-button {
    background-color: var(--primary-blue);
    color: var(--pure-white);
    padding: 15px 35px;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 5px 15px var(--box-shadow-light);
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInFromBottom 0.8s ease-out forwards 0.4s;
}

.hero-button:hover {
    background-color: var(--hover-darken-blue);
    transform: translateY(-3px);
}

@keyframes fadeInFromBottom {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media screen and (min-width: 768px) {
    .hero-title {
        font-size: 4.5rem;
    }
    .hero-subtitle {
        font-size: 1.4rem;
    }
}

@media screen and (min-width: 1024px) {
    .hero-title {
        font-size: 5.5rem;
    }
    .hero-subtitle {
        font-size: 1.6rem;
    }
}
</style>