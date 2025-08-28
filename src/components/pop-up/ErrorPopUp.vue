<template>
  <div>
    <div class="icon-circle error">
      <svg class="crossmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="crossmark__circle" cx="26" cy="26" r="25" fill="none" />
        <path class="crossmark__check crossmark__check--left" fill="none" d="M16 16l20 20" />
        <path class="crossmark__check crossmark__check--right" fill="none" d="M36 16l-20 20" />
      </svg>
    </div>
    <h2 class="popup-title">Gagal!</h2>
    <p class="popup-message">{{ message }}</p>
    <button class="popup-button retry-button" @click="$emit('close')">
      Coba Lagi
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

defineProps({
  message: String,
});

defineEmits(['close']);

onMounted(() => {
  gsap.fromTo('.crossmark__circle',
    { drawSVG: '0% 0%' },
    { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' }
  );
  gsap.fromTo('.crossmark__check--left',
    { drawSVG: '0% 0%' },
    { drawSVG: '100%', duration: 0.8, delay: 0.2, ease: 'power2.inOut' }
  );
  gsap.fromTo('.crossmark__check--right',
    { drawSVG: '0% 0%' },
    { drawSVG: '100%', duration: 0.8, delay: 0.4, ease: 'power2.inOut' }
  );
});
</script>

<style scoped>
.icon-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -60px auto 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-size: 2.5rem;
  color: white;
}

.icon-circle.error {
  background-color: #dc3545;
}

.crossmark {
  width: 50px;
  height: 50px;
}

.crossmark__circle {
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #fff;
  fill: transparent;
}

.crossmark__check {
  transform-origin: 50% 50%;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-miterlimit: 10;
  stroke: #fff;
}

.popup-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.popup-message {
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.popup-button {
  padding: 0.8rem 2.5rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.popup-button.retry-button {
  background-color: #dc3545;
}

.popup-button.retry-button:hover {
  background-color: #c82333;
  box-shadow: 0 6px 16px rgba(220, 53, 69, 0.2);
}
</style>