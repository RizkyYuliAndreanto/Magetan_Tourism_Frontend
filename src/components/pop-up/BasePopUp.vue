<template>
  <div class="popup-overlay" @click.self="closePopUp()">
    <div class="popup-container" ref="popupRef">
      <div v-if="action === 'confirmDelete'">
        <div class="icon-circle confirm">
          <i class="fas fa-question"></i>
        </div>
        <h2 class="popup-title">Konfirmasi Penghapusan</h2>
        <p class="popup-message">
          Apakah Anda yakin ingin menghapus {{ entityName }} ini?
        </p>
        <div class="popup-buttons-group">
          <button class="popup-button retry-button" @click="closePopUp()">Batal</button>
          <button class="popup-button delete-button" @click="confirmDelete()">Ya, Hapus</button>
        </div>
      </div>
      
      <div v-else>
        <SuccessPopUp v-if="status === 'success'" :message="dynamicMessage" @close="closePopUp()" />
        <ErrorPopUp v-else-if="status === 'error'" :message="dynamicMessage" @close="closePopUp()" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { gsap } from 'gsap';
import SuccessPopUp from './SuccessPopUp.vue';
import ErrorPopUp from './ErrorPopUp.vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['success', 'error', 'confirm'].includes(value),
  },
  action: {
    type: String,
    required: true,
    validator: (value) => ['create', 'update', 'delete', 'confirmDelete'].includes(value),
  },
  entityName: {
    type: String,
    default: 'konten',
  },
  errorMessage: {
    type: String,
    default: 'Terjadi kesalahan.',
  },
});

const emit = defineEmits(['close', 'confirmed']);
const popupRef = ref(null);

const dynamicMessage = computed(() => {
  if (props.status === 'success') {
    switch (props.action) {
      case 'create':
        return `${props.entityName} berhasil ditambahkan!`;
      case 'update':
        return `${props.entityName} berhasil diperbarui!`;
      case 'delete':
        return `${props.entityName} berhasil dihapus!`;
      default:
        return 'Operasi berhasil!';
    }
  } else {
    return props.errorMessage;
  }
});

const closePopUp = () => {
  gsap.to(popupRef.value, {
    scale: 0.8,
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      emit('close');
    },
  });
};

const confirmDelete = () => {
  emit('confirmed');
  closePopUp();
};

onMounted(() => {
  gsap.from(popupRef.value, {
    scale: 0.8,
    opacity: 0,
    duration: 0.4,
    ease: "back.out(1.7)",
  });
});
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.popup-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 2.5rem 3rem;
  text-align: center;
  position: relative;
  max-width: 400px;
}

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

.icon-circle.confirm {
  background-color: #ffc107;
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

.popup-buttons-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
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

.popup-button.delete-button {
  background-color: #dc3545;
}

.popup-button.delete-button:hover {
  background-color: #c82333;
}

.popup-button.retry-button {
  background-color: #6c757d;
}

.popup-button.retry-button:hover {
  background-color: #5a6268;
}
</style>