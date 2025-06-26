import axios from "axios";
import { create } from "zustand";

const SERVER_URL = import.meta.env.SERVER_URL || "http://localhost:5001";

const useBookingStore = create((set, get) => ({
  // State
  bookings: [], // User's bookings as guest
  propertyBookings: [], // Bookings for user's properties
  currentBooking: null,
  loading: false,
  error: null,
  stats: {
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    hasNext: false,
    hasPrev: false,
  },
  propertyPagination: {
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    hasNext: false,
    hasPrev: false,
  },

  // Actions
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setLoading: (loading) => set({ loading }),

  // Create a new booking
  createBooking: async (bookingData) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post(`${SERVER_URL}/api/bookings`, bookingData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Add new booking to user's bookings
      set((state) => ({
        bookings: [res.data.booking, ...state.bookings],
        currentBooking: res.data.booking,
      }));

      return { success: true, booking: res.data.booking };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create booking";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Get user's bookings (as guest)
  getMyBookings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${SERVER_URL}/api/bookings/my`, {
        withCredentials: true,
      });
      console.log(res.data);

      set({
        bookings: res.data.bookings,
        pagination: res.data.pagination,
      });

      return { success: true, data: res.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch your bookings";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Get bookings for user's properties (as owner)
  getMyPropertyBookings: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== "") {
          queryParams.append(key, filters[key]);
        }
      });

      const res = await axios.get(`${SERVER_URL}/api/bookings/property`, {
        withCredentials: true,
      });

      set({
        propertyBookings: res.data.bookings,
        propertyPagination: res.data.pagination,
      });

      return { success: true, data: res.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch property bookings";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Get booking by ID
  getBookingById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${SERVER_URL}/api/bookings/${id}`, {
        withCredentials: true,
      });

      set({ currentBooking: res.data.booking });
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

  // Update booking status (for property owners)
  updateBookingStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(
        `${SERVER_URL}/api/bookings/${id}/status`,
        { status },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update the booking in state
      set((state) => ({
        propertyBookings: state.propertyBookings.map((booking) =>
          booking._id === id ? res.data.booking : booking
        ),
        currentBooking:
          state.currentBooking?._id === id
            ? res.data.booking
            : state.currentBooking,
        bookings: state.bookings.map((booking) =>
          booking._id === id ? res.data.booking : booking
        ),
      }));

      return { success: true, booking: res.data.booking };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update booking status";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Cancel booking (for guests)
  cancelBooking: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(
        `${SERVER_URL}/api/bookings/${id}/cancel`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update the booking in state
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking._id === id ? res.data.booking : booking
        ),
        currentBooking:
          state.currentBooking?._id === id
            ? res.data.booking
            : state.currentBooking,
        propertyBookings: state.propertyBookings.map((booking) =>
          booking._id === id ? res.data.booking : booking
        ),
      }));

      return { success: true, booking: res.data.booking };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to cancel booking";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Update payment status
  updatePaymentStatus: async (id, paymentStatus) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(
        `${SERVER_URL}/api/bookings/${id}/payment`,
        { paymentStatus },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update the booking in state
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking._id === id ? res.data.booking : booking
        ),
        propertyBookings: state.propertyBookings.map((booking) =>
          booking._id === id ? res.data.booking : booking
        ),
        currentBooking:
          state.currentBooking?._id === id
            ? res.data.booking
            : state.currentBooking,
      }));

      return { success: true, booking: res.data.booking };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update payment status";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Get booking statistics (for property owners)
  getBookingStats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${SERVER_URL}/api/bookings/stats`, {
        withCredentials: true,
      });

      set({ stats: res.data.stats });
      return { success: true, stats: res.data.stats };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch booking statistics";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Delete booking
  deleteBooking: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${SERVER_URL}/api/bookings/${id}`, {
        withCredentials: true,
      });

      // Remove booking from state
      set((state) => ({
        bookings: state.bookings.filter((booking) => booking._id !== id),
        propertyBookings: state.propertyBookings.filter(
          (booking) => booking._id !== id
        ),
        currentBooking:
          state.currentBooking?._id === id ? null : state.currentBooking,
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

  // Clear current booking
  clearCurrentBooking: () => set({ currentBooking: null }),

  // Reset bookings
  resetBookings: () =>
    set({
      bookings: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalBookings: 0,
        hasNext: false,
        hasPrev: false,
      },
    }),

  // Reset property bookings
  resetPropertyBookings: () =>
    set({
      propertyBookings: [],
      propertyPagination: {
        currentPage: 1,
        totalPages: 1,
        totalBookings: 0,
        hasNext: false,
        hasPrev: false,
      },
    }),

  // Reset all booking data
  resetAllBookings: () =>
    set({
      bookings: [],
      propertyBookings: [],
      currentBooking: null,
      stats: {
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        thisMonthRevenue: 0,
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalBookings: 0,
        hasNext: false,
        hasPrev: false,
      },
      propertyPagination: {
        currentPage: 1,
        totalPages: 1,
        totalBookings: 0,
        hasNext: false,
        hasPrev: false,
      },
    }),

  // Helper functions for booking status checks
  canCancelBooking: (booking) => {
    if (!booking) return false;

    // Check if booking status allows cancellation
    if (!["pending", "confirmed"].includes(booking.status)) {
      return false;
    }

    // Check 24-hour cancellation policy
    const now = new Date();
    const checkInDate = new Date(booking.checkInDate);
    const timeDiff = checkInDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    return hoursDiff >= 24;
  },

  canUpdateStatus: (booking, newStatus) => {
    if (!booking) return false;

    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled"],
      cancelled: [],
      completed: [],
    };

    return validTransitions[booking.status]?.includes(newStatus) || false;
  },

  // Get bookings by status
  getBookingsByStatus: (status) => {
    const { bookings } = get();
    return status === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === status);
  },

  getPropertyBookingsByStatus: (status) => {
    const { propertyBookings } = get();
    return status === "all"
      ? propertyBookings
      : propertyBookings.filter((booking) => booking.status === status);
  },
}));

export default useBookingStore;
