// Template untuk konsistensi semua admin management views
export const MANAGEMENT_TEMPLATE = {
  // Header Section Template
  HEADER_HTML: `
    <!-- Header dengan Penjelasan -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-[ICON]"></i>
          [TITLE]
        </h2>
        <p class="subtitle">
          [DESCRIPTION]
        </p>
      </div>
      <div class="action-bar">
        <button v-if="!form[ENTITY]Open" class="action-button create-button" @click="open[ENTITY]Form()">
          <i class="fas fa-plus-circle"></i> Tambah [ENTITY] Baru
        </button>
      </div>
    </div>

    <!-- Form Overlay -->
    <div v-if="form[ENTITY]Open" class="form-overlay">
      <div class="form-card card">
        <[ENTITY]Form
          :is-editing="isEditing[ENTITY]"
          :initial-data="form[ENTITY]"
          :kategori-list="kategoriList"
          @close-form="close[ENTITY]Form"
          @save-[ENTITY_LOWER]="handleSave[ENTITY]"
          @update-[ENTITY_LOWER]="handleUpdate[ENTITY]"
        />
      </div>
    </div>

    <div v-else>
      <!-- Statistik -->
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-[ICON]"></i>
          </div>
          <div class="stat-content">
            <h3>{{ [ENTITY_LOWER]List.length }}</h3>
            <p>Total [ENTITY]</p>
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
            <h3>{{ [ENTITY_LOWER]BulanIni }}</h3>
            <p>[ENTITY] Bulan Ini</p>
          </div>
        </div>
      </div>

      <!-- Tabel [ENTITY] -->
      <div class="table-container card">
        <div class="table-header">
          <h3 class="table-title">
            <i class="fas fa-list"></i>
            Daftar [ENTITY]
          </h3>
          <div class="table-count">
            Total: <strong>{{ [ENTITY_LOWER]List.length }}</strong> [ENTITY_LOWER]
          </div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <!-- Table content here -->
          </table>
        </div>
      </div>
    </div>
  `,

  // CSS Template
  CSS_STYLES: `
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

/* Action Button */
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

/* Table Styles */
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  color: white;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}

.actions .delete-button:hover {
  background-color: #c82333;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
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
  content: '';
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
  `,

  // JavaScript template functions
  JS_TEMPLATE_FUNCTIONS: `
// Template functions untuk body scroll control
const openFormWithOverlay = (entityName, formRef, isEditingRef, formDataRef, initialData = null) => {
  isEditingRef.value = !!initialData;
  if (initialData) {
    formDataRef.value = { ...initialData };
  } else {
    formDataRef.value = getEmptyFormData(entityName);
  }
  formRef.value = true;
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
};

const closeFormWithOverlay = (formRef, formDataRef, isEditingRef, fetchDataFn) => {
  formRef.value = false;
  formDataRef.value = null;
  isEditingRef.value = false;
  
  // Restore body scroll
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
  
  if (fetchDataFn) fetchDataFn();
};

// Template untuk computed properties statistik
const createMonthlyStatsComputed = (dataList) => {
  return computed(() => {
    const bulanIni = new Date();
    bulanIni.setDate(1);
    bulanIni.setHours(0, 0, 0, 0);
    
    return dataList.value.filter(item => {
      const tanggalPublikasi = new Date(item.tanggal_publikasi || item.created_at);
      return tanggalPublikasi >= bulanIni;
    }).length;
  });
};
  `,
};

export default MANAGEMENT_TEMPLATE;
