"use client";

import { FaTrashAlt } from "react-icons/fa";
import { useFactura } from "@/app/hooks/useFactura";

import { FacturaInfoSection } from "../FacturaForm/FacturaInfoSection";
import { FacturaCostosSection } from "../FacturaForm/FacturaCostosSection";
import { FacturaTasasSection } from "../FacturaForm/FacturaTasasSection";
import { FacturaMoraSection } from "../FacturaForm/FacturaMoraSection";
import { FacturaResultadoSection } from "../FacturaForm/FacturaResultado";
import { saveInvoice } from "@/app/actions";

interface FacturaFormProps {
  onSave: (facturaData: any) => void;
}

export default function FacturaForm() {
  const {
    factura,
    tcea,
    isTceaCalculated,
    handleInputChangeMora,
    handleInputChange,
    handleCalculateTcea,
    addCosto,
    removeCosto,
    addCostoMora,
    removeCostoMora,
  } = useFactura();

  const handleSaveInvoice = () => {
    const factura_to_save = {
      ...factura,
      tcea: tcea
    }
    saveInvoice(factura_to_save);
  }

  return (
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
        isTceaCalculated={isTceaCalculated}
        handleCalculateTcea={handleCalculateTcea}
      />
    </form>
  );
}
