import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useAuthStore from "./store/authStore";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import HomeAuth from "./pages/HomeAuth";
import HomeUnauth from "./pages/HomeUnauth";
import Explore from "./pages/Explore";
import CreateListing from "./pages/CreateListing";
import ShowAllListings from "./pages/ShowAllListings";
import SelectedListing from "./pages/SelectedListing";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ShowMyListings from "./pages/ShowMyListings";
import EditListing from "./pages/EditListing";
import BookingPage from "./pages/BookingPage";
import MyBookings from "./pages/MyBookings";
import GuestBookingPageById from "./pages/GuestBookingPageById";
import MyListingBookings from "./pages/MyListingBookings";
import OwnerBookingPageById from "./pages/OwnerBookingPageById";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminListings from "./pages/admin/AdminListings";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminHeroSections from "./pages/admin/AdminHeroSections";
import useAdminStore from "./store/adminStore";
import AdminUserSelected from "./pages/admin/AdminUserSelected";
import AdminListingSelected from "./pages/admin/AdminListingSelected";
import AdminBookingSelected from "./pages/admin/AdminBookingSelected";

const Layout = ({ children }) => {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={!!user} />
      <main className="flex-grow">{children}</main>
      <Footer isAuthenticated={!!user} />
    </div>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdminAuthenticated, adminAuth } = useAdminStore();

  if (!adminAuth.isAuthenticated) {
    return <Navigate to="/adminlogin" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow">{children}</main>
    </div>
  );
};

function App() {
  const { user, loading, getme } = useAuthStore();
  const { isAdminAuthenticated, adminLogin } = useAdminStore();
  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    getme();
  }, [getme]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "admin") {
      // TODO: Move to .env later
      adminLogin();
    } else {
      alert("Invalid admin password");
    }
  };

  return (
    <Routes>
      {/* Regular User Routes */}
      <Route
        path="/"
        element={<Layout>{user ? <HomeAuth /> : <HomeUnauth />}</Layout>}
      />
      <Route
        path="/explore"
        element={<Layout>{user ? <Explore /> : <Navigate to="/" />}</Layout>}
      />
      <Route
        path="/create"
        element={
          <Layout>{user ? <CreateListing /> : <Navigate to="/" />}</Layout>
        }
      />
      <Route
        path="/all-listings"
        element={
          <Layout>{user ? <ShowAllListings /> : <Navigate to="/" />}</Layout>
        }
      />
      <Route
        path="/my-listings"
        element={
          <Layout>{user ? <ShowMyListings /> : <Navigate to="/" />}</Layout>
        }
      />
      <Route
        path="/bookings"
        element={<Layout>{user ? <MyBookings /> : <Navigate to="/" />}</Layout>}
      />
      <Route
        path="/listing/:id"
        element={
          <Layout>{user ? <SelectedListing /> : <Navigate to="/" />}</Layout>
        }
      />
      <Route
        path="/edit-listing/:id"
        element={
          <Layout>{user ? <EditListing /> : <Navigate to="/" />}</Layout>
        }
      />
      <Route
        path="editbooking/:id"
        element={
          <Layout>
            {user ? <GuestBookingPageById /> : <Navigate to="/" />}
          </Layout>
        }
      />
      <Route
        path="/booking/:id"
        element={
          <Layout>{user ? <BookingPage /> : <Navigate to="/" />}</Layout>
        }
      />
      <Route
        path="/mylistingbookings"
        element={
          <Layout>{user ? <MyListingBookings /> : <Navigate to="/" />}</Layout>
        }
      />
      <Route
        path="/owner-booking-edit/:id"
        element={
          <Layout>
            {user ? <OwnerBookingPageById /> : <Navigate to="/" />}
          </Layout>
        }
      />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />

      {/* Admin Routes */}
      <Route
        path="/adminlogin"
        element={
          isAdminAuthenticated ? (
            <Navigate to="/admin/dashboard" />
          ) : (
            <AdminLogin
              password={adminPassword}
              setPassword={setAdminPassword}
              handleLogin={handleAdminLogin}
            />
          )
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <AdminUsers />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/listings"
        element={
          <AdminLayout>
            <AdminListings />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <AdminLayout>
            <AdminBookings />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/hero-sections"
        element={
          <AdminLayout>
            <AdminHeroSections />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <AdminLayout>
            <AdminUserSelected />
          </AdminLayout>
        }
      /><Route
        path="/admin/listings/:id"
        element={
          <AdminLayout>
            <AdminListingSelected />
          </AdminLayout>
        }
      /><Route
        path="/admin/bookings/:id"
        element={
          <AdminLayout>
            <AdminBookingSelected />
          </AdminLayout>
        }
      />

      {/* Redirect any unknown paths */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
