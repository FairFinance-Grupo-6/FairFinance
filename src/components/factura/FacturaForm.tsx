"use client";

import { FaTrashAlt } from "react-icons/fa";
import { useFactura } from "@/app/hooks/useFactura";

import { FacturaInfoSection } from "../FacturaForm/FacturaInfoSection";
import { FacturaCostosSection } from "../FacturaForm/FacturaCostosSection";
import { FacturaTasasSection } from "../FacturaForm/FacturaTasasSection";
import { FacturaMoraSection } from "../FacturaForm/FacturaMoraSection";
import { FacturaResultadoSection } from "../FacturaForm/FacturaResultado";

interface FacturaFormProps {
  onSave: (facturaData: any) => void;
}

export default function FacturaForm({ onSave }: FacturaFormProps) {
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
    handleSubmit,
  } = useFactura(onSave);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
