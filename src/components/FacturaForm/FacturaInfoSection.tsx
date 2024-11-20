import React from 'react';
import { Factura } from '@/app/hooks/useFactura';

interface FacturaInfoSectionProps {
  factura: Factura;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const FacturaInfoSection: React.FC<FacturaInfoSectionProps> = ({ factura, handleInputChange }) => (
  <div className="bg-white shadow p-6 rounded-md space-y-4">
    <h2 className="text-xl font-semibold">Información General</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block font-medium text-gray-700">
          ID de Factura:
        </label>
        <input
          type="text"
          name="id"
          value={factura.id}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded-md"
          placeholder="Ingrese el ID de la factura"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700">Moneda:</label>
        <select
          name="moneda"
          value={factura.moneda}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded-md"
        >
          <option value="PEN">Soles (PEN)</option>
          <option value="USD">Dólares (USD)</option>
        </select>
      </div>
      <div>
        <label className="block font-medium text-gray-700">
          Importe Nominal:
        </label>
        <input
          type="number"
          name="importeNominal"
          value={factura.importeNominal}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded-md"
          placeholder="Ingrese el importe nominal"
          required
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700">
          Fecha de Emisión:
        </label>
        <input
          type="date"
          name="fechaEmision"
          value={factura.fechaEmision ?? ""}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700">
          Fecha de Vencimiento:
        </label>
        <input
          type="date"
          name="fechaVencimiento"
          value={factura.fechaVencimiento ?? ""}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700">
          Plazo de Descuento (en días):
        </label>
        <p className="w-full border border-gray-300 p-2 rounded-md bg-pink-100">
          {factura.plazoDescuento !== null ? factura.plazoDescuento : "N/A"}
        </p>
      </div>
    </div>
  </div>
);
