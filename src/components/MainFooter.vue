<template>
  <footer class="main-footer">
    <div class="footer-container">
      <div class="footer-brand">
        <h2 class="brand-title">Adventure Explorer</h2>
        <p class="brand-desc">
          Jelajahi destinasi wisata terbaik di Magetan bersama kami.
        </p>
        <div class="footer-social">
          <a href="#" aria-label="Instagram" class="social-link">
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="6" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17" cy="7" r="1.5" />
            </svg>
          </a>
          <a href="#" aria-label="Facebook" class="social-link">
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="6" />
              <path d="M16 8h-2a2 2 0 0 0-2 2v2h4" />
              <path d="M12 16v-4" />
            </svg>
          </a>
          <a href="#" aria-label="YouTube" class="social-link">
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24">
              <rect x="2" y="6" width="20" height="12" rx="4" />
              <polygon points="10 9 16 12 10 15 10 9" />
            </svg>
          </a>
        </div>
      </div>
      <div class="footer-info">
        <h3>Kontak</h3>
        <ul>
          <li>
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24">
              <path d="M21 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3.5" />
              <path d="M3 10.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6.5" />
              <path d="M7 7v3.5" />
              <path d="M17 7v3.5" />
            </svg>
            Jl. Raya Magetan No. 123, Magetan, Jawa Timur
          </li>
          <li>
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24">
              <path
                d="M22 16.92V19a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.06.37 2.09.72 3.08a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.99.35 2.02.59 3.08.72A2 2 0 0 1 22 16.92z" />
            </svg>
            (0351) 123456
          </li>
          <li>
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24">
              <path d="M4 4h16v16H4z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            info@adventureexplorer.id
          </li>
        </ul>
      </div>
      <div class="footer-links">
        <h3>Informasi</h3>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Tentang Kami</a>
        <a href="#">FAQ</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 Adventure Explorer. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
// Tidak ada logika JavaScript khusus yang dibutuhkan di sini.
</script>

<style scoped>
.main-footer {
  background: linear-gradient(90deg, #00d9ff 0%, #009fe3 100%);
  color: #fff;
  padding: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: "Segoe UI", Arial, sans-serif;
  position: relative;
  margin-top: auto;
  z-index: 1000;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  padding: 40px 32px 24px 32px;
  flex-wrap: wrap;
}

.footer-brand {
  flex: 1 1 220px;
  min-width: 220px;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.brand-desc {
  font-size: 1rem;
  margin-bottom: 18px;
  color: rgba(255, 255, 255, 0.85);
}

.footer-social {
  display: flex;
  gap: 14px;
  margin-top: 8px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  padding: 7px;
  color: #fff;
  transition: background 0.2s;
}
.social-link:hover {
  background: rgba(255, 255, 255, 0.28);
}

.footer-info {
  flex: 1 1 220px;
  min-width: 220px;
}
.footer-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
}
.footer-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-info li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.97rem;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.92);
}
.footer-info svg {
  flex-shrink: 0;
  color: #fff;
}

.footer-links {
  flex: 1 1 180px;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.footer-links h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
}
.footer-links a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.97rem;
  transition: color 0.2s;
}
.footer-links a:hover {
  color: #fff;
  text-decoration: underline;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  text-align: center;
  padding: 18px 10px 10px 10px;
  font-size: 0.97rem;
  color: rgba(255, 255, 255, 0.85);
  background: transparent;
  letter-spacing: 0.5px;
}

@media (max-width: 900px) {
  .footer-container {
    flex-direction: column;
    gap: 1.5rem;
    padding: 32px 16px 18px 16px;
    align-items: stretch;
  }
  .footer-brand,
  .footer-info,
  .footer-links {
    min-width: 0;
  }
}
@media (max-width: 480px) {
  .main-footer {
    font-size: 0.95rem;
  }
  .footer-container {
    padding: 24px 6px 12px 6px;
  }
}
</style>
