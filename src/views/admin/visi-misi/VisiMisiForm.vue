<template>
  <div class="form-container">
    <form @submit.prevent="submitForm">
      <div class="form-grid">
        <div class="form-group span-2">
          <label for="deskripsi">Deskripsi</label>
          <textarea id="deskripsi" v-model="formData.deskripsi" class="form-input" rows="5"></textarea>
        </div>
        <div class="form-group span-2">
          <label for="visi_misi_file">File Visi Misi (Gambar/PDF)</label>
          <input type="file" id="visi_misi_file" @change="handleFileUpload" class="form-input-file">
          
          <div v-if="isEditing && formData.visi_misi_file_path && !previewFile" class="file-preview-area mt-4">
            <h4 class="preview-subtitle">File Saat Ini:</h4>
            <img v-if="formData.tipe_file_visi_misi === 'gambar'" :src="getFilePath(formData.visi_misi_file_path)" alt="File Visi Misi" class="file-thumbnail" />
            <a v-else-if="formData.tipe_file_visi_misi === 'pdf'" :href="getFilePath(formData.visi_misi_file_path)" target="_blank" class="pdf-link">
              <i class="fas fa-file-pdf pdf-icon"></i>
              <span>{{ formData.visi_misi_file_path.split('/').pop() }}</span>
            </a>
          </div>
          
          <div v-if="previewFile" class="file-preview-area mt-4">
            <h4 class="preview-subtitle">Pratinjau File Baru:</h4>
            <img v-if="previewFileType === 'gambar'" :src="previewFile" alt="Pratinjau File" class="file-thumbnail" />
            <a v-else-if="previewFileType === 'pdf'" :href="previewFile" target="_blank" class="pdf-link">
              <i class="fas fa-file-pdf pdf-icon"></i>
              <span>File PDF baru telah dipilih</span>
            </a>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="action-button cancel-button" @click="$emit('close-form')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Batal
        </button>
        <button type="submit" class="action-button save-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-save">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          {{ isEditing ? 'Simpan Perubahan' : 'Simpan' }}
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

const emit = defineEmits(['close-form', 'save-visi-misi', 'update-visi-misi']);

const formData = ref({});
const previewFile = ref(null);
const previewFileType = ref(null);

watch(() => props.initialData, (newVal) => {
  formData.value = { ...newVal };
  previewFile.value = null;
}, { immediate: true });

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.visi_misi_file = file;
    previewFile.value = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) {
      previewFileType.value = 'gambar';
    } else if (file.type === 'application/pdf') {
      previewFileType.value = 'pdf';
    } else {
      previewFileType.value = null;
    }
  } else {
    previewFile.value = null;
    previewFileType.value = null;
  }
};

const getFilePath = (path) => {
  return `http://localhost:5000${path}`;
};

const submitForm = () => {
  const submitData = new FormData();
  // Logika pengisian FormData
  for (const key in formData.value) {
    if (formData.value[key] !== null && key !== 'visi_misi_file_path' && key !== 'tipe_file_visi_misi') {
      submitData.append(key, formData.value[key]);
    }
  }
  
  if (props.isEditing) {
    emit('update-visi-misi', formData.value.id_visi_misi, submitData);
  } else {
    emit('save-visi-misi', submitData);
  }
};
</script>

<style scoped>
/* Core Styling & Layout */
.form-container {
  padding: 2.5rem;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}
.form-group.span-2 {
  grid-column: 1 / -1;
}
.form-group label {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.75rem;
}
.form-input {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  border: 1px solid #ced4da;
  background-color: #f8f9fa;
  color: #495057;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.15);
  background-color: #ffffff;
}
textarea.form-input {
  min-height: 120px;
  resize: vertical;
}
.form-input-file {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  border: 1px solid #ced4da;
  background-color: #f8f9fa;
  color: #495057;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e9ecef;
}
.action-button {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}
.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.save-button {
  background-color: #007bff;
  color: white;
}
.save-button:hover {
  background-color: #0069d9;
}
.cancel-button {
  background-color: #6c757d;
  color: white;
}
.cancel-button:hover {
  background-color: #5a6268;
}
.file-preview-area {
  margin-top: 1rem;
  border: 1px solid #e0e6ed;
  border-radius: 12px;
  padding: 1rem;
}
.file-thumbnail {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.pdf-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}
.pdf-link:hover {
  text-decoration: underline;
}
.pdf-icon {
  font-size: 2rem;
  color: #dc3545;
}
</style>