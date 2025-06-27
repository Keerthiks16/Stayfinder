import axios from "axios";
import { create } from "zustand";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const useListingStore = create((set, get) => ({
  // State
  listings: [],
  myListings: [],
  currentListing: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalListings: 0,
    hasNext: false,
    hasPrev: false,
  },

  // Actions
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setLoading: (loading) => set({ loading }),

  // Create listing
  createListing: async (listingData) => {
    set({ loading: true, error: null });

    try {
      // Fix location structure to match backend expectations
      const processedData = { ...listingData };
      if (
        processedData.location &&
        processedData.location.lat &&
        processedData.location.lng
      ) {
        processedData.location = {
          ...processedData.location,
          latitude: processedData.location.lat,
          longitude: processedData.location.lng,
        };
        // Remove the old lat/lng properties
        delete processedData.location.lat;
        delete processedData.location.lng;
      }

      // Helper function to convert File to base64
      const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      // Handle main image
      if (processedData.mainImage instanceof File) {
        try {
          const base64String = await fileToBase64(processedData.mainImage);
          processedData.mainImage = {
            data: base64String,
            name: processedData.mainImage.name,
            type: processedData.mainImage.type,
          };
        } catch (error) {
          console.error("Error converting main image to base64:", error);
          throw new Error("Failed to process main image");
        }
      }

      // Handle subsidiary images
      if (
        processedData.subsidiaryImages &&
        Array.isArray(processedData.subsidiaryImages) &&
        processedData.subsidiaryImages.length > 0
      ) {
        const hasFiles = processedData.subsidiaryImages.some(
          (image) => image instanceof File
        );

        if (hasFiles) {
          try {
            const base64Images = await Promise.all(
              processedData.subsidiaryImages.map(async (image) => {
                if (image instanceof File) {
                  const base64String = await fileToBase64(image);
                  return {
                    data: base64String,
                    name: image.name,
                    type: image.type,
                  };
                }
                return image; // Return as-is if it's already a string URL
              })
            );
            processedData.subsidiaryImages = base64Images;
          } catch (error) {
            console.error(
              "Error converting subsidiary images to base64:",
              error
            );
            throw new Error("Failed to process subsidiary images");
          }
        }
      }

      // console.log("Processed Listing Data:", {
      //   ...processedData,
      //   mainImage: processedData.mainImage?.data
      //     ? "Base64 image data"
      //     : processedData.mainImage,
      //   subsidiaryImages: processedData.subsidiaryImages?.map((img) =>
      //     img?.data ? "Base64 image data" : img
      //   ),
      // });

      // Send as JSON
      const res = await axios.post(
        `${SERVER_URL}/api/listings`,
        processedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Add new listing to myListings
      set((state) => ({
        myListings: [res.data.listing, ...state.myListings],
        currentListing: res.data.listing,
      }));

      return { success: true, listing: res.data.listing };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create listing";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Get all listings with filters
  getAllListings: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== "") {
          queryParams.append(key, filters[key]);
        }
      });

      const res = await axios.get(`${SERVER_URL}/api/listings?${queryParams}`, {
        withCredentials: true,
      });

      set({
        listings: res.data.listings,
        pagination: res.data.pagination,
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

  // Get listing by ID
  getListingById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${SERVER_URL}/api/listings/${id}`, {
        withCredentials: true,
      });

      set({ currentListing: res.data.listing });
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

  // Get user's own listings
  getMyListings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${SERVER_URL}/api/listings/my-listings`, {
        withCredentials: true,
      });

      set({ myListings: res.data.listings });
      return { success: true, listings: res.data.listings };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch your listings";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Update listing
  updateListing: async (id, updateData) => {
    set({ loading: true, error: null });

    try {
      // Fix location structure to match backend expectations
      const processedData = { ...updateData };
      if (
        processedData.location &&
        processedData.location.lat &&
        processedData.location.lng
      ) {
        processedData.location = {
          ...processedData.location,
          latitude: processedData.location.lat,
          longitude: processedData.location.lng,
        };
        // Remove the old lat/lng properties
        delete processedData.location.lat;
        delete processedData.location.lng;
      }

      // Helper function to convert File to base64
      const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      // Handle main image
      if (processedData.mainImage instanceof File) {
        try {
          const base64String = await fileToBase64(processedData.mainImage);
          processedData.mainImage = {
            data: base64String,
            name: processedData.mainImage.name,
            type: processedData.mainImage.type,
          };
        } catch (error) {
          console.error("Error converting main image to base64:", error);
          throw new Error("Failed to process main image");
        }
      }

      // Handle subsidiary images
      if (
        processedData.subsidiaryImages &&
        Array.isArray(processedData.subsidiaryImages) &&
        processedData.subsidiaryImages.length > 0
      ) {
        const hasFiles = processedData.subsidiaryImages.some(
          (image) => image instanceof File
        );

        if (hasFiles) {
          try {
            const base64Images = await Promise.all(
              processedData.subsidiaryImages.map(async (image) => {
                if (image instanceof File) {
                  const base64String = await fileToBase64(image);
                  return {
                    data: base64String,
                    name: image.name,
                    type: image.type,
                  };
                }
                return image; // Return as-is if it's already a string URL
              })
            );
            processedData.subsidiaryImages = base64Images;
          } catch (error) {
            console.error(
              "Error converting subsidiary images to base64:",
              error
            );
            throw new Error("Failed to process subsidiary images");
          }
        }
      }

      // Send as JSON
      const res = await axios.put(
        `${SERVER_URL}/api/listings/${id}`,
        processedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update the listing in state
      set((state) => ({
        myListings: state.myListings.map((listing) =>
          listing._id === id ? res.data.listing : listing
        ),
        currentListing:
          state.currentListing?._id === id
            ? res.data.listing
            : state.currentListing,
        listings: state.listings.map((listing) =>
          listing._id === id ? res.data.listing : listing
        ),
      }));

      return { success: true, listing: res.data.listing };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update listing";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Delete listing
  deleteListing: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${SERVER_URL}/api/listings/${id}`, {
        withCredentials: true,
      });

      // Remove listing from state
      set((state) => ({
        myListings: state.myListings.filter((listing) => listing._id !== id),
        listings: state.listings.filter((listing) => listing._id !== id),
        currentListing:
          state.currentListing?._id === id ? null : state.currentListing,
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

  // Check availability
  checkAvailability: async (id, checkInDate, checkOutDate, numberOfGuests) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/listings/${id}/availability`,
        {
          checkInDate,
          checkOutDate,
          numberOfGuests,
        },
        {
          withCredentials: true,
        }
      );

      return { success: true, data: res.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to check availability";
      set({ error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

  // Clear current listing
  clearCurrentListing: () => set({ currentListing: null }),

  // Reset listings
  resetListings: () =>
    set({
      listings: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalListings: 0,
        hasNext: false,
        hasPrev: false,
      },
    }),
}));

export default useListingStore;
