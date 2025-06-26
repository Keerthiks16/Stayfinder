import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Home,
  Hotel,
  Loader2,
} from "lucide-react";
import useAdminStore from "../../store/adminStore";

const AdminUserSelected = () => {
  const { id } = useParams();
  const { getUserById, currentAdminUser, loading, error } = useAdminStore();

  useEffect(() => {
    getUserById(id);
  }, [id, getUserById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!currentAdminUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No user data available</p>
      </div>
    );
  }

  const {
    name,
    email,
    phoneNumber,
    isVerified,
    isAdmin,
    createdAt,
    listings = [],
    bookings = [],
    profileImage,
  } = currentAdminUser;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-3xl font-bold">User Details</h1>
          <p className="opacity-90">Viewing information for {name}</p>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-shrink-0">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                  <User className="w-16 h-16 text-blue-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-blue-800 mb-2">{name}</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-orange-500 mr-2" />
                  <span className="text-gray-700">{email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-orange-500 mr-2" />
                  <span className="text-gray-700">
                    {phoneNumber || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-orange-500 mr-2" />
                  <span className="text-gray-700">
                    Joined: {new Date(createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  {isVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  <span className="text-gray-700">
                    {isVerified ? "Verified" : "Not Verified"}
                  </span>
                </div>
                <div className="flex items-center">
                  {isAdmin ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  <span className="text-gray-700">
                    {isAdmin ? "Admin User" : "Regular User"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <Home className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-blue-800">
                  Listings
                </h3>
              </div>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {listings.length}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <div className="flex items-center">
                <Hotel className="w-6 h-6 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold text-orange-800">
                  Bookings
                </h3>
              </div>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {bookings.length}
              </p>
            </div>
          </div>

          {/* ID Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              User ID
            </h3>
            <p className="text-gray-600 font-mono break-all">{id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserSelected;
