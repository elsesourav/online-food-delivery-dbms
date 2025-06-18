"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Checkout() {
   const { data: session, status } = useSession();
   const searchParams = useSearchParams();
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [orderData, setOrderData] = useState({
      delivery_address: "",
      delivery_phone: "",
      notes: "",
   });

   // Redirect to login if not authenticated
   useEffect(() => {
      if (status === "loading") return; // Still loading

      if (!session) {
         router.push("/auth/customer/signin");
         return;
      }

      // Check if user is a customer
      if (session.user.role !== "customer") {
         alert("Only customers can place orders");
         router.push("/");
         return;
      }
   }, [session, status, router]);

   // Get cart data from URL params
   const cartData = searchParams.get("cart");
   const totalAmount = searchParams.get("total");
   const restaurantId = searchParams.get("restaurant");

   // If not authenticated, show loading or redirect message
   if (status === "loading") {
      return (
         <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-lg">Loading...</div>
         </div>
      );
   }

   if (!session) {
      return (
         <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-lg">Redirecting to login...</div>
         </div>
      );
   }

   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      setOrderData({
         ...orderData,
         [e.target.name]: e.target.value,
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
         if (!cartData || !totalAmount || !restaurantId) {
            alert("Invalid order data");
            return;
         }

         const cartItems = JSON.parse(cartData);

         const response = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               restaurant_id: parseInt(restaurantId),
               cart_items: cartItems,
               total_amount: parseFloat(totalAmount),
               delivery_address: orderData.delivery_address,
               delivery_phone: orderData.delivery_phone,
               notes: orderData.notes,
            }),
         });

         if (response.ok) {
            const result = await response.json();
            alert(`Order placed successfully! Order #${result.orderId}`);
            router.push("/restaurants");
         } else {
            const error = await response.json();
            alert(`Failed to place order: ${error.error}`);
         }
      } catch (error) {
         console.error("Order placement error:", error);
         alert("Failed to place order");
      } finally {
         setLoading(false);
      }
   };

   if (!cartData || !totalAmount) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Card>
               <CardHeader>
                  <CardTitle>Invalid Checkout</CardTitle>
                  <CardDescription>No cart data found</CardDescription>
               </CardHeader>
               <CardContent>
                  <Link href="/restaurants">
                     <Button>Back to Restaurants</Button>
                  </Link>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
         {/* Header */}
         <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center h-16">
                  <Link href="/" className="text-2xl font-bold text-orange-600">
                     FoodDelivery
                  </Link>
                  <div className="flex items-center space-x-4">
                     <ThemeToggle />
                     <Link href="/restaurants">
                        <Button variant="outline">Back to Restaurants</Button>
                     </Link>
                  </div>
               </div>
            </div>
         </nav>

         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Checkout
               </h1>
               <p className="mt-2 text-gray-600">Complete your order</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Order Form */}
               <Card>
                  <CardHeader>
                     <CardTitle>Delivery Information</CardTitle>
                     <CardDescription>
                        Please provide your delivery details
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                           <Label htmlFor="delivery_address">
                              Delivery Address *
                           </Label>
                           <Input
                              id="delivery_address"
                              name="delivery_address"
                              type="text"
                              value={orderData.delivery_address}
                              onChange={handleInputChange}
                              required
                              placeholder="Enter your full address"
                              className="mt-1"
                           />
                        </div>

                        <div>
                           <Label htmlFor="delivery_phone">
                              Phone Number *
                           </Label>
                           <Input
                              id="delivery_phone"
                              name="delivery_phone"
                              type="tel"
                              value={orderData.delivery_phone}
                              onChange={handleInputChange}
                              required
                              placeholder="Your contact number"
                              className="mt-1"
                           />
                        </div>

                        <div>
                           <Label htmlFor="notes">
                              Special Instructions (optional)
                           </Label>
                           <textarea
                              id="notes"
                              name="notes"
                              value={orderData.notes}
                              onChange={handleInputChange}
                              placeholder="Any special requests or notes"
                              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              rows={3}
                           />
                        </div>

                        <Button
                           type="submit"
                           className="w-full"
                           disabled={loading}
                        >
                           {loading
                              ? "Placing Order..."
                              : `Place Order - ₹${totalAmount}`}
                        </Button>
                     </form>
                  </CardContent>
               </Card>

               {/* Order Summary */}
               <Card>
                  <CardHeader>
                     <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-4">
                        <div className="text-sm text-gray-600">
                           Review your order details
                        </div>

                        {cartData && (
                           <div className="border-t pt-4">
                              <div className="flex justify-between items-center font-bold text-lg">
                                 <span>Total Amount</span>
                                 <span>₹{totalAmount}</span>
                              </div>
                           </div>
                        )}

                        <div className="text-xs text-gray-500 mt-4">
                           * Delivery fee and taxes may apply
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
