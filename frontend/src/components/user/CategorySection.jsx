import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import categoryApi from "../../api/category.api.js";

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

  if (loading) {
    return (
      <section className="text-center py-20">
        <p className="text-gray-500 text-lg font-medium">Loading categories…</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* TITLE */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          View Our Range Of Categories
        </h2>
        <p className="text-gray-600 text-sm mt-3 max-w-xl mx-auto">
          Explore our wide collection of fresh, healthy and premium snack options
        </p>
      </div>

      {/* ✅ MASONRY STYLE GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-6 auto-rows-[160px]">
        {categories.map((cat, i) => {
          // alternate tall cards like reference UI
          const isTall = i % 3 === 0 || i % 3 === 3;

          return (
            <Link key={cat._id} to={`/products?category=${cat.name.toLowerCase()}`}>
              <div
                className={`relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition group bg-white ${
                  isTall ? "row-span-2 h-full" : ""
                }`}
                style={{ perspective: "800px" }}
              >
                {/* IMAGE */}
                {cat.image?.url ? (
                  <img
                    src={cat.image.url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 transform-gpu will-change-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                {/* TEXT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* LABEL CARD */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="backdrop-blur-md bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-white font-semibold text-lg shadow-md">
                    {cat.name}
                  </p>

                  {/* SUBTEXT */}
                  {cat.description && (
                    <p className="text-xs text-white/80 mt-2 ml-1 max-w-[80%]">
                      {cat.description.slice(0, 40)}…
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
