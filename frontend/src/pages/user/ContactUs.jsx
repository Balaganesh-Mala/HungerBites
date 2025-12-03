import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Frontend Validation
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!form.name || !form.email || !form.phone || !form.message) {
      Swal.fire("Error", "All fields are required!", "error");
      return;
    }
    if (!emailRegex.test(form.email)) {
      Swal.fire("Error", "Enter a valid email!", "error");
      return;
    }
    if (!phoneRegex.test(form.phone)) {
      Swal.fire("Error", "Enter a valid 10-digit phone number!", "error");
      return;
    }

    Swal.fire("Success ", "We received your message. We'll contact you soon!", "success");

    // Reset Form
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto px-6 py-10 text-center md:text-left"
      >
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
        <p className="text-slate-500 text-sm mt-2">Have questions? We're here to help you.</p>
      </motion.div>

      {/* CONTACT INFO + FORM */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT SIDE - COMPANY INFO */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Info Cards */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 flex items-center gap-4">
            <FiMail className="text-orange-600" size={22} />
            <div>
              <h3 className="font-semibold text-sm text-slate-800">Email</h3>
              <p className="text-xs text-slate-500">support@hungerbites.in</p>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 flex items-center gap-4">
            <FiPhone className="text-orange-600" size={22} />
            <div>
              <h3 className="font-semibold text-sm text-slate-800">Phone</h3>
              <p className="text-xs text-slate-500">+91 9876543210</p>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 flex items-center gap-4">
            <FiMapPin className="text-orange-600" size={22} />
            <div>
              <h3 className="font-semibold text-sm text-slate-800">Address</h3>
              <p className="text-xs text-slate-500">Andhra Pradesh, India</p>
            </div>
          </div>

          {/* SOCIAL MEDIA */}
          <div className="flex gap-3 justify-center md:justify-start pt-4">
            <a href="#" className="w-9 h-9 bg-white border rounded-full flex items-center justify-center text-slate-500 hover:bg-orange-600 hover:text-white transition"><FaFacebookF size={12}/></a>
            <a href="#" className="w-9 h-9 bg-white border rounded-full flex items-center justify-center text-slate-500 hover:bg-orange-600 hover:text-white transition"><FaInstagram size={12}/></a>
            <a href="#" className="w-9 h-9 bg-white border rounded-full flex items-center justify-center text-slate-500 hover:bg-orange-600 hover:text-white transition"><FaLinkedinIn size={12}/></a>
            <a href="#" className="w-9 h-9 bg-white border rounded-full flex items-center justify-center text-slate-500 hover:bg-orange-600 hover:text-white transition"><FaTwitter size={12}/></a>
          </div>
        </motion.div>

        {/* RIGHT SIDE - CONTACT FORM */}
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Send Us a Message</h2>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-orange-500"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-orange-500"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Your Phone Number"
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-orange-500"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message..."
            className="w-full border rounded-lg p-4 h-28 text-sm focus:outline-orange-500"
          />

          <button
            type="submit"
            className="w-full bg-orange-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-orange-700 transition flex justify-center items-center gap-2"
          >
            <FiSend size={15}/> Submit
          </button>
        </motion.form>

      </div>
    </div>
  );
};

export default ContactUs;
