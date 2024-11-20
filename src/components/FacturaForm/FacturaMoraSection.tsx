import React from "react";
import { Factura } from "@/app/hooks/useFactura";
import { FaTrashAlt } from "react-icons/fa";

interface FacturaMoraSectionProps {
  factura: Factura;
  handleInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleInputChangeMora: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
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
  handleInputChangeMora,
  addCostoMora,
  removeCostoMora,
}) => (
  <div className="bg-white dark:bg-gray-800 shadow p-6 rounded-md space-y-6">
    <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
      Información Moratoria
    </h2>
    <div>
      <label className="flex items-center text-gray-700 dark:text-gray-200">
        <input
          type="checkbox"
          name="conMora"
          checked={factura.conMora}
          onChange={handleInputChange}
          className="mr-2"
        />
        ¿Es con mora?
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

        <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400">
          Costos por Mora
        </h3>
        {factura.costosMora.map((costo, index) => (
          <div
            key={costo.id}
            className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0"
          >
            <input
              type="text"
              name="descripcion"
              value={costo.descripcion}
              onChange={(e) => handleInputChangeMora(e, index)}
              placeholder="Descripción"
              className="w-full md:w-1/2 border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <input
              type="number"
              name="monto"
              value={costo.monto}
              onChange={(e) => handleInputChangeMora(e, index)}
              placeholder="Monto"
              className="w-full md:w-1/4 border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button
              type="button"
              onClick={() => removeCostoMora(index)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addCostoMora()}
          className="text-purple-600 hover:text-purple-800 font-medium"
        >
          + Agregar Costo por Mora
        </button>
      </>
    )}
  </div>
);
