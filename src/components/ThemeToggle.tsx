"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
   const { theme, toggleTheme } = useTheme();

   return (
      <Button
         variant="outline"
         size="sm"
         onClick={toggleTheme}
         className="relative"
      >
         {theme === "light" ? (
            <Moon className="h-4 w-4" />
         ) : (
            <Sun className="h-4 w-4" />
         )}
         <span className="sr-only">Toggle theme</span>
      </Button>
   );
}
