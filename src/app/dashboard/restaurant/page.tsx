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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Order {
   id: number;
   customer_name: string;
   customer_phone: string;
   total_amount: number;
   status: string;
   delivery_address: string;
   delivery_phone: string;
   notes: string;
   created_at: string;
}

export default function RestaurantDashboard() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [orders, setOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(true);

   // Check authentication and role
   useEffect(() => {
      if (status === "loading") return;

      if (!session || session.user.role !== "restaurant_manager") {
         router.push("/auth/restaurant/signin");
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

   const updateOrderStatus = async (orderId: number, newStatus: string) => {
      try {
         const response = await fetch(`/api/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
         });

         if (response.ok) {
            fetchOrders(); // Refresh orders
         } else {
            alert("Failed to update order status");
         }
      } catch (error) {
         console.error("Failed to update order:", error);
         alert("Failed to update order status");
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

   const getNextStatus = (currentStatus: string) => {
      const statusFlow: Record<string, string> = {
         pending: "confirmed",
         confirmed: "preparing",
         preparing: "ready_for_pickup",
      };
      return statusFlow[currentStatus];
   };

   if (status === "loading" || loading) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-lg">Loading...</div>
         </div>
      );
   }

   if (!session || session.user.role !== "restaurant_manager") {
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
                  <div className="flex items-center">
                     <h1 className="text-2xl font-bold text-blue-600">
                        Restaurant Dashboard
                     </h1>
                  </div>
                  <div className="flex items-center space-x-4">
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
               <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
               <p className="mt-2 text-gray-600">
                  Manage your restaurant orders and update their status
               </p>
            </div>

            {orders.length === 0 ? (
               <Card>
                  <CardContent className="text-center py-8">
                     <p className="text-gray-500">No orders found</p>
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
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <h4 className="font-medium text-gray-900">
                                    Customer Details
                                 </h4>
                                 <p className="text-sm text-gray-600">
                                    Name: {order.customer_name}
                                 </p>
                                 <p className="text-sm text-gray-600">
                                    Phone: {order.customer_phone}
                                 </p>
                              </div>
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
                              <div className="text-lg font-bold">
                                 Total: ${Number(order.total_amount).toFixed(2)}
                              </div>
                              <div className="space-x-2">
                                 {getNextStatus(order.status) && (
                                    <Button
                                       onClick={() =>
                                          updateOrderStatus(
                                             order.id,
                                             getNextStatus(order.status)
                                          )
                                       }
                                    >
                                       Mark as{" "}
                                       {getNextStatus(order.status).replace(
                                          "_",
                                          " "
                                       )}
                                    </Button>
                                 )}
                                 {order.status === "pending" && (
                                    <Button
                                       variant="destructive"
                                       onClick={() =>
                                          updateOrderStatus(
                                             order.id,
                                             "cancelled"
                                          )
                                       }
                                    >
                                       Cancel
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
