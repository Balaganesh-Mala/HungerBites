import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";

import Home from "../pages/user/Home";
import Products from "../pages/user/Products";
import ProductDetails from "../pages/user/ProductDetails";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import Orders from "../pages/user/Orders";
import Profile from "../pages/user/Profile";
import Register from "../pages/user/Register";
import Login from "../pages/user/Login";
import AboutUs from "../pages/user/AboutUs";
import ContactUs from "../pages/user/ContactUs";
import NotFound from "../pages/user/NotFound";


const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default UserRoutes;
