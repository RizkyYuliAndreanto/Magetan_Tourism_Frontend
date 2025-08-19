<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">{{ isEditing ? 'Edit Kategori' : 'Tambah Kategori Baru' }}</h3>
      <button class="close-form-btn" @click="$emit('close-form')">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-grid">
        <div class="form-group">
          <label for="nama_kategori">Nama Kategori <span class="required">*</span></label>
          <input type="text" id="nama_kategori" v-model="formData.nama_kategori" class="form-input" required>
        </div>
        <div class="form-group">
          <label for="id_kategori_induk">Kategori Induk</label>
          <select id="id_kategori_induk" v-model="formData.id_kategori_induk" class="form-input">
            <option :value="null">-- Pilih Kategori Induk --</option>
            <option v-for="kategori in kategoriIndukList" :key="kategori.id_kategori_ppid" :value="kategori.id_kategori_ppid">
              {{ kategori.nama_kategori }}
            </option>
          </select>
        </div>
        <div class="form-group span-2">
          <label for="deskripsi_kategori">Deskripsi Kategori</label>
          <textarea id="deskripsi_kategori" v-model="formData.deskripsi_kategori" class="form-input" rows="3"></textarea>
        </div>
      </div>
      <div class="form-actions">
        <button type="submit" class="action-button save-button">
          <i class="fas fa-save"></i> Simpan
        </button>
        <button type="button" class="action-button cancel-button" @click="$emit('close-form')">
          <i class="fas fa-times"></i> Batal
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
      id_kategori_ppid: null,
      nama_kategori: '',
      deskripsi_kategori: '',
      id_kategori_induk: null,
    }),
  },
  kategoriIndukList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['close-form', 'save-kategori', 'update-kategori']);

const formData = ref({});

watch(() => props.initialData, (newVal) => {
  formData.value = { ...newVal };
}, { immediate: true });

const submitForm = () => {
  if (props.isEditing) {
    emit('update-kategori', formData.value);
  } else {
    emit('save-kategori', formData.value);
  }
};
</script>

<style scoped>
.form-card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;
  border: 1px solid #dee2e6;
}
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 1rem;
}
.form-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #343a40;
  margin: 0;
}
.close-form-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: all 0.3s ease;
}
.close-form-btn:hover {
  color: #dc3545;
}
.form-container {
  padding-top: 1rem;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.2rem;
}
.form-group.span-2 {
  grid-column: span 2;
}
.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 0.5rem;
}
.form-input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;
  color: #343a40;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}
.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}
textarea.form-input {
  min-height: 100px;
  resize: vertical;
}
.form-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}
.save-button {
  background-color: #007bff;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.save-button:hover {
  background-color: #0069d9;
  transform: translateY(-2px);
}
.cancel-button {
  background-color: #6c757d;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.cancel-button:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}
.required {
  color: #dc3545;
}
</style>