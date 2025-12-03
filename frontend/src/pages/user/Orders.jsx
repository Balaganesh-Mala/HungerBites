import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getMyOrdersApi } from "../../api/order.api";
import api from "../../api/axios"; // ✅ ADD THIS IMPORT
import { motion } from "framer-motion";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProductId, setReviewProductId] = useState(null);
  const [reviewProductName, setReviewProductName] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  // open modal
  const openReviewModal = (productId, productName) => {
    setReviewProductId(productId);
    setReviewProductName(productName);
    setShowReviewModal(true);
  };

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getMyOrdersApi();

      let data = res.data.orders || res.data.products || res.data; // auto adapt
      if (!Array.isArray(data)) data = []; // safety fallback

      setOrders(data);
    } catch (err) {
      if (err?.response?.status === 401) {
        setOrders([]);
        setLoading(false);
        return;
      }
      Swal.fire("Error", "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

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

    // ✅ DELIVERY VALIDATION FIXED
    const hasDelivered = orders.some(
      (order) =>
        order.orderStatus === "Delivered" &&
        order.orderItems?.some((item) =>
          String(item.productId?._id || item.productId) === String(reviewProductId)
        )
    );

    if (!hasDelivered) {
      Swal.fire("Not Allowed", "You can review only after delivery!", "error");
      return;
    }

    try {
      await api.post(
        `/products/${reviewProductId}/review`, // ✅ correct review endpoint
        { rating: Number(rating), comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success!", "Review submitted!", "success").then(() =>
        navigate("/cart")
      );

      setRating("");
      setComment("");
      setShowReviewModal(false);
    } catch (err) {
      console.error("Review error:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Review submission failed",
        "error"
      );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-24">
        <motion.p
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-gray-400 text-lg font-medium"
        >
          Loading orders…
        </motion.p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-slate-900 mb-10">My Orders</h1>

        {orders.length === 0 && (
          <div className="text-center mt-20">
            <h2 className="text-xl font-semibold text-slate-700 mt-4">
              No orders found
            </h2>
            <Link
              to="/products"
              className="mt-6 inline-block bg-orange-600 text-white px-6 py-3 rounded-lg"
            >
              Shop Now
            </Link>
          </div>
        )}

        {/* ORDER LIST */}
        <div className="space-y-8">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow border border-gray-100"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-slate-600">
                  Order ID:<span className="font-medium"> {order._id}</span>
                </p>
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-600">
                  {order.orderStatus}
                </span>
              </div>

              {/* ITEMS */}
              <div className="border-t pt-4">
                {order.orderItems?.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center border-b pb-4 mb-4">
                    <img
                      src={
                        item.productId?.images?.[0]?.url ||
                        item.productId?.images?.[0] ||
                        "https://via.placeholder.com/80"
                      }
                      className="w-20 h-20 object-cover rounded-lg"
                      alt={item.name}
                    />

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.productId?.name || item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                      <p className="text-orange-600 font-bold mt-2">₹{item.price}</p>

                      {/* ⭐ REVIEW BTN */}
                      {order.orderStatus === "Delivered" && (
                        <button
                          onClick={() =>
                            openReviewModal(item.productId?._id, item.productId?.name)
                          }
                          className="mt-2 text-xs px-3 py-1 bg-orange-600 text-white rounded-full shadow-sm"
                        >
                          ★ Write Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* SUMMARY */}
                <div className="mt-4 text-sm text-slate-700">
                  <p><strong>Total Amount:</strong> ₹{order.totalPrice}</p>
                  <p className="mt-1">
                    <strong>Payment Status:</strong>{" "}
                    <span
                      className={
                        order.paymentStatus === "Paid" ? "text-green-600" : "text-red-500"
                      }
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                  <p className="mt-1">
                    <strong>Method:</strong> {order.paymentMethod === "online" ? "Online" : "COD"}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    Ordered on: {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ⭐ REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
             onClick={() => setShowReviewModal(false)}>
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg"
               onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-3">Review: {reviewProductName}</h3>

            <select
              className="border p-2 rounded w-full mb-3"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Select Rating</option>
              {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Star</option>)}
            </select>

            <textarea
              className="border p-2 rounded w-full h-24"
              placeholder="Write comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowReviewModal(false)}
                      className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={submitReview}
                      className="px-4 py-2 bg-orange-600 text-white rounded">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
