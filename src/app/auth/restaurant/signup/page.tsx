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
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RestaurantManagerSignUp() {
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      restaurant_name: "",
      restaurant_description: "",
      restaurant_address: "",
      restaurant_phone: "",
   });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const router = useRouter();

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      if (!formData.restaurant_name || !formData.restaurant_address) {
         setError("Please fill in all restaurant details");
         setLoading(false);
         return;
      }

      try {
         const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               ...formData,
               role: "restaurant_manager",
            }),
         });

         if (response.ok) {
            router.push(
               "/auth/restaurant/signin?message=Account and restaurant created successfully"
            );
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
      <div className="min-h-screen bg-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
         <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Link href="/" className="flex justify-center">
               <span className="text-3xl font-bold text-blue-600">
                  FoodDelivery
               </span>
            </Link>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
               Restaurant Manager Signup
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
               Or{" "}
               <Link
                  href="/auth/restaurant/signin"
                  className="font-medium text-blue-600 hover:text-blue-500"
               >
                  sign in to existing account
               </Link>
            </p>
         </div>

         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <Card>
               <CardHeader>
                  <CardTitle>Join as Restaurant Manager</CardTitle>
                  <CardDescription>
                     Create your manager account and register your restaurant
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
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                           id="phone"
                           name="phone"
                           type="tel"
                           value={formData.phone}
                           onChange={handleChange}
                           required
                           className="mt-1"
                        />
                     </div>

                     {/* Restaurant Details Section */}
                     <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                           Restaurant Details
                        </h3>

                        <div>
                           <Label htmlFor="restaurant_name">
                              Restaurant Name
                           </Label>
                           <Input
                              id="restaurant_name"
                              name="restaurant_name"
                              type="text"
                              value={formData.restaurant_name}
                              onChange={handleChange}
                              required
                              className="mt-1"
                              placeholder="Enter your restaurant name"
                           />
                        </div>

                        <div>
                           <Label htmlFor="restaurant_description">
                              Restaurant Description
                           </Label>
                           <Textarea
                              id="restaurant_description"
                              name="restaurant_description"
                              value={formData.restaurant_description}
                              onChange={handleChange}
                              className="mt-1"
                              placeholder="Describe your restaurant and cuisine type"
                              rows={3}
                           />
                        </div>

                        <div>
                           <Label htmlFor="restaurant_address">
                              Restaurant Address
                           </Label>
                           <Textarea
                              id="restaurant_address"
                              name="restaurant_address"
                              value={formData.restaurant_address}
                              onChange={handleChange}
                              required
                              className="mt-1"
                              placeholder="Enter full restaurant address"
                              rows={2}
                           />
                        </div>

                        <div>
                           <Label htmlFor="restaurant_phone">
                              Restaurant Phone
                           </Label>
                           <Input
                              id="restaurant_phone"
                              name="restaurant_phone"
                              type="tel"
                              value={formData.restaurant_phone}
                              onChange={handleChange}
                              required
                              className="mt-1"
                              placeholder="Restaurant contact number"
                           />
                        </div>
                     </div>

                     <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={loading}
                     >
                        {loading
                           ? "Creating account..."
                           : "Create Account & Restaurant"}
                     </Button>
                  </form>
                  <div className="mt-4 text-center">
                     <div className="space-y-2">
                        <p className="text-xs text-gray-500">
                           Other signup types:
                        </p>
                        <div className="space-x-2">
                           <Link
                              href="/auth/signup"
                              className="text-xs text-orange-600 hover:underline"
                           >
                              Customer
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
