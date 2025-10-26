<template>
  <div class="auth-view">
    <div class="auth-card">
      <h2 class="auth-title">Create Your Account</h2>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="nama_lengkap" class="form-label">Full Name</label>
          <input
            type="text"
            id="nama_lengkap"
            v-model="nama_lengkap"
            class="form-input"
            required />
        </div>
        <div class="form-group">
          <label for="email" class="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-input"
            required />
        </div>
        <div class="form-group">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
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
        <button type="submit" class="auth-button">Sign Up</button>
      </form>
      <p class="auth-link">
        Already have an account? <router-link to="/login">Log In</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const nama_lengkap = ref("");
const email = ref("");
const username = ref("");
const password = ref("");
const router = useRouter();

const handleRegister = async () => {
  try {
    // Endpoint backend untuk pendaftaran adalah POST /register
    // Backend mengharapkan username, password, nama_lengkap, dan email
    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        nama_lengkap: nama_lengkap.value,
        email: email.value,
        username: username.value,
        password: password.value,
      }
    );

    alert("Pendaftaran berhasil! Silakan login.");
    router.push("/login");
  } catch (error) {
    // Tangani error spesifik dari backend (misalnya, username/email sudah ada)
    alert(error.response?.data?.error || "Pendaftaran gagal");
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
