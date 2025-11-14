import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios"; // your axios instance

const ShopByFlavor = () => {
  const [flavors, setFlavors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch flavors dynamically
  const loadFlavors = async () => {
    try {
      const res = await api.get("/products");

      const allProducts = res.data.products || res.data || [];

      // Extract unique flavors
      const uniqueFlavors = Array.from(
        new Set(allProducts.map((item) => item.flavor).filter(Boolean))
      );

      setFlavors(uniqueFlavors);
    } catch (err) {
      console.error("Flavor fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFlavors();
  }, []);

  if (loading) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-14">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">
        Shop by Flavor
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {flavors.map((flavor) => (
          <Link
            key={flavor}
            to={`/products?flavor=${flavor}`}
            className="group bg-white shadow rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition"
          >
            {/* Auto-generated avatar style icon */}
            <div className="w-16 h-16 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold mb-4 group-hover:bg-orange-200">
              {flavor[0]}
            </div>

            <p className="font-medium text-gray-800 group-hover:text-orange-600 text-center">
              {flavor}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopByFlavor;
