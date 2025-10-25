<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">
        {{ isEditing ? "Edit Berita" : "Tambah Berita Baru & Galeri" }}
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
            class="feather feather-file-text">
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Detail Berita
        </h4>
        <div class="form-grid">
          <div class="form-group span-2">
            <label for="judul"
              >Judul Berita <span class="required">*</span></label
            >
            <input
              type="text"
              id="judul"
              v-model="formData.judul"
              class="form-input"
              placeholder="Masukkan judul berita"
              required />
          </div>
          <div class="form-group">
            <label for="id_kategori"
              >Kategori <span class="required">*</span></label
            >
            <select
              id="id_kategori"
              v-model="formData.id_kategori"
              class="form-input"
              required>
              <option value="">Pilih Kategori</option>
              <option
                v-for="kategori in kategoriList"
                :key="kategori.id_kategori_berita || kategori.id_kategori"
                :value="kategori.id_kategori_berita || kategori.id_kategori">
                {{ kategori.nama_kategori }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="tanggal_publikasi"
              >Tanggal Publikasi <span class="required">*</span></label
            >
            <input
              type="datetime-local"
              id="tanggal_publikasi"
              v-model="formData.tanggal_publikasi"
              class="form-input"
              required />
          </div>
          <div class="form-group span-2">
            <label for="isi_berita"
              >Isi Berita <span class="required">*</span></label
            >
            <textarea
              id="isi_berita"
              v-model="formData.isi_berita"
              class="form-input"
              placeholder="Masukkan isi berita"
              rows="8"
              required></textarea>
          </div>
          <div class="form-group span-2">
            <label for="gambar_hero_berita">Gambar Hero Berita</label>
            <div
              class="file-drop-area"
              @dragover.prevent
              @drop="handleDropHeroFile">
              <div class="file-drop-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="file-icon">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21,15 16,10 5,21"></polyline>
                </svg>
                <p class="file-message">
                  Drag & drop gambar di sini, atau
                  <span class="file-link" @click="$refs.heroFileInput.click()"
                    >pilih file</span
                  >
                </p>
              </div>
              <input
                ref="heroFileInput"
                type="file"
                accept="image/*"
                @change="handleHeroFileUpload"
                class="file-input"
                style="display: none" />
            </div>
            <div
              v-if="formData.preview_gambar_hero"
              class="image-preview-container">
              <div class="image-preview-inner">
                <img
                  :src="formData.preview_gambar_hero"
                  alt="Preview"
                  class="hero-image-preview" />
                <div class="image-preview-actions">
                  <button
                    type="button"
                    class="remove-image-btn"
                    @click="removeHeroImage">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="feather">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path
                        d="M19,6V20A2,2,0,0,1,17,22H7A2,2,0,0,1,5,20V6M8,6V4A2,2,0,0,1,10,2H14A2,2,0,0,1,16,4V6"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Hapus
                  </button>
                </div>
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
          Media Galeri
        </h4>
        <div class="form-group span-2">
          <label for="galeri-files"
            >Unggah File Galeri (Gambar/Video)
            <span class="required" v-if="!isEditing">*</span></label
          >
          <div
            class="file-drop-area"
            @dragover.prevent
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
                <span class="file-link" @click="$refs.galleryFileInput.click()"
                  >browse</span
                >
                to upload</span
              >
              <input
                ref="galleryFileInput"
                type="file"
                id="galeri-files"
                @change="handleGalleryFileUpload"
                class="file-input"
                multiple
                accept="image/*,video/*"
                style="display: none" />
            </div>
          </div>
        </div>
        <div
          class="gallery-preview-container"
          v-if="galleryFiles.length > 0 || initialGalleryFiles.length > 0">
          <div
            v-for="file in initialGalleryFiles"
            :key="file.id_media_galeri"
            class="gallery-item-preview">
            <div class="thumbnail-wrapper">
              <img
                v-if="file.jenis_file === 'gambar'"
                :src="`http://localhost:5000${file.path_file}`"
                alt="Preview Thumbnail"
                class="thumbnail-image" />
              <video
                v-else-if="file.jenis_file === 'video'"
                :src="`http://localhost:5000${file.path_file}`"
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
                type="button"
                @click="removeExistingGalleryFile(file.id_media_galeri)"
                class="remove-file-btn"
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
                type="button"
                @click="removeGalleryFile(index)"
                class="remove-file-btn"
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
          {{ isEditing ? "Simpan Perubahan" : "Simpan Berita & Galeri" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";

const props = defineProps({
  isEditing: {
    type: Boolean,
    required: true,
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
  kategoriList: {
    type: Array,
    required: true,
  },
  galleryList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close-form", "save-berita", "update-berita"]);

const formData = ref({});
const galleryFiles = ref([]);
const initialGalleryFiles = ref([]);
const deletedGalleryIds = ref([]);

watch(
  () => props.initialData,
  (newVal) => {
    formData.value = { ...newVal };
    initialGalleryFiles.value = props.galleryList ? [...props.galleryList] : [];
    galleryFiles.value = [];
    deletedGalleryIds.value = [];

    // DEBUG: Cek struktur data gallery
    console.log(
      "🔍 [NewsForm] Gallery data structure:",
      initialGalleryFiles.value[0]
    );
    if (initialGalleryFiles.value.length > 0) {
      console.log(
        "🔍 [NewsForm] Available keys:",
        Object.keys(initialGalleryFiles.value[0])
      );
    }
  },
  { immediate: true }
);

const handleHeroFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.gambar_hero_berita = file;
    formData.value.preview_gambar_hero = URL.createObjectURL(file);
  }
};

const handleDropHeroFile = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    formData.value.gambar_hero_berita = file;
    formData.value.preview_gambar_hero = URL.createObjectURL(file);
  }
};

const removeHeroImage = () => {
  formData.value.gambar_hero_berita = null;
  formData.value.preview_gambar_hero = null;
};

const handleGalleryFileUpload = (event) => {
  const files = event.target.files;
  addGalleryFiles(files);
  event.target.value = "";
};

const handleDropGalleryFiles = (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  addGalleryFiles(files);
};

const addGalleryFiles = (files) => {
  for (const file of files) {
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      let previewUrl = null;
      if (file.type.startsWith("image/")) {
        previewUrl = URL.createObjectURL(file);
      } else if (file.type.startsWith("video/")) {
        previewUrl = URL.createObjectURL(file);
      }

      galleryFiles.value.push({
        file,
        deskripsi: "",
        urutan:
          galleryFiles.value.length + initialGalleryFiles.value.length + 1,
        jenis_file: file.type.startsWith("image/") ? "gambar" : "video",
        previewUrl,
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
  console.log("🗑️ [NewsForm] removeExistingGalleryFile called with ID:", id);
  console.log("🗑️ [NewsForm] ID type:", typeof id);
  console.log("🗑️ [NewsForm] Current deletedGalleryIds before:", [
    ...deletedGalleryIds.value,
  ]);
  console.log(
    "🗑️ [NewsForm] Current initialGalleryFiles before:",
    initialGalleryFiles.value.length
  );

  // DEBUG: Cek semua gallery files dan field ID mereka
  initialGalleryFiles.value.forEach((file, index) => {
    console.log(`🔍 Gallery ${index}:`, {
      id_media_galeri: file.id_media_galeri,
      id: file.id,
      path_file: file.path_file,
    });
  });

  if (
    confirm(
      "Apakah Anda yakin ingin menghapus file galeri ini? Perubahan akan disimpan saat Anda memperbarui berita."
    )
  ) {
    initialGalleryFiles.value = initialGalleryFiles.value.filter(
      (file) => file.id_media_galeri !== id
    );
    deletedGalleryIds.value.push(id);

    console.log("✅ [NewsForm] Media marked for deletion. ID added:", id);
    console.log("✅ [NewsForm] Current deletedGalleryIds after:", [
      ...deletedGalleryIds.value,
    ]);
    console.log(
      "✅ [NewsForm] Remaining initialGalleryFiles:",
      initialGalleryFiles.value.length
    );

    // TEMPORARY DEBUG ALERT - Hapus setelah selesai debugging
    alert(
      `DEBUG: Media ID ${id} (type: ${typeof id}) ditambahkan ke delete list. Total yang akan dihapus: ${
        deletedGalleryIds.value.length
      }`
    );
  } else {
    console.log("❌ [NewsForm] User cancelled deletion");
  }
};

const submitForm = () => {
  // Validate required fields
  if (
    !formData.value.judul ||
    !formData.value.isi_berita ||
    !formData.value.id_kategori ||
    !formData.value.tanggal_publikasi
  ) {
    alert("Semua field yang required harus diisi!");
    return;
  }

  // Debug logging
  console.log("Form data before submit:", formData.value);
  console.log(
    "id_kategori value:",
    formData.value.id_kategori,
    typeof formData.value.id_kategori
  );

  const submitData = new FormData();

  // Add only the fields that exist in the backend model
  submitData.append("judul", formData.value.judul);
  submitData.append("isi_berita", formData.value.isi_berita);
  submitData.append("tanggal_publikasi", formData.value.tanggal_publikasi);
  submitData.append("id_kategori", parseInt(formData.value.id_kategori));

  // Debug FormData
  for (let [key, value] of submitData.entries()) {
    console.log(key, value);
  }

  // Add hero image if exists
  if (formData.value.gambar_hero_berita instanceof File) {
    submitData.append("gambar_hero_berita", formData.value.gambar_hero_berita);
  }

  // Add id_berita for updates
  if (props.isEditing && formData.value.id_berita) {
    submitData.append("id_berita", formData.value.id_berita);
  }

  if (props.isEditing) {
    initialGalleryFiles.value.forEach((item) => {
      submitData.append(
        "existing_gallery_updates",
        JSON.stringify({
          id_media_galeri: item.id_media_galeri,
          deskripsi_file: item.deskripsi_file,
          urutan_tampil: item.urutan_tampil,
        })
      );
    });

    console.log("📤 [NewsForm] Emitting update-berita with:");
    console.log(
      "📤 [NewsForm] - New gallery files:",
      galleryFiles.value.length
    );
    console.log("📤 [NewsForm] - Deleted gallery IDs:", [
      ...deletedGalleryIds.value,
    ]);
    console.log(
      "📤 [NewsForm] - Remaining initial gallery files:",
      initialGalleryFiles.value.length
    );

    // TEMPORARY DEBUG ALERT - Hapus setelah selesai debugging
    alert(
      `DEBUG SUBMIT: Akan menghapus ${
        deletedGalleryIds.value.length
      } media galeri dengan IDs: [${deletedGalleryIds.value.join(", ")}]`
    );

    emit(
      "update-berita",
      submitData,
      galleryFiles.value,
      deletedGalleryIds.value
    );
  } else {
    emit("save-berita", submitData, galleryFiles.value);
  }
};
</script>

<style scoped>
/* Gaya CSS yang sama seperti sebelumnya */
.form-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.close-form-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: color 0.2s;
}

.close-form-btn:hover {
  color: #ef4444;
}

.form-container {
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
}

.required {
  color: #ef4444;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.form-group.span-2 {
  grid-column: span 2;
}

@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-group.span-2 {
    grid-column: span 1;
  }
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #1e293b;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

textarea.form-input {
  min-height: 100px;
  resize: vertical;
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
}

.file-drop-area:hover {
  border-color: #2563eb;
  background-color: #f0f7ff;
}

.file-drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Updated style for SVG icons to match font-awesome */
.file-icon,
.feather,
.placeholder-icon {
  width: 2rem;
  height: 2rem;
  color: #2563eb;
}

.file-message {
  font-size: 0.875rem;
  color: #64748b;
}

.file-link {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
}

.file-input {
  display: none !important;
  position: absolute;
  top: -9999px;
  left: -9999px;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.image-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 0;
  background: #f8fafc;
  border-radius: 12px;
  margin-top: 1rem;
}

.image-preview-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.hero-image-preview {
  max-width: 320px;
  max-height: 220px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(37, 99, 235, 0.08);
  background: #fff;
  object-fit: contain;
  display: block;
}

.image-preview-actions {
  display: flex;
  gap: 0.75rem;
}

.remove-image-btn,
.cancel-image-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.remove-image-btn .feather,
.cancel-image-btn .feather {
  width: 1rem;
  height: 1rem;
  stroke: white;
}

.cancel-image-btn {
  background: #64748b;
}

.remove-image-btn:hover {
  background: #dc2626;
}

.cancel-image-btn:hover {
  background: #475569;
}

.image-preview {
  margin-top: 1rem;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
}

.remove-image-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
}

.gallery-preview-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.gallery-item-preview {
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  min-width: 0;
  box-shadow: 0 1px 4px rgba(37, 99, 235, 0.06);
  transition: box-shadow 0.2s;
}

.gallery-item-preview:hover {
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.12);
}

.thumbnail-wrapper {
  width: 100%;
  height: 140px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 0;
}

.thumbnail-wrapper video.thumbnail-image {
  background: #000;
}

.placeholder-icon {
  font-size: 2.5rem;
  color: #64748b;
}

.thumbnail-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(37, 99, 235, 0.85);
  color: #fff;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 0 0 8px 8px;
  text-align: left;
}

.file-info {
  padding: 6px 10px 0 10px;
  background: #fff;
  font-size: 0.8rem;
  color: #2563eb;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid #f0f0f0;
}

.file-name {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #ffffff;
  position: relative;
}

.remove-file-btn {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-file-btn .feather {
  width: 1rem;
  height: 1rem;
  stroke: white;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.save-button {
  background-color: #2563eb;
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #3b82f6;
}

.save-button .feather {
  width: 1rem;
  height: 1rem;
  stroke: white;
}

.cancel-button {
  background-color: #64748b;
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

@media (max-width: 600px) {
  .gallery-preview-container {
    grid-template-columns: repeat(2, 1fr);
  }
  .thumbnail-wrapper {
    height: 100px;
  }
}
</style>
