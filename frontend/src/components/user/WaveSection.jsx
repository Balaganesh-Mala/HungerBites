import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef, useState } from "react";

import planet1 from "../../assets/images/image1.png";
import planet2 from "../../assets/images/image2.png";

import rocket1 from "../../assets/images/rocket1.png";
import rocket2 from "../../assets/images/rocket2.png";
import rocket3 from "../../assets/images/rocket3.png";

import stars from "../../assets/images/stars.png";
import particles from "../../assets/images/particles.png";

const WaveSection = () => {
  const ref = useRef(null);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1 0"],
  });

  const rocketY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const rocketRotate = useTransform(scrollYProgress, [0, 1], [0, -25]);

  const planetY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // 3D Tilt States (initialized for smooth reset)
  const [tiltLeft, setTiltLeft] = useState({
    transform: "rotateX(0deg) rotateY(0deg) scale(1)",
  });
  const [tiltRight, setTiltRight] = useState({
    transform: "rotateX(0deg) rotateY(0deg) scale(1)",
  });

  const handleTilt = (e, setTilt) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = -(y / 18);
    const rotateY = x / 18;

    setTilt({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
      transition: "0.1s ease-out",
    });
  };

  const resetTilt = (setTilt) => {
    setTilt({
      transform: "rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "0.4s cubic-bezier(0.22, 1, 0.36, 1)",
    });
  };

  return (
    <section ref={ref} className="relative w-full bg-black py-20 overflow-hidden">

      {/* STARS BACKGROUND */}
      <div
        className="absolute inset-0 z-0 animate-[starsAnim_8s_linear_infinite] will-change-opacity"
        style={{
          backgroundImage: `url(${stars})`,
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      ></div>

      {/* PARTICLES BACKGROUND */}
      <div
        className="absolute inset-0 z-0 animate-[particlesAnim_18s_linear_infinite] will-change-transform"
        style={{
          backgroundImage: `url(${particles})`,
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
          opacity: 0.4,
          pointerEvents: "none",
        }}
      ></div>

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-700 to-pink-500 opacity-60"></div>

      {/* TITLE */}
      <div className="relative z-10 text-center mb-10">
        <h2 className="text-white text-4xl font-bold drop-shadow-xl">
          🚀 Launching you into flavour space.
        </h2>
      </div>

      {/* MAIN GRID */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 px-6 md:px-10">

        {/* LEFT PLANET CARD */}
        <motion.div
          style={{ y: planetY, perspective: "1000px" }}
          className="relative border border-lime-400 rounded-2xl p-5 cursor-pointer transform-gpu will-change-transform shadow-lg"
          onMouseMove={(e) => handleTilt(e, setTiltLeft)}
          onMouseLeave={() => resetTilt(setTiltLeft)}
        >
          <motion.img
            style={tiltLeft}
            src={planet1}
            alt=""
            className="w-full rounded-2xl transform-gpu will-change-transform"
          />

          {/* ROCKETS */}
          <motion.img
            style={{ y: rocketY, rotate: rocketRotate }}
            src={rocket1}
            alt=""
            className="absolute -top-2 right-[50px] w-14 md:w-16 rotate-[-15deg]"
          />

          <motion.img
            style={{ y: rocketY, rotate: rocketRotate }}
            src={rocket3}
            alt=""
            className="absolute top-32 -left-2 w-24 md:w-28 rotate-[-10deg]"
          />

          <motion.img
            style={{ y: rocketY, rotate: rocketRotate }}
            src={rocket2}
            alt=""
            className="absolute -bottom-12 right-12 w-24 md:w-28 rotate-[30deg]"
          />
        </motion.div>

        {/* RIGHT PLANET CARD */}
        <motion.div
          style={{ y: planetY, perspective: "1000px" }}
          className="relative border border-lime-400 rounded-2xl p-5 cursor-pointer transform-gpu will-change-transform shadow-lg"
          onMouseMove={(e) => handleTilt(e, setTiltRight)}
          onMouseLeave={() => resetTilt(setTiltRight)}
        >
          <motion.img
            style={tiltRight}
            src={planet2}
            alt=""
            className="w-full rounded-2xl transform-gpu will-change-transform"
          />

          {/* ROCKETS */}
          <motion.img
            style={{ y: rocketY, rotate: rocketRotate }}
            src={rocket2}
            alt=""
            className="absolute -top-6 left-0 w-[70px] md:w-[90px] rotate-[20deg]"
          />

          <motion.img
            style={{ y: rocketY, rotate: rocketRotate }}
            src={rocket3}
            alt=""
            className="absolute bottom-6 right-10 w-20 md:w-24 rotate-[35deg]"
          />

          <motion.img
            style={{ y: rocketY, rotate: rocketRotate }}
            src={rocket1}
            alt=""
            className="absolute bottom-14 left-3 w-20 md:w-24 rotate-[-10deg]"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default WaveSection;
