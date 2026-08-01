# Modern Luxury E-Commerce Platform (Django REST + React)

A full-stack production-ready e-commerce platform built with **Django 5**, **Django REST Framework**, **SimpleJWT Authentication**, and **React 19 (Vite)**.

---

## Technical Stack

### Backend
- **Django 5.2+** & **Django REST Framework**
- **SimpleJWT** (Access & Refresh JWT Token Rotation & Blacklisting)
- **SQLite** (Default development database) / **PostgreSQL** supported out-of-the-box
- **Django Cors Headers** & **Python-Dotenv**
- **Pillow** (Image Uploads)
- **Django Filters** & Search Backends

### Frontend
- **React 19** with **Vite**
- **React Router DOM 6**
- **Axios** (With Bearer header injection & automatic JWT refresh token interceptors)
- **React Icons** & Luxury Dark/Gold Aesthetics (`#000`, `#D4AF37`)

---

## Registered Django Apps

1. `users`: Authentication (Registration, Login, JWT Tokens, Password Reset, Addresses, User Profiles)
2. `categories`: Hierarchical Parent/Child categories with images & slugs
3. `products`: Catalog, Brands, Variants (Size/Color), Stock, SKU, Discounts, Ratings, Filtering & Search
4. `cart`: Shopping Cart with real-time tax, shipping calculation, and quantity modifiers
5. `wishlist`: User favorite products list
6. `orders`: Order placement, tracking status, order cancellation & return management
7. `payments`: Multi-gateway payment layer (Cash on Delivery, Stripe, Razorpay)
8. `reviews`: Customer product reviews & ratings
9. `coupons`: Promotional discount coupons (fixed or percentage-based)
10. `notifications`: In-app order status notifications

---

## Quick Start Guide

### 1. Backend Setup (Django)

```bash
cd backend

# Create & activate virtual environment (optional)
python -m venv venv
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations & seed demo data
python manage.py migrate
python seed_db.py

# Start Django backend server on port 8000
python manage.py runserver 8000
```

> **Demo Accounts Created by Seed Script:**
> - **Superadmin:** `admin@example.com` / `admin123` (Access Django Admin at `http://localhost:8000/admin/`)
> - **Demo Customer:** `demo@example.com` / `demo123`

### 2. Frontend Setup (React)

```bash
# In project root:
npm install
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## API Endpoint Overview

| Module | Method | Endpoint | Description |
|---|---|---|---|
| Users | POST | `/api/users/register/` | Register new user |
| Users | POST | `/api/users/login/` | Obtain JWT token pair |
| Users | GET/PUT | `/api/users/profile/` | Manage user profile |
| Products | GET | `/api/products/` | List products (with search/filters) |
| Categories | GET | `/api/categories/` | List top categories & subcategories |
| Cart | GET/POST | `/api/cart/` | Manage shopping cart |
| Wishlist | GET/POST | `/api/wishlist/` | Manage wishlist |
| Orders | GET/POST | `/api/orders/` | List orders & place order |
| Payments | POST | `/api/payments/create-intent/` | Create payment intent |
| Coupons | POST | `/api/coupons/apply/` | Apply coupon code |

---

## Production Build

To build the React application for production deployment:

```bash
npm run build
```
