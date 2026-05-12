import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowLeft, MapPin, Package } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api';
import { Order } from '@/types';
import { formatPrice, formatDate, getStatusColor } from '@/utils/helpers';

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage() {
  const router              = useRouter();
  const { isAuthenticated } = useAuth();
  const orderId             = Number(router.query.id);

  const [order, setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!orderId) return;
    ordersApi.getById(orderId)
      .then(r => setOrder(r.data.data))
      .catch(() => router.push('/dashboard/orders'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, orderId, router]);

  if (loading || !order) {
    return (
      <Layout title="Order Details — ShopSphere">
        <div className="container-app py-8 max-w-4xl">
          <div className="skeleton h-8 w-48 rounded mb-6" />
          <div className="grid md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="card skeleton h-40" />)}
          </div>
        </div>
      </Layout>
    );
  }

  const stepIndex    = STATUS_STEPS.indexOf(order.status);
  const isCancelled  = order.status === 'CANCELLED' || order.status === 'REFUNDED';

  return (
    <Layout title={`Order ${order.orderNumber} — ShopSphere`}>
      <div className="container-app py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Link href="/dashboard/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1>
            <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={`sm:ml-auto badge text-sm px-3 py-1 ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        {/* Progress tracker */}
        {!isCancelled && (
          <div className="card p-6 mb-6">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 right-0 top-4 h-1 bg-gray-200 -z-0">
                <div
                  className="h-full bg-primary-600 transition-all duration-500"
                  style={{ width: `${(stepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                />
              </div>
              {STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                    i <= stepIndex
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {i < stepIndex ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs hidden sm:block ${i <= stepIndex ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order items */}
          <div className="card p-5 md:col-span-2">
            <h2 className="font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.productImage ? (
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`}
                      className="text-sm font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">
                      {item.productName}
                    </Link>
                    {item.productSku && (
                      <p className="text-xs text-gray-400">SKU: {item.productSku}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × {formatPrice(item.unitPrice)}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 flex-shrink-0 sm:ml-auto">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping address */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-600" /> Shipping Address
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">{order.shippingFullName}</p>
              {order.shippingPhone && <p>{order.shippingPhone}</p>}
              <p>{order.shippingAddress1}</p>
              {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
              <p>{order.shippingCity}, {order.shippingState} {order.shippingPostal}</p>
              <p>{order.shippingCountry}</p>
            </div>
          </div>

          {/* Order totals */}
          <div className="card p-5">
            <h2 className="font-bold text-gray-900 mb-3">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={order.shippingAmount === 0 ? 'text-green-600' : ''}>
                  {order.shippingAmount === 0 ? 'FREE' : formatPrice(order.shippingAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>{formatPrice(order.taxAmount)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2 mt-2">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
