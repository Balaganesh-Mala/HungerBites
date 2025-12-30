# 🍿 Hunger Bites – Snack E-Commerce (Frontend)

Live Website: **[https://hungerbites.store/](https://hungerbites.store/)**

Hunger Bites is a modern, mobile-first snack e-commerce platform built with **React**.
This repository contains the **user-facing frontend** of the application, including product browsing, cart, checkout, orders, payments, and customer experience features.

---

## 🚀 Tech Stack

* **React (Vite)**
* **React Router DOM**
* **Axios**
* **Tailwind CSS**
* **Framer Motion**
* **Swiper.js**
* **Razorpay Checkout**
* **JWT Authentication**
* **Responsive UI (Mobile-First)**

---

## 📦 Features

### 🛍️ User Features

* Browse products by category
* Featured & Best Seller sections
* Product details with images
* Add to cart / Remove from cart
* Recently viewed products
* Coupon application
* Cart announcements (free shipping / offers)
* Checkout (COD & Online Payment)
* Razorpay integration
* Order history
* Shipment tracking (Shiprocket)
* Profile management
* Mobile-optimized UI

### 🎨 UI / UX

* Smooth animations (Framer Motion)
* Carousel sliders (Swiper)
* Modern Tailwind design
* Sticky & conversion-focused layout
* Skeleton loaders & graceful fallbacks

---

## 🌐 Live URLs

| Service     | URL                                                      |
| ----------- | -------------------------------------------------------- |
| Frontend    | [https://hungerbites.store/](https://hungerbites.store/) |
| Backend API | `/api/*` (connected internally)                          |

---

## 📁 Project Structure

```
src/
│
├── api/                 # Axios API services
├── assets/              # Images & static files
├── components/
│   ├── user/            # User UI components
│   └── ui/              # Reusable UI elements
│
├── layouts/
│   └── UserLayout.jsx   # Main user layout
│
├── pages/
│   └── user/
│       ├── Home.jsx
│       ├── Products.jsx
│       ├── ProductDetails.jsx
│       ├── Cart.jsx
│       ├── Checkout.jsx
│       ├── Orders.jsx
│       ├── Profile.jsx
│       ├── Login.jsx
│       ├── RegisterPhone.jsx
│       ├── ForgotPasswordPhone.jsx
│       ├── AboutUs.jsx
│       ├── ContactUs.jsx
│       ├── Policy.jsx
│       └── NotFound.jsx
│
├── routes/
│   └── UserRoutes.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🧭 Application Routes

```txt
/                   → Home
/products           → Product Listing
/product/:id        → Product Details
/cart               → Cart
/checkout           → Checkout
/orders             → My Orders
/profile            → User Profile
/login              → Login
/register           → Phone Registration
/forgot-password    → Password Recovery
/about              → About Us
/contact            → Contact Us
/privacy-policy     → Privacy Policy
```

---

## 🔑 Authentication

* JWT-based authentication
* Token stored in `localStorage`
* Protected routes handled at layout level
* Auto redirect to login on token expiry

---

## 💳 Payments

* **Razorpay** integration
* Online & COD supported
* Secure server-side price validation
* Payment verification handled on backend

---

## 🚚 Shipping & Tracking

* Shiprocket integrated on backend
* Users can:

  * View shipment status
  * Track orders using tracking ID
  * Open Shiprocket tracking page

---

## ⚙️ Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=https://your-backend-domain/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

> ⚠️ Never expose secrets like Razorpay **secret key** in frontend.

---

## ▶️ Run Locally

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

App will run on:

```
http://localhost:5173
```

---

## 🏗️ Build for Production

```bash
npm run build
```

Deploy the `dist/` folder to:

* Netlify
* Vercel
* Cloudflare Pages
* VPS / cPanel

---

## 🔒 Security Practices

* Prices validated on backend
* Coupons re-validated server-side
* Auth protected routes
* No sensitive keys in frontend
* HTTPS enforced in production

---

## 📈 Performance & SEO

* Lazy loading where applicable
* Optimized images
* Mobile-first responsive design
* SEO-friendly routes
* Fast Lighthouse scores

---

## 🛠️ Backend Repository

This frontend connects to a **Node.js + Express + MongoDB** backend that handles:

* Authentication
* Orders
* Payments
* Coupons
* Shiprocket shipping
* Admin panel

---

## 👨‍💻 Developer

**Bala Ganesh**
Full Stack Developer (MERN)

🌐 Portfolio: *(optional)*
📧 Contact: *(optional)*

---

## 📄 License

This project is proprietary and developed for **Hunger Bites**.
Unauthorized copying or redistribution is prohibited.

