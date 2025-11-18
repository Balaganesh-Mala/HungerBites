import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBestSellers = async () => {
    try {
      const res = await api.get("/products?bestseller=true&limit=8");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Best Sellers Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBestSellers();
  }, []);

  if (loading)
    return (
      <p className="text-center py-10 text-gray-500">Loading best sellers...</p>
    );

  if (products.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Best Sellers 🔥
        </h2>
        <Link
          to="/products"
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          View All →
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl 
  transition-all duration-300 p-4 cursor-pointer 
  transform hover:-translate-y-2"
          >
            <Link to={`/product/${product._id}`}>
              <div className="overflow-hidden rounded-lg">
                <img
                  src={product.images?.[0]?.url}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg 
        transform transition-transform duration-500 hover:scale-110"
                />
              </div>
            </Link>

            <div className="mt-4">
              <h3 className="font-semibold text-slate-900 text-lg truncate">
                {product.name}
              </h3>

              <p className="text-orange-600 font-bold mt-1">₹{product.price}</p>

              <Link
                to={`/product/${product._id}`}
                className="block mt-3 bg-orange-600 hover:bg-orange-700 
      text-white text-center py-2 rounded-lg font-medium 
      transition-all duration-300 hover:scale-105"
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

export default BestSellers;
