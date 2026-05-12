-- ============================================================
-- ShopSphere E-Commerce Platform - MySQL Database Schema
-- Version: 1.0.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS shopsphere CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shopsphere;

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE users (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    first_name  VARCHAR(50)     NOT NULL,
    last_name   VARCHAR(50)     NOT NULL,
    email       VARCHAR(100)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    phone       VARCHAR(20),
    role        ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    enabled     BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_users_email (email),
    INDEX idx_users_role  (role)
) ENGINE=InnoDB;

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================
CREATE TABLE categories (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)    NOT NULL UNIQUE,
    slug        VARCHAR(100)    NOT NULL UNIQUE,
    description TEXT,
    image_url   VARCHAR(500),
    parent_id   BIGINT,
    active      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_categories_slug   (slug),
    INDEX idx_categories_parent (parent_id)
) ENGINE=InnoDB;

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE products (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(255)    NOT NULL,
    slug            VARCHAR(255)    NOT NULL UNIQUE,
    description     TEXT,
    price           DECIMAL(10,2)   NOT NULL,
    compare_price   DECIMAL(10,2),
    stock_quantity  INT             NOT NULL DEFAULT 0,
    sku             VARCHAR(100)    UNIQUE,
    brand           VARCHAR(100),
    category_id     BIGINT          NOT NULL,
    image_url       VARCHAR(500),
    images          JSON,
    rating          DECIMAL(3,2)    DEFAULT 0.00,
    review_count    INT             DEFAULT 0,
    featured        BOOLEAN         NOT NULL DEFAULT FALSE,
    active          BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_products_slug     (slug),
    INDEX idx_products_category (category_id),
    INDEX idx_products_featured (featured),
    INDEX idx_products_active   (active),
    FULLTEXT INDEX ft_products_search (name, description, brand)
) ENGINE=InnoDB;

-- ============================================================
-- CART TABLE
-- ============================================================
CREATE TABLE cart (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    user_id     BIGINT      NOT NULL UNIQUE,
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_cart_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- CART ITEMS TABLE
-- ============================================================
CREATE TABLE cart_items (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    cart_id     BIGINT      NOT NULL,
    product_id  BIGINT      NOT NULL,
    quantity    INT         NOT NULL DEFAULT 1,
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (cart_id)    REFERENCES cart(id)     ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uk_cart_product (cart_id, product_id),
    INDEX idx_cart_items_cart    (cart_id),
    INDEX idx_cart_items_product (product_id)
) ENGINE=InnoDB;

-- ============================================================
-- ADDRESSES TABLE
-- ============================================================
CREATE TABLE addresses (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    user_id         BIGINT          NOT NULL,
    type            ENUM('BILLING','SHIPPING') NOT NULL DEFAULT 'SHIPPING',
    full_name       VARCHAR(100)    NOT NULL,
    phone           VARCHAR(20),
    address_line1   VARCHAR(255)    NOT NULL,
    address_line2   VARCHAR(255),
    city            VARCHAR(100)    NOT NULL,
    state           VARCHAR(100)    NOT NULL,
    postal_code     VARCHAR(20)     NOT NULL,
    country         VARCHAR(100)    NOT NULL DEFAULT 'US',
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_addresses_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE orders (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    order_number        VARCHAR(50)     NOT NULL UNIQUE,
    user_id             BIGINT          NOT NULL,
    status              ENUM('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED')
                                        NOT NULL DEFAULT 'PENDING',
    subtotal            DECIMAL(10,2)   NOT NULL,
    discount_amount     DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    shipping_amount     DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    tax_amount          DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    total_amount        DECIMAL(10,2)   NOT NULL,
    -- Snapshot of shipping address at order time
    shipping_full_name  VARCHAR(100)    NOT NULL,
    shipping_phone      VARCHAR(20),
    shipping_address1   VARCHAR(255)    NOT NULL,
    shipping_address2   VARCHAR(255),
    shipping_city       VARCHAR(100)    NOT NULL,
    shipping_state      VARCHAR(100)    NOT NULL,
    shipping_postal     VARCHAR(20)     NOT NULL,
    shipping_country    VARCHAR(100)    NOT NULL DEFAULT 'US',
    notes               TEXT,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_orders_user        (user_id),
    INDEX idx_orders_status      (status),
    INDEX idx_orders_number      (order_number),
    INDEX idx_orders_created     (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- ORDER ITEMS TABLE
-- ============================================================
CREATE TABLE order_items (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    order_id        BIGINT          NOT NULL,
    product_id      BIGINT          NOT NULL,
    product_name    VARCHAR(255)    NOT NULL,
    product_sku     VARCHAR(100),
    product_image   VARCHAR(500),
    quantity        INT             NOT NULL,
    unit_price      DECIMAL(10,2)   NOT NULL,
    total_price     DECIMAL(10,2)   NOT NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_items_order   (order_id),
    INDEX idx_order_items_product (product_id)
) ENGINE=InnoDB;

-- ============================================================
-- PAYMENTS TABLE
-- ============================================================
CREATE TABLE payments (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    order_id            BIGINT          NOT NULL UNIQUE,
    transaction_id      VARCHAR(255),
    payment_method      ENUM('CREDIT_CARD','DEBIT_CARD','PAYPAL','STRIPE','COD') NOT NULL,
    status              ENUM('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
    amount              DECIMAL(10,2)   NOT NULL,
    currency            VARCHAR(10)     NOT NULL DEFAULT 'USD',
    gateway_response    JSON,
    paid_at             DATETIME,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    INDEX idx_payments_order  (order_id),
    INDEX idx_payments_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- REVIEWS TABLE
-- ============================================================
CREATE TABLE reviews (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    product_id  BIGINT      NOT NULL,
    user_id     BIGINT      NOT NULL,
    rating      TINYINT     NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title       VARCHAR(255),
    comment     TEXT,
    verified    BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    UNIQUE KEY uk_review_user_product (user_id, product_id),
    INDEX idx_reviews_product (product_id),
    INDEX idx_reviews_user    (user_id)
) ENGINE=InnoDB;
