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
   restaurant_name: string;
   total_amount: number;
   status: string;
   delivery_address: string;
   delivery_phone: string;
   notes: string;
   created_at: string;
   delivery_man_id?: number;
}

export default function DeliveryDashboard() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [orders, setOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(true);

   // Check authentication and role
   useEffect(() => {
      if (status === "loading") return;

      if (!session || session.user.role !== "delivery_man") {
         router.push("/auth/delivery/signin");
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

   const acceptDelivery = async (orderId: number) => {
      try {
         const response = await fetch(`/api/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               status: "out_for_delivery",
               delivery_man_id: session?.user.id,
            }),
         });

         if (response.ok) {
            fetchOrders(); // Refresh orders
         } else {
            alert("Failed to accept delivery");
         }
      } catch (error) {
         console.error("Failed to accept delivery:", error);
         alert("Failed to accept delivery");
      }
   };

   const markAsDelivered = async (orderId: number) => {
      try {
         const response = await fetch(`/api/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "delivered" }),
         });

         if (response.ok) {
            fetchOrders(); // Refresh orders
         } else {
            alert("Failed to mark as delivered");
         }
      } catch (error) {
         console.error("Failed to mark as delivered:", error);
         alert("Failed to mark as delivered");
      }
   };

   const getStatusColor = (status: string) => {
      const colors: Record<string, string> = {
         ready_for_pickup: "bg-green-500",
         out_for_delivery: "bg-orange-500",
         delivered: "bg-gray-500",
      };
      return colors[status] || "bg-gray-500";
   };

   if (status === "loading" || loading) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-lg">Loading...</div>
         </div>
      );
   }

   if (!session || session.user.role !== "delivery_man") {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-lg">Unauthorized access</div>
         </div>
      );
   }

   const availableOrders = orders.filter(
      (order) => order.status === "ready_for_pickup" && !order.delivery_man_id
   );
   const myOrders = orders.filter(
      (order) => order.delivery_man_id === parseInt(session.user.id)
   );

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Header */}
         <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                     <h1 className="text-2xl font-bold text-green-600">
                        Delivery Dashboard
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
            {/* Available Orders */}
            <div className="mb-8">
               <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Available Deliveries ({availableOrders.length})
               </h2>
               {availableOrders.length === 0 ? (
                  <Card>
                     <CardContent className="text-center py-8">
                        <p className="text-gray-500">No available deliveries</p>
                     </CardContent>
                  </Card>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {availableOrders.map((order) => (
                        <Card key={order.id} className="border-green-200">
                           <CardHeader>
                              <div className="flex justify-between items-start">
                                 <div>
                                    <CardTitle>Order #{order.id}</CardTitle>
                                    <CardDescription>
                                       From: {order.restaurant_name}
                                    </CardDescription>
                                 </div>
                                 <Badge
                                    className={getStatusColor(order.status)}
                                 >
                                    READY FOR PICKUP
                                 </Badge>
                              </div>
                           </CardHeader>
                           <CardContent>
                              <div className="space-y-2">
                                 <p className="text-sm">
                                    <strong>Customer:</strong>{" "}
                                    {order.customer_name}
                                 </p>
                                 <p className="text-sm">
                                    <strong>Phone:</strong>{" "}
                                    {order.delivery_phone}
                                 </p>
                                 <p className="text-sm">
                                    <strong>Address:</strong>{" "}
                                    {order.delivery_address}
                                 </p>
                                 <p className="text-sm">
                                    <strong>Amount:</strong> $
                                    {Number(order.total_amount).toFixed(2)}
                                 </p>
                              </div>
                              <div className="mt-4">
                                 <Button
                                    onClick={() => acceptDelivery(order.id)}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                 >
                                    Accept Delivery
                                 </Button>
                              </div>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               )}
            </div>

            {/* My Orders */}
            <div>
               <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  My Deliveries ({myOrders.length})
               </h2>
               {myOrders.length === 0 ? (
                  <Card>
                     <CardContent className="text-center py-8">
                        <p className="text-gray-500">No current deliveries</p>
                     </CardContent>
                  </Card>
               ) : (
                  <div className="grid grid-cols-1 gap-6">
                     {myOrders.map((order) => (
                        <Card key={order.id}>
                           <CardHeader>
                              <div className="flex justify-between items-start">
                                 <div>
                                    <CardTitle>Order #{order.id}</CardTitle>
                                    <CardDescription>
                                       From: {order.restaurant_name}
                                    </CardDescription>
                                 </div>
                                 <Badge
                                    className={getStatusColor(order.status)}
                                 >
                                    {order.status
                                       .replace("_", " ")
                                       .toUpperCase()}
                                 </Badge>
                              </div>
                           </CardHeader>
                           <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <h4 className="font-medium text-gray-900">
                                       Customer
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                       {order.customer_name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                       {order.delivery_phone}
                                    </p>
                                 </div>
                                 <div>
                                    <h4 className="font-medium text-gray-900">
                                       Delivery Address
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                       {order.delivery_address}
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
                                    Amount: $
                                    {Number(order.total_amount).toFixed(2)}
                                 </div>
                                 {order.status === "out_for_delivery" && (
                                    <Button
                                       onClick={() => markAsDelivered(order.id)}
                                       className="bg-green-600 hover:bg-green-700"
                                    >
                                       Mark as Delivered
                                    </Button>
                                 )}
                              </div>
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
