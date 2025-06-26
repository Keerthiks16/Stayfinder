import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  AirVent,
  CookingPot,
  WashingMachine,
  CircleParking,
  Volleyball,
  X,
  ChevronLeft,
  ChevronRight,
  BedDouble,
} from "lucide-react";
import useAdminStore from "../../store/adminStore";

const amenityIcons = {
  WiFi: <Wifi className="w-5 h-5" />,
  "Air Conditioning": <AirVent className="w-5 h-5" />,
  TV: <Tv className="w-5 h-5" />,
  Parking: <CircleParking className="w-5 h-5" />,
  Garden: <TreeDeciduous className="w-5 h-5" />,
  Balcony: <PanelRightClose className="w-5 h-5" />,
  Kitchen: <CookingPot className="w-5 h-5" />,
  Gym: <Dumbbell className="w-5 h-5" />,
  Pool: <Waves className="w-5 h-5" />,
  "Washing Machine": <WashingMachine className="w-5 h-5" />,
  "Pet Friendly": <Cat className="w-5 h-5" />,
  "Smoking Allowed": <Cigarette className="w-5 h-5" strokeWidth={1.5} />,
  "Hot Tub": <Bath className="w-5 h-5" />,
  "Fireplace": <Flame className="w-5 h-5" strokeWidth={1.5} />,
  "Beach Access": <Volleyball className="w-5 h-5" />,
};

const AdminListingSelected = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListingById, currentAdminListing, loading, error } =
    useAdminStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (id) {
      getListingById(id);
      console.log(currentAdminListing);
    }
  }, [id, getListingById]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === currentAdminListing?.subsidiaryImages[0]?.length - 1
        ? 0
        : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0
        ? currentAdminListing?.subsidiaryImages[0]?.length - 1
        : prevIndex - 1
    );
  };

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

  if (!currentAdminListing) {
    return (
      <div className="p-6 text-center">
        <p>No listing found</p>
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
    propertyName,
    propertyType,
    description,
    mainImage,
    subsidiaryImages,
    city,
    location,
    capacity,
    pricePerDay,
    amenities,
    owner,
    availability,
    averageRating,
    totalReviews,
    isActive,
    createdAt,
    updatedAt,
  } = currentAdminListing;

  const allImages = [mainImage, ...(subsidiaryImages[0] || [])];

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center mb-6 text-blue-600 hover:text-blue-800 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Listings
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">{propertyName}</h1>
          <div className="flex items-center text-white mt-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>
              {location?.address}, {city}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative">
              <img
                src={allImages[currentImageIndex]}
                alt={propertyName}
                className="w-full h-96 object-cover rounded-lg cursor-pointer"
                onClick={() => setShowImageModal(true)}
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
                  >
                    <ChevronLeft className="w-6 h-6 text-blue-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
                  >
                    <ChevronRight className="w-6 h-6 text-blue-700" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded-md cursor-pointer ${
                      currentImageIndex === index
                        ? "ring-2 ring-orange-500"
                        : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Basic Info */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                  Property Details
                </h2>
                <p className="text-gray-700 mb-4">{description}</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    <span className="text-gray-700">{propertyType}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5  mr-2" />
                    <span className="text-gray-700">
                      {capacity?.guests} guests
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BedDouble className="w-5 h-5  mr-2" />
                    <span className="text-gray-700">
                      {capacity?.bedrooms} bedrooms
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-5 h-5  mr-2" />
                    <span className="text-gray-700">
                      {capacity?.bathrooms} bathrooms
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5  mr-2" />
                    <span className="text-gray-700">
                      {availability?.isAvailable
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities?.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      {amenityIcons[amenity] || (
                        <CheckCircle className="w-5 h-5  mr-2" />
                      )}
                      <span className="text-gray-700 ml-2">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Pricing & Status
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">Price per day</p>
                    <p className="text-2xl font-bold text-orange-500">
                      ₹{pricePerDay?.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Status</p>
                    <p
                      className={`font-medium ${
                        isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Rating</p>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="font-medium">
                        {averageRating || "No reviews"} ({totalReviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      Owner Information
                    </h3>
                    <p className="text-gray-700">{owner?.name}</p>
                    <p className="text-gray-600">{owner?.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 rounded-lg p-6 border border-blue-100">
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

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white hover:text-orange-500 transition"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-4xl w-full">
            <img
              src={allImages[currentImageIndex]}
              alt={propertyName}
              className="w-full max-h-[80vh] object-contain"
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminListingSelected;
