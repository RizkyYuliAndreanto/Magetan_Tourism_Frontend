<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="confirm-modal">
      <div class="modal-icon">
        <svg
          class="w-6 h-6 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>

      <div class="modal-content">
        <h3 class="modal-title">{{ title }}</h3>
        <p class="modal-message">{{ message }}</p>
      </div>

      <div class="modal-actions">
        <button @click="$emit('cancel')" class="btn-cancel">Batal</button>
        <button
          @click="$emit('confirm')"
          :class="['btn-confirm', confirmClass]">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: "Konfirmasi",
  },
  confirmClass: {
    type: String,
    default: "btn-primary",
  },
});

defineEmits(["confirm", "cancel"]);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
}

.confirm-modal {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 28rem;
  width: 100%;
  padding: 1.5rem;
  text-align: center;
}

.modal-icon {
  margin: 0 auto 1rem;
  width: 3rem;
  height: 3rem;
  background-color: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.modal-message {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  color: #374151;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-cancel:hover {
  background-color: #f9fafb;
}

.btn-cancel:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.btn-confirm {
  padding: 0.5rem 1rem;
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 0.875rem;
}

.btn-confirm:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3);
}

.btn-primary {
  background-color: #2563eb;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-danger {
  background-color: #dc2626;
}

.btn-danger:hover {
  background-color: #b91c1c;
}

.btn-warning {
  background-color: #d97706;
}

.btn-warning:hover {
  background-color: #b45309;
}

.btn-success {
  background-color: #059669;
}

.btn-success:hover {
  background-color: #047857;
}

/* Responsive */
@media (max-width: 640px) {
  .confirm-modal {
    margin: 0 1rem;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
    justify-content: center;
  }
}
</style>
