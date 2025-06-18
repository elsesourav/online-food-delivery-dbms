"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Order {
   id: number;
   restaurant_name: string;
   total_amount: number;
   status: string;
   delivery_address: string;
   delivery_phone: string;
   notes: string;
   created_at: string;
   estimated_delivery_time?: string;
   delivered_at?: string;
}

export default function CustomerOrders() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [orders, setOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(true);

   // Check authentication and role
   useEffect(() => {
      if (status === "loading") return;

      if (!session || session.user.role !== "customer") {
         router.push("/auth/customer/signin");
         return;
      }

      fetchOrders();
   }, [session, status, router]);

   const fetchOrders = async () => {
      try {
         const response = await fetch("/api/orders");
         if (response.ok) {
            const data = await response.json();
            setOrders(data.orders);
         }
      } catch (error) {
         console.error("Failed to fetch orders:", error);
      } finally {
         setLoading(false);
      }
   };

   const cancelOrder = async (orderId: number) => {
      if (!confirm("Are you sure you want to cancel this order?")) return;

      try {
         const response = await fetch(`/api/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "cancelled" }),
         });

         if (response.ok) {
            fetchOrders(); // Refresh orders
         } else {
            alert("Failed to cancel order");
         }
      } catch (error) {
         console.error("Failed to cancel order:", error);
         alert("Failed to cancel order");
      }
   };

   const getStatusColor = (status: string) => {
      const colors: Record<string, string> = {
         pending: "bg-yellow-500",
         confirmed: "bg-blue-500",
         preparing: "bg-purple-500",
         ready_for_pickup: "bg-green-500",
         out_for_delivery: "bg-orange-500",
         delivered: "bg-gray-500",
         cancelled: "bg-red-500",
      };
      return colors[status] || "bg-gray-500";
   };

   const getStatusDescription = (status: string) => {
      const descriptions: Record<string, string> = {
         pending: "Your order is being reviewed",
         confirmed: "Restaurant confirmed your order",
         preparing: "Your food is being prepared",
         ready_for_pickup: "Ready for delivery pickup",
         out_for_delivery: "On the way to you",
         delivered: "Order delivered successfully",
         cancelled: "Order was cancelled",
      };
      return descriptions[status] || "Unknown status";
   };

   if (status === "loading" || loading) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-lg">Loading...</div>
         </div>
      );
   }

   if (!session || session.user.role !== "customer") {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-lg">Unauthorized access</div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Header */}
         <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center h-16">
                  <Link href="/" className="text-2xl font-bold text-orange-600">
                     FoodDelivery
                  </Link>
                  <div className="flex items-center space-x-4">
                     <Link href="/restaurants">
                        <Button variant="outline">Browse Restaurants</Button>
                     </Link>
                     <span className="text-sm text-gray-600">
                        Welcome, {session.user.name}
                     </span>
                     <Button
                        variant="outline"
                        onClick={() => signOut({ callbackUrl: "/" })}
                     >
                        Sign Out
                     </Button>
                  </div>
               </div>
            </div>
         </nav>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
               <p className="mt-2 text-gray-600">
                  Track your current and past orders
               </p>
            </div>

            {orders.length === 0 ? (
               <Card>
                  <CardContent className="text-center py-12">
                     <p className="text-gray-500 mb-4">No orders found</p>
                     <Link href="/restaurants">
                        <Button>Start Ordering</Button>
                     </Link>
                  </CardContent>
               </Card>
            ) : (
               <div className="grid grid-cols-1 gap-6">
                  {orders.map((order) => (
                     <Card key={order.id}>
                        <CardHeader>
                           <div className="flex justify-between items-start">
                              <div>
                                 <CardTitle>Order #{order.id}</CardTitle>
                                 <CardDescription>
                                    From: {order.restaurant_name} •{" "}
                                    {new Date(
                                       order.created_at
                                    ).toLocaleDateString()}{" "}
                                    at{" "}
                                    {new Date(
                                       order.created_at
                                    ).toLocaleTimeString()}
                                 </CardDescription>
                              </div>
                              <Badge className={getStatusColor(order.status)}>
                                 {order.status.replace("_", " ").toUpperCase()}
                              </Badge>
                           </div>
                        </CardHeader>
                        <CardContent>
                           <div className="mb-4">
                              <p className="text-sm text-gray-600">
                                 {getStatusDescription(order.status)}
                              </p>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <h4 className="font-medium text-gray-900">
                                    Delivery Details
                                 </h4>
                                 <p className="text-sm text-gray-600">
                                    Address: {order.delivery_address}
                                 </p>
                                 <p className="text-sm text-gray-600">
                                    Phone: {order.delivery_phone}
                                 </p>
                              </div>
                              <div>
                                 <h4 className="font-medium text-gray-900">
                                    Order Info
                                 </h4>
                                 <p className="text-sm text-gray-600">
                                    Total: $
                                    {Number(order.total_amount).toFixed(2)}
                                 </p>
                                 {order.delivered_at && (
                                    <p className="text-sm text-gray-600">
                                       Delivered:{" "}
                                       {new Date(
                                          order.delivered_at
                                       ).toLocaleString()}
                                    </p>
                                 )}
                              </div>
                           </div>

                           {order.notes && (
                              <div className="mt-4">
                                 <h4 className="font-medium text-gray-900">
                                    Notes
                                 </h4>
                                 <p className="text-sm text-gray-600">
                                    {order.notes}
                                 </p>
                              </div>
                           )}

                           <div className="mt-4 flex justify-between items-center">
                              <div>
                                 {/* Order Status Progress */}
                                 <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <div
                                       className={`w-3 h-3 rounded-full ${
                                          [
                                             "confirmed",
                                             "preparing",
                                             "ready_for_pickup",
                                             "out_for_delivery",
                                             "delivered",
                                          ].includes(order.status)
                                             ? "bg-green-500"
                                             : "bg-gray-300"
                                       }`}
                                    ></div>
                                    <span>Confirmed</span>
                                    <div className="w-6 h-0.5 bg-gray-300"></div>
                                    <div
                                       className={`w-3 h-3 rounded-full ${
                                          [
                                             "preparing",
                                             "ready_for_pickup",
                                             "out_for_delivery",
                                             "delivered",
                                          ].includes(order.status)
                                             ? "bg-green-500"
                                             : "bg-gray-300"
                                       }`}
                                    ></div>
                                    <span>Preparing</span>
                                    <div className="w-6 h-0.5 bg-gray-300"></div>
                                    <div
                                       className={`w-3 h-3 rounded-full ${
                                          [
                                             "out_for_delivery",
                                             "delivered",
                                          ].includes(order.status)
                                             ? "bg-green-500"
                                             : "bg-gray-300"
                                       }`}
                                    ></div>
                                    <span>On the way</span>
                                    <div className="w-6 h-0.5 bg-gray-300"></div>
                                    <div
                                       className={`w-3 h-3 rounded-full ${
                                          order.status === "delivered"
                                             ? "bg-green-500"
                                             : "bg-gray-300"
                                       }`}
                                    ></div>
                                    <span>Delivered</span>
                                 </div>
                              </div>
                              <div>
                                 {order.status === "pending" && (
                                    <Button
                                       variant="destructive"
                                       size="sm"
                                       onClick={() => cancelOrder(order.id)}
                                    >
                                       Cancel Order
                                    </Button>
                                 )}
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
