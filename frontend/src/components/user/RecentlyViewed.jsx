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
    <section className="max-w-6xl mx-auto px-5 sm:px-6 pt-0 pb-0">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Recently Viewed
        </h2>

        <button
          onClick={() => {
            localStorage.removeItem("recent_viewed");
            setItems([]);
          }}
          className="text-xs sm:text-sm text-red-500 hover:text-red-600 transition underline"
        >
          Clear All
        </button>
      </div>

      {/* HORIZONTAL SCROLL */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
          {items.slice(0, 8).map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="group min-w-[170px] sm:min-w-[190px]
                         bg-white rounded-2xl border border-gray-100
                         shadow-sm hover:shadow-md transition-all"
            >
              {/* IMAGE */}
              <div className="overflow-hidden rounded-t-2xl">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-32 object-cover
                             group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* CONTENT */}
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 truncate">
                  {p.title}
                </h3>

                <p className="text-orange-600 font-semibold mt-1 text-sm">
                  ₹{p.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* FADE EDGE (UX hint for scroll) */}
        <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white"></div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
