import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/product.api.js";
import categoryApi from "../../api/category.api.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFlavor, setSelectedFlavor] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Fetch products using filters
  const loadProducts = async () => {
    try {
      const params = {
        search,
        category: selectedCategory,
        flavor: selectedFlavor,
        sort:
          sortOrder === "low-high"
            ? "low-high"
            : sortOrder === "high-low"
            ? "high-low"
            : "",
      };

      const res = await api.get("/products", { params });

      setProducts(res.data.products);
    } catch (err) {
      console.log("Error fetching products:", err);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const res = await categoryApi();
      setCategories(res.data.categories || []);
    } catch (err) {
      console.log("Error loading categories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  // Fetch on filter change
  useEffect(() => {
    loadProducts();
  }, [search, selectedCategory, selectedFlavor, sortOrder]);

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div>
        {/* ---------- Page Header ---------- */}
        <div className="max-w-6xl mx-auto px-6 mb-10">
          <h1 className="text-3xl font-semibold text-slate-900">
            Our Products
          </h1>
          <p className="text-slate-600 mt-2">
            Fresh, healthy & delicious snacks curated just for you.
          </p>
        </div>

        {/* ---------- Filters ---------- */}
        <div className="max-w-6xl mx-auto px-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search product..."
            className="p-3 rounded-lg border w-full bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Category Filter */}
          <select
            className="p-3 rounded-lg border w-full bg-white"
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

          {/* Flavor Filter */}
          <select
            className="p-3 rounded-lg border w-full bg-white"
            value={selectedFlavor}
            onChange={(e) => setSelectedFlavor(e.target.value)}
          >
            <option value="">All Flavors</option>
            {products.map((p) => (
              <option key={p._id} value={p.flavor}>
                {p.flavor}
              </option>
            ))}
          </select>

          {/* Sort By Price */}
          <select
            className="p-3 rounded-lg border w-full bg-white"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sort By Price</option>
            <option value="low-high">Low → High</option>
            <option value="high-low">High → Low</option>
          </select>
        </div>
      </div>
      {/* ---------- Products Grid ---------- */}
      <div
        className="max-w-6xl mx-auto px-6 grid 
            grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {products.map((p) => (
          <Link
            to={`/product/${p._id}`}
            key={p._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4 group"
          >
            {/* Product Image */}
            <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
              {/* 🟧 FIXED BEST SELLER TAG */}
              {p.isBestSeller && (
                <div className="absolute top-0 left-0 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-20">
                  BEST SELLER
                </div>
              )}

              <img
                src={p.images?.[0]?.url || p.images?.[0]}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>

            {/* Product Info */}
            <h3 className="mt-4 font-semibold text-slate-900 truncate">
              {p.name}
            </h3>

            <p className="text-sm text-slate-500 truncate">
              {p.flavor || p.category?.name}
            </p>

            <div className="flex items-center justify-between mt-3">
              <p className="text-lg font-bold text-orange-600">₹{p.price}</p>

              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                {p.stock > 50 ? "In Stock" : "Limited"}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <p className="text-center text-slate-500 mt-20">
          No products match your filters.
        </p>
      )}
    </div>
  );
};

export default Products;
