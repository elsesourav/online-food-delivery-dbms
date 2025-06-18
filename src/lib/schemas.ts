import { z } from "zod";

export const UserSchema = z.object({
   id: z.number().optional(),
   email: z.string().email(),
   password: z.string().min(6),
   name: z.string().min(2),
   phone: z.string().optional(),
   role: z.enum(["customer", "admin", "delivery"]).default("customer"),
   address: z.string().optional(),
});

export const RestaurantSchema = z.object({
   id: z.number().optional(),
   name: z.string().min(2),
   description: z.string().optional(),
   image: z.string().optional(),
   address: z.string().optional(),
   phone: z.string().optional(),
   is_active: z.boolean().default(true),
});

export const MenuItemSchema = z.object({
   id: z.number().optional(),
   restaurant_id: z.number(),
   name: z.string().min(2),
   description: z.string().optional(),
   price: z.number().positive(),
   image: z.string().optional(),
   category: z.string().optional(),
   is_available: z.boolean().default(true),
});

export const OrderSchema = z.object({
   id: z.number().optional(),
   user_id: z.number(),
   restaurant_id: z.number(),
   total_amount: z.number().positive(),
   status: z
      .enum([
         "pending",
         "confirmed",
         "preparing",
         "out_for_delivery",
         "delivered",
         "cancelled",
      ])
      .default("pending"),
   delivery_address: z.string().min(5),
   delivery_phone: z.string().optional(),
   notes: z.string().optional(),
});

export const OrderItemSchema = z.object({
   id: z.number().optional(),
   order_id: z.number(),
   menu_item_id: z.number(),
   quantity: z.number().positive().default(1),
   price: z.number().positive(),
});

export const LoginSchema = z.object({
   email: z.string().email(),
   password: z.string().min(6),
});

export const RegisterSchema = z.object({
   email: z.string().email(),
   password: z.string().min(6),
   name: z.string().min(2),
   phone: z.string().optional(),
   address: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type Restaurant = z.infer<typeof RestaurantSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
