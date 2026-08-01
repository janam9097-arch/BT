import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from rest_framework.test import APIClient
import random, string

client = APIClient()

print("==================================================")
print("     COMPREHENSIVE BACKEND REST API AUDIT        ")
print("==================================================")

def rand_str(l=6):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=l))

results = []

def run_test(name, method, url, data=None, token=None, expected_status=[200, 201]):
    if token:
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
    else:
        client.credentials()

    try:
        if method == 'GET':
            res = client.get(url)
        elif method == 'POST':
            res = client.post(url, data, format='json')
        elif method == 'PUT':
            res = client.put(url, data, format='json')
        elif method == 'PATCH':
            res = client.patch(url, data, format='json')
        elif method == 'DELETE':
            res = client.delete(url)
            
        success = res.status_code in expected_status
        status_str = f"[{'PASS' if success else 'FAIL'}] {method} {url} -> {res.status_code}"
        print(status_str)
        results.append((name, success, res.status_code, res.data if hasattr(res, 'data') else None))
        return res
    except Exception as e:
        print(f"[ERROR] {method} {url} -> {e}")
        results.append((name, False, 500, str(e)))
        return None

# --- 1. ROOT API ---
run_test("API Root", "GET", "/api/")

# --- 2. AUTHENTICATION & USERS ---
test_user = f"audit_user_{rand_str()}"
test_email = f"{test_user}@example.com"
test_pass = "ComplexPass123!"

reg_res = run_test("Register User", "POST", "/api/users/register/", {
    'email': test_email,
    'username': test_user,
    'first_name': 'Audit',
    'last_name': 'User',
    'password': test_pass,
    'password_confirm': test_pass
}, expected_status=[201])

login_res = run_test("Login User", "POST", "/api/users/login/", {
    'email': test_email,
    'password': test_pass
})

token = login_res.data['access'] if login_res and login_res.status_code == 200 else None
refresh_token = login_res.data['refresh'] if login_res and login_res.status_code == 200 else None

run_test("Get Profile", "GET", "/api/users/profile/", token=token)
run_test("Get Me Alias", "GET", "/api/auth/me/", token=token)
run_test("Update Profile", "PATCH", "/api/users/profile/", {'first_name': 'AuditUpdated'}, token=token)
run_test("Refresh Token", "POST", "/api/users/token/refresh/", {'refresh': refresh_token})
run_test("Refresh Token Alias", "POST", "/api/auth/refresh/", {'refresh': refresh_token})

# Address ViewSet
addr_res = run_test("Add Address", "POST", "/api/users/addresses/", {
    'full_name': 'Audit Address',
    'phone_number': '1234567890',
    'street_address': '789 Test St',
    'city': 'New York',
    'state': 'NY',
    'postal_code': '10002',
    'country': 'USA',
    'is_default': True
}, token=token, expected_status=[201])

run_test("List Addresses", "GET", "/api/users/addresses/", token=token)

if addr_res and addr_res.status_code == 201:
    addr_id = addr_res.data['id']
    run_test("Update Address", "PUT", f"/api/users/addresses/{addr_id}/", {
        'full_name': 'Audit Address Updated',
        'phone_number': '1234567890',
        'street_address': '789 Test St Apt 2',
        'city': 'New York',
        'state': 'NY',
        'postal_code': '10002',
        'country': 'USA',
        'is_default': True
    }, token=token)

run_test("Change Password", "POST", "/api/users/change-password/", {
    'old_password': test_pass,
    'new_password': 'NewPassword123!'
}, token=token)

run_test("Forgot Password", "POST", "/api/users/forgot-password/", {'email': test_email})

# --- 3. CATEGORIES ---
run_test("List Categories", "GET", "/api/categories/")
cat_list = client.get("/api/categories/").data
if cat_list and 'results' in cat_list and len(cat_list['results']) > 0:
    cat_slug = cat_list['results'][0]['slug']
    run_test("Category Detail Slug", "GET", f"/api/categories/{cat_slug}/")

# --- 4. PRODUCTS & BRANDS ---
run_test("List Products", "GET", "/api/products/")
run_test("Featured Products", "GET", "/api/products/featured/")
run_test("Trending Products", "GET", "/api/products/trending/")
run_test("Best Sellers", "GET", "/api/products/best-sellers/")
run_test("New Arrivals", "GET", "/api/products/new-arrivals/")
run_test("List Brands", "GET", "/api/products/brands/")

prod_list = client.get("/api/products/").data
prod_id = None
prod_slug = None
if prod_list and 'results' in prod_list and len(prod_list['results']) > 0:
    first_prod = prod_list['results'][0]
    prod_id = first_prod['id']
    prod_slug = first_prod['slug']
    run_test("Product Detail Slug", "GET", f"/api/products/{prod_slug}/")

# --- 5. REVIEWS ---
if prod_id:
    run_test("List Product Reviews", "GET", f"/api/reviews/?product={prod_id}")
    run_test("Add Product Review", "POST", "/api/reviews/", {
        'product': prod_id,
        'rating': 5,
        'comment': 'Awesome product quality!'
    }, token=token, expected_status=[201])

# --- 6. CART ---
run_test("Get Cart", "GET", "/api/cart/", token=token)
if prod_id:
    cart_item_res = run_test("Add Item to Cart", "POST", "/api/cart/add_item/", {
        'product_id': prod_id,
        'quantity': 2
    }, token=token, expected_status=[200, 201])

# --- 7. WISHLIST ---
run_test("Get Wishlist", "GET", "/api/wishlist/", token=token)
if prod_id:
    run_test("Add to Wishlist", "POST", "/api/wishlist/", {'product_id': prod_id}, token=token, expected_status=[201])
    run_test("Remove from Wishlist", "POST", "/api/wishlist/remove/", {'product_id': prod_id}, token=token)

# --- 8. COUPONS ---
run_test("List Coupons", "GET", "/api/coupons/")
run_test("Apply Coupon to Cart", "POST", "/api/cart/apply_coupon/", {'code': 'GOLD20'}, token=token)

# --- 9. ORDERS & PAYMENTS ---
order_res = run_test("Create Order (Checkout)", "POST", "/api/orders/", {
    'shipping_name': 'Audit User',
    'shipping_phone': '1234567890',
    'shipping_address': '789 Test St',
    'shipping_city': 'New York',
    'shipping_state': 'NY',
    'shipping_postal_code': '10002',
    'shipping_country': 'USA',
    'payment_method': 'COD'
}, token=token, expected_status=[201])

run_test("List User Orders", "GET", "/api/orders/", token=token)

if order_res and order_res.status_code == 201:
    order_id = order_res.data['id']
    run_test("Order Detail", "GET", f"/api/orders/{order_id}/", token=token)
    run_test("Create Payment Record", "POST", "/api/payments/", {
        'order': order_id,
        'payment_method': 'COD',
        'amount': order_res.data['grand_total'],
        'status': 'SUCCESS'
    }, token=token, expected_status=[201])

# --- 10. NOTIFICATIONS, NEWSLETTER & CONTACT ---
run_test("List Notifications", "GET", "/api/notifications/", token=token)
run_test("Subscribe Newsletter", "POST", "/api/newsletter/subscribe/", {'email': f'newsletter_{rand_str()}@example.com'}, expected_status=[201])
run_test("Submit Contact Message", "POST", "/api/contact/", {
    'name': 'Audit Tester',
    'email': f'contact_{rand_str()}@example.com',
    'subject': 'General Inquiry',
    'message': 'Testing contact submission endpoint.'
}, expected_status=[201])

# --- 11. LOGOUT ---
run_test("Logout User", "POST", "/api/users/logout/", {'refresh': refresh_token}, token=token)

# --- AUDIT SUMMARY ---
print("\n==================================================")
failed = [r for r in results if not r[1]]
print(f"TOTAL API ENDPOINTS AUDITED: {len(results)}")
print(f"PASSED: {len(results) - len(failed)}")
print(f"FAILED: {len(failed)}")
if failed:
    print("\nFAILED ENDPOINTS DETAILS:")
    for f in failed:
        print(f" - {f[0]}: Status {f[2]} | {f[3]}")
else:
    print("\nALL BACKEND REST API ENDPOINTS ARE 100% OPERATIONAL!")
print("==================================================")
