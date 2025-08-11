<template>
  <section class="social-media-section">
    <h2 class="section-title">Connect With Us!</h2>
    <div class="social-media-grid">
      <div class="video-container youtube">
        <iframe
          src="https://www.youtube.com/embed/VIDEO_ID_ANDA" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          title="YouTube video player"></iframe>
        <p class="video-caption">Petualangan Terbaru Kami di YouTube</p>
      </div>

      <div class="video-container instagram">
        <a href="https://www.instagram.com/wonderfullindonesia/" target="_blank" rel="noopener noreferrer">
          <img src="https://via.placeholder.com/640x360/EFEFEF/333333?text=Instagram+Video+Preview" alt="Instagram Video" class="instagram-placeholder-img">
        </a>
        <p class="video-caption">Intip Keindahan di Instagram Kami</p>
      </div>

      <div class="video-container tiktok">
        <iframe
          src="https://www.tiktok.com/embed/VIDEO_ID_ANDA" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          title="TikTok video player"></iframe>
        <p class="video-caption">Momen Singkat Terbaik di TikTok</p>
      </div>
    </div>
  </section>
</template>

<script setup>
// Tidak ada logika JavaScript khusus yang dibutuhkan di sini.
</script>

<style scoped>
/* Gaya CSS tetap sama */
.social-media-section {
    padding: 80px 20px;
    background-color: var(--off-white);
    text-align: center;
    color: var(--text-color-dark);
}

.section-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 60px;
    color: var(--text-color-dark);
}

.social-media-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
}

.video-container {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    background-color: #000;
    border-radius: 8px;
    box-shadow: 0 5px 15px var(--box-shadow-light);
}

.video-container iframe,
.video-container .instagram-placeholder-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    object-fit: cover;
}

.video-caption {
    margin-top: 15px;
    font-size: 1.1rem;
    color: var(--text-color-dark);
    font-weight: bold;
}

@media screen and (min-width: 768px) {
    .social-media-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media screen and (min-width: 1024px) {
    .social-media-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>