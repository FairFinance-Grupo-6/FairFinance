import { createClient } from "../../../../utils/supabase/server";
import Image from "next/image";
import cat5 from "@/public/cat5.png";

export default async function ProfilePage() {
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();
  if (!user) {
    return null;
  }

  const { data: profile, error: profileError } = await (await createClient())
    .from("profiles")
    .select()
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error(profileError);
    return null;
  }

  if (profile.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Parece que no tienes un perfil</h1>
        <p className="text-gray-700">
          Para poder acceder a esta página, necesitas tener un perfil.
        </p>
        <p className="text-gray-700">
          Por favor, contacta con el soporte técnico para más información.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
      <div className="w-full md:w-2/3">
        <h1 className="text-4xl font-bold text-purple-600 mb-6">Perfil</h1>
        <div className="bg-purple-100 shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Información del Usuario
          </h2>
          <p className="text-gray-700 mb-2">
            <span className="font-bold">Email:</span> {user.email}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Nombre Completo:</span>{" "}
            {profile.first_name} {profile.last_name}
          </p>
        </div>
        <div className="bg-purple-100 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Detalles de la Cuenta
          </h2>
          <p className="text-gray-700 mb-2">
            <span className="font-bold">DNI:</span> {profile.dni}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-bold">Teléfono:</span> {profile.phone}
          </p>
          <p className="text-gray-700">
            <span className="font-bold">Registrado:</span>{" "}
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/3">
        <img
          src="/cat5.png"
          alt="cat5"
        />
      </div>
    </div>
  );
}
