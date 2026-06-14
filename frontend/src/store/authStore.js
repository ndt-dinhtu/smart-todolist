// frontend/src/store/authStore.js
import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,

  // 1. Hàm Đăng ký
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/register`, { name, email, password });
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Đăng ký thất bại!",
        isLoading: false,
      });
      return false;
    }
  },

  // 2. Hàm Đăng nhập
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      set({ user, token, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Đăng nhập thất bại!",
        isLoading: false,
      });
      return false;
    }
  },

  // 3. Hàm lấy thông tin User hiện tại (Dùng khi ép dữ liệu hoặc refresh trang)
  getMe: async () => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }, // Gửi kèm token lên hệ thống bảo mật Backend
      });
      set({ user: response.data, isLoading: false });
    } catch (error) {
      // Nếu token hết hạn hoặc lỗi, tự động xóa luôn token cũ
      localStorage.removeItem("token");
      set({ user: null, token: null, isLoading: false });
    }
  },

  // 4. Hàm Đăng xuất
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
