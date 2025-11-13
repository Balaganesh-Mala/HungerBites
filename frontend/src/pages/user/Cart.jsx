import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from API
  const loadCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data.cart.items || []);
      console.log("Cart data:", res.data);
    } catch (err) {
      console.log("Cart error:", err);
    }
    setLoading(false);
  };

  // Update quantity
  const updateQty = async (productId, qty) => {
    if (qty < 1) return;

    try {
      await api.put("/cart/update", { productId, quantity: qty });
      loadCart();
    } catch (err) {
      console.log("Qty update error:", err);
    }
  };

  // Remove item
  const removeItem = async (productId) => {
  try {
    await api.delete("/cart/remove", {
      data: { productId },
    });
    loadCart();
  } catch (err) {
    console.log("Remove error:", err);
  }
};

  useEffect(() => {
    loadCart();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 py-20">Loading...</p>;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Your Cart</h1>
        <Link to="/products" className="text-orange-600 font-medium">
          Continue Shopping →
        </Link>
      </div>

      {/* EMPTY CART */}
      {cart.length === 0 && (
        <div className="text-center mt-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
            alt="Empty Cart"
            className="w-40 mx-auto opacity-80"
          />
          <h2 className="text-xl font-semibold text-slate-700 mt-4">
            Your cart is empty
          </h2>
          <Link
            to="/products"
            className="mt-6 inline-block bg-orange-600 text-white px-6 py-3 rounded-lg"
          >
            Browse Products
          </Link>
        </div>
      )}

      {/* CART LIST */}
      {cart.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">

          {/* LEFT SIDE – ITEMS */}
          <div className="md:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="bg-white p-4 rounded-xl shadow flex gap-4"
              >
                {/* Product Image */}
                <img
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  className="w-28 h-28 rounded-lg object-cover"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className="text-slate-500 text-sm">
                    {item.product.flavor || item.product.category?.name}
                  </p>

                  {/* Price */}
                  <p className="mt-1 text-orange-600 font-bold">
                    ₹{item.product.price}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() =>
                        updateQty(item.product._id, item.quantity - 1)
                      }
                      className="px-3 py-1 border rounded-lg"
                    >
                      -
                    </button>

                    <span className="font-medium">{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQty(item.product._id, item.quantity + 1)
                      }
                      className="px-3 py-1 border rounded-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  className="text-red-500 font-medium"
                  onClick={() => removeItem(item.product._id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE – SUMMARY */}
          <div className="bg-white p-6 rounded-xl shadow h-fit">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

            <div className="flex justify-between text-slate-700 mb-2">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="flex justify-between text-slate-700 mb-2">
              <span>Delivery</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="h-[1px] bg-gray-200 my-3"></div>

            <div className="flex justify-between font-bold text-lg text-slate-900">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            {/* Checkout Button */}
            <Link
              to="/checkout"
              className="block text-center mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
