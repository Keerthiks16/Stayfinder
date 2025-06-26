import axios from "axios";
import { create } from "zustand";

const SERVER_URL = import.meta.env.SERVER_URL || "http://localhost:5001";

const useAdminStore = create((set, get) => ({
  // State
  adminUsers: [],
  adminListings: [],
  adminBookings: [],
  heroSections: [],
  dashboardStats: null,
  currentAdminUser: null,
  currentAdminListing: null,
  currentAdminBooking: null,
  currentHeroSection: null,
  loading: false,
  error: null,

  // Admin Auth State
  adminAuth: {
    adminInfo: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },

  // Pagination
  usersPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  listingsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },
  bookingsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // ==================== ADMIN AUTHENTICATION ====================

  // Admin Signup
  adminSignup: async (adminData) => {
    set({
      adminAuth: {
        ...get().adminAuth,
        loading: true,
        error: null,
      },
    });
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/admin/signup`,
        adminData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      set({
        adminAuth: {
          adminInfo: res.data,
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      });

      return { success: true, admin: res.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Admin registration failed";
      set({
        adminAuth: {
          ...get().adminAuth,
          loading: false,
          error: errorMessage,
        },
      });
      return { success: false, error: errorMessage };
    }
  },

  // Admin Login
  adminLogin: async (credentials) => {
    set({
      adminAuth: {
        ...get().adminAuth,
        loading: true,
        error: null,
      },
    });
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/admin/auth/login`,
        credentials,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      set({
        adminAuth: {
          adminInfo: res.data,
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      });

      return { success: true, admin: res.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Admin login failed";
      set({
        adminAuth: {
          ...get().adminAuth,
          loading: false,
          error: errorMessage,
        },
      });
      return { success: false, error: errorMessage };
    }
  },

  // Get Current Admin
  getCurrentAdmin: async () => {
    set({
      adminAuth: {
        ...get().adminAuth,
        loading: true,
        error: null,
      },
    });
    try {
      const res = await axios.get(`${SERVER_URL}/api/admin/me`, {
        withCredentials: true,
      });

      set({
        adminAuth: {
          adminInfo: res.data,
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      });

      return { success: true, admin: res.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch admin data";
      set({
        adminAuth: {
          ...get().adminAuth,
          loading: false,
          error: errorMessage,
        },
      });
      return { success: false, error: errorMessage };
    }
  },

  // Admin Logout
  adminLogout: async () => {
    set({
      adminAuth: {
        ...get().adminAuth,
        loading: true,
        error: null,
      },
    });
    try {
      await axios.post(`${SERVER_URL}/api/admin/logout`, null, {
        withCredentials: true,
      });

      set({
        adminAuth: {
          adminInfo: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        },
      });

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Admin logout failed";
      set({
        adminAuth: {
          ...get().adminAuth,
          loading: false,
          error: errorMessage,
        },
      });
      return { success: false, error: errorMessage };
    }
  },

  // Clear Admin Auth Error
  clearAdminAuthError: () => {
    set({
      adminAuth: {
        ...get().adminAuth,
        error: null,
      },
    });
  },

  // ==================== USER MANAGEMENT ====================

  // Get all users (admin)
  getAllUsers: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== "") {
          queryParams.append(key, filters[key]);
        }
      });

      const res = await axios.get(
        `${SERVER_URL}/api/admin/users?${queryParams}`,
        {
          withCredentials: true,
        }
      );

      set({
        adminUsers: res.data.users,
        usersPagination: res.data.pagination,
      });

      return { success: true, data: res.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch users";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Get user by ID (admin)
  getUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${SERVER_URL}/api/admin/users/${id}`, {
        withCredentials: true,
      });

      set({ currentAdminUser: res.data.user });
      return { success: true, user: res.data.user };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Update user (admin)
  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(
        `${SERVER_URL}/api/admin/users/${id}`,
        userData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update user in state
      set((state) => ({
        adminUsers: state.adminUsers.map((user) =>
          user._id === id ? res.data.user : user
        ),
        currentAdminUser: res.data.user,
      }));

      return { success: true, user: res.data.user };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update user";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Delete user (admin)
  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${SERVER_URL}/api/admin/users/${id}`, {
        withCredentials: true,
      });

      // Remove user from state
      set((state) => ({
        adminUsers: state.adminUsers.filter((user) => user._id !== id),
        currentAdminUser:
          state.currentAdminUser?._id === id ? null : state.currentAdminUser,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete user";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // ==================== LISTING MANAGEMENT ====================

  // Get all listings (admin)
  getAllListings: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== "") {
          queryParams.append(key, filters[key]);
        }
      });

      const res = await axios.get(
        `${SERVER_URL}/api/admin/listings?${queryParams}`,
        {
          withCredentials: true,
        }
      );

      set({
        adminListings: res.data.listings,
        listingsPagination: res.data.pagination,
      });

      return { success: true, data: res.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch listings";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Create listing (admin)
  createListing: async (listingData) => {
    set({ loading: true, error: null });
    try {
      // Helper function to convert File to base64
      const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      // Process images if they are File objects
      const processedData = { ...listingData };

      // Handle main image
      if (processedData.mainImage instanceof File) {
        const base64String = await fileToBase64(processedData.mainImage);
        processedData.mainImage = base64String;
      }

      // Handle subsidiary images
      if (
        processedData.subsidiaryImages &&
        Array.isArray(processedData.subsidiaryImages)
      ) {
        processedData.subsidiaryImages = await Promise.all(
          processedData.subsidiaryImages.map(async (image) => {
            if (image instanceof File) {
              return await fileToBase64(image);
            }
            return image;
          })
        );
      }

      const res = await axios.post(
        `${SERVER_URL}/api/admin/listings`,
        processedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Add new listing to state
      set((state) => ({
        adminListings: [res.data.listing, ...state.adminListings],
        currentAdminListing: res.data.listing,
      }));

      return { success: true, listing: res.data.listing };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create listing";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Get listing by ID (admin)
  getListingById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${SERVER_URL}/api/admin/listings/${id}`, {
        withCredentials: true,
      });

      set({ currentAdminListing: res.data.listing });
      return { success: true, listing: res.data.listing };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch listing";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Update listing (admin)
  updateListing: async (id, listingData) => {
    set({ loading: true, error: null });
    try {
      // Helper function to convert File to base64
      const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      // Process images if they are File objects
      const processedData = { ...listingData };

      // Handle main image
      if (processedData.mainImage instanceof File) {
        const base64String = await fileToBase64(processedData.mainImage);
        processedData.mainImage = base64String;
      }

      // Handle subsidiary images
      if (
        processedData.subsidiaryImages &&
        Array.isArray(processedData.subsidiaryImages)
      ) {
        processedData.subsidiaryImages = await Promise.all(
          processedData.subsidiaryImages.map(async (image) => {
            if (image instanceof File) {
              return await fileToBase64(image);
            }
            return image;
          })
        );
      }

      const res = await axios.put(
        `${SERVER_URL}/api/admin/listings/${id}`,
        processedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update listing in state
      set((state) => ({
        adminListings: state.adminListings.map((listing) =>
          listing._id === id ? res.data.listing : listing
        ),
        currentAdminListing: res.data.listing,
      }));

      return { success: true, listing: res.data.listing };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update listing";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Delete listing (admin)
  deleteListing: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${SERVER_URL}/api/admin/listings/${id}`, {
        withCredentials: true,
      });

      // Remove listing from state
      set((state) => ({
        adminListings: state.adminListings.filter(
          (listing) => listing._id !== id
        ),
        currentAdminListing:
          state.currentAdminListing?._id === id
            ? null
            : state.currentAdminListing,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete listing";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // ==================== BOOKING MANAGEMENT ====================

  // Get all bookings (admin)
  getAllBookings: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== "") {
          queryParams.append(key, filters[key]);
        }
      });

      const res = await axios.get(
        `${SERVER_URL}/api/admin/bookings?${queryParams}`,
        {
          withCredentials: true,
        }
      );

      set({
        adminBookings: res.data.bookings,
        bookingsPagination: res.data.pagination,
      });

      return { success: true, data: res.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch bookings";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Create booking (admin)
  createBooking: async (bookingData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/admin/bookings`,
        bookingData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Add new booking to state
      set((state) => ({
        adminBookings: [res.data.booking, ...state.adminBookings],
        currentAdminBooking: res.data.booking,
      }));

      return { success: true, booking: res.data.booking };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create booking";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Get booking by ID (admin)
  getBookingById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${SERVER_URL}/api/admin/bookings/${id}`, {
        withCredentials: true,
      });

      set({ currentAdminBooking: res.data.booking });
      return { success: true, booking: res.data.booking };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch booking";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Update booking (admin)
  updateBooking: async (id, bookingData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(
        `${SERVER_URL}/api/admin/bookings/${id}`,
        bookingData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update booking in state
      set((state) => ({
        adminBookings: state.adminBookings.map((booking) =>
          booking._id === id ? res.data.booking : booking
        ),
        currentAdminBooking: res.data.booking,
      }));

      return { success: true, booking: res.data.booking };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update booking";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Delete booking (admin)
  deleteBooking: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${SERVER_URL}/api/admin/bookings/${id}`, {
        withCredentials: true,
      });

      // Remove booking from state
      set((state) => ({
        adminBookings: state.adminBookings.filter(
          (booking) => booking._id !== id
        ),
        currentAdminBooking:
          state.currentAdminBooking?._id === id
            ? null
            : state.currentAdminBooking,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete booking";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // ==================== HERO SECTION MANAGEMENT ====================

  // Get all hero sections
  getHeroSections: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${SERVER_URL}/api/admin/hero-sections`, {
        withCredentials: true,
      });

      set({ heroSections: res.data.heroSections });
      return { success: true, heroSections: res.data.heroSections };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch hero sections";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Create hero section
  createHeroSection: async (heroData) => {
    set({ loading: true, error: null });
    try {
      // Helper function to convert File to base64
      const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      // Process image if it's a File object
      const processedData = { ...heroData };
      if (processedData.image instanceof File) {
        processedData.image = await fileToBase64(processedData.image);
      }

      const res = await axios.post(
        `${SERVER_URL}/api/admin/hero-sections`,
        processedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Add new hero section to state
      set((state) => ({
        heroSections: [...state.heroSections, res.data.heroSection],
        currentHeroSection: res.data.heroSection,
      }));

      return { success: true, heroSection: res.data.heroSection };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create hero section";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Update hero section
  updateHeroSection: async (id, heroData) => {
    set({ loading: true, error: null });
    try {
      // Helper function to convert File to base64
      const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      // Process image if it's a File object
      const processedData = { ...heroData };
      if (processedData.image instanceof File) {
        processedData.image = await fileToBase64(processedData.image);
      }

      const res = await axios.put(
        `${SERVER_URL}/api/admin/hero-sections/${id}`,
        processedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update hero section in state
      set((state) => ({
        heroSections: state.heroSections.map((hero) =>
          hero._id === id ? res.data.heroSection : hero
        ),
        currentHeroSection: res.data.heroSection,
      }));

      return { success: true, heroSection: res.data.heroSection };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update hero section";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Delete hero section
  deleteHeroSection: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${SERVER_URL}/api/admin/hero-sections/${id}`, {
        withCredentials: true,
      });

      // Remove hero section from state
      set((state) => ({
        heroSections: state.heroSections.filter((hero) => hero._id !== id),
        currentHeroSection:
          state.currentHeroSection?._id === id
            ? null
            : state.currentHeroSection,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete hero section";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // ==================== DASHBOARD ====================

  // Get dashboard stats
  getDashboardStats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${SERVER_URL}/api/admin/dashboard/stats`, {
        withCredentials: true,
      });

      set({ dashboardStats: res.data.stats });
      return { success: true, stats: res.data.stats };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch dashboard stats";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Clear current items
  clearCurrentAdminUser: () => set({ currentAdminUser: null }),
  clearCurrentAdminListing: () => set({ currentAdminListing: null }),
  clearCurrentAdminBooking: () => set({ currentAdminBooking: null }),
  clearCurrentHeroSection: () => set({ currentHeroSection: null }),

  // Reset state
  resetAdminStore: () =>
    set({
      adminUsers: [],
      adminListings: [],
      adminBookings: [],
      heroSections: [],
      dashboardStats: null,
      currentAdminUser: null,
      currentAdminListing: null,
      currentAdminBooking: null,
      currentHeroSection: null,
      usersPagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      },
      listingsPagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      },
      bookingsPagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
      },
    }),
}));

export default useAdminStore;
