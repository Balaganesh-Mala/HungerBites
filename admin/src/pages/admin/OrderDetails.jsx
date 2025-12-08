import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminApi from "../../api/adminAxios";
import Swal from "sweetalert2";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shipLoading, setShipLoading] = useState(false);
  const [trackLoading, setTrackLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

  const colors = {
    Processing: "bg-orange-100 text-orange-600",
    Shipped: "bg-blue-100 text-blue-600",
    Delivered: "bg-green-100 text-green-600",
    Cancelled: "bg-red-100 text-red-600",
  };

  const loadOrder = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get(`/orders`);
      const found = res.data.orders.find((o) => o._id === id);
      setOrder(found || null);
    } catch {
      Swal.fire("Error", "Failed to load order", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrder();
  }, []);

  const updateStatus = async (status) => {
    setStatusLoading(true);
    try {
      await adminApi.put(`/orders/${id}/status`, { status });
      Swal.fire("Updated", "Order status changed!", "success");
      loadOrder();
    } catch {
      Swal.fire("Error", "Status update failed", "error");
    }
    setStatusLoading(false);
  };

  const shipOrder = async () => {
    setShipLoading(true);
    try {
      const res = await adminApi.post(`/orders/ship/${order._id}`);
      Swal.fire("Shipment Created", `Tracking ID: ${res.data.trackingId}`, "success");
      loadOrder();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Shipping failed", "error");
    }
    setShipLoading(false);
  };

  const refreshTracking = async () => {
    setTrackLoading(true);
    try {
      const res = await adminApi.get(`/orders/track/${order.trackingId}`);
      Swal.fire("Tracking Updated", `Status: ${res.data.status}`, "success");
      loadOrder();
    } catch {
      Swal.fire("Error", "Tracking failed", "error");
    }
    setTrackLoading(false);
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6 text-red-500">Order Not Found</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">Order Details</h2>

      {/* INFO CARD */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <p className="font-semibold text-lg">Order #{order._id}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3 text-sm">

          <div>
            <p className="text-gray-500">Customer</p>
            <p>{order.user?.name}</p>
            <p className="text-xs text-gray-500">{order.user?.email}</p>
          </div>

          <div>
            <p className="text-gray-500">Payment</p>
            <span className={`px-3 py-1 rounded-full text-xs ${colors[order.paymentStatus]}`}>
              {order.paymentStatus}
            </span>
            <p className="text-xs text-gray-500">Method: {order.paymentMethod}</p>
          </div>

          <div>
            <p className="text-gray-500">Order Status</p>
            <span className={`px-3 py-1 rounded-full text-xs ${colors[order.orderStatus]}`}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* SHIP BUTTON */}
        {!order.trackingId && order.orderStatus === "Processing" && (
          <button
            onClick={shipOrder}
            disabled={shipLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
          >
            {shipLoading ? "Shipping..." : "Ship Order"}
          </button>
        )}

        {/* Tracking Buttons */}
        {order.trackingId && (
          <div className="mt-4 flex gap-3">
            <div className="bg-gray-100 px-4 py-2 rounded text-sm">
              Tracking: <b>{order.trackingId}</b>
            </div>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
              onClick={refreshTracking}
              disabled={trackLoading}
            >
              {trackLoading ? "Refreshing..." : "Refresh Tracking"}
            </button>
          </div>
        )}
      </div>

      {/* Update Status UI */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <p className="font-semibold text-lg mb-4">Update Status</p>
        <select
          className="border p-2 rounded-lg"
          value={order.orderStatus}
          onChange={(e) => updateStatus(e.target.value)}
          disabled={statusLoading}
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* SHIPPING ADDRESS */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <p className="font-semibold text-lg mb-4">Shipping Address</p>
        <p><b>{order.shippingAddress.name}</b></p>
        <p>{order.shippingAddress.street}</p>
        <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
        <p>Pincode: {order.shippingAddress.pincode}</p>
        <p>Phone: {order.shippingAddress.phone}</p>
      </div>

      {/* ITEMS */}
      <div className="bg-white shadow rounded-xl p-6">
        <p className="font-semibold text-lg mb-4">Order Items</p>

        {order.orderItems.map((it, i) => (
          <div key={i} className="flex border-b py-3 gap-4">
            <img
              className="w-16 h-16 rounded-lg object-cover"
              src={it.productId?.images?.[0]?.url || "https://via.placeholder.com/60"}
              alt=""
            />

            <div className="flex-1">
              <p>{it.productId?.name || it.name}</p>
              <p className="text-sm text-gray-600">Qty: {it.quantity}</p>
            </div>

            <p className="font-semibold text-orange-600">₹{it.price}</p>
          </div>
        ))}

        <div className="text-right mt-4 text-lg font-bold">
          Total: ₹{order.totalPrice}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
