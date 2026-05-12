import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, Users, TrendingUp, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Pagination from '@/components/ui/Pagination';
import { useAuth } from '@/context/AuthContext';
import { productsApi, categoriesApi } from '@/lib/api';
import { Product, Category, PageResponse } from '@/types';
import { formatPrice, formatDate } from '@/utils/helpers';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  const [products, setProducts]     = useState<PageResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage]             = useState(0);
  const [loading, setLoading]       = useState(true);
  const [deleting, setDeleting]     = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) { router.push('/'); return; }
    fetchData();
  }, [isAuthenticated, isAdmin, page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        productsApi.getAll({ page, size: 10 }),
        categoriesApi.getAll(),
      ]);
      setProducts(pRes.data.data);
      setCategories(cRes.data.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product? (It will be soft-deleted)')) return;
    try {
      setDeleting(id);
      await productsApi.delete(id);
      toast.success('Product deleted');
      fetchData();
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  return (
    <Layout title="Admin Dashboard — ShopSphere">
      <div className="container-app py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="page-heading">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage products, orders, and customers</p>
          </div>
          <Link href="/admin/products/new" className="btn-primary gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package,      label: 'Total Products', value: products?.totalElements ?? '–', color: 'text-blue-600 bg-blue-50' },
            { icon: ShoppingCart, label: 'Categories',     value: categories.length,               color: 'text-green-600 bg-green-50' },
            { icon: Users,        label: 'Customers',      value: '–',                             color: 'text-purple-600 bg-purple-50' },
            { icon: TrendingUp,   label: 'Revenue',        value: '–',                             color: 'text-amber-600 bg-amber-50' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Products Table */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Products</h2>
            <Link href="/admin/products/new" className="btn-primary py-2 text-sm gap-1">
              <Plus className="w-4 h-4" /> New
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-14 rounded-lg" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Product','Category','Price','Stock','Featured','Date','Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products?.content.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {product.imageUrl && (
                              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 max-w-[200px] truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.category?.name}</td>
                      <td className="px-4 py-3 text-sm font-semibold">{formatPrice(product.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${product.featured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                          {product.featured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{formatDate(product.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link href={`/products/${product.slug}`}
                            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link href={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                            title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products && (
                <div className="px-5 py-4 border-t border-gray-100">
                  <Pagination
                    currentPage={products.number}
                    totalPages={products.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
