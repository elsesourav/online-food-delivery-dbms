import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const { id } = await params;
      const session = await auth();

      if (!session) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { status, delivery_man_id } = await request.json();

      const db = getDb();

      // Validate the status transition based on user role
      const allowedStatuses: Record<string, string[]> = {
         restaurant_manager: [
            "confirmed",
            "preparing",
            "ready_for_pickup",
            "cancelled",
         ],
         delivery_man: ["out_for_delivery", "delivered"],
         customer: ["cancelled"], // Only if order is pending
      };

      const userAllowedStatuses = allowedStatuses[session.user.role] || [];

      if (!userAllowedStatuses.includes(status)) {
         return NextResponse.json(
            { error: "Invalid status for your role" },
            { status: 403 }
         );
      }

      // Check if the user has permission to update this order
      let authQuery = "";
      const authParams: (string | number)[] = [id];

      if (session.user.role === "restaurant_manager") {
         authQuery = "SELECT id FROM orders WHERE id = ? AND restaurant_id = ?";
         authParams.push(session.user.restaurant_id!);
      } else if (session.user.role === "delivery_man") {
         authQuery =
            "SELECT id FROM orders WHERE id = ? AND (delivery_man_id = ? OR delivery_man_id IS NULL)";
         authParams.push(session.user.id);
      } else if (session.user.role === "customer") {
         authQuery =
            "SELECT id FROM orders WHERE id = ? AND user_id = ? AND status = 'pending'";
         authParams.push(session.user.id);
      }

      const [authRows] = await db.execute(authQuery, authParams);

      if (!(authRows as unknown[]).length) {
         return NextResponse.json(
            { error: "Order not found or permission denied" },
            { status: 404 }
         );
      }

      // Update the order
      let updateQuery = "UPDATE orders SET status = ?";
      const updateParams: (string | number)[] = [status];

      if (status === "out_for_delivery" && delivery_man_id) {
         updateQuery += ", delivery_man_id = ?";
         updateParams.push(delivery_man_id);
      }

      if (status === "delivered") {
         updateQuery += ", delivered_at = CURRENT_TIMESTAMP";
      }

      updateQuery += " WHERE id = ?";
      updateParams.push(id);

      await db.execute(updateQuery, updateParams);

      return NextResponse.json({
         success: true,
         message: "Order status updated successfully",
      });
   } catch (error) {
      console.error("Order update error:", error);
      return NextResponse.json(
         { error: "Failed to update order" },
         { status: 500 }
      );
   }
}
