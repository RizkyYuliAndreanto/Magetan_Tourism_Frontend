<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">
        {{ isEditing ? 'Edit Konten PPID' : 'Tambah Konten PPID Baru' }}
      </h3>
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
          class="feather feather-x"
        >
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
            class="feather feather-file-text"
          >
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
            <input
              type="text"
              id="judul_konten"
              v-model="formData.judul_konten"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label for="id_kategori_ppid">Kategori PPID <span class="required">*</span></label>
            <select
              id="id_kategori_ppid"
              v-model="formData.id_kategori_ppid"
              class="form-input"
              required
            >
              <option value="">Pilih Kategori</option>
              <option
                v-for="kategori in kategoriList"
                :key="kategori.id_kategori_ppid"
                :value="kategori.id_kategori_ppid"
              >
                {{ kategori.nama_kategori }}
              </option>
            </select>
          </div>
          <div class="form-group span-2">
            <label for="deskripsi_konten">Deskripsi Konten</label>
            <textarea
              id="deskripsi_konten"
              v-model="formData.deskripsi_konten"
              class="form-input"
              rows="5"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="file_pdf_ppid">File PDF Utama <span class="required" v-if="!isEditing">*</span></label>
            <div
              :class="['file-drop-area', {'is-dragover': isPdfDragover}]"
              @dragover.prevent="isPdfDragover = true"
              @dragleave.prevent="isPdfDragover = false"
              @drop="handleDropPdfFile"
            >
              <div class="file-drop-content">
                <template v-if="!formData.file_pdf_file && !formData.file_pdf_path">
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
                    class="feather feather-upload-cloud file-icon"
                  >
                    <polyline points="16 16 12 12 8 16"></polyline>
                    <line x1="12" y1="12" x2="12" y2="21"></line>
                    <path
                      d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"
                    ></path>
                  </svg>
                  <span class="file-message">
                    Drag & drop file here or
                    <label for="file_pdf_ppid" class="file-link">browse</label> to upload
                  </span>
                  <input
                    type="file"
                    id="file_pdf_ppid"
                    @change="handlePdfUpload"
                    class="file-input"
                    accept="application/pdf"
                    :required="!isEditing && !formData.file_pdf_path"
                  />
                </template>
                <template v-else>
                  <div class="file-preview-main">
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
                      class="feather feather-file-text file-icon large-icon"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span class="file-message file-name-display">{{
                      formData.file_pdf_file ? formData.file_pdf_file.name : formData.file_pdf_path.split('/').pop()
                    }}</span>
                    <button
                      type="button"
                      @click="removePdfFile"
                      class="cancel-image-btn"
                      title="Batal"
                    >
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
                        class="feather feather-x-square"
                      >
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
            <p
              v-if="isEditing && formData.file_pdf_path"
              class="mt-2 text-sm text-gray-500"
            >
              File saat ini:
              <a :href="getFilePath(formData.file_pdf_path)" target="_blank">{{
                formData.file_pdf_path.split("/").pop()
              }}</a>
            </p>
          </div>
          <div class="form-group">
            <label for="gambar_sampul_ppid">Gambar Sampul <span class="required" v-if="!isEditing">*</span></label>
            <div
              :class="['file-drop-area', {'is-dragover': isSampulDragover}]"
              @dragover.prevent="isSampulDragover = true"
              @dragleave.prevent="isSampulDragover = false"
              @drop="handleDropSampulFile"
            >
              <div class="file-drop-content">
                <template v-if="!formData.gambar_sampul_file && !formData.gambar_sampul">
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
                    class="feather feather-upload-cloud file-icon"
                  >
                    <polyline points="16 16 12 12 8 16"></polyline>
                    <line x1="12" y1="12" x2="12" y2="21"></line>
                    <path
                      d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"
                    ></path>
                  </svg>
                  <span class="file-message">
                    Drag & drop file here or
                    <label for="gambar_sampul_ppid" class="file-link">browse</label> to upload
                  </span>
                  <input
                    type="file"
                    id="gambar_sampul_ppid"
                    @change="handleSampulUpload"
                    class="file-input"
                    accept="image/*"
                    :required="!isEditing && !formData.gambar_sampul"
                  />
                </template>
                <template v-else>
                  <div class="image-preview-main">
                    <img
                      :src="formData.gambar_sampul_file ? getFileUrl(formData.gambar_sampul_file) : getFilePath(formData.gambar_sampul)"
                      alt="Sampul Image Preview"
                      class="hero-image-preview"
                    />
                    <button
                      type="button"
                      @click="removeSampulFile"
                      class="cancel-image-btn"
                      title="Batal"
                    >
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
                        class="feather feather-x-square"
                      >
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
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="action-button save-button">
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
            class="feather feather-save"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          {{ isEditing ? 'Simpan Perubahan' : 'Simpan Konten' }}
        </button>
        <button
          type="button"
          class="action-button cancel-button"
          @click="$emit('close-form')"
        >
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
            class="feather feather-x"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Batal
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onUnmounted } from 'vue';

const props = defineProps({
  isEditing: Boolean,
  initialData: Object,
  kategoriList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['close-form', 'save-konten', 'update-konten']);

const formData = ref({});
const isPdfDragover = ref(false);
const isSampulDragover = ref(false);

watch(() => props.initialData, (newVal) => {
  formData.value = newVal ? { ...newVal } : {};
}, { immediate: true, deep: true });

const getFilePath = (path) => {
  return `http://localhost:5000${path}`;
};
const getFileUrl = (file) => {
  return URL.createObjectURL(file);
};

// Logika untuk File PDF Utama
const handlePdfUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    formData.value.file_pdf_file = file;
    if (formData.value.file_pdf_path) {
      formData.value.file_pdf_path = null;
    }
  } else {
    alert("Hanya file PDF yang diizinkan untuk File PDF Utama.");
    event.target.value = null;
  }
};
const handleDropPdfFile = (event) => {
  event.preventDefault();
  isPdfDragover.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    formData.value.file_pdf_file = file;
    if (formData.value.file_pdf_path) {
      formData.value.file_pdf_path = null;
    }
  } else {
    alert("Hanya file PDF yang diizinkan untuk File PDF Utama.");
  }
};
const removePdfFile = () => {
  if (formData.value.file_pdf_file) {
    URL.revokeObjectURL(getFileUrl(formData.value.file_pdf_file));
  }
  formData.value.file_pdf_file = null;
  // Jika ini mode edit, kita biarkan file_pdf_path tetap ada sampai form di-submit
};

// Logika untuk Gambar Sampul
const handleSampulUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    formData.value.gambar_sampul_file = file;
    if (formData.value.gambar_sampul) {
      formData.value.gambar_sampul = null;
    }
  } else {
    alert("Hanya file gambar yang diizinkan untuk Gambar Sampul.");
    event.target.value = null;
  }
};
const handleDropSampulFile = (event) => {
  event.preventDefault();
  isSampulDragover.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    formData.value.gambar_sampul_file = file;
    if (formData.value.gambar_sampul) {
      formData.value.gambar_sampul = null;
    }
  } else {
    alert("Hanya file gambar yang diizinkan untuk Gambar Sampul.");
  }
};
const removeSampulFile = () => {
  if (formData.value.gambar_sampul_file) {
    URL.revokeObjectURL(getFileUrl(formData.value.gambar_sampul_file));
  }
  formData.value.gambar_sampul_file = null;
};

onUnmounted(() => {
  if (formData.value.file_pdf_file) {
    URL.revokeObjectURL(getFileUrl(formData.value.file_pdf_file));
  }
  if (formData.value.gambar_sampul_file) {
    URL.revokeObjectURL(getFileUrl(formData.value.gambar_sampul_file));
  }
});

const submitForm = () => {
  const submitData = new FormData();

  // Tambahkan field teks secara eksplisit
  if (formData.value.judul_konten) submitData.append('judul_konten', formData.value.judul_konten);
  if (formData.value.deskripsi_konten) submitData.append('deskripsi_konten', formData.value.deskripsi_konten);
  if (formData.value.id_kategori_ppid) submitData.append('id_kategori_ppid', formData.value.id_kategori_ppid);

  // Tambahkan file hanya jika ada
  if (formData.value.file_pdf_file) {
    submitData.append('file_pdf_ppid', formData.value.file_pdf_file);
  } else if (props.isEditing && formData.value.file_pdf_path) {
    // Jika tidak ada file baru diunggah, kirim kembali path yang sudah ada
    submitData.append('file_pdf_path', formData.value.file_pdf_path);
  }
  if (formData.value.gambar_sampul_file) {
    submitData.append('gambar_sampul_ppid', formData.value.gambar_sampul_file);
  } else if (props.isEditing && formData.value.gambar_sampul) {
    // Jika tidak ada file baru diunggah, kirim kembali path yang sudah ada
    submitData.append('gambar_sampul', formData.value.gambar_sampul);
  }

  if (props.isEditing) {
    if (formData.value.id_konten_ppid) submitData.append('id_konten_ppid', formData.value.id_konten_ppid);
    emit('update-konten', submitData);
  } else {
    emit('save-konten', submitData);
  }
};
</script>

<style scoped>
/* =========== Gaya CSS yang diselaraskan dengan EventForm.vue =========== */
/* Core Styling & Layout */
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

.image-preview-main,
.file-preview-main {
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
}
</style>