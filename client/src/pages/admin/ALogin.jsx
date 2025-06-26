import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useAdminStore from "../../store/adminStore";

const ALogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { adminLogin } = useAdminStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isAdminLogin) {
        // Admin login logic
        if (
          formData.email === "admin@gmail.com" &&
          formData.password === "123456"
        ) {
          adminLogin();
          navigate("/admin/dashboard");
        } else {
          setError("Invalid admin credentials");
        }
      } else {
        // Regular user login logic
        await login(formData);
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {isAdminLogin ? "Admin Login" : "User Login"}
          </h1>
          <p className="text-gray-600 mt-2">
            Enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="admin-checkbox"
              name="admin-checkbox"
              type="checkbox"
              checked={isAdminLogin}
              onChange={() => setIsAdminLogin(!isAdminLogin)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="admin-checkbox"
              className="ml-2 block text-sm text-gray-700"
            >
              Login as Admin
            </label>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </Link>
          </p>
          <p className="mt-2">
            {isAdminLogin ? (
              <button
                onClick={() => setIsAdminLogin(false)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Switch to User Login
              </button>
            ) : (
              <button
                onClick={() => setIsAdminLogin(true)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Switch to Admin Login
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ALogin;
