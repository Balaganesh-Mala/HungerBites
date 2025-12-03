import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ShopByFlavor = () => {
  const [flavors, setFlavors] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const loadFlavors = async () => {
    try {
      const res = await api.get("/products");
      const allProducts = res.data.products || [];
      const uniqueFlavors = Array.from(
        new Set(allProducts.map((item) => item.flavor).filter(Boolean))
      );
      setFlavors(uniqueFlavors);
    } catch (err) {
      console.error("Flavor fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlavors();
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.swiper?.slideNext();
    }
  };

  if (loading) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Shop by Flavor</h2>
      </div>

      {/* ✅ SWIPER CAROUSEL */}
      <Swiper
  modules={[Pagination, Autoplay]}
  loop={true}
  pagination={{ clickable: true }}
  autoplay={{ delay: 2500, disableOnInteraction: false }}
  breakpoints={{
    0: { slidesPerView: 2, spaceBetween: 12 },
    640: { slidesPerView: 4, spaceBetween: 16 },
    1024: { slidesPerView: 6, spaceBetween: 20 }, // ✅ 6 cards in desktop
  }}
  className="mySwiper"
>

        {flavors.map((flavor) => (
          <SwiperSlide key={flavor}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex justify-center"
            >
              <Link
                to={`/products?flavor=${flavor}`}
                className="bg-white shadow rounded-xl p-5 flex flex-col items-center transition w-[150px]"
              >
                <div className="w-14 h-14 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold mb-3">
                  {flavor[0]}
                </div>
                <p className="font-medium text-gray-800 text-center text-sm">
                  {flavor}
                </p>
              </Link>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ShopByFlavor;
