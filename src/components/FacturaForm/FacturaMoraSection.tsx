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
  <div className="bg-white shadow p-6 rounded-md space-y-4">
    <h2 className="text-xl font-semibold">Mora</h2>
    <div>
      <label>
        <input
          type="checkbox"
          name="conMora"
          checked={factura.conMora}
          onChange={handleInputChange}
        />
        ¿Es con mora?
      </label>
    </div>
    {factura.conMora && (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">
              Tipo de Tasa:
            </label>
            <select
              name="tipoTasaMora"
              value={factura.tipoTasaMora}
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
              name="tiempoTasaMora"
              value={factura.tiempoTasaMora}
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
          {factura.tipoTasaMora === "Nominal" && (
            <div>
              <label className="block font-medium text-gray-700">
                Capitalización:
              </label>
              <select
                name="capitalizacionMora"
                value={factura.capitalizacionMora}
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
              name="valorTasaMora"
              value={(factura.valorTasaMora)}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Ingrese el valor de la tasa"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">
              Dias de Mora:
            </label>
            <input
              type="number"
              name="diasMora"
              value={(factura.diasMora)}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Ingrese el valor de la tasa"
              required
            />
          </div>
        </div>

        <h3 className="text-lg font-medium">Costos por Mora</h3>
        {factura.costosMora.map((costo, index) => (
          <div key={costo.id} className="costo-mora">
            <input
              type="text"
              name="descripcion"
              value={costo.descripcion}
              onChange={(e) => handleInputChangeMora(e, index)}
              placeholder="Descripción"
            />
            <input
              type="number"
              name="monto"
              value={(costo.monto)}
              onChange={(e) => handleInputChangeMora(e, index)}
              placeholder="Monto"
            />
            <button type="button" onClick={() => removeCostoMora(index)}>
              <FaTrashAlt />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addCostoMora()}
          className="text-blue-500"
        >
          + Agregar Costo por Mora
        </button>
      </>
    )}
  </div>
);
