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
  <div className="bg-white shadow p-6 rounded-md space-y-4">
    <h2 className="text-xl font-semibold">Información de Tasas</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block font-medium text-gray-700">Tipo de Tasa:</label>
        <select
          name="tipoTasa"
          value={factura.tipoTasa}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded-md"
        >
          <option value="Efectiva">Efectiva</option>
          <option value="Nominal">Nominal</option>
        </select>
      </div>
      <div>
        <label className="block font-medium text-gray-700">
          Tiempo de Tasa:
        </label>
        <select
          name="tiempoTasa"
          value={factura.tiempoTasa}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded-md"
        >
          {tiempoTasaOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {factura.tipoTasa === "Nominal" && (
        <div>
          <label className="block font-medium text-gray-700">
            Capitalización:
          </label>
          <select
            name="capitalizacion"
            value={factura.capitalizacion}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-md"
          >
            {tiempoTasaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="block font-medium text-gray-700">
          Valor de Tasa (%):
        </label>
        <input
          type="number"
          name="valorTasa"
          value={(factura.valorTasa)}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded-md"
          placeholder="Ingrese el valor de la tasa"
          required
        />
      </div>
    </div>
  </div>
);
