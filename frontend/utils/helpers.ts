import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as USD currency */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/** Format a date string to a readable format */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}

/** Get order status badge color */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING:    'bg-yellow-100 text-yellow-800',
    CONFIRMED:  'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-indigo-100 text-indigo-800',
    SHIPPED:    'bg-purple-100 text-purple-800',
    DELIVERED:  'bg-green-100 text-green-800',
    CANCELLED:  'bg-red-100 text-red-800',
    REFUNDED:   'bg-gray-100 text-gray-800',
  };
  return map[status] ?? 'bg-gray-100 text-gray-800';
}

/** Extract error message from axios error */
export function getErrorMessage(error: any): string {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.data?.email ||
    error?.message ||
    'An unexpected error occurred'
  );
}

/** Star rating array helper */
export function getStars(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i)             stars.push('full');
    else if (rating >= i - 0.5) stars.push('half');
    else                         stars.push('empty');
  }
  return stars;
}
