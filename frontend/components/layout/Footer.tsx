import React from 'react';
import Link from 'next/link';
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Shop<span className="text-primary-400">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your one-stop destination for premium products across electronics, fashion, home goods, and more.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center
                             hover:bg-primary-600 transition-colors duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'All Products',  href: '/products' },
                { label: 'Electronics',   href: '/products?categoryId=1' },
                { label: 'Clothing',      href: '/products?categoryId=2' },
                { label: 'Home & Garden', href: '/products?categoryId=3' },
                { label: 'Sports',        href: '/products?categoryId=5' },
                { label: 'Beauty',        href: '/products?categoryId=6' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white font-semibold mb-4">Account</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'My Account',  href: '/dashboard' },
                { label: 'My Orders',   href: '/dashboard/orders' },
                { label: 'Sign In',     href: '/login' },
                { label: 'Register',    href: '/register' },
                { label: 'Cart',        href: '/cart' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">123 Commerce Street, San Francisco, CA 94105</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="tel:+15550001234" className="text-sm text-gray-400 hover:text-white transition-colors">
                  +1 (555) 000-1234
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:support@shopsphere.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                  support@shopsphere.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-app py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ShopSphere. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(label => (
              <a key={label} href="#"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
