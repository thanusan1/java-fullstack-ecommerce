import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Headphones, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/product/ProductGrid';
import { productsApi, categoriesApi } from '@/lib/api';
import { Product, Category } from '@/types';

export default function HomePage() {
  const [featured, setFeatured]     = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, catRes] = await Promise.all([
          productsApi.getFeatured(),
          categoriesApi.getAll(),
        ]);
        setFeatured(featRes.data.data);
        setCategories(catRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="ShopSphere — Modern E-Commerce Platform">
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
        />

        <div className="container-app relative py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full
                             text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Trusted by 50,000+ customers
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Discover Your <br />
              <span className="text-amber-400">Perfect</span> Products
            </h1>

            <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl leading-relaxed">
              Shop the latest electronics, fashion, home goods, and more — all with fast shipping,
              easy returns, and unbeatable prices.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/products" className="btn-primary bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 text-base font-semibold">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/products?featured=true" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium">
                View Featured <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative shapes */}
        <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block opacity-20">
          <div className="absolute right-10 top-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute right-40 bottom-10 w-48 h-48 bg-amber-400 rounded-full blur-2xl" />
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-app py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck,         title: 'Free Shipping',     desc: 'On orders over $100' },
              { icon: RefreshCw,     title: 'Easy Returns',      desc: '30-day return policy' },
              { icon: ShieldCheck,   title: 'Secure Payments',   desc: 'SSL encrypted checkout' },
              { icon: Headphones,    title: '24/7 Support',      desc: 'Dedicated help centre' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="container-app py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="page-heading">Shop by Category</h2>
            <p className="text-gray-500 mt-1">Find exactly what you're looking for</p>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
            All categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(categories.length > 0 ? categories : PLACEHOLDER_CATEGORIES).slice(0, 6).map(cat => (
            <Link key={cat.id} href={`/products?categoryId=${cat.id}`}
              className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100
                         hover:border-primary-200 hover:shadow-md transition-all duration-200 text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 bg-gray-100">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-50 flex items-center justify-center">
                    <span className="text-2xl">{cat.name[0]}</span>
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-gray-50 py-16">
        <div className="container-app">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="page-heading">Featured Products</h2>
              <p className="text-gray-500 mt-1">Hand-picked by our team</p>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={featured} isLoading={loading} columns={4} />
        </div>
      </section>

      {/* ── Banner CTA ── */}
      <section className="container-app py-16">
        <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden p-10 md:p-16">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Get 20% off your first order
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Sign up for our newsletter and unlock exclusive deals, new arrivals, and more.
            </p>
            <form className="flex gap-3 flex-col sm:flex-row max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-sm bg-white/10 border border-white/20
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button type="submit" className="btn-primary bg-primary-500 hover:bg-primary-400 px-6 py-3 whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute left-1/2 bottom-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl translate-y-1/2" />
        </div>
      </section>
    </Layout>
  );
}

const PLACEHOLDER_CATEGORIES: Category[] = [
  { id: 1, name: 'Electronics',   slug: 'electronics',   imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200' },
  { id: 2, name: 'Clothing',      slug: 'clothing',      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200' },
  { id: 3, name: 'Home & Garden', slug: 'home-garden',   imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200' },
  { id: 4, name: 'Books',         slug: 'books',         imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200' },
  { id: 5, name: 'Sports',        slug: 'sports',        imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200' },
  { id: 6, name: 'Beauty',        slug: 'beauty',        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200' },
];
