import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";
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
} from "lucide-react";
import Footer from "../components/Footer";

// Mock auth store for demo
const useAuthStore = () => ({
  user: null,
  isAuthenticated: false,
  logout: () => console.log("logout"),
});

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  // Hero slider images
  const heroImages = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      title: "Santorini, Greece",
      description: "Breathtaking sunset views",
    },
    {
      id: 2,
      url: "https://static.thehoneycombers.com/wp-content/uploads/sites/4/2019/08/Ulun-Danu-Beratan-in-Bedugul-Bali-Indonesia-.jpg",
      title: "Bali, Indonesia",
      description: "Tropical paradise awaits",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      title: "Swiss Alps",
      description: "Mountain luxury retreats",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      title: "Maldives",
      description: "Overwater villa paradise",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      title: "Tuscany, Italy",
      description: "Rolling hills and vineyards",
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

  const featuredProperties = [
    {
      id: 1,
      title: "Modern Downtown Apartment",
      location: "Mumbai, Maharashtra",
      price: "₹2,500/night",
      rating: 4.8,
      reviews: 124,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      amenities: ["Wifi", "AC", "Kitchen"],
    },
    {
      id: 2,
      title: "Cozy Beachside Villa",
      location: "Goa, India",
      price: "₹4,200/night",
      rating: 4.9,
      reviews: 89,
      image:
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2226&q=80",
      amenities: ["Pool", "Beach Access", "Parking"],
    },
    {
      id: 3,
      title: "Luxury Mountain Retreat",
      location: "Manali, Himachal Pradesh",
      price: "₹3,800/night",
      rating: 4.7,
      reviews: 156,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      amenities: ["Fireplace", "Mountain View", "Hot Tub"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt="StayFinder"
                className="w-10 h-10 rounded-xl"
              />
              <h1 className="text-2xl font-bold text-orange-500">
                stay<span className="text-cyan-600">finder</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-cyan-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/explore"
                className="text-gray-700 hover:text-cyan-600 transition-colors"
              >
                Explore
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-cyan-600 transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-cyan-600 transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-cyan-600 transition-colors"
                  >
                    Welcome, {user?.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-cyan-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link to="/" className="text-gray-700 hover:text-cyan-600">
                  Home
                </Link>
                <Link
                  to="/explore"
                  className="text-gray-700 hover:text-cyan-600"
                >
                  Explore
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-cyan-600">
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-cyan-600"
                >
                  Contact
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-cyan-600"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-left text-red-600 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-cyan-600 hover:text-cyan-700"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="text-cyan-600 hover:text-cyan-700"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

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

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

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
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Find Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-cyan-400">
              Stay
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto drop-shadow-md">
            Discover amazing places to stay around the world. From cozy
            apartments to luxury villas, find accommodations that match your
            style and budget.
          </p>

          {/* Current Location Info */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">
                {heroImages[currentSlide].title} -{" "}
                {heroImages[currentSlide].description}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
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
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Why Choose StayFinder?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Verified Properties
              </h3>
              <p className="text-gray-600">
                All our properties are verified and reviewed to ensure quality
                and safety.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Best Prices
              </h3>
              <p className="text-gray-600">
                Get the best deals and prices on accommodations worldwide.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Easy Booking
              </h3>
              <p className="text-gray-600">
                Simple and secure booking process with instant confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Featured Stays</h2>
            <button className="flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 font-medium">
              <span>View All</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {property.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {property.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded-lg"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-gray-800">
                        {property.price}
                      </span>
                      <p className="text-sm text-gray-600">
                        {property.reviews} reviews
                      </p>
                    </div>
                    <button className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-500 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Stay?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who trust StayFinder for their
            accommodation needs.
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 bg-white text-cyan-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
            >
              <span>Get Started Today</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}
