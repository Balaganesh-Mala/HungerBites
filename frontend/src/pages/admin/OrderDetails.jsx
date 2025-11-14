import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminApi from "../../api/adminAxios";
import Swal from "sweetalert2";

const statusSteps = ["Processing", "Shipped", "Delivered"];

const statusColors = {
  Processing: "bg-orange-100 text-orange-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    try {
      const res = await adminApi.get("/admin/orders");
      const found = res.data.orders.find((o) => o._id === id);
      setOrder(found);
    } catch (err) {
      Swal.fire("Error", "Unable to fetch order details", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      await adminApi.put(`/admin/order/${id}/status`, { status: newStatus });

      Swal.fire({
        icon: "success",
        title: "Status Updated!",
        timer: 1200,
        showConfirmButton: false,
      });

      loadOrder(); // Refresh UI
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return <p className="p-6 text-red-500">Order not found</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Order Details</h1>

      {/* HEADER INFO */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Order ID: {order._id}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

          <div>
            <p className="text-slate-500">Customer</p>
            <p className="font-medium">{order.user?.name}</p>
            <p className="text-xs text-slate-500">{order.user?.email}</p>
          </div>

          <div>
            <p className="text-slate-500">Payment</p>
            <p
              className={`font-medium px-3 py-1 rounded-full inline-block text-xs ${
                order.paymentStatus === "Paid"
                  ? "bg-green-100 text-green-700"
                  : order.paymentStatus === "Failed"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.paymentStatus}
            </p>
            <p className="text-xs text-slate-500">
              Method: {order.paymentMethod}
            </p>
          </div>

          <div>
            <p className="text-slate-500">Order Status</p>
            <p
              className={`font-medium px-3 py-1 rounded-full inline-block text-xs ${statusColors[order.orderStatus]}`}
            >
              {order.orderStatus}
            </p>
          </div>

        </div>
      </div>

      {/* STATUS TIMELINE */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Progress</h2>

        <div className="flex items-center justify-between relative">

          {statusSteps.map((status, idx) => (
            <div key={idx} className="text-center flex-1">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white 
                ${
                  order.orderStatus === status ||
                  statusSteps.indexOf(order.orderStatus) > idx
                    ? "bg-green-600"
                    : "bg-gray-400"
                }`}
              >
                {idx + 1}
              </div>
              <p
                className={`text-xs mt-2 ${
                  order.orderStatus === status ||
                  statusSteps.indexOf(order.orderStatus) > idx
                    ? "text-green-700 font-medium"
                    : "text-gray-500"
                }`}
              >
                {status}
              </p>
            </div>
          ))}

        </div>

        {/* Update Status */}
        <div className="mt-4">
          <select
            className="border p-2 rounded-lg"
            value={order.orderStatus}
            onChange={(e) => updateStatus(e.target.value)}
          >
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* SHIPPING ADDRESS */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
        <p><strong>{order.shippingAddress.name}</strong></p>
        <p>{order.shippingAddress.street}</p>
        <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
        <p>Pincode: {order.shippingAddress.pincode}</p>
        <p>Phone: {order.shippingAddress.phone}</p>
      </div>

      {/* ORDER ITEMS */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>

        {order.orderItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 border-b py-4">

            <img
              src={
                item.productId?.images?.[0]?.url ||
                item.productId?.images?.[0] ||
                "https://via.placeholder.com/80"
              }
              className="w-20 h-20 rounded-lg object-cover"
            />

            <div className="flex-1">
              <p className="font-medium">{item.productId?.name || item.name}</p>
              <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
            </div>

            <p className="font-semibold text-orange-600">₹{item.price}</p>
          </div>
        ))}

        {/* TOTAL */}
        <div className="text-right mt-4 text-lg font-semibold">
          Total: ₹{order.totalPrice}
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
