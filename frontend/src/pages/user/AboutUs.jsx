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
            About Hunger Bites
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            <strong>Hunger Bites</strong> was born from a simple idea – snacks
            should be{" "}
            <span className="font-semibold text-gray-800">
              tasty, clean and guilt-free
            </span>
            . We carefully craft every recipe with quality ingredients, balanced
            flavours and just the right crunch, so you can enjoy snacking
            anytime of the day.
          </p>

          <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-3">
            Whether it&apos;s binge-watching, office breaks, travel plans or
            late-night cravings, we&apos;re on a mission to make snacking{" "}
            <span className="font-semibold text-orange-600">
              healthier, happier and more fun
            </span>
            .
          </p>

          {/* Quick Links */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#"
              className="inline-flex items-center gap-1 bg-gray-900 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-black transition"
            >
              Visit Store <FiExternalLink size={14} />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1 border border-gray-700 px-4 py-2.5 rounded-full text-sm font-medium hover:bg-gray-100 transition"
            >
              Contact Us <FiExternalLink size={14} />
            </a>
            
          </div>
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
