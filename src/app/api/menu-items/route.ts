import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
   try {
      const session = await auth();
      if (!session || session.user.role !== "restaurant_manager") {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!session.user.restaurant_id) {
         return NextResponse.json(
            { error: "Restaurant ID not found" },
            { status: 400 }
         );
      }

      const db = getDb();
      const [rows] = await db.execute(
         "SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY category, name",
         [session.user.restaurant_id]
      );

      return NextResponse.json({ menuItems: rows });
   } catch (error) {
      console.error("Menu items fetch error:", error);
      return NextResponse.json(
         { error: "Failed to fetch menu items" },
         { status: 500 }
      );
   }
}

export async function POST(request: NextRequest) {
   try {
      const session = await auth();
      if (!session || session.user.role !== "restaurant_manager") {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!session.user.restaurant_id) {
         return NextResponse.json(
            { error: "Restaurant ID not found" },
            { status: 400 }
         );
      }

      const { name, description, price, category } = await request.json();

      if (!name || !price || !category) {
         return NextResponse.json(
            { error: "Name, price, and category are required" },
            { status: 400 }
         );
      }

      const db = getDb();
      const [result] = await db.execute(
         "INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES (?, ?, ?, ?, ?)",
         [session.user.restaurant_id, name, description || "", price, category]
      );

      return NextResponse.json({
         success: true,
         message: "Menu item added successfully",
         id: (result as { insertId: number }).insertId,
      });
   } catch (error) {
      console.error("Menu item creation error:", error);
      return NextResponse.json(
         { error: "Failed to create menu item" },
         { status: 500 }
      );
   }
}

export async function PUT(request: NextRequest) {
   try {
      const session = await auth();
      if (!session || session.user.role !== "restaurant_manager") {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!session.user.restaurant_id) {
         return NextResponse.json(
            { error: "Restaurant ID not found" },
            { status: 400 }
         );
      }

      const { id, name, description, price, category, is_available } =
         await request.json();

      if (!id || !name || !price || !category) {
         return NextResponse.json(
            { error: "ID, name, price, and category are required" },
            { status: 400 }
         );
      }

      const db = getDb();
      await db.execute(
         "UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, is_available = ? WHERE id = ? AND restaurant_id = ?",
         [
            name,
            description || "",
            price,
            category,
            is_available ?? true,
            id,
            session.user.restaurant_id,
         ]
      );

      return NextResponse.json({
         success: true,
         message: "Menu item updated successfully",
      });
   } catch (error) {
      console.error("Menu item update error:", error);
      return NextResponse.json(
         { error: "Failed to update menu item" },
         { status: 500 }
      );
   }
}

export async function DELETE(request: NextRequest) {
   try {
      const session = await auth();
      if (!session || session.user.role !== "restaurant_manager") {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!session.user.restaurant_id) {
         return NextResponse.json(
            { error: "Restaurant ID not found" },
            { status: 400 }
         );
      }

      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");

      if (!id) {
         return NextResponse.json(
            { error: "Menu item ID is required" },
            { status: 400 }
         );
      }

      const db = getDb();
      await db.execute(
         "DELETE FROM menu_items WHERE id = ? AND restaurant_id = ?",
         [id, session.user.restaurant_id]
      );

      return NextResponse.json({
         success: true,
         message: "Menu item deleted successfully",
      });
   } catch (error) {
      console.error("Menu item deletion error:", error);
      return NextResponse.json(
         { error: "Failed to delete menu item" },
         { status: 500 }
      );
   }
}
