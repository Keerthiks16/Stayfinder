import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { toast } from "react-hot-toast";
import useListingStore from "../store/listingStore";
import useBookingStore from "../store/bookingStore";

const BookingPage = () => {
  const { id } = useParams();
  const { checkAvailability, loading, error } = useListingStore();
  const { createBooking, loading: bookingLoading } = useBookingStore();

  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    specialRequests: "",
  });

  const [availabilityResult, setAvailabilityResult] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDateForAPI = (dateString) => {
    // Convert YYYY-MM-DD to the required format
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleCheckAvailability = async (e) => {
    e.preventDefault();

    if (!formData.checkInDate || !formData.checkOutDate) {
      toast.error("Please select both check-in and check-out dates");
      return;
    }

    if (new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    const result = await checkAvailability(
      id,
      formatDateForAPI(formData.checkInDate),
      formatDateForAPI(formData.checkOutDate),
      parseInt(formData.numberOfGuests)
    );

    if (result.success) {
      setAvailabilityResult(result.data);
      if (!result.data.isAvailable) {
        toast.error(result.data.analysis.message);
        return;
      }
      toast.success(result.data.analysis.message);
      setShowBookingDetails(true);
    } else {
      toast.error(result.error);
    }
  };

  const handleBooking = async () => {
    const bookingData = {
      listingId: id,
      checkInDate: formatDateForAPI(formData.checkInDate),
      checkOutDate: formatDateForAPI(formData.checkOutDate),
      numberOfGuests: parseInt(formData.numberOfGuests),
      specialRequests: formData.specialRequests,
    };

    console.log("Final booking data:", bookingData);

    const result = await createBooking(bookingData);

    if (result.success) {
      toast.success("Booking created successfully!");
      navigate("/bookings");
    } else {
      toast.error(result.error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Book Your Stay</h1>

      {/* Booking Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Select Your Dates
        </h2>

        <form onSubmit={handleCheckAvailability} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="checkInDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Check-in Date
              </label>
              <input
                type="date"
                id="checkInDate"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="checkOutDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Check-out Date
              </label>
              <input
                type="date"
                id="checkOutDate"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                min={
                  formData.checkInDate || new Date().toISOString().split("T")[0]
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="numberOfGuests"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number of Guests
            </label>
            <input
              type="number"
              id="numberOfGuests"
              name="numberOfGuests"
              value={formData.numberOfGuests}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="specialRequests"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Special Requests (Optional)
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special requests or notes..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? "Checking Availability..." : "Check Availability"}
          </button>
        </form>
      </div>

      {/* Availability Results */}
      {showBookingDetails && availabilityResult && (
        <div className="space-y-6">
          {/* Property Details */}
          {availabilityResult.listing && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                {availabilityResult.listing.images &&
                  availabilityResult.listing.images[0] && (
                    <img
                      src={availabilityResult.listing.images[0]}
                      alt={availabilityResult.listing.propertyName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {availabilityResult.listing.propertyName}
                  </h3>
                  <p className="text-gray-600">
                    {availabilityResult.listing.city}
                  </p>
                  <p className="text-lg font-medium text-blue-600 mt-2">
                    ₹ {availabilityResult.listing.pricePerDay} per night
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    {availabilityResult.listing.capacity.guests} guests •{" "}
                    {availabilityResult.listing.capacity.bedrooms} bedrooms •{" "}
                    {availabilityResult.listing.capacity.bathrooms} bathrooms
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Summary */}
          {availabilityResult.booking && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Booking Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">
                    {formatDate(availabilityResult.booking.checkInDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">
                    {formatDate(availabilityResult.booking.checkOutDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of days:</span>
                  <span className="font-medium">
                    {availabilityResult.booking.numberOfDays}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-medium">
                    {availabilityResult.booking.numberOfGuests}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Price:</span>
                    <span className="text-blue-600">
                      ₹ {availabilityResult.booking.pricing.basePrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          {availabilityResult.tips && availabilityResult.tips.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Tips:</h4>
              <ul className="space-y-1">
                {availabilityResult.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Alternative Dates (if unavailable) */}
          {!availabilityResult.isAvailable &&
            availabilityResult.alternatives && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-800 mb-3">
                  Alternative Available Dates:
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {availabilityResult.alternatives.message}
                </p>
                <div className="space-y-2">
                  {availabilityResult.alternatives.suggestedDates.map(
                    (date, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-white rounded border"
                      >
                        <div>
                          <span className="text-sm font-medium">
                            {formatDate(date.checkInDate)} -{" "}
                            {formatDate(date.checkOutDate)}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-green-600">
                          ₹ {date.priceTotal}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Conflict Details (if unavailable) */}
          {!availabilityResult.isAvailable &&
            availabilityResult.analysis.conflictDetails.existingBookings
              .length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">
                  Existing Bookings:
                </h4>
                {availabilityResult.analysis.conflictDetails.existingBookings.map(
                  (booking, index) => (
                    <div key={index} className="text-sm text-red-700">
                      {formatDate(booking.checkInDate)} -{" "}
                      {formatDate(booking.checkOutDate)}({booking.numberOfDays}{" "}
                      days)
                    </div>
                  )
                )}
              </div>
            )}

          {/* Book Button */}
          {availabilityResult.isAvailable && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="bg-green-600 text-white py-3 px-8 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 text-lg font-semibold"
              >
                {bookingLoading ? "Creating Booking..." : "Book Now"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingPage;
