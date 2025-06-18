# Online Food Delivery App

A simple and modern food delivery application built with Next.js 15.3.2, React 19, and MySQL.

## Features

-  🍕 Browse restaurants and menus
-  🛒 Add items to cart
-  👤 User authentication (sign up/sign in)
-  📱 Responsive design
-  🎨 Modern UI with Shadcn components
-  🔐 Secure password hashing
-  📊 Simple database design

## Tech Stack

### Frontend

-  Next.js 15.3.2 - React framework with server-side rendering
-  React 19 - UI library
-  Tailwind CSS - Utility-first CSS framework
-  Shadcn UI - High-quality UI components
-  React Icons - Icon library
-  React Hook Form - Form validation
-  Zod - Schema validation
-  Next Themes - Theme management

### Backend

-  Next.js API Routes - Serverless API endpoints
-  MySQL - Relational database
-  NextAuth.js - Authentication
-  bcrypt - Password hashing

## Prerequisites

-  Node.js (v18 or higher)
-  MySQL server

## Getting Started

1. **Clone and navigate to the project**

   ```bash
   cd online-food-delivery
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=online_food_delivery
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Initialize the database**

   Make sure MySQL server is running, then execute:

   ```bash
   npm run init-db
   ```

   This will:

   -  Create the `online_food_delivery` database
   -  Create all necessary tables (users, restaurants, menu_items, orders, order_items)
   -  Insert sample restaurant and menu data

   Alternatively, you can run the SQL file directly:

   ```bash
   mysql -u root < database.sql
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses a simple database design with minimal tables:

-  **users** - Store user information (customers, admins, delivery personnel)
-  **restaurants** - Restaurant information
-  **menu_items** - Food items for each restaurant
-  **orders** - Customer orders
-  **order_items** - Items in each order

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   ├── auth/               # Authentication pages
│   ├── restaurants/        # Restaurant pages
│   └── page.tsx           # Home page
├── components/
│   └── ui/                # Shadcn UI components
└── lib/
    ├── auth.ts            # NextAuth configuration
    ├── db.ts              # Database connection
    ├── schemas.ts         # Zod validation schemas
    └── utils.ts           # Utility functions
```

## Available Scripts

-  `npm run dev` - Start development server
-  `npm run build` - Build for production
-  `npm run start` - Start production server
-  `npm run lint` - Run ESLint
-  `npm run init-db` - Initialize database

## Features Overview

### Authentication

-  User registration and login
-  Secure password hashing with bcrypt
-  Session management with NextAuth.js

### Restaurant Browsing

-  View all available restaurants
-  Browse restaurant menus by category
-  Add items to shopping cart

### Simple Cart System

-  Add/remove items from cart
-  View order total
-  Responsive cart sidebar

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
