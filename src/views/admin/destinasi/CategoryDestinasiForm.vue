<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">
        {{ isEditing ? "Edit Kategori" : "Tambah Kategori Baru" }}
      </h3>
      <button class="close-form-btn" @click="$emit('close-form')">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label for="nama_kategori">Nama Kategori</label>
        <input
          type="text"
          id="nama_kategori"
          v-model="formData.nama_kategori"
          class="form-input"
          required />
      </div>
      <div class="form-group">
        <label for="deskripsi_kategori">Deskripsi Kategori</label>
        <textarea
          id="deskripsi_kategori"
          v-model="formData.deskripsi_kategori"
          class="form-input"
          rows="3"></textarea>
      </div>
      <div class="form-group">
        <label for="sampul_kategori">Sampul Kategori</label>
        <div class="file-drop-area" @dragover.prevent @drop="handleDropFile">
          <div class="file-drop-content">
            <template v-if="!previewImage">
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
                <polyline points="16 16 12 12 8 16"></polyline>
              </svg>
              <span class="file-message"
                >Drag file ke sini atau
                <label for="sampul_kategori" class="file-link"
                  >browse</label
                ></span
              >
              <input
                type="file"
                id="sampul_kategori"
                @change="handleFileChange"
                class="file-input"
                accept="image/*" />
            </template>
            <template v-else>
              <div class="image-preview-main">
                <img
                  :src="previewImage"
                  alt="Sampul Kategori"
                  class="hero-image-preview" />
                <button
                  type="button"
                  class="cancel-image-btn"
                  @click="removeImage">
                  Hapus Gambar
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="action-button save-button">Simpan</button>
        <button
          type="button"
          class="action-button cancel-button"
          @click="$emit('close-form')">
          Batal
        </button>
      </div>
    </form>
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
  width: 100%;
  height: 100%;
}
.file-icon {
  width: 2rem;
  height: 2rem;
  color: #2563eb;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.hero-image-preview {
  max-width: 320px;
  max-height: 220px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 123, 255, 0.08);
  background: #fff;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
.cancel-image-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #6c757d;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
  margin-top: 0.5rem;
}
.cancel-image-btn:hover {
  background: #5a6268;
}
</style>
