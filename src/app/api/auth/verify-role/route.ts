import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface VerifyRoleRequest {
   email: string;
   expectedRole: "customer" | "restaurant_manager" | "delivery_man";
}

export async function POST(request: NextRequest) {
   try {
      const { email, expectedRole }: VerifyRoleRequest = await request.json();

      const db = getDb();
      const [rows] = (await db.execute(
         "SELECT role FROM users WHERE email = ? AND is_active = true",
         [email]
      )) as [unknown[], unknown];

      if (!(rows as unknown[]).length) {
         return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const user = (rows as { role: string }[])[0];

      if (user.role !== expectedRole) {
         return NextResponse.json({ error: "Invalid role" }, { status: 403 });
      }

      return NextResponse.json({ success: true });
   } catch (error) {
      console.error("Role verification error:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}
