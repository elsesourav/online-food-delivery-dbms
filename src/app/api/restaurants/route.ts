import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
   try {
      const db = getDb();
      const [rows] = await db.execute(
         "SELECT * FROM restaurants WHERE is_active = 1"
      );

      return NextResponse.json({ restaurants: rows });
   } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
         { error: "Failed to fetch restaurants" },
         { status: 500 }
      );
   }
}
