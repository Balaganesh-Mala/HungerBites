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
      <section className="text-center py-16">
        <p className="text-gray-500 text-lg font-medium">Loading categories…</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-2">
      {/* TITLE */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900">
          View Our Range Of Categories
        </h2>
        <p className="text-gray-600 text-sm mt-3 max-w-xl mx-auto">
          Explore our wide collection of fresh, healthy and premium snack options
        </p>
      </div>

      {/* ✅ AUTO HEIGHT RESPONSIVE GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/products?category=${cat.name.toLowerCase()}`}
            className="group"
          >
            <div className="relative h-[220px] overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition">
              {/* IMAGE */}
              {cat.image?.url ? (
                <img
                  src={cat.image.url}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* TEXT */}
              <div className="absolute bottom-4 left-4 right-4">
                <p className="backdrop-blur-md bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-white font-semibold text-lg">
                  {cat.name}
                </p>

                {cat.description && (
                  <p className="text-xs text-white/80 mt-2 line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
