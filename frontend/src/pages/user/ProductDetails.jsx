import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { addToCartApi } from "../../api/cart.api";
import Swal from "sweetalert2";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // ⭐ Save product to "Recently Viewed"
  const saveRecentlyViewed = (product) => {
    if (!product?._id) return;

    let viewed = JSON.parse(localStorage.getItem("recent_viewed")) || [];

    viewed = viewed.filter((p) => p._id !== product._id);

    viewed.unshift({
      _id: product._id,
      title: product.name,
      price: product.price,
      image: product.images?.[0]?.url || product.images?.[0],
    });

    if (viewed.length > 10) viewed = viewed.slice(0, 10);

    localStorage.setItem("recent_viewed", JSON.stringify(viewed));
  };

  // 🔥 Fetch product
  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const productData = res.data.product || res.data;

      setProduct(productData);
      saveRecentlyViewed(productData);
    } catch (err) {
      console.error("Error fetching product:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  // 🟧 BUY NOW
  const handleBuyNow = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to place an order.",
        confirmButtonColor: "#ff7a00",
      }).then(() => navigate("/login"));
      return;
    }

    navigate("/checkout", {
      state: {
        buyNow: true,
        product: {
          _id: product._id,
          title: product.name,
          price: product.price,
          image: product.images?.[0]?.url,
        },
      },
    });
  };

  // 🧺 Add to cart
  const handleAddToCart = async () => {
    if (!product?._id) return;

    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add products to your cart.",
        confirmButtonColor: "#ff7a00",
      }).then(() => navigate("/login"));
      return;
    }

    setAdding(true);

    try {
      await addToCartApi(product._id, 1);

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: `${product.name} added to cart.`,
        confirmButtonColor: "#ff7a00",
      }).then(() => navigate("/cart"));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Add",
        text: err.response?.data?.message || "Something went wrong.",
      });
    }

    setAdding(false);
  };

  if (loading)
    return <p className="text-center text-gray-500 py-20">Loading...</p>;

  if (!product)
    return (
      <p className="text-center text-gray-500 py-20">Product not found.</p>
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Product Details</h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* 🖼 LEFT IMAGE */}
        <div className="bg-white rounded-xl shadow p-4">
          <img
            src={product.images?.[0]?.url || product.images?.[0]}
            alt={product.name}
            className="w-full h-100 object-cover rounded-lg"
          />
        </div>

        {/* ℹ RIGHT INFO */}
        <div>
          <h2 className="text-3xl font-semibold text-slate-900 mb-2">
            {product.name}
          </h2>

          <p className="text-slate-500 mb-3">
            {product.description.slice(0, 250)}
          </p>
          <div className="mt-6 space-y-2 text-sm text-slate-700">
            <p>
              <strong>Flavor:</strong> {product.flavor || "N/A"}
            </p>
            <p>
              <strong>Brand:</strong> {product.brand || "N/A"}
            </p>
            <p>
              <strong>Weight:</strong> {product.weight || "N/A"}
            </p>
          </div>
          {/* PRICE */}
          <div className="flex items-center gap-4 mt-4">
            <p className="text-3xl font-bold text-orange-600">
              ₹{product.price}
            </p>
            {product.mrp && (
              <p className="line-through text-slate-400 text-lg">
                ₹{product.mrp}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xl ${
                    i < Math.round(product.ratings || 0)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>

            <p className="text-sm text-slate-500">
              ({product.numOfReviews || 0} reviews)
            </p>
          </div>

          {/* PRODUCT ATTRIBUTES */}

          {/* STOCK BADGE */}
          <p className="mt-4 text-sm">
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                product.stock > 50
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {product.stock > 50 ? "In Stock" : "Limited Stock"}
            </span>
          </p>

          {/* BUTTONS */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              className="border border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-xl font-semibold"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
