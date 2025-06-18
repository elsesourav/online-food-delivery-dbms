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

export default function Home() {
   const { data: session } = useSession();

   return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
         {/* Header */}
         <nav className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                     <h1 className="text-2xl font-bold text-orange-600">
                        FoodDelivery
                     </h1>
                  </div>
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
                           {session.user.role === "restaurant_manager" && (
                              <Link href="/dashboard/restaurant">
                                 <Button variant="outline">Dashboard</Button>
                              </Link>
                           )}
                           {session.user.role === "delivery_man" && (
                              <Link href="/dashboard/delivery">
                                 <Button variant="outline">Dashboard</Button>
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
                           <div className="relative group">
                              <Button variant="outline">Sign In</Button>
                              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                 <div className="py-1">
                                    <Link
                                       href="/auth/customer/signin"
                                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                       Customer Login
                                    </Link>
                                    <Link
                                       href="/auth/restaurant/signin"
                                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                       Restaurant Manager
                                    </Link>
                                    <Link
                                       href="/auth/delivery/signin"
                                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                       Delivery Personnel
                                    </Link>
                                 </div>
                              </div>
                           </div>
                           <div className="relative group">
                              <Button>Sign Up</Button>
                              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                 <div className="py-1">
                                    <Link
                                       href="/auth/signup"
                                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                       Customer Signup
                                    </Link>
                                    <Link
                                       href="/auth/restaurant/signup"
                                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                       Restaurant Manager
                                    </Link>
                                    <Link
                                       href="/auth/delivery/signup"
                                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                       Delivery Personnel
                                    </Link>
                                 </div>
                              </div>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </nav>

         {/* Hero Section */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
               <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
                  Delicious Food
                  <span className="text-orange-600"> Delivered Fast</span>
               </h1>
               <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                  Order from your favorite restaurants and get fresh, hot meals
                  delivered to your doorstep in minutes.
               </p>
               <div className="mt-10">
                  <Link href="/restaurants">
                     <Button size="lg" className="text-lg px-8 py-3">
                        Order Now
                     </Button>
                  </Link>
               </div>
            </div>
         </div>

         {/* Features */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-gray-900">
                  Why Choose Us?
               </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <Card>
                  <CardHeader>
                     <CardTitle className="text-center">
                        🚀 Fast Delivery
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <CardDescription className="text-center">
                        Get your food delivered in 30 minutes or less
                     </CardDescription>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader>
                     <CardTitle className="text-center">
                        🍕 Quality Food
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <CardDescription className="text-center">
                        Fresh ingredients and carefully prepared meals
                     </CardDescription>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader>
                     <CardTitle className="text-center">
                        💯 Easy Ordering
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <CardDescription className="text-center">
                        Simple and intuitive ordering process
                     </CardDescription>
                  </CardContent>
               </Card>
            </div>
         </div>

         {/* User Types */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-gray-900">
                  Join Our Platform
               </h2>
               <p className="mt-4 text-xl text-gray-600">
                  Different access portals for different users
               </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <Card className="border-orange-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                     <CardTitle className="text-center text-orange-600">
                        🛒 Customers
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                     <CardDescription className="mb-4">
                        Order delicious food from your favorite restaurants
                     </CardDescription>
                     <div className="space-y-2">
                        <Link href="/auth/customer/signin">
                           <Button className="w-full bg-orange-600 hover:bg-orange-700">
                              Customer Login
                           </Button>
                        </Link>
                        <Link href="/auth/signup">
                           <Button variant="outline" className="w-full">
                              Sign Up as Customer
                           </Button>
                        </Link>
                     </div>
                  </CardContent>
               </Card>
               <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                     <CardTitle className="text-center text-blue-600">
                        🏪 Restaurant Managers
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                     <CardDescription className="mb-4">
                        Manage your restaurant orders and menu items
                     </CardDescription>
                     <div className="space-y-2">
                        <Link href="/auth/restaurant/signin">
                           <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              Manager Login
                           </Button>
                        </Link>
                        <Link href="/auth/restaurant/signup">
                           <Button variant="outline" className="w-full">
                              Sign Up as Manager
                           </Button>
                        </Link>
                     </div>
                  </CardContent>
               </Card>
               <Card className="border-green-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                     <CardTitle className="text-center text-green-600">
                        🚚 Delivery Personnel
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                     <CardDescription className="mb-4">
                        Accept deliveries and manage your delivery schedule
                     </CardDescription>
                     <div className="space-y-2">
                        <Link href="/auth/delivery/signin">
                           <Button className="w-full bg-green-600 hover:bg-green-700">
                              Delivery Login
                           </Button>
                        </Link>
                        <Link href="/auth/delivery/signup">
                           <Button variant="outline" className="w-full">
                              Sign Up as Delivery
                           </Button>
                        </Link>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
