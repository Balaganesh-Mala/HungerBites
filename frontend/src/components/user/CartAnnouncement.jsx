import { motion } from "framer-motion";
import { Gift, CheckCircle } from "lucide-react";

const CartAnnouncement = ({
  cartTotal,
  minCartValue,
  discount,
  couponCode,
  couponType,
}) => {
  if (discount <= 0) return null;

  const remaining = Math.max(minCartValue - cartTotal, 0);
  const progress = Math.min(Math.round((cartTotal / minCartValue) * 100), 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-5"
    >
      <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        {/* ICON */}
        <div className="absolute -top-4 left-4 bg-orange-100 p-2 rounded-full">
          {remaining > 0 ? (
            <Gift className="text-orange-600" size={18} />
          ) : (
            <CheckCircle className="text-green-600" size={18} />
          )}
        </div>

        {/* MESSAGE */}
        {remaining > 0 ? (
          <div className="pt-3">
            <p className="text-sm md:text-base font-medium text-gray-800">
              You’re almost there!
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Add{" "}
              <span className="font-semibold text-orange-600">
                ₹{remaining}
              </span>{" "}
              more to get{" "}
              <span className="font-semibold text-green-600">
                ₹{discount} OFF
              </span>
            </p>
          </div>
        ) : (
          <div className="pt-3 space-y-1">
            <p className="text-sm font-semibold text-green-700 flex items-center gap-1">
              🎉 Coupon unlocked
            </p>

            <p className="text-sm text-gray-600">
              Use code{" "}
              <span className="font-semibold text-gray-900 bg-green-50 px-2 py-0.5 rounded">
                {couponCode}
              </span>{" "}
              to get{" "}
              <span className="font-semibold text-green-600">
                {couponType === "PERCENT"
                  ? `${discount}% OFF`
                  : `₹${discount} OFF`}
              </span>
            </p>

            <p className="text-xs text-gray-500">
              Applied automatically at checkout
            </p>
          </div>
        )}

        {/* PROGRESS */}
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
              className={`h-full rounded-full ${
                remaining > 0 ? "bg-orange-500" : "bg-green-600"
              }`}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>Cart ₹{cartTotal}</span>
            <span>Goal ₹{minCartValue}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartAnnouncement;
