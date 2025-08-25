<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">{{ isEditing ? 'Edit Visi Misi' : 'Tambah Visi Misi Baru' }}</h3>
      <button class="close-form-btn" @click="$emit('close-form')">
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
          class="feather feather-x">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-section">
        <h4 class="section-title">
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
            class="feather feather-star">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Detail Visi Misi
        </h4>
        <div class="form-grid">
          <div class="form-group span-2">
            <label for="deskripsi">Deskripsi</label>
            <textarea id="deskripsi" v-model="formData.deskripsi" class="form-input" rows="5"></textarea>
          </div>
          
          <div class="form-group span-2">
            <label for="visi_misi_file"
              >File Visi Misi (Gambar/PDF)
              <span class="required" v-if="!isEditing">*</span></label
            >
            <div
              :class="['file-drop-area', {'is-dragover': isFileDragover}]"
              @dragover.prevent="isFileDragover = true"
              @dragleave.prevent="isFileDragover = false"
              @drop="handleDropFile">
              <div class="file-drop-content">
                <template v-if="!previewFile">
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
                    class="feather feather-upload-cloud file-icon">
                    <polyline points="16 16 12 12 8 16"></polyline>
                    <line x1="12" y1="12" x2="12" y2="21"></line>
                    <path
                      d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                  </svg>
                  <span class="file-message">
                    Drag files to upload or
                    <label for="visi_misi_file" class="file-link">browse</label>
                  </span>
                  <input
                    type="file"
                    id="visi_misi_file"
                    @change="handleFileUpload"
                    class="file-input"
                    accept="image/*,.pdf"
                    :required="!isEditing && !formData.visi_misi_file_path" />
                </template>
                <template v-else>
                  <div class="file-preview-main">
                    <img
                      v-if="previewFileType === 'gambar'"
                      :src="previewFile"
                      alt="Pratinjau File"
                      class="hero-image-preview" />
                    <a
                      v-else-if="previewFileType === 'pdf'"
                      :href="previewFile"
                      target="_blank"
                      class="pdf-link">
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
                        class="feather feather-file-text pdf-icon">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <span class="pdf-file-name">File PDF baru telah dipilih</span>
                    </a>
                    <button
                      type="button"
                      @click="removeFile"
                      class="cancel-image-btn"
                      title="Batal">
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
                        class="feather feather-x-square">
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                      </svg>
                      Batal
                    </button>
                  </div>
                </template>
              </div>
            </div>
            
            <div v-if="isEditing && formData.visi_misi_file_path && !formData.visi_misi_file" class="file-preview-main-existing">
              <h4 class="preview-subtitle">File Saat Ini:</h4>
              <img v-if="formData.tipe_file_visi_misi === 'gambar'" :src="getFilePath(formData.visi_misi_file_path)" alt="File Visi Misi" class="hero-image-preview" />
              <a v-else-if="formData.tipe_file_visi_misi === 'pdf'" :href="getFilePath(formData.visi_misi_file_path)" target="_blank" class="pdf-link-existing">
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
                  class="feather feather-file-text pdf-icon">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>{{ formData.visi_misi_file_path.split('/').pop() }}</span>
              </a>
            </div>
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
import { ref, watch, onUnmounted } from 'vue';

const props = defineProps({
  isEditing: Boolean,
  initialData: Object,
});

const emit = defineEmits(['close-form', 'save-visi-misi', 'update-visi-misi']);

const formData = ref({});
const previewFile = ref(null);
const previewFileType = ref(null);
const isFileDragover = ref(false);

watch(() => props.initialData, (newVal) => {
  formData.value = { ...newVal };
  // Periksa apakah ada file yang sudah ada dari API, lalu buat preview-nya
  if (formData.value.visi_misi_file_path) {
    if (formData.value.tipe_file_visi_misi === 'gambar') {
      previewFile.value = `http://localhost:5000${formData.value.visi_misi_file_path}`;
      previewFileType.value = 'gambar';
    } else if (formData.value.tipe_file_visi_misi === 'pdf') {
      previewFile.value = `http://localhost:5000${formData.value.visi_misi_file_path}`;
      previewFileType.value = 'pdf';
    }
  } else {
    previewFile.value = null;
    previewFileType.value = null;
  }
}, { immediate: true });

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.visi_misi_file = file;
    const url = URL.createObjectURL(file);
    previewFile.value = url;
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

const handleDropFile = (event) => {
  event.preventDefault();
  isFileDragover.value = false;
  const file = event.dataTransfer.files[0];
  if (file) {
    formData.value.visi_misi_file = file;
    const url = URL.createObjectURL(file);
    previewFile.value = url;
    if (file.type.startsWith('image/')) {
      previewFileType.value = 'gambar';
    } else if (file.type === 'application/pdf') {
      previewFileType.value = 'pdf';
    } else {
      previewFileType.value = null;
    }
  }
};

const removeFile = () => {
  if (previewFile.value) {
    URL.revokeObjectURL(previewFile.value);
  }
  formData.value.visi_misi_file = null;
  previewFile.value = null;
  previewFileType.value = null;
};

const getFilePath = (path) => {
  return `http://localhost:5000${path}`;
};

const submitForm = () => {
  const submitData = new FormData();
  for (const key in formData.value) {
    if (key !== 'visi_misi_file_path' && key !== 'tipe_file_visi_misi' && key !== 'id_visi_misi' && formData.value[key] !== null) {
      submitData.append(key, formData.value[key]);
    }
  }

  if (props.isEditing) {
    emit('update-visi-misi', formData.value.id_visi_misi, submitData);
  } else {
    emit('save-visi-misi', submitData);
  }
};

onUnmounted(() => {
  if (previewFile.value) {
    URL.revokeObjectURL(previewFile.value);
  }
});
</script>

<style scoped>
/* Core Styling & Layout */
.form-card {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  border: 1px solid #f0f4f8;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
  margin: 0;
}

.close-form-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  transition: color 0.3s ease, transform 0.2s ease;
}

.close-form-btn:hover {
  color: #dc3545;
  transform: rotate(90deg);
}

.form-container {
  padding-top: 1rem;
}

.form-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-title svg {
  color: #007bff;
  width: 20px;
  height: 20px;
}

/* Form Elements */
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

.required {
  color: #dc3545;
}

/* File Drop Area */
.file-drop-area {
  border: 2px dashed #ced4da;
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.file-drop-area.is-dragover {
  border-color: #007bff;
  background-color: #eaf5ff;
}

.file-drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.file-icon {
  font-size: 2.5rem;
  color: #007bff;
}

.file-message {
  font-size: 0.95rem;
  color: #6c757d;
  font-weight: 500;
}

.file-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.file-link:hover {
  color: #0056b3;
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

.image-preview-main, .file-preview-main, .file-preview-main-existing {
  width: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #e9ecef;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}
.file-preview-main-existing {
  background-color: transparent;
  box-shadow: none;
  padding: 0;
}

.hero-image-preview {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  display: block;
}

.cancel-image-btn {
  position: relative;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.cancel-image-btn:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}

.pdf-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}
.pdf-link-existing {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.pdf-link:hover, .pdf-link-existing:hover {
  color: #0056b3;
  text-decoration: underline;
}

.pdf-icon {
  font-size: 2.5rem;
  color: #dc3545;
}

.pdf-file-name {
  font-size: 0.95rem;
  color: #495057;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


/* Action Buttons */
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

.form-divider {
  border: 0;
  border-top: 2px solid #e9ecef;
  margin: 2rem 0;
}

/* Responsiveness */
@media (max-width: 768px) {
  .form-card {
    padding: 1.5rem;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-group.span-2 {
    grid-column: 1;
  }
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  .action-button {
    width: 100%;
    justify-content: center;
  }
  .image-preview-main {
    padding: 1rem;
  }
}
</style>