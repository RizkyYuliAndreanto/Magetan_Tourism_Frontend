<template>
  <section class="social-media-section">
    <h2 class="section-title">Ikuti Kami di Media Sosial</h2>
    <div class="social-media-grid-container">
      <div class="social-media-card youtube">
        <iframe
          src="https://www.youtube.com/embed/5FI2Vhkocm0" 
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          title="YouTube video player"
          class="social-media-iframe"
        ></iframe>
      </div>

      <div class="social-media-card tiktok">
        <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@magetantourism/video/7382600155440205061" data-video-id="7382600155440205061" style="max-width: 605px; min-width: 325px;"> 
          <section> 
            <a target="_blank" title="@magetantourism" href="https://www.tiktok.com/@magetantourism">@magetantourism</a> 
            <a target="_blank" title="♬ original sound - Magetan Tourism" href="https://www.tiktok.com/music/original-sound-7382600155440205061">♬ original sound - Magetan Tourism</a> 
          </section> 
        </blockquote>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  const tiktokScript = document.createElement('script');
  tiktokScript.async = true;
  tiktokScript.src = "https://www.tiktok.com/embed.js";
  document.head.appendChild(tiktokScript);
});
</script>

<style scoped>
.social-media-section {
    padding: 60px 20px;
    background-color: var(--pure-white);
    text-align: center;
}

.section-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 60px;
    color: var(--text-color-dark);
}

.social-media-grid-container {
    display: grid;
    grid-template-columns: 2fr 1fr; /* YouTube mengambil 2/3 lebar, TikTok 1/3 */
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.social-media-card {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* GAYA KHUSUS UNTUK YOUTUBE (LANDSCAPE 16:9) */
.social-media-card.youtube {
    padding-bottom: 56.25%; /* Rasio aspek 16:9 */
}

/* GAYA KHUSUS UNTUK TIKTOK (POTRET) */
.social-media-card.tiktok {
    padding-bottom: 150%; /* Rasio aspek potret 2:3 yang umum */
}


.social-media-iframe,
:deep(.instagram-media),
:deep(.tiktok-embed) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    box-sizing: border-box;
    transform: none !important;
    min-width: unset !important;
}

/* RESPONSIVE: Tata letak untuk layar kecil */
@media screen and (max-width: 768px) {
    .social-media-grid-container {
        grid-template-columns: 1fr;
    }

    .social-media-card.youtube,
    .social-media-card.tiktok {
        grid-column: span 1;
    }

    .social-media-card.youtube {
        padding-bottom: 56.25%;
    }

    .social-media-card.tiktok {
        padding-bottom: 150%;
    }
}
</style>