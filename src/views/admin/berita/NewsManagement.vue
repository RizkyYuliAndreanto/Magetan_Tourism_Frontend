<template>
  <div>
    <!-- Header dengan Penjelasan -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-newspaper"></i>
          Data Berita
        </h2>
        <p class="subtitle">
          Kelola artikel berita dan informasi terkini. Setiap berita akan
          ditampilkan sesuai dengan kategori yang dipilih dan dapat diatur
          tanggal publikasinya.
        </p>
      </div>
      <div class="action-bar">
        <button
          v-if="!formBeritaOpen"
          class="action-button create-button"
          @click="openBeritaForm()">
          <i class="fas fa-plus-circle"></i> Tambah Berita Baru
        </button>
      </div>
    </div>

    <div v-if="formBeritaOpen" class="form-overlay">
      <div class="form-card card">
        <NewsForm
          :is-editing="isEditingBerita"
          :initial-data="formBerita"
          :kategori-list="kategoriList"
          :gallery-list="editingBeritaGallery"
          @close-form="closeBeritaForm"
          @save-berita="handleSaveBerita"
          @update-berita="handleUpdateBerita" />
      </div>
    </div>

    <div v-else>
      <!-- Statistik -->
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-newspaper"></i>
          </div>
          <div class="stat-content">
            <h3>{{ beritaList.length }}</h3>
            <p>Total Berita</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-tags"></i>
          </div>
          <div class="stat-content">
            <h3>{{ kategoriList.length }}</h3>
            <p>Kategori Tersedia</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="stat-content">
            <h3>{{ beritaBulanIni }}</h3>
            <p>Berita Bulan Ini</p>
          </div>
        </div>
      </div>

      <!-- Tabel Berita -->
      <div class="table-container card">
        <div class="table-header">
          <h3 class="table-title">
            <i class="fas fa-list"></i>
            Daftar Berita
          </h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Admin</th>
                <th>Tanggal Publikasi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="beritaList.length === 0">
                <td colspan="6" class="no-data-found">
                  <div class="empty-state">
                    <i class="fas fa-newspaper"></i>
                    <h3>Belum Ada Data Berita</h3>
                    <p>
                      Mulai tambahkan artikel berita dan informasi terkini untuk
                      memberikan update kepada pengunjung tentang pariwisata
                      Magetan.
                    </p>
                    <small
                      >Klik tombol "Tambah Berita Baru" untuk membuat berita
                      pertama.</small
                    >
                  </div>
                </td>
              </tr>
              <tr v-for="berita in beritaList" :key="berita.id_berita">
                <td>{{ berita.id_berita }}</td>
                <td>{{ berita.judul }}</td>
                <td>
                  <span class="category-badge">{{
                    berita.kategoriBerita.nama_kategori
                  }}</span>
                </td>
                <td>{{ berita.adminPembuat.username }}</td>
                <td>{{ formatDate(berita.tanggal_publikasi) }}</td>
                <td class="actions">
                  <button
                    class="action-button edit-button"
                    @click="openBeritaForm(berita)"
                    title="Edit">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="action-button delete-button"
                    @click="showDeleteConfirm(berita.id_berita)"
                    title="Hapus">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <BasePopUp
      v-if="showPopUp"
      :key="`${popUpStatus}-${popUpAction}`"
      :status="popUpStatus"
      :action="popUpAction"
      :entity-name="popUpEntity"
      :error-message="popUpMessage"
      @close="closePopUp"
      @confirmed="handleDeleteConfirmed" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import axios from "axios";
import NewsForm from "./NewsForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const beritaList = ref([]);
const kategoriList = ref([]);
const formBeritaOpen = ref(false);
const isEditingBerita = ref(false);
const formBerita = ref(null);
const editingBeritaGallery = ref([]);

// State untuk pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Berita");
const popUpMessage = ref("");
const beritaToDeleteId = ref(null);

const beritaBulanIni = computed(() => {
  const bulanIni = new Date();
  bulanIni.setDate(1);
  bulanIni.setHours(0, 0, 0, 0);

  return beritaList.value.filter((berita) => {
    const tanggalPublikasi = new Date(berita.tanggal_publikasi);
    return tanggalPublikasi >= bulanIni;
  }).length;
});

// Fungsi yang memicu pop-up konfirmasi
const showDeleteConfirm = (id) => {
  beritaToDeleteId.value = id;
  popUpStatus.value = "confirm";
  popUpAction.value = "confirmDelete";
  showPopUp.value = true;
};

// Fungsi yang dipanggil setelah konfirmasi hapus dari pop-up
const handleDeleteConfirmed = async () => {
  // Tutup popup konfirmasi agar komponen unmount
  closePopUp();
  await nextTick();

  try {
    const token = localStorage.getItem("access_token");
    await axios.delete(
      `http://localhost:5000/api/berita/${beritaToDeleteId.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    openPopUp("success", "delete");
    await fetchBeritaData(); // Refresh data after successful delete
  } catch (err) {
    openPopUp(
      "error",
      "delete",
      err.response?.data?.error || "Gagal menghapus berita."
    );
  } finally {
    beritaToDeleteId.value = null;
  }
};

// Fungsi utilitas untuk mengontrol pop-up
const openPopUp = (status, action, message = "") => {
  popUpStatus.value = status;
  popUpAction.value = action;
  popUpMessage.value = message;

  if (showPopUp.value) {
    showPopUp.value = false;
    requestAnimationFrame(() => {
      showPopUp.value = true;
    });
  } else {
    showPopUp.value = true;
  }
};

const closePopUp = () => {
  showPopUp.value = false;
};

const fetchBeritaData = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/berita");
    beritaList.value = response.data.data || response.data;
  } catch (err) {
    openPopUp("error", "fetch", "Gagal memuat data berita.");
  }
};

const fetchKategoriData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/kategori-berita"
    );
    kategoriList.value = response.data;
  } catch (err) {
    openPopUp("error", "fetch", "Gagal memuat data kategori berita.");
  }
};

const openBeritaForm = async (berita = null) => {
  isEditingBerita.value = !!berita;
  if (berita) {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/berita/${berita.id_berita}`
      );
      const fullBeritaData = response.data;
      formBerita.value = {
        ...fullBeritaData,
        tanggal_publikasi: new Date(fullBeritaData.tanggal_publikasi)
          .toISOString()
          .slice(0, 16),
        preview_gambar_hero: fullBeritaData.gambar_hero_berita
          ? `http://localhost:5000${fullBeritaData.gambar_hero_berita}`
          : null,
        gambar_hero_berita: null,
      };
      editingBeritaGallery.value = fullBeritaData.galeriBerita || [];
    } catch (error) {
      openPopUp("error", "fetch", "Gagal memuat detail berita untuk diedit.");
      return;
    }
  } else {
    formBerita.value = {
      id_berita: null,
      judul: "",
      id_kategori: "",
      isi_berita: "",
      gambar_hero_berita: null,
      preview_gambar_hero: null,
      tanggal_publikasi: new Date().toISOString().slice(0, 16),
    };
    editingBeritaGallery.value = [];
  }
  formBeritaOpen.value = true;

  // Prevent body scroll
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
};

const closeBeritaForm = () => {
  formBeritaOpen.value = false;
  formBerita.value = null;
  editingBeritaGallery.value = [];
  isEditingBerita.value = false;

  // Restore body scroll with extra safety
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";
  document.body.style.top = "";
  document.body.style.left = "";

  // Refresh data hanya dipanggil dari method yang membutuhkan
  // fetchBeritaData(); // Dihapus dari sini karena sudah dipanggil dari method update/create
};

const handleSaveBerita = async (formData, galleryFiles) => {
  try {
    const token = localStorage.getItem("access_token");
    const beritaResponse = await axios.post(
      "http://localhost:5000/api/berita",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const id_berita = beritaResponse.data.berita.id_berita;

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append("id_konten", id_berita);
      galleryFormData.append("tipe_konten", "berita");
      galleryFiles.forEach((galleryItem) => {
        galleryFormData.append("media_galeri_files", galleryItem.file);
        galleryFormData.append("deskripsi_file", galleryItem.deskripsi || "");
        galleryFormData.append("jenis_file", galleryItem.jenis_file);
        galleryFormData.append("urutan_tampil", galleryItem.urutan);
      });
      await axios.post(
        "http://localhost:5000/api/media-galeri",
        galleryFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
    openPopUp("success", "create");
    closeBeritaForm();

    // Refresh data after successful create
    await fetchBeritaData();
  } catch (err) {
    openPopUp(
      "error",
      "create",
      err.response?.data?.error ||
        "Gagal menyimpan berita. Periksa kembali input Anda."
    );
  }
};

const handleUpdateBerita = async (
  formData,
  galleryFiles,
  deletedGalleryIds
) => {
  try {
    const token = localStorage.getItem("access_token");
    const id = formData.get("id_berita");

    // Prepare media operations untuk endpoint baru
    const existingUpdates = [];

    // Extract existing gallery updates dari formData
    for (let [key, value] of formData.entries()) {
      if (key === "existing_gallery_updates") {
        try {
          const updateItem = JSON.parse(value);
          // Pastikan item memiliki id_media_galeri
          if (updateItem.id_media_galeri) {
            existingUpdates.push({
              id: updateItem.id_media_galeri, // Pastikan menggunakan 'id', bukan 'id_media_galeri'
              deskripsi_file: updateItem.deskripsi_file || "",
              urutan_tampil: updateItem.urutan_tampil || 1,
            });
          }
        } catch (parseError) {
          // Silently skip invalid gallery update
        }
      }
    }

    // Get current media untuk determine keep operations
    let currentMediaIds = [];
    try {
      const mediaResponse = await axios.get(
        `http://localhost:5000/api/media-galeri/by-content?id_konten=${id}&tipe_konten=berita`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      currentMediaIds = mediaResponse.data.map((m) => m.id_media_galeri);
    } catch (err) {
      // Silently proceed without keep operations
    }

    // Filter out null, undefined, dan empty values dari deletedGalleryIds
    const validDeletedIds = (deletedGalleryIds || [])
      .filter((id) => id != null && id !== undefined && id !== "" && !isNaN(id))
      .map((id) => parseInt(id)); // Pastikan integer

    // Determine media operations
    const keepIds = currentMediaIds.filter(
      (id) => !validDeletedIds.includes(id)
    );

    const mediaOperations = {
      keep: keepIds,
      update: existingUpdates, // Ini sekarang sudah memiliki format { id, deskripsi_file, urutan_tampil }
      delete: validDeletedIds,
    };

    // Create new FormData for atomic endpoint
    const atomicFormData = new FormData();

    // Add berita data (exclude media-related fields)
    for (let [key, value] of formData.entries()) {
      if (
        !key.startsWith("existing_gallery_updates") &&
        !key.startsWith("media_galeri_files")
      ) {
        atomicFormData.append(key, value);
      }
    }

    // Add media operations
    atomicFormData.append("media_operations", JSON.stringify(mediaOperations));

    // Add new gallery files
    if (galleryFiles && galleryFiles.length > 0) {
      galleryFiles.forEach((galleryItem, index) => {
        atomicFormData.append("media_galeri_files", galleryItem.file);
        atomicFormData.append(
          `media_deskripsi_${index}`,
          galleryItem.deskripsi || ""
        );
        atomicFormData.append(
          `media_urutan_${index}`,
          galleryItem.urutan || 100 + index
        );
      });
    }

    // Send atomic update request to new endpoint
    const response = await axios.put(
      `http://localhost:5000/api/berita/${id}/with-media`,
      atomicFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 60000, // 60 seconds timeout untuk file upload
      }
    );

    openPopUp("success", "update");
    closeBeritaForm();

    // Refresh data
    await fetchBeritaData();
  } catch (err) {
    // Fallback ke method lama jika endpoint baru gagal
    if (
      err.response?.status === 404 &&
      err.response?.data?.error?.includes("Not Found")
    ) {
      await handleUpdateBeritaLegacy(formData, galleryFiles, deletedGalleryIds);
    } else {
      openPopUp(
        "error",
        "update",
        err.response?.data?.error || "Gagal memperbarui berita."
      );
    }
  }
};

// Legacy method sebagai fallback
const handleUpdateBeritaLegacy = async (
  formData,
  galleryFiles,
  deletedGalleryIds
) => {
  try {
    const token = localStorage.getItem("access_token");
    const id = formData.get("id_berita");

    // 1. Update berita terlebih dahulu
    await axios.put(`http://localhost:5000/api/berita/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    // 2. Update existing gallery files (jika ada perubahan deskripsi/urutan)
    const existingGalleryUpdates = [];
    for (let [key, value] of formData.entries()) {
      if (key === "existing_gallery_updates") {
        try {
          existingGalleryUpdates.push(JSON.parse(value));
        } catch (parseError) {
          // Silently skip invalid gallery update
        }
      }
    }

    if (existingGalleryUpdates.length > 0) {
      await Promise.all(
        existingGalleryUpdates.map(async (update) => {
          try {
            await axios.patch(
              `http://localhost:5000/api/media-galeri/${update.id_media_galeri}/data`,
              {
                deskripsi_file: update.deskripsi_file || "",
                urutan_tampil: update.urutan_tampil || 1,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (updateError) {
            // Silently handle update error
          }
        })
      );
    }

    // 3. Hapus media galeri yang dipilih menggunakan batch delete
    if (deletedGalleryIds && deletedGalleryIds.length > 0) {
      try {
        await axios.delete("http://localhost:5000/api/media-galeri/batch", {
          data: { mediaIds: deletedGalleryIds },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (deleteError) {
        // Silently handle delete error
      }
    }

    // 4. Tambah media galeri baru (jika ada)
    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append("id_konten", id);
      galleryFormData.append("tipe_konten", "berita");
      galleryFiles.forEach((galleryItem, index) => {
        galleryFormData.append("media_galeri_files", galleryItem.file);
        galleryFormData.append("deskripsi_file", galleryItem.deskripsi || "");
        galleryFormData.append("jenis_file", galleryItem.jenis_file);
        galleryFormData.append("urutan_tampil", galleryItem.urutan);
      });

      await axios.post(
        "http://localhost:5000/api/media-galeri",
        galleryFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    openPopUp("success", "update");
    closeBeritaForm();
  } catch (err) {
    openPopUp(
      "error",
      "update",
      err.response?.data?.error || "Gagal memperbarui berita."
    );
  }
};

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

onMounted(() => {
  // Ensure body scroll is always restored on page load
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";
  document.body.style.top = "";
  document.body.style.left = "";

  fetchBeritaData();
  fetchKategoriData();
});

onUnmounted(() => {
  // Clean up any remaining body styles when component is destroyed
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";
  document.body.style.top = "";
  document.body.style.left = "";
});
</script>

<style scoped>
/* Header Section */
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-info .main-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-info .main-title i {
  font-size: 1.6rem;
}

.header-info .subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
  max-width: 600px;
}

.action-bar {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

/* Stats Section */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  border-left: 4px solid transparent;
}

.stat-card:nth-child(1) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.9;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.stat-content p {
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
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
.create-button {
  background-color: #007bff;
}
.create-button:hover {
  background-color: #0069d9;
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.2);
}
.table-container.card {
  padding: 0;
  border: 1px solid #e0e6ed;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e0e6ed;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-title i {
  color: #007bff;
}

.table-responsive {
  overflow-x: auto;
  max-width: 100%;
  padding: 1.5rem;
  background: white;
  -webkit-overflow-scrolling: touch;
}

.table-responsive::-webkit-scrollbar {
  height: 8px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  border-radius: 4px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table th,
.data-table td {
  padding: 0.875rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  position: sticky;
  top: 0;
  z-index: 1;
}

.data-table th i {
  color: #3b82f6;
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.data-table td {
  color: #1f2937;
  background-color: #ffffff;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  transform: translateY(-1px);
  transition: all 0.2s ease-in-out;
}
.no-data-found {
  text-align: center;
  font-style: italic;
  color: #888;
  padding: 2rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 2rem;
}

.empty-state i {
  font-size: 4rem;
  color: #3b82f6;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #1f2937;
  margin: 0;
  font-weight: 600;
}

.empty-state p {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  text-align: center;
  line-height: 1.6;
  max-width: 400px;
}

.empty-state small {
  color: #9ca3af;
  font-size: 0.875rem;
  text-align: center;
  max-width: 300px;
}
.actions {
  display: flex;
  gap: 0.375rem;
}
.actions .action-button {
  padding: 0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 0.875rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.actions .edit-button {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.actions .edit-button:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.actions .delete-button {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.actions .delete-button:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}
.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(16, 185, 129, 0.2);
}

/* Form Overlay Styles */
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 9999;
  overflow-y: auto;
  padding: 2rem;
  box-sizing: border-box;
}

.form-overlay .form-card {
  position: relative;
  max-width: 900px;
  width: 100%;
  margin: auto;
  z-index: 10000;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

/* Prevent background interaction */
.form-overlay::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 9998;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 1rem;
  }

  .action-bar {
    width: 100%;
    justify-content: center;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-overlay {
    padding: 1rem;
  }

  .form-overlay .form-card {
    max-width: 100%;
  }
}

@media (max-width: 576px) {
  .main-title {
    font-size: 1.5rem;
  }

  .stats-container {
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-content h3 {
    font-size: 1.5rem;
  }
}
</style>
