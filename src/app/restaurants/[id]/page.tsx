"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MenuItem {
   id: number;
   name: string;
   description: string;
   price: string; // Price comes as string from database
   category: string;
}

export default function RestaurantMenu() {
   const { data: session } = useSession();
   const params = useParams();
   const router = useRouter();
   const restaurantId = params.id as string;
   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [cart, setCart] = useState<{ [key: number]: number }>({});

   useEffect(() => {
      const fetchMenu = async () => {
         try {
            const response = await fetch(
               `/api/restaurants/${restaurantId}/menu`
            );
            if (response.ok) {
               const data = await response.json();
               setMenuItems(data.menuItems);
            }
         } catch (error) {
            console.error("Failed to fetch menu:", error);
         } finally {
            setLoading(false);
         }
      };

      if (restaurantId) {
         fetchMenu();
      }
   }, [restaurantId]);

   const addToCart = (itemId: number) => {
      setCart((prev) => ({
         ...prev,
         [itemId]: (prev[itemId] || 0) + 1,
      }));
   };

   const removeFromCart = (itemId: number) => {
      setCart((prev) => {
         const newCart = { ...prev };
         if (newCart[itemId] > 1) {
            newCart[itemId]--;
         } else {
            delete newCart[itemId];
         }
         return newCart;
      });
   };

   const getTotalPrice = () => {
      return Object.entries(cart).reduce((total, [itemId, quantity]) => {
         const item = menuItems.find((item) => item.id === parseInt(itemId));
         return total + (item ? Number(item.price) * quantity : 0);
      }, 0);
   };

   const getTotalItems = () => {
      return Object.values(cart).reduce(
         (total, quantity) => total + quantity,
         0
      );
   };

   const handleCheckout = () => {
      if (getTotalItems() === 0) {
         alert("Please add items to your cart before checkout");
         return;
      }

      // Check if user is logged in and is a customer
      if (!session) {
         alert("Please login as a customer to proceed to checkout");
         router.push("/auth/customer/signin");
         return;
      }

      if (session.user.role !== "customer") {
         alert("Only customers can place orders");
         return;
      }

      // Create cart data for checkout page
      const cartItems = Object.entries(cart)
         .map(([itemId, quantity]) => {
            const item = menuItems.find((item) => item.id === parseInt(itemId));
            return {
               id: parseInt(itemId),
               name: item?.name,
               price: item?.price,
               quantity,
            };
         })
         .filter((item) => item.name); // Filter out items not found

      const queryParams = new URLSearchParams({
         cart: JSON.stringify(cartItems),
         total: getTotalPrice().toFixed(2),
         restaurant: restaurantId,
      });

      router.push(`/checkout?${queryParams.toString()}`);
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-lg">Loading menu...</div>
         </div>
      );
   }

   const categories = [...new Set(menuItems.map((item) => item.category))];

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
                     {session ? (
                        <>
                           <span className="text-sm text-gray-600">
                              Welcome, {session.user.name}
                           </span>
                           {session.user.role === "customer" && (
                              <Link href="/orders">
                                 <Button variant="outline">My Orders</Button>
                              </Link>
                           )}
                           <Link href="/restaurants">
                              <Button variant="outline">
                                 Back to Restaurants
                              </Button>
                           </Link>
                           <Button
                              variant="outline"
                              onClick={() => signOut({ callbackUrl: "/" })}
                           >
                              Sign Out
                           </Button>
                           <ThemeToggle />
                        </>
                     ) : (
                        <>
                           <ThemeToggle />
                           <Link href="/auth/customer/signin">
                              <Button variant="outline">Sign In</Button>
                           </Link>
                           <Link href="/restaurants">
                              <Button variant="outline">
                                 Back to Restaurants
                              </Button>
                           </Link>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </nav>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Restaurant Menu
               </h1>
               <p className="mt-2 text-gray-600">Choose your favorite dishes</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               {/* Menu Items */}
               <div className="lg:col-span-3">
                  {categories.map((category) => (
                     <div key={category} className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                           {category}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {menuItems
                              .filter((item) => item.category === category)
                              .map((item) => (
                                 <Card key={item.id}>
                                    <CardHeader>
                                       <div className="flex justify-between items-start">
                                          <div>
                                             <CardTitle className="text-lg">
                                                {item.name}
                                             </CardTitle>
                                             <CardDescription className="mt-1">
                                                {item.description}
                                             </CardDescription>
                                          </div>
                                          <Badge variant="secondary">
                                             ₹{Number(item.price).toFixed(2)}
                                          </Badge>
                                       </div>
                                    </CardHeader>
                                    <CardContent>
                                       <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                             {cart[item.id] && (
                                                <>
                                                   <Button
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={() =>
                                                         removeFromCart(item.id)
                                                      }
                                                   >
                                                      -
                                                   </Button>
                                                   <span className="font-medium">
                                                      {cart[item.id]}
                                                   </span>
                                                </>
                                             )}
                                             <Button
                                                size="sm"
                                                onClick={() =>
                                                   addToCart(item.id)
                                                }
                                             >
                                                {cart[item.id]
                                                   ? "+"
                                                   : "Add to Cart"}
                                             </Button>
                                          </div>
                                       </div>
                                    </CardContent>
                                 </Card>
                              ))}
                        </div>
                     </div>
                  ))}
               </div>

               {/* Cart Summary */}
               <div className="lg:col-span-1">
                  <Card className="sticky top-4">
                     <CardHeader>
                        <CardTitle>Your Order</CardTitle>
                     </CardHeader>
                     <CardContent>
                        {getTotalItems() === 0 ? (
                           <p className="text-gray-500">Your cart is empty</p>
                        ) : (
                           <div className="space-y-4">
                              {Object.entries(cart).map(
                                 ([itemId, quantity]) => {
                                    const item = menuItems.find(
                                       (item) => item.id === parseInt(itemId)
                                    );
                                    if (!item) return null;
                                    return (
                                       <div
                                          key={itemId}
                                          className="flex justify-between items-center"
                                       >
                                          <div>
                                             <p className="font-medium">
                                                {item.name}
                                             </p>
                                             <p className="text-sm text-gray-500">
                                                ₹{Number(item.price).toFixed(2)}{" "}
                                                x {quantity}
                                             </p>
                                          </div>
                                          <p className="font-medium">
                                             ₹
                                             {(
                                                Number(item.price) * quantity
                                             ).toFixed(2)}
                                          </p>
                                       </div>
                                    );
                                 }
                              )}
                              <hr />
                              <div className="flex justify-between items-center font-bold">
                                 <span>Total</span>
                                 <span>₹{getTotalPrice().toFixed(2)}</span>
                              </div>
                              <Button
                                 className="w-full"
                                 onClick={handleCheckout}
                              >
                                 Proceed to Checkout
                              </Button>
                           </div>
                        )}
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </div>
   );
}
