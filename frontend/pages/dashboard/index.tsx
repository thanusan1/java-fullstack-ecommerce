import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, User, ShoppingBag, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api';
import { Order } from '@/types';
import { formatPrice, formatDate, getStatusColor } from '@/utils/helpers';
import { useRouter } from 'next/router';

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    ordersApi.getMyOrders(0, 3)
      .then(r => setRecentOrders(r.data.data.content))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  if (!user) return null;

  return (
    <Layout title="My Account — ShopSphere">
      <div className="container-app py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="page-heading">My Account</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user.firstName}!</p>
          </div>
          <button onClick={logout} className="btn-secondary py-2 text-sm text-red-600 border-red-200 hover:bg-red-50">
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: ShoppingBag, label: 'Total Orders',  value: recentOrders.length > 0 ? '–' : '0', color: 'text-primary-600 bg-primary-50' },
            { icon: Package,     label: 'Items Ordered', value: '–', color: 'text-green-600 bg-green-50' },
            { icon: User,        label: 'Member Since',  value: formatDate(user.createdAt), color: 'text-purple-600 bg-purple-50' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-base font-bold text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile info */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Profile Information</h2>
              <Link href="/dashboard/profile" className="text-sm text-primary-600 hover:underline">Edit</Link>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Name',  value: `${user.firstName} ${user.lastName}` },
                { label: 'Email', value: user.email },
                { label: 'Phone', value: user.phone || 'Not set' },
                { label: 'Role',  value: user.role },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-2">
              {[
                { href: '/dashboard/orders', label: 'My Orders',     icon: Package },
                { href: '/products',         label: 'Browse Products', icon: ShoppingBag },
                { href: '/cart',             label: 'My Cart',        icon: ShoppingBag },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="card p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-lg" />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No orders yet.</p>
              <Link href="/products" className="btn-primary mt-3 text-sm py-2">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <Link key={order.id} href={`/dashboard/orders/${order.id}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)} · {order.items.length} items</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span>
                    <span className="text-sm font-bold">{formatPrice(order.totalAmount)}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
