# 🛒 ShopSphere — Modern E-Commerce Platform

<div align="center">

![ShopSphere Banner](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=300&fit=crop)

[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.3-green?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-purple?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)

**A production-grade, full-stack e-commerce platform built for portfolio demonstration.**

[Live Demo](#) · [API Docs](#api-endpoints) · [Report Bug](https://github.com/yourusername/shopsphere/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Frontend–Backend Connection](#-frontendbacked-connection)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## 🌐 Overview

**ShopSphere** is a fully-featured e-commerce web application with a modern React frontend and a robust Java Spring Boot backend. It demonstrates real-world patterns used in production systems: JWT authentication, role-based access control, RESTful API design, layered architecture, and a polished responsive UI.

> Built as a portfolio project to demonstrate Java Full Stack development skills at an industry level.

---

## 🛠 Tech Stack

### Backend
| Technology        | Purpose                          |
|-------------------|----------------------------------|
| Java 17           | Core language                    |
| Spring Boot 3.2   | Application framework            |
| Spring Security   | Authentication & authorization   |
| Spring Data JPA   | ORM / database access            |
| Hibernate         | JPA implementation               |
| MySQL 8.0         | Relational database              |
| JWT (jjwt 0.12)   | Stateless token authentication   |
| Lombok            | Boilerplate reduction            |
| MapStruct         | Object mapping                   |
| Maven             | Build tool                       |

### Frontend
| Technology        | Purpose                          |
|-------------------|----------------------------------|
| Next.js 14        | React framework (SSR/SSG)        |
| TypeScript        | Type-safe JavaScript             |
| Tailwind CSS 3    | Utility-first styling            |
| Axios             | HTTP client with interceptors    |
| React Context     | Global state (Auth, Cart)        |
| react-hot-toast   | Notification system              |
| Lucide React      | Icon library                     |

---

## ✨ Features

### 🛍️ Customer Features
- **Homepage** — Hero section, category grid, featured products, newsletter signup
- **Product listing** — Search, filter by category, sort by price/rating/date, pagination
- **Product detail** — Image, ratings, stock status, quantity selector, add to cart / buy now
- **Shopping cart** — Add/remove/update quantities, subtotal, free shipping progress
- **Checkout** — Multi-step form (shipping address → payment method), order summary
- **User dashboard** — Profile overview, recent orders, account stats
- **Order history** — Paginated list, detailed order view with status tracker
- **Authentication** — Register with password strength checker, login, JWT tokens, auto-logout

### 🔧 Admin Features
- **Admin dashboard** — Product table with stats overview
- **Product management** — Create, edit, soft-delete products with image preview
- **Role-based access** — Admin-only routes protected on both frontend and backend

### 🏗️ Technical Features
- JWT stateless authentication
- Role-based access control (`USER` / `ADMIN`)
- Global exception handling with structured error responses
- Input validation (Bean Validation on backend, client-side on frontend)
- Axios request/response interceptors (auto-attach token, handle 401)
- Responsive design (mobile-first, works on all screen sizes)
- Server-side rendering for product detail pages (SEO-friendly)
- Skeleton loading states throughout

---

## 📁 Project Structure

```
shopsphere/
├── backend/                          # Spring Boot application
│   └── src/main/java/com/shopsphere/
│       ├── ShopSphereApplication.java
│       ├── config/
│       │   └── SecurityConfig.java   # CORS, JWT filter chain, role rules
│       ├── controller/               # REST controllers
│       │   ├── AuthController.java
│       │   ├── ProductController.java
│       │   ├── CategoryController.java
│       │   ├── CartController.java
│       │   └── OrderController.java
│       ├── service/                  # Business logic
│       │   ├── AuthService.java
│       │   ├── ProductService.java
│       │   ├── CategoryService.java
│       │   ├── CartService.java
│       │   └── OrderService.java
│       ├── repository/               # Spring Data JPA repositories
│       ├── entity/                   # JPA entities (User, Product, Cart, Order…)
│       ├── dto/
│       │   ├── request/              # Incoming request bodies
│       │   └── response/             # Outgoing response bodies
│       ├── security/                 # JWT provider + filter
│       └── exception/                # Custom exceptions + global handler
│
├── frontend/                         # Next.js application
│   ├── pages/
│   │   ├── index.tsx                 # Homepage
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── cart.tsx
│   │   ├── checkout.tsx
│   │   ├── 404.tsx
│   │   ├── products/
│   │   │   ├── index.tsx             # Product listing with filters
│   │   │   └── [slug].tsx            # Product detail (SSR)
│   │   ├── dashboard/
│   │   │   ├── index.tsx             # User dashboard
│   │   │   ├── profile.tsx
│   │   │   └── orders/
│   │   │       ├── index.tsx
│   │   │       └── [id].tsx
│   │   └── admin/
│   │       ├── index.tsx             # Admin dashboard
│   │       └── products/
│   │           ├── new.tsx
│   │           └── [id]/edit.tsx
│   ├── components/
│   │   ├── layout/                   # Navbar, Footer, Layout
│   │   ├── product/                  # ProductCard, ProductGrid
│   │   └── ui/                       # Pagination, shared UI
│   ├── context/                      # AuthContext, CartContext
│   ├── lib/                          # apiClient.ts, api.ts
│   ├── types/                        # TypeScript interfaces
│   └── utils/                        # helpers (formatPrice, cn, etc.)
│
└── database/
    ├── schema.sql                    # Full DDL (tables, indexes, FK constraints)
    └── seed.sql                      # Demo data (users, categories, products)
```

---

## 🗄 Database Schema

```
users ──────────────── cart (1:1)
  │                      │
  │                  cart_items (N)
  │                      │
  └──── orders (N)    products (1)
          │               │
      order_items (N) categories (1)
          │
        products (1)
```

**Tables:** `users`, `categories`, `products`, `cart`, `cart_items`, `orders`, `order_items`, `payments`, `addresses`, `reviews`

---

## 📡 API Endpoints

### Authentication — `/api/v1/auth`
| Method | Endpoint        | Auth  | Description              |
|--------|-----------------|-------|--------------------------|
| POST   | `/register`     | ✗     | Register new user        |
| POST   | `/login`        | ✗     | Login, returns JWT token |
| GET    | `/me`           | ✓     | Get current user profile |

### Products — `/api/v1/products`
| Method | Endpoint        | Auth        | Description                          |
|--------|-----------------|-------------|--------------------------------------|
| GET    | `/`             | ✗           | List products (search, filter, sort, paginate) |
| GET    | `/featured`     | ✗           | Get featured products                |
| GET    | `/{slug}`       | ✗           | Get product by slug                  |
| POST   | `/`             | ADMIN       | Create product                       |
| PUT    | `/{id}`         | ADMIN       | Update product                       |
| DELETE | `/{id}`         | ADMIN       | Soft-delete product                  |

### Categories — `/api/v1/categories`
| Method | Endpoint        | Auth  | Description            |
|--------|-----------------|-------|------------------------|
| GET    | `/`             | ✗     | Get all categories     |
| GET    | `/{slug}`       | ✗     | Get category by slug   |

### Cart — `/api/v1/cart`
| Method | Endpoint              | Auth   | Description              |
|--------|-----------------------|--------|--------------------------|
| GET    | `/`                   | USER   | Get user's cart          |
| POST   | `/items?productId&qty`| USER   | Add item to cart         |
| PUT    | `/items/{itemId}`     | USER   | Update item quantity     |
| DELETE | `/items/{itemId}`     | USER   | Remove item from cart    |
| DELETE | `/`                   | USER   | Clear entire cart        |

### Orders — `/api/v1/orders`
| Method | Endpoint              | Auth   | Description              |
|--------|-----------------------|--------|--------------------------|
| GET    | `/my-orders`          | USER   | Get user's orders (paged)|
| GET    | `/my-orders/{id}`     | USER   | Get single order detail  |
| POST   | `/`                   | USER   | Place new order          |
| PATCH  | `/{id}/status`        | ADMIN  | Update order status      |

### Response format (all endpoints)
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... },
  "timestamp": "2024-01-01T12:00:00"
}
```

### Error format
```json
{
  "success": false,
  "message": "Resource not found with id: 999",
  "timestamp": "2024-01-01T12:00:00"
}
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** — [Download](https://adoptium.net/)
- **Maven 3.8+** — [Download](https://maven.apache.org/)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **MySQL 8.0+** — [Download](https://dev.mysql.com/downloads/)

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/shopsphere.git
cd shopsphere
```

---

### 2. Database Setup

```bash
# Log in to MySQL
mysql -u root -p

# Run schema and seed scripts
SOURCE /path/to/shopsphere/database/schema.sql;
SOURCE /path/to/shopsphere/database/seed.sql;
```

Or using the MySQL CLI in one step:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p shopsphere < database/seed.sql
```

---

### 3. Backend Setup

```bash
cd backend

# Update database credentials in src/main/resources/application.properties
# spring.datasource.username=your_username
# spring.datasource.password=your_password

# Build and run
./mvnw spring-boot:run
```

The API will be available at **http://localhost:8080**

---

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# Run development server
npm run dev
```

The app will be available at **http://localhost:3000**

---

### 5. Login with demo accounts

| Role  | Email                      | Password    |
|-------|----------------------------|-------------|
| Admin | admin@shopsphere.com       | Admin@123   |
| User  | john@example.com           | User@123    |

---

## 🔐 Environment Variables

### Backend (`application.properties`)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/shopsphere
spring.datasource.username=root
spring.datasource.password=your_password

app.jwt.secret=your_256bit_secret_key_here
app.jwt.expiration-ms=86400000

app.cors.allowed-origins=http://localhost:3000
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

## 🔗 Frontend–Backend Connection

```
Next.js Frontend                       Spring Boot Backend
─────────────────                      ────────────────────
pages/ → API calls                     Controllers
  via lib/api.ts                         ↓
  via lib/apiClient.ts (Axios)         Services
    ├── Auto-attach JWT Bearer           ↓
    └── Handle 401 → redirect          Repositories
        to /login                        ↓
                                       MySQL Database

Auth Flow:
  Login form → POST /auth/login
    ← { accessToken, user }
  Token stored in localStorage
  All subsequent requests:
    Authorization: Bearer <token>
```

**Key files:**
- `frontend/lib/apiClient.ts` — Axios instance with request/response interceptors
- `frontend/lib/api.ts` — All API function calls (typed with generics)
- `frontend/context/AuthContext.tsx` — Global auth state + login/logout
- `frontend/context/CartContext.tsx` — Global cart state synced with backend

---

## 🔒 Security Architecture

```
Request → JwtAuthenticationFilter
            ↓
         Extract token from Authorization header
            ↓
         Validate token (signature + expiry)
            ↓
         Load UserDetails from DB
            ↓
         Set SecurityContext
            ↓
         SecurityFilterChain rules:
           PUBLIC:  GET /products/**, GET /categories/**, POST /auth/**
           USER:    /cart/**, POST /orders, GET /orders/my-orders/**
           ADMIN:   POST/PUT/DELETE /products/**, PATCH /orders/**/status
```

---

## 📸 Screenshots

> Add screenshots of your running application here.

| Page              | Description                          |
|-------------------|--------------------------------------|
| Homepage          | Hero, categories, featured products  |
| Products          | Grid with sidebar filters            |
| Product Detail    | Images, rating, add to cart          |
| Cart              | Item list, quantity controls, totals |
| Checkout          | Two-step form (address → payment)    |
| Dashboard         | User account overview                |
| Order Detail      | Status tracker, item list            |
| Admin Dashboard   | Product management table             |

---

## 🧪 Running Tests

```bash
# Backend tests
cd backend
./mvnw test

# Frontend lint
cd frontend
npm run lint
```

---

## 🚢 Production Build

```bash
# Backend JAR
cd backend
./mvnw clean package -DskipTests
java -jar target/shopsphere-backend-1.0.0.jar

# Frontend static build
cd frontend
npm run build
npm start
```

---

## 🗺️ Roadmap

- [ ] Product image upload (AWS S3 / Cloudinary)
- [ ] Stripe payment integration
- [ ] Product reviews and ratings system
- [ ] Email notifications (order confirmations)
- [ ] Wishlist / saved items
- [ ] Discount codes / coupons
- [ ] Admin order management UI
- [ ] Docker Compose setup
- [ ] CI/CD pipeline (GitHub Actions)

---

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ as a portfolio project demonstrating Java Full Stack development</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
