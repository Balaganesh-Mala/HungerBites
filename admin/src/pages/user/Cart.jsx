import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    try {
      const res = await api.get("/cart");
      const items = res.data.cart?.items || [];
      console.log("cart data:", res.data);

      // Ensure every item has a fallback productId even if product is deleted
      const fixedItems = items.map((item) => ({
        ...item,
        productIdFallback: item.product?._id || item.product, // product may be null OR ObjectId
      }));

      setCart(fixedItems);
    } catch (err) {
      console.log("Cart load error:", err);
    }
    setLoading(false);
  };

  const updateQty = async (item, qty) => {
    if (qty < 1) return;

    const productId = item.product?._id;
    if (!productId) return; // Do not allow qty update for deleted products

    try {
      await api.put("/cart/update", {
        productId,
        quantity: qty,
      });
      loadCart();
    } catch (err) {
      console.log("Qty update failed:", err);
    }
  };

  const removeItem = async (item) => {
    try {
      await api.delete("/cart/remove", {
        data: { productId: item.productIdFallback },
      });

      loadCart();
    } catch (err) {
      console.log("Remove failed:", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  if (loading) return <p className="py-20 text-center">Loading...</p>;

  const totalAmount = cart.reduce((sum, item) => {
    const price = item.product?.price ?? item.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">

      <div className="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Your Cart</h1>
        <Link to="/products" className="text-orange-600">Continue Shopping →</Link>
      </div>

      {cart.length === 0 && (
        <div className="text-center mt-20">
          <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" className="w-40 mx-auto" />
          <h2 className="text-xl mt-4">Your cart is empty</h2>
          <Link to="/products" className="bg-orange-600 text-white px-6 py-3 rounded-lg mt-6 inline-block">
            Browse Products
          </Link>
        </div>
      )}

      {cart.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">

          <div className="md:col-span-2 space-y-6">

            {cart.map((item) => {
              const product = item.product;
              const price = product?.price ?? item.price ?? 0;

              return (
                <div key={item._id} className="bg-white p-4 rounded-xl shadow flex gap-4">

                  <img
                    src={product?.images?.[0]?.url || "https://via.placeholder.com/100"}
                    className="w-28 h-28 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {product?.name || "Product removed"}
                    </h3>

                    <p className="text-orange-600 font-bold mt-1">₹{price}</p>

                    {product ? (
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          className="border px-3 py-1 rounded"
                          onClick={() => updateQty(item, item.quantity - 1)}
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          className="border px-3 py-1 rounded"
                          onClick={() => updateQty(item, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <p className="text-red-500 text-sm mt-2">
                        This item is no longer available.
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => removeItem(item)}
                    className="text-red-500 font-medium"
                  >
                    ✕
                  </button>

                </div>
              );
            })}

          </div>

          <div className="bg-white p-6 rounded-xl shadow h-fit">
            <h3 className="text-xl font-semibold">Order Summary</h3>

            <div className="flex justify-between mt-3">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="flex justify-between mt-3">
              <span>Delivery</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="border-t my-4"></div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <Link
              to="/checkout"
              className="block mt-6 text-center bg-orange-600 text-white py-3 rounded-lg"
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
