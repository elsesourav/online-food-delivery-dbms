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

export default function CustomerSignIn() {
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
            // Check if user is actually a customer
            const response = await fetch("/api/auth/verify-role", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ email, expectedRole: "customer" }),
            });

            if (response.ok) {
               router.push("/restaurants");
               router.refresh();
            } else {
               setError("Access denied: Customer login only");
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-md w-full space-y-8">
            <div className="text-center">
               <Link href="/" className="text-3xl font-bold text-orange-600">
                  FoodDelivery
               </Link>
               <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  Customer Sign In
               </h2>
               <p className="mt-2 text-sm text-gray-600">
                  Sign in to order delicious food
               </p>
            </div>
            <Card>
               <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                     Enter your credentials to access your account
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
                           placeholder="customer@example.com"
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
                        className="w-full"
                        disabled={loading}
                     >
                        {loading ? "Signing in..." : "Sign In"}
                     </Button>
                  </form>
                  <div className="mt-4 text-center">
                     <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link
                           href="/auth/signup"
                           className="text-orange-600 hover:underline"
                        >
                           Sign up
                        </Link>
                     </p>
                     <div className="mt-4 space-y-2">
                        <p className="text-xs text-gray-500">
                           Other login types:
                        </p>
                        <div className="space-x-2">
                           <Link
                              href="/auth/restaurant/signin"
                              className="text-xs text-blue-600 hover:underline"
                           >
                              Restaurant Manager
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
