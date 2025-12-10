import React from "react";
import { motion } from "framer-motion";

const Policy = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-6 py-12"
      >
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6 text-center md:text-left">
          Policies
        </h1>
        <p className="text-gray-500 text-sm mb-10 text-center md:text-left">
          Transparency you can trust — learn how we protect your data & handle
          returns.
        </p>

        {/* Privacy Policy */}
        <section className="bg-white border shadow-sm rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Privacy Policy 🔒
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Hunger Bites values your privacy. We collect your personal
            information solely to process orders, improve service experience and
            provide a seamless shopping journey.
          </p>

          <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
            <li>We never sell or trade your personal data to third parties.</li>
            <li>Payment information is encrypted and handled securely.</li>
            <li>
              Cookies are used to personalise experience, track cart behaviour,
              and enhance browsing.
            </li>
            <li>You may request deletion of stored customer data anytime.</li>
            <li>
              Contact details given during purchase may be used for delivery
              updates, customer support or promotional offers (opt-out anytime).
            </li>
          </ul>

          <p className="text-gray-600 text-sm mt-4">
            If you have privacy concerns, feel free to reach out — your trust
            matters to us.
          </p>
        </section>

        {/* Refund Policy */}
        <section className="bg-white border shadow-sm rounded-2xl p-8">
  <h2 className="text-2xl font-semibold text-slate-900 mb-4">
    Refund & Returns Policy 🔁
  </h2>

  <p className="text-gray-500 text-xs mb-2">
    Last Updated: 10th December 2025
  </p>

  <p className="text-gray-600 text-sm leading-relaxed mb-4">
    At Hunger Bites, we strive to deliver fresh, high-quality snacks that you
    can enjoy without worry. If you are not fully satisfied with your purchase,
    we’re here to help.
  </p>

  {/* SECTION 1 */}
  <h4 className="font-semibold text-sm text-slate-800 mt-4">
    1. Eligibility for Refunds & Replacements
  </h4>
  <p className="text-gray-600 text-sm mt-2">
    Refunds or replacements are accepted under the following conditions:
  </p>
  <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 mt-2">
    <li>
      <strong>Damaged or Defective Products:</strong> If your order arrives
      spoiled, tampered, or defective.
    </li>
    <li>
      <strong>Wrong Product Delivered:</strong> If you received a different
      item, flavour, or quantity than ordered.
    </li>
    <li>
      <strong>Missing Items:</strong> If any product is missing from your
      delivery.
    </li>
  </ul>

  {/* SECTION 2 */}
  <h4 className="font-semibold text-sm text-slate-800 mt-6">
    2. Conditions for Non-Refundable Items
  </h4>
  <p className="text-gray-600 text-sm mt-2">
    We do <strong>NOT</strong> accept returns or refunds for:
  </p>
  <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 mt-2">
    <li>Products that are opened or partially consumed</li>
    <li>Change of mind after receiving the order</li>
    <li>Incorrect address provided by customer</li>
    <li>Items bought under clearance / promotional sale</li>
    <li>Issues reported after 48 hours of delivery</li>
  </ul>

  {/* SECTION 3 */}
  <h4 className="font-semibold text-sm text-slate-800 mt-6">
    3. Time Window for Claims
  </h4>
  <p className="text-gray-600 text-sm mt-2">
    You must raise a complaint within <strong>48 hours</strong> of receiving
    your order.
    <br />
    Kindly share:
  </p>
  <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 mt-2">
    <li>Clear photos/videos of the product and packaging</li>
    <li>Your Order ID</li>
    <li>Reason for refund/replacement</li>
  </ul>

  {/* SECTION 4 */}
  <h4 className="font-semibold text-sm text-slate-800 mt-6">
    4. Refund Method
  </h4>
  <p className="text-gray-600 text-sm mt-2">
    Once your claim is approved:
  </p>
  <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 mt-2">
    <li>Refunds will be processed to original payment method</li>
    <li>Refund reflects within 5–7 business days</li>
    <li>
      COD orders will be refunded via UPI or bank account shared by you
    </li>
  </ul>

  {/* SECTION 5 */}
  <h4 className="font-semibold text-sm text-slate-800 mt-6">
    5. Replacement Policy
  </h4>
  <p className="text-gray-600 text-sm mt-2">
    If you choose a replacement:
  </p>
  <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 mt-2">
    <li>We will resend the product at no extra cost</li>
    <li>Delivery time depends on your location</li>
  </ul>

  {/* SECTION 6 */}
  <h4 className="font-semibold text-sm text-slate-800 mt-6">
    6. Order Cancellation
  </h4>
  <p className="text-gray-600 text-sm mt-2">
    You may cancel your order within <strong>2 hours</strong> of placing it,
    provided it has not been shipped.
    <br />
    Once shipped, cancellation is not allowed.
  </p>

  {/* SECTION 7 */}
  <h4 className="font-semibold text-sm text-slate-800 mt-6">
    7. Contact Us
  </h4>
  <p className="text-gray-600 text-sm mt-2 leading-relaxed">
    For refund or replacement requests, contact us:
    <br />
    <strong>Email:</strong> info@hungerbites.store <br />
    <strong>Phone/WhatsApp:</strong> 9848054570 <br />
    <strong>Working Hours:</strong> 10:00 AM – 6:00 PM (Mon–Sat)
  </p>
</section>

      </motion.div>
    </div>
  );
};

export default Policy;
