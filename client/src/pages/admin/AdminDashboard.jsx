import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../../store/adminStore";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    adminLogout,
    adminAuth,
    getDashboardStats,
    getAllUsers,
    getAllListings,
    getAllBookings,
  } = useAdminStore();
  const navigate = useNavigate();

  // State for dashboard data
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await adminLogout();
      navigate("/adminlogin");
    } catch (err) {
      console.error("Logout failed:", err.message || "Unknown error");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch dashboard stats
        const statsResponse = await getDashboardStats();
        if (statsResponse.success) {
          setStats(statsResponse.stats);
        }

        // Fetch recent users (limit to 5)
        const usersResponse = await getAllUsers({
          limit: 5,
          sort: "-createdAt",
        });
        if (usersResponse.success) {
          setRecentUsers(usersResponse.data.users);
        }

        // Fetch recent listings (limit to 5)
        const listingsResponse = await getAllListings({
          limit: 5,
          sort: "-createdAt",
        });
        if (listingsResponse.success) {
          setRecentListings(listingsResponse.data.listings);
        }

        // Fetch recent bookings (limit to 5)
        const bookingsResponse = await getAllBookings({
          limit: 5,
          sort: "-createdAt",
        });
        if (bookingsResponse.success) {
          setRecentBookings(bookingsResponse.data.bookings);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [getDashboardStats, getAllUsers, getAllListings, getAllBookings]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {adminAuth.adminInfo?.name || "Admin"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Users
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stats?.totalUsers || "--"}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Listings
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stats?.totalListings || "--"}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Bookings
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stats?.totalBookings || "--"}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Recent Users */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    Recent Users
                  </h3>
                  <button
                    onClick={() => navigate("/admin/users")}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user) => (
                      <div
                        key={user._id}
                        className="px-4 py-4 sm:px-6 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {user.name?.charAt(0) || "U"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name || "No Name"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 sm:px-6 text-sm text-gray-500">
                      No recent users found
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Listings */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <svg
                      className="h-5 w-5 text-blue-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Recent Listings
                  </h3>
                  <button
                    onClick={() => navigate("/admin/listings")}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentListings.length > 0 ? (
                    recentListings.map((listing) => (
                      <div
                        key={listing._id}
                        className="px-4 py-4 sm:px-6 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium">
                                {listing.propertyName?.charAt(0) || "L"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {listing.propertyName || "No Title"}
                              </div>
                              <div className="text-sm text-gray-500">
                                Rs {listing.pricePerDay || "--"}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(listing.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 sm:px-6 text-sm text-gray-500">
                      No recent listings found
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <svg
                      className="h-5 w-5 text-orange-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Recent Bookings
                  </h3>
                  <button
                    onClick={() => navigate("/admin/bookings")}
                    className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                  >
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="px-4 py-4 sm:px-6 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <span className="text-orange-600 font-medium">
                                {booking.listing.propertyName?.charAt(0) || "B"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.listing?.propertyName || "No Title"}
                              </div>
                              <div className="text-sm text-gray-500">
                                ${booking.totalPrice || "--"}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-4 sm:px-6 text-sm text-gray-500">
                      No recent bookings found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
