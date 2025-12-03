import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import FeaturedProducts from "../../components/user/FeaturedProducts";
import BestSellers from "../../components/user/BestSellers";
import LimitedDeals from "../../components/user/LimitedDeals";
import RecentlyViewed from "../../components/user/RecentlyViewed";
import ShopByFlavor from "../../components/user/ShopByFlavor";
import CategorySection from "../../components/user/CategorySection"
import WaveSection from "../../components/user/WaveSection";
import CustomerReviews from "../../components/user/CustomerReviews";

const Home = () => {
  const banners = [
    {
      id: 1,
      image: "https://ik.imagekit.io/izqq5ffwt/Programming%20With%20(2).png",
      title: "Fresh & Healthy Snacks",
      subtitle: "Delivered at your doorstep – Taste the freshness!",
    },
    {
      id: 2,
      image: "https://ik.imagekit.io/izqq5ffwt/Programming%20With%20(2).png",
      title: "Premium Special Snacks",
      subtitle: "Crunchy, tasty & 100% natural.",
    },
    {
      id: 3,
      image: "https://ik.imagekit.io/izqq5ffwt/Programming%20With%20(1).png",
      title: "Makhana Specials",
      subtitle: "Healthy & delicious flavors for everyone.",
    },
  ];

  

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO CAROUSEL */}
      <div className="w-full">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 2800, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-[420px] md:h-[520px]"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div
                className="relative w-full h-full bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                <div className="absolute inset-0 bg-black/35"></div>

                <div className="relative text-center text-white max-w-3xl px-8">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
                    {banner.title}
                  </h1>
                  <p className="mt-4 text-base md:text-xl opacity-95 font-light">
                    {banner.subtitle}
                  </p>

                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 mt-8 bg-orange-600 hover:bg-orange-700 px-10 py-4 rounded-2xl font-semibold transition shadow-lg hover:scale-[1.03]"
                  >
                    Shop Now →
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      

      {/* PRODUCT SECTIONS */}
      <div className="space-y-24 pb-20">
        <FeaturedProducts />
        <WaveSection/>
        <CategorySection/>
        <BestSellers />
        <RecentlyViewed />
        <ShopByFlavor />
        <CustomerReviews/>
      </div>

    </div>
  );
};

export default Home;
