"use client";
import { saveInvoice } from "@/app/actions";
import FacturaForm from "@/components/factura/FacturaForm";
import { supabase } from "@/utils/supabase/client";

export default function NuevaFactura() {

  const handleSaveFactura = async (facturaData: any) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const user_id = user?.id || "unknown";

      const invoice_to_save = {
        idFactura: facturaData.id,
        fechaEmision: facturaData.fechaEmision,
        fechaVencimiento: facturaData.fechaVencimiento,
        plazoDescuento: parseInt(facturaData.plazoDescuento),
        importeNominal: facturaData.importeNominal,
        moneda: facturaData.moneda,
        tipoTasa: facturaData.tipoTasa,
        tiempoTasa: facturaData.tiempoTasa,
        capitalizacion: facturaData.capitalizacion,
        valorTasa: parseInt(facturaData.valorTasa),
        costosAdicionales: facturaData.costosAdicionales.reduce((acc: number, costo: any) => {
          return acc + parseFloat(costo.monto);
        }, 0),
        costosMora: facturaData.costosMora.reduce((acc: number, costo: any) => {
          return acc + parseFloat(costo.monto);
        }, 0),
        portes: parseInt(facturaData.portes),
        retencion: parseInt(facturaData.retencion),
        tipoTasaMora: facturaData.tipoTasaMora,
        tiempoTasaMora: facturaData.tiempoTasaMora,
        capitalizacionMora: facturaData.capitalizacionMora,
        valorTasaMora: facturaData.valorTasaMora,
        diasMora: parseInt(facturaData.diasMora) || 0,
        conMora: facturaData.conMora,
        tcea: facturaData.tcea,
        user_id: user_id, // Aquí se asegura que el valor esté disponible
      };

      await supabase.from("documents").insert([invoice_to_save]);
    } catch (err) {
      console.error("Error inesperado:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-[#5756BB] mb-6 text-center">Nueva Factura</h1>
      <FacturaForm />
    </div>
  );
}
