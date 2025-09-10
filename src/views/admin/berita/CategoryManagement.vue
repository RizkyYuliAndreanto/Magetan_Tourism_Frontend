<template>
  <div>
    <div class="action-bar">
      <button
        v-if="!formKategoriOpen"
        class="action-button create-button"
        @click="openKategoriForm()">
        <i class="fas fa-plus-circle"></i> Tambah Kategori Baru
      </button>
    </div>

    <div v-if="formKategoriOpen">
      <CategoryForm
        :is-editing="isEditingKategori"
        :initial-data="formKategori"
        @close-form="closeKategoriForm"
        @save-kategori="handleSaveKategori" />
    </div>

    <div v-else class="table-container card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Kategori</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="kategoriList.length === 0">
              <td colspan="4" class="no-data-found">
                Tidak ada kategori berita yang tersedia.
              </td>
            </tr>
            <tr v-for="kategori in kategoriList" :key="kategori.id_kategori">
              <td>{{ kategori.id_kategori }}</td>
              <td>{{ kategori.nama_kategori }}</td>
              <td>{{ kategori.deskripsi_kategori || "-" }}</td>
              <td class="actions">
                <button
                  class="action-button edit-button"
                  @click="openKategoriForm(kategori)"
                  title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="action-button delete-button"
                  @click="showDeleteConfirm(kategori.id_kategori)"
                  title="Hapus">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
import { ref, onMounted, nextTick } from "vue";
import axios from 'axios';
import CategoryForm from "./CategoryForm.vue";
import BasePopUp from "../../../components/pop-up/BasePopUp.vue";

const kategoriList = ref([]);
const formKategoriOpen = ref(false);
const isEditingKategori = ref(false);
const formKategori = ref(null);

// State untuk pop-up
const showPopUp = ref(false);
const popUpStatus = ref("");
const popUpAction = ref("");
const popUpEntity = ref("Kategori Berita");
const popUpMessage = ref("");
const kategoriToDeleteId = ref(null);

// Fungsi yang memicu pop-up konfirmasi
const showDeleteConfirm = (id) => {
  kategoriToDeleteId.value = id;
  popUpStatus.value = "confirm";
  popUpAction.value = "confirmDelete";
  showPopUp.value = true;
};

// Fungsi yang dipanggil setelah konfirmasi hapus dari pop-up
const handleDeleteConfirmed = async () => {
  // Tutup popup konfirmasi agar komponen unmount, supaya timer popup hasil tidak ikut kepotong
  closePopUp();
  await nextTick();

  try {
    const token = localStorage.getItem("access_token");
    await axios.delete(
      `http://localhost:5000/api/kategori-berita/${kategoriToDeleteId.value}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    openPopUp("success", "delete");
    fetchKategoriData();
  } catch (err) {
    console.error("Gagal menghapus kategori:", err.response?.data);
    openPopUp(
      "error",
      "delete",
      err.response?.data?.error || "Gagal menghapus kategori."
    );
  } finally {
    kategoriToDeleteId.value = null;
  }
};

// Fungsi utilitas untuk mengontrol pop-up
const openPopUp = (status, action, message = "") => {
  popUpStatus.value = status;
  popUpAction.value = action;
  popUpMessage.value = message;

  if (showPopUp.value) {
    // Jika popup masih tampil, matikan dulu lalu nyalakan lagi (reset timer)
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

const fetchKategoriData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/kategori-berita"
    );
    kategoriList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data kategori berita:", err);
    openPopUp("error", "fetch", "Gagal memuat data kategori berita.");
  }
};

const openKategoriForm = (kategori = null) => {
  isEditingKategori.value = !!kategori;
  formKategori.value = kategori
    ? { ...kategori }
    : { id_kategori: null, nama_kategori: "", deskripsi_kategori: "" };
  formKategoriOpen.value = true;
};

const closeKategoriForm = () => {
  formKategoriOpen.value = false;
  formKategori.value = null;
  isEditingKategori.value = false;
  fetchKategoriData();
};

const handleSaveKategori = async (kategoriData) => {
  try {
    let token = localStorage.getItem("access_token");
    if (!token || token === "null" || token === "undefined") {
      openPopUp(
        "error",
        "create",
        "Token tidak ditemukan. Silakan login ulang."
      );
      return;
    }
    token = token.trim();
    console.log("Token dipakai:", token);
    if (isEditingKategori.value) {
      await axios.put(
        `http://localhost:5000/api/kategori-berita/${kategoriData.id_kategori}`,
        kategoriData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      openPopUp("success", "update");
    } else {
      await axios.post(
        "http://localhost:5000/api/kategori-berita",
        kategoriData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      openPopUp("success", "create");
    }
    closeKategoriForm();
  } catch (err) {
    console.error("Gagal menyimpan kategori:", err.response?.data);
    if (err.response?.data?.message === "Token is not valid") {
      openPopUp(
        "error",
        kategoriData.id_kategori ? "update" : "create",
        "Token tidak valid atau kadaluarsa. Silakan login ulang."
      );
    } else {
      openPopUp(
        "error",
        kategoriData.id_kategori ? "update" : "create",
        err.response?.data?.error || "Gagal menyimpan kategori."
      );
    }
  }
};

onMounted(() => {
  fetchKategoriData();
});
</script>

<style scoped>
/* Anda dapat mempertahankan gaya CSS yang sudah ada */
.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
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
  color: #6c757d;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
</style>
