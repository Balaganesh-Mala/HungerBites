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
          Transparency you can trust — learn how we protect your data & handle returns.
        </p>

        {/* Privacy Policy */}
        <section className="bg-white border shadow-sm rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Privacy Policy 🔒
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Hunger Bites values your privacy. We collect your personal information
            solely to process orders, improve service experience and provide a seamless
            shopping journey.
          </p>

          <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
            <li>We never sell or trade your personal data to third parties.</li>
            <li>Payment information is encrypted and handled securely.</li>
            <li>
              Cookies are used to personalise experience, track cart behaviour, and
              enhance browsing.
            </li>
            <li>You may request deletion of stored customer data anytime.</li>
            <li>
              Contact details given during purchase may be used for delivery updates,
              customer support or promotional offers (opt-out anytime).
            </li>
          </ul>

          <p className="text-gray-600 text-sm mt-4">
            If you have privacy concerns, feel free to reach out — your trust matters
            to us.
          </p>
        </section>

        {/* Refund Policy */}
        <section className="bg-white border shadow-sm rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Refund & Return Policy 🔁
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Hunger Bites strives for 100% customer satisfaction. Since our snacks are
            consumable food items, returns are accepted only in specific cases.
          </p>

          <h4 className="font-semibold text-sm text-slate-800 mt-4">
            Refunds are applicable if:
          </h4>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
            <li>Product is damaged or tampered during transit.</li>
            <li>Wrong item was delivered.</li>
            <li>Product is expired upon arrival.</li>
          </ul>

          <h4 className="font-semibold text-sm text-slate-800 mt-4">
            Refund Eligibility:
          </h4>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
            <li>Submit complaint within 48 hours of delivery.</li>
            <li>
              Provide pictures/video proof showing package condition & issue.
            </li>
          </ul>

          <p className="text-gray-600 text-sm leading-relaxed mt-4">
            After review, refunds are processed to original payment mode within
            5–7 working days. COD refunds will be issued through UPI / bank transfer.
          </p>

          <p className="text-gray-600 text-sm leading-relaxed mt-4">
            For hygiene and food safety reasons, opened or consumed products cannot be
            returned unless proven defective.
          </p>
        </section>

        
      </motion.div>
    </div>
  );
};

export default Policy;
