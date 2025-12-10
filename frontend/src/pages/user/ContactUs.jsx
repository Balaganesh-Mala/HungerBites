import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiChevronDown,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { getPublicSettings } from "../../api/settings.api";
import { submitContactMessageApi } from "../../api/contact.api"; // ✅ FIXED IMPORT

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    storeName: "",
    supportEmail: "",
    supportPhone: "",
    address: "",
  });

  const [activeFaq, setActiveFaq] = useState(null);

  // FAQ DATA
  const faqs = [
    {
      question: "What makes Hunger Bites snacks healthier?",
      answer:
        "Our snacks are roasted in olive oil, contain zero trans fat, zero cholesterol and are crafted with premium ingredients inspired by South Indian flavours.",
    },
    {
      question: "Do you offer Cash on Delivery?",
      answer:
        "Yes, COD is available in most locations. You can check availability at checkout.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Typically 2–5 business days depending on your location. You will receive tracking updates once shipped.",
    },
    {
      question: "Are your products suitable for kids?",
      answer:
        "Absolutely! Our snacks are light, non-oily, and made with safe and natural ingredients—perfect for families and children.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, Hunger Bites exports under APEDA/FDA compliance. For bulk international orders, contact our support team.",
    },
  ];

  const toggleFaq = (index) => setActiveFaq(activeFaq === index ? null : index);

  // Load backend settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getPublicSettings();
        const data = res.data.settings;

        setSettings({
          storeName: data?.storeName || "Hunger Bites",
          supportEmail: data?.supportEmail || "support@hungerbites.in",
          supportPhone: data?.supportPhone || "0000000000",
          address: data?.address || "India",
        });
      } catch (err) {
        console.log("Settings Load Error:", err);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      setLoading(true);

      await submitContactMessageApi({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });

      Swal.fire(
        "Success",
        "We received your message. We'll contact you soon!",
        "success"
      );

      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error("Contact Form Error:", err);

      Swal.fire(
        "Error",
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Contact {settings.storeName}
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          Have questions? We're here to help you.
        </p>
      </motion.div>

      {/* CONTACT INFO + FORM */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT INFO */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* EMAIL */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 flex items-center gap-4">
            <FiMail className="text-orange-600" size={22} />
            <div>
              <h3 className="font-semibold text-sm text-slate-800">Email</h3>
              <p className="text-xs text-slate-500">{settings.supportEmail}</p>
            </div>
          </div>

          {/* PHONE */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 flex items-center gap-4">
            <FiPhone className="text-orange-600" size={22} />
            <div>
              <h3 className="font-semibold text-sm text-slate-800">Phone</h3>
              <p className="text-xs text-slate-500">{settings.supportPhone}</p>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 flex items-center gap-4">
            <FiMapPin className="text-orange-600" size={22} />
            <div>
              <h3 className="font-semibold text-sm text-slate-800">Address</h3>
              <p className="text-xs text-slate-500 whitespace-pre-line">
                {settings.address}
              </p>
            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div className="flex gap-3 justify-center md:justify-start pt-4">
            <a className="w-9 h-9 bg-white border rounded-full flex items-center justify-center text-slate-500 hover:bg-orange-600 hover:text-white transition">
              <FaFacebookF size={12} />
            </a>
            <a className="w-9 h-9 bg-white border rounded-full flex items-center justify-center text-slate-500 hover:bg-orange-600 hover:text-white transition">
              <FaInstagram size={12} />
            </a>
            <a className="w-9 h-9 bg-white border rounded-full flex items-center justify-center text-slate-500 hover:bg-orange-600 hover:text-white transition">
              <FaLinkedinIn size={12} />
            </a>
            <a className="w-9 h-9 bg-white border rounded-full flex items-center justify-center text-slate-500 hover:bg-orange-600 hover:text-white transition">
              <FaTwitter size={12} />
            </a>
          </div>
        </motion.div>

        {/* FORM */}
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Send Us a Message
          </h2>

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
            disabled={loading}
            className="w-full bg-orange-600 text-white rounded-full py-3 font-semibold text-sm hover:bg-orange-700 transition flex justify-center items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FiSend size={15} />
            {loading ? "Sending..." : "Submit"}
          </button>
        </motion.form>
      </div>

      {/* FAQ SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 mt-16"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-xl mb-4 overflow-hidden"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center p-4 text-left"
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              <FiChevronDown
                size={18}
                className={`transition-transform ${
                  activeFaq === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeFaq === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4 text-sm text-gray-600"
              >
                {faq.answer}
              </motion.div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ContactUs;
