# E-Commerce API Documentation

## Base URL
`http://localhost:8000/api`

---

## Authentication & Users Header
For endpoints requiring authentication, pass the JWT access token in the `Authorization` header:
`Authorization: Bearer <your_access_token>`

---

## Endpoint Details

### 1. Authentication & User Profile (`/users/`)
- `POST /users/register/` - Register new user account.
- `POST /users/login/` - Login and receive `{ access, refresh }`.
- `POST /users/token/refresh/` - Exchange refresh token for new access token.
- `POST /users/logout/` - Blacklist refresh token and logout.
- `GET /users/profile/` - Fetch user profile information and addresses.
- `PATCH /users/profile/` - Update profile details.
- `GET /users/addresses/` - List user saved shipping addresses.
- `POST /users/addresses/` - Add new shipping address.
- `POST /users/change-password/` - Update account password.
- `POST /users/forgot-password/` - Trigger password reset request.

### 2. Categories (`/categories/`)
- `GET /categories/` - Retrieve all top-level categories with nested subcategories.
- `GET /categories/<slug>/` - Retrieve single category by slug.

### 3. Products (`/products/`)
- `GET /products/` - List products with pagination, search, category filter, and ordering (`?category=men`, `?search=shoes`, `?ordering=-price`).
- `GET /products/<slug>/` - Retrieve full product detail with images and variants.
- `GET /products/featured/` - Featured products.
- `GET /products/trending/` - Trending products.
- `GET /products/best-sellers/` - Best selling items.
- `GET /products/new-arrivals/` - Newest arrivals.

### 4. Shopping Cart (`/cart/`)
- `GET /cart/` - Retrieve active shopping cart with subtotal, tax, shipping, and total.
- `POST /cart/add/` - Add product to cart `{ product_id, variant_id, quantity }`.
- `PATCH /cart/update/<item_id>/` - Update item quantity.
- `DELETE /cart/remove/<item_id>/` - Remove item from cart.
- `POST /cart/clear/` - Clear all cart items.

### 5. Wishlist (`/wishlist/`)
- `GET /wishlist/` - List user's saved wishlist items.
- `POST /wishlist/add/` - Add product to wishlist `{ product_id }`.
- `DELETE /wishlist/remove/<product_id>/` - Remove item from wishlist.

### 6. Orders (`/orders/`)
- `GET /orders/` - List user order history.
- `POST /orders/` - Place new order from active cart.
- `GET /orders/<id>/` - Retrieve order detail & status.
- `POST /orders/<id>/cancel/` - Cancel order if not shipped.
- `POST /orders/<id>/return/` - Request return if order delivered.

### 7. Payments (`/payments/`)
- `POST /payments/create-intent/` - Create payment intent for Stripe, Razorpay, or COD.
- `POST /payments/verify/` - Verify transaction callback.

### 8. Reviews (`/reviews/`)
- `GET /reviews/?product=<product_id>` - Fetch product reviews.
- `POST /reviews/` - Submit product review `{ product, rating, comment }`.

### 9. Coupons (`/coupons/`)
- `POST /coupons/apply/` - Apply coupon code `{ code }`.
- `POST /coupons/remove/` - Remove applied coupon.
- `POST /coupons/validate/` - Validate coupon code.

### 10. Notifications (`/notifications/`)
- `GET /notifications/` - List user notifications.
- `POST /notifications/<id>/read/` - Mark notification as read.
