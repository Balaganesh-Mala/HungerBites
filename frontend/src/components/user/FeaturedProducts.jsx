import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load featured products
  const loadFeatured = async () => {
    try {
      const res = await api.get("/products?featured=true&limit=8");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Featured Products Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFeatured();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 py-10">Loading featured products...</p>
    );

  if (products.length === 0)
    return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Featured Products
        </h2>
        <Link
          to="/products"
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 cursor-pointer"
          >
            {/* Product Image */}
            <Link to={`/product/${product._id}`}>
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg"
              />
            </Link>

            {/* Product Info */}
            <div className="mt-4">
              <h3 className="font-semibold text-slate-900 text-lg truncate">
                {product.name}
              </h3>

              <p className="text-orange-600 font-bold mt-1">
                ₹{product.price}
              </p>

              <Link
                to={`/product/${product._id}`}
                className="block mt-3 bg-orange-600 hover:bg-orange-700 text-white text-center py-2 rounded-lg font-medium"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
