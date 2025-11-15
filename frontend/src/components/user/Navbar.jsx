import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiShoppingCart, FiUser } from "react-icons/fi";
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
            to="/profile"
            className={`pb-1 hover:text-orange-700 ${
              isActive("/profile")
                ? "border-b-2 border-orange-600 text-orange-700"
                : ""
            }`}
          >
            Profile
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

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg p-6 space-y-4 text-gray-700 font-medium">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className={isActive("/") ? "text-orange-700 font-semibold" : ""}
          >
            Home
          </Link>
          <br />

          <Link
            to="/products"
            onClick={() => setOpen(false)}
            className={isActive("/products") ? "text-orange-700 font-semibold" : ""}
          >
            Products
          </Link>
          <br />

          <Link
            to="/orders"
            onClick={() => setOpen(false)}
            className={isActive("/orders") ? "text-orange-700 font-semibold" : ""}
          >
            Orders
          </Link>
          <br />

          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className={isActive("/profile") ? "text-orange-700 font-semibold" : ""}
          >
            Profile
          </Link>
          <br />

          {/* Mobile Cart */}
          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2 ${
              isActive("/cart") ? "text-orange-700 font-semibold" : ""
            }`}
          >
            Cart{" "}
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
