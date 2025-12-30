# 🛠️ Hunger Bites – Admin Panel (Frontend)

Admin Dashboard URL:
👉 **[https://admin.hungerbites.store/admin/dashboard](https://admin.hungerbites.store/admin/dashboard)**

This repository contains the **admin-facing frontend** for the Hunger Bites snack e-commerce platform.
It is used to **manage products, orders, users, payments, shipping, content, and settings**.

---

## 🚀 Tech Stack

* **React (Vite)**
* **React Router DOM**
* **Context API (Admin Auth)**
* **Axios**
* **Tailwind CSS**
* **Framer Motion**
* **JWT Authentication**
* **Role-based Access Control**

---

## 🔐 Admin Authentication

* Secure **admin-only login**
* JWT-based authentication
* Tokens stored securely (localStorage)
* Protected routes using `AdminProtectedRoute`
* Auto redirect to `/admin/login` if unauthenticated

---

## 📦 Admin Features

### 📊 Dashboard

* Total orders, users, revenue overview
* Recent orders
* Payment & order statistics

### 🛒 Product Management

* Add / Edit / Delete products
* Upload images
* Manage stock & pricing
* Featured & Best Seller flags

### 🗂️ Category Management

* Create & manage product categories
* Image-based categories

### 📦 Order Management

* View all orders
* Order details page
* Update order status
* Shipment tracking integration (Shiprocket)
* COD & Online orders handling

### 🚚 Shipping (Shiprocket)

* Create shipments
* Assign courier
* Track delivery status
* View tracking IDs

### 💳 Payments

* View all Razorpay payments
* Payment status & transaction history

### 🎟️ Coupon Management

* Create coupons (FLAT / PERCENT)
* Min cart value rules
* Max discount limits
* Enable / Disable coupons

### 🖼️ Hero Banner Management

* Add homepage hero slides
* Upload banners
* Enable / disable slides
* Control slide order

### 📝 Blog Management

* Create & edit blog posts
* Publish / unpublish blogs

### 📩 Contact Messages

* View customer queries
* Manage contact form messages

### ⚙️ Settings

* Website-wide configuration
* Business & UI related settings

---

## 🌐 Live URLs

| Service      | URL                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------- |
| Admin Panel  | [https://admin.hungerbites.store/admin/dashboard](https://admin.hungerbites.store/admin/dashboard) |
| User Website | [https://hungerbites.store](https://hungerbites.store)                                             |
| Backend API  | `/api/*`                                                                                           |

---

## 🧭 Admin Routes

```txt
/admin/login          → Admin Login
/admin/dashboard      → Dashboard Home
/admin/products       → Products Management
/admin/orders         → Orders List
/admin/orders/:id     → Order Details
/admin/users          → Users Management
/admin/payments       → Payments
/admin/categories     → Categories
/admin/hero           → Hero Banner Management
/admin/coupons        → Coupon Management
/admin/blogs          → Blog Manager
/admin/messages       → Contact Messages
/admin/settings       → Settings
```

---

## 📁 Project Structure

```
src/
│
├── api/                   # Admin API services
├── components/
│   ├── admin/             # Admin UI components
│   └── common/            # Shared components (ProtectedRoute)
│
├── context/
│   └── AdminAuthContext   # Admin auth state
│
├── layouts/
│   └── AdminLayout.jsx    # Admin dashboard layout
│
├── pages/
│   └── admin/
│       ├── Login.jsx
│       ├── DashboardHome.jsx
│       ├── Products.jsx
│       ├── Orders.jsx
│       ├── OrderDetails.jsx
│       ├── Users.jsx
│       ├── Payments.jsx
│       ├── Categories.jsx
│       ├── AdminHero.jsx
│       ├── AdminCoupons.jsx
│       ├── BlogManager.jsx
│       ├── ContactMessages.jsx
│       └── Settings.jsx
│
├── routes/
│   └── AdminRoutes.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## ⚙️ Environment Variables

Create a `.env` file in the admin frontend root:

```env
VITE_API_BASE_URL=https://your-backend-domain/api
```

> ⚠️ Admin frontend **never stores secrets** like DB keys or Razorpay secret.

---

## ▶️ Run Admin Panel Locally

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Runs at:

```
http://localhost:5173/admin
```

---

## 🏗️ Production Build

```bash
npm run build
```

Deploy `dist/` to:

* Vercel
* Netlify
* Cloudflare Pages
* VPS / cPanel (subdomain: `admin.yoursite.com`)

---

## 🔒 Security Practices

* Admin-only protected routes
* Backend role validation (isAdmin middleware)
* Token-based session handling
* Server-side price & coupon validation
* No business logic trusted on frontend

---

## 🔄 Backend Integration

This admin panel connects to a **Node.js + Express + MongoDB** backend that handles:

* Authentication & roles
* Products & categories
* Orders & payments
* Coupons & settings
* Blogs & messages
* Shiprocket shipping

---

## 👨‍💻 Developer

**Bala Ganesh**
Full Stack MERN Developer

---

## 📄 License

This admin panel is proprietary software built for **Hunger Bites**.
Unauthorized use or redistribution is prohibited.

