import apiClient from '@/lib/apiClient';
import {
  ApiResponse, PageResponse,
  AuthResponse, LoginRequest, RegisterRequest, User,
  Category, Product, ProductFilters,
  Cart, Order, OrderRequest,
} from '@/types';

// ─── Auth ────────────────────────────────────────────────────
export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data),

  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data),

  me: () =>
    apiClient.get<ApiResponse<User>>('/auth/me'),
};

// ─── Products ────────────────────────────────────────────────
export const productsApi = {
  getAll: (filters: ProductFilters = {}) =>
    apiClient.get<ApiResponse<PageResponse<Product>>>('/products', { params: filters }),

  getFeatured: () =>
    apiClient.get<ApiResponse<Product[]>>('/products/featured'),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Product>>(`/products/${slug}`),

  create: (data: Partial<Product>) =>
    apiClient.post<ApiResponse<Product>>('/products', data),

  update: (id: number, data: Partial<Product>) =>
    apiClient.put<ApiResponse<Product>>(`/products/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/products/${id}`),
};

// ─── Categories ──────────────────────────────────────────────
export const categoriesApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Category[]>>('/categories'),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Category>>(`/categories/${slug}`),
};

// ─── Cart ────────────────────────────────────────────────────
export const cartApi = {
  get: () =>
    apiClient.get<ApiResponse<Cart>>('/cart'),

  addItem: (productId: number, quantity = 1) =>
    apiClient.post<ApiResponse<Cart>>('/cart/items', null, {
      params: { productId, quantity },
    }),

  updateItem: (itemId: number, quantity: number) =>
    apiClient.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, null, {
      params: { quantity },
    }),

  removeItem: (itemId: number) =>
    apiClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`),

  clear: () =>
    apiClient.delete<ApiResponse<void>>('/cart'),
};

// ─── Orders ──────────────────────────────────────────────────
export const ordersApi = {
  getMyOrders: (page = 0, size = 10) =>
    apiClient.get<ApiResponse<PageResponse<Order>>>('/orders/my-orders', {
      params: { page, size },
    }),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Order>>(`/orders/my-orders/${id}`),

  place: (data: OrderRequest) =>
    apiClient.post<ApiResponse<Order>>('/orders', data),

  updateStatus: (id: number, status: string) =>
    apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, null, {
      params: { status },
    }),
};
