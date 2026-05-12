import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Pagination from '@/components/ui/Pagination';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api';
import { Order, PageResponse } from '@/types';
import { formatPrice, formatDate, getStatusColor } from '@/utils/helpers';
import { useRouter } from 'next/router';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData]     = useState<PageResponse<Order> | null>(null);
  const [page, setPage]     = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setLoading(true);
    ordersApi.getMyOrders(page, 10)
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, page, router]);

  return (
    <Layout title="My Orders — ShopSphere">
      <div className="container-app py-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="page-heading">My Orders</h1>
            <p className="text-gray-500 text-sm mt-0.5">{data?.totalElements ?? 0} total orders</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="card skeleton h-28" />)}
          </div>
        ) : !data?.content.length ? (
          <div className="card p-16 text-center">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Your orders will appear here after you shop.</p>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {data.content.map(order => (
                <Link key={order.id} href={`/dashboard/orders/${order.id}`}
                  className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-bold text-gray-900">{order.orderNumber}</span>
                      <span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span>
                    </div>
                    <p className="text-xs text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                    <p className="text-xs text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* First item preview */}
                    {order.items[0]?.productImage && (
                      <div className="hidden sm:flex items-center gap-2">
                        {order.items.slice(0, 3).map(item => (
                          <div key={item.id}
                            className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                            style={{ backgroundImage: `url(${item.productImage})`, backgroundSize: 'cover' }}
                          />
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-xs text-gray-400">+{order.items.length - 3} more</span>
                        )}
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>

            <Pagination
              currentPage={data.number}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
