<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">{{ isEditing ? 'Edit Struktur Organisasi' : 'Tambah Struktur Organisasi Baru' }}</h3>
      <button class="close-form-btn" @click="$emit('close-form')">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-grid">
        <div class="form-group span-2">
          <label for="judul_struktur">Judul Struktur</label>
          <input type="text" id="judul_struktur" v-model="formData.judul_struktur" class="form-input" required>
        </div>
        <div class="form-group span-2">
          <label for="deskripsi_struktur">Deskripsi Struktur</label>
          <textarea id="deskripsi_struktur" v-model="formData.deskripsi_struktur" class="form-input" rows="5"></textarea>
        </div>
        <div class="form-group span-2">
          <label for="gambar_struktur_organisasi">File Gambar Struktur Organisasi</label>
          <input type="file" id="gambar_struktur_organisasi" @change="handleFileUpload" class="form-input-file">
          
          <div v-if="isEditing && formData.gambar_struktur_path" class="file-preview-area mt-4">
            <h4 class="preview-subtitle">Gambar Saat Ini:</h4>
            <img :src="getFilePath(formData.gambar_struktur_path)" alt="Struktur Organisasi" class="file-thumbnail" />
          </div>
          
          <div v-if="previewFile" class="file-preview-area mt-4">
            <h4 class="preview-subtitle">Pratinjau Gambar Baru:</h4>
            <img :src="previewFile" alt="Pratinjau Gambar" class="file-thumbnail" />
          </div>
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
  isEditing: Boolean,
  initialData: Object,
});

const emit = defineEmits(['close-form', 'save-struktur', 'update-struktur']);

const formData = ref({});
const previewFile = ref(null);

watch(() => props.initialData, (newVal) => {
  formData.value = { ...newVal };
  previewFile.value = null;
}, { immediate: true });

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.gambar_struktur_organisasi = file;
    previewFile.value = URL.createObjectURL(file);
  } else {
    previewFile.value = null;
  }
};

const getFilePath = (path) => {
  return `http://localhost:5000${path}`;
};

const submitForm = () => {
  const submitData = new FormData();
  for (const key in formData.value) {
    if (formData.value[key] !== null) {
      submitData.append(key, formData.value[key]);
    }
  }

  if (props.isEditing) {
    emit('update-struktur', formData.value.id_struktur_organisasi, submitData);
  } else {
    emit('save-struktur', submitData);
  }
};
</script>

<style scoped>
/* Gaya CSS untuk form Struktur Organisasi */
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
.form-input-file {
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;
  color: #343a40;
  font-size: 0.95rem;
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
.file-preview-area {
  margin-top: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
}
.file-thumbnail {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
.preview-subtitle {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #343a40;
}
</style>