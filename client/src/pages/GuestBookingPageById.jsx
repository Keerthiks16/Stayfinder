import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useBookingStore from "../store/bookingStore";
import {
  Star,
  MapPin,
  Home,
  Users,
  Bath,
  Calendar,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Wallet,
  Ban,
  Undo2,
  BadgeIndianRupee,
} from "lucide-react";
import { format } from "date-fns";

const GuestBookingPageById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getBookingById,
    currentBooking,
    loading,
    error,
    cancelBooking,
    updatePaymentStatus,
    clearError,
  } = useBookingStore();
  const [showImageSlider, setShowImageSlider] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      getBookingById(id);
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

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM d, yyyy");
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
      prev === 0
        ? currentBooking?.listing?.subsidiaryImages?.[0]?.length || 0
        : prev - 1
    );
  };

  const goToNextImage = () => {
    const totalImages =
      (currentBooking?.listing?.subsidiaryImages?.[0]?.length || 0) + 1;
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const handleCancelBooking = async () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      const result = await cancelBooking(id);
      if (result.success) {
        alert("Booking cancelled successfully");
      }
    }
  };

  const handlePayment = async () => {
    if (window.confirm("Confirm payment for this booking?")) {
      const result = await updatePaymentStatus(id, "paid");
      if (result.success) {
        alert("Payment status updated to paid");
      }
    }
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
          Error Loading Booking
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
            onClick={() => getBookingById(id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentBooking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <div className="bg-blue-100 p-6 rounded-full mb-4">
          <div className="text-blue-600 text-4xl">🔍</div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Booking Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the booking you're looking for.
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
    currentBooking.listing.mainImage,
    ...(currentBooking.listing.subsidiaryImages?.[0] || []),
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
        

        {/* Booking Status Banner */}
        <div
          className={`p-4 rounded-lg mb-6 ${
            currentBooking.status === "cancelled"
              ? "bg-red-100 text-red-800"
              : currentBooking.paymentStatus === "paid"
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentBooking.status === "cancelled" ? (
                <Ban className="w-5 h-5" />
              ) : currentBooking.paymentStatus === "paid" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Wallet className="w-5 h-5" />
              )}
              <span className="font-medium">
                {currentBooking.status === "cancelled"
                  ? "Booking Cancelled"
                  : currentBooking.paymentStatus === "paid"
                  ? "Booking Confirmed & Paid"
                  : "Payment Pending"}
              </span>
            </div>
            <div className="text-sm">
              Booking ID: {currentBooking._id.substring(0, 8).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Property Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Property Images */}
              <div className="md:w-1/3">
                <div className="relative">
                  <img
                    src={
                      currentBooking.listing.mainImage ||
                      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
                    }
                    alt={currentBooking.listing.propertyName}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer"
                    onClick={() => openImageSlider(0)}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop";
                    }}
                  />
                  <button
                    onClick={() => openImageSlider(0)}
                    className="absolute bottom-2 right-2 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded text-sm shadow hover:bg-opacity-100 transition-all"
                  >
                    View Photos
                  </button>
                </div>
              </div>

              {/* Property Details */}
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentBooking.listing.propertyName}
                </h2>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span>{currentBooking.listing.city}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Guests</p>
                      <p className="font-medium">
                        {currentBooking.listing.capacity?.guests || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Bedrooms</p>
                      <p className="font-medium">
                        {currentBooking.listing.capacity?.bedrooms || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <p className="font-medium">
                        {currentBooking.listing.capacity?.bathrooms || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeIndianRupee className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Price/Night</p>
                      <p className="font-medium">
                        {formatPrice(currentBooking.listing.pricePerDay)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Booking Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dates */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Dates</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-medium">
                      {formatDate(currentBooking.checkInDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out</span>
                    <span className="font-medium">
                      {formatDate(currentBooking.checkOutDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">
                      {currentBooking.numberOfDays} night
                      {currentBooking.numberOfDays !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Guests</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Guests</span>
                    <span className="font-medium">
                      {currentBooking.numberOfGuests} guest
                      {currentBooking.numberOfGuests !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {currentBooking.specialRequests && (
                    <div>
                      <div className="text-gray-600 mb-1">Special Requests</div>
                      <div className="font-medium">
                        {currentBooking.specialRequests}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Payment</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`font-medium ${
                        currentBooking.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {currentBooking.paymentStatus === "paid"
                        ? "Paid"
                        : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium text-orange-600">
                      {formatPrice(currentBooking.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Host Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Host</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {currentBooking.listing.owner?.name?.charAt(0) || "H"}
                  </div>
                  <div>
                    <div className="font-medium">
                      {currentBooking.listing.owner?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentBooking.listing.owner?.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200 flex flex-wrap gap-4">
            {currentBooking.status !== "cancelled" && (
              <button
                onClick={handleCancelBooking}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Ban className="w-5 h-5" />
                Cancel Booking
              </button>
            )}

            {currentBooking.status === "cancelled" ? (
              <button
                disabled
                className="px-6 py-3 bg-gray-300 text-gray-600 font-medium rounded-lg cursor-not-allowed flex items-center gap-2"
              >
                <Undo2 className="w-5 h-5" />
                Booking Cancelled
              </button>
            ) : currentBooking.paymentStatus === "paid" ? (
              <button
                disabled
                className="px-6 py-3 bg-green-100 text-green-800 font-medium rounded-lg cursor-not-allowed flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Payment Complete
              </button>
            ) : (
              <button
                onClick={handlePayment}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Pay Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestBookingPageById;
