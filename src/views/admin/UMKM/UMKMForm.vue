<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">
        {{ isEditing ? 'Edit UMKM' : 'Tambah UMKM Baru & Galeri' }}
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
            class="feather feather-store">
            <path d="M22 12l-2-2L12 2l-8 8l-2 2"></path>
            <path d="M5 22h14c1.1 0 2-.9 2-2V9.5L12 4L2 9.5V20c0 1.1.9 2 2 2z"></path>
          </svg>
          DETAIL UMKM
        </h4>
        <div class="form-grid">
          <div class="form-group">
            <label for="nama_umkm">Nama UMKM <span class="required">*</span></label>
            <input
              type="text"
              id="nama_umkm"
              v-model="formData.nama_umkm"
              class="form-input"
              required />
          </div>

          <div class="form-group">
            <label for="jenis_usaha">Jenis Usaha <span class="required">*</span></label>
            <input
              type="text"
              id="jenis_usaha"
              v-model="formData.jenis_usaha"
              class="form-input"
              required />
          </div>

          <div class="form-group">
            <label for="id_kategori_umkm">Kategori Utama <span class="required">*</span></label>
            <select id="id_kategori_umkm" v-model="formData.id_kategori_umkm" class="form-input" required>
              <option value="" disabled>Pilih Kategori</option>
              <option v-for="kategori in kategoriList" :key="kategori.id_kategori_umkm" :value="kategori.id_kategori_umkm">
                {{ kategori.nama_kategori }}
              </option>
            </select>
          </div>

          <div class="form-group span-2">
            <label for="deskripsi_umkm">Deskripsi UMKM <span class="required">*</span></label>
            <textarea
              id="deskripsi_umkm"
              v-model="formData.deskripsi_umkm"
              class="form-input"
              rows="5"
              required></textarea>
          </div>
          <div class="form-group">
            <label for="alamat_umkm">Alamat UMKM <span class="required">*</span></label>
            <textarea
              id="alamat_umkm"
              v-model="formData.alamat_umkm"
              class="form-input"
              rows="3"
              required></textarea>
          </div>
          <div class="form-group">
            <label for="kontak_umkm">Kontak UMKM</label>
            <input
              type="text"
              id="kontak_umkm"
              v-model="formData.kontak_umkm"
              class="form-input" />
          </div>
          <div class="form-group">
            <label for="website_umkm">Website UMKM</label>
            <input
              type="url"
              id="website_umkm"
              v-model="formData.website_umkm"
              class="form-input" />
          </div>
          <div class="form-group span-2">
            <label for="gambar_produk_utama"
              >Gambar Produk Utama <span class="required" v-if="!isEditing">*</span></label
            >
            <div
              :class="['file-drop-area', {'is-dragover': isGambarProdukUtamaDragover}]"
              @dragover.prevent="isGambarProdukUtamaDragover = true"
              @dragleave.prevent="isGambarProdukUtamaDragover = false"
              @drop="handleDropGambarProdukUtama">
              <div class="file-drop-content">
                <template v-if="!formData.preview_gambar_produk_utama">
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
                    <label for="gambar_produk_utama" class="file-link">browse</label>
                  </span>
                  <input
                    type="file"
                    id="gambar_produk_utama"
                    @change="handleGambarProdukUtamaUpload"
                    class="file-input"
                    accept="image/*"
                    :required="!isEditing" />
                </template>
                <template v-else>
                  <div class="image-preview-main">
                    <img
                      :src="formData.preview_gambar_produk_utama"
                      alt="Gambar Produk Utama Preview"
                      class="hero-image-preview" />
                    <button
                      type="button"
                      @click="removeGambarProdukUtama"
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
          </div>
        </div>
      </div>

      <hr class="form-divider" />

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
            <path
              d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          MEDIA GALERI
        </h4>
        <div class="form-group span-2">
          <label for="galeri-files"
            >Unggah File Galeri Baru (Gambar/Video)</label
          >
          <div
            :class="['file-drop-area', {'is-dragover': isGalleryDragover}]"
            @dragover.prevent="isGalleryDragover = true"
            @dragleave.prevent="isGalleryDragover = false"
            @drop="handleDropGalleryFiles">
            <div class="file-drop-content">
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
              <span class="file-message"
                >Drag & drop files here or
                <label for="galeri-files" class="file-link">browse</label> to
                upload</span
              >
              <input
                type="file"
                id="galeri-files"
                @change="handleGalleryFileUpload"
                class="file-input"
                multiple
                accept="image/*,video/*" />
            </div>
          </div>
        </div>

        <div
          class="gallery-preview-container"
          v-if="initialGalleryFiles.length > 0">
          <div
            v-for="file in initialGalleryFiles"
            :key="file.id_media_galeri"
            class="gallery-item-preview">
            <div class="thumbnail-wrapper">
              <img
                v-if="file.jenis_file === 'gambar'"
                :src="getMediaUrl(file.path_file)"
                class="thumbnail-image"
                alt="Galeri Media" />
              <video
                v-else-if="file.jenis_file === 'video'"
                :src="getMediaUrl(file.path_file)"
                class="thumbnail-image"
                controls></video>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-file-text placeholder-icon">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div class="file-info">
              <span
                class="file-name"
                :title="file.path_file.split('/').pop()"
                >{{ file.path_file.split("/").pop() }}</span
              >
            </div>
            <div class="item-details">
              <input
                type="text"
                v-model="file.deskripsi_file"
                placeholder="Deskripsi file"
                class="form-input small-input" />
              <input
                type="number"
                v-model="file.urutan_tampil"
                placeholder="Urutan"
                class="form-input small-input" />
              <button
                class="remove-file-btn"
                @click="removeExistingGalleryFile(file.id_media_galeri)"
                title="Hapus">
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
                  class="feather feather-trash-2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="gallery-preview-container" v-if="galleryFiles.length > 0">
          <div
            v-for="(file, index) in galleryFiles"
            :key="`new-${index}`"
            class="gallery-item-preview">
            <div class="thumbnail-wrapper">
              <img
                v-if="file.previewUrl"
                :src="file.previewUrl"
                alt="Preview Thumbnail"
                class="thumbnail-image" />
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-file-text placeholder-icon">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div class="file-info">
              <span class="file-name" :title="file.file?.name">{{
                file.file?.name
              }}</span>
            </div>
            <div class="item-details">
              <input
                type="text"
                v-model="file.deskripsi"
                placeholder="Deskripsi file"
                class="form-input small-input" />
              <input
                type="number"
                v-model="file.urutan"
                placeholder="Urutan"
                class="form-input small-input" />
              <button
                class="remove-file-btn"
                @click="removeGalleryFile(index)"
                title="Hapus">
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
                  class="feather feather-trash-2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="action-button cancel-button"
          @click="$emit('close-form')">
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
          Batal
        </button>
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
            class="feather feather-save">
            <path
              d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          {{ isEditing ? 'Simpan Perubahan' : 'Simpan UMKM & Galeri' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onUnmounted, nextTick, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  isEditing: Boolean,
  initialData: Object,
  kategoriList: Array, // Menerima prop kategori
  galleryList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close-form', 'save-umkm', 'update-umkm']);

const formData = ref({});
const galleryFiles = ref([]);
const initialGalleryFiles = ref([]);
const deletedGalleryIds = ref([]);
const isGambarProdukUtamaDragover = ref(false);
const isGalleryDragover = ref(false);

watch(() => props.initialData, (newVal) => {
  formData.value = { ...newVal };
  if (
    formData.value.gambar_produk_utama &&
    typeof formData.value.gambar_produk_utama === 'string'
  ) {
    formData.value.preview_gambar_produk_utama = `http://localhost:5000${formData.value.gambar_produk_utama}`;
  } else {
    formData.value.preview_gambar_produk_utama = null;
  }
  initialGalleryFiles.value = props.galleryList ? [...props.galleryList] : [];
  galleryFiles.value = [];
  deletedGalleryIds.value = [];
}, { immediate: true });

// Fungsi untuk Gambar Produk Utama
const handleGambarProdukUtamaUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.gambar_produk_utama = file;
    formData.value.preview_gambar_produk_utama = URL.createObjectURL(file);
  }
};
const handleDropGambarProdukUtama = (event) => {
  event.preventDefault();
  isGambarProdukUtamaDragover.value = false;
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    formData.value.gambar_produk_utama = file;
    formData.value.preview_gambar_produk_utama = URL.createObjectURL(file);
  }
};
const removeGambarProdukUtama = () => {
  if (formData.value.preview_gambar_produk_utama) {
    URL.revokeObjectURL(formData.value.preview_gambar_produk_utama);
  }
  formData.value.gambar_produk_utama = null;
  formData.value.preview_gambar_produk_utama = null;
};

// Fungsi untuk Galeri
const getMediaUrl = (path) => {
  return `http://localhost:5000${path}`;
};
const handleGalleryFileUpload = (event) => {
  const files = event.target.files;
  addGalleryFiles(files);
  event.target.value = '';
};
const handleDropGalleryFiles = (event) => {
  event.preventDefault();
  isGalleryDragover.value = false;
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
  if (confirm('Apakah Anda yakin ingin menghapus file galeri ini? Perubahan akan disimpan saat Anda memperbarui UMKM.')) {
    initialGalleryFiles.value = initialGalleryFiles.value.filter(file => file.id_media_galeri !== id);
    deletedGalleryIds.value.push(id);
  }
};

const submitForm = () => {
  const submitData = new FormData();
  for (const key in formData.value) {
    if (
      key !== 'preview_gambar_produk_utama' &&
      formData.value[key] !== null
    ) {
      submitData.append(key, formData.value[key]);
    }
  }

  // Penting: Memastikan id_kategori_umkm dikirim sebagai angka
  if (formData.value.id_kategori_umkm) {
    submitData.set('id_kategori_umkm', parseInt(formData.value.id_kategori_umkm));
  }

  if (props.isEditing) {
    initialGalleryFiles.value.forEach(item => {
      submitData.append('existing_gallery_updates', JSON.stringify({
        id_media_galeri: item.id_media_galeri,
        deskripsi_file: item.deskripsi_file,
        urutan_tampil: item.urutan_tampil
      }));
    });
    emit('update-umkm', submitData, galleryFiles.value, deletedGalleryIds.value);
  } else {
    emit('save-umkm', submitData, galleryFiles.value);
  }
};

onUnmounted(() => {
  if (formData.value.preview_gambar_produk_utama) {
    URL.revokeObjectURL(formData.value.preview_gambar_produk_utama);
  }
  galleryFiles.value.forEach(file => {
    if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
  });
});
</script>

<style scoped>
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
.gallery-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.gallery-item-preview {
  display: flex;
  flex-direction: column;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.gallery-item-preview:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.thumbnail-wrapper {
  width: 100%;
  height: 160px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-info {
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  font-size: 0.9rem;
  color: #343a40;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.file-name {
  display: block;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #ffffff;
}

.form-input.small-input {
  font-size: 0.9rem;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
}

.remove-file-btn {
  position: relative;
  margin-top: 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-file-btn:hover {
  background-color: #c82333;
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
}
</style>