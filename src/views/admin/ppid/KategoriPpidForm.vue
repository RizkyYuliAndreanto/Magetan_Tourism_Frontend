<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">
        {{ isEditing ? "Edit Kategori" : "Tambah Kategori Baru" }}
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
      <div class="form-section" v-if="!isEditing">
        <h4 class="section-title">
          <i class="fas fa-sitemap"></i>
          Jenis Kategori
        </h4>
        <div class="category-type-explanation">
          <p class="explanation-text">
            <strong>Kategori Induk:</strong> Kategori utama yang berdiri sendiri
            (contoh: Transparansi, Pelayanan Publik)<br />
            <strong>Sub-Kategori:</strong> Kategori turunan dari kategori induk
            (contoh: Laporan Keuangan dibawah Transparansi)
          </p>
        </div>
        <div class="radio-group">
          <label
            class="radio-option"
            :class="{ selected: !isCreatingSubcategory }">
            <input
              type="radio"
              v-model="isCreatingSubcategory"
              :value="false" />
            <div class="radio-content">
              <i class="fas fa-folder"></i>
              <span>Kategori Induk</span>
              <small>Kategori utama yang berdiri sendiri</small>
            </div>
          </label>
          <label
            class="radio-option"
            :class="{ selected: isCreatingSubcategory }">
            <input type="radio" v-model="isCreatingSubcategory" :value="true" />
            <div class="radio-content">
              <i class="fas fa-folder-open"></i>
              <span>Sub-Kategori</span>
              <small>Kategori turunan dari kategori induk</small>
            </div>
          </label>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="nama_kategori"
            >Nama Kategori <span class="required">*</span></label
          >
          <input
            type="text"
            id="nama_kategori"
            v-model="formData.nama_kategori"
            class="form-input"
            required />
        </div>

        <div
          v-if="
            isCreatingSubcategory ||
            (isEditing && formData.id_kategori_induk !== null)
          "
          class="form-group">
          <label for="id_kategori_induk"
            >Kategori Induk
            <span class="required" v-if="isCreatingSubcategory">*</span></label
          >
          <select
            id="id_kategori_induk"
            v-model="formData.id_kategori_induk"
            class="form-input"
            :required="isCreatingSubcategory">
            <option :value="null">-- Pilih Kategori Induk --</option>
            <option
              v-for="kategori in kategoriIndukList"
              :key="kategori.id_kategori_ppid"
              :value="kategori.id_kategori_ppid">
              {{ kategori.nama_kategori }}
            </option>
          </select>
        </div>

        <div class="form-group span-2">
          <label for="deskripsi_kategori">Deskripsi Kategori</label>
          <textarea
            id="deskripsi_kategori"
            v-model="formData.deskripsi_kategori"
            class="form-input"
            rows="3"></textarea>
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
          {{ isEditing ? "Simpan Perubahan" : "Simpan" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  isEditing: {
    type: Boolean,
    required: true,
  },
  initialData: {
    type: Object,
    default: () => ({
      id_kategori_ppid: null,
      nama_kategori: "",
      deskripsi_kategori: "",
      id_kategori_induk: null,
    }),
  },
  kategoriIndukList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["close-form", "save-kategori", "update-kategori"]);

const formData = ref({});
const isCreatingSubcategory = ref(false);

watch(
  () => props.initialData,
  (newVal) => {
    formData.value = { ...newVal };
    isCreatingSubcategory.value = !!formData.value.id_kategori_induk;
  },
  { immediate: true }
);

watch(isCreatingSubcategory, (newVal) => {
  if (!newVal) {
    formData.value.id_kategori_induk = null;
  }
});

const submitForm = () => {
  // Validasi untuk sub-kategori
  if (isCreatingSubcategory.value && !formData.value.id_kategori_induk) {
    alert("Silakan pilih kategori induk untuk sub-kategori.");
    return;
  }

  const submitData = { ...formData.value };

  if (!isCreatingSubcategory.value) {
    submitData.id_kategori_induk = null;
  }
  delete submitData.level_kategori;

  if (props.isEditing) {
    emit("update-kategori", submitData);
  } else {
    emit("save-kategori", submitData);
  }
};
</script>

<style scoped>
/* =========== Gaya CSS yang diselaraskan dengan AkomodasiForm.vue =========== */
.form-card {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  border: 1px solid #f0f4f8;
  position: relative;
  z-index: 1002;
  max-width: 100%;
  overflow: visible;
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

.category-type-explanation {
  background-color: #e7f3ff;
  border-left: 4px solid #007bff;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.explanation-text {
  color: #495057;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

.radio-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.radio-option {
  display: block;
  padding: 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #ffffff;
}

.radio-option:hover {
  border-color: #007bff;
  background-color: #f8f9ff;
}

.radio-option.selected {
  border-color: #007bff;
  background-color: #e7f3ff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

.radio-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.radio-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.radio-content i {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 0.5rem;
}

.radio-content span {
  font-weight: 600;
  color: #212529;
  font-size: 1rem;
}

.radio-content small {
  color: #6c757d;
  font-size: 0.85rem;
  text-align: center;
  line-height: 1.3;
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
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
