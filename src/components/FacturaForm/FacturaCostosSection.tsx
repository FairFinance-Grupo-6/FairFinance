import React from "react";
import { Factura } from "@/app/hooks/useFactura";
import { FaTrashAlt } from "react-icons/fa";

interface FacturaCostosSectionProps {
  factura: Factura;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
  ) => void;
  addCosto: () => void;
  removeCosto: (index: number) => void;
}

export const FacturaCostosSection: React.FC<FacturaCostosSectionProps> = ({
  factura,
  handleInputChange,
  addCosto,
  removeCosto,
}) => (
  <div className="bg-white shadow p-6 rounded-md space-y-4">
    <h2 className="text-xl font-semibold">Costos </h2>
    <div>
      <label className="block font-medium text-gray-700">Portes:</label>
      <input
        type="number"
        name="portes"
        value={(factura.portes)}
        onChange={handleInputChange}
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="Ingrese el valor de los portes"
        required
      />
    </div>
    <div>
      <label className="block font-medium text-gray-700">
        Porcentaje de Retención (%):
      </label>
      <input
        type="number"
        name="retencion"
        value={(factura.retencion)}
        onChange={handleInputChange}
        className="w-full border border-gray-300 p-2 rounded-md"
        placeholder="Ingrese el porcentaje de retención"
        required
      />
    </div>
    <label className="block font-medium text-gray-700">
      Costos Adicionales:
    </label>

    {factura.costosAdicionales.map((costo, index) => (
      <div key={costo.id} className="flex items-center space-x-4">
        <input
          type="text"
          name={`costoDescripcion${index}`}
          value={costo.descripcion}
          onChange={(e) => handleInputChange(e, index)}
          className="w-1/4 border border-gray-300 p-2 rounded-md"
          placeholder="Descripción"
        />
        <input
          type="number"
          name={`costoMonto${index}`}
          value={(costo.monto)}
          onChange={(e) => handleInputChange(e, index)}
          className="w-1/4 border border-gray-300 p-2 rounded-md"
          placeholder="Monto"
        />
        <input
          type="checkbox"
          name={`costoPorcentaje${index}`}
          checked={costo.esPorcentaje}
          onChange={(e) => handleInputChange(e, index)}
          className="rounded-md"
        />
        <span> %</span>
        <input
          type="checkbox"
          name={`costoPagadoAlInicio${index}`}
          checked={costo.pagadoAlInicio}
          onChange={(e) => handleInputChange(e, index)}
          className="rounded-md"
        />
        <span> Cobrado al inicio</span>
        <button
          type="button"
          onClick={() => removeCosto(index)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrashAlt />
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={addCosto}
      className="text-blue-500 hover:text-blue-700"
    >
      + Agregar Costo
    </button>
  </div>
);
