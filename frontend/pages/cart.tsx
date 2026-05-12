import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/utils/helpers';

export default function CartPage() {
  const { cart, isLoading, updateItem, removeItem } = useCart();
  const { isAuthenticated } = useAuth();

  const SHIPPING_THRESHOLD = 100;
  const SHIPPING_COST      = 9.99;
  const TAX_RATE           = 0.08;

  const subtotal    = cart?.subtotal ?? 0;
  const shipping    = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax         = subtotal * TAX_RATE;
  const total       = subtotal + shipping + tax;
  const toFreeShip  = Math.max(0, SHIPPING_THRESHOLD - subtotal);

  if (!isAuthenticated) {
    return (
      <Layout title="Cart — ShopSphere">
        <div className="container-app py-20 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please sign in</h2>
          <p className="text-gray-500 mb-6">Sign in to view your cart and checkout.</p>
          <Link href="/login?returnUrl=/cart" className="btn-primary">Sign In</Link>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout title="Cart — ShopSphere">
        <div className="container-app py-10">
          <div className="animate-pulse space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="card p-5 flex gap-4">
                <div className="skeleton w-20 h-20 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Layout title="Cart — ShopSphere">
        <div className="container-app py-20 text-center">
          <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link href="/products" className="btn-primary">
            Browse Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Cart (${cart.totalItems}) — ShopSphere`}>
      <div className="container-app py-8">
        <h1 className="page-heading mb-8">
          Shopping Cart
          <span className="ml-2 text-lg font-normal text-gray-500">({cart.totalItems} items)</span>
        </h1>

        {/* Free shipping progress */}
        {toFreeShip > 0 && (
          <div className="card p-4 mb-6 flex items-center gap-3 bg-amber-50 border-amber-200">
            <Tag className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">
                Add {formatPrice(toFreeShip)} more for free shipping!
              </p>
              <div className="mt-1.5 h-2 bg-amber-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map(item => (
              <div key={item.id} className="card p-4 flex flex-col sm:flex-row gap-4">
                {/* Image */}
                <Link href={`/products/${item.productSlug}`} className="flex-shrink-0">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.productImage || 'https://via.placeholder.com/96'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <Link href={`/products/${item.productSlug}`}
                    className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
                    {item.productName}
                  </Link>
                  <p className="text-sm font-bold text-primary-600">{formatPrice(item.productPrice)}</p>
                  {item.availableStock <= 5 && item.availableStock > 0 && (
                    <p className="text-xs text-amber-600">Only {item.availableStock} left!</p>
                  )}
                </div>

                {/* Qty + Remove */}
                <div className="flex flex-row sm:flex-col sm:items-end gap-3 flex-shrink-0 w-full sm:w-auto justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => item.quantity > 1
                        ? updateItem(item.id, item.quantity - 1)
                        : removeItem(item.id)}
                      className="p-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.availableStock}
                      className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-gray-900">{formatPrice(item.lineTotal)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 lg:sticky lg:top-24 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : 'font-semibold'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-semibold">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full py-3 text-center font-semibold">
                Proceed to Checkout
              </Link>

              <Link href="/products"
                className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-primary-600 transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
