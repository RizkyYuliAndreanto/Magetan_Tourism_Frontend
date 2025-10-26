<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">
          {{ isEdit ? "Edit Admin" : "Tambah Admin Baru" }}
        </h3>
        <button @click="$emit('close')" class="close-btn">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="user-form">
          <!-- Nama -->
          <div class="form-group">
            <label for="nama_lengkap" class="form-label required"
              >Nama Lengkap</label
            >
            <input
              id="nama_lengkap"
              v-model="form.nama_lengkap"
              type="text"
              class="form-input"
              :class="{ error: errors.nama_lengkap }"
              placeholder="Masukkan nama lengkap"
              required />
            <span v-if="errors.nama_lengkap" class="error-message">{{
              errors.nama_lengkap
            }}</span>
          </div>

          <!-- Username -->
          <div class="form-group">
            <label for="username" class="form-label required">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              class="form-input"
              :class="{ error: errors.username }"
              placeholder="Masukkan username"
              required />
            <span v-if="errors.username" class="error-message">{{
              errors.username
            }}</span>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label required">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-input"
              :class="{ error: errors.email }"
              placeholder="Masukkan email"
              required />
            <span v-if="errors.email" class="error-message">{{
              errors.email
            }}</span>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label
              for="password"
              class="form-label"
              :class="{ required: !isEdit }">
              Password
              {{ isEdit ? "(Kosongkan jika tidak ingin mengubah)" : "" }}
            </label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input pr-12"
                :class="{ error: errors.password }"
                placeholder="Masukkan password"
                :required="!isEdit" />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle">
                <svg
                  v-if="showPassword"
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{
              errors.password
            }}</span>
            <div v-if="!isEdit" class="password-requirements">
              <p class="text-sm text-gray-600 mb-2">
                Password harus memenuhi kriteria:
              </p>
              <ul class="password-criteria">
                <li :class="{ valid: passwordCriteria.minLength }">
                  <svg
                    class="w-4 h-4"
                    :class="
                      passwordCriteria.minLength
                        ? 'text-green-500'
                        : 'text-gray-400'
                    "
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"></path>
                  </svg>
                  Minimal 6 karakter
                </li>
                <li :class="{ valid: passwordCriteria.hasNumber }">
                  <svg
                    class="w-4 h-4"
                    :class="
                      passwordCriteria.hasNumber
                        ? 'text-green-500'
                        : 'text-gray-400'
                    "
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"></path>
                  </svg>
                  Mengandung angka
                </li>
                <li :class="{ valid: passwordCriteria.hasLetter }">
                  <svg
                    class="w-4 h-4"
                    :class="
                      passwordCriteria.hasLetter
                        ? 'text-green-500'
                        : 'text-gray-400'
                    "
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"></path>
                  </svg>
                  Mengandung huruf
                </li>
              </ul>
            </div>
          </div>

          <!-- Level Akses -->
          <div class="form-group">
            <label for="level_akses" class="form-label required"
              >Level Akses</label
            >
            <select
              id="level_akses"
              v-model="form.level_akses"
              class="form-select"
              :class="{ error: errors.level_akses }"
              required>
              <option value="">Pilih Level Akses</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
            <span v-if="errors.level_akses" class="error-message">{{
              errors.level_akses
            }}</span>
          </div>

          <!-- Status (hanya untuk edit) -->
          <div v-if="isEdit" class="form-group">
            <label class="form-label">Status Akun</label>
            <div class="status-toggle">
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  v-model="form.is_active"
                  class="toggle-input" />
                <span class="toggle-slider"></span>
                <span class="toggle-label">
                  {{ form.is_active ? "Aktif" : "Diblokir" }}
                </span>
              </label>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" @click="$emit('close')" class="btn-secondary">
          Batal
        </button>
        <button
          type="submit"
          @click="handleSubmit"
          :disabled="!isFormValid || loading"
          class="btn-primary"
          :class="{ loading: loading }">
          <svg
            v-if="loading"
            class="animate-spin w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isEdit ? "Perbarui" : "Simpan" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";

const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "save"]);

// Reactive data
const loading = ref(false);
const showPassword = ref(false);

const form = reactive({
  nama_lengkap: "",
  username: "",
  email: "",
  password: "",
  level_akses: "",
  is_active: true,
});

const errors = reactive({
  nama_lengkap: "",
  username: "",
  email: "",
  password: "",
  level_akses: "",
});

// Computed properties
const passwordCriteria = computed(() => {
  const password = form.password;
  return {
    minLength: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password),
  };
});

const isFormValid = computed(() => {
  const requiredFields = ["nama_lengkap", "username", "email", "level_akses"];
  const hasRequiredFields = requiredFields.every((field) =>
    form[field]?.trim()
  );

  if (!props.isEdit) {
    const hasValidPassword =
      form.password &&
      passwordCriteria.value.minLength &&
      passwordCriteria.value.hasNumber &&
      passwordCriteria.value.hasLetter;
    return hasRequiredFields && hasValidPassword;
  }

  return hasRequiredFields;
});

// Methods
const validateField = (field, value) => {
  errors[field] = "";

  switch (field) {
    case "nama_lengkap":
      if (!value || value.length < 2) {
        errors[field] = "Nama harus minimal 2 karakter";
      }
      break;

    case "username":
      if (!value || value.length < 3) {
        errors[field] = "Username harus minimal 3 karakter";
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        errors[field] =
          "Username hanya boleh berisi huruf, angka, dan underscore";
      }
      break;

    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errors[field] = "Email wajib diisi";
      } else if (!emailRegex.test(value)) {
        errors[field] = "Format email tidak valid";
      }
      break;

    case "password":
      if (!props.isEdit && !value) {
        errors[field] = "Password wajib diisi";
      } else if (value && !passwordCriteria.value.minLength) {
        errors[field] = "Password minimal 6 karakter";
      } else if (
        value &&
        (!passwordCriteria.value.hasNumber || !passwordCriteria.value.hasLetter)
      ) {
        errors[field] = "Password harus mengandung huruf dan angka";
      }
      break;

    case "level_akses":
      if (!value) {
        errors[field] = "Level akses wajib dipilih";
      }
      break;
  }
};

const handleSubmit = async () => {
  // Validate all fields
  Object.keys(form).forEach((field) => {
    if (field !== "is_active") {
      validateField(field, form[field]);
    }
  });

  // Check if there are any errors
  const hasErrors = Object.values(errors).some((error) => error !== "");
  if (hasErrors || !isFormValid.value) {
    return;
  }

  loading.value = true;

  try {
    const userData = { ...form };

    // Remove empty password for edit mode
    if (props.isEdit && !userData.password) {
      delete userData.password;
    }

    // Convert is_active to is_blocked for API
    if (props.isEdit) {
      userData.is_blocked = !userData.is_active;
      delete userData.is_active;
    }

    await emit("save", userData);
  } catch (error) {
    // Error handling is managed by parent component
  } finally {
    loading.value = false;
  }
};

// Initialize form with user data for edit mode
const initializeForm = () => {
  if (props.isEdit && props.user) {
    Object.keys(form).forEach((key) => {
      if (key === "is_active") {
        form[key] = !props.user.is_blocked;
      } else if (key !== "password") {
        form[key] = props.user[key] || "";
      }
    });
  }
};

// Watchers
watch(() => props.user, initializeForm, { immediate: true });

// Form validation watchers
Object.keys(form).forEach((field) => {
  if (field !== "is_active") {
    watch(
      () => form[field],
      (value) => validateField(field, value)
    );
  }
});

// Lifecycle
onMounted(() => {
  initializeForm();
});
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 42rem;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  color: #9ca3af;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
}

.close-btn:hover {
  color: #4b5563;
}

.close-btn:focus {
  outline: none;
}

/* Modal Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Form Elements */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-label.required::after {
  content: "*";
  color: #ef4444;
  margin-left: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.15s;
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  border-color: #3b82f6;
}

.form-input.error {
  border-color: #ef4444;
}

.form-input.error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5);
  border-color: #ef4444;
}

.form-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  transition: all 0.15s;
  font-size: 0.875rem;
}

.form-select:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  border-color: #3b82f6;
}

.form-select.error {
  border-color: #ef4444;
}

.form-select.error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5);
  border-color: #ef4444;
}

.error-message {
  font-size: 0.875rem;
  color: #dc2626;
}

/* Password Input */
.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
}

.password-toggle:hover {
  color: #4b5563;
}

.password-toggle:focus {
  outline: none;
}

/* Password Requirements */
.password-requirements {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.password-criteria {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.password-criteria li {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.password-criteria li.valid {
  color: #059669;
}

.password-criteria svg {
  margin-right: 0.5rem;
  width: 16px !important;
  height: 16px !important;
  flex-shrink: 0;
}

/* Status Toggle */
.status-toggle {
  margin-top: 0.5rem;
}

.toggle-switch {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.toggle-slider {
  position: relative;
  display: inline-block;
  width: 2.5rem;
  height: 1.5rem;
  background-color: #d1d5db;
  border-radius: 9999px;
  transition: background-color 0.15s;
  margin-right: 0.75rem;
}

.toggle-input:checked + .toggle-slider {
  background-color: #10b981;
}

.toggle-slider::before {
  content: "";
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.15s;
}

.toggle-input:checked + .toggle-slider::before {
  transform: translateX(1rem);
}

.toggle-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  color: #374151;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.btn-secondary:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
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

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary.loading {
  cursor: wait;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    max-width: 100%;
    margin: 0 1rem;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .modal-footer {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }

  .btn-secondary,
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style>
