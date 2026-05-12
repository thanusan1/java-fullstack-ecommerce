import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { SlidersHorizontal, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/product/ProductGrid';
import Pagination from '@/components/ui/Pagination';
import { productsApi, categoriesApi } from '@/lib/api';
import { Product, Category, PageResponse } from '@/types';

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'name',       label: 'Name A–Z' },
];

export default function ProductsPage() {
  const router = useRouter();

  const [data, setData]           = useState<PageResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const search     = (router.query.search     as string) || '';
  const categoryId = router.query.categoryId  ? Number(router.query.categoryId)  : undefined;
  const sort       = (router.query.sort       as string) || 'newest';
  const page       = router.query.page        ? Number(router.query.page) - 1     : 0;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.getAll({ search, categoryId, sort, page, size: 12 });
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, sort, page]);

  useEffect(() => {
    if (router.isReady) fetchProducts();
  }, [router.isReady, fetchProducts]);

  useEffect(() => {
    categoriesApi.getAll().then(r => setCategories(r.data.data)).catch(() => {});
  }, []);

  const updateQuery = (params: Record<string, string | number | undefined>) => {
    router.push({
      pathname: '/products',
      query: {
        ...Object.fromEntries(
          Object.entries({ search, categoryId, sort, ...params })
            .filter(([, v]) => v !== undefined && v !== '' && v !== null)
        ),
        page: 1,
      },
    }, undefined, { shallow: true });
  };

  const activeCategory = categories.find(c => c.id === categoryId);
  const pageTitle = search
    ? `Search: "${search}"`
    : activeCategory
    ? activeCategory.name
    : 'All Products';

  return (
    <Layout title={`${pageTitle} — ShopSphere`}>
      <div className="container-app py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="page-heading">{pageTitle}</h1>
            {data && (
              <p className="text-sm text-gray-500 mt-1">
                {data.totalElements} product{data.totalElements !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            {/* Sort */}
            <select
              value={sort}
              onChange={e => updateQuery({ sort: e.target.value })}
              className="input-field w-full sm:w-auto py-2 text-sm"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden btn-secondary py-2 gap-2 w-full sm:w-auto"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Active filters */}
        {(search || categoryId) && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-sm text-gray-500">Filters:</span>
            {search && (
              <span className="badge bg-primary-100 text-primary-700 flex items-center gap-1 px-3 py-1">
                Search: {search}
                <button onClick={() => updateQuery({ search: undefined })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {categoryId && activeCategory && (
              <span className="badge bg-primary-100 text-primary-700 flex items-center gap-1 px-3 py-1">
                {activeCategory.name}
                <button onClick={() => updateQuery({ categoryId: undefined })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => router.push('/products')}
              className="text-xs text-red-500 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* ── Sidebar (desktop) ── */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <FilterPanel
              categories={categories}
              selectedCategoryId={categoryId}
              onSelectCategory={id => updateQuery({ categoryId: id })}
            />
          </aside>

          {/* ── Mobile sidebar ── */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <div className="relative ml-auto w-72 bg-white h-full shadow-xl p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <FilterPanel
                  categories={categories}
                  selectedCategoryId={categoryId}
                  onSelectCategory={id => { updateQuery({ categoryId: id }); setSidebarOpen(false); }}
                />
              </div>
            </div>
          )}

          {/* ── Products ── */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={data?.content ?? []}
              isLoading={loading}
              columns={3}
            />
            {data && (
              <Pagination
                currentPage={data.number}
                totalPages={data.totalPages}
                onPageChange={p => updateQuery({ page: p + 1 })}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ── Filter Panel ──────────────────────────────────────────────
function FilterPanel({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: {
  categories: Category[];
  selectedCategoryId?: number;
  onSelectCategory: (id: number | undefined) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
        <ul className="space-y-1.5">
          <li>
            <button
              onClick={() => onSelectCategory(undefined)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                !selectedCategoryId
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <button
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  selectedCategoryId === cat.id
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
              {cat.children && cat.children.length > 0 && (
                <ul className="ml-4 mt-1 space-y-1">
                  {cat.children.map(child => (
                    <li key={child.id}>
                      <button
                        onClick={() => onSelectCategory(child.id)}
                        className={`w-full text-left text-xs px-3 py-1.5 rounded-lg transition-colors ${
                          selectedCategoryId === child.id
                            ? 'text-primary-600 font-medium'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {child.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
