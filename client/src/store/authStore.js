import axios from "axios";
import { create } from "zustand";
const SERVER_URL = import.meta.env.SERVER_URL || "http://localhost:5001";
const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  setUser: (userData) => set({ user: userData }),
  error: null,
  signup: async (data) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/signup`, data, {
        withCredentials: true,
      });
      set({ user: res.data });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.res?.data?.message || "Signup Failed",
      };
    } finally {
      set({ loading: false });
    }
  },

  login: async (data) => {
    set({ loading: true });

    try {
      const res = await axios.post(`${SERVER_URL}/api/auth/login`, data, {
        withCredentials: true,
      });
      set({ user: res.data });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.res?.data?.message || "Login Failed",
      };
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axios.post(`${SERVER_URL}/api/auth/logout`, null, {
        withCredentials: true,
      });
      set({ user: null });
    } catch (error) {
      console.log(`Logout Error: ${error}`);
    } finally {
      set({ loading: false });
    }
  },
  getme: async () => {
    set({ loading: true });

    try {
      const res = await axios.get(`${SERVER_URL}/api/auth/me`, {
        withCredentials: true,
      });
      set({ user: res.data.user });
    } catch (error) {
      console.log(`Error in GetMe: ${error}`);
    } finally {
      set({ loading: false });
    }
  },
}));
export default useAuthStore;
