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
                  @click="handleDeleteKategori(kategori.id_kategori)"
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import CategoryForm from "./CategoryForm.vue";

const kategoriList = ref([]);
const formKategoriOpen = ref(false);
const isEditingKategori = ref(false);
const formKategori = ref(null);

const fetchKategoriData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/kategori-berita"
    );
    kategoriList.value = response.data;
  } catch (err) {
    console.error("Gagal memuat data kategori berita:", err);
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
};

const handleSaveKategori = async (kategoriData) => {
  try {
    const token = localStorage.getItem("access_token");
    if (isEditingKategori.value) {
      await axios.put(
        `http://localhost:5000/api/kategori-berita/${kategoriData.id_kategori}`,
        kategoriData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Kategori berhasil diperbarui!");
    } else {
      await axios.post(
        "http://localhost:5000/api/kategori-berita",
        kategoriData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Kategori berhasil ditambahkan!");
    }
    closeKategoriForm();
    fetchKategoriData();
  } catch (err) {
    console.error("Gagal menyimpan kategori:", err.response?.data);
    alert(err.response?.data?.error || "Gagal menyimpan kategori.");
  }
};

const handleDeleteKategori = async (id) => {
  if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:5000/api/kategori-berita/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Kategori berhasil dihapus!");
      fetchKategoriData();
    } catch (err) {
      console.error("Gagal menghapus kategori:", err.response?.data);
      alert(err.response?.data?.error || "Gagal menghapus kategori.");
    }
  }
};

onMounted(() => {
  fetchKategoriData();
});
</script>

<style scoped>
/* =========== Perubahan Styling untuk Konsistensi =========== */
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

/* Mengubah .table-container dari `.table-responsive.card` */
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
