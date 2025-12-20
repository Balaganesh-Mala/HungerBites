import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { motion } from "framer-motion";
import ProductCard from "../../components/user/ProductCard";
import { FiArrowRight } from "react-icons/fi";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (product) => {
    alert(`Added to cart: ${product.name}`);
  };

  const loadFeatured = async () => {
    try {
      const res = await api.get("/products?featured=true&limit=8");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Featured Products Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatured();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-gray-400 text-lg font-medium"
        >
          Loading Featured Products…
        </motion.p>
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-5"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-10 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Featured Products <span className="text-orange-600">✨</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-md">
            Specially curated snacks you must try – healthy, tasty & trending!
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-full
                     hover:bg-black transition shadow-sm hover:-translate-y-1 text-sm font-medium"
        >
          View All <FiArrowRight size={14} />
        </Link>
      </div>

      {/* ✅ PRODUCT GRID */}
      <div
        className={`grid gap-6 ${
          products.length < 4
            ? "grid-cols-2 sm:grid-cols-3 justify-center"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
        }`}
      >
        {products.slice(0, 8).map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default FeaturedProducts;
