<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">{{ isEditing ? 'Edit Anggota' : 'Tambah Anggota Baru' }}</h3>
      <button class="close-form-btn" @click="$emit('close-form')">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-grid">
        <div class="form-group">
          <label for="nama_anggota">Nama Anggota <span class="required">*</span></label>
          <input type="text" id="nama_anggota" v-model="formData.nama_anggota" class="form-input" required>
        </div>
        <div class="form-group">
          <label for="jabatan">Jabatan <span class="required">*</span></label>
          <input type="text" id="jabatan" v-model="formData.jabatan" class="form-input" required>
        </div>
        <div class="form-group span-2">
          <label for="deskripsi_tugas">Deskripsi Tugas</label>
          <textarea id="deskripsi_tugas" v-model="formData.deskripsi_tugas" class="form-input" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label for="urutan_tampilan">Urutan Tampilan</label>
          <input type="number" id="urutan_tampilan" v-model="formData.urutan_tampilan" class="form-input" min="0">
        </div>
        <div class="form-group">
          <label for="foto_anggota">Foto Anggota</label>
          <input type="file" id="foto_anggota" @change="handleFileUpload" class="form-input-file">
          <p v-if="formData.foto_anggota" class="mt-2 text-sm text-gray-500">Foto saat ini: {{ formData.foto_anggota }}</p>
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

const emit = defineEmits(['close-form', 'save-anggota', 'update-anggota']);

const formData = ref({});

watch(() => props.initialData, (newVal) => {
  formData.value = { ...newVal };
}, { immediate: true });

const handleFileUpload = (event) => {
  formData.value.foto_anggota = event.target.files[0];
};

const submitForm = () => {
  const submitData = new FormData();
  for (const key in formData.value) {
    if (formData.value[key] !== null) {
      submitData.append(key, formData.value[key]);
    }
  }

  if (props.isEditing) {
    emit('update-anggota', submitData);
  } else {
    emit('save-anggota', submitData);
  }
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