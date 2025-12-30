import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import categoryApi from "../../api/category.api.js";
import { motion } from "framer-motion";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi();
        if (res.data.success && res.data.categories) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  /* 🔄 SKELETON */
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 pt-0 pb-0">
      {/* 🏷️ HEADER */}
      <div className="text-center mb-14">
        <span className="inline-block mb-3 text-xs font-semibold tracking-wide text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
          Shop by Category
        </span>

        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Explore Our Categories
        </h2>

        <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto">
          Find the perfect products faster by browsing through our carefully
          curated categories.
        </p>
      </div>

      {/* 🗂️ CATEGORY GRID */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.07 } },
        }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat._id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <Link
              to={`/products?category=${cat.name.toLowerCase()}`}
              className="group block"
            >
              <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-100">
                {/* IMAGE */}
                {cat.image?.url ? (
                  <img
                    src={cat.image.url}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}

                {/* LIGHT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                {/* TEXT */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {cat.name}
                    </span>

                    <span className="text-xs text-orange-600 font-medium opacity-0 group-hover:opacity-100 transition">
                      View →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default CategorySection;
