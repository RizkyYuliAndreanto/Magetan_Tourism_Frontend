<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">{{ isEditing ? 'Edit Media Galeri' : 'Tambah Media Galeri Baru' }}</h3>
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
      <div class="form-grid">
        <div class="form-group">
          <label for="tipe_konten">Tipe Konten</label>
          <select id="tipe_konten" v-model="formData.tipe_konten" class="form-input">
            <option value="">Tidak Terhubung</option>
            <option value="berita">Berita</option>
            <option value="destinasi">Destinasi</option>
            <option value="event">Event</option>
            <option value="umkm">UMKM</option>
            <option value="sejarah">Sejarah</option>
            <option value="budaya">Budaya</option>
            <option value="akomodasi">Akomodasi</option>
          </select>
        </div>
        <div class="form-group">
          <label for="id_konten">ID Konten</label>
          <input
            type="number"
            id="id_konten"
            v-model="formData.id_konten"
            class="form-input"
            :disabled="!formData.tipe_konten"
            />
        </div>
        <div class="form-group">
          <label for="urutan_tampil">Urutan Tampil</label>
          <input
            type="number"
            id="urutan_tampil"
            v-model="formData.urutan_tampil"
            class="form-input" />
        </div>
        <div class="form-group">
          <label for="deskripsi_file">Deskripsi File</label>
          <textarea
            id="deskripsi_file"
            v-model="formData.deskripsi_file"
            class="form-input"
            rows="3"></textarea>
        </div>
        
        <div v-if="!isEditing" class="form-group span-2">
          <label for="media-files">File Media (Maks. 10 File)<span class="required">*</span></label>
          <div
            :class="['file-drop-area', {'is-dragover': isDragover}]"
            @dragover.prevent="isDragover = true"
            @dragleave.prevent="isDragover = false"
            @drop="handleDropFiles">
            <div class="file-drop-content">
              <template v-if="mediaPreviews.length === 0">
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
                  Drag & drop files here or
                  <label for="media-files" class="file-link">browse</label> to upload
                </span>
                <input type="file" id="media-files" @change="handleFileUpload" class="file-input" multiple required>
              </template>
              <template v-else>
                <p class="file-message">File berhasil diunggah ({{ mediaPreviews.length }} file)</p>
                <button type="button" class="action-button cancel-button" @click="clearFiles">
                  Hapus Semua
                </button>
              </template>
            </div>
          </div>
        </div>

        <div v-if="isEditing" class="form-group span-2">
          <label for="media-file-edit">Ganti File Media</label>
          <div
            :class="['file-drop-area', {'is-dragover': isDragover}]"
            @dragover.prevent="isDragover = true"
            @dragleave.prevent="isDragover = false"
            @drop="handleDropFiles">
            <div class="file-drop-content">
              <template v-if="mediaPreviews.length === 0">
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
                  Drag & drop files here or
                  <label for="media-file-edit" class="file-link">browse</label> to upload
                </span>
                <input type="file" id="media-file-edit" @change="handleFileUpload" class="file-input" accept="image/*,video/*">
              </template>
              <template v-else>
                <div class="image-preview-main">
                  <img v-if="mediaPreviews[0].type.startsWith('image')" :src="mediaPreviews[0].url" alt="Preview" class="hero-image-preview">
                  <video v-else-if="mediaPreviews[0].type.startsWith('video')" :src="mediaPreviews[0].url" controls class="hero-image-preview"></video>
                  <button type="button" @click="clearFiles" class="cancel-image-btn" title="Batal">
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
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                    </svg>
                    Batal
                  </button>
                </div>
              </template>
            </div>
          </div>
          <p v-if="mediaPreviews.length === 0 && initialData.path_file" class="mt-2 text-sm text-gray-500">File saat ini: {{ initialData.path_file.split('/').pop() }}</p>
        </div>
      </div>
      <div v-if="mediaPreviews.length > 0 && !isEditing" class="form-group span-2">
          <p class="text-sm font-semibold text-gray-700 mb-2">Pratinjau File:</p>
          <div class="media-gallery-grid">
              <div v-for="(preview, index) in mediaPreviews" :key="index" class="media-card">
                  <img v-if="preview.type.startsWith('image')" :src="preview.url" class="media-thumbnail" :alt="'Preview ' + index">
                  <video v-else-if="preview.type.startsWith('video')" :src="preview.url" class="media-thumbnail" controls></video>
                  <p class="media-description text-xs">{{ preview.file.name }}</p>
                  <button type="button" class="delete-media-button" @click="removePreview(index)">
                      <i class="fas fa-times"></i>
                  </button>
              </div>
          </div>
      </div>
      <div class="form-actions">
        <button type="submit" class="action-button save-button">
          <i class="fas fa-save"></i> {{ isEditing ? 'Simpan Perubahan' : 'Simpan Media' }}
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
  initialData: {
    type: Object,
    default: () => ({
      id_media_galeri: null,
      id_konten: null,
      tipe_konten: '',
      path_file: null,
      deskripsi_file: '',
      jenis_file: 'gambar',
      urutan_tampil: 0,
    }),
  },
});

const emit = defineEmits(['close-form', 'save-media', 'update-media']);

const formData = ref({});
const selectedFiles = ref([]);
const mediaPreviews = ref([]);
const isDragover = ref(false);

watch(() => props.initialData, (newVal) => {
  formData.value = newVal ? { ...newVal } : {};
  selectedFiles.value = [];
  mediaPreviews.value = [];
  if (props.isEditing && newVal.path_file) {
    mediaPreviews.value.push({
      url: `http://localhost:5000${newVal.path_file}`,
      type: newVal.jenis_file === 'gambar' ? 'image' : 'video',
      file: null,
    });
  }
}, { immediate: true, deep: true });

const handleFileSelection = (files) => {
  if (props.isEditing) {
    // Hanya izinkan 1 file saat mode edit
    const fileArray = Array.from(files).slice(0, 1);
    selectedFiles.value = fileArray;
    mediaPreviews.value = fileArray.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
      file: file
    }));
  } else {
    // Batasi 10 file saat mode create
    const fileArray = Array.from(files).slice(0, 10);
    selectedFiles.value = fileArray;
    mediaPreviews.value = fileArray.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
      file: file
    }));
  }
};

const handleFileUpload = (event) => {
  handleFileSelection(event.target.files);
};

const handleDropFiles = (event) => {
  event.preventDefault();
  isDragover.value = false;
  handleFileSelection(event.dataTransfer.files);
};

const removePreview = (index) => {
  const removedFile = mediaPreviews.value.splice(index, 1);
  selectedFiles.value.splice(index, 1);
  if (removedFile[0].url) {
    URL.revokeObjectURL(removedFile[0].url);
  }
};

const clearFiles = () => {
  mediaPreviews.value.forEach(preview => {
    if (preview.url) {
      URL.revokeObjectURL(preview.url);
    }
  });
  mediaPreviews.value = [];
  selectedFiles.value = [];
};

const submitForm = () => {
  const submitData = new FormData();

  if (props.isEditing) {
    submitData.append('deskripsi_file', formData.value.deskripsi_file || '');
    submitData.append('urutan_tampil', formData.value.urutan_tampil || 0);
    if (formData.value.id_konten) {
      submitData.append('id_konten', formData.value.id_konten);
    }
    if (formData.value.tipe_konten) {
      submitData.append('tipe_konten', formData.value.tipe_konten);
    }

    if (selectedFiles.value.length > 0) {
      submitData.append('media_galeri_file', selectedFiles.value[0]);
    }
    emit('update-media', submitData, formData.value.id_media_galeri);
  } else {
    if (selectedFiles.value.length === 0) {
      alert('Pilih setidaknya satu file untuk diunggah.');
      return;
    }
    
    // Kirim data metadata sebagai array untuk multiple files
    submitData.append('id_konten', formData.value.id_konten || '');
    submitData.append('tipe_konten', formData.value.tipe_konten || '');
    submitData.append('deskripsi_file', formData.value.deskripsi_file || '');
    submitData.append('urutan_tampil', formData.value.urutan_tampil || '');

    selectedFiles.value.forEach((file) => {
      submitData.append('media_galeri_files', file);
    });
    emit('save-media', submitData);
  }
};
</script>

<style scoped>
/* Gaya CSS yang konsisten dari komponen EventForm.vue */
.form-card {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  margin: 2rem auto;
  max-width: 900px;
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

.image-preview-main {
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
.file-name-display {
  font-weight: 600;
  color: #343a40;
  word-break: break-all;
  text-align: center;
}

.large-icon {
  font-size: 4rem;
  color: #007bff;
}

/* Gallery Styling */
.media-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.media-card {
  position: relative;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.media-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.media-thumbnail {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.media-description {
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  font-size: 0.9rem;
  color: #343a40;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}
.text-xs {
  font-size: 0.75rem;
}
.delete-media-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(220, 53, 69, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.delete-media-button:hover {
  opacity: 1;
  background-color: #dc3545;
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

.required {
  color: #dc3545;
}
.media-preview-thumb {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 4px;
}
.media-thumbnail-small {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
@media (max-width: 992px) {
  .content-wrapper {
    padding: 1rem;
  }
}
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  .main-content.sidebar-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
  }
  .admin-header {
    left: 0;
  }
  .mobile-menu-btn {
    display: block;
  }
  .header-title {
    font-size: 1.3rem;
  }
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
}
@media (max-width: 576px) {
  .page-title {
    font-size: 1.5rem;
  }
  .form-title {
    font-size: 1.2rem;
  }
  .action-button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  .data-table th,
  .data-table td {
    padding: 0.75rem;
  }
  .media-gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>