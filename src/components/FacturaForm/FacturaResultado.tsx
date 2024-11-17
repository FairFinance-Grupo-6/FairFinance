import React from "react";
import { Factura } from "@/app/hooks/useFactura";
import { FaTrashAlt } from "react-icons/fa";

interface FacturaResultadoSectionProps {
  tcea: number | null;
  isTceaCalculated: boolean;
  handleCalculateTcea: () => void;
}

export const FacturaResultadoSection: React.FC<
  FacturaResultadoSectionProps
> = ({ tcea, isTceaCalculated, handleCalculateTcea }) => (
  <div className="space-y-4">
    {tcea !== null && (
      <div className="text-center text-lg font-semibold">
        TCEA Calculado:{" "}
        <span className="text-blue-600">{tcea.toFixed(7)}%</span>
      </div>
    )}
    <button
      type="button"
      onClick={handleCalculateTcea}
      className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition"
    >
      Calcular TCEA
    </button>
    <button
      type="submit"
      disabled={!isTceaCalculated}
      className={`w-full py-3 rounded-md transition ${
        isTceaCalculated
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      Guardar Factura
    </button>
  </div>
);
