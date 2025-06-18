# Online Food Delivery App

A modern, multi-role online food delivery platform built with Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI, NextAuth.js, and MySQL.

---

## Database Schema (MySQL)

### Schema Diagram

<!--
[Space reserved for schema diagram]
You can use tools like dbdiagram.io or draw.io to visualize the schema below.
-->

### Table Definitions

<img src="./schema-diagram.png" alt="Database Schema Diagram" style="width:80%;max-width:21cm;min-width:0;display:block;margin:auto;" />

#### 1. `restaurants`

```sql
CREATE TABLE IF NOT EXISTS restaurants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  address TEXT,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. `users`

```sql
CREATE TABLE IF NOT EXISTS users (
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
```

#### 3. `menu_items`

```sql
CREATE TABLE IF NOT EXISTS menu_items (
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
```

#### 4. `orders`

```sql
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  restaurant_id INT NOT NULL,
  delivery_man_id INT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM (
    'pending', 'confirmed', 'preparing', 'ready_for_pickup',
    'out_for_delivery', 'delivered', 'cancelled'
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
```

#### 5. `order_items`

```sql
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  menu_item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items (id) ON DELETE CASCADE
);
```

---

## Features

-  Multi-role authentication (Customer, Restaurant Manager, Delivery Personnel)
-  Restaurant browsing and menu viewing
-  Add to cart and checkout for customers
-  Order management and tracking for all roles
-  Restaurant manager dashboard with menu CRUD
-  Delivery dashboard for delivery personnel
-  Responsive UI with Tailwind CSS and Shadcn UI
-  Dark/Light theme toggle
-  MySQL backend with simple, normalized schema
-  Next.js API routes for backend logic
-  TypeScript, Zod validation, and NextAuth.js for security

---

## Sample Data

### Insert Sample Restaurants

```sql
INSERT INTO restaurants (name, description, address, phone) VALUES
  ('Pizza Palace', 'Authentic Italian pizzas and pasta', '45, Park Street, Kolkata, West Bengal 700016', '+91-98765-43210'),
  ('Burger House', 'Gourmet burgers and fries', '123, Salt Lake City, Sector V, Kolkata, West Bengal 700091', '+91-98765-43211'),
  ('Sushi Express', 'Fresh sushi and Japanese cuisine', '78, Camac Street, Kolkata, West Bengal 700017', '+91-98765-43212'),
  ('Tandoori Nights', 'North Indian tandoori and curries', '12, Ballygunge, Kolkata, West Bengal 700019', '+91-98765-43213');
```

### Insert Sample Menu Items

```sql
INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES
  (1, 'Margherita Pizza', 'Classic pizza with tomato, mozzarella, and basil', 299.00, 'Pizza'),
  (1, 'Pepperoni Pizza', 'Delicious pizza with pepperoni and cheese', 349.00, 'Pizza'),
  (1, 'Spaghetti Carbonara', 'Creamy pasta with bacon and egg', 249.00, 'Pasta'),
  (2, 'Classic Burger', 'Beef patty with lettuce, tomato, and pickles', 179.00, 'Burger'),
  (2, 'Chicken Burger', 'Grilled chicken with mayo and vegetables', 199.00, 'Burger'),
  (2, 'French Fries', 'Crispy golden fries', 89.00, 'Sides'),
  (3, 'California Roll', 'Fresh sushi roll with avocado and crab', 189.00, 'Sushi'),
  (3, 'Salmon Teriyaki', 'Grilled salmon with teriyaki sauce', 399.00, 'Main'),
  (3, 'Miso Soup', 'Traditional Japanese soup', 79.00, 'Soup'),
  (4, 'Paneer Tikka', 'Grilled paneer cubes with spices', 220.00, 'Starter'),
  (4, 'Butter Chicken', 'Creamy tomato chicken curry', 320.00, 'Main'),
  (4, 'Garlic Naan', 'Soft Indian bread with garlic', 60.00, 'Bread');
```

### Insert Sample Users

```sql
INSERT INTO users (email, password, name, phone, role, restaurant_id) VALUES
  ('sourav@gmail.com', '$2b$10$tcSikbpo3skrfYCtce/zAOnqu9.EcGPLIw4RSU5HKKB3pGp8Iw2h.', 'Sourav Customer', '+1-555-1001', 'customer', NULL),
  ('pralay@gmail.com', '$2b$10$tcSikbpo3skrfYCtce/zAOnqu9.EcGPLIw4RSU5HKKB3pGp8Iw2h.', 'Pralay Manager', '+1-555-1002', 'restaurant_manager', 1),
  ('pubali@gmail.com', '$2b$10$tcSikbpo3skrfYCtce/zAOnqu9.EcGPLIw4RSU5HKKB3pGp8Iw2h.', 'Pubali Manager', '+1-555-1003', 'restaurant_manager', 2),
  ('sahil@gmail.com', '$2b$10$tcSikbpo3skrfYCtce/zAOnqu9.EcGPLIw4RSU5HKKB3pGp8Iw2h.', 'Sahil Delivery', '+1-555-1004', 'delivery_man', NULL),
  ('rima@gmail.com', '$2b$10$tcSikbpo3skrfYCtce/zAOnqu9.EcGPLIw4RSU5HKKB3pGp8Iw2h.', 'Rima Delivery', '+1-555-1005', 'delivery_man', NULL),
  ('arjun@gmail.com', '$2b$10$tcSikbpo3skrfYCtce/zAOnqu9.EcGPLIw4RSU5HKKB3pGp8Iw2h.', 'Arjun Customer', '+1-555-1006', 'customer', NULL);
```

### Insert Sample Orders

```sql
INSERT INTO orders (user_id, restaurant_id, total_amount, delivery_address, delivery_phone, notes, status) VALUES
  (1, 1, 598.00, '15, Gariahat Road, Kolkata, West Bengal 700019', '+91-98765-11001', 'Extra cheese please', 'pending'),
  (1, 1, 299.00, '15, Gariahat Road, Kolkata, West Bengal 700019', '+91-98765-11001', 'No onions', 'confirmed'),
  (6, 2, 378.00, '22, BBD Bagh, Kolkata, West Bengal 700001', '+91-98765-11002', 'Add ketchup', 'preparing'),
  (6, 4, 380.00, '99, Howrah, Kolkata, West Bengal 700002', '+91-98765-11003', 'No garlic', 'delivered');
```

### Insert Sample Order Items

```sql
INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES
  (1, 1, 2, 299.00),
  (1, 3, 1, 249.00),
  (2, 2, 1, 349.00),
  (3, 4, 2, 179.00),
  (3, 6, 1, 89.00),
  (4, 10, 2, 60.00),
  (4, 11, 1, 320.00);
```

---

## Example Queries & Output

### 1. Get all active restaurants

```sql
SELECT * FROM restaurants WHERE is_active = true;
```

**Output:**
| id | name | description | address | phone |
| --- | ------------- | --------------------------- | ----------------------------------------- | --------------- |
| 1 | Pizza Palace | Authentic Italian pizzas... | 45, Park Street, Kolkata, ... | +91-98765-43210 |
| 2 | Burger House | Gourmet burgers and fries | 123, Salt Lake City, Sector V, Kolkata... | +91-98765-43211 |
| 3 | Sushi Express | Fresh sushi and Japanese... | 78, Camac Street, Kolkata, ... | +91-98765-43212 |
| 4 | Tandoori Nights | North Indian tandoori... | 12, Ballygunge, Kolkata, ... | +91-98765-43213 |

### 2. Get menu items for a restaurant

```sql
SELECT * FROM menu_items WHERE restaurant_id = 1 AND is_available = true;
```

**Output:**
| id | name | price | category |
| --- | ------------------- | ------ | -------- |
| 1 | Margherita Pizza | 299.00 | Pizza |
| 2 | Pepperoni Pizza | 349.00 | Pizza |
| 3 | Spaghetti Carbonara | 249.00 | Pasta |

### 3. Get all orders for a customer

```sql
SELECT * FROM orders WHERE user_id = 1;
```

**Output:**
| id | user_id | restaurant_id | total_amount | status | delivery_address |
|----|---------|--------------|-------------|-----------|------------------------------------------|
| 1 | 1 | 1 | 598.00 | pending | 15, Gariahat Road, Kolkata, ... |
| 2 | 1 | 1 | 299.00 | confirmed | 15, Gariahat Road, Kolkata, ... |

### 4. Get all order items for an order

```sql
SELECT * FROM order_items WHERE order_id = 1;
```

**Output:**
| id | order_id | menu_item_id | quantity | price |
|----|----------|--------------|----------|--------|
| 1 | 1 | 1 | 2 | 299.00 |
| 2 | 1 | 3 | 1 | 249.00 |

---

## How to Setup & Run

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd online-food-delivery
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment:**
   -  Copy `.env.example` to `.env.local` and set your MySQL credentials.
   -  Example:
      ```env
      DATABASE_URL="mysql://user:password@localhost:3306/online_food_delivery"
      NEXTAUTH_SECRET=your_secret
      ```
4. **Import the database schema and sample data:**
   ```sh
   mysql -u <user> -p < database.sql
   ```
5. **Run the development server:**
   ```sh
   npm run dev
   ```
6. **Build for production:**
   ```sh
   npm run build
   npm start
   ``
   ```

---

© 2025 elsesourav
