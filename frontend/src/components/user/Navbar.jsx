import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiHome,
  FiBox,
  FiClipboard,
} from "react-icons/fi";

import useCartCount from "../../hooks/useCartCount";
import { getPublicSettings } from "../../api/settings.api";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [logo, setLogo] = useState(null);
  const cartCount = useCartCount();
  const location = useLocation(); //  Detect current route

  // Function to check active tab
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await getPublicSettings();
        const logoUrl = res.data.settings?.logo?.[0]?.url;
        console.log("Loaded Logo URL:", res.data);
        setLogo(logoUrl);
      } catch (err) {
        console.log("Settings Load Error:", err);
      }
    };

    loadSettings();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-semibold text-gray-900">
          <img src={logo} alt="Hunger Bites Logo" className="h-10" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">

          <Link
            to="/"
            className={`pb-1 hover:text-orange-700 ${
              isActive("/") ? "border-b-2 border-orange-600 text-orange-700" : ""
            }`}
          >
            Home
          </Link>

          <Link
            to="/products"
            className={`pb-1 hover:text-orange-700 ${
              isActive("/products")
                ? "border-b-2 border-orange-600 text-orange-700"
                : ""
            }`}
          >
            Products
          </Link>

          <Link
            to="/orders"
            className={`pb-1 hover:text-orange-700 ${
              isActive("/orders")
                ? "border-b-2 border-orange-600 text-orange-700"
                : ""
            }`}
          >
            Orders
          </Link>

          <Link
            to="/about"
            className={`pb-1 hover:text-orange-700 ${
              isActive("/about")
                ? "border-b-2 border-orange-600 text-orange-700"
                : ""
            }`}
          >
            About Us
          </Link>
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/cart" className="relative">
            <FiShoppingCart size={22} className="hover:text-orange-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/profile">
            <FiUser size={22} className="hover:text-orange-700" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      
{open && (
  <div className="md:hidden bg-white shadow-xl rounded-b-3xl p-6 space-y-6 text-gray-800 font-medium animate-slideDown">

    <Link
      to="/"
      onClick={() => setOpen(false)}
      className={`flex items-center gap-3 text-lg ${
        isActive("/") ? "text-orange-600 font-semibold" : "text-gray-700"
      }`}
    >
      <FiHome size={20} />
      Home
    </Link>

    <Link
      to="/products"
      onClick={() => setOpen(false)}
      className={`flex items-center gap-3 text-lg ${
        isActive("/products") ? "text-orange-600 font-semibold" : "text-gray-700"
      }`}
    >
      <FiBox size={20} />
      Products
    </Link>

    <Link
      to="/orders"
      onClick={() => setOpen(false)}
      className={`flex items-center gap-3 text-lg ${
        isActive("/orders") ? "text-orange-600 font-semibold" : "text-gray-700"
      }`}
    >
      <FiClipboard size={20} />
      Orders
    </Link>

    <Link
      to="/profile"
      onClick={() => setOpen(false)}
      className={`flex items-center gap-3 text-lg ${
        isActive("/profile") ? "text-orange-600 font-semibold" : "text-gray-700"
      }`}
    >
      <FiUser size={20} />
      Profile
    </Link>

    <Link
      to="/cart"
      onClick={() => setOpen(false)}
      className={`flex items-center justify-between text-lg ${
        isActive("/cart") ? "text-orange-600 font-semibold" : "text-gray-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <FiShoppingCart size={20} />
        Cart
      </div>

      {cartCount > 0 && (
        <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">
          {cartCount}
        </span>
      )}
    </Link>

  </div>
)}


    </nav>
  );
};

export default Navbar;