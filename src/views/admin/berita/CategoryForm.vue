<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">{{ isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru' }}</h3>
      <button class="close-form-btn" @click="$emit('close-form')">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label for="nama_kategori">Nama Kategori</label>
        <input type="text" id="nama_kategori" v-model="formData.nama_kategori" class="form-input" required>
      </div>
      <div class="form-group">
        <label for="deskripsi_kategori">Deskripsi Kategori</label>
        <textarea id="deskripsi_kategori" v-model="formData.deskripsi_kategori" class="form-input" rows="3"></textarea>
      </div>
      <div class="form-actions">
        <button type="button" class="action-button cancel-button" @click="$emit('close-form')">
          Batal
        </button>
        <button type="submit" class="action-button save-button">
          Simpan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isEditing: {
    type: Boolean,
    required: true,
  },
  initialData: {
    type: Object,
    default: () => ({
      id_kategori: null,
      nama_kategori: '',
      deskripsi_kategori: '',
    }),
  },
});

const emit = defineEmits(['close-form', 'save-kategori']);

const formData = ref({ ...props.initialData });

watch(() => props.initialData, (newVal) => {
  formData.value = { ...newVal };
});

const submitForm = () => {
  emit('save-kategori', formData.value);
};
</script>

<style scoped>
.form-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.close-form-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: color 0.2s;
}

.close-form-btn:hover {
  color: #ef4444;
}

.form-container {
  padding: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #1e293b;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.save-button {
  background-color: #2563eb;
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #3b82f6;
}

.cancel-button {
  background-color: #64748b;
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>