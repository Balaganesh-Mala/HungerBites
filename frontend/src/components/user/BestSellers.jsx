import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { FiShoppingCart, FiArrowRight } from "react-icons/fi";
import ProductCard from "../../components/user/ProductCard";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBestSellers = async () => {
    try {
      const res = await api.get("/products?bestseller=true&limit=8");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Best Sellers Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBestSellers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-24">
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-gray-400 text-lg font-medium"
        >
          Loading Best Sellers…
        </motion.p>
      </div>
    );

  if (!products.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="max-w-6xl mx-auto px-5 sm:px-6 py-20"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Best Sellers <span className="text-orange-600">🔥</span>
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-md">
            Most loved, top rated, and trending snacks our customers can’t stop
            buying!
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

      {/* PRODUCT GRID WITH STAGGER */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </motion.section>
  );
};

export default BestSellers;
