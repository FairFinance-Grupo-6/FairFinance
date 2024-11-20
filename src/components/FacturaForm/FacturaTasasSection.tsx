import React from "react";
import { Factura } from "@/app/hooks/useFactura";

interface FacturaTasasSectionProps {
  factura: Factura;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const tiempoTasaOptions = [
  "Anual",
  "Semestral",
  "Cuatrimestral",
  "Trimestral",
  "Bimestral",
  "Mensual",
  "Quincenal",
  "Diario",
];

export const FacturaTasasSection: React.FC<FacturaTasasSectionProps> = ({
  factura,
  handleInputChange,
}) => (
  <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-md space-y-6">
    <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
      Información de Tasas
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tipo de Tasa */}
      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-200">
          Tipo de Tasa:
        </label>
        <select
          name="tipoTasa"
          value={factura.tipoTasa}
          onChange={handleInputChange}
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="Efectiva">Efectiva</option>
          <option value="Nominal">Nominal</option>
        </select>
      </div>
      {/* Tiempo de Tasa */}
      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-200">
          Tiempo de Tasa:
        </label>
        <select
          name="tiempoTasa"
          value={factura.tiempoTasa}
          onChange={handleInputChange}
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {tiempoTasaOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {/* Capitalización (si es Nominal) */}
      {factura.tipoTasa === "Nominal" && (
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-200">
            Capitalización:
          </label>
          <select
            name="capitalizacion"
            value={factura.capitalizacion}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {tiempoTasaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* Valor de Tasa */}
      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-200">
          Valor de Tasa (%):
        </label>
        <input
          type="number"
          name="valorTasa"
          value={factura.valorTasa}
          onChange={handleInputChange}
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Ingrese el valor de la tasa"
          required
        />
      </div>
    </div>
  </div>
);
