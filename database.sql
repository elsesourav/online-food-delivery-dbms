-- Online Food Delivery Database Schema
-- Simple design with minimal tables and columns
-- Create database
CREATE DATABASE IF NOT EXISTS online_food_delivery;

USE online_food_delivery;

-- Restaurants table (create first for foreign key reference)
CREATE TABLE
   IF NOT EXISTS restaurants (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      image VARCHAR(255),
      address TEXT,
      phone VARCHAR(20),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

-- Users table (customers, restaurant managers, delivery personnel)
CREATE TABLE
   IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      role ENUM ('customer', 'restaurant_manager', 'delivery_man') DEFAULT 'customer',
      address TEXT,
      restaurant_id INT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE SET NULL
   );

-- Menu items table
CREATE TABLE
   IF NOT EXISTS menu_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      restaurant_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      image VARCHAR(255),
      category VARCHAR(50),
      is_available BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE
   );

-- Orders table
CREATE TABLE
   IF NOT EXISTS orders (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      restaurant_id INT NOT NULL,
      delivery_man_id INT NULL,
      total_amount DECIMAL(10, 2) NOT NULL,
      status ENUM (
         'pending',
         'confirmed',
         'preparing',
         'ready_for_pickup',
         'out_for_delivery',
         'delivered',
         'cancelled'
      ) DEFAULT 'pending',
      delivery_address TEXT NOT NULL,
      delivery_phone VARCHAR(20),
      notes TEXT,
      estimated_delivery_time TIMESTAMP NULL,
      delivered_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants (id) ON DELETE CASCADE,
      FOREIGN KEY (delivery_man_id) REFERENCES users (id) ON DELETE SET NULL
   );

-- Order items table (items in each order)
CREATE TABLE
   IF NOT EXISTS order_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      order_id INT NOT NULL,
      menu_item_id INT NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      price DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
      FOREIGN KEY (menu_item_id) REFERENCES menu_items (id) ON DELETE CASCADE
   );

-- Insert sample data
INSERT INTO
   restaurants (name, description, address, phone)
VALUES
   (
      'Pizza Palace',
      'Authentic Italian pizzas and pasta',
      '45, Park Street, Kolkata, West Bengal 700016',
      '+91-98765-43210'
   ),
   (
      'Burger House',
      'Gourmet burgers and fries',
      '123, Salt Lake City, Sector V, Kolkata, West Bengal 700091',
      '+91-98765-43211'
   ),
   (
      'Sushi Express',
      'Fresh sushi and Japanese cuisine',
      '78, Camac Street, Kolkata, West Bengal 700017',
      '+91-98765-43212'
   );

INSERT INTO
   menu_items (restaurant_id, name, description, price, category)
VALUES
   (
      1,
      'Margherita Pizza',
      'Classic pizza with tomato, mozzarella, and basil',
      299.00,
      'Pizza'
   ),
   (
      1,
      'Pepperoni Pizza',
      'Delicious pizza with pepperoni and cheese',
      349.00,
      'Pizza'
   ),
   (
      1,
      'Spaghetti Carbonara',
      'Creamy pasta with bacon and egg',
      249.00,
      'Pasta'
   ),
   (
      2,
      'Classic Burger',
      'Beef patty with lettuce, tomato, and pickles',
      179.00,
      'Burger'
   ),
   (
      2,
      'Chicken Burger',
      'Grilled chicken with mayo and vegetables',
      199.00,
      'Burger'
   ),
   (
      2,
      'French Fries',
      'Crispy golden fries',
      89.00,
      'Sides'
   ),
   (
      3,
      'California Roll',
      'Fresh sushi roll with avocado and crab',
      189.00,
      'Sushi'
   ),
   (
      3,
      'Salmon Teriyaki',
      'Grilled salmon with teriyaki sauce',
      399.00,
      'Main'
   ),
   (
      3,
      'Miso Soup',
      'Traditional Japanese soup',
      79.00,
      'Soup'
   );

-- Insert sample users with different roles
-- Password for all users is 'password123' (hashed)
INSERT INTO
   users (email, password, name, phone, role, restaurant_id)
VALUES
   (
      'sourav@gmail.com',
      '$2b$10$tcSikbpo3skrfYCtce/zAOnqu9.EcGPLIw4RSU5HKKB3pGp8Iw2h.',
      'Sourav Customer',
      '+1-555-1001',
      'customer',
      NULL
   ),
   (
      'pralay@gmail.com',
      '$2b$10$tcSikbpo3skrfYCtce/zAOnqu9.EcGPLIw4RSU5HKKB3pGp8Iw2h.',
      'Pralay Manager',
      '+1-555-1002',
      'restaurant_manager',
      1
   ),
   (
      'pubali@gmail.com',
      '$2b$10$tcSikbpo3skrfYCtce/zAOnqu9.EcGPLIw4RSU5HKKB3pGp8Iw2h.',
      'Pubali Manager',
      '+1-555-1003',
      'restaurant_manager',
      2
   ),
   (
      'sahil@gmail.com',
      '$2b$10$tcSikbpo3skrfYCtce/zAOnqu9.EcGPLIw4RSU5HKKB3pGp8Iw2h.',
      'Sahil Delivery',
      '+1-555-1004',
      'delivery_man',
      NULL
   ),
   (
      'rima@gmail.com',
      '$2b$10$tcSikbpo3skrfYCtce/zAOnqu9.EcGPLIw4RSU5HKKB3pGp8Iw2h.',
      'Rima Delivery',
      '+1-555-1005',
      'delivery_man',
      NULL
   );

-- Insert sample orders for testing restaurant dashboard
INSERT INTO
   orders (
      user_id,
      restaurant_id,
      total_amount,
      delivery_address,
      delivery_phone,
      notes,
      status
   )
VALUES
   (
      1,
      1,
      598.00,
      '15, Gariahat Road, Kolkata, West Bengal 700019',
      '+91-98765-11001',
      'Extra cheese please',
      'pending'
   ),
   (
      1,
      1,
      299.00,
      '15, Gariahat Road, Kolkata, West Bengal 700019',
      '+91-98765-11001',
      'No onions',
      'confirmed'
   );