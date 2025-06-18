import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
   request: Request,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const { id } = await params;
      const restaurantId = id;
      const db = getDb();

      const [rows] = await db.execute(
         "SELECT * FROM menu_items WHERE restaurant_id = ? AND is_available = 1",
         [restaurantId]
      );

      return NextResponse.json({ menuItems: rows });
   } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
         { error: "Failed to fetch menu items" },
         { status: 500 }
      );
   }
}
