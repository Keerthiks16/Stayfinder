import React, { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import useListingStore from "../store/listingStore";
import useBookingStore from "../store/bookingStore";
import logo from "../assets/Logo.png";

// Mock Link component for demo purposes
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

import {
  Search,
  MapPin,
  Star,
  Users,
  Wifi,
  Car,
  Coffee,
  Shield,
  Heart,
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  Globe,
  DollarSign,
  User,
  Calendar,
  List,
  LogOut,
  Briefcase,
  Clock,
  Check,
  X as XIcon,
} from "lucide-react";

const HomeAuth = () => {
  const { user, logout, loading: authLoading } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Listing store
  const {
    myListings,
    listings,
    getMyListings,
    getAllListings,
    loading: listingsLoading,
  } = useListingStore();

  // Booking store
  const {
    bookings,
    propertyBookings,
    getMyBookings,
    getMyPropertyBookings,
    loading: bookingsLoading,
    stats: bookingStats,
    getBookingStats,
  } = useBookingStore();

  const handleLogout = async () => {
    await logout();
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      await getMyListings();
      await getMyBookings();
      await getMyPropertyBookings();
      await getBookingStats();
      await getAllListings({ limit: 3 }); // Fetch 3 random listings for suggestions
    };

    fetchUserData();
  }, []);

  // Hero slider images
  const heroImages = [
  {
    id: 1,
    url: "https://www.traveldailymedia.com/assets/2019/07/jaipur.jpg",
    title: "Jaipur, Rajasthan",
    description: "Royal charm of the Pink City",
  },
  {
    id: 2,
    url: "https://tripjive.com/wp-content/uploads/2023/12/backwaters-of-Kerala.jpg",
    title: "Alleppey, Kerala",
    description: "Peaceful backwaters and houseboats",
  },
  {
    id: 3,
    url: "https://roadexpeditions.com/wp-content/uploads/2023/07/4-Day-Leh-Ladakh-Adventure-Exploring-the-Himalayas.jpg",
    title: "Leh-Ladakh",
    description: "High-altitude adventure in the Himalayas",
  },
  {
    id: 4,
    url: "https://live.staticflickr.com/7816/47307274452_1945bbef47_b.jpg",
    title: "Varanasi, Uttar Pradesh",
    description: "Spirituality on the banks of the Ganges",
  },
  {
    id: 5,
    url: "https://media-cdn.tripadvisor.com/media/photo-m/1280/28/6d/a0/a4/outdoor-seating.jpg",
    title: "Goa",
    description: "Golden beaches and vibrant nightlife",
  },
];



  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length
    );
  };

  // Booking status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-red-50">
      {/* Hero Section with Image Slider */}
      <section className="relative py-20 px-4 overflow-hidden min-h-[400px]">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-6">
            Welcome back,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-cyan-400">
              {user?.name}!
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
            Ready for your next adventure? Discover amazing places that match
            your style and budget.
          </p>

          {/* Current Location Info */}
          <div className="mb-6">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">
                {heroImages[currentSlide].title} -{" "}
                {heroImages[currentSlide].description}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          {/* <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Where do you want to stay?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-lg bg-white"
                />
              </div>
              <button className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-8 py-4 rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-lg font-medium">
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>
          </div> */}
        </div>
      </section>

      {/* User Stats Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Your StayFinder Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Listings Card */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Your Listings
                  </h3>
                  <p className="text-4xl font-bold text-cyan-700">
                    {myListings?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Properties you're hosting
                  </p>
                </div>
                <div className="w-16 h-16 bg-cyan-200 rounded-xl flex items-center justify-center">
                  <Home className="h-8 w-8 text-cyan-700" />
                </div>
              </div>
              {myListings?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Recent Listings:
                  </h4>
                  <div className="flex space-x-2">
                    {myListings.slice(0, 3).map((listing) => (
                      <div
                        key={listing._id}
                        className="w-12 h-12 rounded-lg overflow-hidden"
                      >
                        <img
                          src={
                            listing.mainImage ||
                            "https://via.placeholder.com/100"
                          }
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bookings Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Your Trips
                  </h3>
                  <p className="text-4xl font-bold text-blue-700">
                    {bookings?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Upcoming and past stays
                  </p>
                </div>
                <div className="w-16 h-16 bg-blue-200 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-blue-700" />
                </div>
              </div>
              {bookings?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Upcoming:
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      {bookings.filter((b) => b.status === "confirmed").length}{" "}
                      confirmed
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Hosting Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Hosting Stats
                  </h3>
                  <p className="text-4xl font-bold text-purple-700">
                    {propertyBookings?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Guest bookings on your properties
                  </p>
                </div>
                <div className="w-16 h-16 bg-purple-200 rounded-xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-purple-700" />
                </div>
              </div>
              {bookingStats && (
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">
                      {bookingStats.confirmedBookings} confirmed
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-gray-700">
                      {bookingStats.pendingBookings} pending
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* User Listings Preview */}
      {myListings?.length > 0 && (
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Your Listings
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {myListings.slice(0, 3).map((listing) => (
                <div
                  key={listing._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={
                        listing.mainImage ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={listing.propertyName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-lg font-semibold text-white">
                        {listing.propertyName}
                      </h3>
                      <p className="text-sm text-white/90">
                        {listing.location?.address}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-gray-800">
                        ₹{listing.pricePerDay}/night
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">
                          {listing.rating || "New"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {listing.amenities?.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
                        >
                          {amenity}
                        </span>
                      ))}
                      {listing.amenities?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                          +{listing.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Bookings Section */}
      {(bookings?.length > 0 || propertyBookings?.length > 0) && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Recent Bookings
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Guest Bookings */}
              {bookings?.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                    Your Trips
                  </h3>
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking._id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {booking.listing?.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(
                                booking.checkInDate
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                booking.checkOutDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            ₹{booking.totalPrice}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {bookings.length > 3 && (
                    <div className="mt-4 text-right">
                      <Link
                        to="/my-bookings"
                        className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                      >
                        View all trips →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Host Bookings */}
              {propertyBookings?.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-600" />
                    Guest Reservations
                  </h3>
                  <div className="space-y-4">
                    {propertyBookings.slice(0, 3).map((booking) => (
                      <div
                        key={booking._id}
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {booking.listing?.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Booked by: {booking.guest?.name}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            ₹{booking.totalPrice}
                          </span>
                          {/* <Link
                            to={`/owner-booking-edit/${booking._id}`}
                            className="text-sm text-cyan-600 hover:text-cyan-700"
                          >
                            Manage
                          </Link> */}
                        </div>
                      </div>
                    ))}
                  </div>
                  {propertyBookings.length > 3 && (
                    <div className="mt-4 text-right">
                      {/* <Link
                        to="/host/bookings"
                        className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                      >
                        View all reservations →
                      </Link> */}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Why Choose StayFinder?
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            The easiest way to find, book, and manage your perfect stay
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Listing Feature */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                <Home className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Effortless Listing
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Simple property setup</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Multiple photo uploads</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Smart pricing tools</span>
                </li>
              </ul>
            </div>

            {/* Booking Feature */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Seamless Booking
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Instant confirmation</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Secure payments</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>24/7 customer support</span>
                </li>
              </ul>
            </div>

            {/* Management Feature */}
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <List className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Smart Management
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Unified dashboard</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Automated messaging</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Performance analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Properties */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">
              Recommended Stays
            </h2>
            <Link
              to="/listings"
              className="flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 font-medium"
            >
              <span>Browse All</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {listingsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : listings?.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {listings.map((listing) => (
                <div
                  key={listing._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={
                        listing.mainImage ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={listing.propertyName}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"></button>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {listing.propertyName}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">
                          {listing.rating || "New"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">
                        {listing.location?.address || "Location not specified"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {listing.amenities?.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-lg"
                        >
                          {amenity}
                        </span>
                      ))}
                      {listing.amenities?.length > 3 && (
                        <span className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-lg">
                          +{listing.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-gray-800">
                          ₹{listing.pricePerDay}/night
                        </span>
                      </div>
                      {/* <Link
                        to={`/listings/${listing._id}`}
                        className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all"
                      >
                        View
                      </Link> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No listings found. Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeAuth;
