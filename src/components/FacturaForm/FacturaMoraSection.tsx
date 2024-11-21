import React from "react";
import { Factura } from "@/app/hooks/useFactura";
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";

interface FacturaMoraSectionProps {
  factura: Factura;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    section?: "costosAdicionales" | "costosMora"
  ) => void;
  removeCostoMora: (index: number) => void;
  addCostoMora: () => void;
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

export const FacturaMoraSection: React.FC<FacturaMoraSectionProps> = ({
  factura,
  handleInputChange,
  addCostoMora,
  removeCostoMora,
}) => (
  <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-md space-y-6">
    <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
      Información Moratoria
    </h2>
    <div className="flex items-center justify-between w-full md:w-1/2">
      <span className="text-gray-700 dark:text-gray-200 font-medium">
        ¿Es con mora?
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="conMora"
          checked={factura.conMora}
          onChange={(e) => handleInputChange(e)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-600 dark:peer-focus:ring-purple-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-purple-600 dark:peer-checked:bg-purple-500 transition-all"></div>
        <div className="absolute left-1 top-1/2 w-4 h-4 bg-white rounded-full shadow-md transform -translate-y-1/2 peer-checked:translate-x-full transition-transform"></div>
      </label>
    </div>
    {factura.conMora && (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de Tasa de Mora */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Tipo de Tasa:
            </label>
            <select
              name="tipoTasaMora"
              value={factura.tipoTasaMora}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="Efectiva">Efectiva</option>
              <option value="Nominal">Nominal</option>
            </select>
          </div>
          {/* Tiempo de Tasa de Mora */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Tiempo de Tasa:
            </label>
            <select
              name="tiempoTasaMora"
              value={factura.tiempoTasaMora}
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
          {/* Capitalización de Mora (si es Nominal) */}
          {factura.tipoTasaMora === "Nominal" && (
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-200">
                Capitalización:
              </label>
              <select
                name="capitalizacionMora"
                value={factura.capitalizacionMora}
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
          {/* Valor de Tasa de Mora */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Valor de Tasa (%):
            </label>
            <input
              type="number"
              name="valorTasaMora"
              value={factura.valorTasaMora}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Ingrese el valor de la tasa"
              required
            />
          </div>
          {/* Días de Mora */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Días de Mora:
            </label>
            <input
              type="number"
              name="diasMora"
              value={factura.diasMora}
              onChange={handleInputChange}
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Ingrese los días de mora"
              required
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
          Costos por Mora
        </h3>
        {factura.costosMora.length > 0 ? (
          <div className="space-y-4">
            {factura.costosMora.map((costo, index) => (
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
                    placeholder="Ingrese la descripción del costo"
                    className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"

                    value={costo.descripcion}
                    onChange={(e) => handleInputChange(e, index, "costosMora")}
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
                      value={costo.monto}
                      className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"

                      onChange={(e) => handleInputChange(e, index, "costosMora")}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {factura.moneda}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => removeCostoMora(index)}
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
            No hay costos por mora.
          </p>
        )}

        <button
          type="button"
          onClick={addCostoMora}
          className="mt-4 flex items-center text-purple-600 hover:text-purple-800 font-medium transition"
        >
          <FaPlusCircle className="mr-2" />
          Agregar Costo por Mora
        </button>
      </>
    )}
  </div>
);
