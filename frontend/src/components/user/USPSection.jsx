import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const USPSection = () => {
  return (
    <section className="w-full bg-gray-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 w-full">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Real Taste. Real Health.<br />
            Snacks You Can Trust.
          </h2>

          <Link
            to="/about"
            className="inline-flex items-center mt-8 bg-orange-600 hover:bg-orange-700 
                       text-white px-7 py-4 rounded-full transition font-semibold text-lg shadow-lg"
          >
            Know More <FiArrowRight className="ml-2" size={22}/>
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col justify-center">
          <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-xl">
            At Wonew Snacks, we bring you a premium range of roasted, baked, and flavored snacks made from 100% natural ingredients.
            Our products are carefully crafted in hygienic facilities, offering bold flavors without artificial preservatives.
            Experience clean-label snacking that supports a healthy lifestyle while satisfying real cravings.
          </p>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-14 mt-14">

            <div>
              <h3 className="text-5xl font-extrabold text-orange-500">99%</h3>
              <p className="text-gray-200 mt-3 text-sm md:text-base leading-snug max-w-xs">
                Pure, clean, natural ingredient snacks loved by our customers for authenticity and taste.
              </p>
            </div>

            <div>
              <h3 className="text-5xl font-extrabold text-orange-500">100%</h3>
              <p className="text-gray-200 mt-3 text-sm md:text-base leading-snug max-w-xs">
                No artificial flavors, no chemical preservatives — just real food, real crunch, real goodness.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default USPSection;
