import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { addToCartApi } from "../../api/cart.api";
import Swal from "sweetalert2";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Review states
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

  // 🔥 Load product
  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      const productData = res.data.product;

      setProduct(productData);
      saveRecentlyViewed(productData);

      // Load related by category
      if (productData.category) {
        const relatedRes = await api.get(
          `/products?category=${productData.category?._id}`
        );

        setRelated(
          relatedRes.data.products.filter((p) => p._id !== productData._id)
        );
      }
    } catch (err) {
      console.error("Product fetch error:", err);
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
        text: "Please login to add items to cart.",
        confirmButtonColor: "#ff7a00",
      }).then(() => navigate("/login"));
      return;
    }

    setAdding(true);
    try {
      await addToCartApi(product._id, 1);
      Swal.fire("Success", "Added to cart!", "success").then(() => {
        navigate("/cart");
      });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message, "error");
    }
    setAdding(false);
  };

  // ⭐ Submit review
  const submitReview = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire("Login Required", "Please login first!", "warning");
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
      loadProduct();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message, "error");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 py-20">Loading...</p>;

  if (!product)
    return <p className="text-center text-gray-500 py-20">Not found.</p>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* PAGE HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Product Details</h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT IMAGE */}
        <div className="bg-white rounded-xl shadow p-4">
          <img
            src={product.images?.[0]?.url || product.images?.[0]}
            alt={product.name}
            className="w-full h-100 object-cover rounded-lg"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div>
          <h2 className="text-3xl font-semibold mb-2">{product.name}</h2>

          <p className="text-slate-500 mb-3">
            {product.description.slice(0, 250)}
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

            {product.mrp && (
              <p className="line-through text-slate-400 text-lg">
                ₹{product.mrp}
              </p>
            )}
          </div>

          {/* STARS */}
          <div className="flex items-center gap-2 mt-3">
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

            <p className="text-sm text-slate-500">
              ({product.numOfReviews} reviews)
            </p>
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
              className={`px-6 py-3 rounded-xl font-semibold text-white 
      ${
        product.stock === 0
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-orange-600 hover:bg-orange-700"
      }
    `}
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
              className={`px-6 py-3 rounded-xl font-semibold border 
      ${
        product.stock === 0
          ? "border-gray-400 text-gray-400 cursor-not-allowed"
          : "border-orange-500 text-orange-600 hover:bg-orange-50"
      }
    `}
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
              <div
                key={p._id}
                className="bg-white p-3 rounded-xl shadow cursor-pointer"
                onClick={() => navigate(`/product/${p._id}`)}
              >
                <img
                  src={p.images?.[0]?.url || p.images?.[0]}
                  alt={p.name}
                  className="w-full h-36 object-cover rounded"
                />
                <p className="mt-2 font-semibold">{p.name}</p>
                <p className="text-orange-600 font-bold">₹{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⭐ CUSTOMER REVIEWS */}

      <div className="max-w-6xl mx-auto mt-10 px-6 bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

        {/* No Reviews */}
        {product.reviews?.length === 0 && (
          <p className="text-slate-500">No reviews yet.</p>
        )}

        {/* Review List */}
        <div className="space-y-4">
          {product.reviews?.map((rev, i) => (
            <div key={i} className="border-b pb-3">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{rev.name}</p>
                <p className="text-yellow-500">{"⭐".repeat(rev.rating)}</p>
              </div>
              <p className="text-slate-600 text-sm">{rev.comment}</p>
              <p className="text-xs text-slate-500">
                {new Date(rev.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ ADD REVIEW FORM */}
      {product.canReview && (
        <div className="max-w-6xl mx-auto mt-10 px-6 bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Write a Review</h3>

          <div className="space-y-4">
            <select
              className="border p-2 rounded w-full"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} Star
                </option>
              ))}
            </select>

            <textarea
              className="border p-3 rounded w-full"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              onClick={submitReview}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
