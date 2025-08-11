<template>
  <footer class="main-footer">
    <p>&copy; 2025 Adventure Explorer. All rights reserved.</p>
    <div class="footer-links">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
    </div>
  </footer>
</template>

<script setup>
// Tidak ada logika JavaScript khusus yang dibutuhkan di sini.
</script>

<style scoped>
.main-footer {
    background-color: var(--footer-bg-transparent);
    color: rgba(255, 255, 255, 0.8);
    padding: 40px 20px;
    text-align: center;
    border-top: 1px solid var(--border-light-transparent);
    margin-top: auto;
}

.main-footer p {
    margin-bottom: 15px;
    font-size: 0.95rem;
}

.footer-links {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
}

.footer-links a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-links a:hover {
    color: var(--pure-white);
}

@media screen and (max-width: 480px) {
    .footer-links {
        flex-direction: column;
        gap: 8px;
    }
}
</style>