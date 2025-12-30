# 🍿 Hunger Bites – Full Stack Snack E-Commerce Platform

**Hunger Bites** is a modern, scalable **snack e-commerce platform** built with the **MERN stack**, supporting **COD & Online Payments**, **Coupons**, **Shiprocket shipping**, and a powerful **Admin Dashboard**.

---

## 🌍 Live Applications

| Application     | URL                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------- |
| 🛒 User Website | [https://hungerbites.store](https://hungerbites.store)                                             |
| 🛠️ Admin Panel | [https://admin.hungerbites.store/admin/dashboard](https://admin.hungerbites.store/admin/dashboard) |
| ⚙️ Backend API  | `/api/*`                                                                                           |

---

## 🧱 Tech Stack (Overall)

### Frontend (User + Admin)

* React (Vite)
* React Router DOM
* Tailwind CSS
* Framer Motion
* Axios
* Context API
* Swiper.js

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Razorpay (Payments)
* Shiprocket (Shipping)
* Cloudinary (Images)
* Multer + Sharp
* Cron Jobs (optional)

---

# 🛒 USER FRONTEND

## ✨ Features

* Product listing & search
* Category-based filtering
* Product details page
* Cart & Checkout
* Coupon application
* COD & Online payment (Razorpay)
* Order tracking
* User profile & orders
* Blog & CMS pages
* Responsive & mobile-first UI

---

## 🔗 User Routes

```txt
/                     → Home
/products             → Product Listing
/product/:id          → Product Details
/cart                 → Cart
/checkout             → Checkout
/orders               → My Orders
/profile              → User Profile
/register              → Register
/login                 → Login
/forgot-password       → Forgot Password
/about                 → About Us
/contact               → Contact Us
/privacy-policy        → Policy
```

---

## ⚙️ User Frontend Setup

```bash
npm install
npm run dev
```

### Environment Variables

```env
VITE_API_BASE_URL=https://your-backend-domain/api
VITE_RAZORPAY_KEY_ID=your_key
```

---

# 🛠️ ADMIN PANEL

## 🔐 Admin Capabilities

* Secure admin login
* Dashboard analytics
* Product CRUD
* Category management
* Order management
* Coupon creation
* Hero banner management
* Blog manager
* Contact messages
* Payment tracking
* Shiprocket shipment handling

---

## 🧭 Admin Routes

```txt
/admin/login
/admin/dashboard
/admin/products
/admin/orders
/admin/orders/:id
/admin/users
/admin/payments
/admin/categories
/admin/hero
/admin/coupons
/admin/blogs
/admin/messages
/admin/settings
```

---

## ⚙️ Admin Setup

```bash
npm install
npm run dev
```

### Environment

```env
VITE_API_BASE_URL=https://your-backend-domain/api
```

---

# ⚙️ BACKEND API

## 🚀 Core Features

* JWT authentication (User + Admin)
* Product & category APIs
* Cart & order management
* Coupon validation
* Razorpay payment flow
* Shiprocket shipment creation
* Webhook & tracking sync
* Blog & CMS APIs
* Error-handled, secure REST APIs

---

## 📁 Backend Routes

```txt
/api/auth
/api/admin
/api/products
/api/categories
/api/cart
/api/orders
/api/payment
/api/coupons
/api/hero
/api/blogs
/api/contact
/api/settings
/api/shiprocket
```

---

## 🧾 Payment Flow

### COD

1. Validate products
2. Apply coupon
3. Create order
4. Reduce stock

### Online (Razorpay)

1. Initiate payment
2. Create Razorpay order
3. Verify signature
4. Re-apply coupon on backend
5. Create order
6. Reduce stock
7. Clear cart

---

## 🚚 Shipping (Shiprocket)

* Automatic shipment creation after order
* Courier assignment
* Tracking ID stored in order
* Shipment status synced via webhook or cron

---

## ⚙️ Backend Setup

```bash
npm install
npm run dev
```

### Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

# Razorpay
RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret

# Shiprocket
SHIPROCKET_BASE_URL=https://apiv2.shiprocket.in/v1/external
SHIPROCKET_EMAIL=your_email
SHIPROCKET_PASSWORD=your_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

## 📦 Order → Shipping Flow

```txt
Order Created
   ↓
Create Shiprocket Order
   ↓
Get shipmentId & trackingId
   ↓
Update order status
   ↓
Track shipment
```

---

## 🔐 Security Highlights

* Backend price validation
* Coupon re-validation server-side
* Admin role checks
* Token-based auth
* Secure payment verification
* Stock consistency via transactions

---

## 🧑‍💻 Developer

**Bala Ganesh**
Full Stack MERN Developer

---

## 📄 License

This project is proprietary software developed for **Hunger Bites**.
Unauthorized copying or redistribution is prohibited.

* Customer reviews from orders

