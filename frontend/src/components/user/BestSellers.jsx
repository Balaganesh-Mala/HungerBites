import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
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

  /* 🔄 SKELETON LOADER */
  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-0 pb-14">
      {/* 🔥 HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-wide 
                           text-red-600 bg-red-50 px-3 py-1 rounded-full mb-3">
            🔥 Customer Favorites
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Best Sellers
          </h2>

          <p className="mt-3 text-sm text-gray-500 max-w-md">
            Products our customers keep coming back for — trusted, loved, and
            trending.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-900
                     hover:text-red-600 transition group"
        >
          Explore all best sellers
          <FiArrowRight className="group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* 🛍️ PRODUCTS */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.08 },
          },
        }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
      >
        {products.slice(0, 8).map((product) => (
          <motion.div
            key={product._id}
            variants={{
              hidden: { opacity: 0, y: 25 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default BestSellers;
