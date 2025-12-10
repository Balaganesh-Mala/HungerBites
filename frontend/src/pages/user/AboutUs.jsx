import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FiExternalLink } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import ProductCard from "../../components/user/ProductCard";
import { getBlogsApi } from "../../api/blog.api"; // ✅ API import

const AboutUs = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);

  const loadBlogs = async () => {
    try {
      const res = await getBlogsApi();
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Blog API Error:", err);
    } finally {
      setBlogLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* COMPANY INFO (No changes) */}
      <motion.section
  initial={{ opacity: 0, y: 25 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="max-w-6xl mx-auto px-6 py-14"
>
  <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 md:p-10">
    
    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
      ABOUT HUNGER BITES
    </h1>

    <h2 className="text-xl font-semibold text-orange-600 mb-3">
      Your Perfect Snacking Partner
    </h2>

    {/* STORY */}
    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
      Every brand has a beginning. Ours started with a simple question:
      <span className="font-semibold text-gray-900 block mt-2">
        “Why can’t healthy snacks taste as good as the junk food we all love?”
      </span>
    </p>

    <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-3">
      For <strong>Ms. Devaki Reddy</strong>, with over 20 years of experience in the food industry, 
      this question became a spark. She witnessed how tasty yet unhealthy snacks were 
      harming long-term health across ages.
    </p>

    <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-3">
      With deep passion and expertise, she envisioned a brand offering the goodness of health 
      with the joy of flavour — inspired by <strong>authentic South Indian recipes</strong> and 
      wholesome ingredients.
    </p>

    <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-3">
      In <strong>December 2025</strong>, under <strong>Jetway Exim Solutions</strong>, that vision came alive
      as <span className="font-semibold">Hunger Bites</span> — a brand created not just to feed hunger, 
      but to transform the way the world snacks.
    </p>

    {/* PURPOSE */}
    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">The Purpose Behind Hunger Bites</h3>

    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
      Growing up around homemade meals bursting with flavour, Devaki understood that 
      food is emotion — culture — comfort. But modern lifestyles pushed people toward
      convenience over health.
    </p>

    <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-3">
      Hunger Bites was built as a <strong>healthy alternative</strong> — crafted to be delicious,
      nourishing, trustworthy and fun.
    </p>

    {/* WHAT WE OFFER */}
    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">What We Offer</h3>

    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
      Premium snacks blending taste, nutrition, and authenticity.
    </p>

    <ul className="text-gray-600 text-sm md:text-base list-disc ml-6 mt-3 space-y-2">
      <li>Roasted Makhana</li>
      <li>Premium Dry Fruits</li>
    </ul>

    {/* USP */}
    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">Why Our Snacks Stand Out</h3>

    <ul className="text-gray-600 text-sm md:text-base list-disc ml-6 space-y-2">
      <li>Roasted in Olive Oil — never fried</li>
      <li>Zero Transfat & Zero Cholesterol</li>
      <li>Rich in Calcium & Protein</li>
      <li>Inspired by authentic South Indian flavours</li>
      <li>Crafted with a homemade touch</li>
    </ul>

    {/* LIFESTYLE */}
    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">Made for Every Lifestyle</h3>

    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
      Whether you’re at the gym, office, home or travelling — Hunger Bites fits seamlessly 
      into your day.
    </p>

    <ul className="text-gray-600 text-sm md:text-base list-disc ml-6 mt-3 space-y-2">
      <li>Gen Z & Young Adults</li>
      <li>Fitness Enthusiasts</li>
      <li>Professionals & Office-goers</li>
      <li>Kids & Families</li>
      <li>Movie & Travel Snacking</li>
    </ul>

    {/* MISSION & VISION */}
    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">Our Mission</h3>

    <p className="text-gray-600 text-sm md:text-base">
      To be <strong>Your Perfect Snacking Partner</strong> by offering flavour-rich, 
      trustworthy, wholesome snacks that satisfy cravings the healthy way.
    </p>

    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">Our Vision</h3>

    <p className="text-gray-600 text-sm md:text-base">
      Within 3–5 years, Hunger Bites aims to become a globally recognised South Indian snack brand,
      delivering premium, healthy products worldwide.
    </p>

    {/* CERTIFICATIONS */}
    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">Global Standards & Certifications</h3>

    <ul className="text-gray-600 text-sm md:text-base list-disc ml-6 space-y-2">
      <li>FSSAI: 13625999000792</li>
      <li>FDA (USA): 10800689560</li>
      <li>APEDA: RCMC/APEDA/18905/2025-2026</li>
    </ul>

    {/* SOCIAL IMPACT */}
    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-2">Our Social Commitment</h3>

    <p className="text-gray-600 text-sm md:text-base">
      <strong>1% of our revenue</strong> supports education of underprivileged children,  
      with transparent quarterly impact updates on Instagram.
    </p>

    {/* CLOSING */}
    <h3 className="text-xl font-bold text-gray-900 mt-8">
      Welcome to Hunger Bites.<br />
      <span className="text-orange-600">Your Perfect Snacking Partner.</span>
    </h3>

    
  </div>
</motion.section>


      {/* ⭐ BLOGS CAROUSEL WITH API DATA */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-6 pb-16"
      >
        <div className="mb-6 text-center md:text-left">
          {" "}
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {" "}
            From Our Snack Journal{" "}
          </h2>{" "}
          <p className="text-gray-500 text-sm mt-2">
            {" "}
            Stories, tips and ideas from the world of smart snacking.{" "}
          </p>{" "}
        </div>

        {blogLoading ? null : (
          <Swiper
            modules={[Pagination, Autoplay]}
            loop={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 2800, disableOnInteraction: false }}
            breakpoints={{
              0: { slidesPerView: 1.2, spaceBetween: 12 },
              640: { slidesPerView: 2.2, spaceBetween: 14 },
              1024: { slidesPerView: 3.3, spaceBetween: 18 },
            }}
            className="w-full"
          >
            {blogs.map((b) => (
              <SwiperSlide key={b._id}>
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden flex flex-col h-full w-full">
                  {/* IMAGE */}
                  <div className="h-[180px] bg-gray-200 overflow-hidden">
                    <img
                      src={b.image?.url}
                      alt={b.title}
                      className="w-full h-full object-cover hover:scale-110 transition duration-700"
                    />
                  </div>

                  {/* BLOG TEXT */}
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {b.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {b.description}
                    </p>

                    {/* READ MORE */}
                    <div className="mt-4">
                      <a
                        href={b.readMoreLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-orange-600 text-xs font-medium"
                      >
                        Read More{" "}
                        <FiExternalLink className="inline ml-1" size={12} />
                      </a>
                    </div>

                    {/* SOCIAL MEDIA */}
                    <div className="flex gap-2 mt-4">
                      {b.socialLinks?.facebook && (
                        <a
                          href={b.socialLinks.facebook}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-900 hover:text-white"
                        >
                          <FaFacebookF size={12} />
                        </a>
                      )}

                      {b.socialLinks?.instagram && (
                        <a
                          href={b.socialLinks.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-900 hover:text-white"
                        >
                          <FaInstagram size={12} />
                        </a>
                      )}

                      {b.socialLinks?.linkedin && (
                        <a
                          href={b.socialLinks.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-900 hover:text-white"
                        >
                          <FaLinkedinIn size={12} />
                        </a>
                      )}

                      {b.socialLinks?.twitter && (
                        <a
                          href={b.socialLinks.twitter}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 flex justify-center items-center rounded-full bg-gray-100 hover:bg-gray-900 hover:text-white"
                        >
                          <FaTwitter size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </motion.section>
    </div>
  );
};

export default AboutUs;
