import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const dummyReviews = [
  {
    name: "Sanjay Kumar",
    rating: 5,
    comment:
      "Perfect snacking partner! Light, crunchy and full of flavour — guilt free munching finally has a name!",
  },
  {
    name: "Meera Choudhary",
    rating: 4,
    comment:
      "Loved the roasted makhana—fresh, premium and not oily at all. My kids enjoy it too!",
  },
  {
    name: "Meera Choudhary",
    rating: 4,
    comment:
      "Loved the roasted makhana—fresh, premium and not oily at all. My kids enjoy it too!",
  },
  {
    name: "Meera Choudhary",
    rating: 4,
    comment:
      "Loved the roasted makhana—fresh, premium and not oily at all. My kids enjoy it too!",
  },
  {
    name: "Harshitha Reddy",
    rating: 5,
    comment:
      "Authentic taste! Reminded me of homemade South Indian flavours. Definitely ordering again ❤️",
  },
  {
    name: "Vikas Patel",
    rating: 5,
    comment:
      "Healthy + tasty is hard to find. Hunger Bites nailed it. Also love that it’s roasted, not fried!",
  },
  {
    name: "Neha Sharma",
    rating: 4,
    comment:
      "Great for office snack cravings — keeps me full without feeling heavy. Loved it!.",
  },
  {
    name: "Amit Verma",
    rating: 5,
    comment:
      "Super crunchy, premium packaging, clean ingredients — truly worth every rupee!",
  },
  {
    name: "Fatima Noor",
    rating: 5,
    comment:
      "My go-to binge snack now 😍 low calories but full of taste — finally a smart snack!",
  },
  {
    name: "David Joseph",
    rating: 4,
    comment:
      "The roasted makhana flavours are unique. Garlic flavour is a must-try!",
  },
  {
    name: "Trisha Sen",
    rating: 5,
    comment:
      "Loved the brand purpose — donating 1% for education ❤️ Proud to support this!",
  },
  {
    name: "Aditya Narayan",
    rating: 5,
    comment:
      "Premium quality snacks. Olive oil roasting makes a real difference — feels clean and light.",
  },
];

const ReviewCard = ({ rev }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-[200px] flex flex-col">
    {/* PROFILE */}
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-semibold text-orange-600">
        {rev.name.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm">{rev.name}</p>
        <p className="text-[10px] text-gray-400">Verified Buyer</p>
      </div>
    </div>

    {/* STARS */}
    <div className="flex gap-1 mb-2">
      {Array(rev.rating)
        .fill("⭐")
        .map((_, i) => (
          <span key={i} className="text-yellow-500 text-sm">
            ⭐
          </span>
        ))}
    </div>

    {/* COMMENT */}
    <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
      {rev.comment}
    </p>
  </div>
);

const CustomerReviews = () => {
  // Duplicate for seamless looping
  const reviews = [...dummyReviews, ...dummyReviews];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-6 py-0 overflow-hidden"
    >
      {/* HEADER */}
      <div className="text-center mb-16 relative">
        {/* Decorative blur */}
        <div className="absolute inset-0 flex justify-center -z-10">
          <div className="w-40 h-40 bg-orange-200/40 blur-3xl rounded-full"></div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          What Customers Are Saying
          <span className="text-orange-600"> 💬</span>
        </h2>

        <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
          Thousands of snack lovers trust Hunger Bites for clean ingredients,
          bold flavours, and guilt-free munching.
        </p>

        {/* Trust Row */}
        <div className="mt-6 flex justify-center items-center gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1 text-yellow-500">
            ⭐⭐⭐⭐⭐
          </span>
          <span>4.9/5 average rating</span>
          <span className="hidden sm:block">•</span>
          <span className="hidden sm:block">Verified Buyers</span>
        </div>
      </div>

      {/* ROW 1 — LEFT → RIGHT */}
      <Swiper
        modules={[Autoplay]}
        loop
        loopAdditionalSlides={10}
        watchSlidesProgress
        slidesPerView="auto"
        spaceBetween={20}
        speed={8000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        allowTouchMove={false}
        className="mb-8"
      >
        {[...reviews, ...reviews, ...reviews].map((rev, i) => (
          <SwiperSlide key={`row1-${i}`} className="!w-[280px] sm:!w-[320px]">
            <ReviewCard rev={rev} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ROW 2 — RIGHT → LEFT */}
      <Swiper
        modules={[Autoplay]}
        loop
        loopAdditionalSlides={10}
        watchSlidesProgress
        slidesPerView="auto"
        spaceBetween={20}
        speed={9000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: true,
          pauseOnMouseEnter: true,
        }}
        allowTouchMove={false}
      >
        {[...reviews, ...reviews, ...reviews].map((rev, i) => (
          <SwiperSlide key={`row2-${i}`} className="!w-[280px] sm:!w-[320px]">
            <ReviewCard rev={rev} />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
};

export default CustomerReviews;
