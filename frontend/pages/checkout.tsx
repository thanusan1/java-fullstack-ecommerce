import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { ShieldCheck, CreditCard, Truck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/lib/api';
import { OrderRequest } from '@/types';
import { formatPrice, getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

// Simple react-hook-form replacement using native state
export default function CheckoutPage() {
  const router              = useRouter();
  const { cart, fetchCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [placing, setPlacing]     = useState(false);
  const [step, setStep]           = useState<'address' | 'payment'>('address');

  const [form, setForm] = useState<OrderRequest>({
    shippingFullName: user ? `${user.firstName} ${user.lastName}` : '',
    shippingPhone:    user?.phone || '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity:     '',
    shippingState:    '',
    shippingPostal:   '',
    shippingCountry:  'US',
    notes:            '',
    paymentMethod:    'CREDIT_CARD',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderRequest, string>>>({});

  useEffect(() => {
    if (!isAuthenticated) router.push('/login?returnUrl=/checkout');
  }, [isAuthenticated, router]);

  const subtotal = cart?.subtotal ?? 0;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  const validate = () => {
    const e: typeof errors = {};
    if (!form.shippingFullName.trim()) e.shippingFullName = 'Full name is required';
    if (!form.shippingAddress1.trim()) e.shippingAddress1 = 'Address is required';
    if (!form.shippingCity.trim())     e.shippingCity     = 'City is required';
    if (!form.shippingState.trim())    e.shippingState    = 'State is required';
    if (!form.shippingPostal.trim())   e.shippingPostal   = 'Postal code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    try {
      setPlacing(true);
      const res = await ordersApi.place(form);
      await fetchCart();
      toast.success('Order placed successfully! 🎉');
      router.push(`/dashboard/orders/${res.data.data.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setPlacing(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder, half = false }: {
    label: string; name: keyof OrderRequest; type?: string;
    placeholder?: string; half?: boolean;
  }) => (
    <div className={half ? 'sm:col-span-1' : 'sm:col-span-2'}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[name] as string}
        onChange={e => { setForm(f => ({ ...f, [name]: e.target.value })); setErrors(er => ({ ...er, [name]: undefined })); }}
        placeholder={placeholder}
        className={`input-field ${errors[name] ? 'input-error' : ''}`}
      />
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  if (!isAuthenticated || !cart || cart.items.length === 0) return null;

  return (
    <Layout title="Checkout — ShopSphere">
      <div className="container-app py-8 max-w-5xl">
        <h1 className="page-heading mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {[
            { id: 'address', label: '1. Shipping', icon: Truck },
            { id: 'payment', label: '2. Payment',  icon: CreditCard },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => step === 'payment' && s.id === 'address' && setStep('address')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                step === s.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 'address' ? (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary-600" /> Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name *"   name="shippingFullName" placeholder="John Doe" />
                  <Field label="Phone"         name="shippingPhone"    placeholder="+1 555 000 1234" half />
                  <div className="hidden sm:block sm:col-span-1" />
                  <Field label="Address Line 1 *" name="shippingAddress1" placeholder="123 Main Street" />
                  <Field label="Address Line 2"   name="shippingAddress2" placeholder="Apt, Suite, etc." />
                  <Field label="City *"    name="shippingCity"   placeholder="San Francisco" half />
                  <Field label="State *"   name="shippingState"  placeholder="CA"            half />
                  <Field label="Postal Code *" name="shippingPostal"  placeholder="94105" half />
                  <Field label="Country *"     name="shippingCountry" placeholder="US"     half />
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (optional)</label>
                    <textarea
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Special delivery instructions..."
                      rows={3}
                      className="input-field resize-none"
                    />
                  </div>
                </div>
                <button
                  onClick={() => { if (validate()) setStep('payment'); }}
                  className="btn-primary mt-6 w-full py-3"
                >
                  Continue to Payment
                </button>
              </div>
            ) : (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary-600" /> Payment Method
                </h2>

                <div className="space-y-3">
                  {[
                    { value: 'CREDIT_CARD', label: 'Credit Card',  desc: 'Visa, Mastercard, Amex' },
                    { value: 'PAYPAL',      label: 'PayPal',        desc: 'Pay with your PayPal account' },
                    { value: 'COD',         label: 'Cash on Delivery', desc: 'Pay when you receive' },
                  ].map(m => (
                    <label key={m.value}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                        form.paymentMethod === m.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={m.value}
                        checked={form.paymentMethod === m.value}
                        onChange={() => setForm(f => ({ ...f, paymentMethod: m.value }))}
                        className="accent-primary-600"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{m.label}</p>
                        <p className="text-xs text-gray-500">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-5 p-3 bg-green-50 rounded-lg border border-green-200">
                  <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="text-xs text-green-700">Your payment information is encrypted and secure.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button onClick={() => setStep('address')} className="btn-secondary flex-1 py-3">
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="btn-primary flex-1 py-3 font-semibold"
                  >
                    {placing ? 'Placing Order...' : `Place Order · ${formatPrice(total)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card p-5 h-fit lg:sticky lg:top-24">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 truncate mr-2 flex-1">{item.productName} × {item.quantity}</span>
                  <span className="font-medium flex-shrink-0">{formatPrice(item.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tax (8%)</span><span>{formatPrice(tax)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                <span>Total</span><span className="text-primary-600">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
