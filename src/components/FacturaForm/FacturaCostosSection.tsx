import React from "react";
import { Factura } from "@/app/hooks/useFactura";
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";

interface FacturaCostosSectionProps {
  factura: Factura;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    section?: "costosAdicionales" | "costosMora"
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
  <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-md space-y-6">
    <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
      Costos
    </h2>

    {/* Campo Portes */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          Portes:
        </label>
        <div className="relative">
          <input
            type="number"
            name="portes"
            value={factura.portes}
            onChange={handleInputChange}
            className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Ingrese el valor de los portes"
            required
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            {factura.moneda}
          </span>
        </div>
      </div>

      {/* Campo Retención */}
      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
          Porcentaje de Retención (%):
        </label>
        <input
          type="number"
          name="retencion"
          value={factura.retencion}
          onChange={handleInputChange}
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Ingrese el porcentaje de retención"
          required
        />
      </div>
    </div>

    {/* Costos Adicionales */}
    <div>
      <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
        Costos Adicionales
      </h3>
      {factura.costosAdicionales.length > 0 ? (
        <div className="space-y-4">
          {factura.costosAdicionales.map((costo, index) => (
            <div
              key={costo.id}
              className="flex flex-col md:flex-row md:items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-md space-y-4 md:space-y-0 md:space-x-4"
            >
              <div className="flex-1">
                <label className="block text-gray-700 dark:text-gray-200 mb-1">
                  Descripción:
                </label>
                <input
                  type="text"
                  name="descripcion"
                  className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="Ingrese la descripción del costo"
                  value={costo.descripcion}
                  onChange={(e) => handleInputChange(e, index, "costosAdicionales")}
                />


              </div>
              <div className="flex-1">
                <label className="block text-gray-700 dark:text-gray-200 mb-1">
                  Monto:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="monto"
                    className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                     
                    value={costo.monto}
                    onChange={(e) => handleInputChange(e, index, "costosAdicionales")}
                  />
                  {!costo.esPorcentaje && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {factura.moneda}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* Toggle Switch para esPorcentaje */}
                <div className="flex items-center">
                  <label className="mr-2 text-gray-700 dark:text-gray-200">
                    %
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name={`esPorcentaje${index}`}
                      checked={costo.esPorcentaje}
                      onChange={(e) => handleInputChange(e, index, "costosAdicionales")}
                    
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-600 dark:peer-focus:ring-purple-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500 transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform"></div>
                  </label>
                </div>

                {/* Toggle Switch para pagadoAlInicio */}
                <div className="flex items-center">
                  <label className="mr-2 text-gray-700 dark:text-gray-200">
                    Cobrado al inicio
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name={`pagadoAlInicio${index}`}
                      checked={costo.pagadoAlInicio}
                      onChange={(e) => handleInputChange(e, index, "costosAdicionales")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-600 dark:peer-focus:ring-purple-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500 transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform"></div>
                  </label>
                </div>


                <button
                  type="button"
                  onClick={() => removeCosto(index)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Eliminar costo"
                >
                  <FaTrashAlt size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          No hay costos adicionales.
        </p>
      )}

      <button
        type="button"
        onClick={addCosto}
        className="mt-4 flex items-center text-purple-600 hover:text-purple-800 font-medium transition"
      >
        <FaPlusCircle className="mr-2" />
        Agregar Costo
      </button>
    </div>
  </div>
);
