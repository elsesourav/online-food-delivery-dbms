import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "FoodDelivery - Order Food Online",
   description: "Order delicious food from your favorite restaurants",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         >
            <ThemeProvider>
               <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
         </body>
      </html>
   );
}
