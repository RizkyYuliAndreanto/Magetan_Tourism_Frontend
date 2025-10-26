<template>
  <div class="detail-page-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <button @click="goBack" class="back-button">
          <i class="fas fa-arrow-left"></i> Kembali
        </button>
        <div class="hero-text">
          <h1 class="hero-title">
            <i class="fas fa-shield-alt"></i>
            PPID Magetan
          </h1>
          <p class="hero-subtitle">
            Pejabat Pengelola Informasi dan Dokumentasi
          </p>
          <p class="hero-description">
            Unit kerja yang bertanggung jawab dalam mengelola dan melayani
            permintaan informasi serta mendokumentasikan informasi di Dinas
            Kebudayaan dan Pariwisata Kabupaten Magetan.
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">{{ totalCategories }}</div>
              <div class="stat-label">Kategori</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">{{ totalSubcategories }}</div>
              <div class="stat-label">Sub Kategori</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">{{ totalDocuments }}</div>
              <div class="stat-label">Dokumen</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
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
        <!-- Search and Filter Section -->
        <div class="search-filter-section">
          <div class="search-container">
            <div class="search-input-group">
              <i class="fas fa-search search-icon"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari kategori, dokumen, atau informasi..."
                class="search-input"
                @input="filterContent" />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="clear-search">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div class="filter-actions">
            <button
              @click="expandAllCategories"
              class="action-btn expand-btn"
              :disabled="loading">
              <i class="fas fa-expand-arrows-alt"></i>
              Buka Semua
            </button>
            <button
              @click="collapseAllCategories"
              class="action-btn collapse-btn"
              :disabled="loading">
              <i class="fas fa-compress-arrows-alt"></i>
              Tutup Semua
            </button>
          </div>
        </div>

        <!-- Categories -->
        <div v-if="filteredCategories.length > 0" class="categories-section">
          <div class="section-header">
            <h2 class="section-title">
              <i class="fas fa-folder-tree"></i>
              Kategori Informasi PPID
            </h2>
            <div class="section-meta">
              <span class="result-count" v-if="searchQuery">
                {{ getTotalFilteredResults() }} hasil ditemukan
              </span>
            </div>
          </div>
          <div class="categories-grid">
            <div
              v-for="category in filteredCategories"
              :key="category.id_kategori_ppid"
              class="category-card"
              :class="{
                expanded: expandedCategories.includes(
                  category.id_kategori_ppid
                ),
              }"
              @click="toggleCategory(category.id_kategori_ppid)">
              <div class="category-header">
                <div class="category-info">
                  <div class="category-icon-wrapper">
                    <i class="fas fa-folder category-icon"></i>
                  </div>
                  <div class="category-text">
                    <h3 class="category-title">{{ category.nama_kategori }}</h3>
                    <p class="category-meta">
                      {{
                        category.subkategori ? category.subkategori.length : 0
                      }}
                      Sub Kategori •
                      {{ getTotalDocumentsInCategory(category) }} Dokumen
                    </p>
                  </div>
                </div>
                <div class="category-controls">
                  <div class="category-badge">
                    <i class="fas fa-file-alt"></i>
                    {{ getTotalDocumentsInCategory(category) }}
                  </div>
                  <i
                    class="fas fa-chevron-down category-toggle"
                    :class="{
                      expanded: expandedCategories.includes(
                        category.id_kategori_ppid
                      ),
                    }"></i>
                </div>
              </div>
              <p
                v-if="category.deskripsi_kategori"
                class="category-description">
                {{ category.deskripsi_kategori }}
              </p>
              <!-- Subcategories List -->
              <div
                v-if="expandedCategories.includes(category.id_kategori_ppid)"
                class="content-list">
                <!-- Display Subcategories if exist -->
                <div
                  v-if="category.subkategori && category.subkategori.length > 0"
                  class="subcategories-section">
                  <h4 class="subcategories-title">
                    <i class="fas fa-folder-open"></i>
                    Sub Kategori ({{ category.subkategori.length }})
                  </h4>
                  <div class="subcategories-grid">
                    <div
                      v-for="subcategory in category.subkategori"
                      :key="subcategory.id_kategori_ppid"
                      class="subcategory-card"
                      @click.stop="
                        toggleSubcategory(subcategory.id_kategori_ppid)
                      ">
                      <div class="subcategory-header">
                        <div class="subcategory-info">
                          <h5 class="subcategory-title">
                            <i class="fas fa-folder"></i>
                            {{ subcategory.nama_kategori }}
                          </h5>
                          <span
                            v-if="
                              subcategory.kontenPPID &&
                              subcategory.kontenPPID.length > 0
                            "
                            class="content-count">
                            {{ subcategory.kontenPPID.length }} dokumen
                          </span>
                          <span v-else class="content-count empty">
                            0 dokumen
                          </span>
                        </div>
                        <i
                          class="fas fa-chevron-down subcategory-toggle"
                          :class="{
                            expanded: expandedCategories.includes(
                              subcategory.id_kategori_ppid
                            ),
                          }"></i>
                      </div>
                      <p
                        v-if="subcategory.deskripsi_kategori"
                        class="subcategory-description">
                        {{ subcategory.deskripsi_kategori }}
                      </p>

                      <!-- Content for subcategory - HANYA DI SINI KONTEN MUNCUL -->
                      <div
                        v-if="
                          expandedCategories.includes(
                            subcategory.id_kategori_ppid
                          )
                        "
                        class="subcategory-content">
                        <div class="content-header-section">
                          <h6 class="content-section-title">
                            <i class="fas fa-file-alt"></i>
                            Dokumen & File
                          </h6>
                        </div>

                        <div
                          v-if="
                            subcategory.kontenPPID &&
                            subcategory.kontenPPID.length > 0
                          "
                          class="content-grid">
                          <div
                            v-for="content in subcategory.kontenPPID"
                            :key="content.id_konten_ppid"
                            class="content-item">
                            <div class="content-card">
                              <!-- Content Thumbnail/Cover Image -->
                              <div class="content-image-section">
                                <div
                                  v-if="content.gambar_sampul"
                                  class="content-image-container"
                                  @click="
                                    openImageModal(
                                      content.gambar_sampul,
                                      content.judul_konten
                                    )
                                  ">
                                  <img
                                    :src="getFileUrl(content.gambar_sampul)"
                                    :alt="content.judul_konten"
                                    class="content-image"
                                    @error="onImageError($event, content)"
                                    @load="onImageLoad($event, content)" />
                                  <div class="image-overlay">
                                    <i class="fas fa-expand-alt"></i>
                                  </div>
                                </div>
                                <div v-else class="content-placeholder">
                                  <i class="fas fa-image"></i>
                                  <span>Tidak ada gambar</span>
                                </div>
                                <!-- Debug info (remove in production) -->
                                <div
                                  class="debug-info"
                                  v-if="content.gambar_sampul">
                                  <small
                                    >Debug:
                                    {{
                                      getFileUrl(content.gambar_sampul)
                                    }}</small
                                  >
                                </div>
                              </div>

                              <!-- Content Info -->
                              <div class="content-info-section">
                                <div class="content-header">
                                  <h4 class="content-title">
                                    <i
                                      class="fas fa-file-text content-type-icon"></i>
                                    {{ content.judul_konten }}
                                  </h4>
                                  <div class="content-meta">
                                    <span class="content-date">
                                      <i class="fas fa-calendar-alt"></i>
                                      {{
                                        formatDate(content.tanggal_publikasi)
                                      }}
                                    </span>
                                    <span
                                      class="content-size"
                                      v-if="content.file_pdf_path">
                                      <i class="fas fa-file-pdf"></i>
                                      PDF
                                    </span>
                                  </div>
                                </div>

                                <p
                                  v-if="content.deskripsi_konten"
                                  class="content-description">
                                  {{
                                    truncateText(content.deskripsi_konten, 120)
                                  }}
                                </p>

                                <div class="content-actions">
                                  <a
                                    v-if="content.file_pdf_path"
                                    :href="getFileUrl(content.file_pdf_path)"
                                    target="_blank"
                                    class="action-btn primary-btn">
                                    <i class="fas fa-download"></i>
                                    Unduh PDF
                                  </a>
                                  <button
                                    v-if="content.gambar_sampul"
                                    @click="
                                      openImageModal(
                                        content.gambar_sampul,
                                        content.judul_konten
                                      )
                                    "
                                    class="action-btn secondary-btn">
                                    <i class="fas fa-eye"></i>
                                    Lihat Gambar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-else class="no-content">
                          <div class="no-content-icon">
                            <i class="fas fa-inbox"></i>
                          </div>
                          <h5>Belum Ada Dokumen</h5>
                          <p>
                            Sub kategori ini belum memiliki dokumen atau file
                            PPID.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Show message if no subcategories -->
                <div v-else class="no-subcategories">
                  <div class="no-subcategories-icon">
                    <i class="fas fa-folder-plus"></i>
                  </div>
                  <h4>Belum Ada Sub Kategori</h4>
                  <p>
                    Kategori "<strong>{{ category.nama_kategori }}</strong
                    >" belum memiliki sub kategori.
                  </p>
                  <small
                    >Sub kategori diperlukan untuk mengorganisir dokumen
                    PPID.</small
                  >
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Debug: Log base URL
console.log("🔗 Base URL:", baseUrl);

// Reactive data
const categories = ref([]);
const loading = ref(true);
const error = ref(false);
const expandedCategories = ref([]);
const searchQuery = ref("");

// Image modal
const showImageModal = ref(false);
const modalImageSrc = ref("");
const modalImageAlt = ref("");

// Computed properties for statistics and filtering
const totalCategories = computed(() => categories.value.length);

const totalSubcategories = computed(() => {
  return categories.value.reduce((total, category) => {
    return total + (category.subkategori ? category.subkategori.length : 0);
  }, 0);
});

const totalDocuments = computed(() => {
  return categories.value.reduce((total, category) => {
    if (category.subkategori) {
      return (
        total +
        category.subkategori.reduce((subTotal, sub) => {
          return subTotal + (sub.kontenPPID ? sub.kontenPPID.length : 0);
        }, 0)
      );
    }
    return total;
  }, 0);
});

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return categories.value;
  }

  const query = searchQuery.value.toLowerCase();
  return categories.value.filter((category) => {
    // Check category name
    const categoryMatch = category.nama_kategori.toLowerCase().includes(query);

    // Check subcategories and their content
    const hasMatchingSubcategory = category.subkategori?.some((sub) => {
      const subMatch = sub.nama_kategori.toLowerCase().includes(query);
      const hasMatchingContent = sub.kontenPPID?.some(
        (content) =>
          content.judul_konten.toLowerCase().includes(query) ||
          (content.deskripsi_konten &&
            content.deskripsi_konten.toLowerCase().includes(query))
      );
      return subMatch || hasMatchingContent;
    });

    return categoryMatch || hasMatchingSubcategory;
  });
});

// Methods
const goBack = () => {
  router.back();
};

const fetchPpidData = async () => {
  loading.value = true;
  error.value = false;

  try {
    // Fetch semua kategori dengan sub-kategori dan konten
    const response = await axios.get(
      `${baseUrl}/api/kategori-ppid?includeSubKategori=true&includeKonten=true`
    );

    const allCategories = response.data || [];

    // Filter hanya kategori induk dan structure data dengan benar
    const kategoriInduk = allCategories
      .filter((k) => k.id_kategori_induk === null)
      .map((induk) => {
        // Cari sub-kategori untuk kategori induk ini
        const subkategori = allCategories.filter(
          (k) => k.id_kategori_induk === induk.id_kategori_ppid
        );

        return {
          ...induk,
          subkategori: subkategori,
        };
      });

    categories.value = kategoriInduk;
    console.log("PPID Data structure:", categories.value);

    // Debug: Log image paths dari konten
    categories.value.forEach((category) => {
      if (category.subkategori) {
        category.subkategori.forEach((sub) => {
          if (sub.kontenPPID) {
            sub.kontenPPID.forEach((content) => {
              console.log("📄 Content:", {
                id: content.id_konten_ppid,
                judul: content.judul_konten,
                gambar_sampul: content.gambar_sampul,
                full_url: getFileUrl(content.gambar_sampul),
              });
            });
          }
        });
      }
    });
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

const toggleSubcategory = (subcategoryId) => {
  // Prevent event bubbling to parent category
  event?.stopPropagation();

  const index = expandedCategories.value.indexOf(subcategoryId);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
  } else {
    expandedCategories.value.push(subcategoryId);
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
  if (!path) {
    console.log("❌ No path provided to getFileUrl");
    return "";
  }

  const fullUrl = path.startsWith("http") ? path : `${baseUrl}${path}`;
  console.log("🖼️ Generated image URL:", fullUrl);
  return fullUrl;
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

// New utility methods
const getTotalDocumentsInCategory = (category) => {
  if (!category.subkategori) return 0;
  return category.subkategori.reduce((total, sub) => {
    return total + (sub.kontenPPID ? sub.kontenPPID.length : 0);
  }, 0);
};

const truncateText = (text, maxLength = 120) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

const getTotalFilteredResults = () => {
  return filteredCategories.value.reduce((total, category) => {
    if (category.subkategori) {
      return (
        total +
        category.subkategori.reduce((subTotal, sub) => {
          return subTotal + (sub.kontenPPID ? sub.kontenPPID.length : 0);
        }, 0)
      );
    }
    return total;
  }, 0);
};

// Search and filter methods
const filterContent = () => {
  // This method is called when search input changes
  // The actual filtering is handled by the computed property
};

const clearSearch = () => {
  searchQuery.value = "";
};

const expandAllCategories = () => {
  expandedCategories.value = categories.value.flatMap((category) => {
    const ids = [category.id_kategori_ppid];
    if (category.subkategori) {
      ids.push(...category.subkategori.map((sub) => sub.id_kategori_ppid));
    }
    return ids;
  });
};

const collapseAllCategories = () => {
  expandedCategories.value = [];
};

// Image handling methods
const onImageError = (event, content) => {
  console.error("❌ Failed to load image for content:", {
    id: content.id_konten_ppid,
    judul: content.judul_konten,
    gambar_sampul: content.gambar_sampul,
    attempted_url: event.target.src,
  });

  // Try alternative URL format
  const altUrl = content.gambar_sampul.startsWith("/")
    ? `http://localhost:5000${content.gambar_sampul}`
    : content.gambar_sampul;

  if (event.target.src !== altUrl) {
    console.log("🔄 Trying alternative URL:", altUrl);
    event.target.src = altUrl;
  }
};

const onImageLoad = (event, content) => {
  console.log("✅ Image loaded successfully for content:", {
    id: content.id_konten_ppid,
    judul: content.judul_konten,
    loaded_url: event.target.src,
  });
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
  min-height: 100vh;
  background: linear-gradient(135deg, #f4f7f9 0%, #e8f0fe 50%, #f1f5f9 100%);
  color: #333;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 120px 0 80px 0;
  background: linear-gradient(
      135deg,
      rgba(0, 119, 182, 0.95) 0%,
      rgba(0, 95, 145, 0.95) 50%,
      rgba(71, 85, 105, 0.95) 100%
    ),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="white" opacity="0.1"><polygon points="0,100 0,0 1000,100"/></svg>');
  background-attachment: fixed;
  background-size: cover;
  color: white;
  text-align: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-text {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.hero-title i {
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.9);
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2.5rem;
  color: rgba(255, 255, 255, 0.95);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.5rem;
}

.stat-divider {
  width: 2px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1px;
}

.content-wrapper {
  max-width: 1300px;
  margin: -40px auto 0 auto;
  padding: 40px 20px;
  background: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -10px 40px rgba(0, 119, 182, 0.08);
  position: relative;
  z-index: 3;
}
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 40px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(-5px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
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

/* Search and Filter Section */
.search-filter-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-input-group {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.clear-search {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.clear-search:hover {
  background: #495057;
}

.filter-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.expand-btn {
  background: #28a745;
  color: white;
}

.expand-btn:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
}

.collapse-btn {
  background: #6c757d;
  color: white;
}

.collapse-btn:hover:not(:disabled) {
  background: #5a6268;
  transform: translateY(-2px);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* PPID Content */
.ppid-content {
  margin-top: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  color: #007bff;
  font-size: 1.75rem;
}

.section-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.result-count {
  background: #007bff;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Categories */
.categories-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #007bff, #28a745);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.category-card:hover::before,
.category-card.expanded::before {
  transform: scaleX(1);
}

.category-card:hover {
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
  border-color: #007bff;
}

.category-card.expanded {
  border-color: #007bff;
  background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08);
}

.category-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 1rem;
}

.category-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.category-icon-wrapper {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.category-icon {
  font-size: 1.25rem;
}

.category-text {
  flex: 1;
}

.category-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.category-meta {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
  font-weight: 500;
}

.category-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.category-badge {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.category-toggle {
  color: #6c757d;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 50%;
}

.category-toggle:hover {
  background: #f8f9fa;
  color: #007bff;
}

.category-toggle.expanded {
  transform: rotate(180deg);
  color: #007bff;
}

.category-description {
  color: #495057;
  line-height: 1.7;
  margin-bottom: 16px;
  font-size: 0.95rem;
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

/* Content List */
.content-list {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

/* Subcategories */
.subcategories-section {
  margin-bottom: 20px;
}

.subcategories-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #28a745;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-description {
  color: #6c757d;
  font-style: italic;
  margin: 8px 0 15px 0;
  line-height: 1.4;
  font-size: 0.95rem;
}

.subcategories-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-left: 20px;
}

.subcategory-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid #28a745;
}

.subcategory-card:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.subcategory-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.subcategory-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.subcategory-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #28a745;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.subcategory-title i {
  color: #28a745;
  font-size: 0.9rem;
}

.content-count {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  background: #e9ecef;
  padding: 2px 8px;
  border-radius: 12px;
}

.content-count.empty {
  background: #f8d7da;
  color: #721c24;
}

.subcategory-toggle {
  color: #6c757d;
  transition: transform 0.3s ease;
  font-size: 0.9rem;
}

.subcategory-toggle.expanded {
  transform: rotate(180deg);
}

.subcategory-description {
  color: #6c757d;
  line-height: 1.5;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.subcategory-content {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #dee2e6;
  margin-left: 15px;
}

.no-subcategories {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 30px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.content-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9ecef;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08), 0 6px 10px rgba(0, 0, 0, 0.05);
  border-color: #007bff;
}

.content-image-section {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #f8f9fa;
}

.content-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
}

.content-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.content-image-container:hover .content-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.content-image-container:hover .image-overlay {
  opacity: 1;
}

.image-overlay i {
  color: white;
  font-size: 2rem;
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.content-placeholder i {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.content-placeholder span {
  font-size: 0.9rem;
  font-weight: 500;
}

.content-info-section {
  padding: 20px;
}

.content-header {
  margin-bottom: 12px;
}

.content-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.content-type-icon {
  color: #007bff;
  font-size: 1rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.content-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.content-date,
.content-size {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
}

.content-size {
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
}

.content-description {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 0.95rem;
}

.content-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
}

.primary-btn {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  box-shadow: 0 3px 12px rgba(0, 123, 255, 0.3);
}

.primary-btn:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4);
  color: white;
}

.secondary-btn {
  background: #6c757d;
  color: white;
}

.secondary-btn:hover {
  background: #545b62;
  transform: translateY(-2px);
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

/* Debug info (temporary) */
.debug-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  font-size: 10px;
  word-break: break-all;
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
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .stat-divider {
    width: 40px;
    height: 2px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 20px 15px;
    margin-top: -20px;
  }

  .hero-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .search-filter-section {
    padding: 1.5rem;
  }

  .filter-actions {
    justify-content: stretch;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .category-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
  }

  .category-controls {
    align-self: flex-end;
    margin-top: -40px;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .content-image-section {
    height: 160px;
  }

  .content-actions {
    flex-direction: column;
  }

  .action-btn {
    flex: none;
    width: 100%;
  }

  .subcategories-grid {
    margin-left: 0;
  }

  .subcategory-content {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 100px 0 60px 0;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-stats {
    padding: 1.5rem;
    gap: 0.75rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .search-filter-section {
    padding: 1rem;
  }

  .search-input {
    padding: 14px 16px 14px 45px;
  }

  .category-card {
    padding: 16px;
  }

  .category-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .category-title {
    font-size: 1.25rem;
  }

  .content-info-section {
    padding: 16px;
  }
}
</style>
<style scoped>
/* Smooth scrolling and animations */
.detail-page-container {
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* Fade-in animation for content */
.categories-grid > .category-card {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.category-card:nth-child(1) {
  animation-delay: 0.1s;
}
.category-card:nth-child(2) {
  animation-delay: 0.2s;
}
.category-card:nth-child(3) {
  animation-delay: 0.3s;
}
.category-card:nth-child(4) {
  animation-delay: 0.4s;
}
.category-card:nth-child(5) {
  animation-delay: 0.5s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse animation for loading states */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Smooth transitions for all interactive elements */
* {
  transition: color 0.3s ease, background-color 0.3s ease,
    border-color 0.3s ease, box-shadow 0.3s ease;
}

/* Focus styles for accessibility */
.search-input:focus,
.action-btn:focus,
.category-card:focus {
  outline: 3px solid rgba(0, 123, 255, 0.3);
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .back-button,
  .search-filter-section,
  .hero-section {
    display: none;
  }

  .content-wrapper {
    margin-top: 0;
    box-shadow: none;
    border-radius: 0;
  }

  .category-card {
    break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ddd;
  }
}
</style>
