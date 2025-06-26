import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useListingStore from "../store/listingStore";
import {
  Star,
  MapPin,
  Home,
  Users,
  Bath,
  Calendar,
  Wifi,
  Tv,
  Loader2,
  ArrowLeft,
  Flame,
  TreeDeciduous,
  CheckCircle,
  Dumbbell,
  Cigarette,
  Cat,
  Waves,
  PanelRightClose,
  BathIcon,
  AirVent,
  CookingPot,
  WashingMachine,
  CircleParking,
  Volleyball,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SelectedListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListingById, currentListing, loading, error, clearError } =
    useListingStore();
  const [showImageSlider, setShowImageSlider] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      getListingById(id);
    }
    return () => {
      clearError();
    };
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes("wifi") || amenityLower.includes("internet")) {
      return <Wifi className="w-5 h-5 text-blue-600" />;
    }
    if (amenityLower.includes("tv") || amenityLower.includes("television")) {
      return <Tv className="w-5 h-5 text-blue-600" />;
    }
    if (amenityLower.includes("garden") || amenityLower.includes("yard")) {
      return <TreeDeciduous className="w-5 h-5 text-blue-600" />;
    }
    if (amenityLower.includes("fireplace") || amenityLower.includes("fire")) {
      return <Flame className="w-5 h-5 text-blue-600" />;
    }
    if (amenityLower.includes("gym") || amenityLower.includes("gym")) {
      return <Dumbbell className="w-5 h-5 text-blue-600" />;
    }
    if (
      amenityLower.includes("smoking-allowed") ||
      amenityLower.includes("smoking allowed")
    ) {
      return <Cigarette className="w-5 h-5 text-blue-600" />;
    }
    if (amenityLower.includes("pet") || amenityLower.includes("pet")) {
      return <Cat className="w-5 h-5 text-blue-600" />;
    }
    if (amenityLower.includes("pool") || amenityLower.includes("pool")) {
      return <Waves className="w-5 h-5 text-blue-600" />;
    }
    if (amenityLower.includes("balcony") || amenityLower.includes("balcony")) {
      return <PanelRightClose className="w-5 h-5 text-blue-600" />;
    }
    if (amenityLower.includes("kitchen") || amenityLower.includes("kitchen")) {
      return <CookingPot className="w-5 h-5 text-blue-600" />;
    }
    if (
      amenityLower.includes("washing-machine") ||
      amenityLower.includes("washing machine")
    ) {
      return <WashingMachine className="w-5 h-5 text-blue-600" />;
    }
    if (amenityLower.includes("parking") || amenityLower.includes("parking")) {
      return <CircleParking className="w-5 h-5 text-blue-600" />;
    }
    if (amenityLower.includes("beach") || amenityLower.includes("beach")) {
      return <Volleyball className="w-5 h-5 text-blue-600" />;
    }
    if (
      amenityLower.includes("air-conditioning") ||
      amenityLower.includes("air conditioning")
    ) {
      return <AirVent className="w-5 h-5 text-blue-600" />;
    }
    if (amenityLower.includes("hot-tub") || amenityLower.includes("hot tub")) {
      return <BathIcon className="w-5 h-5 text-blue-600" />;
    }
    return <CheckCircle className="w-5 h-5 text-blue-600" />;
  };

  const openImageSlider = (index = 0) => {
    setCurrentImageIndex(index);
    setShowImageSlider(true);
    document.body.style.overflow = "hidden";
  };

  const closeImageSlider = () => {
    setShowImageSlider(false);
    document.body.style.overflow = "auto";
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentListing.subsidiaryImages?.[0]?.length || 0 : prev - 1
    );
  };

  const goToNextImage = () => {
    const totalImages = (currentListing.subsidiaryImages?.[0]?.length || 0) + 1;
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <div className="bg-red-100 p-6 rounded-full mb-4">
          <div className="text-red-600 text-4xl">⚠️</div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Error Loading Listing
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Go Back
          </button>
          <button
            onClick={() => getListingById(id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentListing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <div className="bg-blue-100 p-6 rounded-full mb-4">
          <div className="text-blue-600 text-4xl">🔍</div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Listing Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the property you're looking for.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Properties
        </button>
      </div>
    );
  }

  const allImages = [
    currentListing.mainImage,
    ...(currentListing.subsidiaryImages?.[0] || []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Image Slider Modal */}
      {showImageSlider && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeImageSlider}
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full max-w-4xl h-full max-h-[90vh] flex items-center">
            <button
              onClick={goToPreviousImage}
              className="absolute left-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <div className="w-full h-full flex items-center justify-center">
              <img
                src={allImages[currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop";
                }}
              />
            </div>

            <button
              onClick={goToNextImage}
              className="absolute right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="flex gap-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentImageIndex === index ? "bg-white" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 relative">
            <div
              className="lg:col-span-2 h-96 cursor-pointer"
              onClick={() => openImageSlider(0)}
            >
              <img
                src={
                  currentListing.mainImage ||
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
                }
                alt={currentListing.propertyName}
                className="w-full h-full object-cover rounded-tl-xl rounded-tr-xl lg:rounded-tr-none"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop";
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-1 h-96">
              {currentListing.subsidiaryImages?.[0]
                ?.slice(0, 6)
                .map((img, index) => (
                  <div
                    key={index}
                    className="overflow-hidden cursor-pointer relative"
                    onClick={() => openImageSlider(index + 1)}
                  >
                    <img
                      src={img}
                      alt={`${currentListing.propertyName} view ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop";
                      }}
                    />
                    {index === 5 &&
                      currentListing.subsidiaryImages?.[0]?.length > 6 && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white font-bold text-lg">
                          +{currentListing.subsidiaryImages[0].length - 6}
                        </div>
                      )}
                  </div>
                ))}
            </div>

            <button
              onClick={() => openImageSlider(0)}
              className="absolute bottom-4 right-4 bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-opacity-100 transition-all flex items-center gap-2"
            >
              <span>View All Images</span>
            </button>
          </div>

          {/* Property Details */}
          <div className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left Column */}
              <div className="lg:w-2/3">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {currentListing.propertyName}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-5 h-5" />
                      <span>
                        {currentListing.location?.address ||
                          currentListing.city}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {currentListing.averageRating > 0
                        ? currentListing.averageRating.toFixed(1)
                        : "New"}
                    </span>
                    {currentListing.totalReviews > 0 && (
                      <span className="text-sm text-gray-500">
                        ({currentListing.totalReviews})
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 py-6 my-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium">
                          {currentListing.propertyType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-medium">
                          {currentListing.capacity?.guests || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Home className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Bedrooms</p>
                        <p className="font-medium">
                          {currentListing.capacity?.bedrooms || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Bathrooms</p>
                        <p className="font-medium">
                          {currentListing.capacity?.bathrooms || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    About this property
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {currentListing.description || "No description provided."}
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {currentListing.amenities &&
                    currentListing.amenities.length > 0 ? (
                      currentListing.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-gray-500">
                        No amenities listed
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Card */}
              <div className="lg:w-1/3">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatPrice(currentListing.pricePerDay)}
                      </p>
                      <p className="text-gray-500">per night</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {currentListing.averageRating > 0
                          ? currentListing.averageRating.toFixed(1)
                          : "New"}
                      </span>
                      {currentListing.totalReviews > 0 && (
                        <span className="text-sm text-gray-500">
                          ({currentListing.totalReviews})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">
                        {currentListing.availability?.isAvailable
                          ? "Available for booking"
                          : "Not currently available"}
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                    onClick={() => navigate(`/booking/${currentListing._id}`)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Section */}
        {currentListing.owner && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Hosted by {currentListing.owner.name}
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                {currentListing.owner.name?.charAt(0) || "H"}
              </div>
              <div>
                <p className="font-medium">{currentListing.owner.name}</p>
                <p className="text-gray-500 text-sm">
                  Member since{" "}
                  {new Date(currentListing.createdAt).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {currentListing.totalReviews > 0
              ? `Reviews (${currentListing.totalReviews})`
              : "No reviews yet"}
          </h2>

          {currentListing.reviews?.length > 0 ? (
            <div className="space-y-6">
              {currentListing.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {review.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium">
                        {review.user?.name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">This property has no reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectedListing;
