import { ref, computed } from "vue";

export function useAuth() {
  const user = ref(null);
  const isAuthenticated = ref(false);

  // Get user from localStorage
  const getUserFromStorage = () => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        user.value = parsedUser;
        isAuthenticated.value = true;
      } catch (error) {
        console.error("Error parsing user data:", error);
        user.value = null;
        isAuthenticated.value = false;
      }
    } else {
      user.value = null;
      isAuthenticated.value = false;
    }
  }; // Initialize user data
  getUserFromStorage();

  // Listen for storage changes
  if (typeof window !== "undefined") {
    window.addEventListener("storage", getUserFromStorage);
    // Also listen for custom storage event
    window.addEventListener("userDataChanged", getUserFromStorage);
  }

  // Reactive computed properties
  const userRole = computed(() => {
    // Cek field level_akses dulu, kalau tidak ada baru cek role
    return user.value?.level_akses || user.value?.role || null;
  });
  const isSuperAdmin = computed(() => {
    return userRole.value === "superadmin";
  });
  const isAdmin = computed(
    () => userRole.value === "admin" || userRole.value === "superadmin"
  );
  const userName = computed(
    () => user.value?.nama || user.value?.username || "User"
  );
  const userEmail = computed(() => user.value?.email || "");

  // Method to refresh user data
  const refreshUser = () => {
    getUserFromStorage();
  };

  // Method to logout
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    user.value = null;
    isAuthenticated.value = false;
    window.dispatchEvent(new Event("storage"));
  };

  return {
    user,
    isAuthenticated,
    userRole,
    isSuperAdmin,
    isAdmin,
    userName,
    userEmail,
    refreshUser,
    logout,
  };
}
