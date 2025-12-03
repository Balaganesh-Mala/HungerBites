import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const dummyReviews = [
  { name: "John Doe", rating: 5, comment: "Amazing snacks, fresh and tasty!" },
  { name: "Priya Sharma", rating: 4, comment: "Loved the flavors, will buy again!" },
  { name: "Rahul Mehta", rating: 5, comment: "Healthy and delicious. Highly recommended." },
  { name: "Ananya Rao", rating: 3, comment: "Good taste but delivery was slow." },
  { name: "Michael Lee", rating: 4, comment: "Perfect evening snack options!" },
  { name: "Sara Khan", rating: 5, comment: "Absolutely yummy 😍 worth every penny!" },
];

const CustomerReviews = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="max-w-6xl mx-auto px-6 py-16"
    >
      {/* TITLE */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          What Our Customers Say 💬
        </h2>
        <p className="text-gray-500 text-sm mt-3">
          Experience shared by our happy snack lovers!
        </p>
      </div>

      {/* CAROUSEL */}
      <Swiper
        modules={[Pagination, Autoplay]}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1.4, spaceBetween: 12 },
          640: { slidesPerView: 2.2, spaceBetween: 16 },
          1024: { slidesPerView: 3, spaceBetween: 22 },
        }}
        className="mySwiper"
      >
        {dummyReviews.map((rev, i) => (
          <SwiperSlide key={i}>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mx-auto h-[160px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-900">{rev.name}</p>
                  <span className="text-yellow-500 text-sm">
                    {"⭐".repeat(rev.rating)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm leading-snug truncate max-w-full">
                  {rev.comment}
                </p>
              </div>

              {/* carousel footer */}
              <p className="text-gray-400 text-[10px] mt-3">Verified Purchase</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
};

export default CustomerReviews;
