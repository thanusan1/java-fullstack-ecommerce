-- ============================================================
-- ShopSphere - Seed Data
-- ============================================================
USE shopsphere;

-- Admin user (password: Admin@123)
INSERT INTO users (first_name, last_name, email, password, role) VALUES
('Admin', 'ShopSphere', 'admin@shopsphere.com',
 '$2a$12$LcVztB0X7jkVSuabSFV14.9Mz.q8W2kR7.e0ZfY5dMIZOIuobq5yy', 'ADMIN');

-- Test user (password: User@123)
INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES
('John', 'Doe', 'john@example.com',
 '$2a$12$LcVztB0X7jkVSuabSFV14.9Mz.q8W2kR7.e0ZfY5dMIZOIuobq5yy', '+1-555-0100', 'USER');

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug, description, image_url) VALUES
('Electronics',  'electronics',  'Gadgets, devices, and tech accessories',          'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'),
('Clothing',     'clothing',     'Fashion for men, women, and kids',                'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'),
('Home & Garden','home-garden',  'Everything for your home and outdoor spaces',     'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'),
('Books',        'books',        'Bestsellers, textbooks, and rare finds',          'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400'),
('Sports',       'sports',       'Equipment and apparel for every sport',           'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400'),
('Beauty',       'beauty',       'Skincare, makeup, and personal care',             'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400');

-- Sub-categories
INSERT INTO categories (name, slug, description, parent_id) VALUES
('Smartphones',   'smartphones',    'Latest mobile phones',               1),
('Laptops',       'laptops',        'Notebooks and ultrabooks',           1),
('Audio',         'audio',          'Headphones, speakers, earbuds',      1),
('Men Fashion',   'men-fashion',    'Clothing for men',                   2),
('Women Fashion', 'women-fashion',  'Clothing for women',                 2),
('Furniture',     'furniture',      'Sofas, beds, tables',                3),
('Fitness',       'fitness',        'Home gym and fitness gear',          5);

-- ============================================================
-- PRODUCTS
-- ============================================================
INSERT INTO products (name, slug, description, price, compare_price, stock_quantity, sku, brand, category_id, image_url, rating, review_count, featured) VALUES
-- Electronics
('iPhone 15 Pro Max 256GB',
 'iphone-15-pro-max-256gb',
 'The most powerful iPhone ever with A17 Pro chip, titanium design, and pro camera system. Features a 6.7-inch Super Retina XDR display, USB-C, and up to 29 hours video playback.',
 1199.99, 1299.99, 45, 'APPL-IP15PM-256', 'Apple', 7,
 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
 4.8, 324, TRUE),

('Samsung Galaxy S24 Ultra',
 'samsung-galaxy-s24-ultra',
 'Titanium-framed powerhouse with 200MP camera, built-in S Pen, and Galaxy AI. Features 6.8" Dynamic AMOLED display and 5000mAh battery.',
 1299.99, 1399.99, 38, 'SAMS-GS24U-512', 'Samsung', 7,
 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600',
 4.7, 218, TRUE),

('MacBook Pro 14" M3 Pro',
 'macbook-pro-14-m3-pro',
 'Supercharged by M3 Pro chip for groundbreaking performance. Features Liquid Retina XDR display, up to 22 hours battery, and 18GB unified memory.',
 1999.99, 2199.99, 22, 'APPL-MBP14-M3P', 'Apple', 8,
 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
 4.9, 156, TRUE),

('Sony WH-1000XM5 Headphones',
 'sony-wh-1000xm5',
 'Industry-leading noise canceling with Integrated Processor V1. 30-hour battery life, multipoint connection, and exceptional call quality.',
 349.99, 399.99, 67, 'SONY-WH1KXM5', 'Sony', 9,
 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600',
 4.6, 892, TRUE),

('Dell XPS 15 OLED',
 'dell-xps-15-oled',
 'Premium laptop with stunning 3.5K OLED display, Intel Core i9, RTX 4060, and 32GB RAM. Perfect for creators and professionals.',
 2299.99, 2499.99, 15, 'DELL-XPS15-OLED', 'Dell', 8,
 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600',
 4.5, 203, FALSE),

-- Clothing
('Premium Cotton Slim-Fit Shirt',
 'premium-cotton-slim-fit-shirt',
 'Crafted from 100% Egyptian cotton with a modern slim fit. Available in multiple colors. Perfect for business casual and formal occasions.',
 89.99, 120.00, 150, 'CLO-SHIRT-SLM-M', 'Calvin Klein', 10,
 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
 4.4, 445, TRUE),

('High-Waist Athletic Leggings',
 'high-waist-athletic-leggings',
 'Ultra-soft 4-way stretch fabric with moisture-wicking technology. High-waist design with hidden pocket. Ideal for yoga, running, and gym.',
 65.99, 85.00, 200, 'CLO-LEG-HW-M', 'Lululemon', 11,
 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600',
 4.7, 678, TRUE),

-- Home & Garden
('Ergonomic Office Chair Pro',
 'ergonomic-office-chair-pro',
 'Full lumbar support with adjustable armrests, headrest, and seat depth. Breathable mesh back keeps you cool during long work sessions.',
 449.99, 599.99, 30, 'HOM-CHR-ERG-BLK', 'Herman Miller', 12,
 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600',
 4.8, 312, TRUE),

-- Books
('Clean Code: A Handbook of Agile Software',
 'clean-code-robert-martin',
 'Robert C. Martin''s timeless guide to writing clean, maintainable code. Essential reading for every software developer who wants to improve their craft.',
 45.99, 54.99, 500, 'BOOK-CC-MARTIN', 'Pearson', 4,
 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600',
 4.9, 1204, TRUE),

-- Sports
('Garmin Forerunner 965 GPS Watch',
 'garmin-forerunner-965',
 'Premium GPS running smartwatch with AMOLED display, training readiness insights, race predictor, and up to 23-day battery life in smartwatch mode.',
 599.99, 649.99, 42, 'GAR-FR965-BLK', 'Garmin', 13,
 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
 4.7, 289, TRUE),

-- Beauty
('Ordinary Retinol 1% in Squalane',
 'ordinary-retinol-1-squalane',
 'High-strength retinol formula in a non-comedogenic squalane base. Targets multiple signs of aging including fine lines and uneven texture.',
 12.99, 15.99, 300, 'BEAU-RET1-SQ', 'The Ordinary', 6,
 'https://images.unsplash.com/photo-1556228578-567ba127e37f?w=600',
 4.5, 567, FALSE),

('AirPods Pro (2nd Generation)',
 'airpods-pro-2nd-gen',
 'Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio. Up to 6 hours listening time with ANC enabled.',
 249.99, 279.99, 89, 'APPL-APP2-WHT', 'Apple', 9,
 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600',
 4.8, 1456, TRUE);
