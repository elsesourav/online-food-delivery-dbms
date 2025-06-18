import { getDb } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const {
         email,
         password,
         name,
         phone,
         address,
         role,
         restaurant_id,
         restaurant_name,
         restaurant_description,
         restaurant_address,
         restaurant_phone,
      } = body;

      // Validate required fields
      if (!email || !password || !name) {
         return NextResponse.json(
            { error: "Email, password, and name are required" },
            { status: 400 }
         );
      }

      // Validate role-specific requirements
      if (role === "restaurant_manager") {
         if (!restaurant_name || !restaurant_address || !restaurant_phone) {
            return NextResponse.json(
               {
                  error: "Restaurant name, address, and phone are required for managers",
               },
               { status: 400 }
            );
         }
      }

      if (role === "delivery_man" && !phone) {
         return NextResponse.json(
            { error: "Phone number is required for delivery personnel" },
            { status: 400 }
         );
      }

      const db = getDb();

      // Check if user already exists
      const [existingUsers] = (await db.execute(
         "SELECT id FROM users WHERE email = ?",
         [email]
      )) as [unknown[], unknown];

      if ((existingUsers as unknown[]).length > 0) {
         return NextResponse.json(
            { error: "User already exists" },
            { status: 400 }
         );
      }

      let finalRestaurantId = restaurant_id;

      // If restaurant manager, create the restaurant first
      if (role === "restaurant_manager") {
         // Check if restaurant name already exists
         const [existingRestaurants] = (await db.execute(
            "SELECT id FROM restaurants WHERE name = ?",
            [restaurant_name]
         )) as [unknown[], unknown];

         if ((existingRestaurants as unknown[]).length > 0) {
            return NextResponse.json(
               { error: "Restaurant with this name already exists" },
               { status: 400 }
            );
         }

         // Create the restaurant
         const [restaurantResult] = await db.execute(
            "INSERT INTO restaurants (name, description, address, phone) VALUES (?, ?, ?, ?)",
            [
               restaurant_name,
               restaurant_description || "",
               restaurant_address,
               restaurant_phone,
            ]
         );

         finalRestaurantId = (restaurantResult as { insertId: number })
            .insertId;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user with role
      const userRole = role || "customer";
      await db.execute(
         "INSERT INTO users (email, password, name, phone, address, role, restaurant_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
         [
            email,
            hashedPassword,
            name,
            phone || null,
            address || null,
            userRole,
            finalRestaurantId || null,
         ]
      );

      return NextResponse.json(
         {
            message:
               role === "restaurant_manager"
                  ? "User and restaurant created successfully"
                  : "User created successfully",
         },
         { status: 201 }
      );
   } catch (error) {
      console.error("Registration error:", error);
      return NextResponse.json(
         { error: "Failed to create user" },
         { status: 500 }
      );
   }
}
