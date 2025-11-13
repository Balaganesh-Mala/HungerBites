import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const LimitedDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, forceUpdate] = useState(0); // for countdown re-render every second

  // Fetch deals
  const loadDeals = async () => {
    try {
      const res = await api.get("/products?deal=true&limit=6");
      setDeals(res.data.products || []);
    } catch (error) {
      console.error("Deals Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDeals();

    // Update countdown every second
    const timer = setInterval(() => forceUpdate((x) => x + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Countdown handler
  const getTimeLeft = (endTime) => {
    const totalMs = new Date(endTime) - new Date();

    if (totalMs <= 0) return "Expired";

    const hrs = Math.floor(totalMs / (1000 * 60 * 60));
    const mins = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((totalMs % (1000 * 60)) / 1000);

    return `${hrs}h ${mins}m ${secs}s`;
  };

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading deals...</p>;

  if (deals.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">
          Limited-Time Deals 
        </h2>

        <Link
          to="/products"
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          View All →
        </Link>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {deals.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow hover:shadow-lg p-4 transition"
          >
            <Link to={`/product/${product._id}`}>
              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-44 object-cover rounded-lg"
              />
            </Link>

            {/* Badge */}
            <p className="mt-3 inline-block text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
              Deal Ends Soon 🔥
            </p>

            <h3 className="font-semibold text-lg mt-2 text-slate-900 truncate">
              {product.name}
            </h3>

            {/* Pricing */}
            <div className="flex items-center gap-3 mt-2">
              <p className="text-orange-600 font-bold text-xl">₹{product.price}</p>

              <p className="line-through text-gray-400 text-sm">₹{product.price+20}</p>
            </div>

            {/* Countdown */}
            <p className="text-sm text-red-600 mt-2">
              ⏰ {getTimeLeft(product.dealEnd || new Date().setDate(new Date( ).getDate() +2))}
            </p>

            <Link
              to={`/product/${product._id}`}
              className="block mt-4 text-center bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium"
            >
              Grab Deal
            </Link>
          </div>
        ))}
      </div>

    </section>
  );
};

export default LimitedDeals;
