import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head><title>404 — Page Not Found | ShopSphere</title></Head>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-md">
          <div className="text-8xl font-extrabold text-primary-600 mb-2">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h1>
          <p className="text-gray-500 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">Go Home</Link>
            <Link href="/products" className="btn-secondary">Browse Products</Link>
          </div>
        </div>
      </div>
    </>
  );
}
