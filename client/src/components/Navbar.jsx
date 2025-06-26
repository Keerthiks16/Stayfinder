import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import logo from "../assets/Logo.png";
import {
  User,
  Menu,
  X,
  LogOut,
  Home as HomeIcon,
  Globe,
  Briefcase,
  Calendar,
  Heart as HeartIcon,
  PlusCircle,
  List,
  BookOpen,
  Phone,
} from "lucide-react";

const Navbar = ({ isAuthenticated }) => {
  const { user, logout, loading } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src={logo}
                alt="StayFinder Logo"
                className="w-10 h-10 rounded-xl"
              />
              <h1 className="text-2xl font-bold text-orange-500">
                stay<span className="text-cyan-600">finder</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/all-listings" icon={<Globe size={18} />}>
                  Browse
                </NavLink>
                <NavLink to="/bookings" icon={<Calendar size={18} />}>
                  My Bookings
                </NavLink>
                <NavLink to="/mylistingbookings" icon={<BookOpen size={18} />}>
                  Listing Bookings
                </NavLink>
                <NavLink to="/my-listings" icon={<List size={18} />}>
                  My Listings
                </NavLink>
                <NavLink to="/create" icon={<PlusCircle size={18} />}>
                  List Property
                </NavLink>

                <div className="flex items-center ml-4 space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user?.name.split(" ")[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{loading ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/" icon={<HomeIcon size={18} />}>
                  Home
                </NavLink>
                <NavLink to="/explore" icon={<Globe size={18} />}>
                  Explore
                </NavLink>
                <NavLink to="/about" icon={<Briefcase size={18} />}>
                  About
                </NavLink>
                <NavLink to="/contact" icon={<Phone size={18} />}>
                  Contact
                </NavLink>

                <div className="flex items-center ml-4 space-x-4">
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 font-medium transition-colors px-3 py-2"
                  >
                    <User size={18} />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <PlusCircle size={18} />
                    <span>Get Started</span>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-cyan-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 px-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  <MobileNavLink to="/all-listings" icon={<Globe size={18} />}>
                    Browse Properties
                  </MobileNavLink>
                  <MobileNavLink to="/bookings" icon={<Calendar size={18} />}>
                    My Bookings
                  </MobileNavLink>
                  <MobileNavLink
                    to="/mylistingbookings"
                    icon={<BookOpen size={18} />}
                  >
                    Listing Bookings
                  </MobileNavLink>
                  <MobileNavLink to="/my-listings" icon={<List size={18} />}>
                    My Listings
                  </MobileNavLink>
                  <MobileNavLink to="/create" icon={<PlusCircle size={18} />}>
                    List Property
                  </MobileNavLink>

                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    <span>{loading ? "Logging out..." : "Logout"}</span>
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink to="/" icon={<HomeIcon size={18} />}>
                    Home
                  </MobileNavLink>
                  <MobileNavLink to="/explore" icon={<Globe size={18} />}>
                    Explore
                  </MobileNavLink>
                  <MobileNavLink to="/about" icon={<Briefcase size={18} />}>
                    About
                  </MobileNavLink>
                  <MobileNavLink to="/contact" icon={<Phone size={18} />}>
                    Contact
                  </MobileNavLink>

                  <div className="flex flex-col space-y-2 pt-2">
                    <Link
                      to="/login"
                      className="flex items-center space-x-2 px-3 py-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors"
                    >
                      <User size={18} />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all"
                    >
                      <PlusCircle size={18} />
                      <span>Get Started</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, icon, children }) => (
  <Link
    to={to}
    className="flex items-center space-x-1.5 px-3 py-2 text-gray-700 hover:text-cyan-600 hover:bg-gray-50 rounded-lg transition-colors"
  >
    {icon}
    <span>{children}</span>
  </Link>
);

// Reusable MobileNavLink component
const MobileNavLink = ({ to, icon, children }) => (
  <Link
    to={to}
    className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:text-cyan-600 hover:bg-gray-50 rounded-lg transition-colors"
  >
    {icon}
    <span>{children}</span>
  </Link>
);

export default Navbar;
