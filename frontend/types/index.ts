// ============================================================
// ShopSphere — Shared TypeScript Types
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ─── Auth ────────────────────────────────────────────────────
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

// ─── Category ────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  children?: Category[];
}

// ─── Product ─────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  discountPercent?: number;
  stockQuantity: number;
  inStock: boolean;
  sku?: string;
  brand?: string;
  category: Category;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
}

export interface ProductFilters {
  page?: number;
  size?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'name';
  categoryId?: number;
  search?: string;
}

// ─── Cart ────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productImage?: string;
  productPrice: number;
  quantity: number;
  lineTotal: number;
  availableStock: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}

// ─── Order ───────────────────────────────────────────────────
export type OrderStatus =
  | 'PENDING' | 'CONFIRMED' | 'PROCESSING'
  | 'SHIPPED'  | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSku?: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  shippingFullName: string;
  shippingPhone?: string;
  shippingAddress1: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostal: string;
  shippingCountry: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderRequest {
  shippingFullName: string;
  shippingPhone?: string;
  shippingAddress1: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostal: string;
  shippingCountry: string;
  notes?: string;
  paymentMethod: string;
}
