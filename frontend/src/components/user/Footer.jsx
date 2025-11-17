import React from "react";
import{Link} from"react-router-dom";


const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-10">
  <div className="max-w-6xl mx-auto px-6 py-10">

    <div className="
      grid 
      md:grid-cols-4 
      gap-10 
      text-gray-700 
      text-center md:text-left  
      items-center md:items-start
    ">

      {/* Brand */}
      <div>
        <h3 className="text-lg font-semibold">HungerBites</h3>
        <p className="mt-2 text-sm text-gray-600">
          Fresh snacks delivered with love.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="font-semibold mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <Link to="/"><li>Home</li></Link>
          <Link to="/products"><li>Products</li></Link>
          <Link to="/orders"><li>Orders</li></Link>
          <Link to="/profile"><li>Profile</li></Link>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h4 className="font-semibold mb-3">Support</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>Contact</li>
          <li>FAQ</li>
          <li>Privacy Policy</li>
          <li>Refund Policy</li>
          <Link to="/admin/dashboard"><li>Admin Login</li></Link>
        </ul>
      </div>

      {/* Social */}
      <div>
        <h4 className="font-semibold mb-3">Follow Us</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>Instagram</li>
          <li>Twitter</li>
          <li>Facebook</li>
        </ul>
      </div>

    </div>

    <p className="text-center text-gray-500 text-sm mt-10">
      © {new Date().getFullYear()} HungerBites. All Rights Reserved.
    </p>

  </div>
</footer>

  );
};

export default Footer;
