import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getMyOrdersApi, trackOrderApi } from "../../api/order.api";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Track Modal
  const [trackingModal, setTrackingModal] = useState(false);
  const [trackingData, setTrackingData] = useState(null);

  // Review Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewProductId, setReviewProductId] = useState(null);
  const [reviewProductName, setReviewProductName] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  // Logged user
  const token = localStorage.getItem("token");
  let loggedInUserId = null;
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      loggedInUserId = decoded.id;
    } catch {}
  }

  // Load orders
  const loadOrders = async () => {
    try {
      const res = await getMyOrdersApi();

      let data = res.data.orders || [];
      // Sort newest → oldest
      data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(data);
      setFilteredOrders(data);
    } catch {
      Swal.fire("Error", "Failed to load orders", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Tracking
  const trackOrder = async (trackingId) => {
    try {
      const res = await trackOrderApi(trackingId);
      setTrackingData(res.data);
      setTrackingModal(true);
    } catch {
      Swal.fire("Error", "Unable to fetch tracking details", "error");
    }
  };

  // Review Modal Open
  const openReviewModal = (productId, productName) => {
    setReviewProductId(productId);
    setReviewProductName(productName);
    setShowReviewModal(true);
  };

  // Submit Review
  const submitReview = async () => {
    if (!token) {
      Swal.fire("Login Required", "Please login first!", "warning");
      navigate("/login");
      return;
    }

    if (!rating || !comment) {
      Swal.fire("Error", "Please fill rating & comment", "error");
      return;
    }

    // Delivery validation
    const allowed = orders.some(
      (order) =>
        order.orderStatus === "Delivered" &&
        order.orderItems?.some(
          (item) =>
            String(item.productId?._id || item.productId) ===
            String(reviewProductId)
        )
    );

    if (!allowed) {
      Swal.fire("Not Allowed", "You can review only after delivery!", "error");
      return;
    }

    try {
      await api.post(
        `/products/${reviewProductId}/review`,
        { rating: Number(rating), comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success!", "Review submitted!", "success").then(() => {
        setShowReviewModal(false);
        setRating("");
        setComment("");
        loadOrders(); // refresh UI to hide review button
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Review submission failed",
        "error"
      );
    }
  };

  // Expand row toggle
  const toggleExpand = (orderId) =>
    setExpandedOrder(expandedOrder === orderId ? null : orderId);

  // Search + filter logic
  useEffect(() => {
    let updated = [...orders];

    if (search) {
      updated = updated.filter(
        (o) =>
          o._id.includes(search) ||
          o.orderItems.some((i) =>
            i.productId?.name?.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    if (statusFilter !== "all") {
      updated = updated.filter((o) => o.orderStatus === statusFilter);
    }

    setFilteredOrders(updated);
  }, [search, statusFilter, orders]);

  const statusColors = {
    Processing: "bg-orange-100 text-orange-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
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
        <h1 className="text-3xl font-semibold text-slate-900 mb-10">
          My Orders
        </h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Search orders..."
            className="px-4 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="px-4 py-2 border rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center mt-20">
            <h2 className="text-xl font-semibold text-slate-700 mt-4">
              No matching orders found
            </h2>
          </div>
        )}

        {/* Order Table */}
        <div className="overflow-x-auto rounded-xl shadow border">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-100 text-left text-sm text-slate-600 border-b">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            {/* ONLY ONE tbody */}
            <tbody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(order._id)}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            order.orderItems?.[0]?.productId?.images?.[0]
                              ?.url || "https://via.placeholder.com/50"
                          }
                          className="w-12 h-12 rounded-lg object-cover border"
                          alt="product"
                        />
                        <span className="text-sm text-slate-700">
                          {order.orderItems?.[0]?.productId?.name || "—"}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 font-medium text-slate-700">
                      {order._id}
                    </td>

                    <td className="p-3 font-semibold text-orange-600">
                      ₹{order.totalPrice}
                    </td>

                    <td className="p-3">
                      <span className="text-sm font-medium text-slate-700">
                        {order.paymentMethod === "online"
                          ? "Online Payment"
                          : order.paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : order.paymentMethod}
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          statusColors[order.orderStatus]
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="p-3 text-blue-600 text-sm">
                      Click to expand ↓
                    </td>
                  </tr>

                  {/* EXPANDED ROW */}
                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-gray-50 border-b"
                      >
                        <td colSpan="6" className="p-4">
                          {order.orderItems.map((item, i) => {
                            const alreadyReviewed =
                              item.productId?.reviews?.some(
                                (rev) =>
                                  rev.user?.toString() ===
                                  loggedInUserId?.toString()
                              ) || false;

                            return (
                              <div
                                key={i}
                                className="flex justify-between p-3 border-b"
                              >
                                <div className="flex gap-3">
                                  <img
                                    src={
                                      item.productId?.images?.[0]?.url ||
                                      "https://via.placeholder.com/60"
                                    }
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                  <div>
                                    <p className="font-medium">
                                      {item.productId?.name || item.name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {order.trackingId && (
                                    <button
                                      onClick={() =>
                                        trackOrder(order.trackingId)
                                      }
                                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                                    >
                                      Track
                                    </button>
                                  )}

                                  {order.orderStatus === "Delivered" &&
                                    (alreadyReviewed ? (
                                      <span className="text-xs text-green-600 font-semibold">
                                        Reviewed
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          openReviewModal(
                                            item.productId?._id,
                                            item.productId?.name
                                          )
                                        }
                                        className="text-xs bg-orange-600 text-white px-2 py-1 rounded"
                                      >
                                        ★ Review
                                      </button>
                                    ))}
                                </div>
                              </div>
                            );
                          })}
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRACKING MODAL */}
      {trackingModal && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setTrackingModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-3">Tracking Details</h3>

            <p>
              <strong>Tracking ID:</strong> {trackingData?.trackingId}
            </p>
            <p className="mt-2">
              <strong>Status:</strong>{" "}
              <span className="font-semibold text-blue-600">
                {trackingData?.status}
              </span>
            </p>

            <div className="mt-4 border-t pt-3">
              <h4 className="font-semibold mb-2">History</h4>
              {trackingData?.history?.length ? (
                trackingData.history.map((h, i) => (
                  <div key={i} className="text-sm border-b py-2">
                    <p>{new Date(h.date).toLocaleString()}</p>
                    <p>Status: {h.status}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No tracking history yet.
                </p>
              )}
            </div>

            <button
              onClick={() => setTrackingModal(false)}
              className="mt-4 w-full py-2 bg-gray-300 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setShowReviewModal(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-96 shadow-lg animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">
              Review: {reviewProductName}
            </h3>

            {/* ⭐ STAR SELECTOR */}
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  onClick={() => setRating(star)}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-8 h-8 cursor-pointer transition-transform ${
                    star <= rating
                      ? "text-yellow-400 scale-110"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.568L24 9.748l-6 5.848L19.336 24 12 19.898 4.664 24 6 15.596 0 9.748l8.332-1.593z" />
                </svg>
              ))}
            </div>

            {/* RATING DISPLAY */}
            {rating && (
              <p className="text-sm text-slate-600 mb-2">
                Selected rating: <strong>{rating} star(s)</strong>
              </p>
            )}

            <textarea
              className="border p-2 rounded w-full h-24"
              placeholder="Write comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="px-4 py-2 bg-orange-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
