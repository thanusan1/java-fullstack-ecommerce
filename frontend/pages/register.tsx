import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Package, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/utils/helpers';
import Head from 'next/head';

export default function RegisterPage() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '',
  });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const passwordRules = [
    { label: 'At least 8 characters', valid: form.password.length >= 8 },
    { label: 'One uppercase letter',  valid: /[A-Z]/.test(form.password) },
    { label: 'One lowercase letter',  valid: /[a-z]/.test(form.password) },
    { label: 'One number',            valid: /\d/.test(form.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!passwordRules.every(r => r.valid)) {
      setError('Password does not meet requirements');
      return;
    }
    try {
      setLoading(true);
      await register(form);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <Head><title>Create Account — ShopSphere</title></Head>
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="card p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-2 justify-center">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  Shop<span className="text-primary-600">Sphere</span>
                </span>
              </Link>
              <h1 className="mt-4 text-xl font-bold text-gray-900">Create your account</h1>
              <p className="text-sm text-gray-500 mt-1">Start shopping today</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" value={form.firstName} onChange={set('firstName')}
                    placeholder="John" required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" value={form.lastName} onChange={set('lastName')}
                    placeholder="Doe" required className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input type="email" value={form.email} onChange={set('email')}
                  placeholder="you@example.com" required className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                <input type="tel" value={form.phone} onChange={set('phone')}
                  placeholder="+1 555 000 1234" className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password}
                    onChange={set('password')} placeholder="••••••••" required
                    className="input-field pr-10" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength */}
                {form.password && (
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {passwordRules.map(r => (
                      <div key={r.label} className={`flex items-center gap-1 text-xs ${r.valid ? 'text-green-600' : 'text-gray-400'}`}>
                        <Check className={`w-3 h-3 ${r.valid ? 'opacity-100' : 'opacity-30'}`} />
                        {r.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 font-semibold text-base">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
            </p>

            <p className="text-center text-xs text-gray-400 mt-3">
              By creating an account, you agree to our{' '}
              <a href="#" className="underline">Terms of Service</a> and{' '}
              <a href="#" className="underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
