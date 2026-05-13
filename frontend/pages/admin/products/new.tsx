import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { productsApi, categoriesApi, uploadsApi } from '@/lib/api';
import { Category } from '@/types';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

interface ProductForm {
  name: string; description: string; price: string; comparePrice: string;
  stockQuantity: string; sku: string; brand: string; categoryId: string;
  imageUrl: string; featured: boolean; active: boolean;
}

const EMPTY: ProductForm = {
  name: '', description: '', price: '', comparePrice: '',
  stockQuantity: '0', sku: '', brand: '', categoryId: '',
  imageUrl: '', featured: false, active: true,
};

export default function NewProductPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router     = useRouter();
  const editId     = router.query.id ? Number(router.query.id) : null;

  const [form, setForm]         = useState<ProductForm>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [errors, setErrors]     = useState<Partial<ProductForm>>({});

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) { router.push('/'); return; }
    categoriesApi.getAll().then(r => setCategories(r.data.data)).catch(() => {});

    if (editId) {
      productsApi.getBySlug(String(editId)).catch(() => {});
    }
  }, [isAuthenticated, isAdmin, editId]);

  useEffect(() => {
    setImageError(false);
  }, [form.imageUrl]);

  const set = (k: keyof ProductForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }));

  const validate = () => {
    const e: Partial<ProductForm> = {};
    if (!form.name.trim())       e.name       = 'Required';
    if (!form.price)             e.price      = 'Required';
    if (!form.stockQuantity)     e.stockQuantity = 'Required';
    if (!form.categoryId)        e.categoryId = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = {
        ...form,
        price:         parseFloat(form.price),
        comparePrice:  form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        stockQuantity: parseInt(form.stockQuantity),
        categoryId:    parseInt(form.categoryId),
      };
      await productsApi.create(payload as any);
      toast.success('Product created successfully!');
      router.push('/admin');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const res = await uploadsApi.uploadProductImage(file);
      setForm(f => ({ ...f, imageUrl: res.data.data }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder, required = false, half = false }: {
    label: string; name: keyof ProductForm; type?: string;
    placeholder?: string; required?: boolean; half?: boolean;
  }) => (
    <div className={half ? '' : 'col-span-2 sm:col-span-1'}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={form[name] as string}
        onChange={set(name)}
        placeholder={placeholder}
        className={`input-field ${errors[name] ? 'input-error' : ''}`}
      />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{String(errors[name])}</p>}
    </div>
  );

  return (
    <Layout title="New Product — Admin">
      <div className="container-app py-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="page-heading">{editId ? 'Edit Product' : 'New Product'}</h1>
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
                      placeholder="e.g. iPhone 15 Pro Max" className={`input-field ${errors.name ? 'input-error' : ''}`} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={form.description} onChange={set('description')}
                      rows={4} placeholder="Detailed product description..."
                      className="input-field resize-none" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (USD) <span className="text-red-500">*</span>
                      </label>
                      <input type="number" step="0.01" min="0" value={form.price} onChange={set('price')}
                        placeholder="0.00" className={`input-field ${errors.price ? 'input-error' : ''}`} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Compare at Price</label>
                      <input type="number" step="0.01" min="0" value={form.comparePrice} onChange={set('comparePrice')}
                        placeholder="0.00" className="input-field" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-bold text-gray-900 mb-4">Inventory</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input type="number" min="0" value={form.stockQuantity} onChange={set('stockQuantity')}
                      className={`input-field ${errors.stockQuantity ? 'input-error' : ''}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input type="text" value={form.sku} onChange={set('sku')}
                      placeholder="PROD-001" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input type="text" value={form.brand} onChange={set('brand')}
                      placeholder="Apple, Samsung..." className="input-field" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-bold text-gray-900 mb-4">Media</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="input-field"
                  />
                  {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}

                  <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Image URL</label>
                  <input type="url" value={form.imageUrl} onChange={set('imageUrl')}
                    placeholder="https://example.com/image.jpg" className="input-field" />
                  {form.imageUrl && (
                    <div className="mt-3 w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      {!imageError ? (
                        <img
                          src={form.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-2 text-center text-xs text-gray-500">
                          Preview unavailable
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="card p-5">
                <h2 className="font-bold text-gray-900 mb-4">Organization</h2>
                <div className="space-y-3">
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
                    {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <h2 className="font-bold text-gray-900 mb-4">Settings</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.active}
                      onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                      className="w-4 h-4 accent-primary-600 rounded" />
                    <span className="text-sm font-medium text-gray-700">Active (visible to customers)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.featured}
                      onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                      className="w-4 h-4 accent-primary-600 rounded" />
                    <span className="text-sm font-medium text-gray-700">Featured on homepage</span>
                  </label>
                </div>
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full py-3 font-semibold gap-2">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Product'}
              </button>
              <Link href="/admin" className="btn-secondary w-full py-3 text-center block">
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
