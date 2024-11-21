import type React from "react";
import type { Factura } from "@/app/hooks/useFactura";

interface FacturaInfoSectionProps {
  factura: Factura;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export const FacturaInfoSection: React.FC<FacturaInfoSectionProps> = ({
  factura,
  handleInputChange,
}) => (
  <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-md space-y-6">
    <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
      Información General
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Campo ID de Factura */}
      <div>
        <label htmlFor="id" className="block font-medium text-gray-700 dark:text-gray-200">
          ID de Factura:
        </label>
        <input
          id="id"
          type="text"
          name="id"
          value={factura.id}
          onChange={handleInputChange}
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Ingrese el ID de la factura"
          required
        />
      </div>
      {/* Campo Receptor */}
      <div>
        <label htmlFor="receptor" className="block font-medium text-gray-700 dark:text-gray-200">
          Receptor:
        </label>
        <input
          id="receptor"
          type="text"
          name="receptor"
          value={factura.receptor}
          onChange={handleInputChange}
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Ingrese el nombre del receptor"
          required
        />
      </div>
      {/* Campo Moneda */}
      <div>
        <label htmlFor="moneda" className="block font-medium text-gray-700 dark:text-gray-200">
          Moneda:
        </label>
        <select
          id="moneda"
          name="moneda"
          value={factura.moneda}
          onChange={handleInputChange}
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="PEN">Soles (PEN)</option>
          <option value="USD">Dólares (USD)</option>
        </select>
      </div>
      {/* Campo Importe Nominal */}
      <div>
        <label htmlFor="importeNominal" className="block font-medium text-gray-700 dark:text-gray-200">
          Importe Nominal:
        </label>
        <input
          id="importeNominal"
          type="number"
          name="importeNominal"
          value={factura.importeNominal}
          onChange={handleInputChange}
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Ingrese el importe nominal"
          required
        />
      </div>
      {/* Campo Fecha de Emisión */}
      <div>
        <label htmlFor="fechaEmision" className="block font-medium text-gray-700 dark:text-gray-200">
          Fecha de Emisión:
        </label>
        <input
          id="fechaEmision"
          type="date"
          name="fechaEmision"
          value={factura.fechaEmision ?? ""}
          onChange={handleInputChange}
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      {/* Campo Fecha de Vencimiento */}
      <div>
        <label htmlFor="fechaVencimiento" className="block font-medium text-gray-700 dark:text-gray-200">
          Fecha de Vencimiento:
        </label>
        <input
          id="fechaVencimiento"
          type="date"
          name="fechaVencimiento"
          value={factura.fechaVencimiento ?? ""}
          onChange={handleInputChange}
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      {/* Campo Plazo de Descuento */}
      <div>
        <label htmlFor="plazoDescuento" className="block font-medium text-gray-700 dark:text-gray-200">
          Plazo de Descuento (en días):
        </label>
        <p id="plazoDescuento" className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-purple-100 dark:bg-purple-800 text-gray-900 dark:text-gray-100">
          {factura.plazoDescuento !== null
            ? factura.plazoDescuento
            : "N/A"}
        </p>
      </div>
    </div>
  </div>
);
