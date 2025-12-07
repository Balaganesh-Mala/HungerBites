import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import Swal from "sweetalert2";
import api from "../../api/axios";

let recaptchaVerifier = null;

export default function RegisterPhone() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [anim, setAnim] = useState(false);
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [confirmation, setConfirmation] = useState(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  // Format phone 999-999-9999
  const formatPhone = (value) => {
    value = value.replace(/\D/g, "").slice(0, 10);
    if (value.length > 6) {
      return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length > 3) {
      return `${value.slice(0, 3)}-${value.slice(3)}`;
    }
    return value;
  };

  // input handler + validation
  const handleChange = async (e) => {
    let { name, value } = e.target;

    if (name === "phone") value = formatPhone(value);
    setForm({ ...form, [name]: value });

    // Live validation
    if (name === "email" && value.trim()) {
      const res = await api.post("/auth/check-email", { email: value });
      setErrors((prev) => ({
        ...prev,
        email: res.data.exists ? "Email already registered" : "",
      }));
    }

    if (name === "phone" && value.replace(/\D/g, "").length === 10) {
      const res = await api.post("/auth/check-phone", {
        phone: `+91${value.replace(/\D/g, "")}`,
      });
      setErrors((prev) => ({
        ...prev,
        phone: res.data.exists ? "Phone already registered" : "",
      }));
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [timer]);

  const setupRecaptcha = () => {
    if (!recaptchaVerifier) {
      recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  };

  const sendOtp = async (e) => {
    if (e) e.preventDefault();

    const rawPhone = form.phone.replace(/\D/g, "");

    if (rawPhone.length !== 10)
      return Swal.fire("Invalid", "Enter valid 10-digit phone", "warning");

    if (errors.email || errors.phone)
      return Swal.fire("Error", "Fix highlighted errors", "error");

    if (!form.name || !form.email || !form.password)
      return Swal.fire("Missing Fields", "Fill all fields", "warning");

    if (form.password !== form.confirmPassword)
      return Swal.fire("Password mismatch", "Passwords do not match!", "error");

    try {
      setLoading(true);
      setupRecaptcha();

      const confirmationRes = await signInWithPhoneNumber(
        auth,
        `+91${rawPhone}`,
        recaptchaVerifier
      );

      setConfirmation(confirmationRes);

      setTimer(60);
      setAnim(true);
      setTimeout(() => {
        setStep(2);
        setAnim(false);
      }, 350);

      Swal.fire("OTP Sent!", "Check your phone.", "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }

    setLoading(false);
  };

  const handleOtpPaste = (e) => {
    const data = e.clipboardData.getData("text").replace(/\D/g, "");
    if (data.length === 6) {
      const d = data.split("");
      setOtp(d);
      d.forEach((v, i) => (otpRefs.current[i].value = v));
      otpRefs.current[5].focus();
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) otpRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      otpRefs.current.forEach((el) => el.classList.add("animate-shake"));
      setTimeout(
        () => otpRefs.current.forEach((el) => el.classList.remove("animate-shake")),
        500
      );
      return;
    }

    try {
      setLoading(true);

      const firebaseUser = await confirmation.confirm(code);
      const firebaseToken = await firebaseUser.user.getIdToken();

      const res = await api.post("/auth/register-phone", {
        firebaseToken,
        name: form.name,
        email: form.email,
        password: form.password,
      });

      Swal.fire("Success 🎉", "Account created!", "success");
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      otpRefs.current.forEach((el) => el.classList.add("animate-shake"));
      setTimeout(
        () => otpRefs.current.forEach((el) => el.classList.remove("animate-shake")),
        500
      );
      Swal.fire("Wrong OTP", "Try again", "error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div
        className={`bg-white p-8 rounded-xl shadow-xl w-full max-w-md transition-all duration-300 ${
          anim ? "translate-x-10 opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {/* STEP 1 - Registration */}
        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}

            {/* password */}
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-sm"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "Hide" : "Show"}
              </span>
            </div>

            {/* confirm password */}
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-sm"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? "Hide" : "Show"}
              </span>
            </div>

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg ${
                errors.phone ? "border-red-500" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                loading ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-3">
              Already have an account?{" "}
              <span
                className="text-orange-600 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        )}

        {/* STEP 2 - OTP */}
        {step === 2 && (
          <div className="space-y-4 text-center" onPaste={handleOtpPaste}>
            <p className="text-gray-600">Enter OTP sent to {form.phone}</p>

            <div className="flex justify-between">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  maxLength={1}
                  ref={(el) => (otpRefs.current[i] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-12 h-12 text-xl text-center border rounded-lg focus:border-orange-500 outline-none transition-all duration-200"
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP & Register"}
            </button>

            <button
              onClick={sendOtp}
              disabled={timer > 0}
              className="text-orange-600 font-medium mt-2"
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </div>
        )}
      </div>

      <div id="recaptcha-container"></div>

      {/* Shake animation */}
      <style>{`
        .animate-shake {
          animation: shake 0.3s;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
