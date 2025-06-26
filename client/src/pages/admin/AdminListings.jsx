import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  MapPin,
  User,
  Calendar,
  Star,
  Bed,
  Bath,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  IndianRupee,
} from "lucide-react";
import useAdminStore from "../../store/adminStore";

const AdminListings = () => {
  const { getAllListings, adminListings, listingsPagination, loading, error } =
    useAdminStore();
  const [filters, setFilters] = useState({
    propertyName: "",
    city: "",
    page: 1,
    limit: 9,
  });

  useEffect(() => {
    fetchListings();
  }, [filters.page, filters.propertyName, filters.city]);

  const fetchListings = async () => {
    await getAllListings(filters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= listingsPagination?.totalPages) {
      setFilters({ ...filters, page: newPage });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading && !adminListings?.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
        role="alert"
      >
        <p>{error}</p>
        <button
          onClick={fetchListings}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Property Listings Management
      </h1>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by property name"
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.propertyName}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  propertyName: e.target.value,
                  page: 1,
                })
              }
            />
          </div>
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by city"
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.city}
              onChange={(e) =>
                setFilters({ ...filters, city: e.target.value, page: 1 })
              }
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Filter className="h-5 w-5" />
            Filter
          </button>
        </form>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {adminListings?.map((listing) => (
          <div
            key={listing._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Property Image */}
            <div className="relative h-48 overflow-hidden">
              {listing.mainImage ? (
                <img
                  src={listing.mainImage}
                  alt={listing.propertyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Home className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {listing.propertyType}
              </div>
              <div className="absolute top-2 right-2">
                {listing.isActive ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Active
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> Inactive
                  </span>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {listing.propertyName}
                </h3>
                <span className="text-blue-600 font-medium flex items-center">
                  <IndianRupee className="h-4 w-4 mr-1" />
                  {formatPrice(listing.pricePerDay)}
                  <span className="text-gray-500 text-sm ml-1">/day</span>
                </span>
              </div>

              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">
                  {listing.location.address || listing.city}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center text-sm bg-gray-100 px-2 py-1 rounded">
                  <Users className="h-3 w-3 mr-1" /> {listing.capacity.guests}{" "}
                  guests
                </span>
                <span className="flex items-center text-sm bg-gray-100 px-2 py-1 rounded">
                  <Bed className="h-3 w-3 mr-1" /> {listing.capacity.bedrooms}{" "}
                  beds
                </span>
                <span className="flex items-center text-sm bg-gray-100 px-2 py-1 rounded">
                  <Bath className="h-3 w-3 mr-1" /> {listing.capacity.bathrooms}{" "}
                  baths
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{listing.owner.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(listing.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm">
                    {listing.averageRating > 0
                      ? listing.averageRating.toFixed(1)
                      : "New"}
                    <span className="text-gray-500 ml-1">
                      ({listing.totalReviews} reviews)
                    </span>
                  </span>
                </div>
                <Link
                  to={`/admin/listings/${listing._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View Details <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {listingsPagination && listingsPagination.totalPages > 1 && (
        <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200 rounded-b-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === listingsPagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(filters.page - 1) * filters.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    filters.page * filters.limit,
                    listingsPagination.totalListings
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {listingsPagination.totalListings}
                </span>{" "}
                listings
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from(
                  { length: listingsPagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      filters.page === page
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === listingsPagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminListings;
