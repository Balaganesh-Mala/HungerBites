import { FaChevronDown } from "react-icons/fa";
import video from "../../assets/video/heroVideo.mp4";

export default function HeroVideoPlayer() {
  return (
    <section className="relative w-full overflow-hidden h-[90vh]">

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-85"
        src={video}
      />

      {/* Soft Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none"></div>

      {/* Optional Noise Texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>

      {/* Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] pointer-events-none"></div>

      {/* ↓ Down Arrow Icon */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <FaChevronDown
          className="text-white text-3xl opacity-80 animate-bounce cursor-pointer transition hover:opacity-100"
          onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" })}
        />
      </div>

    </section>
  );
}
