import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api/axios";
import { clearCartApi } from "../../api/cart.api";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowData = location.state;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // 📌 Load items (Buy Now or Full Cart)
  useEffect(() => {
    if (buyNowData?.buyNow) {
      // Buy Now Logic
      setCartItems([
        {
          product: {
            _id: buyNowData.product._id,
            name: buyNowData.product.title,
            price: buyNowData.product.price,
            images: [{ url: buyNowData.product.image }],
          },
          quantity: 1,
        },
      ]);
      setLoading(false);
    } else {
      // Cart Checkout
      loadCart();
    }
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.get("/cart");
      setCartItems(res.data.cart.items || []);
    } catch (err) {
      console.log("Checkout Cart Error:", err);
    }
    setLoading(false);
  };

  // SAFE subtotal calculation
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item?.product?.price ?? item?.price ?? 0;
    return sum + price * (item.quantity || 0);
  }, 0);

  // 🔹 Final order data
  const buildOrderData = () => ({
    orderItems: cartItems.map((item) => ({
      productId: item.product?._id,
      name:
        item.product?.title ||
        item.product?.name ||
        "Unknown Product",
      quantity: item.quantity,
      price: item?.product?.price ?? item?.price ?? 0,
    })),
    shippingAddress: address,
    totalPrice: subtotal,
    paymentMethod,
  });

  // 🟧 COD ORDER
  const placeCODOrder = async () => {
    try {
      const res = await api.post("/orders", buildOrderData());

      if (!buyNowData?.buyNow) {
        await clearCartApi();
      }

      Swal.fire("Order Placed!", "Your COD order was successful.", "success");

      navigate("/orders");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to place order",
        "error"
      );
    }
  };

  // Load Razorpay script
  const loadRazorpay = (src) =>
    new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  // 🟧 Online Payment
  const placeOnlineOrder = async () => {
    const orderData = buildOrderData();

    const loaded = await loadRazorpay(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!loaded) {
      return Swal.fire("Error", "Failed to load Razorpay SDK", "error");
    }

    const res = await api.post("/orders", orderData);
    const { razorpayOrderId, amount } = res.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount,
      currency: "INR",
      name: "Hunger Bites",
      description: "Order Payment",
      order_id: razorpayOrderId,

      handler: async (response) => {
        try {
          await api.post("/orders/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData,
          });

          if (!buyNowData?.buyNow) {
            await clearCartApi();
          }

          Swal.fire("Success", "Payment completed!", "success");
          navigate("/orders");
        } catch (err) {
          Swal.fire("Error", "Payment verification failed", "error");
        }
      },

      prefill: {
        name: address.name,
        contact: address.phone,
      },

      theme: { color: "#ff6600" },
    };

    new window.Razorpay(options).open();
  };

  const handlePlaceOrder = () => {
    if (!address.name || !address.phone || !address.city || !address.pincode) {
      return Swal.fire(
        "Incomplete Address",
        "Please fill all required fields.",
        "warning"
      );
    }

    if (paymentMethod === "COD") placeCODOrder();
    else placeOnlineOrder();
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* ADDRESS */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

          <div className="grid gap-4">
            {Object.keys(address).map((key) => (
              <input
                key={key}
                type="text"
                placeholder={key.toUpperCase()}
                className="border p-3 rounded"
                value={address[key]}
                onChange={(e) =>
                  setAddress({ ...address, [key]: e.target.value })
                }
              />
            ))}
          </div>

          <h2 className="text-xl font-semibold mt-6">Payment Method</h2>

          <div className="flex gap-4 mt-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              Online Payment
            </label>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Delivery</span>
            <span className="text-green-600">FREE</span>
          </div>

          <div className="border-t my-3"></div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
