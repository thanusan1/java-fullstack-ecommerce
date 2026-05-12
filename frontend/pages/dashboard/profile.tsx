import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
    phone:     user?.phone     || '',
  });
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      // Profile update endpoint can be wired here
      await new Promise(r => setTimeout(r, 800));
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <Layout title="My Profile — ShopSphere">
      <div className="container-app py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="page-heading">My Profile</h1>
        </div>

        <div className="card p-8">
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-700 font-bold text-xl">
                {user?.firstName[0]}{user?.lastName[0]}
              </span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="badge bg-primary-100 text-primary-700 mt-1">{user?.role}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" value={form.firstName} onChange={set('firstName')}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input type="text" value={form.lastName} onChange={set('lastName')}
                  className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={form.email} onChange={set('email')}
                className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" value={form.phone} onChange={set('phone')}
                placeholder="+1 555 000 1234" className="input-field" />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button type="submit" disabled={saving}
                className="btn-primary gap-2 px-6 py-2.5">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link href="/dashboard" className="btn-secondary px-6 py-2.5">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
