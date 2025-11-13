import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const SearchFilter = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [flavors, setFlavors] = useState([]);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("");

  // Load dynamic flavors from backend
  const loadFlavors = async () => {
    try {
      const res = await api.get("/products");
      const allProducts = res.data.products || [];

      const uniqueFlavors = Array.from(
        new Set(allProducts.map((p) => p.flavor).filter(Boolean))
      );

      setFlavors(uniqueFlavors);
    } catch (err) {
      console.error("Flavor fetch error:", err);
    }
  };

  useEffect(() => {
    loadFlavors();
  }, []);

  // When user clicks "Search"
  const handleSearch = () => {
    const query = new URLSearchParams();

    if (search) query.set("search", search);
    if (category) query.set("category", category);
    if (price) query.set("price", price);
    if (sort) query.set("sort", sort);

    navigate(`/products?${query.toString()}`);
  };

  return (
    <section className="bg-white shadow-sm py-6">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* 🔍 SEARCH BAR */}
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Search snacks, makhana, dry fruits..."
            className="w-full border p-3 rounded-lg shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 🔗 CATEGORY */}
        <select
          className="border p-3 rounded-lg shadow-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Category</option>
          <option value="Snacks">Snacks</option>
          <option value="Dry Fruits">Dry Fruits</option>
          <option value="Makhana">Makhana</option>
          <option value="Healthy Mixes">Healthy Mixes</option>
        </select>

        {/* 💸 PRICE RANGE */}
        <select
          className="border p-3 rounded-lg shadow-sm"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        >
          <option value="">Price</option>
          <option value="0-199">Below ₹199</option>
          <option value="200-499">₹200 - ₹499</option>
          <option value="500-999">₹500 - ₹999</option>
        </select>

        {/* 🧂 FLAVOR (Dynamic) */}
        <select
          className="border p-3 rounded-lg shadow-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Flavors</option>
          {flavors.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* ↕ SORT */}
        <select
          className="border p-3 rounded-lg shadow-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="latest">Latest</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>

        {/* SEARCH BUTTON */}
        <button
          onClick={handleSearch}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg shadow font-medium"
        >
          Apply Filters
        </button>
      </div>
    </section>
  );
};

export default SearchFilter;
