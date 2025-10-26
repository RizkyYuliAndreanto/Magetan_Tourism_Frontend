// Utility untuk mengecek dan manage sesi login
export const AUTH_CONFIG = {
  TOKEN_KEY: "access_token",
  USER_KEY: "user",
  CHECK_INTERVAL: 5 * 60 * 1000, // 5 menit (token expire dalam 3 jam)
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
};

let checkInterval = null;

// Fungsi untuk decode JWT token sederhana - IMPROVED WITH LOGGING
export function parseJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    return payload;
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
}

// Fungsi untuk mengecek apakah token sudah expire
export function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = parseJWT(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
}

// Fungsi untuk mengecek validitas token dengan backend
export async function validateTokenWithBackend(token) {
  if (!token) return false;

  try {
    const response = await fetch(
      `${AUTH_CONFIG.API_BASE_URL}/api/auth/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Error validating token with backend:", error);
    return false;
  }
}

// Fungsi untuk clear session
export function clearSession(emitEvent = true, reason = "unknown") {
  localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  localStorage.removeItem(AUTH_CONFIG.USER_KEY);

  // Emit event untuk komponen lain hanya jika diminta dan tidak sedang dalam proses login
  if (emitEvent && !window.isLoggingIn) {
    window.dispatchEvent(new CustomEvent("authSessionExpired")); // Langsung ke authSessionExpired, skip auth-session-expired
  }
}

// Fungsi untuk mengecek status login - SIMPLIFIED VERSION
export function checkLoginStatus() {
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  const userData = localStorage.getItem(AUTH_CONFIG.USER_KEY);

  // Simple check - jika ada token dan userData, anggap logged in
  if (!token || !userData) {
    return { isLoggedIn: false, user: null };
  }

  try {
    const user = JSON.parse(userData);
    return { isLoggedIn: true, user, token };
  } catch (error) {
    console.error("Error parsing user data:", error);
    return { isLoggedIn: false, user: null };
  }
}

// Fungsi untuk start periodic session check - FIXED VERSION
export function startSessionCheck() {
  if (checkInterval) {
    clearInterval(checkInterval);
  }

  // Setup interval untuk check session secara berkala
  // PENTING: Tidak langsung jalankan check, tunggu interval pertama
  checkInterval = setInterval(async () => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);

    if (!token) {
      clearSession(true, "periodic_check_no_token");
      return;
    }

    // Cek token expiry dengan toleransi 5 menit
    if (isTokenExpired(token)) {
      clearSession(true, "periodic_check_token_expired");
      return;
    }

    // Optional: Cek dengan backend setiap 10 check cycles (5 menit)
    // Dikurangi frequency untuk mengurangi network calls
    if (Math.random() < 0.1) {
      // 10% chance per check
      const isValid = await validateTokenWithBackend(token);
      if (!isValid) {
        clearSession(true, "periodic_check_backend_invalid");
      }
    }
  }, AUTH_CONFIG.CHECK_INTERVAL);
}

// Fungsi untuk stop session check
export function stopSessionCheck() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}

// Fungsi untuk mengecek apakah user bisa akses admin
export function canAccessAdmin() {
  const { isLoggedIn, user, expired } = checkLoginStatus();

  // Jika token expired, clear session dan return false
  if (expired) {
    clearSession(true, "admin_access_expired");
    return false;
  }

  const hasAccess =
    isLoggedIn &&
    user &&
    (user.level_akses === "admin" ||
      user.level_akses === "super_admin" ||
      user.level_akses === "superadmin");

  return hasAccess;
}

// Initialize session management
export function initSessionManagement() {
  // JANGAN start session check otomatis, hanya setup listeners
  // Session check akan dimulai saat login berhasil

  // Listen untuk perubahan storage (tab lain)
  window.addEventListener("storage", (e) => {
    if (e.key === AUTH_CONFIG.TOKEN_KEY) {
      if (!e.newValue) {
        // Token dihapus di tab lain
        console.log("Token removed in another tab");
        clearSession(true, "storage_event_token_removed");
      }
    }
  });

  // Listen untuk session expired event - SIMPLIFIED
  window.addEventListener("auth-session-expired", () => {
    stopSessionCheck();
    // Tidak emit event lagi untuk mencegah circular calls
  });
}

// Function to call when user successfully logs in
export const onLoginSuccess = async () => {
  // Emit login success event untuk components lain
  window.dispatchEvent(new CustomEvent("authLoginSuccess"));

  // Delay session check start untuk memberi waktu token settle
  setTimeout(() => {
    startSessionCheck();
  }, 2000); // 2 detik delay
};

// Function untuk logout manual
export const onLogout = () => {
  // Stop session checking
  stopSessionCheck();

  // Clear session tanpa emit event (karena ini logout manual)
  clearSession(false, "manual_logout");

  // Emit logout event
  window.dispatchEvent(new CustomEvent("authLogout"));
};

export default {
  checkLoginStatus,
  canAccessAdmin,
  startSessionCheck,
  stopSessionCheck,
  clearSession,
  initSessionManagement,
  isTokenExpired,
  validateTokenWithBackend,
  onLoginSuccess,
  onLogout,
};
