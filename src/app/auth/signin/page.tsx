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

export default function SignIn() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
         const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
         });

         if (result?.error) {
            setError("Invalid email or password");
         } else {
            router.push("/restaurants");
         }
      } catch {
         setError("Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
         <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
               Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
               Or{" "}
               <Link
                  href="/auth/signup"
                  className="font-medium text-orange-600 hover:text-orange-500"
               >
                  create a new account
               </Link>
            </p>
         </div>

         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <Card>
               <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>
                     Sign in to your FoodDelivery account
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                     {error && (
                        <div className="rounded-md bg-red-50 p-4">
                           <div className="text-sm text-red-700">{error}</div>
                        </div>
                     )}

                     <div>
                        <Label htmlFor="email">Email address</Label>
                        <Input
                           id="email"
                           type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required
                           className="mt-1"
                        />
                     </div>

                     <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                           id="password"
                           type="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                           className="mt-1"
                        />
                     </div>

                     <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                     >
                        {loading ? "Signing in..." : "Sign in"}
                     </Button>
                  </form>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
