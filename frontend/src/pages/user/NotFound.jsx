import React from "react";
import { motion } from "framer-motion";
import { FiHome, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center bg-white p-8 rounded-2xl shadow border border-gray-100 max-w-sm w-full"
      >
        <h1 className="text-6xl font-extrabold text-orange-600">404</h1>
        <p className="text-slate-900 font-semibold text-2xl mt-3">
          Page Not Found 😕
        </p>
        <p className="text-slate-500 text-sm mt-2">
          The page you're looking for does not exist or was moved.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 border border-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition"
          >
            <FiArrowLeft size={14} /> Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black transition"
          >
            <FiHome size={14} /> Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
