import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/product.api";
import categoryApi from "../../api/category.api";
import { FiSearch, FiFilter } from "react-icons/fi"; // ✅ added FiFilter
import { motion } from "framer-motion";
import ProductCard from "../../components/user/ProductCard";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([]); // ✅ FIXED (was missing)
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [search, selectedCategory, priceRange, sortOrder]);

  const loadProducts = async () => {
    try {
      const params = {
        search,
        category: selectedCategory,
        price: priceRange.join(","),
      };
      const res = await api.get("/products", { params });

      let data = res.data.products || [];

      // ✅ Sorting Logic
      if (sortOrder === "low-high")
        data = data.sort((a, b) => a.price - b.price);
      if (sortOrder === "high-low")
        data = data.sort((a, b) => b.price - a.price);

      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await categoryApi();
      if (res.data.success && res.data.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error("Categories Error:", err);
    }
  };

  if (loading)
    return (
      <section className="text-center py-24">
        <p className="text-gray-400 animate-pulse text-lg">Loading products…</p>
      </section>
    );

  if (!products.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-4">
      {/* MOBILE FILTER TRIGGER */}
      <div className="flex justify-end mb-6 md:hidden">
        <button
          onClick={() => setFilterOpen(true)}
          className="p-3 border rounded-full shadow-sm hover:bg-orange-600 hover:text-white transition"
        >
          <FiFilter size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10">
        {/* SIDEBAR (DESKTOP ONLY, MOBILE HIDDEN) */}
        <aside className="space-y-6 sticky top-24 self-start h-fit hidden md:block">
          {/* CATEGORY */}
          <div className="border rounded-xl p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li
                className={`cursor-pointer ${
                  selectedCategory === "" ? "font-bold text-black" : ""
                }`}
                onClick={() => setSelectedCategory("")}
              >
                All Products
              </li>
              {categories.map((c) => (
                <li
                  key={c._id}
                  className={`cursor-pointer ${
                    selectedCategory === c._id ? "font-bold text-black" : ""
                  }`}
                  onClick={() => setSelectedCategory(c._id)}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          </div>

          {/* PRICE RANGE CHECKBOX */}

          {/* SORTING */}
          <select
            className="p-3 rounded-lg border bg-white shadow-sm text-sm text-gray-700 w-full"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sort By Price</option>
            <option value="low-high">Low → High</option>
            <option value="high-low">High → Low</option>
          </select>
        </aside>

        {/* MAIN AREA */}
        <main>
          <div className="py-0 mb-10">
            <h1 className="text-3xl font-semibold text-gray-900">
              Our Collection Of Products
            </h1>

            {/* SEARCH */}
            <div className="mt-6 relative w-full">
              <FiSearch className="absolute left-4 top-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search an item"
                className="w-full border rounded-full py-3 pl-12 pr-6 bg-white shadow-sm focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <p className="text-gray-600 mt-3 text-sm">
              Showing {Math.min(visibleCount, products.length)} of{" "}
              {products.length} items
            </p>

            <p className="text-gray-600 mt-4 text-sm max-w-xl">
              Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do
              eiusmod tempor.
            </p>
          </div>

          {/* PRODUCT GRID USING REUSABLE CARD */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8"
          >
            {products.slice(0, visibleCount).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => navigate("/cart")} // ✅ Passed correctly
              />
            ))}
          </motion.div>

          {/* LOAD MORE */}
          {visibleCount < products.length && (
            <div className="mt-14 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-6 py-3 rounded-full border border-gray-600 hover:bg-black hover:text-white text-sm transition"
              >
                Load More →
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ✅ MOBILE FILTER DRAWER (Only dropdowns, UI minimal & clean) */}
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setFilterOpen(false)}
        >
          <div
            className="fixed bottom-0 left-0 right-0 bg-white p-5 rounded-t-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Category Dropdown */}
            <select
              className="border rounded-xl p-3 bg-white w-full text-sm mb-4"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Price Sorting Dropdown */}
            <select
              className="border rounded-xl p-3 bg-white w-full text-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="">Sort by Price</option>
              <option value="low-high">Low → High</option>
              <option value="high-low">High → Low</option>
            </select>

            {/* Apply */}
            <button
              onClick={() => setFilterOpen(false)}
              className="bg-orange-600 text-white py-3 mt-5 rounded-xl w-full text-sm font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Products;
