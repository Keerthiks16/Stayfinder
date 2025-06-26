import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  Users,
  Home,
  Wallet,
  BadgeCheck,
  XCircle,
  Clock,
  CheckCircle,
  MapPin,
  Mail,
  AlertCircle,
} from "lucide-react";
import useAdminStore from "../../store/adminStore";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-green-100 text-green-800",
};

const paymentStatusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  refunded: "bg-purple-100 text-purple-800",
};

const AdminBookingSelected = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookingById, currentAdminBooking, loading, error } =
    useAdminStore();

  useEffect(() => {
    if (id) {
      getBookingById(id);
    }
  }, [id, getBookingById]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!currentAdminBooking) {
    return (
      <div className="p-6 text-center">
        <p>No booking found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    listing,
    guest,
    checkInDate,
    checkOutDate,
    numberOfDays,
    numberOfGuests,
    totalPrice,
    status,
    paymentStatus,
    specialRequests,
    createdAt,
    updatedAt,
  } = currentAdminBooking;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Bookings
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Booking Details</h1>
          <div className="flex items-center text-white mt-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              {new Date(checkInDate).toLocaleDateString()} -{" "}
              {new Date(checkOutDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Booking Summary */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mb-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                  Booking Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                      <Home className="w-5 h-5 text-orange-500 mr-2" />
                      Property Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Name:</span>{" "}
                        {listing?.propertyName}
                      </p>
                      <p className="text-gray-700 flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                        {listing?.city}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Price per day:</span> $
                        {listing?.pricePerDay}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                      <Users className="w-5 h-5 text-orange-500 mr-2" />
                      Stay Details
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Check-in:</span>{" "}
                        {new Date(checkInDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Check-out:</span>{" "}
                        {new Date(checkOutDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Duration:</span>{" "}
                        {numberOfDays} days
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Guests:</span>{" "}
                        {numberOfGuests}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mb-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                  Guest Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700 font-medium">{guest?.name}</p>
                    <p className="text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {guest?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {specialRequests && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                  <h2 className="text-xl font-semibold text-blue-800 mb-4">
                    Special Requests
                  </h2>
                  <p className="text-gray-700">{specialRequests}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mb-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Payment Summary
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-orange-500">
                      ${totalPrice}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Payment Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColors[paymentStatus]}`}
                    >
                      {paymentStatus === "paid" && (
                        <BadgeCheck className="w-4 h-4 mr-1" />
                      )}
                      {paymentStatus === "pending" && (
                        <Clock className="w-4 h-4 mr-1" />
                      )}
                      {paymentStatus === "refunded" && (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      {paymentStatus.charAt(0).toUpperCase() +
                        paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mb-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Booking Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}
                    >
                      {status === "confirmed" && (
                        <BadgeCheck className="w-4 h-4 mr-1" />
                      )}
                      {status === "pending" && (
                        <Clock className="w-4 h-4 mr-1" />
                      )}
                      {status === "cancelled" && (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {status === "completed" && (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>

                  {status === "cancelled" && (
                    <div className="flex items-start text-yellow-700">
                      <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">
                        This booking was cancelled on{" "}
                        {new Date(updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Dates
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Last Updated:</span>{" "}
                    {new Date(updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingSelected;
