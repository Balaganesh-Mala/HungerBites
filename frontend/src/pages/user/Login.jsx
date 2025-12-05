import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Swal from "sweetalert2";
import { auth, setupRecaptcha } from "../../firebase";
import { signInWithPhoneNumber } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("email"); // email | phone

  const [form, setForm] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
  });

  const [otpSession, setOtpSession] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //---------------- EMAIL LOGIN ----------------//
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
      }).then(() => navigate("/"));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message,
      });
    }

    setLoading(false);
  };

  //---------------- SEND OTP ----------------//
  const sendOtp = async () => {
    if (!form.phone || form.phone.length !== 10) {
      return Swal.fire("Error", "Enter a valid 10-digit phone number", "error");
    }

    try {
      // Setup Recaptcha only once
      if (!window.recaptchaVerifier) {
        setupRecaptcha();
      }

      const fullPhone = "+91" + form.phone;

      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        window.recaptchaVerifier
      );

      setOtpSession(result);

      Swal.fire("Success", "OTP sent successfully", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to send OTP", "error");
    }
  };

  //---------------- VERIFY OTP LOGIN ----------------//
  const verifyOtp = async () => {
    if (!form.otp || form.otp.length !== 6) {
      return Swal.fire("Error", "Enter valid OTP", "error");
    }

    try {
      await otpSession.confirm(form.otp); // Firebase OTP verify

      const res = await api.post("/auth/login-phone", {
        phone: form.phone,
      });

      localStorage.setItem("token", res.data.token);

      Swal.fire("Success", "Logged in successfully", "success").then(() => {
        navigate("/");
      });
    } catch (error) {
      Swal.fire("Error", "Invalid OTP", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {/* Recaptcha MUST be outside UI toggles & only once */}
      <div id="recaptcha-container"></div>

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 p-2 rounded ${
              mode === "email" ? "bg-orange-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode("email")}
          >
            Email Login
          </button>
          <button
            className={`flex-1 p-2 rounded ${
              mode === "phone" ? "bg-orange-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setMode("phone")}
          >
            Phone Login
          </button>
        </div>

        {/* ================= EMAIL LOGIN ================= */}
        {mode === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* ================= PHONE LOGIN ================= */}
        {mode === "phone" && (
          <div className="space-y-4">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Send OTP
            </button>

            <input
              type="text"
              maxLength={6}
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Verify OTP & Login
            </button>
          </div>
        )}

        {/* Register link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <span
            className="text-orange-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
