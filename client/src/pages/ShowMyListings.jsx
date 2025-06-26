import React, { useEffect } from "react";
import useListingStore from "../store/listingStore";
import { MapPin, Star, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShowMyListings = () => {
  const { getMyListings, myListings, loading, error } = useListingStore();
  const navigate = useNavigate();

  useEffect(() => {
    getMyListings();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Listings</h1>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && myListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              You haven't listed any properties yet
            </p>
            <button
              onClick={() => navigate("/create")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create New Listing
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={
                    listing.mainImage || "https://via.placeholder.com/400x300"
                  }
                  alt={listing.propertyName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300";
                  }}
                />
                <button
                  onClick={() => navigate(`/edit-listing/${listing._id}`)}
                  className="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-white"
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-800">
                    {listing.propertyName}
                  </h3>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {listing.propertyType}
                  </span>
                </div>

                <div className="flex items-center mt-2 text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{listing.city}</span>
                </div>

                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">
                    {listing.averageRating > 0
                      ? listing.averageRating.toFixed(1)
                      : "New"}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <span className="text-xl font-bold text-orange-600">
                    {formatPrice(listing.pricePerDay)}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/night</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowMyListings;
