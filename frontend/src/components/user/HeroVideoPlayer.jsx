import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getHeroSlides } from "../../api/index";

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load hero slides
  useEffect(() => {
    const loadHeroSlides = async () => {
      try {
        const res = await getHeroSlides();
        setSlides(res.data.slides || []);
      } catch (err) {
        console.error("Hero API error", err);
      }
    };

    loadHeroSlides();
  }, []);

  // Auto slide
  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // 🟡 Guard
  if (!slides.length) {
    return (
      <section className="w-full h-[50vh] bg-gray-200 animate-pulse" />
    );
  }

  const activeSlide = slides[currentSlide];

  return (
    <section className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden">

      {/* ================= BACKGROUND IMAGE ================= */}
      <AnimatePresence>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${activeSlide.image?.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50" />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">

        <motion.h1
          key={activeSlide.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-6xl font-extrabold text-white drop-shadow-xl"
        >
          {activeSlide.title}
        </motion.h1>

        <motion.p
          key={activeSlide.subtitle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 max-w-2xl text-base md:text-xl text-gray-200"
        >
          {activeSlide.subtitle}
        </motion.p>

        {activeSlide.buttonText && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-8 py-3 rounded-lg bg-orange-600 text-white font-semibold shadow-lg hover:bg-orange-700"
          >
            {activeSlide.buttonText}
          </motion.button>
        )}
      </div>

      {/* ================= DOTS ================= */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition
              ${currentSlide === i ? "bg-white" : "bg-white/40"}
            `}
          />
        ))}
      </div>
    </section>
  );
}
