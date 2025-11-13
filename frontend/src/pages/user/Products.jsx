import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/product.api.js";

const Products = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from backend
  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.products);
    } catch (err) {
      console.log("Error fetching products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">

      {/* ---------- Page Header ---------- */}
      <div className="max-w-6xl mx-auto px-6 mb-10">
        <h1 className="text-3xl font-semibold text-slate-900">
          Our Products
        </h1>
        <p className="text-slate-600 mt-2">
          Fresh, healthy & delicious snacks curated just for you.
        </p>
      </div>

      {/* ---------- Products Grid ---------- */}
      <div className="max-w-6xl mx-auto px-6 grid 
            grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">

        {products.map((p) => (
          <Link
            to={`/product/${p._id}`}
            key={p._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4 group"
          >
            {/* Product Image */}
            <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={p.images[0].url}
                alt={p.name}
                className="w-full h-full object-cover 
                group-hover:scale-105 transition duration-300"
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
              <p className="text-lg font-bold text-orange-600">
                ₹{p.price}
              </p>

              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                {p.stock > 50 ? "In Stock" : "Limited"}
              </span>
            </div>
          </Link>
        ))}

      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <p className="text-center text-slate-500 mt-20">No products available.</p>
      )}
    </div>
  );
};

export default Products;
