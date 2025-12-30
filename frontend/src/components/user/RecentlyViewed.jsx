import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";

const RecentlyViewed = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("recent_viewed")) || [];
    setItems(data);
  }, []);

  if (!items.length) return null;

  // 🔁 Duplicate aggressively for seamless loop
  const loopItems =
    items.length < 8
      ? [...items, ...items, ...items]
      : items;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-0 pb-5 relative">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Recently Viewed
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Continue browsing where you left off
          </p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("recent_viewed");
            setItems([]);
          }}
          className="text-xs text-gray-400 hover:text-red-500 transition"
        >
          Clear
        </button>
      </div>

      {/* 🔁 INFINITE LOOP CAROUSEL */}
      <Swiper
        modules={[Navigation, Autoplay]}
        loop
        slidesPerView="auto"
        spaceBetween={16}
        speed={12000}                 // ⏩ smooth speed
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,   // 🛑 pause on hover
        }}
        allowTouchMove={true}        // keep swipe on mobile
        loopAdditionalSlides={10}
        navigation={{
          nextEl: ".recent-next",
          prevEl: ".recent-prev",
        }}
        className="pb-4"
      >
        {loopItems.map((p, i) => (
          <SwiperSlide
            key={`${p._id}-${i}`}
            className="!w-[160px] sm:!w-[190px]"
          >
            <Link
              to={`/product/${p._id}`}
              className="group block bg-white rounded-2xl 
              border border-gray-100 shadow-sm 
              hover:shadow-md transition overflow-hidden"
            >
              {/* IMAGE */}
              <div className="h-32 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover 
                  group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* CONTENT */}
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 truncate">
                  {p.title}
                </h3>

                <p className="text-orange-600 font-semibold mt-1 text-sm">
                  ₹{p.price}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* FADE EDGES (UX POLISH) */}
      <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white" />
      <div className="pointer-events-none absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-white" />

      {/* NAVIGATION (DESKTOP) */}
      <button
        className="recent-prev hidden md:flex absolute left-2 top-1/2 
        -translate-y-1/2 w-9 h-9 rounded-full bg-white 
        shadow-md items-center justify-center text-gray-600 
        hover:bg-gray-100 z-10"
      >
        <FaArrowLeft size={14} />
      </button>

      <button
        className="recent-next hidden md:flex absolute right-2 top-1/2 
        -translate-y-1/2 w-9 h-9 rounded-full bg-white 
        shadow-md items-center justify-center text-gray-600 
        hover:bg-gray-100 z-10"
      >
        <FaArrowRight size={14} />
      </button>
    </section>
  );
};

export default RecentlyViewed;
