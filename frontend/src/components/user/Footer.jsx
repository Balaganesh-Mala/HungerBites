import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div
          className="
            grid 
            md:grid-cols-4 
            gap-10 
            text-gray-700 
            text-center md:text-left  
            items-center md:items-start
          "
        >

          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold text-orange-600">
              Hunger Bites
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Your Perfect Snacking Partner — crafting healthy, flavourful snacks
              inspired by authentic South Indian taste.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <Link to="/"><li>Home</li></Link>
              <Link to="/products"><li>Products</li></Link>
              <Link to="/orders"><li>My Orders</li></Link>
              <Link to="/about"><li>About Us</li></Link>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <Link to="/contact"><li>Contact Us</li></Link>
              <Link to="/contact"><li>FAQ</li></Link>
              <Link to="/privacy-policy"><li>Privacy Policy</li></Link>
              <Link to="/privacy-policy"><li>Refund Policy</li></Link>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3">Connect With Us</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <a href="https://www.instagram.com/hungerbites.store" target="_blank" rel="noopener noreferrer"><li>Instagram</li></a>
              <a href="https://www.facebook.com/hungerbites" target="_blank" rel="noopener noreferrer"><li>Facebook</li></a>
              <a href="https://www.linkedin.com/company/hunger-bites" target="_blank" rel="noopener noreferrer"><li>LinkedIn</li></a>
            </ul>
              

            {/* Certifications */}
            <p className="text-xs text-gray-500 mt-4 leading-snug">
              FSSAI: 13625999000792 <br />
              FDA (USA): 10800689560 <br />
              APEDA: RCMC/APEDA/18905/2025-2026
            </p>
          </div>
        </div>

        {/* Bottom Note */}
        <p className="text-center text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} Hunger Bites — 
          Inspiring smarter, healthier snacking. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
