import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";


const dummyReviews = [
  {
    name: "Sanjay Kumar",
    rating: 5,
    comment: "Perfect snacking partner! Light, crunchy and full of flavour — guilt free munching finally has a name!"
  },
  {
    name: "Meera Choudhary",
    rating: 4,
    comment: "Loved the roasted makhana—fresh, premium and not oily at all. My kids enjoy it too!"
  },
  {
    name: "Harshitha Reddy",
    rating: 5,
    comment: "Authentic taste! Reminded me of homemade South Indian flavours. Definitely ordering again ❤️"
  },
  {
    name: "Vikas Patel",
    rating: 5,
    comment: "Healthy + tasty is hard to find. Hunger Bites nailed it. Also love that it’s roasted, not fried!"
  },
  {
    name: "Neha Sharma",
    rating: 4,
    comment: "Great for office snack cravings — keeps me full without feeling heavy. Loved it!"
  },
  {
    name: "Amit Verma",
    rating: 5,
    comment: "Super crunchy, premium packaging, clean ingredients — truly worth every rupee!"
  },
  {
    name: "Fatima Noor",
    rating: 5,
    comment: "My go-to binge snack now 😍 low calories but full of taste — finally a smart snack!"
  },
  {
    name: "David Joseph",
    rating: 4,
    comment: "The roasted makhana flavours are unique. Garlic flavour is a must-try!"
  },
  {
    name: "Trisha Sen",
    rating: 5,
    comment: "Loved the brand purpose — donating 1% for education ❤️ Proud to support this!"
  },
  {
    name: "Aditya Narayan",
    rating: 5,
    comment: "Premium quality snacks. Olive oil roasting makes a real difference — feels clean and light."
  },
];


const CustomerReviews = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-6 py-16"
    >
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          What Our Customers Say 💛
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Heartfelt feedback from real snack lovers ✨
        </p>
      </div>

      {/* REVIEWS SWIPER */}
      <Swiper
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 2800, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        breakpoints={{
          0: { slidesPerView: 1.1, spaceBetween: 12 },
          640: { slidesPerView: 2.2, spaceBetween: 16 },
          1024: { slidesPerView: 3.2, spaceBetween: 24 },
        }}
      >
        {dummyReviews.map((rev, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col h-[200px] hover:shadow-md transition-shadow duration-300">
              {/* Profile */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-semibold text-orange-600 uppercase">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {rev.name}
                  </p>
                  <p className="text-[10px] text-gray-400">Verified Buyer</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-2">
                {Array(rev.rating)
                  .fill("⭐")
                  .map((star, i) => (
                    <span key={i} className="text-yellow-500 text-sm">
                      {star}
                    </span>
                  ))}
              </div>

              {/* Review Message */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                {rev.comment}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
};

export default CustomerReviews;
