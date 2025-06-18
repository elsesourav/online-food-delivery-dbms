import { getDb } from "@/lib/db";
import { RegisterSchema } from "@/lib/schemas";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const { email, password, name, phone, address } =
         RegisterSchema.parse(body);

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

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      await db.execute(
         "INSERT INTO users (email, password, name, phone, address) VALUES (?, ?, ?, ?, ?)",
         [email, hashedPassword, name, phone || null, address || null]
      );

      return NextResponse.json(
         { message: "User created successfully" },
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
