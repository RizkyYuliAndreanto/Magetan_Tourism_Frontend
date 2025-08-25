<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">{{ isEditing ? 'Edit Konten PPID' : 'Tambah Konten PPID Baru' }}</h3>
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
            class="feather feather-file-text">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Detail Konten
        </h4>
        <div class="form-grid">
          <div class="form-group">
            <label for="judul_konten">Judul Konten <span class="required">*</span></label>
            <input type="text" id="judul_konten" v-model="formData.judul_konten" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="id_kategori_ppid">Kategori PPID <span class="required">*</span></label>
            <select id="id_kategori_ppid" v-model="formData.id_kategori_ppid" class="form-input" required>
              <option value="">Pilih Kategori</option>
              <option v-for="kategori in kategoriList" :key="kategori.id_kategori_ppid" :value="kategori.id_kategori_ppid">
                {{ kategori.nama_kategori }}
              </option>
            </select>
          </div>
          <div class="form-group span-2">
            <label for="deskripsi_konten">Deskripsi Konten</label>
            <textarea id="deskripsi_konten" v-model="formData.deskripsi_konten" class="form-input" rows="5"></textarea>
          </div>
          <div class="form-group">
            <label for="file_pdf_ppid">File PDF Utama <span class="required" v-if="!isEditing">*</span></label>
            <input type="file" id="file_pdf_ppid" @change="handlePdfUpload" class="form-input-file" accept="application/pdf" :required="!isEditing && !formData.file_pdf_path">
            <p v-if="isEditing && formData.file_pdf_path" class="mt-2 text-sm text-gray-500">File saat ini: <a :href="getFilePath(formData.file_pdf_path)" target="_blank">{{ formData.file_pdf_path.split('/').pop() }}</a></p>
          </div>
          <div class="form-group">
            <label for="gambar_sampul_ppid">Gambar Sampul <span class="required" v-if="!isEditing">*</span></label>
            <input type="file" id="gambar_sampul_ppid" @change="handleSampulUpload" class="form-input-file" accept="image/*" :required="!isEditing && !formData.gambar_sampul">
            <p v-if="isEditing && formData.gambar_sampul" class="mt-2 text-sm text-gray-500">Gambar saat ini: <a :href="getFilePath(formData.gambar_sampul)" target="_blank">{{ formData.gambar_sampul.split('/').pop() }}</a></p>
          </div>
        </div>
      </div>
      
      <hr class="form-divider">
      
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
            class="feather feather-camera">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          Media Galeri
        </h4>
        <div class="gallery-preview-container" v-if="isEditing && initialGalleryFiles.length > 0">
          <div v-for="file in initialGalleryFiles" :key="file.id_media_galeri" class="media-card">
            <img v-if="file.jenis_file === 'gambar'" :src="getMediaUrl(file.path_file)" class="media-thumbnail" alt="Galeri Media">
            <video v-else-if="file.jenis_file === 'video'" :src="getMediaUrl(file.path_file)" class="media-thumbnail" controls></video>
            <p class="media-description">{{ file.deskripsi_file }}</p>
            <button class="delete-media-button" @click="removeExistingGalleryFile(file.id_media_galeri)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
        
        <div class="form-group mt-4">
          <label for="galeri-files">Unggah File Galeri Baru (Gambar/Video)</label>
          <div class="file-drop-area" @dragover.prevent @drop="handleDropGalleryFiles">
            <div class="file-drop-content">
              <i class="fas fa-cloud-upload-alt file-icon"></i>
              <span class="file-message">Drag & drop files here or <label for="galeri-files" class="file-link">browse</label> to upload</span>
              <input type="file" id="galeri-files" @change="handleGalleryFileUpload" class="file-input" multiple accept="image/*,video/*">
            </div>
          </div>
        </div>
        
        <div class="gallery-preview-container" v-if="galleryFiles.length > 0">
          <div v-for="(file, index) in galleryFiles" :key="`new-${index}`" class="media-card">
            <div class="thumbnail-wrapper">
              <img v-if="file.previewUrl" :src="file.previewUrl" alt="Preview Thumbnail" class="media-thumbnail">
              <i v-else class="fas fa-file-alt placeholder-icon"></i>
              <div class="thumbnail-overlay">
                <span class="file-name">{{ file.file.name }}</span>
              </div>
            </div>
            <p class="media-description">{{ file.deskripsi }}</p>
            <button class="delete-media-button" @click="removeGalleryFile(index)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="action-button save-button">
          <i class="fas fa-save"></i> {{ isEditing ? 'Simpan Perubahan' : 'Simpan Konten & Galeri' }}
        </button>
        <button type="button" class="action-button cancel-button" @click="$emit('close-form')">
          <i class="fas fa-times"></i> Batal
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  isEditing: Boolean,
  initialData: Object,
  kategoriList: {
    type: Array,
    required: true,
  },
  galleryList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close-form', 'save-konten', 'update-konten']);

const formData = ref({});
const galleryFiles = ref([]);
const initialGalleryFiles = ref([]);
const deletedGalleryIds = ref([]);

watch(() => props.initialData, (newVal) => {
  formData.value = { ...newVal };
  initialGalleryFiles.value = props.galleryList ? [...props.galleryList] : [];
  galleryFiles.value = [];
  deletedGalleryIds.value = [];
}, { immediate: true });

const handlePdfUpload = (event) => {
  formData.value.file_pdf_ppid = event.target.files[0];
};

// BARU: Fungsi untuk menangani upload gambar sampul
const handleSampulUpload = (event) => {
  formData.value.gambar_sampul_ppid = event.target.files[0];
};

const handleGalleryFileUpload = (event) => {
  const files = event.target.files;
  addGalleryFiles(files);
  event.target.value = '';
};

const handleDropGalleryFiles = (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  addGalleryFiles(files);
};

const addGalleryFiles = (files) => {
  for (const file of files) {
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      let previewUrl = null;
      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }
      galleryFiles.value.push({
        file,
        deskripsi: '',
        urutan: galleryFiles.value.length + 1,
        jenis_file: file.type.startsWith('image/') ? 'gambar' : 'video',
        previewUrl
      });
    }
  }
};

const removeGalleryFile = (index) => {
  if (galleryFiles.value[index].previewUrl) {
    URL.revokeObjectURL(galleryFiles.value[index].previewUrl);
  }
  galleryFiles.value.splice(index, 1);
};

const removeExistingGalleryFile = (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus file galeri ini? Perubahan akan disimpan saat Anda memperbarui konten.')) {
    initialGalleryFiles.value = initialGalleryFiles.value.filter(file => file.id_media_galeri !== id);
    deletedGalleryIds.value.push(id);
  }
};

const getFilePath = (path) => {
  return `http://localhost:5000${path}`;
};

const getMediaUrl = (path) => {
  return `http://localhost:5000${path}`;
};

const submitForm = () => {
  const submitData = new FormData();
  for (const key in formData.value) {
    if (formData.value[key] !== null) {
      submitData.append(key, formData.value[key]);
    }
  }

  // Menambahkan file ke FormData
  if (formData.value.file_pdf_ppid) {
    submitData.append('file_pdf_ppid', formData.value.file_pdf_ppid);
  }
  if (formData.value.gambar_sampul_ppid) {
    submitData.append('gambar_sampul_ppid', formData.value.gambar_sampul_ppid);
  }

  if (props.isEditing) {
    initialGalleryFiles.value.forEach(item => {
        submitData.append('existing_gallery_updates', JSON.stringify({
            id_media_galeri: item.id_media_galeri,
            deskripsi_file: item.deskripsi_file,
            urutan_tampil: item.urutan_tampil
        }));
    });
    emit('update-konten', submitData, galleryFiles.value, deletedGalleryIds.value);
  } else {
    emit('save-konten', submitData, galleryFiles.value);
  }
};
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

.image-preview-main, .file-preview-main {
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

.pdf-link:hover {
  color: #0056b3;
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