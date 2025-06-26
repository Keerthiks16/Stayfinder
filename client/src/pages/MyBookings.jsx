import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useBookingStore from "../store/bookingStore";
import {
  Calendar,
  Home,
  Users,
  BadgeIndianRupee,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
} from "lucide-react";
import { format } from "date-fns";

const MyBookings = () => {
  const navigate = useNavigate();
  const { getMyBookings, bookings, pagination, loading, error } =
    useBookingStore();

  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    const result = await getMyBookings();
    if (!result.success) {
      toast.error(result.error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      paymentStatus: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      limit: 10,
    });
  };

  const handleEditBooking = (bookingId) => {
    navigate(`/editbooking/${bookingId}`);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status, paymentStatus) => {
    if (status === "cancelled") {
      return (
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <XCircle className="w-4 h-4" />
          Cancelled
        </span>
      );
    }
    if (status === "confirmed" && paymentStatus === "paid") {
      return (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Confirmed
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Clock className="w-4 h-4" />
          Pending
        </span>
      );
    }
    if (status === "completed") {
      return (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Completed
        </span>
      );
    }
    return (
      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
        {status}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case "paid":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
            Failed
          </span>
        );
      case "refunded":
        return (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Refunded
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
            {paymentStatus}
          </span>
        );
    }
  };

  if (loading && bookings.length === 0) {
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
          Error Loading Bookings
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Go Back
          </button>
          <button
            onClick={() => fetchBookings()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (bookings.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <div className="bg-blue-100 p-6 rounded-full mb-4">
          <div className="text-blue-600 text-4xl">📅</div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          No Bookings Found
        </h2>
        <p className="text-gray-600 mb-6">
          You haven't made any bookings yet, or no bookings match your filters.
        </p>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            Manage and track all your property bookings
          </p>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={booking.listing.mainImage}
                    alt={booking.listing.propertyName}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop";
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {booking.listing.propertyName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {booking.listing.city}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(booking.status, booking.paymentStatus)}
                  {getPaymentBadge(booking.paymentStatus)}
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Dates */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Dates
                  </h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">
                      {formatDate(booking.checkInDate)} -{" "}
                      {formatDate(booking.checkOutDate)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {booking.numberOfDays} night
                    {booking.numberOfDays !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Guests & Owner */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Details
                  </h4>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">
                      {booking.numberOfGuests} guest
                      {booking.numberOfGuests !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">
                      {booking.listing.owner.name}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Price
                  </h4>
                  <div className="flex items-center gap-2">
                    <BadgeIndianRupee className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-orange-600">
                        {formatPrice(booking.totalPrice)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Booked on {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => handleEditBooking(booking._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                    Edit
                  </button>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Special Requests
                  </h4>
                  <p className="text-gray-700">{booking.specialRequests}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className={`p-2 rounded-full ${
                  pagination.hasPrev
                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-full ${
                      page === pagination.currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className={`p-2 rounded-full ${
                  pagination.hasNext
                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
