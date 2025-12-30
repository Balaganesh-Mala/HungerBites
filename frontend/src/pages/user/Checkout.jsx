import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api/axios";
import { clearCartApi } from "../../api/cart.api";
import CartAnnouncement from "../../components/user/CartAnnouncement";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowData = location.state;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [couponCode, setCouponCode] = useState("");
const [couponDiscount, setCouponDiscount] = useState(0);
const [applyingCoupon, setApplyingCoupon] = useState(false);

const [announcement, setAnnouncement] = useState(null);
const [loadingAnnouncement, setLoadingAnnouncement] = useState(true);



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
  loadAnnouncement();

  if (buyNowData?.buyNow) {
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
    name: item.product?.title || item.product?.name || "Unknown Product",
    quantity: item.quantity,
    price: item?.product?.price ?? item?.price ?? 0,
  })),
  shippingAddress: address,
  paymentMethod,
  couponCode: couponDiscount > 0 ? couponCode : null,
});



const loadAnnouncement = async () => {
  try {
    const res = await api.get("/coupons/active-announcement");
    setAnnouncement(res.data.data);
  } catch (err) {
    console.log("Announcement load failed", err);
    setAnnouncement(null);
  } finally {
    setLoadingAnnouncement(false);
  }
};

useEffect(() => {
  if (couponDiscount > 0 && subtotal === 0) {
    setCouponDiscount(0);
    setCouponCode("");
  }
}, [subtotal]);



  const applyCoupon = async () => {
  if (!couponCode.trim()) {
    return Swal.fire("Enter Coupon", "Please enter a coupon code", "warning");
  }

  try {
    setApplyingCoupon(true);

    const res = await api.post("/coupons/validate", {
      code: couponCode,
      cartTotal: subtotal,
    });

    setCouponDiscount(res.data.coupon.discount);

    Swal.fire(
      "Coupon Applied",
      `You saved ₹${res.data.coupon.discount}`,
      "success"
    );
  } catch (err) {
    setCouponDiscount(0);
    Swal.fire(
      "Invalid Coupon",
      err.response?.data?.message || "Coupon not valid",
      "error"
    );
  } finally {
    setApplyingCoupon(false);
  }
};


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
    try {
      const orderData = buildOrderData();

      const loaded = await loadRazorpay(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!loaded) {
        Swal.fire("Error", "Failed to load Razorpay SDK", "error");
        return;
      }

      const res = await api.post("/payment/initiate", orderData);
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
            // ⏳ show loader while verifying
            setPlacingOrder(true);

            await api.post("/payment/verify", {
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
          } finally {
            setPlacingOrder(false);
          }
        },

        modal: {
          ondismiss: () => {
            // 👈 user closed Razorpay popup
            setPlacingOrder(false);
          },
        },

        prefill: {
          name: address.name,
          contact: address.phone,
        },

        theme: { color: "#ff6600" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Online payment failed",
        "error"
      );
      setPlacingOrder(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.name || !address.phone || !address.city || !address.pincode) {
      return Swal.fire(
        "Incomplete Address",
        "Please fill all required fields.",
        "warning"
      );
    }

    // 📞 Phone number validation
    if (!/^[6-9]\d{9}$/.test(address.phone)) {
      return Swal.fire(
        "Invalid Phone Number",
        "Please enter a valid 10-digit mobile number",
        "error"
      );
    }

    if (placingOrder) return;

    setPlacingOrder(true);

    if (paymentMethod === "COD") {
      await placeCODOrder();
    } else {
      await placeOnlineOrder();
    }

    setPlacingOrder(false);
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">

  {/* 🧭 PAGE HEADER */}
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
    <p className="text-sm text-gray-500 mt-1">
      Complete your order in just one step
    </p>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

    {/* ================= LEFT: DETAILS ================= */}
    <div className="lg:col-span-3 space-y-8">

      {/* 🏠 SHIPPING */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
            1
          </span>
          <h2 className="text-lg font-semibold text-gray-900">
            Shipping Address
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(address).map((key) => (
            <input
              key={key}
              type={key === "phone" ? "tel" : "text"}
              placeholder={key.toUpperCase()}
              className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={address[key]}
              maxLength={key === "phone" ? 10 : undefined}
              onChange={(e) => {
                let value = e.target.value;
                if (key === "phone") value = value.replace(/\D/g, "");
                setAddress({ ...address, [key]: value });
              }}
            />
          ))}
        </div>
      </div>

      {/* 💳 PAYMENT */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">
            2
          </span>
          <h2 className="text-lg font-semibold text-gray-900">
            Payment Method
          </h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-orange-500">
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            <span className="font-medium text-gray-800">
              Cash on Delivery
            </span>
          </label>

          <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-orange-500">
            <input
              type="radio"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />
            <span className="font-medium text-gray-800">
              Online Payment
            </span>
          </label>
        </div>
      </div>
    </div>

    {/* ================= RIGHT: SUMMARY ================= */}
    <div className="lg:col-span-2">

      <div className="sticky top-6 bg-white rounded-2xl shadow-md border overflow-hidden">

        {/* 🔔 ANNOUNCEMENT */}
        {!loadingAnnouncement && announcement && (
          <div className="px-5 pt-5">
            <CartAnnouncement
              cartTotal={subtotal}
              minCartValue={announcement.minCartValue}
              discount={announcement.discount}
            />
          </div>
        )}

        {/* 🧾 SUMMARY HEADER */}
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Order Summary
          </h3>
        </div>

        {/* 🎟️ COUPON */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <button
              onClick={applyCoupon}
              disabled={applyingCoupon}
              className={`px-4 rounded-lg text-sm font-semibold
                ${
                  applyingCoupon
                    ? "bg-gray-300 text-gray-600"
                    : "bg-gray-900 text-white hover:bg-black"
                }`}
            >
              {applyingCoupon ? "..." : "Apply"}
            </button>
          </div>

          {couponDiscount > 0 && (
            <p className="text-xs text-green-600 mt-2">
              Coupon applied · You saved ₹{couponDiscount}
            </p>
          )}
        </div>

        {/* 💰 PRICE DETAILS */}
        <div className="px-6 py-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery</span>
            <span className="text-green-600">FREE</span>
          </div>

          {couponDiscount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Discount</span>
              <span>- ₹{couponDiscount}</span>
            </div>
          )}
        </div>

        {/* 🧮 TOTAL */}
        <div className="px-6 py-5 bg-gray-100 flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            ₹{Math.max(subtotal - couponDiscount, 0)}
          </span>
        </div>

        {/* 🚀 CTA */}
        <div className="px-6 py-5">
          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className={`w-full py-3 rounded-xl font-bold text-white transition
              ${
                placingOrder
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
          >
            {placingOrder ? "Processing…" : "Place Order Securely"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            🔒 Secure checkout · Trusted payments
          </p>
        </div>

      </div>
    </div>
  </div>
</div>

  );
};

export default Checkout;
