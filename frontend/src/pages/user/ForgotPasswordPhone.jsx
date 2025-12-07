import { useState, useRef, useEffect } from "react";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import Swal from "sweetalert2";
import api from "../../api/axios";

let recaptchaVerifier = null;

export default function ForgotPasswordPhone() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [firebaseToken, setFirebaseToken] = useState("");

  const [timer, setTimer] = useState(0);

  // OTP fields
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  // password UI controls
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Setup Recaptcha
  const setupRecaptcha = () => {
    if (!recaptchaVerifier) {
      recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  // Send OTP
  const sendOtp = async () => {
    if (!phone || phone.length !== 10)
      return Swal.fire("Invalid", "Enter valid 10-digit phone number", "warning");

    setLoading(true);

    // check phone exists
    const existsRes = await api.post("/auth/check-phone", { phone });
    if (!existsRes.data.exists) {
      setLoading(false);
      return Swal.fire("Not Registered", "This phone number has no account", "error");
    }

    // clear previous otp
    setOtp(["", "", "", "", "", ""]);
    otpRefs.current.forEach((el) => el && (el.value = ""));

    setupRecaptcha();

    try {
      const confirmationRes = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        recaptchaVerifier
      );

      setConfirmation(confirmationRes);
      setStep(2);
      setTimer(60);
      Swal.fire("OTP Sent!", "Check your phone", "success");
    } catch (error) {
      console.log(error);
      Swal.fire("Error", error.message, "error");
    }

    setLoading(false);
  };

  // OTP auto paste
  const handleOtpPaste = (e) => {
    const data = e.clipboardData.getData("text").replace(/\D/g, "");
    if (data.length === 6) {
      const digits = data.split("");
      setOtp(digits);
      digits.forEach((d, i) => (otpRefs.current[i].value = d));
      otpRefs.current[5].focus();
    }
  };

  // auto tab + update
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) otpRefs.current[index + 1].focus();
  };

  // backspace logic — delete & move backward
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      // delete the current digit
      if (otp[index]) {
        const updated = [...otp];
        updated[index] = "";
        setOtp(updated);
      } else if (index > 0) {
        otpRefs.current[index - 1].focus();
      }
    }
  };

  // verify OTP
  const verifyOtp = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      otpRefs.current.forEach((el) => el.classList.add("animate-shake"));
      setTimeout(
        () => otpRefs.current.forEach((el) => el.classList.remove("animate-shake")),
        400
      );
      return;
    }

    try {
      setLoading(true);

      const firebaseUser = await confirmation.confirm(code);
      const token = await firebaseUser.user.getIdToken();

      setFirebaseToken(token);

      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        recaptchaVerifier = null;
      }

      Swal.fire("Verified", "Now reset your password", "success");
      setStep(3);
    } catch (err) {
      otpRefs.current.forEach((el) => el.classList.add("animate-shake"));
      setTimeout(
        () => otpRefs.current.forEach((el) => el.classList.remove("animate-shake")),
        400
      );
      Swal.fire("Wrong OTP", "Try again", "error");
    }

    setLoading(false);
  };

  // reset password
  const resetPassword = async () => {
    if (newPassword.length < 6)
      return Swal.fire("Weak password", "Minimum 6 characters", "error");

    if (newPassword !== confirmPassword)
      return Swal.fire("Mismatch", "Passwords must match", "error");

    setLoading(true);

    try {
      await api.post("/auth/reset-password-phone", {
        firebaseToken,
        newPassword,
      });

      Swal.fire("Success", "Password reset successfully!", "success");
      window.location.href = "/login";
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message, "error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              maxLength={10}
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full p-3 border rounded-lg"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className={`w-full text-white py-3 rounded-lg font-semibold ${
                loading ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4 text-center" onPaste={handleOtpPaste}>
            <p>Enter OTP sent to +91 {phone}</p>

            <div className="flex gap-2 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  maxLength={1}
                  ref={(el) => (otpRefs.current[i] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className="w-10 h-10 text-lg text-center border rounded-md focus:border-orange-500"
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading}
              className={`w-full text-white py-3 rounded-lg font-semibold ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={sendOtp}
              disabled={timer > 0}
              className="text-orange-600 font-medium"
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </div>
        )}

        {/* STEP 3 - Reset password with show toggle */}
        {step === 3 && (
          <div className="space-y-4">

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
              <span
                className="absolute right-3 top-3 text-sm cursor-pointer text-gray-500"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "Hide" : "Show"}
              </span>
            </div>

            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />
              <span
                className="absolute right-3 top-3 text-sm cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? "Hide" : "Show"}
              </span>
            </div>

            <button
              onClick={resetPassword}
              disabled={loading}
              className={`w-full text-white py-3 rounded-lg font-semibold ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>

      <div id="recaptcha-container"></div>

      <style>{`
        .animate-shake {
          animation: shake 0.25s;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
