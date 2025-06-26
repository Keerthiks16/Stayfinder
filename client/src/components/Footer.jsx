import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";

const Footer = ({ isAuthenticated }) => {
  return (
    <footer className="bg-gray-800 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <img
                  src={logo}
                  alt="StayFinder Logo"
                  className="w-12 h-12 rounded-2xl mb-1 mx-auto"
                />
              </div>
              <h3 className="text-2xl font-bold text-orange-500">
                stay<span className="text-cyan-400">finder</span>
              </h3>
            </div>
            <p className="text-gray-400">
              Your trusted partner for finding the perfect accommodation
              worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link
                to="/"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {isAuthenticated ? "Dashboard" : "Home"}
              </Link>
              <Link
                to={isAuthenticated ? "/all-listings" : "/explore"}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                {isAuthenticated ? "Browse Properties" : "Explore"}
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/about"
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <>
                  <Link
                    to="/bookings"
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/create"
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    List Property
                  </Link>
                </>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <Link
                to="/help"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Help Center
              </Link>
              <Link
                to="/safety"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Safety
              </Link>
              <Link
                to="/cancellation"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Cancellation
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  My Profile
                </Link>
              ) : (
                <Link
                  to="/host"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  Become a Host
                </Link>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href="#"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 stayfinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
