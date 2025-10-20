<template>
  <div class="detail-page-container">
    <div class="content-wrapper">
      <button @click="goBack" class="back-button">
        <i class="fas fa-arrow-left"></i> Kembali
      </button>
      <h1 class="page-main-title">PPID</h1>
      <p class="page-description">
        Pejabat Pengelola Informasi dan Dokumentasi (PPID) adalah unit kerja
        yang bertanggung jawab dalam mengelola dan melayani permintaan informasi
        serta mendokumentasikan informasi di Dinas Kebudayaan dan Pariwisata.
      </p>

      <!-- Loading State -->
      <div v-if="loading" class="state-message">
        <div class="spinner"></div>
        <p>Memuat data PPID...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="state-message error-message">
        <p>
          ❌ Maaf, terjadi kesalahan saat memuat data. Silakan coba kembali.
        </p>
      </div>

      <!-- Main Content -->
      <div v-if="!loading && !error" class="ppid-content">
        <!-- Categories -->
        <div v-if="categories.length > 0" class="categories-section">
          <h2 class="section-title">Kategori Informasi</h2>
          <div class="categories-grid">
            <div
              v-for="category in categories"
              :key="category.id_kategori_ppid"
              class="category-card"
              @click="toggleCategory(category.id_kategori_ppid)">
              <div class="category-header">
                <h3 class="category-title">{{ category.nama_kategori }}</h3>
                <i
                  class="fas fa-chevron-down category-toggle"
                  :class="{
                    expanded: expandedCategories.includes(
                      category.id_kategori_ppid
                    ),
                  }"></i>
              </div>
              <p
                v-if="category.deskripsi_kategori"
                class="category-description">
                {{ category.deskripsi_kategori }}
              </p>

              <!-- Content List -->
              <div
                v-if="expandedCategories.includes(category.id_kategori_ppid)"
                class="content-list">
                <div
                  v-if="category.kontenPPID && category.kontenPPID.length > 0">
                  <div
                    v-for="content in category.kontenPPID"
                    :key="content.id_konten_ppid"
                    class="content-item">
                    <div class="content-header">
                      <h4 class="content-title">{{ content.judul_konten }}</h4>
                      <span class="content-date">
                        {{ formatDate(content.tanggal_publikasi) }}
                      </span>
                    </div>

                    <p
                      v-if="content.deskripsi_konten"
                      class="content-description">
                      {{ content.deskripsi_konten }}
                    </p>

                    <div class="content-actions">
                      <a
                        v-if="content.file_pdf_path"
                        :href="getFileUrl(content.file_pdf_path)"
                        target="_blank"
                        class="download-btn pdf-btn">
                        <i class="fas fa-file-pdf"></i> Unduh PDF
                      </a>

                      <img
                        v-if="content.gambar_sampul"
                        :src="getFileUrl(content.gambar_sampul)"
                        :alt="content.judul_konten"
                        class="content-thumbnail"
                        @click="
                          openImageModal(
                            content.gambar_sampul,
                            content.judul_konten
                          )
                        " />
                    </div>
                  </div>
                </div>
                <div v-else class="no-content">
                  <p>Tidak ada konten dalam kategori ini.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-folder-open"></i>
          </div>
          <h3>Belum Ada Data PPID</h3>
          <p>Belum ada kategori atau konten PPID yang tersedia saat ini.</p>
        </div>
      </div>

      <!-- Image Modal -->
      <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeImageModal">
            <i class="fas fa-times"></i>
          </button>
          <img :src="modalImageSrc" :alt="modalImageAlt" class="modal-image" />
          <p class="modal-caption">{{ modalImageAlt }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Reactive data
const categories = ref([]);
const loading = ref(true);
const error = ref(false);
const expandedCategories = ref([]);

// Image modal
const showImageModal = ref(false);
const modalImageSrc = ref("");
const modalImageAlt = ref("");

// Methods
const goBack = () => {
  router.back();
};

const fetchPpidData = async () => {
  loading.value = true;
  error.value = false;

  try {
    // Fetch categories with their content
    const response = await axios.get(
      `${baseUrl}/api/kategori-ppid?includeKonten=true`
    );
    categories.value = response.data || [];
  } catch (err) {
    console.error("Error fetching PPID data:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
  } else {
    expandedCategories.value.push(categoryId);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const getFileUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${baseUrl}${path}`;
};

const openImageModal = (imageSrc, imageAlt) => {
  modalImageSrc.value = getFileUrl(imageSrc);
  modalImageAlt.value = imageAlt;
  showImageModal.value = true;
  document.body.style.overflow = "hidden";
};

const closeImageModal = () => {
  showImageModal.value = false;
  modalImageSrc.value = "";
  modalImageAlt.value = "";
  document.body.style.overflow = "auto";
};

// Lifecycle
onMounted(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  fetchPpidData();
});

onUnmounted(() => {
  document.body.style.overflow = "auto";
});
</script>

<style scoped>
.detail-page-container {
  padding-top: 100px;
  padding-bottom: 20px;
  min-height: 100vh;
  background-color: #f4f7f9;
  color: #333;
}
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 25px;
  transition: background-color 0.3s ease;
}
.back-button:hover {
  background-color: #5a6268;
}
.page-main-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: #0077b6;
  margin-bottom: 20px;
}
.page-description {
  font-size: 1rem;
  color: #495057;
  line-height: 1.8;
  margin-bottom: 30px;
}

/* Loading and Error States */
.state-message {
  text-align: center;
  font-size: 1.2rem;
  color: #6c757d;
  margin: 50px 0;
}
.state-message.error-message {
  color: #dc3545;
}
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #0077b6;
  animation: spin 1s ease infinite;
  margin: 0 auto 15px;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* PPID Content */
.ppid-content {
  margin-top: 20px;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 25px;
  border-bottom: 2px solid #0077b6;
  padding-bottom: 10px;
}

/* Categories */
.categories-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-card {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.category-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #0077b6;
  margin: 0;
}

.category-toggle {
  color: #6c757d;
  transition: transform 0.3s ease;
}

.category-toggle.expanded {
  transform: rotate(180deg);
}

.category-description {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 15px;
}

/* Content List */
.content-list {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.content-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid #0077b6;
}

.content-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.content-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
  flex: 1;
}

.content-date {
  font-size: 0.85rem;
  color: #6c757d;
  white-space: nowrap;
}

.content-description {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 15px;
}

.content-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pdf-btn {
  background-color: #dc3545;
  color: white;
}

.pdf-btn:hover {
  background-color: #c82333;
  color: white;
}

.content-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e9ecef;
}

.content-thumbnail:hover {
  transform: scale(1.05);
  border-color: #0077b6;
}

.no-content {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 20px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  color: #6c757d;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #495057;
  margin-bottom: 10px;
}

.empty-state p {
  color: #6c757d;
  font-size: 1rem;
}

/* Image Modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: background-color 0.3s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.9);
}

.modal-image {
  width: 100%;
  height: auto;
  display: block;
}

.modal-caption {
  padding: 15px 20px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 20px 15px;
  }

  .page-main-title {
    font-size: 2.2rem;
  }

  .category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .content-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
<style scoped>
.detail-page-container {
  overflow-y: auto;
}
</style>
