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
import SearchFilter from "../../components/user/SearchFilter";

const Home = () => {
  const banners = [
    {
      id: 1,
      image:
        "https://ik.imagekit.io/izqq5ffwt/Programming%20With%20(2).png",
      title: "Fresh & Healthy Snacks",
      subtitle: "Delivered at your doorstep – Taste the freshness!",
    },
    {
      id: 2,
      image:
        "https://ik.imagekit.io/izqq5ffwt/Programming%20With%20(2).png",
      title: "Premium Special Snacks",
      subtitle: "Crunchy, tasty & 100% natural.",
    },
    {
      id: 3,
      image:
        "https://ik.imagekit.io/izqq5ffwt/Programming%20With%20(1).png",
      title: "Makhana Specials",
      subtitle: "Healthy & delicious flavors for everyone.",
    },
  ];

  const categories = [
    {
      id: 1,
      name: "Snacks",
      image: "https://ik.imagekit.io/izqq5ffwt/_Pngtree_fast%20food%20snack%20french%20fries_5743721(1).png",
    },
    {
      id: 2,
      name: "Dry Fruits",
      image: "https://ik.imagekit.io/izqq5ffwt/_Pngtree_dry%20fruit%20ultra%20realistic_18153259.png",
    },
    {
      id: 3,
      name: "Makhana",
      image: "https://ik.imagekit.io/izqq5ffwt/_Pngtree_lotus%20seed%20png%20transparent%20layer_7236958.png",
    },
    {
      id: 4,
      name: "Healthy Mixes",
      image: "https://ik.imagekit.io/izqq5ffwt/_Pngtree_assorted%20nuts%20in%20wooden%20bowl_23159591.png",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* 🔥 HERO CAROUSEL */}
      <div className="w-full">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-[400px] md:h-[500px]"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div
                className="relative w-full h-full bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative text-center text-white px-6">
                  <h1 className="text-3xl md:text-5xl font-bold">
                    {banner.title}
                  </h1>
                  <p className="mt-3 text-lg md:text-xl opacity-90">
                    {banner.subtitle}
                  </p>

                  <Link
                    to="/products"
                    className="inline-block mt-6 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg transition font-medium"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
          
      {/* 🟧 CATEGORIES SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Shop by Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link to={`/products?category=${cat.name}`} key={cat.id}>
            <div
              key={cat.id}
              className="p-6 bg-white shadow rounded-xl text-center hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-16 h-16 mx-auto mb-3"
              />
              <p className="font-medium text-gray-800">{cat.name}</p>
            </div>
            </Link>
          ))}
        </div>
      </section>
      <FeaturedProducts />
      <BestSellers />
      <LimitedDeals />
      <RecentlyViewed />
      <ShopByFlavor />
    </div>
  );
};

export default Home;
