import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ShoppingCart, Search, User, Menu, X,
  ChevronDown, Package, LogOut, Settings,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { cn } from '@/utils/helpers';

export default function Navbar() {
  const router              = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems }      = useCart();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [userOpen, setUserOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [router.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'bg-white shadow-md' : 'bg-white border-b border-gray-200'
      )}
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Shop<span className="text-primary-600">Sphere</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products"
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary-600',
                router.pathname.startsWith('/products') ? 'text-primary-600' : 'text-gray-600'
              )}>
              Products
            </Link>
            <Link href="/products?categoryId=1"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Electronics
            </Link>
            <Link href="/products?categoryId=2"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Clothing
            </Link>
            <Link href="/products?categoryId=3"
              className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Home
            </Link>
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white
                                 text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg
                             text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-xs">
                      {user?.firstName[0]}{user?.lastName[0]}
                    </span>
                  </div>
                  <span className="max-w-[120px] truncate">{user?.firstName}</span>
                  <ChevronDown className={cn('w-4 h-4 transition-transform', userOpen && 'rotate-180')} />
                </button>

                {userOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg
                                  border border-gray-100 py-1 animate-fade-in z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm
                          text-gray-700 hover:bg-gray-50 transition-colors">
                      <User className="w-4 h-4" /> My Account
                    </Link>
                    <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm
                          text-gray-700 hover:bg-gray-50 transition-colors">
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm
                            text-primary-600 hover:bg-primary-50 transition-colors">
                        <Settings className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1">
                      <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5
                             text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="btn-secondary py-2 text-sm">Sign In</Link>
                <Link href="/register" className="btn-primary py-2 text-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-up">
          <div className="container-app py-4 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </form>

            <nav className="flex flex-col gap-1">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/products?categoryId=1', label: 'Electronics' },
                { href: '/products?categoryId=2', label: 'Clothing' },
                { href: '/products?categoryId=3', label: 'Home & Garden' },
              ].map(link => (
                <Link key={link.href} href={link.href}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  {link.label}
                </Link>
              ))}
            </nav>

            {isAuthenticated ? (
              <div className="border-t border-gray-100 pt-4 space-y-1">
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  <User className="w-4 h-4" /> My Account
                </Link>
                <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Package className="w-4 h-4" /> My Orders
                </Link>
                <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-100 pt-4 flex gap-3">
                <Link href="/login" className="btn-secondary flex-1 py-2 text-sm text-center">Sign In</Link>
                <Link href="/register" className="btn-primary flex-1 py-2 text-sm text-center">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
