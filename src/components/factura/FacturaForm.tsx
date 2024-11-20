// FacturaForm.tsx

"use client";

import { useFactura } from "@/app/hooks/useFactura";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



import { FacturaInfoSection } from "../FacturaForm/FacturaInfoSection";
import { FacturaCostosSection } from "../FacturaForm/FacturaCostosSection";
import { FacturaTasasSection } from "../FacturaForm/FacturaTasasSection";
import { FacturaMoraSection } from "../FacturaForm/FacturaMoraSection";
import { FacturaResultadoSection } from "../FacturaForm/FacturaResultado";
import { saveInvoice } from "@/app/actions";

export default function FacturaForm() {
  const {
    factura,
    tcea,
    descuento,
    isTceaCalculated,
    handleInputChangeMora,
    handleInputChange,
    handleCalculateTcea,
    addCosto,
    removeCosto,
    addCostoMora,
    removeCostoMora,
  } = useFactura();

  const router = useRouter();

  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const factura_to_save = {
        ...factura,
        tcea: tcea,
        descuento: descuento,
      };
      await saveInvoice(factura_to_save);
      toast.success("Factura guardada correctamente.", {
        position: "top-right",
      });
      // Redirigir después de un breve retraso para mostrar el mensaje
      setTimeout(() => {
        router.push("/dashboard/facturas"); // Ajusta esta ruta a tu página de lista de facturas
      }, 1000);
    } catch (error) {
      console.error("Error al guardar la factura:", error);
      toast.error("Error al guardar la factura.", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSaveInvoice} className="space-y-6">
        <FacturaInfoSection
          factura={factura}
          handleInputChange={handleInputChange}
        />

        <FacturaCostosSection
          factura={factura}
          handleInputChange={handleInputChange}
          addCosto={addCosto}
          removeCosto={removeCosto}
        />

        <FacturaTasasSection
          factura={factura}
          handleInputChange={handleInputChange}
        />

        <FacturaMoraSection
          factura={factura}
          handleInputChange={handleInputChange}
          handleInputChangeMora={handleInputChangeMora}
          addCostoMora={addCostoMora}
          removeCostoMora={removeCostoMora}
        />

        <FacturaResultadoSection
          tcea={tcea}
          descuento={descuento}
          moneda={factura.moneda}
          isTceaCalculated={isTceaCalculated}
          handleCalculateTcea={handleCalculateTcea}
        />
      </form>
    </>
  );
}
