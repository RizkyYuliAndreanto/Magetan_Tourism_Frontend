# 🚀 **PANDUAN KONSISTENSI ADMIN MANAGEMENT VIEWS**

## ✅ **SUDAH DIKONVERSI:**

- ✅ KategoriPpidManagement.vue (PPID Categories)
- ✅ KontenPpidManagement.vue (PPID Content)
- ✅ NewsManagement.vue (Berita)

## 📋 **YANG PERLU DIKONVERSI:**

### 1. **DestinasiManagement.vue**

- Icon: `fa-map-marker-alt`
- Entity: `Destinasi`
- Description: "Kelola destinasi wisata dan tempat menarik di Magetan. Setiap destinasi dapat dikategorikan dan dilengkapi dengan informasi detail."

### 2. **EventManagement.vue**

- Icon: `fa-calendar-plus`
- Entity: `Event`
- Description: "Kelola event dan kegiatan yang akan berlangsung. Setiap event dapat dijadwalkan dengan informasi lengkap."

### 3. **AkomodasiManagement.vue**

- Icon: `fa-bed`
- Entity: `Akomodasi`
- Description: "Kelola data penginapan dan akomodasi yang tersedia. Membantu wisatawan menemukan tempat menginap."

### 4. **MediaGaleriManagement.vue**

- Icon: `fa-images`
- Entity: `Media`
- Description: "Kelola galeri foto dan video untuk mempromosikan keindahan Magetan."

### 5. **PengumumanManagement.vue**

- Icon: `fa-bullhorn`
- Entity: `Pengumuman`
- Description: "Kelola pengumuman dan informasi penting yang perlu disampaikan kepada masyarakat."

### 6. **UMKMManagement.vue**

- Icon: `fa-store`
- Entity: `UMKM`
- Description: "Kelola data UMKM dan usaha kecil menengah untuk mendukung ekonomi lokal."

## 📝 **TEMPLATE KONVERSI:**

### **1. Template HTML:**

```vue
<template>
  <div>
    <!-- Header dengan Penjelasan -->
    <div class="header-section">
      <div class="header-info">
        <h2 class="main-title">
          <i class="fas fa-[ICON]"></i>
          Manajemen [ENTITY]
        </h2>
        <p class="subtitle">[DESCRIPTION]</p>
      </div>
      <div class="action-bar">
        <button
          v-if="!form[ENTITY]Open"
          class="action-button create-button"
          @click="open[ENTITY]Form()">
          <i class="fas fa-plus-circle"></i> Tambah [ENTITY] Baru
        </button>
      </div>
    </div>

    <!-- Form Overlay -->
    <div v-if="form[ENTITY]Open" class="form-overlay">
      <div class="form-card card">
        <[ENTITY]Form :is-editing="isEditing[ENTITY]"
        :initial-data="form[ENTITY]" @close-form="close[ENTITY]Form"
        @save-[ENTITY_LOWER]="handleSave[ENTITY]"
        @update-[ENTITY_LOWER]="handleUpdate[ENTITY]" />
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
            Total:
            <strong>{{ [ENTITY_LOWER]List.length }}</strong> [ENTITY_LOWER]
          </div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th><i class="fas fa-hashtag"></i> ID</th>
                <th><i class="fas fa-[MAIN_ICON]"></i> [MAIN_FIELD]</th>
                <!-- Add more columns as needed -->
                <th><i class="fas fa-cogs"></i> Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="[ENTITY_LOWER]List.length === 0">
                <td colspan="6" class="no-data-found">
                  <div class="empty-state">
                    <i class="fas fa-[ICON]"></i>
                    <p>Belum ada [ENTITY_LOWER] yang tersedia.</p>
                    <small
                      >Klik tombol "Tambah [ENTITY] Baru" untuk membuat
                      [ENTITY_LOWER] pertama.</small
                    >
                  </div>
                </td>
              </tr>
              <!-- Table rows here -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
```

### **2. Script Modifications:**

```javascript
// Import computed
import { ref, computed, onMounted, nextTick } from 'vue';

// Add computed property
const [ENTITY_LOWER]BulanIni = computed(() => {
  const bulanIni = new Date();
  bulanIni.setDate(1);
  bulanIni.setHours(0, 0, 0, 0);

  return [ENTITY_LOWER]List.value.filter([ENTITY_LOWER] => {
    const tanggalPublikasi = new Date([ENTITY_LOWER].tanggal_publikasi || [ENTITY_LOWER].created_at);
    return tanggalPublikasi >= bulanIni;
  }).length;
});

// Update open function
const open[ENTITY]Form = (data = null) => {
  // existing logic...

  // Add body scroll control
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
};

// Update close function
const close[ENTITY]Form = () => {
  // existing logic...

  // Restore body scroll
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';

  // existing fetch calls...
};
```

### **3. CSS Template:**

Copy semua CSS dari NewsManagement.vue yang sudah dikonversi, mulai dari:

- Header Section styles
- Stats Section styles
- Table styles dengan icons
- Form Overlay styles
- Responsive design

## ⚡ **LANGKAH CEPAT KONVERSI:**

### **Per Komponen:**

1. **Replace template** dengan struktur baru (header + stats + table)
2. **Add computed property** untuk statistik bulanan
3. **Update open/close functions** dengan body scroll control
4. **Replace CSS** dengan template yang konsisten
5. **Update table headers** dengan icons
6. **Add empty state** dengan visual yang menarik

### **Replacements untuk setiap komponen:**

- `[ICON]` → Icon FontAwesome yang sesuai
- `[ENTITY]` → Nama entitas (Pascal Case)
- `[ENTITY_LOWER]` → Nama entitas (camel Case)
- `[DESCRIPTION]` → Deskripsi fungsionalitas
- `[MAIN_FIELD]` → Field utama untuk ditampilkan

## 🎯 **HASIL AKHIR:**

- ✅ Semua management views menggunakan popup overlay
- ✅ Konsistensi visual dan UX di seluruh admin panel
- ✅ Statistik dashboard yang informatif
- ✅ Header dan tabel dengan icons yang jelas
- ✅ Empty states yang user-friendly
- ✅ Responsive design untuk semua device
- ✅ Body scroll control yang proper

**Total estimated time: ~2-3 hours untuk semua komponen** 🚀
