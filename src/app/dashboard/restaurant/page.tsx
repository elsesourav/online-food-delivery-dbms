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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Order {
   id: number;
   customer_name: string;
   customer_phone: string;
   total_amount: number;
   status: string;
   delivery_address: string;
   delivery_phone: string;
   notes: string;
   created_at: string;
}

interface MenuItem {
   id: number;
   name: string;
   description: string;
   price: number;
   category: string;
   is_available: boolean;
}

export default function RestaurantDashboard() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [orders, setOrders] = useState<Order[]>([]);
   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState<"orders" | "menu">("orders");
   const [showAddMenu, setShowAddMenu] = useState(false);
   const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
   const [newMenuItem, setNewMenuItem] = useState({
      name: "",
      description: "",
      price: "",
      category: "",
   });

   // Check authentication and role
   useEffect(() => {
      if (status === "loading") return;

      if (!session || session.user.role !== "restaurant_manager") {
         router.push("/auth/restaurant/signin");
         return;
      }

      fetchOrders();
      fetchMenuItems();
   }, [session, status, router]);

   const fetchOrders = async () => {
      try {
         const response = await fetch("/api/orders");
         if (response.ok) {
            const data = await response.json();
            setOrders(data.orders);
         }
      } catch (error) {
         console.error("Failed to fetch orders:", error);
      } finally {
         setLoading(false);
      }
   };

   const fetchMenuItems = async () => {
      try {
         const response = await fetch("/api/menu-items");
         if (response.ok) {
            const data = await response.json();
            setMenuItems(data.menuItems);
         }
      } catch (error) {
         console.error("Failed to fetch menu items:", error);
      }
   };

   const handleAddMenuItem = async () => {
      if (!newMenuItem.name || !newMenuItem.price || !newMenuItem.category) {
         alert("Please fill in all required fields");
         return;
      }

      try {
         const response = await fetch("/api/menu-items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               name: newMenuItem.name,
               description: newMenuItem.description,
               price: Number(newMenuItem.price),
               category: newMenuItem.category,
            }),
         });

         if (response.ok) {
            fetchMenuItems();
            setNewMenuItem({
               name: "",
               description: "",
               price: "",
               category: "",
            });
            setShowAddMenu(false);
            alert("Menu item added successfully!");
         } else {
            alert("Failed to add menu item");
         }
      } catch (error) {
         console.error("Failed to add menu item:", error);
         alert("Failed to add menu item");
      }
   };

   const handleDeleteMenuItem = async (id: number) => {
      if (!confirm("Are you sure you want to delete this menu item?")) return;

      try {
         const response = await fetch(`/api/menu-items?id=${id}`, {
            method: "DELETE",
         });

         if (response.ok) {
            fetchMenuItems();
            alert("Menu item deleted successfully!");
         } else {
            alert("Failed to delete menu item");
         }
      } catch (error) {
         console.error("Failed to delete menu item:", error);
         alert("Failed to delete menu item");
      }
   };

   const handleEditMenuItem = (item: MenuItem) => {
      setEditingItem(item);
      setNewMenuItem({
         name: item.name,
         description: item.description,
         price: item.price.toString(),
         category: item.category,
      });
      setShowAddMenu(true);
   };

   const handleUpdateMenuItem = async () => {
      if (
         !editingItem ||
         !newMenuItem.name ||
         !newMenuItem.price ||
         !newMenuItem.category
      ) {
         alert("Please fill in all required fields");
         return;
      }

      try {
         const response = await fetch("/api/menu-items", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               id: editingItem.id,
               name: newMenuItem.name,
               description: newMenuItem.description,
               price: Number(newMenuItem.price),
               category: newMenuItem.category,
               is_available: editingItem.is_available,
            }),
         });

         if (response.ok) {
            fetchMenuItems();
            setNewMenuItem({
               name: "",
               description: "",
               price: "",
               category: "",
            });
            setEditingItem(null);
            setShowAddMenu(false);
            alert("Menu item updated successfully!");
         } else {
            alert("Failed to update menu item");
         }
      } catch (error) {
         console.error("Failed to update menu item:", error);
         alert("Failed to update menu item");
      }
   };

   const handleCancelEdit = () => {
      setEditingItem(null);
      setNewMenuItem({ name: "", description: "", price: "", category: "" });
      setShowAddMenu(false);
   };

   const toggleItemAvailability = async (item: MenuItem) => {
      try {
         const response = await fetch("/api/menu-items", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               id: item.id,
               name: item.name,
               description: item.description,
               price: item.price,
               category: item.category,
               is_available: !item.is_available,
            }),
         });

         if (response.ok) {
            fetchMenuItems();
            alert(
               `Menu item ${
                  !item.is_available ? "enabled" : "disabled"
               } successfully!`
            );
         } else {
            alert("Failed to update item availability");
         }
      } catch (error) {
         console.error("Failed to update item availability:", error);
         alert("Failed to update item availability");
      }
   };

   const updateOrderStatus = async (orderId: number, newStatus: string) => {
      try {
         const response = await fetch(`/api/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
         });

         if (response.ok) {
            fetchOrders(); // Refresh orders
         } else {
            alert("Failed to update order status");
         }
      } catch (error) {
         console.error("Failed to update order:", error);
         alert("Failed to update order status");
      }
   };

   const getStatusColor = (status: string) => {
      const colors: Record<string, string> = {
         pending: "bg-yellow-500",
         confirmed: "bg-blue-500",
         preparing: "bg-purple-500",
         ready_for_pickup: "bg-green-500",
         out_for_delivery: "bg-orange-500",
         delivered: "bg-gray-500",
         cancelled: "bg-red-500",
      };
      return colors[status] || "bg-gray-500";
   };

   const getNextStatus = (currentStatus: string) => {
      const statusFlow: Record<string, string> = {
         pending: "confirmed",
         confirmed: "preparing",
         preparing: "ready_for_pickup",
      };
      return statusFlow[currentStatus];
   };

   if (status === "loading" || loading) {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-lg">Loading...</div>
         </div>
      );
   }

   if (!session || session.user.role !== "restaurant_manager") {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-lg">Unauthorized access</div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
         {/* Header */}
         <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center h-16">
                  <div className="flex items-center">
                     <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        Restaurant Dashboard
                     </h1>
                  </div>
                  <div className="flex items-center space-x-4">
                     <span className="text-sm text-gray-600 dark:text-gray-300">
                        Welcome, {session.user.name}
                     </span>
                     <ThemeToggle />
                     <Button
                        variant="outline"
                        onClick={() => signOut({ callbackUrl: "/" })}
                     >
                        Sign Out
                     </Button>
                  </div>
               </div>
            </div>
         </nav>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Tab Navigation */}
            <div className="mb-8">
               <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                     <button
                        onClick={() => setActiveTab("orders")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                           activeTab === "orders"
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                     >
                        Orders
                     </button>
                     <button
                        onClick={() => setActiveTab("menu")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                           activeTab === "menu"
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                     >
                        Menu Management
                     </button>
                  </nav>
               </div>
            </div>

            {/* Orders Tab */}
            {activeTab === "orders" && (
               <>
                  <div className="mb-8">
                     <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Orders
                     </h2>
                     <p className="mt-2 text-gray-600">
                        Manage your restaurant orders and update their status
                     </p>
                  </div>

                  {orders.length === 0 ? (
                     <Card>
                        <CardContent className="text-center py-8">
                           <p className="text-gray-500">No orders found</p>
                        </CardContent>
                     </Card>
                  ) : (
                     <div className="grid grid-cols-1 gap-6">
                        {orders.map((order) => (
                           <Card key={order.id}>
                              <CardHeader>
                                 <div className="flex justify-between items-start">
                                    <div>
                                       <CardTitle>Order #{order.id}</CardTitle>
                                       <CardDescription>
                                          {new Date(
                                             order.created_at
                                          ).toLocaleDateString()}{" "}
                                          at{" "}
                                          {new Date(
                                             order.created_at
                                          ).toLocaleTimeString()}
                                       </CardDescription>
                                    </div>
                                    <Badge
                                       className={getStatusColor(order.status)}
                                    >
                                       {order.status
                                          .replace("_", " ")
                                          .toUpperCase()}
                                    </Badge>
                                 </div>
                              </CardHeader>
                              <CardContent>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                       <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                          Customer Details
                                       </h4>
                                       <p className="text-sm text-gray-600">
                                          Name: {order.customer_name}
                                       </p>
                                       <p className="text-sm text-gray-600">
                                          Phone: {order.customer_phone}
                                       </p>
                                    </div>
                                    <div>
                                       <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                          Delivery Details
                                       </h4>
                                       <p className="text-sm text-gray-600">
                                          Address: {order.delivery_address}
                                       </p>
                                       <p className="text-sm text-gray-600">
                                          Phone: {order.delivery_phone}
                                       </p>
                                    </div>
                                 </div>
                                 {order.notes && (
                                    <div className="mt-4">
                                       <h4 className="font-medium text-gray-900">
                                          Notes
                                       </h4>
                                       <p className="text-sm text-gray-600">
                                          {order.notes}
                                       </p>
                                    </div>
                                 )}
                                 <div className="mt-4 flex justify-between items-center">
                                    <div className="text-lg font-bold">
                                       Total: ₹
                                       {Number(order.total_amount).toFixed(2)}
                                    </div>
                                    <div className="space-x-2">
                                       {getNextStatus(order.status) && (
                                          <Button
                                             onClick={() =>
                                                updateOrderStatus(
                                                   order.id,
                                                   getNextStatus(order.status)
                                                )
                                             }
                                          >
                                             Mark as{" "}
                                             {getNextStatus(
                                                order.status
                                             ).replace("_", " ")}
                                          </Button>
                                       )}
                                       {order.status === "pending" && (
                                          <Button
                                             variant="destructive"
                                             onClick={() =>
                                                updateOrderStatus(
                                                   order.id,
                                                   "cancelled"
                                                )
                                             }
                                          >
                                             Cancel
                                          </Button>
                                       )}
                                    </div>
                                 </div>
                              </CardContent>
                           </Card>
                        ))}
                     </div>
                  )}
               </>
            )}

            {/* Menu Management Tab */}
            {activeTab === "menu" && (
               <>
                  <div className="mb-8 flex justify-between items-center">
                     <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                           Menu Management
                        </h2>
                        <p className="mt-2 text-gray-600">
                           Add, edit, and manage your restaurant&apos;s menu
                           items
                        </p>
                     </div>
                     <Button onClick={() => setShowAddMenu(true)}>
                        Add New Item
                     </Button>
                  </div>

                  {/* Add Menu Item Form */}
                  {showAddMenu && (
                     <Card className="mb-8">
                        <CardHeader>
                           <CardTitle>
                              {editingItem
                                 ? "Edit Menu Item"
                                 : "Add New Menu Item"}
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Item Name *
                                 </label>
                                 <Input
                                    type="text"
                                    placeholder="Enter item name"
                                    value={newMenuItem.name}
                                    onChange={(e) =>
                                       setNewMenuItem({
                                          ...newMenuItem,
                                          name: e.target.value,
                                       })
                                    }
                                 />
                              </div>
                              <div>
                                 <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                 </label>
                                 <Input
                                    type="text"
                                    placeholder="e.g., Pizza, Burger, Dessert"
                                    value={newMenuItem.category}
                                    onChange={(e) =>
                                       setNewMenuItem({
                                          ...newMenuItem,
                                          category: e.target.value,
                                       })
                                    }
                                 />
                              </div>
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                 Description
                              </label>
                              <Textarea
                                 placeholder="Enter item description"
                                 value={newMenuItem.description}
                                 onChange={(e) =>
                                    setNewMenuItem({
                                       ...newMenuItem,
                                       description: e.target.value,
                                    })
                                 }
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                 Price (₹) *
                              </label>
                              <Input
                                 type="number"
                                 placeholder="Enter price in rupees"
                                 value={newMenuItem.price}
                                 onChange={(e) =>
                                    setNewMenuItem({
                                       ...newMenuItem,
                                       price: e.target.value,
                                    })
                                 }
                              />
                           </div>
                           <div className="flex space-x-4">
                              <Button
                                 onClick={
                                    editingItem
                                       ? handleUpdateMenuItem
                                       : handleAddMenuItem
                                 }
                              >
                                 {editingItem ? "Update Item" : "Add Item"}
                              </Button>
                              <Button
                                 variant="outline"
                                 onClick={handleCancelEdit}
                              >
                                 Cancel
                              </Button>
                           </div>
                        </CardContent>
                     </Card>
                  )}

                  {/* Menu Items List */}
                  {menuItems.length === 0 ? (
                     <Card>
                        <CardContent className="text-center py-8">
                           <p className="text-gray-500">No menu items found</p>
                        </CardContent>
                     </Card>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menuItems.map((item) => (
                           <Card key={item.id}>
                              <CardHeader>
                                 <div className="flex justify-between items-start">
                                    <div>
                                       <CardTitle className="text-lg">
                                          {item.name}
                                       </CardTitle>
                                       <CardDescription>
                                          {item.category}
                                       </CardDescription>
                                    </div>
                                    <Badge
                                       variant={
                                          item.is_available
                                             ? "default"
                                             : "secondary"
                                       }
                                    >
                                       {item.is_available
                                          ? "Available"
                                          : "Unavailable"}
                                    </Badge>
                                 </div>
                              </CardHeader>
                              <CardContent>
                                 <p className="text-sm text-gray-600 mb-4">
                                    {item.description}
                                 </p>
                                 <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-green-600">
                                       ₹{Number(item.price).toFixed(2)}
                                    </span>
                                    <div className="flex space-x-2">
                                       <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() =>
                                             handleDeleteMenuItem(item.id)
                                          }
                                       >
                                          Delete
                                       </Button>
                                       <Button
                                          size="sm"
                                          onClick={() =>
                                             handleEditMenuItem(item)
                                          }
                                       >
                                          Edit
                                       </Button>
                                       <Button
                                          size="sm"
                                          onClick={() =>
                                             toggleItemAvailability(item)
                                          }
                                       >
                                          {item.is_available
                                             ? "Disable"
                                             : "Enable"}
                                       </Button>
                                    </div>
                                 </div>
                              </CardContent>
                           </Card>
                        ))}
                     </div>
                  )}
               </>
            )}
         </div>
      </div>
   );
}
