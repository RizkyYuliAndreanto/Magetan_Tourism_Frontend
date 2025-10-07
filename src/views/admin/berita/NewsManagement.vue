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

    <!-- Form Overlay -->
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
          <div class="table-count">
            Total: <strong>{{ beritaList.length }}</strong> berita
          </div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th><i class="fas fa-hashtag"></i> ID</th>
                <th><i class="fas fa-newspaper"></i> Judul</th>
                <th><i class="fas fa-tag"></i> Kategori</th>
                <th><i class="fas fa-user"></i> Admin</th>
                <th><i class="fas fa-calendar"></i> Tanggal Publikasi</th>
                <th><i class="fas fa-cogs"></i> Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="beritaList.length === 0">
                <td colspan="6" class="no-data-found">
                  <div class="empty-state">
                    <i class="fas fa-newspaper"></i>
                    <p>Belum ada berita yang tersedia.</p>
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
import { ref, computed, onMounted, nextTick } from "vue";
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

// Computed property untuk statistik
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
    fetchBeritaData();
  } catch (err) {
    console.error("Gagal menghapus berita:", err.response?.data);
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
    console.error("Gagal memuat data berita:", err);
    openPopUp("error", "fetch", "Gagal memuat data berita.");
  }
};

const fetchKategoriData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/kategori-berita"
    );
    kategoriList.value = response.data;
    console.log("Kategori data:", response.data);
  } catch (err) {
    console.error("Gagal memuat data kategori berita:", err);
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
      console.error("Gagal memuat detail berita:", error);
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

  // Restore body scroll
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";

  fetchBeritaData();
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
  } catch (err) {
    console.error("Gagal menyimpan berita:", err.response?.data);
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

    await axios.put(`http://localhost:5000/api/berita/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (galleryFiles && galleryFiles.length > 0) {
      const galleryFormData = new FormData();
      galleryFormData.append("id_konten", id);
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

    if (deletedGalleryIds && deletedGalleryIds.length > 0) {
      await Promise.all(
        deletedGalleryIds.map(async (mediaId) => {
          await axios.delete(
            `http://localhost:5000/api/media-galeri/${mediaId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        })
      );
    }
    openPopUp("success", "update");
    closeBeritaForm();
  } catch (err) {
    console.error("Gagal memperbarui berita:", err.response?.data);
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
  fetchBeritaData();
  fetchKategoriData();
});
</script>

<style scoped>
/* ========== Styling yang diselaraskan dengan PPID Management ========== */
/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.header-info {
  flex: 1;
}

.main-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.main-title i {
  color: #007bff;
  font-size: 1.5rem;
}

.subtitle {
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
  line-height: 1.5;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* Stats Section */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
}

.stat-card:nth-child(2):hover {
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2);
}

.stat-card:nth-child(3):hover {
  box-shadow: 0 8px 25px rgba(255, 193, 7, 0.3);
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

.table-count {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}
.data-table th,
.data-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}
.data-table th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table th i {
  color: #007bff;
  margin-right: 0.5rem;
  font-size: 0.8rem;
}
.data-table td {
  color: #212529;
}
.data-table tr:last-child td {
  border-bottom: none;
}
.data-table tr:hover {
  background-color: #f1f3f5;
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
  padding: 2rem;
}

.empty-state i {
  font-size: 3rem;
  color: #007bff;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.1rem;
  color: #495057;
  margin: 0;
  font-weight: 500;
}

.empty-state small {
  color: #6c757d;
  font-size: 0.9rem;
  text-align: center;
  max-width: 300px;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.actions .action-button {
  padding: 0.6rem;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.actions .edit-button {
  background-color: #ffc107;
  color: white;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);
}
.actions .edit-button:hover {
  background-color: #e0a800;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}
.actions .delete-button {
  background-color: #dc3545;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}
.actions .delete-button:hover {
  background-color: #c82333;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}
.category-badge {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  background-color: #28a745;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
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
  align-items: center;
  z-index: 9999;
  overflow-y: auto;
  padding: 2rem;
  box-sizing: border-box;
}

.form-overlay .form-card {
  position: relative;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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

  .table-count {
    align-self: flex-start;
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
