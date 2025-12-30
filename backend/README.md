# 🍿 Hunger Bites – Snack E-Commerce Platform (Backend)

Hunger Bites is a **full-stack snack e-commerce platform** built to sell healthy, premium snacks with a modern shopping experience.
This repository contains the **backend API** that powers authentication, products, cart, orders, payments, coupons, CMS, and Shiprocket delivery integration.

---

## 🚀 Features Overview

### 🛍️ Core E-Commerce

* Product listing with categories
* Featured & Best Seller products
* Cart management
* COD & Online payment (Razorpay)
* Order management with stock locking

### 💸 Payments & Offers

* Razorpay integration (Online payments)
* Cash on Delivery (COD)
* Coupon system (Flat & Percentage)
* Minimum cart value & max discount logic
* Secure backend coupon re-validation

### 🚚 Shipping & Delivery

* Shiprocket integration
* Shipment creation from admin
* AWB & courier assignment
* Shipment tracking support
* Order → Shipment lifecycle management

### 🧑‍💻 User & Admin

* JWT authentication
* Role-based access (User / Admin)
* Admin dashboard APIs
* Order status updates
* Inventory management

### 🧩 CMS & Marketing

* Hero banner management
* Blog system
* Contact form
* Global settings
* Announcement banners

---

## 🛠️ Tech Stack

| Layer         | Technology             |
| ------------- | ---------------------- |
| Runtime       | Node.js                |
| Framework     | Express.js             |
| Database      | MongoDB + Mongoose     |
| Auth          | JWT                    |
| Payments      | Razorpay               |
| Shipping      | Shiprocket             |
| Image Storage | Cloudinary             |
| Validation    | Backend business logic |
| Environment   | dotenv                 |

---

## 📁 Project Structure

```
backend/
│
├── app.js
├── server.js
├── config/
│   ├── cloudinary.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── product.controller.js
│   ├── cart.controller.js
│   ├── order.controller.js
│   ├── payment.controller.js
│   ├── coupon.controller.js
│   ├── hero.controller.js
│   ├── shiprocket.controller.js
│
├── routes/
│   ├── auth.routes.js
│   ├── admin.routes.js
│   ├── product.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   ├── payment.routes.js
│   ├── coupon.routes.js
│   ├── hero.routes.js
│   ├── shiprocket.routes.js
│
├── models/
│   ├── user.model.js
│   ├── product.model.js
│   ├── order.model.js
│   ├── cart.model.js
│   ├── coupon.model.js
│
├── services/
│   ├── shiprocket.service.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── admin.middleware.js
│   ├── errorHandler.js
│
├── utils/
│   ├── order.utils.js
│
└── .env
```

---

## 🔐 Environment Variables

Create a `.env` file in the backend root.

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection

# JWT
JWT_SECRET=your_jwt_secret

# Razorpay
RAZORPAY_KEY_ID=your_key
RAZORPAY_SECRET=your_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Shiprocket
SHIPROCKET_BASE_URL=https://apiv2.shiprocket.in/v1/external
SHIPROCKET_EMAIL=your_shiprocket_email
SHIPROCKET_PASSWORD=your_shiprocket_password
```

---

## ▶️ Running the Project

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Start server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

Health check:

```
GET /
→ Hunger Bites API is running...
```

---

## 🔗 API Routes Summary

### 🔑 Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### 🛒 Products

```
GET    /api/products
GET    /api/products/:id
POST   /api/products (Admin)
PUT    /api/products/:id (Admin)
DELETE /api/products/:id (Admin)
```

### 🛍️ Cart

```
GET    /api/cart
POST   /api/cart/add
DELETE /api/cart/remove/:id
```

### 📦 Orders

```
POST /api/orders          (COD)
GET  /api/orders/my       (User)
GET  /api/orders          (Admin)
PUT  /api/orders/:id      (Admin)
```

### 💳 Payments

```
POST /api/payment/initiate
POST /api/payment/verify
```

### 🎟️ Coupons

```
POST /api/coupons         (Admin)
GET  /api/coupons         (Admin)
POST /api/coupons/validate
```

### 🚚 Shiprocket

```
POST /api/shiprocket/create-shipment (Admin)
GET  /api/shiprocket/track/:orderId
```

---

## 🔄 Order Flow (Important)

### COD Order

```
Frontend → /api/orders
→ Validate products
→ Apply coupon
→ Lock stock
→ Save order
→ Status: Processing
```

### Online Payment

```
Frontend → /api/payment/initiate
→ Razorpay order created
→ Payment UI
→ /api/payment/verify
→ Validate coupon again
→ Create order
→ Reduce stock
→ Clear cart
```

---

## 🚚 Shipping Flow (Shiprocket)

1. Admin creates shipment for order
2. Shiprocket returns:

   * shipment_id
   * awb_code
   * courier_name
3. Stored in Order model
4. User tracks order using AWB

Tracking URL:

```
https://shiprocket.co/tracking/{AWB_CODE}
```

---

## 🧠 Security & Best Practices

* Coupon logic validated **again on backend**
* Product prices locked at order time
* Stock reduced only after order success
* Razorpay signature verification
* JWT protected routes
* Admin-only APIs secured

---

## 📌 Status

✅ Production ready
✅ Scalable architecture
✅ Payment & shipping integrated

---

## 👨‍💻 Author

**Bala Ganesh**
Full Stack Developer (MERN)
Hunger Bites – Snack E-Commerce Platform

---

## 📄 License

This project is proprietary and intended for commercial use.


