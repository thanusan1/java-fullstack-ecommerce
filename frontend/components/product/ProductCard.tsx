import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, cn } from '@/utils/helpers';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [adding, setAdding] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      router.push('/login');
      return;
    }

    if (!product.inStock) return;

    try {
      setAdding(true);
      await addItem(product.id, 1);
    } catch {
      // error handled by context
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={cn(
      'card group overflow-hidden hover:shadow-md transition-all duration-300',
      className
    )}>
      <Link href={`/products/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={product.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {product.discountPercent && product.discountPercent > 0 ? (
              <span className="badge bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                -{product.discountPercent}%
              </span>
            ) : null}
            {product.featured && (
              <span className="badge bg-accent-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                Featured
              </span>
            )}
            {!product.inStock && (
              <span className="badge bg-gray-800 text-white text-xs px-2 py-1 rounded-md">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={e => e.preventDefault()}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow
                       flex items-center justify-center opacity-0 group-hover:opacity-100
                       transition-opacity hover:bg-red-50"
          >
            <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-primary-600 font-medium uppercase tracking-wide mb-1">
            {product.category?.name}
          </p>

          {/* Name */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-2
                         group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={cn(
                    'w-3.5 h-3.5',
                    star <= Math.round(product.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-300'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-base font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="ml-1.5 text-xs text-gray-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || adding}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                product.inStock
                  ? 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              )}
              title={product.inStock ? 'Add to cart' : 'Out of stock'}
            >
              <ShoppingCart className={cn('w-4 h-4', adding && 'animate-pulse')} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
