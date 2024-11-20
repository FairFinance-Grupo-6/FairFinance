import React from "react";

interface FacturaResultadoSectionProps {
  isTceaCalculated: boolean;
  handleCalculateTcea: () => void;
  descuento: number | null;
  tcea: number | null;
  moneda: string;
}

export const FacturaResultadoSection: React.FC<
  FacturaResultadoSectionProps
> = ({
  tcea,
  descuento,
  moneda,
  isTceaCalculated,
  handleCalculateTcea,
}) => (
  <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-md space-y-6">
    {tcea !== null && (
      <div className="text-center text-2xl font-bold text-purple-600 dark:text-purple-400">
        TCEA Calculado:{" "}
        <span className="text-blue-600 dark:text-blue-400">
          {tcea !== null ? `${tcea.toFixed(7)}%` : ""}
        </span>
      </div>
    )}
    {descuento !== null && (
      <div className="text-center text-xl font-semibold text-gray-700 dark:text-gray-200">
        Descuento:{" "}
        <span className="text-green-600 dark:text-green-400">
          {moneda} {descuento.toFixed(2)}
        </span>
      </div>
    )}
    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
      <button
        type="button"
        onClick={handleCalculateTcea}
        className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-md transition"
      >
        Calcular TCEA
      </button>
      <button
        type="submit"
        disabled={!isTceaCalculated}
        className={`w-full md:w-auto py-3 px-6 rounded-md transition ${
          isTceaCalculated
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Guardar Factura
      </button>
    </div>
  </div>
);
