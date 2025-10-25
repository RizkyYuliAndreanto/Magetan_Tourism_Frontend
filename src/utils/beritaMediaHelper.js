// Frontend Helper untuk Update Berita dengan Media Galeri
// File: src/utils/beritaMediaHelper.js

export class BeritaMediaHelper {
  /**
   * Prepare data untuk update berita dengan media operations
   * @param {object} beritaData - Data berita
   * @param {array} currentMedia - Media galeri yang ada saat ini
   * @param {array} newMedia - Media galeri baru yang akan ditambah
   * @param {array} deletedMediaIds - ID media yang akan dihapus
   * @returns {FormData} - FormData siap kirim ke backend
   */
  static prepareUpdateData(
    beritaData,
    currentMedia,
    newMedia,
    deletedMediaIds
  ) {
    const formData = new FormData();

    // 1. Tambah data berita
    Object.keys(beritaData).forEach((key) => {
      if (beritaData[key] !== null && beritaData[key] !== undefined) {
        if (key === "gambar_hero_berita" && beritaData[key] instanceof File) {
          formData.append(key, beritaData[key]);
        } else if (typeof beritaData[key] !== "object") {
          formData.append(key, beritaData[key]);
        }
      }
    });

    // 2. Determine media operations
    const allCurrentIds = currentMedia.map((m) => m.id_media_galeri || m.id);
    const deletedIds = deletedMediaIds || [];
    const keptIds = allCurrentIds.filter((id) => !deletedIds.includes(id));

    // Media yang akan diupdate (yang ada perubahan deskripsi/urutan)
    const updatedMedia = currentMedia
      .filter((media) => {
        const id = media.id_media_galeri || media.id;
        return (
          keptIds.includes(id) &&
          (media.hasChanged ||
            media._originalDeskripsi !== media.deskripsi_file ||
            media._originalUrutan !== media.urutan_tampil)
        );
      })
      .map((media) => ({
        id: media.id_media_galeri || media.id,
        deskripsi_file: media.deskripsi_file || "",
        urutan_tampil: media.urutan_tampil || 1,
      }));

    const mediaOperations = {
      keep: keptIds,
      update: updatedMedia,
      delete: deletedIds,
    };

    formData.append("media_operations", JSON.stringify(mediaOperations));

    // 3. Tambah file media baru
    if (newMedia && newMedia.length > 0) {
      newMedia.forEach((media, index) => {
        if (media.file instanceof File) {
          formData.append("media_galeri_files", media.file);
          formData.append(
            `media_deskripsi_${index}`,
            media.deskripsi_file || ""
          );
          formData.append(
            `media_urutan_${index}`,
            media.urutan_tampil || 100 + index
          );
        }
      });
    }

    return formData;
  }

  /**
   * Update berita dengan media operations menggunakan endpoint baru
   * @param {number} beritaId - ID berita
   * @param {FormData} formData - Data yang sudah dipersiapkan
   * @param {string} token - Auth token
   * @returns {Promise} - Response dari API
   */
  static async updateBeritaWithMedia(beritaId, formData, token) {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/berita/${beritaId}/with-media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Berita updated successfully:", response.data.media_stats);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to update berita:", error.response?.data);
      throw error;
    }
  }

  /**
   * Helper untuk track perubahan pada media existing
   * Panggil ini saat media gallery component di-mount
   */
  static trackMediaChanges(mediaList) {
    return mediaList.map((media) => ({
      ...media,
      _originalDeskripsi: media.deskripsi_file,
      _originalUrutan: media.urutan_tampil,
      hasChanged: false,
    }));
  }

  /**
   * Mark media sebagai changed
   */
  static markAsChanged(media, field, newValue) {
    media[field] = newValue;
    media.hasChanged = true;
    return media;
  }
}

// Contoh penggunaan di Vue component:
/*
// Di NewsManagement.vue atau NewsForm.vue

import { BeritaMediaHelper } from '@/utils/beritaMediaHelper';

// Di method handleUpdateBerita:
const handleUpdateBerita = async (beritaData, newGalleryFiles, deletedGalleryIds) => {
  try {
    const token = localStorage.getItem('access_token');
    
    // Gunakan helper untuk prepare data
    const formData = BeritaMediaHelper.prepareUpdateData(
      beritaData,
      initialGalleryFiles.value, // Media existing yang sudah di-track
      newGalleryFiles,
      deletedGalleryIds
    );
    
    // Update dengan endpoint baru
    const result = await BeritaMediaHelper.updateBeritaWithMedia(
      beritaData.id_berita,
      formData,
      token
    );
    
    console.log('Media operations completed:', result.media_stats);
    openPopUp('success', 'update');
    closeBeritaForm();
    
  } catch (error) {
    console.error('Update failed:', error);
    openPopUp('error', 'update', error.response?.data?.error || 'Gagal memperbarui berita');
  }
};

// Di mounted() atau setup():
onMounted(() => {
  // Track changes untuk media existing
  if (props.isEditing && beritaData.galeriBerita) {
    initialGalleryFiles.value = BeritaMediaHelper.trackMediaChanges(beritaData.galeriBerita);
  }
});

// Saat user mengubah deskripsi atau urutan:
const onMediaDescriptionChange = (media, newDescription) => {
  BeritaMediaHelper.markAsChanged(media, 'deskripsi_file', newDescription);
};

const onMediaOrderChange = (media, newOrder) => {
  BeritaMediaHelper.markAsChanged(media, 'urutan_tampil', newOrder);
};
*/
