// Contoh implementasi update untuk NewsManagement.vue
// Ganti method handleUpdateBerita yang lama dengan yang ini:

const handleUpdateBerita = async (
  formData,
  galleryFiles,
  deletedGalleryIds
) => {
  try {
    const token = localStorage.getItem("access_token");
    const id = formData.get("id_berita");

    console.log("🔄 Starting atomic update berita with media...");
    console.log("Berita ID:", id);
    console.log("New gallery files:", galleryFiles?.length || 0);
    console.log("Deleted gallery IDs:", deletedGalleryIds?.length || 0);

    // Prepare media operations untuk endpoint baru
    const existingUpdates = [];

    // Extract existing gallery updates dari formData
    for (let [key, value] of formData.entries()) {
      if (key === "existing_gallery_updates") {
        try {
          existingUpdates.push(JSON.parse(value));
        } catch (parseError) {
          console.error("Error parsing existing gallery update:", parseError);
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
      console.warn(
        "Could not fetch current media, proceeding without keep operations"
      );
    }

    // Determine media operations
    const deletedIds = deletedGalleryIds || [];
    const keepIds = currentMediaIds.filter((id) => !deletedIds.includes(id));

    const mediaOperations = {
      keep: keepIds,
      update: existingUpdates,
      delete: deletedIds,
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

    console.log("📤 Sending atomic update request...");
    console.log("Media operations:", mediaOperations);

    // Send atomic update request
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

    console.log("✅ Atomic update completed successfully!");
    console.log("📊 Media operations stats:", response.data.media_stats);

    openPopUp("success", "update");
    closeBeritaForm();

    // Refresh data
    await fetchData();
  } catch (err) {
    console.error(
      "❌ Atomic update failed:",
      err.response?.data || err.message
    );

    // Fallback ke method lama jika endpoint baru gagal
    if (
      err.response?.status === 404 &&
      err.response?.data?.error?.includes("Not Found")
    ) {
      console.log("🔄 Falling back to legacy update method...");
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

    console.log("🔄 Using legacy update method...");

    // 1. Update berita terlebih dahulu
    await axios.put(`http://localhost:5000/api/berita/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Berita berhasil diupdate");

    // 2. Update existing gallery files (jika ada perubahan deskripsi/urutan)
    const existingGalleryUpdates = [];
    for (let [key, value] of formData.entries()) {
      if (key === "existing_gallery_updates") {
        try {
          existingGalleryUpdates.push(JSON.parse(value));
        } catch (parseError) {
          console.error("Error parsing existing gallery update:", parseError);
        }
      }
    }

    if (existingGalleryUpdates.length > 0) {
      console.log("Mengupdate media galeri yang ada:", existingGalleryUpdates);
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
            console.log(
              `Media galeri ${update.id_media_galeri} berhasil diupdate`
            );
          } catch (updateError) {
            console.error(
              `Gagal mengupdate media galeri ${update.id_media_galeri}:`,
              updateError
            );
          }
        })
      );
    }

    // 3. Hapus media galeri yang dipilih menggunakan batch delete
    if (deletedGalleryIds && deletedGalleryIds.length > 0) {
      console.log("Menghapus media galeri (batch):", deletedGalleryIds);
      try {
        await axios.delete("http://localhost:5000/api/media-galeri/batch", {
          data: { mediaIds: deletedGalleryIds },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(
          `${deletedGalleryIds.length} media galeri berhasil dihapus`
        );
      } catch (deleteError) {
        console.error("Gagal menghapus media galeri batch:", deleteError);
      }
    }

    // 4. Tambah media galeri baru (jika ada)
    if (galleryFiles && galleryFiles.length > 0) {
      console.log(
        "Menambah media galeri baru:",
        galleryFiles.length,
        "file(s)"
      );
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
      console.log("Media galeri baru berhasil ditambahkan");
    }

    openPopUp("success", "update");
    closeBeritaForm();
  } catch (err) {
    console.error("Gagal memperbarui berita (legacy):", err.response?.data);
    openPopUp(
      "error",
      "update",
      err.response?.data?.error || "Gagal memperbarui berita."
    );
  }
};
