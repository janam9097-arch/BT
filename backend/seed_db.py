import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.categories.models import Category
from apps.products.models import Brand, Product, ProductImage, ProductVariant
from apps.coupons.models import Coupon
from apps.users.models import Profile, Address

User = get_user_model()

def seed():
    print("Seeding database...")

    # Create Admin User
    admin_user, created = User.objects.get_or_create(
        email='admin@example.com',
        defaults={
            'username': 'admin',
            'first_name': 'Admin',
            'last_name': 'User',
            'is_staff': True,
            'is_superuser': True,
            'is_email_verified': True
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        Profile.objects.get_or_create(user=admin_user, defaults={'bio': 'E-commerce Super Admin'})
        Address.objects.create(
            user=admin_user,
            full_name='Admin User',
            phone_number='1234567890',
            street_address='123 Luxury Avenue',
            city='New York',
            state='NY',
            postal_code='10001',
            country='USA',
            is_default=True
        )
        print("Created Admin user: admin@example.com / admin123")

    # Create Sample Demo User
    demo_user, created = User.objects.get_or_create(
        email='demo@example.com',
        defaults={
            'username': 'demouser',
            'first_name': 'Demo',
            'last_name': 'Customer',
            'is_email_verified': True
        }
    )
    if created:
        demo_user.set_password('demo123')
        demo_user.save()
        Profile.objects.get_or_create(user=demo_user, defaults={'bio': 'Valued VIP Customer'})
        Address.objects.create(
            user=demo_user,
            full_name='Demo Customer',
            phone_number='9876543210',
            street_address='456 Fashion Boulevard',
            city='Los Angeles',
            state='CA',
            postal_code='90001',
            country='USA',
            is_default=True
        )
        print("Created Demo user: demo@example.com / demo123")

    # Create Brands
    brands = ['Gucci', 'Prada', 'Nike', 'Adidas', 'Rolex', 'Ray-Ban']
    brand_objs = {}
    for b_name in brands:
        b, _ = Brand.objects.get_or_create(name=b_name)
        brand_objs[b_name] = b

    # Create Parent & Child Categories
    categories_data = [
        {'name': 'Men', 'children': ['Men\'s Footwear', 'Office Wear', 'Men\'s Ethnic Wear', 'Watches']},
        {'name': 'Women', 'children': ['Women\'s Footwear', 'Women\'s Ethnic Wear', 'Bags, Belts & Wallets']},
        {'name': 'Kids', 'children': ['Kids Wear', 'Toys & Accessories']},
        {'name': 'Accessories', 'children': ['Sunglasses', 'Glasses', 'Jewelry']}
    ]

    cat_objs = {}
    for cat_data in categories_data:
        parent_cat, _ = Category.objects.get_or_create(name=cat_data['name'])
        cat_objs[cat_data['name']] = parent_cat
        for child_name in cat_data['children']:
            child_cat, _ = Category.objects.get_or_create(name=child_name, parent=parent_cat)
            cat_objs[child_name] = child_cat

    # Create Sample Products matching UI catalog
    products_data = [
        {
            'title': "Kids Premium Wear",
            'category': cat_objs.get("Kids Wear", cat_objs['Kids']),
            'brand': brand_objs['Nike'],
            'price': 89.99,
            'discount_price': 44.99,
            'discount_text': '50% OFF',
            'is_featured': True,
            'is_trending': True,
            'image': 'https://picsum.photos/400?1'
        },
        {
            'title': "Men's Luxury Sneakers",
            'category': cat_objs.get("Men's Footwear", cat_objs['Men']),
            'brand': brand_objs['Adidas'],
            'price': 149.99,
            'discount_price': 74.99,
            'discount_text': '50% OFF',
            'is_featured': True,
            'is_best_seller': True,
            'image': 'https://picsum.photos/400?2'
        },
        {
            'title': "Women's Elegance Heels",
            'category': cat_objs.get("Women's Footwear", cat_objs['Women']),
            'brand': brand_objs['Prada'],
            'price': 199.99,
            'discount_price': 99.99,
            'discount_text': '50% OFF',
            'is_featured': True,
            'is_new_arrival': True,
            'image': 'https://picsum.photos/400?3'
        },
        {
            'title': "Designer Leather Bag",
            'category': cat_objs.get("Bags, Belts & Wallets", cat_objs['Women']),
            'brand': brand_objs['Gucci'],
            'price': 299.99,
            'discount_price': 149.99,
            'discount_text': '50% OFF',
            'is_featured': True,
            'is_trending': True,
            'image': 'https://picsum.photos/400?4'
        },
        {
            'title': "Tailored Office Suit",
            'category': cat_objs.get("Office Wear", cat_objs['Men']),
            'brand': brand_objs['Prada'],
            'price': 399.99,
            'discount_price': 239.99,
            'discount_text': '40% OFF',
            'is_featured': True,
            'is_best_seller': True,
            'image': 'https://picsum.photos/400?5'
        },
        {
            'title': "Men's Traditional Kurta",
            'category': cat_objs.get("Men's Ethnic Wear", cat_objs['Men']),
            'brand': brand_objs['Gucci'],
            'price': 129.99,
            'discount_price': 77.99,
            'discount_text': '40% OFF',
            'is_featured': True,
            'is_new_arrival': True,
            'image': 'https://picsum.photos/400?6'
        },
        {
            'title': "Women's Designer Saree",
            'category': cat_objs.get("Women's Ethnic Wear", cat_objs['Women']),
            'brand': brand_objs['Gucci'],
            'price': 249.99,
            'discount_price': 149.99,
            'discount_text': '40% OFF',
            'is_featured': True,
            'is_trending': True,
            'image': 'https://picsum.photos/400?7'
        },
        {
            'title': "Gold Chronograph Watch",
            'category': cat_objs.get("Watches", cat_objs['Accessories']),
            'brand': brand_objs['Rolex'],
            'price': 499.99,
            'discount_price': 349.99,
            'discount_text': '30% OFF',
            'is_featured': True,
            'is_best_seller': True,
            'image': 'https://picsum.photos/400?8'
        },
        {
            'title': "Classic Polarized Sunglasses",
            'category': cat_objs.get("Sunglasses", cat_objs['Accessories']),
            'brand': brand_objs['Ray-Ban'],
            'price': 179.99,
            'discount_price': 107.99,
            'discount_text': '40% OFF',
            'is_featured': True,
            'is_new_arrival': True,
            'image': 'https://picsum.photos/400?9'
        },
        {
            'title': "Anti-Blue Ray Glasses",
            'category': cat_objs.get("Glasses", cat_objs['Accessories']),
            'brand': brand_objs['Ray-Ban'],
            'price': 99.99,
            'discount_price': 39.99,
            'discount_text': '60% OFF',
            'is_featured': True,
            'is_trending': True,
            'image': 'https://picsum.photos/400?10'
        }
    ]

    for p_data in products_data:
        img_url = p_data.pop('image')
        prod, created = Product.objects.get_or_create(
            title=p_data['title'],
            defaults=p_data
        )
        if created or not prod.images.exists():
            ProductImage.objects.create(product=prod, image_url=img_url, is_thumbnail=True)
            ProductImage.objects.create(product=prod, image_url=img_url.replace('400', '401'), is_thumbnail=False)
            ProductVariant.objects.create(product=prod, size='M', color='Gold / Black', stock=15)
            ProductVariant.objects.create(product=prod, size='L', color='Black / Silver', stock=20)

    # Create Coupons
    Coupon.objects.get_or_create(
        code='GOLD20',
        defaults={'discount_percentage': 20.0, 'min_purchase': 50.0}
    )
    Coupon.objects.get_or_create(
        code='WELCOME10',
        defaults={'fixed_discount': 10.0, 'min_purchase': 30.0}
    )

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()
