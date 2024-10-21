"use client";

import { signUpAction } from "@/app/actions";
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { useState } from "react";

export default function Signup({ searchParams }: { searchParams: Message }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
    email: "",
    address: "",
    ruc: "",
    password: "",
    confirmPassword: "",
    currency: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-80 max-w-90 mx-auto">
        <h1 className="text-2xl font-medium">Te damos la bienvenida a FairFinance!</h1>
        <p className="text-sm text text-foreground mb-4">
          Por favor, completa los cuadros con tu información
        </p>

        {/* Diseño de 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="firstName">Nombre</Label>
            <Input
              name="firstName"
              placeholder="Tu nombre"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Apellidos */}
          <div>
            <Label htmlFor="lastName">Apellidos</Label>
            <Input
              name="lastName"
              placeholder="Tus apellidos"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {/* DNI */}
          <div>
            <Label htmlFor="dni">DNI</Label>
            <Input
              name="dni"
              placeholder="Tu DNI"
              value={formData.dni}
              onChange={handleChange}
              required
            />
          </div>

          {/* Celular */}
          <div>
            <Label htmlFor="phone">Celular</Label>
            <Input
              name="phone"
              placeholder="Tu número de celular"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Correo */}
          <div>
            <Label htmlFor="email">Correo</Label>
            <Input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dirección */}
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              name="address"
              placeholder="Tu dirección"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* RUC */}
          <div>
            <Label htmlFor="ruc">RUC</Label>
            <Input
              name="ruc"
              placeholder="Tu RUC"
              value={formData.ruc}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="currency">Moneda Predeterminada</Label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full p-3 bg-white text-black rounded-lg border"
              required
            >
              <option value="">Selecciona una moneda</option>
              <option value="PEN">PEN - Soles</option>
              <option value="USD">USD - Dólares</option>
              <option value="EUR">EUR - Euros</option>
            </select>
          </div>
        </div>

        {/* Contraseña */}
        <Label htmlFor="password" className="mt-4">Contraseña</Label>
        <div className="relative mb-3">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Tu contraseña"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
            className="w-full p-3 bg-white text-black rounded-lg border"
          />
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        {/* Botón de Registro */}
        <SubmitButton formAction={signUpAction} pendingText="Creando cuenta...">
          Crear cuenta
        </SubmitButton>

        {/* Mensajes de validación */}
        <FormMessage message={searchParams} />

        {/* Texto final */}
        <p className="mt-4 text-center text-[#FF5035]">
          ¿Tienes una cuenta?{" "}
          <Link href="/sign-in" className="underline font-medium">
            Accede acá
          </Link>
        </p>

        <p className="mt-2 text-center text-white">
          <input type="checkbox" required /> Reconozco que he leído los{" "}
          <Link href="/terms" className="underline font-medium text-[#FF5035]">
            términos y condiciones
          </Link>{" "}
          de Fair Service y acepto recibir correos electrónicos de la empresa.
        </p>
      </form>
      <SmtpMessage />
    </>
  );
}
