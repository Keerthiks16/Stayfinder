import React, { useState } from "react";
import useListingStore from "../store/listingStore";
import useAuthStore from "../store/authStore";

const CreateListing = () => {
  const { createListing, loading, error } = useListingStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    propertyName: "",
    propertyType: "",
    description: "",
    city: "",
    location: {
      address: "",
      coordinates: {
        latitude: "",
        longitude: "",
      },
    },
    pricePerDay: "",
    amenities: [],
    capacity: {
      guests: "",
      bedrooms: "",
      bathrooms: "",
    },
    mainImage: null,
    subsidiaryImages: [],
  });

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  const propertyTypes = [
    "Villa",
    "Apartment",
    "House",
    "Condo",
    "Townhouse",
    "Studio",
    "Penthouse",
    "Cottage",
    "Cabin",
    "Loft",
    "Mansion",
    "Bungalow",
  ];

  const amenitiesOptions = [
    "WiFi",
    "Air Conditioning",
    "Kitchen",
    "Parking",
    "Pool",
    "Gym",
    "Pet Friendly",
    "Smoking Allowed",
    "TV",
    "Washing Machine",
    "Balcony",
    "Garden",
    "Hot Tub",
    "Fireplace",
    "Beach Access",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (child.includes(".")) {
        const [grandParent, grandChild] = child.split(".");
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [grandParent]: {
              ...prev[parent][grandParent],
              [grandChild]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    const updatedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];

    setSelectedAmenities(updatedAmenities);
    setFormData((prev) => ({
      ...prev,
      amenities: updatedAmenities,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        mainImage: file,
      }));

      const previewUrl = URL.createObjectURL(file);
      setMainImagePreview(previewUrl);
    }
  };

  const handleSubsidiaryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 8) {
      alert("You can upload a maximum of 8 subsidiary images");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      subsidiaryImages: [...prev.subsidiaryImages, ...files],
    }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const removeSubsidiaryImage = (index) => {
    const newSubsidiaryImages = [...formData.subsidiaryImages];
    newSubsidiaryImages.splice(index, 1);

    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      subsidiaryImages: newSubsidiaryImages,
    }));
    setPreviewImages(newPreviews);
  };

  const resetForm = () => {
    setFormData({
      propertyName: "",
      propertyType: "",
      description: "",
      city: "",
      location: {
        address: "",
        coordinates: {
          latitude: "",
          longitude: "",
        },
      },
      pricePerDay: "",
      amenities: [],
      capacity: {
        guests: "",
        bedrooms: "",
        bathrooms: "",
      },
      mainImage: null,
      subsidiaryImages: [],
    });
    setSelectedAmenities([]);
    setPreviewImages([]);
    setMainImagePreview(null);

    const mainImageInput = document.querySelector(
      'input[type="file"]:not([multiple])'
    );
    const subsidiaryImagesInput = document.querySelector(
      'input[type="file"][multiple]'
    );
    if (mainImageInput) mainImageInput.value = "";
    if (subsidiaryImagesInput) subsidiaryImagesInput.value = "";

    previewImages.forEach((url) => URL.revokeObjectURL(url));
    if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to create a listing");
      return;
    }

    if (
      !formData.propertyName ||
      !formData.propertyType ||
      !formData.description ||
      !formData.city ||
      !formData.pricePerDay ||
      !formData.capacity.guests ||
      !formData.mainImage
    ) {
      alert("Please fill in all required fields including main image");
      return;
    }

    const cleanedData = {
      ...formData,
      pricePerDay: Number(formData.pricePerDay),
      capacity: {
        guests: Number(formData.capacity.guests),
        bedrooms: formData.capacity.bedrooms
          ? Number(formData.capacity.bedrooms)
          : undefined,
        bathrooms: formData.capacity.bathrooms
          ? Number(formData.capacity.bathrooms)
          : undefined,
      },
      location: {
        address: formData.location.address || "",
        coordinates: {
          latitude: formData.location.coordinates.latitude
            ? Number(formData.location.coordinates.latitude)
            : undefined,
          longitude: formData.location.coordinates.longitude
            ? Number(formData.location.coordinates.longitude)
            : undefined,
        },
      },
    };

    const result = await createListing(cleanedData);
    if (result.success) {
      alert("Listing created successfully!");
      resetForm();
    } else {
      console.error("Create listing error:", result.error);
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center mb-8">
        <div className="bg-blue-600 p-3 rounded-lg mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Create New Property Listing
          </h2>
          <p className="text-gray-600">
            Fill in the details to list your property for rent
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Basic Information */}
        <div className="space-y-6 bg-blue-50 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="bg-blue-600 h-8 w-1 rounded-full mr-3"></div>
            <h3 className="text-xl font-semibold text-gray-800">
              Basic Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Beautiful Beach Villa"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              >
                <option value="">Select Type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Describe your property in detail..."
              maxLength="1000"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              {formData.description.length}/1000 characters
            </p>
          </div>
        </div>

        {/* Location Details */}
        <div className="space-y-6 bg-orange-50 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="bg-orange-500 h-8 w-1 rounded-full mr-3"></div>
            <h3 className="text-xl font-semibold text-gray-800">
              Location Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Miami"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="123 Beachfront Avenue"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude (optional)
              </label>
              <input
                type="number"
                step="any"
                name="location.coordinates.latitude"
                value={formData.location.coordinates.latitude}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="25.7617"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude (optional)
              </label>
              <input
                type="number"
                step="any"
                name="location.coordinates.longitude"
                value={formData.location.coordinates.longitude}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="-80.1918"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Capacity */}
        <div className="space-y-6 bg-blue-50 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="bg-blue-600 h-8 w-1 rounded-full mr-3"></div>
            <h3 className="text-xl font-semibold text-gray-800">
              Pricing & Capacity
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Day (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <input
                  type="number"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleInputChange}
                  className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="150"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Guests *
              </label>
              <input
                type="number"
                name="capacity.guests"
                value={formData.capacity.guests}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="4"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                name="capacity.bedrooms"
                value={formData.capacity.bedrooms}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="2"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                name="capacity.bathrooms"
                value={formData.capacity.bathrooms}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="2"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-6 bg-orange-50 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="bg-orange-500 h-8 w-1 rounded-full mr-3"></div>
            <h3 className="text-xl font-semibold text-gray-800">Amenities</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenitiesOptions.map((amenity) => (
              <div
                key={amenity}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedAmenities.includes(amenity)
                    ? "bg-orange-100 border-orange-300"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => handleAmenityChange(amenity)}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 h-5 w-5"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {amenity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Images */}
        <div className="space-y-6 bg-blue-50 p-6 rounded-xl">
          <div className="flex items-center">
            <div className="bg-blue-600 h-8 w-1 rounded-full mr-3"></div>
            <h3 className="text-xl font-semibold text-gray-800">
              Property Images
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image *
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="block w-full text-sm text-gray-700
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700 transition-colors"
                  required
                />
                {mainImagePreview && (
                  <div className="mt-3">
                    <img
                      src={mainImagePreview}
                      alt="Main preview"
                      className="w-full h-56 object-cover rounded-lg border-2 border-blue-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Subsidiary Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Images (max 8)
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleSubsidiaryImagesChange}
                  className="block w-full text-sm text-gray-700
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700 transition-colors"
                />
                {previewImages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">
                      {previewImages.length} of 8 images selected
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-blue-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeSubsidiaryImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors border border-gray-300"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-lg text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            } transition-colors shadow-md`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              "Create Listing"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
