"use client";

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
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RestaurantSignIn() {
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
         const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
         });

         if (result?.error) {
            setError("Invalid email or password");
         } else {
            // Check if user is actually a restaurant manager
            const response = await fetch("/api/auth/verify-role", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                  email,
                  expectedRole: "restaurant_manager",
               }),
            });

            if (response.ok) {
               router.push("/dashboard/restaurant");
               router.refresh();
            } else {
               setError("Access denied: Restaurant manager login only");
               await signIn(); // Sign out if wrong role
            }
         }
      } catch (error) {
         console.error("Sign in error:", error);
         setError("Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-md w-full space-y-8">
            <div className="text-center">
               <Link href="/" className="text-3xl font-bold text-blue-600">
                  FoodDelivery
               </Link>
               <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Restaurant Manager
               </h2>
               <p className="mt-2 text-sm text-gray-600">
                  Manage your restaurant orders and menu
               </p>
            </div>
            <Card>
               <CardHeader>
                  <CardTitle>Manager Portal</CardTitle>
                  <CardDescription>
                     Enter your credentials to access the restaurant dashboard
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                           id="email"
                           name="email"
                           type="email"
                           required
                           placeholder="manager@restaurant.com"
                        />
                     </div>
                     <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                           id="password"
                           name="password"
                           type="password"
                           required
                           placeholder="••••••••"
                        />
                     </div>
                     {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                     )}
                     <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={loading}
                     >
                        {loading ? "Signing in..." : "Access Dashboard"}
                     </Button>
                  </form>
                  <div className="mt-4 text-center">
                     <div className="space-y-2">
                        <p className="text-xs text-gray-500">
                           Other login types:
                        </p>
                        <div className="space-x-2">
                           <Link
                              href="/auth/customer/signin"
                              className="text-xs text-orange-600 hover:underline"
                           >
                              Customer
                           </Link>
                           <span className="text-xs text-gray-400">•</span>
                           <Link
                              href="/auth/delivery/signin"
                              className="text-xs text-green-600 hover:underline"
                           >
                              Delivery Man
                           </Link>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
