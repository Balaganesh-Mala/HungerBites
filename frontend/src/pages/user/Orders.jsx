import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getMyOrdersApi } from "../../api/order.api";

const statusStyles = {
  Pending: "bg-gray-200 text-gray-700",
  Processing: "bg-blue-100 text-blue-600",
  Shipped: "bg-purple-100 text-purple-600",
  Delivered: "bg-green-100 text-green-600",
  Cancelled: "bg-red-100 text-red-600",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders
  const loadOrders = async () => {
    try {
      const res = await getMyOrdersApi();
      setOrders(res.data.orders || []);
      console.log("Orders Loaded:", res.data.orders);
    } catch (err) {
      console.error("Orders Error:", err);
      Swal.fire("Error", "Failed to load orders", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 py-20">Loading orders...</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-semibold text-slate-900 mb-8">
          My Orders
        </h1>

        {/* Empty Orders */}
        {orders.length === 0 && (
          <div className="text-center mt-20">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png"
              alt="No Orders"
              className="w-40 mx-auto opacity-80"
            />
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

        {/* Orders List */}
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-xl shadow border border-gray-100"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-slate-600">
                  Order ID:<span className="font-medium"> {order._id}</span>
                </p>

                {/* Better Status Tag */}
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    statusStyles[order.orderStatus] ||
                    "bg-orange-100 text-orange-600"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* Status Timeline */}
              <div className="flex items-center gap-0 mb-5">
                {["Pending", "Processing", "Shipped", "Delivered"].map(
                  (step, index) => {
                    const isActive =
                      [
                        "Pending",
                        "Processing",
                        "Shipped",
                        "Delivered",
                      ].indexOf(order.orderStatus) >= index;

                    const isCancelled = order.orderStatus === "Cancelled";

                    return (
                      <div key={step} className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            isCancelled
                              ? "border-red-400 bg-red-400"
                              : isActive
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300 bg-gray-200"
                          }`}
                        ></div>

                        {index < 3 && (
                          <div
                            className={`w-10 h-1 ${
                              isCancelled
                                ? "bg-red-300"
                                : isActive
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              <div className="border-t pt-4 grid gap-4">
                {/* Order Items */}
                {order.orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-center border-b pb-4"
                  >
                    <img
                      src={
                        item.productId?.images?.[0]?.url ||
                        item.productId?.images?.[0] ||
                        "https://via.placeholder.com/100"
                      }
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                    />

                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="mt-1 font-semibold text-orange-600">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="grid mt-4 text-sm text-slate-700">
                  <p>
                    <strong>Total Amount:</strong>{" "}
                    <span className="text-orange-600 font-bold">
                      ₹{order.totalPrice}
                    </span>
                  </p>

                  <p>
                    <strong>Payment:</strong>{" "}
                    <span
                      className={
                        order.paymentStatus === "Paid"
                          ? "text-green-600 font-medium"
                          : "text-orange-600 font-medium"
                      }
                    >
                      {order.paymentStatus}
                    </span>
                  </p>

                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {order.paymentMethod.toUpperCase()}
                  </p>

                  <p className="mt-2 text-slate-700">
                    <strong>Delivered To:</strong>{" "}
                    {order.shippingAddress.name},{" "}
                    {order.shippingAddress.street},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state} -{" "}
                    {order.shippingAddress.pincode}
                  </p>

                  <p className="text-slate-700 mt-1">
                    <strong>Phone:</strong> {order.shippingAddress.phone}
                  </p>

                  <p className="text-xs text-slate-500 mt-2">
                    Ordered on:{" "}
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Repeat Order Button */}
                <div className="mt-4 text-right">
                  <Link
                    to="/products"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Order Again
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
