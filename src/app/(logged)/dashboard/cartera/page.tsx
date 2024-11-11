// src/app/invoices/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "../../../../utils/supabase/client";
import { useTheme } from "next-themes";

const mockUser = {
  email: "usuario@example.com",
  name: "Usuario Ejemplo",
};

export default function InvoicesPage() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [user, setUser] = useState<typeof mockUser | null>(null);

  useEffect(() => {
    const checkUser = () => {
      createClient().auth.getUser().then(({ data }) => {
        mockUser.email = data.user?.email || "";
        mockUser.name = data.user?.email?.split("@")[0] || "";
        setUser(mockUser);
      });
    };
    checkUser();
  }, []);

  // Usa el tema del sistema si el tema actual es "system"
  const currentTheme = theme === "system" ? systemTheme : theme;

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <main
      className={`w-full max-w-3xl mx-auto p-4 space-y-6 ${
        currentTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">
          <span>Hola {user.name}</span>
          <span className="text-gray-500 font-normal"> estas son tus facturas registradas</span>
        </h1>

        <div className="flex items-center justify-between">
          <h2 className="text-xl">Overview</h2>
          <div className="flex items-center justify-between bg-black p-3 pl-4 pr-20 text-white rounded">
            <Clock className="mr-2 h-4 w-4" />
            <p className="pl-2 w-36">Ver Todas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-2 p-6 space-y-4">
          <div className="w-8 h-8 bg-black rounded-full" />
          <div>
            <div className="text-sm text-gray-500">Emisión 7/1/2024</div>
            <div className="text-2xl font-semibold">S/ 5,000.00</div>
            <div className="text-sm text-gray-500">Soles</div>
          </div>
        </div>

        <div className="border-2 p-6 space-y-4">
          <div className="w-8 h-8 bg-black rounded-full" />
          <div>
            <div className="text-sm text-gray-500">Emisión 7/15/2024</div>
            <div className="text-2xl font-semibold">$ 8,000.00</div>
            <div className="text-sm text-gray-500">Dólares</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Button className="w-full bg-black text-white hover:bg-gray-800">
          Calcular TCEA
        </Button>
        <Button variant="outline" className="w-full border-2 hover:bg-gray-100">
          Cancel
        </Button>
      </div>
    </main>
  );
}
