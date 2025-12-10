import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShoppingCart, FiArrowRight } from "react-icons/fi";
import Swal from "sweetalert2";
import { addToCartApi } from "../../api/cart.api";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const discount =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product._id) return;

    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add items to cart.",
        confirmButtonColor: "#ff7a00",
      }).then(() => navigate("/login"));
      return;
    }

    try {
      await addToCartApi(product._id, 1);

      await Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${product.name} added successfully!`,
        showConfirmButton: false,
        timer: 1400,
      });

      navigate("/cart");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Cart Error",
        text: error.response?.data?.message || "Failed to add to cart",
        confirmButtonColor: "#ff7a00",
      });
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer"
    >
      {/* PRODUCT IMAGE */}
      <Link to={`/product/${product._id}`}>
        <div className="relative h-[200px] overflow-hidden bg-gray-50">
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-gray-900 text-white text-[11px] px-2.5 py-1 rounded-md z-10">
              -{discount}%
            </span>
          )}

          <motion.img
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.5 }}
            src={product.images?.[0]?.url}
            alt={product.name}
            className="w-full h-full object-cover transform-gpu"
          />
        </div>
      </Link>

      {/* PRODUCT DETAILS */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-base truncate group-hover:text-orange-600 transition">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 text-sm mt-2">
          {product.mrp > 0 && (
            <span className="text-gray-400 line-through">₹{product.mrp}</span>
          )}
          <span className="text-gray-900 font-bold">₹{product.price}</span>
        </div>

        {/* ADD TO CART + VIEW */}
        <div className="flex items-center justify-between mt-4">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-700 
                ${
                  product.stock === 0
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-orange-600 hover:border-orange-600 hover:text-white"
                } transition-all`}
          >
            <FiShoppingCart size={14} />
          </motion.button>
          <Link to={`/product/${product._id}`}>
            <span className="text-xs text-orange-600 font-medium hover:text-orange-700 transition flex items-center">
              View <FiArrowRight className="ml-1" />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
