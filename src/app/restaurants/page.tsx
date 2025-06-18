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
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Restaurant {
   id: number;
   name: string;
   description: string;
   address: string;
   phone: string;
}

export default function Restaurants() {
   const { data: session, status } = useSession();
   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchRestaurants = async () => {
         try {
            const response = await fetch("/api/restaurants");
            if (response.ok) {
               const data = await response.json();
               setRestaurants(data.restaurants);
            }
         } catch (error) {
            console.error("Failed to fetch restaurants:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchRestaurants();
   }, []);

   if (loading || status === "loading") {
      return (
         <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-lg text-gray-900 dark:text-gray-100">
               Loading restaurants...
            </div>
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
                     {session ? (
                        <>
                           <span className="text-sm text-gray-600 dark:text-gray-300">
                              Welcome, {session.user.name}
                           </span>
                           {session.user.role === "customer" && (
                              <Link href="/orders">
                                 <Button variant="outline">My Orders</Button>
                              </Link>
                           )}
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
                           <Link href="/auth/signin">
                              <Button variant="outline">Sign In</Button>
                           </Link>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </nav>

         {/* Content */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Choose a Restaurant
               </h1>
               <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Browse our selection of delicious restaurants
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {restaurants.map((restaurant) => (
                  <Card
                     key={restaurant.id}
                     className="hover:shadow-lg transition-shadow"
                  >
                     <CardHeader>
                        <CardTitle>{restaurant.name}</CardTitle>
                        <CardDescription>
                           {restaurant.description}
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-2 mb-4">
                           <p className="text-sm text-gray-600 dark:text-gray-300">
                              📍 {restaurant.address}
                           </p>
                           <p className="text-sm text-gray-600 dark:text-gray-300">
                              📞 {restaurant.phone}
                           </p>
                        </div>
                        <Link href={`/restaurants/${restaurant.id}`}>
                           <Button className="w-full">View Menu</Button>
                        </Link>
                     </CardContent>
                  </Card>
               ))}
            </div>

            {restaurants.length === 0 && (
               <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                     No restaurants available at the moment.
                  </p>
               </div>
            )}
         </div>
      </div>
   );
}
