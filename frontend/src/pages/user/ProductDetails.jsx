import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiStar } from "react-icons/fi";
import { FaStar, FaArrowLeft } from "react-icons/fa";

import api from "../../api/axios";
import { addToCartApi } from "../../api/cart.api";
import ProductCard from "../../components/user/ProductCard";
import Swal from "sweetalert2";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  // ⭐ Save recently viewed
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

  // 🔥 Load Product
  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const productData = res.data.product;
      if (!productData) throw new Error("No product data");

      setProduct(productData);
      saveRecentlyViewed(productData);

      // ✅ Load Related Products
      if (productData.category?._id) {
        const relatedRes = await api.get(
          `/products?category=${productData.category._id}`
        );
        setRelated(
          relatedRes.data.products?.filter((p) => p._id !== productData._id) ||
            []
        );
      }
    } catch (err) {
      console.error("Product fetch error:", err);
      Swal.fire("Error", "Failed to load product", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  // 🧺 Add to Cart Logic
  const handleAddToCart = async () => {
    if (!product?._id) return;

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to add items to cart.",
        confirmButtonColor: "#ff7a00",
      }).then(() => navigate("/login"));
      return;
    }

    setAdding(true);
    try {
      await addToCartApi(product._id, 1);
      Swal.fire("Success", "Added to cart!", "success").then(() =>
        navigate("/cart")
      );
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Cart failed", "error");
    } finally {
      setAdding(false);
    }
  };

  // 🟧 Buy Now Logic
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

  // ⭐ Submit Review Logic
  const submitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire("Login Required", "Please login first!", "warning").then(() =>
        navigate("/login")
      );
      return;
    }

    if (!rating || !comment) {
      Swal.fire("Error", "Please fill rating & comment", "error");
      return;
    }

    try {
      await api.post(
        `/products/${id}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success", "Review submitted!", "success");
      setRating("");
      setComment("");
      loadProduct(); // refresh
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Review failed",
        "error"
      );
    }
  };

  // ✅ Fix rating count display
  const filledStars = Math.round(product?.ratings || 0);

  if (loading)
    return <p className="text-center text-gray-500 py-20">Loading...</p>;

  if (!product)
    return <p className="text-center text-gray-500 py-20">Not found.</p>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition font-medium text-sm mb-4"
        >
          <FaArrowLeft size={16} /> Back
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Product Details</h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div className="bg-white rounded-xl shadow p-4">
          <img
            src={product.images?.[0]?.url || product.images?.[0]}
            alt={product.name}
            className="w-full h-100 object-cover rounded-lg"
          />
        </div>

        {/* CONTENT */}
        <div>
          <h2 className="text-3xl font-semibold mb-2">{product.name}</h2>

          <p className="text-slate-500 mb-3">
            {product.description?.slice(0, 250) || ""}
          </p>

          <div className="space-y-1 text-sm text-slate-700">
            <p>
              <strong>Flavor:</strong> {product.flavor || "N/A"}
            </p>
            <p>
              <strong>Brand:</strong> {product.brand}
            </p>
            <p>
              <strong>Weight:</strong> {product.weight}
            </p>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-4 mt-4">
            <p className="text-3xl font-bold text-orange-600">
              ₹{product.price}
            </p>
            {product.mrp > 0 && (
              <p className="line-through text-slate-400 text-lg">
                ₹{product.mrp}
              </p>
            )}
          </div>

          {/* STARS */}
          <div className="flex items-center gap-1.5 mt-3">
            <div className="flex gap-1.5 items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={22}
                  className={
                    i < Math.round(product?.ratings || 0)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="text-sm text-slate-500 ml-2">
                ({product?.numOfReviews || 0} reviews)
              </span>
            </div>
          </div>

          {/* STOCK */}
          <p className="mt-4 text-sm">
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                product.stock === 0
                  ? "bg-red-100 text-red-600"
                  : product.stock > 50
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {product.stock === 0
                ? "Out of Stock"
                : product.stock > 50
                ? "In Stock"
                : "Limited Stock"}
            </span>
          </p>

          {/* BUTTONS */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className={`px-6 py-3 rounded-xl font-semibold text-white ${
                product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {product.stock === 0
                ? "Out of Stock"
                : adding
                ? "Adding..."
                : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className={`px-6 py-3 rounded-xl font-semibold border ${
                product.stock === 0
                  ? "border-gray-400 text-gray-400 cursor-not-allowed"
                  : "border-orange-500 text-orange-600 hover:bg-orange-50"
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ⭐ RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="max-w-6xl mx-auto mt-12 px-6">
          <h3 className="text-xl font-semibold mb-4">Related Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAddToCart={() => navigate("/cart")}
              />
            ))}
          </div>
        </div>
      )}

      {/* ⭐ REVIEWS (PUBLIC VISIBLE) */}
      <div className="max-w-6xl mx-auto mt-10 px-6 bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
        {!product.reviews?.length && (
          <p className="text-slate-500">No reviews yet.</p>
        )}
        <div className="space-y-4">
          {product.reviews?.map((rev, i) => (
            <div key={i} className="border-b pb-3">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{rev.name}</p>

                {/* ⭐ Fully Filled Star Icons */}
                <div className="flex text-yellow-500">
                  {Array.from({ length: Math.round(rev.rating || 0) }).map(
                    (_, i) => (
                      <FiStar
                        key={i}
                        size={18}
                        fill="currentColor"
                        className="stroke-none"
                      />
                    )
                  )}
                </div>
              </div>

              <p className="text-slate-600 text-sm">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
