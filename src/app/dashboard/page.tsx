"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define un usuario constante
const mockUser = {
  email: "usuario@example.com",
  name: "Usuario Ejemplo",
};

export default function Dashboard() {
  const [user, setUser] = useState<typeof mockUser | null>(null); // Cambia el tipo aquí
  const router = useRouter();

  useEffect(() => {
    // Simula la autenticación y establece el usuario
    const checkUser = () => {
      // Aquí simplemente asignamos el usuario constante
      setUser(mockUser);
    };

    checkUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Mientras se establece el usuario
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Bienvenido a tu Dashboard, {user.name}</h1>
      <p>Email: {user.email}</p>
      {/* Aquí puedes agregar más contenido del Dashboard */}
    </div>
  );
}
