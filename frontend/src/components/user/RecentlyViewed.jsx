import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RecentlyViewed = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("recent_viewed")) || [];
    setItems(data);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-slate-900">
          Recently Viewed
        </h2>
        <button
          onClick={() => {
            localStorage.removeItem("recent_viewed");
            setItems([]);
          }}
          className="text-sm text-red-500 underline"
        >
          Clear All
        </button>
      </div>

      <div className="flex gap-5 overflow-x-auto scrollbar-hide">
        {items.slice(0, 8).map((p) => (
          <Link
            key={p._id}
            to={`/product/${p._id}`}
            className="min-w-[180px] bg-white p-3 rounded-xl shadow hover:shadow-lg transition"
          >
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-32 object-cover rounded-lg"
            />

            <h3 className="font-medium text-sm mt-2 truncate">{p.title}</h3>

            <p className="text-orange-600 font-semibold mt-1 text-sm">
              ₹{p.price}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;