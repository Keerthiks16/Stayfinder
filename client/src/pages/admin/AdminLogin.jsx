import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "./../../assets/Logo.png";
import useAdminStore from "../../store/adminStore";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passkey: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);

  const { adminLogin, error, loading } = useAdminStore();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Basic validation
      if (!formData.email || !formData.password || !formData.passkey) {
        toast.error("Please fill in all fields");
        return;
      }

      // Check admin passkey
      if (formData.passkey !== "admin") {
        toast.error("Invalid admin passkey");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      const result = await adminLogin(loginData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.admin?.isAdmin) {
        toast.success("Admin login successful!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(`Error in Admin Login: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <img
          src={logo}
          alt="Admin Portal Logo"
          className="w-20 h-20 rounded-2xl mb-2 mx-auto"
        />

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">
            Admin<span className="text-cyan-600">Portal</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Restricted access to administration panel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter admin email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Passkey Input */}
            <div>
              <label
                htmlFor="passkey"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Admin Passkey
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPasskey ? "text" : "password"}
                  id="passkey"
                  name="passkey"
                  value={formData.passkey}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter admin passkey"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                >
                  {showPasskey ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              } text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                "Admin Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
