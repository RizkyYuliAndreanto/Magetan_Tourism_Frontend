<template>
  <!-- Modal Backdrop -->
  <div class="modal-backdrop" @click.self="$emit('close-form')">
    <!-- Modal Container -->
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">
          <i class="fas fa-tags"></i>
          {{
            isEditing
              ? "Edit Kategori Destinasi"
              : "Tambah Kategori Destinasi Baru"
          }}
        </h3>
        <button class="close-modal-btn" @click="$emit('close-form')">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <!-- Modal Body -->
      <div class="modal-body">
        <form @submit.prevent="submitForm" class="category-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="nama_kategori" class="form-label">
                <i class="fas fa-tag"></i>
                Nama Kategori
                <span class="required">*</span>
              </label>
              <input
                type="text"
                id="nama_kategori"
                v-model="formData.nama_kategori"
                class="form-input"
                placeholder="Masukkan nama kategori destinasi"
                required />
            </div>

            <div class="form-group">
              <label for="deskripsi_kategori" class="form-label">
                <i class="fas fa-align-left"></i>
                Deskripsi Kategori
              </label>
              <textarea
                id="deskripsi_kategori"
                v-model="formData.deskripsi_kategori"
                class="form-textarea"
                rows="4"
                placeholder="Masukkan deskripsi kategori destinasi"></textarea>
            </div>

            <div class="form-group">
              <label for="sampul_kategori" class="form-label">
                <i class="fas fa-image"></i>
                Sampul Kategori
              </label>
              <div
                class="file-upload-area"
                @dragover.prevent
                @drop="handleDropFile">
                <div v-if="!previewImage" class="upload-placeholder">
                  <svg
                    class="upload-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17,8 12,3 7,8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p class="upload-text">
                    Drag & drop gambar di sini atau
                    <label for="sampul_kategori" class="upload-link"
                      >pilih file</label
                    >
                  </p>
                  <p class="upload-hint">PNG, JPG, atau JPEG (Max. 2MB)</p>
                  <input
                    type="file"
                    id="sampul_kategori"
                    @change="handleFileChange"
                    class="file-input"
                    accept="image/*" />
                </div>
                <div v-else class="image-preview-container">
                  <img
                    :src="previewImage"
                    alt="Preview Sampul"
                    class="preview-image" />
                  <button
                    type="button"
                    class="remove-image-btn"
                    @click="removeImage">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="$emit('close-form')">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Batal
            </button>
            <button type="submit" class="btn btn-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">
                <path d="m9 12 2 2 4-4"></path>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
              </svg>
              {{ isEditing ? "Update Kategori" : "Simpan Kategori" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({
  isEditing: {
    type: Boolean,
    required: true,
  },
  initialData: {
    type: Object,
    default: () => ({
      id_kategori_destinasi: null,
      nama_kategori: "",
      deskripsi_kategori: "",
      sampul_kategori: null,
    }),
  },
});

const emit = defineEmits(["close-form", "save-kategori"]);

const formData = ref({ ...props.initialData });
const file = ref(null);
const previewImage = ref(null);

const handleFileChange = (event) => {
  file.value = event.target.files[0];
  if (file.value) {
    previewImage.value = URL.createObjectURL(file.value);
  }
};

const handleDropFile = (event) => {
  event.preventDefault();
  const droppedFile = event.dataTransfer.files[0];
  if (droppedFile && droppedFile.type.startsWith("image/")) {
    file.value = droppedFile;
    previewImage.value = URL.createObjectURL(droppedFile);
  }
};

const removeImage = () => {
  if (previewImage.value) {
    URL.revokeObjectURL(previewImage.value);
  }
  file.value = null;
  previewImage.value = null;
};

watch(
  () => props.initialData,
  (newVal) => {
    formData.value = { ...newVal };
    // Perbarui pratinjau gambar saat data awal berubah
    if (newVal.sampul_kategori) {
      previewImage.value = `http://localhost:5000${newVal.sampul_kategori}`;
    } else {
      previewImage.value = null;
    }
  }
);

const submitForm = () => {
  // Gunakan FormData untuk mengirim data teks dan file
  const data = new FormData();
  data.append("nama_kategori", formData.value.nama_kategori);
  data.append("deskripsi_kategori", formData.value.deskripsi_kategori);
  if (file.value) {
    data.append("sampul_kategori", file.value);
  }
  emit("save-kategori", data);
};
</script>

<style scoped>
/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  width: min(600px, 90vw);
  max-height: 85vh;
  overflow: hidden;
  transform: scale(1);
  transition: all 0.3s ease;
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-title i {
  font-size: 1.1rem;
}

.close-modal-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
}

.close-modal-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  padding: 0;
  max-height: calc(85vh - 140px);
  overflow-y: auto;
}

.category-form {
  padding: 2rem;
}

.form-grid {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.form-label i {
  color: #667eea;
  font-size: 0.9rem;
}

.required {
  color: #ef4444;
  font-weight: bold;
}

.form-input,
.form-textarea {
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.875rem 1rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: #fafafa;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

/* File Upload Styles */
.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  background: #fafafa;
  transition: all 0.3s ease;
  cursor: pointer;
}

.file-upload-area:hover {
  border-color: #667eea;
  background: #f8faff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #9ca3af;
  transition: color 0.2s ease;
}

.file-upload-area:hover .upload-icon {
  color: #667eea;
}

.upload-text {
  font-size: 1rem;
  color: #374151;
  margin: 0;
}

.upload-link {
  color: #667eea;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
}

.upload-link:hover {
  color: #5a67d8;
}

.upload-hint {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.file-input {
  display: none;
}

.image-preview-container {
  position: relative;
  display: inline-block;
}

.preview-image {
  max-width: 200px;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-image-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.remove-image-btn svg {
  width: 14px;
  height: 14px;
}

/* Modal Footer */
.modal-footer {
  background: #f9fafb;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.btn svg {
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    width: 95vw;
    margin: 1rem;
    max-height: 90vh;
  }

  .modal-header,
  .category-form,
  .modal-footer {
    padding: 1rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn {
    justify-content: center;
  }
}
</style>
