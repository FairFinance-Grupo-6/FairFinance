"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useTheme } from "next-themes";
import Link from 'next/link';
import { createClient } from "../../../utils/supabase/client";

// Define un usuario constante

const mockUser = {
  email: "usuario@example.com",
  name: "Usuario Ejemplo",
};



export default function Dashboard() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [user, setUser] = useState<typeof mockUser | null>(null); // Cambia el tipo aquí

  useEffect(() => {
    // Simula la autenticación y establece el usuario
    const checkUser = () => {
      createClient().auth.getUser().then(({ data }) => {
        mockUser.email = data.user?.email || "";
        mockUser.name = data.user?.email?.split("@")[0] || "";

        setUser(mockUser);
      });
      // Aquí simplemente asignamos el usuario constante
    };
    checkUser();
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  if (!user) {
    return <div>Loading...</div>; // Mientras se establece el usuario
  }

  return (
    
    <main
      className={`w-full max-w-3xl mx-auto p-4 space-y-6 ${
        currentTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="p-4">
      <h1 className="text-2xl font-semibold">Bienvenido a tu Dashboard, {user.name}</h1>
      <p>Email: {user.email}</p>
      <span className="text-gray-500 font-normal"> Estas son tus facturas registradas</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Overview</h2>
          <button className="flex items-center justify-between bg-black p-3 pl-4 pr-20 text-white rounded">
            <Clock className="mr-2 h-4 w-4" />
            <Link href="/dashboard/facturas">
              <p className="pl-2 w-36">Ver Todas</p>
            </Link>
          </button>
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
          <Link href="/dashboard/nueva-factura">
            Agregar Factura
          </Link>
        </Button>
        <Button variant="outline" className="w-full border-2 hover:bg-gray-100">
           <Link href="/dashboard/cartera">
             Calcular TCEA de Carteras        
           </Link>
        </Button>
      </div>
    </main>
  );
}




