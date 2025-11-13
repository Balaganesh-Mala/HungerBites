import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AdminAuthContext } from "../../context/AdminAuthContext";

const AdminLogin = () => {
  const { login } = useContext(AdminAuthContext);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(form.email, form.password);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back Admin!`,
        confirmButtonColor: "#ff7a00",
      });

      navigate("/admin/dashboard");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "Invalid email or password",
        confirmButtonColor: "#ff7a00",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white p-8 shadow-xl rounded-xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email Input */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring focus:ring-orange-300 outline-none"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring focus:ring-orange-300 outline-none"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
