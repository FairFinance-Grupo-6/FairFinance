"use client";
import FacturaForm from "@/components/factura/FacturaForm";
import Image from "next/image";
import cat2 from "@/public/cat2.png"; 
import { supabase } from "@/utils/supabase/client";

export default function NuevaFactura() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-[#5756BB] mb-6 text-center">Nueva Factura</h1>
      <FacturaForm />
    </div>
  );
}
