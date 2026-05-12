# ShopSphere — Complete Project Reference Guide

## A. Full Project Folder Structure

```
shopsphere/
│
├── README.md
├── .gitignore
│
├── database/
│   ├── schema.sql              ← Full DDL: tables, indexes, constraints
│   └── seed.sql                ← Demo categories, products, users
│
├── backend/                    ← Spring Boot Maven project
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/shopsphere/
│           │   ├── ShopSphereApplication.java
│           │   ├── config/
│           │   │   └── SecurityConfig.java
│           │   ├── controller/
│           │   │   ├── AuthController.java
│           │   │   ├── ProductController.java
│           │   │   ├── CategoryController.java
│           │   │   ├── CartController.java
│           │   │   └── OrderController.java
│           │   ├── service/
│           │   │   ├── AuthService.java
│           │   │   ├── ProductService.java
│           │   │   ├── CategoryService.java
│           │   │   ├── CartService.java
│           │   │   └── OrderService.java
│           │   ├── repository/
│           │   │   ├── UserRepository.java
│           │   │   ├── ProductRepository.java
│           │   │   ├── CategoryRepository.java
│           │   │   ├── CartRepository.java
│           │   │   └── OrderRepository.java
│           │   ├── entity/
│           │   │   ├── User.java
│           │   │   ├── Product.java
│           │   │   ├── Category.java
│           │   │   ├── Cart.java
│           │   │   ├── CartItem.java
│           │   │   ├── Order.java
│           │   │   └── OrderItem.java
│           │   ├── dto/
│           │   │   ├── request/
│           │   │   │   ├── LoginRequest.java
│           │   │   │   ├── RegisterRequest.java
│           │   │   │   ├── ProductRequest.java
│           │   │   │   └── OrderRequest.java
│           │   │   └── response/
│           │   │       ├── ApiResponse.java
│           │   │       ├── AuthResponse.java
│           │   │       ├── UserResponse.java
│           │   │       ├── ProductResponse.java
│           │   │       ├── CategoryResponse.java
│           │   │       ├── CartResponse.java
│           │   │       └── OrderResponse.java
│           │   ├── security/
│           │   │   ├── JwtTokenProvider.java
│           │   │   └── JwtAuthenticationFilter.java
│           │   └── exception/
│           │       ├── GlobalExceptionHandler.java
│           │       ├── ResourceNotFoundException.java
│           │       ├── DuplicateResourceException.java
│           │       └── BusinessException.java
│           └── resources/
│               └── application.properties
│
└── frontend/                   ← Next.js TypeScript project
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    ├── styles/
    │   └── globals.css
    ├── types/
    │   └── index.ts
    ├── lib/
    │   ├── apiClient.ts        ← Axios instance + interceptors
    │   └── api.ts              ← All API call functions
    ├── utils/
    │   └── helpers.ts
    ├── context/
    │   ├── AuthContext.tsx
    │   └── CartContext.tsx
    ├── components/
    │   ├── layout/
    │   │   ├── Layout.tsx
    │   │   ├── Navbar.tsx
    │   │   └── Footer.tsx
    │   ├── product/
    │   │   ├── ProductCard.tsx
    │   │   └── ProductGrid.tsx
    │   └── ui/
    │       └── Pagination.tsx
    └── pages/
        ├── _app.tsx
        ├── index.tsx           ← Homepage
        ├── login.tsx
        ├── register.tsx
        ├── cart.tsx
        ├── checkout.tsx
        ├── 404.tsx
        ├── products/
        │   ├── index.tsx       ← Listing + filters
        │   └── [slug].tsx      ← Detail (SSR)
        ├── dashboard/
        │   ├── index.tsx
        │   ├── profile.tsx
        │   └── orders/
        │       ├── index.tsx
        │       └── [id].tsx
        └── admin/
            ├── index.tsx
            └── products/
                ├── new.tsx
                └── [id]/
                    └── edit.tsx
```

---

## B. Complete API Endpoint Reference

### Base URL: `http://localhost:8080/api/v1`

---

### AUTH

#### POST /auth/register
```json
// Request body
{
  "firstName": "Jane",
  "lastName":  "Doe",
  "email":     "jane@example.com",
  "password":  "Secure@123",
  "phone":     "+1-555-0100"
}

// Response 201
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType":   "Bearer",
    "user": {
      "id": 3, "firstName": "Jane", "lastName": "Doe",
      "email": "jane@example.com", "role": "USER"
    }
  }
}
```

#### POST /auth/login
```json
// Request body
{ "email": "jane@example.com", "password": "Secure@123" }

// Response 200
{ "success": true, "data": { "accessToken": "...", "user": { ... } } }
```

#### GET /auth/me  _(Bearer required)_
```json
// Response 200
{
  "success": true,
  "data": { "id": 3, "firstName": "Jane", "email": "jane@example.com", "role": "USER" }
}
```

---

### PRODUCTS

#### GET /products?page=0&size=12&sort=newest&categoryId=1&search=phone
```json
// Response 200
{
  "success": true,
  "data": {
    "content": [ { "id": 1, "name": "iPhone 15 Pro", "price": 1199.99, ... } ],
    "totalElements": 45,
    "totalPages": 4,
    "number": 0,
    "size": 12
  }
}
```

#### GET /products/featured
```json
// Response 200
{ "success": true, "data": [ { "id": 1, ... }, { "id": 3, ... } ] }
```

#### GET /products/{slug}
```json
// Response 200
{
  "success": true,
  "data": {
    "id": 1, "name": "iPhone 15 Pro Max", "slug": "iphone-15-pro-max-256gb",
    "price": 1199.99, "comparePrice": 1299.99, "discountPercent": 8,
    "stockQuantity": 45, "inStock": true,
    "rating": 4.8, "reviewCount": 324,
    "category": { "id": 7, "name": "Smartphones", "slug": "smartphones" }
  }
}
```

#### POST /products  _(ADMIN Bearer required)_
```json
// Request body
{
  "name": "New Product", "description": "...", "price": 99.99,
  "comparePrice": 129.99, "stockQuantity": 50,
  "sku": "PROD-001", "brand": "BrandX", "categoryId": 1,
  "imageUrl": "https://example.com/img.jpg", "featured": false
}
```

---

### CART  _(USER Bearer required for all)_

#### GET /cart
```json
{
  "success": true,
  "data": {
    "id": 1, "totalItems": 3, "subtotal": 349.97,
    "items": [
      {
        "id": 5, "productId": 4, "productName": "Sony WH-1000XM5",
        "productImage": "https://...", "productPrice": 349.99,
        "quantity": 1, "lineTotal": 349.99, "availableStock": 67
      }
    ]
  }
}
```

#### POST /cart/items?productId=4&quantity=1
#### PUT  /cart/items/{itemId}?quantity=2
#### DELETE /cart/items/{itemId}
#### DELETE /cart

---

### ORDERS  _(USER Bearer required)_

#### POST /orders
```json
// Request body
{
  "shippingFullName": "Jane Doe",
  "shippingPhone":    "+1-555-0100",
  "shippingAddress1": "123 Main St",
  "shippingCity":     "San Francisco",
  "shippingState":    "CA",
  "shippingPostal":   "94105",
  "shippingCountry":  "US",
  "paymentMethod":    "CREDIT_CARD"
}

// Response 201
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": 7, "orderNumber": "SS-20240601-1001",
    "status": "PENDING", "totalAmount": 387.36,
    "items": [ ... ]
  }
}
```

#### GET /orders/my-orders?page=0&size=10
#### GET /orders/my-orders/{id}

#### PATCH /orders/{id}/status?status=SHIPPED  _(ADMIN only)_

---

## C. How Frontend Connects to Backend

```
┌─────────────────────────────────────────────────────────────────┐
│  NEXT.JS FRONTEND (localhost:3000)                              │
│                                                                  │
│  1. User submits login form                                      │
│  2. AuthContext.login() calls authApi.login()                    │
│  3. authApi.login() calls apiClient.post('/auth/login', ...)     │
│  4. apiClient = Axios instance with baseURL = localhost:8080/... │
│     ┌───────────────────────────────────────────────────────┐   │
│     │ Request interceptor: reads localStorage 'token'       │   │
│     │ Attaches header: Authorization: Bearer <jwt>          │   │
│     │ Response interceptor: on 401 → clear storage, /login  │   │
│     └───────────────────────────────────────────────────────┘   │
│  5. Response: { accessToken, user }                              │
│  6. Store token in localStorage, user in AuthContext state       │
│  7. Cart/Orders auto-fetch on auth state change                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    CORS-allowed HTTP
                              │
┌─────────────────────────────────────────────────────────────────┐
│  SPRING BOOT BACKEND (localhost:8080)                           │
│                                                                  │
│  SecurityConfig allows origin: http://localhost:3000            │
│                                                                  │
│  Every request hits JwtAuthenticationFilter first:              │
│  → Parse Bearer token → Validate → Set SecurityContext          │
│                                                                  │
│  Controllers → Services → Repositories → MySQL                  │
│  All responses wrapped in ApiResponse<T>                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## D. Step-by-Step Local Setup

### Prerequisites
```
Java 17+      → java -version
Maven 3.8+    → mvn -version
Node.js 18+   → node -version
MySQL 8.0+    → mysql --version
```

### Step 1 — Database
```bash
mysql -u root -p
CREATE DATABASE shopsphere CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit

mysql -u root -p shopsphere < database/schema.sql
mysql -u root -p shopsphere < database/seed.sql
```

### Step 2 — Backend
```bash
cd backend

# Edit application.properties:
# spring.datasource.password=YOUR_MYSQL_PASSWORD

./mvnw spring-boot:run

# ✅ Server starts at http://localhost:8080
# Test: curl http://localhost:8080/api/v1/products/featured
```

### Step 3 — Frontend
```bash
cd frontend
cp .env.example .env.local
# .env.local already set to http://localhost:8080/api/v1

npm install
npm run dev

# ✅ App starts at http://localhost:3000
```

### Step 4 — Test the app
```
1. Open http://localhost:3000
2. Browse products (no login needed)
3. Login: john@example.com / User@123
4. Add items to cart → checkout
5. Admin login: admin@shopsphere.com / Admin@123
6. Visit http://localhost:3000/admin
```

---

## E. Architecture Patterns Used

### Backend
- **Layered Architecture** — Controller → Service → Repository → Entity
- **DTO Pattern** — Separate request/response DTOs from domain entities
- **Repository Pattern** — Spring Data JPA abstracts DB access
- **Global Exception Handler** — `@RestControllerAdvice` returns consistent error shapes
- **Stateless JWT Auth** — No sessions; token contains all claims
- **Soft Delete** — Products set `active=false` rather than hard-deleted
- **Price Snapshot** — Order items copy price at time of purchase (audit trail)

### Frontend
- **Context + Hook pattern** — `AuthContext`, `CartContext` with custom `useAuth()`, `useCart()`
- **Axios interceptors** — Cross-cutting token injection and error handling
- **SSR for SEO** — Product detail pages use `getServerSideProps`
- **Optimistic UI** — Cart state updated immediately, errors rolled back
- **Component composition** — `Layout` wraps every page; reusable `ProductCard`, `Pagination`
