<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-section about">
        <h3>Magetan Tourism</h3>
        <p>
          Temukan keindahan tersembunyi Magetan. Kami menyediakan informasi lengkap tentang destinasi wisata, kebudayaan, dan ekonomi kreatif lokal.
        </p>
      </div>
      <div class="footer-section links">
        <h3>Tautan Cepat</h3>
        <ul>
          <li><a href="#">Beranda</a></li>
          <li><a href="#">Berita</a></li>
          <li><a href="#">Destinasi</a></li>
          <li><a href="#">Event</a></li>
        </ul>
      </div>
      <div class="footer-section social">
        <h3>Ikuti Kami</h3>
        <div class="social-links">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      &copy; 2024 Magetan Tourism. All Rights Reserved.
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--text-color-dark);
  color: var(--pure-white);
  padding: 60px 40px 20px;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto 40px auto;
}

.footer-section {
  flex: 1;
  min-width: 250px;
}

.footer-section h3 {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--primary-blue);
}

.footer-section p, .footer-section ul {
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul a {
  color: var(--pure-white);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul a:hover {
  color: var(--primary-blue);
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-links a {
  color: var(--pure-white);
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: var(--primary-blue);
}

.footer-bottom {
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-color-muted);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
}
</style>