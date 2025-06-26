import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useListingStore from "../store/listingStore";
import { Trash2, ArrowLeft, Save } from "lucide-react";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentListing,
    getListingById,
    updateListing,
    deleteListing,
    loading,
    error,
  } = useListingStore();

  const [formData, setFormData] = useState({
    propertyName: "",
    propertyType: "",
    description: "",
    city: "",
    pricePerDay: "",
    amenities: [],
    capacity: {
      guests: 1,
      bedrooms: 1,
      bathrooms: 1,
    },
    location: {
      address: "",
    },
  });

  const amenitiesList = [
    "Air Conditioning",
    "Smoking Allowed",
    "Pet Friendly",
    "Balcony",
    "Gym",
    "Garden",
    "Hot Tub",
    "Pool",
    "WiFi",
    "Parking",
    "Kitchen",
    "TV",
  ];

  useEffect(() => {
    getListingById(id);
  }, [id]);

  useEffect(() => {
    if (currentListing) {
      setFormData({
        propertyName: currentListing.propertyName,
        propertyType: currentListing.propertyType,
        description: currentListing.description,
        city: currentListing.city,
        pricePerDay: currentListing.pricePerDay,
        amenities: [...currentListing.amenities],
        capacity: { ...currentListing.capacity },
        location: { ...currentListing.location },
      });
    }
  }, [currentListing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (parent, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value,
      },
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return {
        ...prev,
        amenities: newAmenities,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //   console.log("Updated form data:", formData);
      await updateListing(id, formData);
      navigate("/my-listings");
    } catch (error) {
      console.error("Error updating listing:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteListing(id);
        console.log(`Listing with ID ${id} deleted successfully`);
        navigate("/my-listings");
      } catch (error) {
        console.error("Error deleting listing:", error);
      }
    }
  };

  if (loading && !currentListing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentListing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Listing not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Delete Listing
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Edit Listing
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Mansion">Mansion</option>
                  <option value="Cottage">Cottage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.location.address}
                  onChange={(e) => handleNestedChange("location", e)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Per Day (₹)
                </label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Guests</label>
                    <input
                      type="number"
                      name="guests"
                      value={formData.capacity.guests}
                      onChange={(e) => handleNestedChange("capacity", e)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.capacity.bedrooms}
                      onChange={(e) => handleNestedChange("capacity", e)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.capacity.bathrooms}
                      onChange={(e) => handleNestedChange("capacity", e)}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="mr-2"
                      />
                      <label htmlFor={`amenity-${amenity}`} className="text-sm">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditListing;
