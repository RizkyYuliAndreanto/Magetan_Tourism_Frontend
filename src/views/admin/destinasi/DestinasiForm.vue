<template>
  <div class="form-card">
    <div class="form-header">
      <h3 class="form-title">{{ isEditing ? 'Edit Destinasi' : 'Tambah Destinasi Baru & Galeri' }}</h3>
      <button class="close-form-btn" @click="$emit('close-form')">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="form-section">
        <h4 class="section-title"><i class="fas fa-map-marker-alt"></i> Detail Destinasi</h4>
        <div class="form-grid">
          <div class="form-group">
            <label for="nama_destinasi">Nama Destinasi</label>
            <input type="text" id="nama_destinasi" v-model="formData.nama_destinasi" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="id_kategori_destinasi">Kategori</label>
            <select id="id_kategori_destinasi" v-model="formData.id_kategori_destinasi" class="form-input" required>
              <option value="">Pilih Kategori</option>
              <option v-for="kategori in kategoriList" :key="kategori.id_kategori_destinasi" :value="kategori.id_kategori_destinasi">
                {{ kategori.nama_kategori }}
              </option>
            </select>
          </div>
          <div class="form-group span-2">
            <label for="deskripsi_destinasi">Deskripsi</label>
            <textarea id="deskripsi_destinasi" v-model="formData.deskripsi_destinasi" class="form-input" rows="5" required></textarea>
          </div>
          <div class="form-group span-2">
            <label for="alamat">Alamat</label>
            <textarea id="alamat" v-model="formData.alamat" class="form-input" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="jam_operasional">Jam Operasional</label>
            <input type="text" id="jam_operasional" v-model="formData.jam_operasional" class="form-input">
          </div>
          <div class="form-group">
            <label for="harga_tiket">Harga Tiket</label>
            <input type="number" id="harga_tiket" v-model="formData.harga_tiket" class="form-input" step="0.01">
          </div>
          <div class="form-group span-2">
            <label for="gambar_utama">Gambar Utama</label>
            <input type="file" id="gambar_utama" @change="handleFileUpload" class="form-input-file">
            <p v-if="formData.gambar_utama" class="mt-2 text-sm text-gray-500">Gambar saat ini: {{ formData.gambar_utama }}</p>
          </div>
          <div class="form-group">
            <label for="koordinat_lokasi">Koordinat Lokasi (Otomatis dari Peta)</label>
            <input type="text" id="koordinat_lokasi" v-model="formData.koordinat_lokasi" class="form-input" readonly>
          </div>
          <div class="form-group span-2">
            <label>Pilih Lokasi di Peta</label>
            <div id="map" style="height: 400px; border-radius: 8px; border: 1px solid #ddd;"></div>
          </div>
        </div>
      </div>
      
      <hr class="form-divider">
      
      <div class="form-section">
        <h4 class="section-title"><i class="fas fa-camera"></i> Media Galeri</h4>
        <div class="gallery-preview-container" v-if="isEditing && initialGalleryFiles.length > 0">
          <div v-for="file in initialGalleryFiles" :key="file.id_media_galeri" class="gallery-item-preview">
            <div class="thumbnail-wrapper">
              <img v-if="file.jenis_file === 'gambar'" :src="getMediaUrl(file.path_file)" alt="Preview Thumbnail" class="thumbnail-image">
              <video v-else-if="file.jenis_file === 'video'" :src="getMediaUrl(file.path_file)" class="thumbnail-image" controls></video>
              <i v-else class="fas fa-file-alt placeholder-icon"></i>
              <div class="thumbnail-overlay">
                <span class="file-name">{{ file.path_file.split('/').pop() }}</span>
              </div>
            </div>
            <div class="item-details">
              <input type="text" v-model="file.deskripsi_file" placeholder="Deskripsi file" class="form-input small-input">
              <input type="number" v-model="file.urutan_tampil" placeholder="Urutan" class="form-input small-input">
              <button type="button" @click="removeExistingGalleryFile(file.id_media_galeri)" class="remove-file-btn" title="Hapus">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
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
          <div v-for="(file, index) in galleryFiles" :key="`new-${index}`" class="gallery-item-preview">
            <div class="thumbnail-wrapper">
              <img v-if="file.previewUrl" :src="file.previewUrl" alt="Preview Thumbnail" class="thumbnail-image">
              <i v-else class="fas fa-file-alt placeholder-icon"></i>
              <div class="thumbnail-overlay">
                <span class="file-name">{{ file.file.name }}</span>
              </div>
            </div>
            <div class="item-details">
              <input type="text" v-model="file.deskripsi" placeholder="Deskripsi file" class="form-input small-input">
              <input type="number" v-model="file.urutan" placeholder="Urutan" class="form-input small-input">
              <button type="button" @click="removeGalleryFile(index)" class="remove-file-btn" title="Hapus">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" class="action-button cancel-button" @click="$emit('close-form')">
          <i class="fas fa-times"></i> Batal
        </button>
        <button type="submit" class="action-button save-button">
          <i class="fas fa-save"></i> {{ isEditing ? 'Simpan Perubahan' : 'Simpan Destinasi & Galeri' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

const props = defineProps({
  isEditing: Boolean,
  initialData: Object,
  kategoriList: Array,
  galleryList: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close-form', 'save-destinasi', 'update-destinasi']);

const formData = ref({});
const galleryFiles = ref([]);
const initialGalleryFiles = ref([]);
const deletedGalleryIds = ref([]);
const mapInstance = ref(null);
const markerInstance = ref(null);

watch(() => props.initialData, (newVal) => {
  formData.value = { ...newVal };
  initialGalleryFiles.value = props.galleryList ? [...props.galleryList] : [];
  galleryFiles.value = [];
  deletedGalleryIds.value = [];
  nextTick(() => {
    initializeMap();
  });
}, { immediate: true });

const handleFileUpload = (event) => {
  formData.value.gambar_utama = event.target.files[0];
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
  if (confirm('Apakah Anda yakin ingin menghapus file galeri ini? Perubahan akan disimpan saat Anda memperbarui destinasi.')) {
    initialGalleryFiles.value = initialGalleryFiles.value.filter(file => file.id_media_galeri !== id);
    deletedGalleryIds.value.push(id);
  }
};

const submitForm = () => {
  const submitData = new FormData();
  for (const key in formData.value) {
    if (formData.value[key] !== null) {
      submitData.append(key, formData.value[key]);
    }
  }

  if (props.isEditing) {
    initialGalleryFiles.value.forEach(item => {
        submitData.append('existing_gallery_updates', JSON.stringify({
            id_media_galeri: item.id_media_galeri,
            deskripsi_file: item.deskripsi_file,
            urutan_tampil: item.urutan_tampil
        }));
    });
    emit('update-destinasi', submitData, galleryFiles.value, deletedGalleryIds.value);
  } else {
    emit('save-destinasi', submitData, galleryFiles.value);
  }
};

const initializeMap = () => {
  if (mapInstance.value) {
    destroyMap();
  }
  
  const mapCenter = formData.value.koordinat_lokasi ? 
    formData.value.koordinat_lokasi.split(',').map(Number) : 
    [-7.6534, 111.4116];
  
  mapInstance.value = L.map('map').setView(mapCenter, 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance.value);

  if (formData.value.koordinat_lokasi) {
    markerInstance.value = L.marker(mapCenter).addTo(mapInstance.value);
  }

  mapInstance.value.on('click', (e) => {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    formData.value.koordinat_lokasi = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    
    if (markerInstance.value) {
      markerInstance.value.setLatLng(e.latlng);
    } else {
      markerInstance.value = L.marker(e.latlng).addTo(mapInstance.value);
    }
  });
};

const destroyMap = () => {
  if (mapInstance.value) {
    mapInstance.value.remove();
    mapInstance.value = null;
    markerInstance.value = null;
  }
};

onUnmounted(() => {
  destroyMap();
});
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
  transition: transform 0.2s;
}
.gallery-item-preview:hover {
  transform: translateY(-2px);
}
.thumbnail-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 75%;
  overflow: hidden;
  background-color: #f1f5f9;
}
.thumbnail-image, .placeholder-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #6c757d;
}
.thumbnail-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-details {
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  gap: 0.5rem;
  background-color: #ffffff;
}
.small-input {
  padding: 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}
.remove-file-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.remove-file-btn:hover {
  background-color: #c82333;
}
.form-section {
  margin-bottom: 1.5rem;
}
.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #007bff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
}
.required {
  color: #dc3545;
}
.file-drop-area {
  border: 1px dashed #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  background-color: #f8f9fa;
}
.file-drop-area.has-file {
  border: 1px solid #007bff;
}
.file-drop-area:hover {
  border-color: #007bff;
  background-color: #e6f2ff;
}
.file-icon {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 0.5rem;
}
.file-message {
  font-size: 0.875rem;
  color: #6c757d;
}
.file-link {
  color: #007bff;
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
</style>