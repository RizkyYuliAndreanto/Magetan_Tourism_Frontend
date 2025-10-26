<template>
  <div class="pengaturan-akun-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Pengaturan Akun</h1>
          <p class="page-subtitle">Kelola admin dan super admin sistem</p>
        </div>
        <button @click="showCreateModal = true" class="btn-primary">
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Tambah Admin
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon stat-icon-blue">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7v-2a3 3 0 015.356-1.857M17 20v-2c0-.656.126-1.283.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857M15 11a4 4 0 118 0 4 4 0 01-8 0zm-8-2a3 3 0 116 0 3 3 0 01-6 0z"></path>
          </svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">Total Admin</p>
          <p class="stat-value">{{ stats.totalAdmin }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon-green">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">Admin Aktif</p>
          <p class="stat-value">{{ stats.activeAdmin }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon-red">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
          </svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">Admin Diblokir</p>
          <p class="stat-value">{{ stats.blockedAdmin }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon-purple">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
          </svg>
        </div>
        <div class="stat-info">
          <p class="stat-label">Super Admin</p>
          <p class="stat-value">{{ stats.superAdmin }}</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-box">
        <div class="search-input-wrapper">
          <svg
            class="search-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Cari admin..."
            class="search-input"
            @input="handleSearch" />
        </div>
      </div>

      <div class="filter-controls">
        <select
          v-model="selectedRole"
          @change="applyFilters"
          class="filter-select">
          <option value="">Semua Role</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>

        <select
          v-model="selectedStatus"
          @change="applyFilters"
          class="filter-select">
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="blocked">Diblokir</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="table-container">
      <div class="table-wrapper">
        <table class="users-table">
          <thead>
            <tr>
              <th>Admin</th>
              <th>Role</th>
              <th>Status</th>
              <th>Bergabung</th>
              <th>Aktivitas Terakhir</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" v-for="n in 5" :key="n" class="loading-row">
              <td colspan="6">
                <div class="skeleton-loader"></div>
              </td>
            </tr>
            <tr v-else-if="users.length === 0" class="no-data-row">
              <td colspan="6">
                <div class="no-data">
                  <svg
                    class="w-12 h-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                  <p>Tidak ada admin ditemukan</p>
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="user in users"
              :key="user.id_admin"
              class="user-row">
              <td class="user-info-cell">
                <div class="user-info">
                  <div class="user-avatar">
                    {{ getInitials(user.nama_lengkap) }}
                  </div>
                  <div class="user-details">
                    <div class="user-name">{{ user.nama_lengkap }}</div>
                    <div class="user-email">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span :class="['role-badge', `role-${user.level_akses}`]">
                  {{ getRoleLabel(user.level_akses) }}
                </span>
              </td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    user.is_blocked ? 'status-blocked' : 'status-active',
                  ]">
                  {{ user.is_blocked ? "Diblokir" : "Aktif" }}
                </span>
              </td>
              <td class="date-cell">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="date-cell">
                {{ formatDate(user.last_login) }}
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button
                    @click="editUser(user)"
                    class="btn-action btn-edit"
                    title="Edit Admin">
                    <svg
                      class="action-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <span class="action-text">Edit</span>
                  </button>

                  <button
                    v-if="user.is_blocked"
                    @click="unblockUser(user)"
                    class="btn-action btn-success"
                    title="Aktifkan Admin">
                    <svg
                      class="action-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="action-text">Aktifkan</span>
                  </button>

                  <button
                    v-else
                    @click="blockUser(user)"
                    class="btn-action btn-warning"
                    title="Blokir Admin">
                    <svg
                      class="action-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
                    </svg>
                    <span class="action-text">Blokir</span>
                  </button>

                  <button
                    @click="deleteUser(user)"
                    class="btn-action btn-danger"
                    title="Hapus Admin">
                    <svg
                      class="action-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span class="action-text">Hapus</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination-container">
      <div class="pagination-info">
        Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
        {{ Math.min(currentPage * itemsPerPage, totalItems) }} dari
        {{ totalItems }} admin
      </div>
      <div class="pagination">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-btn">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="['pagination-number', { active: page === currentPage }]">
          {{ page }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-btn">
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <UserModal
      v-if="showCreateModal"
      :user="editingUser"
      :is-edit="isEditMode"
      @close="closeModal"
      @save="handleUserSave" />

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showDeleteModal"
      title="Hapus Admin"
      :message="`Apakah Anda yakin ingin menghapus admin ${deletingUser?.nama}?`"
      confirm-text="Hapus"
      confirm-class="btn-danger"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false" />

    <!-- Block Confirmation Modal -->
    <ConfirmModal
      v-if="showBlockModal"
      title="Blokir Admin"
      :message="`Apakah Anda yakin ingin memblokir admin ${blockingUser?.nama}?`"
      confirm-text="Blokir"
      confirm-class="btn-warning"
      @confirm="confirmBlock"
      @cancel="showBlockModal = false" />

    <!-- Unblock Confirmation Modal -->
    <ConfirmModal
      v-if="showUnblockModal"
      title="Aktifkan Admin"
      :message="`Apakah Anda yakin ingin mengaktifkan admin ${unblockingUser?.nama}?`"
      confirm-text="Aktifkan"
      confirm-class="btn-success"
      @confirm="confirmUnblock"
      @cancel="showUnblockModal = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useToast } from "@/composables/useToast";
import UserModal from "./components/UserModal.vue";
import ConfirmModal from "@/components/ui/ConfirmModal.vue";
import { superAdminAPI } from "@/services/superAdminService";

// Reactive data
const users = ref([]);
const loading = ref(true);
const searchTerm = ref("");
const selectedRole = ref("");
const selectedStatus = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

// Modals
const showCreateModal = ref(false);
const showDeleteModal = ref(false);
const showBlockModal = ref(false);
const showUnblockModal = ref(false);

// User actions
const editingUser = ref(null);
const deletingUser = ref(null);
const blockingUser = ref(null);
const unblockingUser = ref(null);

// Statistics
const stats = ref({
  totalAdmin: 0,
  activeAdmin: 0,
  blockedAdmin: 0,
  superAdmin: 0,
});

const { showToast } = useToast();

// Computed properties
const isEditMode = computed(() => !!editingUser.value);

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, start + 4);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Methods
const fetchUsers = async () => {
  try {
    loading.value = true;
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      search: searchTerm.value,
      role: selectedRole.value,
      status: selectedStatus.value,
    };

    const response = await superAdminAPI.getAllUsers(params);

    // Extract data from correct response structure
    const responseData = response.data?.data || [];
    const paginationData = response.data?.pagination || {};

    // Update reactive data
    users.value = responseData;
    totalItems.value = paginationData.total || 0;
    totalPages.value = paginationData.totalPages || 0;

    // Calculate statistics manually from the user data
    stats.value = {
      totalAdmin: responseData.length,
      activeAdmin: responseData.filter((user) => !user.is_blocked).length,
      blockedAdmin: responseData.filter((user) => user.is_blocked).length,
    };
  } catch (error) {
    showToast("Error mengambil data admin", "error");
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchUsers();
};

const applyFilters = () => {
  currentPage.value = 1;
  fetchUsers();
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchUsers();
  }
};

const editUser = (user) => {
  editingUser.value = { ...user };
  showCreateModal.value = true;
};

const deleteUser = (user) => {
  deletingUser.value = user;
  showDeleteModal.value = true;
};

const blockUser = (user) => {
  blockingUser.value = user;
  showBlockModal.value = true;
};

const unblockUser = (user) => {
  unblockingUser.value = user;
  showUnblockModal.value = true;
};

const closeModal = () => {
  showCreateModal.value = false;
  editingUser.value = null;
};

const handleUserSave = async (userData) => {
  try {
    if (isEditMode.value) {
      await superAdminAPI.updateUser(editingUser.value.id_admin, userData);
      showToast("Admin berhasil diperbarui", "success");
    } else {
      await superAdminAPI.createUser(userData);
      showToast("Admin berhasil ditambahkan", "success");
    }

    closeModal();
    fetchUsers();
  } catch (error) {
    const message = error.response?.data?.message || "Terjadi kesalahan";
    showToast(message, "error");
  }
};

const confirmDelete = async () => {
  try {
    await superAdminAPI.deleteUser(deletingUser.value.id_admin);
    showToast("Admin berhasil dihapus", "success");
    showDeleteModal.value = false;
    deletingUser.value = null;
    fetchUsers();
  } catch (error) {
    const message = error.response?.data?.message || "Gagal menghapus admin";
    showToast(message, "error");
  }
};

const confirmBlock = async () => {
  try {
    await superAdminAPI.blockUser(blockingUser.value.id_admin);
    showToast("Admin berhasil diblokir", "success");
    showBlockModal.value = false;
    blockingUser.value = null;
    fetchUsers();
  } catch (error) {
    const message = error.response?.data?.message || "Gagal memblokir admin";
    showToast(message, "error");
  }
};

const confirmUnblock = async () => {
  try {
    await superAdminAPI.unblockUser(unblockingUser.value.id_admin);
    showToast("Admin berhasil diaktifkan", "success");
    showUnblockModal.value = false;
    unblockingUser.value = null;
    fetchUsers();
  } catch (error) {
    const message = error.response?.data?.message || "Gagal mengaktifkan admin";
    showToast(message, "error");
  }
};

// Utility functions
const getInitials = (name) => {
  if (!name || typeof name !== "string") {
    return "NA"; // Not Available
  }
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const getRoleLabel = (role) => {
  const roleLabels = {
    admin: "Admin",
    superadmin: "Super Admin",
  };
  return roleLabels[role] || role;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Lifecycle
onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
/* Main Container */
.pengaturan-akun-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 1.5rem;
}

/* Header */
.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .header-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #4b5563;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: box-shadow 0.15s;
}

.stat-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.stat-icon-blue {
  background-color: #dbeafe;
  color: #2563eb;
}

.stat-icon-green {
  background-color: #d1fae5;
  color: #059669;
}

.stat-icon-red {
  background-color: #fee2e2;
  color: #dc2626;
}

.stat-icon-purple {
  background-color: #ede9fe;
  color: #7c3aed;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

/* Filters */
.filters-section {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .filters-section {
    flex-direction: row;
  }
}

.search-box {
  flex: 1;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding-left: 2.5rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  border-color: #3b82f6;
}

.filter-controls {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .filter-controls {
    flex-direction: column;
  }
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  background-color: white;
  min-width: 140px;
}

@media (max-width: 640px) {
  .filter-select {
    min-width: 100%;
  }
}

.filter-select:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  border-color: #3b82f6;
}

/* Table */
.table-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.table-wrapper {
  overflow-x: auto;
}

.users-table {
  width: 100%;
}

.users-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.users-table td {
  padding: 1rem 1.5rem;
  white-space: nowrap;
  border-bottom: 1px solid #e5e7eb;
}

.user-row:hover {
  background-color: #f9fafb;
}

.loading-row td {
  padding: 1rem;
}

.skeleton-loader {
  height: 1rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.no-data-row td {
  text-align: center;
  padding: 3rem 0;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

/* User Info Cell */
.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  margin-right: 1rem;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.user-email {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Badges */
.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.role-admin {
  background-color: #dbeafe;
  color: #1e40af;
}

.role-superadmin {
  background-color: #ede9fe;
  color: #6b21a8;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-blocked {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Actions Cell */
.actions-cell {
  text-align: center;
  white-space: nowrap;
  min-width: 200px;
  padding: 0.75rem 1rem !important;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  background: white;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  min-width: fit-content;
}

.btn-action:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.action-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.action-text {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.025em;
}

/* Edit Button - Blue */
.btn-edit {
  color: #1e40af;
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.btn-edit:hover {
  background-color: #dbeafe;
  border-color: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

/* Success Button - Green */
.btn-success {
  color: #047857;
  border-color: #10b981;
  background-color: #ecfdf5;
}

.btn-success:hover {
  background-color: #d1fae5;
  border-color: #047857;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

/* Warning Button - Orange */
.btn-warning {
  color: #c2410c;
  border-color: #f97316;
  background-color: #fff7ed;
}

.btn-warning:hover {
  background-color: #fed7aa;
  border-color: #c2410c;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(249, 115, 22, 0.3);
}

/* Danger Button - Red */
.btn-danger {
  color: #b91c1c;
  border-color: #ef4444;
  background-color: #fef2f2;
}

.btn-danger:hover {
  background-color: #fecaca;
  border-color: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

/* Responsive Design for Mobile */
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
    align-items: stretch;
  }

  .btn-action {
    justify-content: flex-start;
    padding: 0.625rem 0.75rem;
    width: 100%;
  }

  .action-text {
    font-size: 0.875rem;
  }
}

@media (max-width: 640px) {
  .actions-cell {
    min-width: 120px;
  }

  .action-text {
    display: none;
  }

  .btn-action {
    padding: 0.5rem;
    width: auto;
    min-width: 2.5rem;
  }

  .action-buttons {
    flex-direction: row;
    justify-content: center;
  }
}

.date-cell {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Pagination */
.pagination-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

@media (min-width: 640px) {
  .pagination-container {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.pagination-info {
  font-size: 0.875rem;
  color: #374151;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.15s;
}

.pagination-btn:hover {
  background-color: #f9fafb;
}

.pagination-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-number {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.15s;
}

.pagination-number:hover {
  background-color: #f9fafb;
}

.pagination-number:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.pagination-number.active {
  background-color: #2563eb;
  color: white;
  border-color: #2563eb;
}

.pagination-number.active:hover {
  background-color: #1d4ed8;
}

/* Responsive */
@media (max-width: 640px) {
  .pengaturan-akun-container {
    padding: 1rem;
  }
}
</style>
