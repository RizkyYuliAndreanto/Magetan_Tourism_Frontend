<template>
  <div class="auth-view">
    <div class="auth-card">
      <h2 class="auth-title">Log In to Your Account</h2>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="identifier" class="form-label">Username or Email</label>
          <input
            type="text"
            id="identifier"
            v-model="identifier"
            class="form-input"
            required />
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-input"
            required />
        </div>
        <button type="submit" class="auth-button">Log In</button>
      </form>
      <p class="auth-link">
        Don't have an account? <router-link to="/register">Sign Up</router-link>
      </p>
      <p class="auth-link">
        <router-link to="/forgot-password">Forgot Password?</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { onLoginSuccess } from "../utils/auth.js";

const identifier = ref("");
const password = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    // Set flag untuk mencegah router guard interference
    window.isLoggingIn = true;

    // Endpoint backend untuk login adalah POST /login
    // Backend mengharapkan identifier (username/email) dan password
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      identifier: identifier.value,
      password: password.value,
    });

    console.log("Login berhasil:", response.data);

    // Simpan token dan data admin di localStorage
    localStorage.setItem("access_token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.admin));

    // Inisialisasi session management setelah login berhasil
    await onLoginSuccess();

    // Arahkan ke dashboard admin setelah login berhasil
    await router.push("/admin");

    // Clear flag setelah navigasi berhasil
    setTimeout(() => {
      window.isLoggingIn = false;
    }, 100);
  } catch (error) {
    // Clear flag jika login gagal
    window.isLoggingIn = false;

    console.error("Login gagal:", error.response?.data || error.message);
    alert(
      error.response?.data?.error ||
        "Login gagal. Periksa kembali identifier dan password Anda."
    );
  }
};
</script>

<style scoped>
/* Gaya CSS tetap sama */
.auth-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding-top: 80px;
  background-color: var(--off-white);
  color: var(--text-color-dark);
}

.auth-card {
  background-color: var(--pure-white);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 20px var(--box-shadow-light);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.auth-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 30px;
  color: var(--primary-blue);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  text-align: left;
}

.form-label {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
  color: var(--text-color-dark);
}

.form-input {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: var(--off-white);
  color: var(--text-color-dark);
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(var(--primary-blue-rgb), 0.2);
}

.auth-button {
  padding: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--pure-white);
  background-color: var(--primary-blue);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.auth-button:hover {
  background-color: var(--primary-blue-dark);
  transform: translateY(-2px);
}

.auth-link {
  margin-top: 20px;
  font-size: 0.9rem;
}

.auth-link a {
  color: var(--primary-blue);
  text-decoration: none;
  font-weight: 600;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>
<style scoped>
.auth-view {
  overflow-y: auto;
}
</style>
