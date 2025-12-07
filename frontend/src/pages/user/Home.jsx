import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import FeaturedProducts from "../../components/user/FeaturedProducts";
import HeroVideoPlayer from "../../components/user/HeroVideoPlayer";
import BestSellers from "../../components/user/BestSellers";
import LimitedDeals from "../../components/user/LimitedDeals";
import RecentlyViewed from "../../components/user/RecentlyViewed";
import ShopByFlavor from "../../components/user/ShopByFlavor";
import CategorySection from "../../components/user/CategorySection";
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
      <HeroVideoPlayer />
      {/* PRODUCT SECTIONS */}
      <div className="space-y-24 pb-20">
        <FeaturedProducts />
        <WaveSection />
        <CategorySection />
        <BestSellers />
        <RecentlyViewed />
        <CustomerReviews />
      </div>
    </div>
  );
};

export default Home;
