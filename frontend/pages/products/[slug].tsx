import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Truck, RefreshCw, ShieldCheck, ChevronRight, Minus, Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import { formatPrice, cn, resolveImageUrl } from '@/utils/helpers';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface Props { product: Product }

export default function ProductDetailPage({ product }: Props) {
  const { addItem }         = useCart();
  const { isAuthenticated } = useAuth();
  const router              = useRouter();
  const [qty, setQty]       = useState(1);
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imageUrl = resolveImageUrl(product.imageUrl) || 'https://via.placeholder.com/600x600?text=No+Image';

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      router.push(`/login?returnUrl=/products/${product.slug}`);
      return;
    }
    try {
      setAdding(true);
      await addItem(product.id, qty);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push(`/login?returnUrl=/checkout`);
      return;
    }
    try {
      setAdding(true);
      await addItem(product.id, qty);
      router.push('/cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Layout title={`${product.name} — ShopSphere`} description={product.description}>
      <div className="container-app py-8">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/products?categoryId=${product.category.id}`} className="hover:text-primary-600">
            {product.category.name}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <Image
                src={imgError ? 'https://via.placeholder.com/600x600?text=No+Image' : imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
                priority
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.discountPercent && product.discountPercent > 0 ? (
                  <span className="badge bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                    -{product.discountPercent}% OFF
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <Link href={`/products?categoryId=${product.category.id}`}
                className="text-sm font-medium text-primary-600 hover:underline uppercase tracking-wide">
                {product.category.name}
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 leading-tight">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-sm text-gray-500 mt-1">by <span className="font-medium">{product.brand}</span></p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={cn(
                    'w-5 h-5',
                    s <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                  )} />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">{formatPrice(product.price)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                  <span className="badge bg-red-100 text-red-600 font-semibold px-2.5 py-1">
                    Save {formatPrice(product.comparePrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-2.5 h-2.5 rounded-full',
                product.inStock ? 'bg-green-500' : 'bg-red-500'
              )} />
              <span className={cn('text-sm font-medium', product.inStock ? 'text-green-700' : 'text-red-600')}>
                {product.inStock
                  ? `In Stock (${product.stockQuantity} available)`
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {product.description}
              </p>
            )}

            {/* Quantity selector */}
            {product.inStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="p-2.5 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stockQuantity, q + 1))}
                    className="p-2.5 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || adding}
                className="btn-secondary flex-1 py-3 font-semibold gap-2 disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5" />
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock || adding}
                className="btn-primary flex-1 py-3 font-semibold disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-100 pt-5">
              {[
                { icon: Truck,       text: 'Free shipping over $100' },
                { icon: RefreshCw,   text: '30-day easy returns' },
                { icon: ShieldCheck, text: 'Secure checkout' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon className="w-5 h-5 text-primary-600" />
                  <span className="text-xs text-gray-500">{text}</span>
                </div>
              ))}
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-gray-400">SKU: {product.sku}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const res = await productsApi.getBySlug(slug);
    return { props: { product: res.data.data } };
  } catch {
    return { notFound: true };
  }
};
