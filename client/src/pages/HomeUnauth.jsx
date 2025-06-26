import React, { useState, useEffect } from "react";
import logo from "../assets/Logo.png";

// Mock Link component for demo purposes
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

import {
  MapPin,
  Star,
  Home,
  Globe,
  DollarSign,
  Calendar,
  PlusCircle,
  Shield,
  ArrowRight,
  Check,
  Heart,
  Users,
  CreditCard,
  RefreshCw,
} from "lucide-react";

const HomeUnauth = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
  ];

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const featuredProperties = [
    {
      id: 1,
      title: "Cyber Heights Studio",
      location: "Hitech City, Hyderabad",
      price: "₹6,800/night",
      rating: 4.9,
      reviews: 24,
      image:
        "https://res.cloudinary.com/dfl1atrc4/image/upload/v1750944014/stayfinder/listings/main/giyym9xqzygzjcigbqwa.jpg",
      amenities: ["WiFi", "TV", "Gym", "Kitchen"],
    },
    {
      id: 2,
      title: "The Bamboo Nest",
      location: "Pozhuthana, Wayanad",
      price: "₹8,900/night",
      rating: 4.7,
      reviews: 18,
      image:
        "https://res.cloudinary.com/dfl1atrc4/image/upload/v1750934003/stayfinder/listings/main/sf4fmvgsarmeazgjzkbc.jpg",
      amenities: ["WiFi", "Air Conditioning", "TV", "Beach Access"],
    },
    {
      id: 3,
      title: "The Royal Courtyard",
      location: "Amer Road, Jaipur",
      price: "₹16,996/night",
      rating: 4.8,
      reviews: 32,
      image:
        "https://res.cloudinary.com/dfl1atrc4/image/upload/v1750849859/stayfinder/listings/main/mjpyvwifkspvpipksui6.jpg",
      amenities: ["WiFi", "Balcony", "Air Conditioning", "Parking"],
    },
  ];

  const features = [
    {
      icon: <PlusCircle className="h-8 w-8 text-blue-600" />,
      title: "List Your Property",
      description:
        "Easily add your property with our simple listing process. Set your own prices and availability.",
      color: "blue",
    },
    {
      icon: <Calendar className="h-8 w-8 text-orange-500" />,
      title: "Book with Confidence",
      description:
        "Secure instant bookings with our reliable reservation system.",
      color: "orange",
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Verified Stays",
      description: "All listings are verified to ensure quality and accuracy.",
      color: "blue",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-orange-500" />,
      title: "Flexible Payments",
      description:
        "Multiple payment options including credit cards, UPI, and wallets.",
      color: "orange",
    },
    {
      icon: <RefreshCw className="h-8 w-8 text-blue-600" />,
      title: "Easy Refunds",
      description: "Cancel anytime with our straightforward refund policy.",
      color: "blue",
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "24/7 Support",
      description: "Our team is always available to help with any questions.",
      color: "orange",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden min-h-[500px]">
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

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-center text-center px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover unique accommodations across India - from cozy apartments
              to luxury villas
            </p>

            {/* Current Location Info */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white mb-8">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">
                {heroImages[currentSlide].title}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/listings"
              className="inline-flex items-center justify-center bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Browse Listings
            </Link>
          </div>
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
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Choose StayFinder?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes finding and managing accommodations simple and
              stress-free
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border ${
                  feature.color === "blue"
                    ? "border-blue-100 bg-blue-50"
                    : "border-orange-100 bg-orange-50"
                } hover:shadow-md transition-shadow`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    feature.color === "blue" ? "bg-blue-100" : "bg-orange-100"
                  }`}
                >
                  {feature.icon}
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    feature.color === "blue"
                      ? "text-blue-800"
                      : "text-orange-800"
                  }`}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              How StayFinder Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to find or list your perfect accommodation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Create Your Account
              </h3>
              <p className="text-gray-600">
                Sign up as a guest or host in just a few minutes
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-orange-600 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {window.innerWidth > 768
                  ? "Find or List Properties"
                  : "Browse or List"}
              </h3>
              <p className="text-gray-600">
                Search for stays or add your property with photos and details
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Book or Get Booked
              </h3>
              <p className="text-gray-600">
                Secure your stay or start earning from your property
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
              Featured Properties
            </h2>
            <Link
              to="/listings"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>View All Properties</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {property.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {property.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-gray-800">
                        {property.price}
                      </span>
                      <p className="text-xs text-gray-500">
                        {property.reviews} reviews
                      </p>
                    </div>
                    <Link
                      to={`/listings/${property.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Perfect Stay?
          </h2>
          <p className="text-lg mb-8">
            Join thousands of happy travelers and hosts on StayFinder today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeUnauth;
