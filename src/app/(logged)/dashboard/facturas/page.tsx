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

export default function AllInvoicesPage() {
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
          <span>Hola LOL</span>
        </h1>
      </div>
    </main>
  );
}