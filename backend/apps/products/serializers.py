from rest_framework import serializers
from .models import Brand, Product, ProductImage, ProductVariant
from apps.categories.serializers import CategorySerializer

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo']

class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source='get_url', read_only=True)

    class Meta:
        model = ProductImage
        fields = ['id', 'url', 'image_url', 'is_thumbnail']

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'color', 'sku', 'stock', 'price_override']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'description', 'category', 'category_name', 'category_slug',
            'brand', 'brand_name', 'price', 'discount_price', 'discount_text', 'stock', 'sku',
            'is_featured', 'is_trending', 'is_best_seller', 'is_new_arrival',
            'primary_image', 'images', 'average_rating', 'total_reviews', 'created_at'
        ]

    def get_primary_image(self, obj):
        first_img = obj.images.filter(is_thumbnail=True).first() or obj.images.first()
        if first_img:
            return first_img.get_url()
        return "https://picsum.photos/400?product=" + str(obj.id)

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews.exists():
            return 0.0
        return round(sum(r.rating for r in reviews) / len(reviews), 1)

    def get_total_reviews(self, obj):
        return obj.reviews.count()

class ProductDetailSerializer(ProductSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ['variants']
