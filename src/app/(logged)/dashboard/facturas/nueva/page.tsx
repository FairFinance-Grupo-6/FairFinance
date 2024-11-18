"use client";

import FacturaForm from "@/components/factura/FacturaForm";
import { supabase } from "@/utils/supabase/client";

export default function NuevaFactura() {
  const handleSaveFactura = async (facturaData: any) => {
    try {
      await supabase.from("facturas").insert([facturaData]);
    } catch (err) {
      console.error("Error inesperado:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-[#5756BB] mb-6 text-center">Nueva Factura</h1>
      <FacturaForm onSave={handleSaveFactura} />
    </div>
  );
}
