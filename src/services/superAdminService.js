import api from "@/api/axios";

// Use the centralized axios instance that already has baseURL and interceptors configured

// Handle token expiration (additional to main axios instance)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export const superAdminAPI = {
  // Get all users with pagination and filters
  getAllUsers(params = {}) {
    return api.get("/super-admin/users", { params });
  },

  // Create new user
  createUser(userData) {
    return api.post("/super-admin/users", userData);
  },

  // Update user
  updateUser(userId, userData) {
    return api.put(`/super-admin/users/${userId}`, userData);
  },

  // Delete user
  deleteUser(userId) {
    return api.delete(`/super-admin/users/${userId}`);
  },

  // Block user
  blockUser(userId) {
    return api.patch(`/super-admin/users/${userId}/status`, {
      is_blocked: true,
    });
  },

  // Unblock user
  unblockUser(userId) {
    return api.patch(`/super-admin/users/${userId}/status`, {
      is_blocked: false,
    });
  },

  // Get user statistics
  getUserStats() {
    return api.get("/super-admin/users/stats");
  },

  // Get user activity logs
  getUserActivity(userId, params = {}) {
    return api.get(`/super-admin/users/${userId}/activity`, { params });
  },
};
