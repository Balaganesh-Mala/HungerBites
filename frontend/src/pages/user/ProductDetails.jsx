import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft } from "react-icons/fa";

import api from "../../api/axios";
import { addToCartApi } from "../../api/cart.api";
import ProductCard from "../../components/user/ProductCard";
import ProductDescription from "../../components/user/ProductDescription";
import Swal from "sweetalert2";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  // Save recently viewed
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

  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const productData = res.data.product;
      if (!productData) throw new Error("No product data");

      setProduct(productData);
      saveRecentlyViewed(productData);

      // Related
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
      Swal.fire("Error", "Failed to load product", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  // Add to cart
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

  // Buy Now
  const handleBuyNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first",
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

  if (loading)
    return <p className="text-center text-gray-500 py-20">Loading...</p>;

  if (!product)
    return <p className="text-center text-gray-500 py-20">Not found.</p>;

  const getPricePer100g = (price, weight) => {
    if (!price || !weight) return null;

    // extract number from "150g", "200 g", etc
    const grams = parseFloat(weight.replace(/[^\d.]/g, ""));
    if (!grams || grams === 0) return null;

    return ((price / grams) * 100).toFixed(2);
  };

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
        {/* LEFT */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnails left in desktop */}
          <div className="hidden md:flex flex-col gap-3">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt=""
                className={`w-16 h-16 rounded-lg cursor-pointer border object-cover ${
                  selectedImage === i
                    ? "border-orange-500 scale-105"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(i)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="border rounded-xl w-full overflow-hidden relative group">
            <img
              src={product.images?.[selectedImage]?.url}
              alt={product.name}
              className="object-cover w-full h-full min-h-96 transform transition duration-300 group-hover:scale-125"
            />
          </div>

          {/* Thumbnails bottom in mobile */}
          <div className="flex md:hidden flex-row gap-3 mt-2 justify-center">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt=""
                className={`w-14 h-14 rounded-lg cursor-pointer border object-cover ${
                  selectedImage === i
                    ? "border-orange-500 scale-105"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(i)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h2 className="text-3xl font-semibold mb-2">{product.name}</h2>

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

            {/* PRICE PER 100g */}
            {getPricePer100g(product.price, product.weight) && (
              <p className="text-sm text-slate-500">
                ₹{getPricePer100g(product.price, product.weight)} / 100g
              </p>
            )}
          </div>
          <ProductDescription text={product.description} />

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

          {/* RATING */}
          <div className="flex items-center gap-1.5 mt-3">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={13}
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

      {/* RELATED PRODUCTS */}
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
      {/* ⭐ CUSTOMER REVIEWS SECTION ⭐ */}
      <div className="max-w-6xl mx-auto mt-12 px-6">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

        {product.reviews?.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No reviews yet — be the first to review!
          </p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((rev, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-800">{rev.name}</p>
                </div>

                {/* ⭐ RATING DISPLAY */}
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, idx) => (
                    <FaStar
                      key={idx}
                      className={
                        idx < rev.rating ? "text-yellow-500" : "text-gray-300"
                      }
                      size={14}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    {rev.rating} / 5
                  </span>
                </div>

                {/* COMMENT */}
                <p className="text-sm text-slate-700 mt-2">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
