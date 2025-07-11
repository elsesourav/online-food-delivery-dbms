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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
   });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const router = useRouter();

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
         const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         });

         if (response.ok) {
            router.push("/auth/signin?message=Account created successfully");
         } else {
            const data = await response.json();
            setError(data.error || "Something went wrong");
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
            <Link href="/" className="flex justify-center">
               <span className="text-3xl font-bold text-orange-600">
                  FoodDelivery
               </span>
            </Link>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
               Create Customer Account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
               Or{" "}
               <Link
                  href="/auth/customer/signin"
                  className="font-medium text-orange-600 hover:text-orange-500"
               >
                  sign in to existing account
               </Link>
            </p>
         </div>

         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <Card>
               <CardHeader>
                  <CardTitle>Join FoodDelivery</CardTitle>
                  <CardDescription>
                     Create your account to start ordering
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
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                           id="name"
                           name="name"
                           type="text"
                           value={formData.name}
                           onChange={handleChange}
                           required
                           className="mt-1"
                        />
                     </div>

                     <div>
                        <Label htmlFor="email">Email address</Label>
                        <Input
                           id="email"
                           name="email"
                           type="email"
                           value={formData.email}
                           onChange={handleChange}
                           required
                           className="mt-1"
                        />
                     </div>

                     <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                           id="password"
                           name="password"
                           type="password"
                           value={formData.password}
                           onChange={handleChange}
                           required
                           minLength={6}
                           className="mt-1"
                        />
                     </div>

                     <div>
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input
                           id="phone"
                           name="phone"
                           type="tel"
                           value={formData.phone}
                           onChange={handleChange}
                           className="mt-1"
                        />
                     </div>

                     <div>
                        <Label htmlFor="address">Address (optional)</Label>
                        <Input
                           id="address"
                           name="address"
                           type="text"
                           value={formData.address}
                           onChange={handleChange}
                           className="mt-1"
                        />
                     </div>

                     <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                     >
                        {loading
                           ? "Creating account..."
                           : "Create Customer Account"}
                     </Button>
                  </form>
                  <div className="mt-4 text-center">
                     <div className="space-y-2">
                        <p className="text-xs text-gray-500">
                           Other signup types:
                        </p>
                        <div className="space-x-2">
                           <Link
                              href="/auth/restaurant/signup"
                              className="text-xs text-blue-600 hover:underline"
                           >
                              Restaurant Manager
                           </Link>
                           <span className="text-xs text-gray-400">•</span>
                           <Link
                              href="/auth/delivery/signup"
                              className="text-xs text-green-600 hover:underline"
                           >
                              Delivery Personnel
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
