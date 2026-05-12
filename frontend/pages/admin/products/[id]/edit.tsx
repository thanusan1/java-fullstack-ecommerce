import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { productsApi, categoriesApi } from '@/lib/api';
import { Category } from '@/types';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

interface ProductForm {
  name: string; description: string; price: string; comparePrice: string;
  stockQuantity: string; sku: string; brand: string; categoryId: string;
  imageUrl: string; featured: boolean; active: boolean;
}

export default function EditProductPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router  = useRouter();
  const id      = Number(router.query.id);

  const [form, setForm]             = useState<ProductForm | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving]         = useState(false);
  const [errors, setErrors]         = useState<Partial<ProductForm>>({});

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) { router.push('/'); return; }
    if (!id) return;

    Promise.all([
      productsApi.getAll({ page: 0, size: 1 }),   // dummy — we use getById via admin
      categoriesApi.getAll(),
    ]).then(([, cRes]) => {
      setCategories(cRes.data.data);
    }).catch(() => {});

    // Fetch product by id through the admin endpoint path
    // Since our public API uses slug, we fetch all and find by id
    productsApi.getAll({ page: 0, size: 200 }).then(res => {
      const product = res.data.data.content.find(p => p.id === id);
      if (!product) { toast.error('Product not found'); router.push('/admin'); return; }
      setForm({
        name:          product.name,
        description:   product.description || '',
        price:         String(product.price),
        comparePrice:  product.comparePrice ? String(product.comparePrice) : '',
        stockQuantity: String(product.stockQuantity),
        sku:           product.sku || '',
        brand:         product.brand || '',
        categoryId:    String(product.category.id),
        imageUrl:      product.imageUrl || '',
        featured:      product.featured,
        active:        true,
      });
    }).catch(() => toast.error('Failed to load product'));
  }, [isAuthenticated, isAdmin, id, router]);

  const set = (k: keyof ProductForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => f ? ({
        ...f,
        [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value,
      }) : f);

  const validate = () => {
    if (!form) return false;
    const e: Partial<ProductForm> = {};
    if (!form.name.trim())   e.name       = 'Required';
    if (!form.price)         e.price      = 'Required';
    if (!form.categoryId)    e.categoryId = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !validate()) return;
    try {
      setSaving(true);
      const payload = {
        ...form,
        price:         parseFloat(form.price),
        comparePrice:  form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        stockQuantity: parseInt(form.stockQuantity),
        categoryId:    parseInt(form.categoryId),
      };
      await productsApi.update(id, payload as any);
      toast.success('Product updated successfully!');
      router.push('/admin');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <Layout title="Edit Product — Admin">
        <div className="container-app py-8 max-w-4xl">
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="card skeleton h-40" />)}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Product — Admin">
      <div className="container-app py-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="page-heading">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main details */}
            <div className="md:col-span-2 space-y-5">
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 mb-4">Product Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={form.name} onChange={set('name')}
                      className={`input-field ${errors.name ? 'input-error' : ''}`} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={form.description} onChange={set('description')}
                      rows={4} className="input-field resize-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (USD) <span className="text-red-500">*</span>
                      </label>
                      <input type="number" step="0.01" min="0" value={form.price} onChange={set('price')}
                        className={`input-field ${errors.price ? 'input-error' : ''}`} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Compare at Price</label>
                      <input type="number" step="0.01" min="0" value={form.comparePrice} onChange={set('comparePrice')}
                        className="input-field" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-bold text-gray-900 mb-4">Inventory</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input type="number" min="0" value={form.stockQuantity} onChange={set('stockQuantity')}
                      className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input type="text" value={form.sku} onChange={set('sku')} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input type="text" value={form.brand} onChange={set('brand')} className="input-field" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-bold text-gray-900 mb-4">Media</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="url" value={form.imageUrl} onChange={set('imageUrl')} className="input-field" />
                  {form.imageUrl && (
                    <div className="mt-3 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover"
                        onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="card p-5">
                <h2 className="font-bold text-gray-900 mb-4">Organization</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select value={form.categoryId} onChange={set('categoryId')}
                    className={`input-field ${errors.categoryId ? 'input-error' : ''}`}>
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <React.Fragment key={c.id}>
                        <option value={c.id}>{c.name}</option>
                        {c.children?.map(ch => (
                          <option key={ch.id} value={ch.id}>└ {ch.name}</option>
                        ))}
                      </React.Fragment>
                    ))}
                  </select>
                </div>
              </div>

              <div className="card p-5">
                <h2 className="font-bold text-gray-900 mb-4">Settings</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.active}
                      onChange={e => setForm(f => f ? ({ ...f, active: e.target.checked }) : f)}
                      className="w-4 h-4 accent-primary-600 rounded" />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.featured}
                      onChange={e => setForm(f => f ? ({ ...f, featured: e.target.checked }) : f)}
                      className="w-4 h-4 accent-primary-600 rounded" />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full py-3 font-semibold gap-2">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Update Product'}
              </button>
              <Link href="/admin" className="btn-secondary w-full py-3 text-center block">Cancel</Link>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
