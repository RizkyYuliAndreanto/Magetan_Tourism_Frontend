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
      <div class="form-group">
        <label for="gambar_sampul">
          Gambar Sampul
          <span class="required" v-if="!isEditing">*</span>
        </label>
        <div class="file-drop-area">
          <div class="file-drop-content">
            <template v-if="!formData.preview_gambar_sampul">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-image file-icon">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span class="file-message">
                Drag & drop files here or <label for="gambar_sampul" class="file-link">browse</label> to upload
              </span>
            </template>
            <template v-else>
              <div class="image-preview-main">
                <img :src="formData.preview_gambar_sampul" alt="Cover Image Preview" class="hero-image-preview">
                <button type="button" @click="removeImage" class="cancel-image-btn" title="Batal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg> Batal
                </button>
              </div>
            </template>
            <input
              type="file"
              id="gambar_sampul"
              @change="handleFileUpload"
              class="file-input"
              accept="image/*"
              :required="!isEditing"
            >
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button type="submit" class="action-button save-button">
          Simpan
        </button>
        <button type="button" class="action-button cancel-button" @click="$emit('close-form')">
          Batal
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
      id_kategori_budaya: null,
      nama_kategori: '',
      deskripsi_kategori: '',
      gambar_sampul: null,
      preview_gambar_sampul: null
    }),
  },
});

const emit = defineEmits(['close-form', 'save-kategori']);

const formData = ref({ ...props.initialData });

watch(() => props.initialData, (newVal) => {
  formData.value = { ...newVal };
  if (formData.value.gambar_sampul && typeof formData.value.gambar_sampul === 'string') {
    formData.value.preview_gambar_sampul = `http://localhost:5000${formData.value.gambar_sampul}`;
  }
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.gambar_sampul_kategori_budaya = file;
    formData.value.preview_gambar_sampul = URL.createObjectURL(file);
  }
};

const removeImage = () => {
  formData.value.gambar_sampul_kategori_budaya = null;
  formData.value.preview_gambar_sampul = null;
  const fileInput = document.getElementById('gambar_sampul');
  if (fileInput) {
    fileInput.value = '';
  }
};

const submitForm = () => {
  const submitData = new FormData();
  for (const key in formData.value) {
    if (key !== 'preview_gambar_sampul' && formData.value[key] !== null) {
      if (key === 'gambar_sampul_kategori_budaya') {
        submitData.append('gambar_sampul_kategori_budaya', formData.value.gambar_sampul_kategori_budaya);
      } else if (key !== 'gambar_sampul') { // Exclude original gambar_sampul string from form data
        submitData.append(key, formData.value[key]);
      }
    }
  }
  
  if (props.isEditing) {
    submitData.append('id_kategori_budaya', formData.value.id_kategori_budaya);
  }

  emit('save-kategori', submitData);
};
</script>

<style scoped>
/* Styling yang sama dari CategoryDestinasiForm.vue, plus gaya untuk upload file */
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
.file-drop-area {
  border: 1px dashed #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}
.file-drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
}
.file-icon {
  width: 2rem;
  height: 2rem;
  color: #2563eb;
  margin-bottom: 0.5rem;
}
.file-message {
  font-size: 0.95rem;
  color: #64748b;
  text-align: center;
  width: 100%;
}
.file-link {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
}
.file-input {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 10;
}
.image-preview-main {
  width: 100%;
  text-align: center;
}
.hero-image-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
.cancel-image-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
  margin-top: 0.5rem;
  margin-left: 100px;
}
.cancel-image-btn:hover {
  background: #c82333;
}
</style>