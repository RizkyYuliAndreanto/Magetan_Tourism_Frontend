<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">{{ isEditing ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru' }}</h3>
      <button class="close-form-btn" @click="$emit('close-form')">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-grid">
        <div class="form-group span-2">
          <label for="judul_pengumuman">Judul Pengumuman</label>
          <input type="text" id="judul_pengumuman" v-model="formData.judul_pengumuman" class="form-input" required>
        </div>
        <div class="form-group span-2">
          <label for="isi_pengumuman">Isi Pengumuman</label>
          <textarea id="isi_pengumuman" v-model="formData.isi_pengumuman" class="form-input" rows="5"></textarea>
        </div>
        <div class="form-group">
          <label for="sampul_pengumuman">Sampul Pengumuman (Gambar)</label>
          <input type="file" id="sampul_pengumuman" @change="handleFileUpload('sampul_pengumuman', $event)" class="form-input-file" :required="!isEditing">
          <p v-if="isEditing && formData.sampul_pengumuman" class="mt-2 text-sm text-gray-500">
            Gambar saat ini: <a :href="getFilePath(formData.sampul_pengumuman)" target="_blank" class="text-blue-500">{{ formData.sampul_pengumuman.split('/').pop() }}</a>
          </p>
        </div>
        <div class="form-group">
          <label for="file_pdf_pengumuman">File PDF Pengumuman</label>
          <input type="file" id="file_pdf_pengumuman" @change="handleFileUpload('file_pdf_pengumuman', $event)" class="form-input-file" :required="!isEditing">
          <p v-if="isEditing && formData.file_pdf_path" class="mt-2 text-sm text-gray-500">
            File saat ini: <a :href="getFilePath(formData.file_pdf_path)" target="_blank" class="text-blue-500">{{ formData.file_pdf_path.split('/').pop() }}</a>
          </p>
        </div>
      </div>
      <div class="form-actions">
        <button type="submit" class="action-button save-button">
          <i class="fas fa-save"></i> Simpan
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
  initialData: Object,
});

const emit = defineEmits(['close-form', 'save-pengumuman', 'update-pengumuman']);

const formData = ref({});

watch(() => props.initialData, (newVal) => {
  formData.value = { ...newVal };
}, { immediate: true });

const handleFileUpload = (field, event) => {
  if (field === 'file_pdf_pengumuman') {
    formData.value.file_pdf_pengumuman = event.target.files[0];
  } else if (field === 'sampul_pengumuman') {
    formData.value.sampul_pengumuman = event.target.files[0];
  }
};

const getFilePath = (path) => {
  return `http://localhost:5000${path}`;
};

const submitForm = () => {
  const submitData = new FormData();
  for (const key in formData.value) {
    // Only append data that is not null and is not the path string for files
    if (formData.value[key] !== null && typeof formData.value[key] !== 'string') {
      submitData.append(key, formData.value[key]);
    } else if (key === 'judul_pengumuman' || key === 'isi_pengumuman') {
      submitData.append(key, formData.value[key]);
    }
  }
  
  if (props.isEditing) {
    // Append the ID for updates
    submitData.append('id_pengumuman', formData.value.id_pengumuman);
    emit('update-pengumuman', submitData);
  } else {
    emit('save-pengumuman', submitData);
  }
};
</script>

<style scoped>
/* No changes to styles */
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
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.2rem;
}
.form-group.span-2 {
  grid-column: span 2;
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
.form-input-file {
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;
  color: #343a40;
  font-size: 0.95rem;
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
</style>