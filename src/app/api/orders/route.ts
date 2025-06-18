import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   try {
      const session = await auth();
      if (!session || session.user.role !== "customer") {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const {
         restaurant_id,
         cart_items,
         total_amount,
         delivery_address,
         delivery_phone,
         notes,
      } = await request.json();

      const db = getDb();

      // Create the order
      const [orderResult] = await db.execute(
         `INSERT INTO orders (user_id, restaurant_id, total_amount, delivery_address, delivery_phone, notes, status) 
          VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
         [
            session.user.id,
            restaurant_id,
            total_amount,
            delivery_address,
            delivery_phone,
            notes,
         ]
      );

      const orderId = (orderResult as { insertId: number }).insertId;

      // Insert order items
      for (const item of cart_items) {
         await db.execute(
            "INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)",
            [orderId, item.id, item.quantity, item.price]
         );
      }

      return NextResponse.json({
         success: true,
         orderId,
         message: "Order placed successfully",
      });
   } catch (error) {
      console.error("Order creation error:", error);
      return NextResponse.json(
         { error: "Failed to create order" },
         { status: 500 }
      );
   }
}

export async function GET(request: NextRequest) {
   try {
      const session = await auth();
      if (!session) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { searchParams } = new URL(request.url);
      const status = searchParams.get("status");

      const db = getDb();
      let query = `
         SELECT o.*, r.name as restaurant_name, u.name as customer_name, u.phone as customer_phone
         FROM orders o 
         JOIN restaurants r ON o.restaurant_id = r.id 
         JOIN users u ON o.user_id = u.id
      `;
      const params: (string | number)[] = [];

      // Filter based on user role
      if (session.user.role === "customer") {
         query += " WHERE o.user_id = ?";
         params.push(session.user.id);
      } else if (
         session.user.role === "restaurant_manager" &&
         session.user.restaurant_id
      ) {
         query += " WHERE o.restaurant_id = ?";
         params.push(session.user.restaurant_id);
      } else if (session.user.role === "delivery_man") {
         query +=
            " WHERE (o.status IN ('ready_for_pickup', 'out_for_delivery') AND o.delivery_man_id IS NULL) OR o.delivery_man_id = ?";
         params.push(session.user.id);
      }

      if (status) {
         query +=
            params.length > 0 ? " AND o.status = ?" : " WHERE o.status = ?";
         params.push(status);
      }

      query += " ORDER BY o.created_at DESC";

      const [rows] = await db.execute(query, params);
      return NextResponse.json({ orders: rows });
   } catch (error) {
      console.error("Orders fetch error:", error);
      return NextResponse.json(
         { error: "Failed to fetch orders" },
         { status: 500 }
      );
   }
}
