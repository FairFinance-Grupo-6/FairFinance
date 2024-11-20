import React from "react";
import { useRouter } from "next/navigation";

interface CostoAdicional {
  id: number;
  descripcion: string;
  monto: string;
  esPorcentaje: boolean;
  pagadoAlInicio: boolean;
}

interface Factura {
  id: number;
  fechaEmision: string;
  fechaVencimiento: string;
  plazoDescuento: string;
  importeNominal: string;
  moneda: string;
  tipoTasa: string;
  tiempoTasa: string;
  capitalizacion: string;
  valorTasa: string;
  costosAdicionales: number;
  portes: string;
  descuento: number;
  tcea: number;
  receptor: string;
}

interface FacturaTableProps {
  facturas: Factura[];
}

export const FacturaTable: React.FC<FacturaTableProps> = ({ facturas }) => {
  const router = useRouter();
  return (
    <div>
      {/* Tabla completa para pantallas medianas y grandes */}
      <div className="hidden sm:block overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full text-sm text-center table-auto transition-all duration-300">
          <thead className="bg-[#5756BB] text-white dark:bg-[#A1A0F0]">
            <tr>
              <th className="p-2 md:p-4 font-medium border-b border-gray-500">
                Id
              </th>
              <th className="p-2 md:p-4 font-medium border-b border-gray-500">
                Fecha Emisión
              </th>
              <th className="p-2 md:p-4 font-medium border-b border-gray-500">
                Importe
              </th>
              <th className="p-2 md:p-4 font-medium border-b border-gray-500">
                Moneda
              </th>
              <th className="p-2 md:p-4 font-medium border-b border-gray-500">
                Costos Adicionales
              </th>
              <th className="p-2 md:p-4 font-medium border-b border-gray-500">
                Tipo Tasa
              </th>
              <th className="p-2 md:p-4 font-medium border-b border-gray-500">
                Valor Tasa (%)
              </th>
              <th className="p-2 md:p-4 font-medium border-b border-gray-500">
                Descuento
              </th>
              <th className="p-2 md:p-4 font-medium border-b border-gray-500">
                TCEA (%)
              </th>
              <th className="p-2 md:p-4 font-medium border-b border-gray-500">
                Receptor
              </th>
            </tr>
          </thead>
          <tbody>
            {facturas.length === 0 && (
              <tr>
                <td colSpan={10} className="p-4">
                  No hay facturas para mostrar
                </td>
              </tr>
            )}
            {facturas.map((invoice, index) => (
              <tr
                key={invoice.id}
                className={`${
                  index % 2 === 0
                    ? "bg-purple-50 dark:bg-neutral-700"
                    : "bg-white dark:bg-neutral-800"
                } border-b border-gray-300 dark:border-neutral-600 hover:bg-purple-100 dark:hover:bg-neutral-600 transition-all duration-300 cursor-pointer`}
                onClick={() => router.push(`/dashboard/facturas/${invoice.id}`)}
                onKeyUp={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    router.push(`/dashboard/facturas/${invoice.id}`);
                  }
                }}
                tabIndex={0}
              >
                <td className="p-2 md:p-4">{invoice.id}</td>
                <td className="p-2 md:p-4">{invoice.fechaEmision}</td>
                <td className="p-2 md:p-4">{invoice.importeNominal}</td>
                <td className="p-2 md:p-4">{invoice.moneda}</td>
                <td className="p-2 md:p-4">{invoice.costosAdicionales}</td>
                <td className="p-2 md:p-4">{invoice.tipoTasa}</td>
                <td className="p-2 md:p-4">{invoice.valorTasa}</td>
                <td className="p-2 md:p-4">{invoice.descuento.toFixed(2)}</td>
                <td className="p-2 md:p-4">{invoice.tcea.toFixed(7)}</td>
                <td className="p-2 md:p-4">{invoice.receptor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla reducida para pantallas pequeñas */}
      <div className="sm:hidden overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full text-sm text-center table-auto transition-all duration-300">
          <thead className="bg-[#5756BB] text-white dark:bg-[#A1A0F0]">
            <tr>
              <th className="p-3 font-medium border-b border-gray-500">Id</th>
              <th className="p-2 font-medium border-b border-gray-500">
                Fecha Emisión
              </th>
              <th className="p-2 font-medium border-b border-gray-500">
                Importe
              </th>
              <th className="p-2 font-medium border-b border-gray-500">
                TCEA (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {facturas.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4">
                  No hay facturas para mostrar
                </td>
              </tr>
            )}
            {facturas.map((invoice, index) => (
              <tr
                key={invoice.id}
                className={`${
                  index % 2 === 0
                    ? "bg-purple-50 dark:bg-neutral-700"
                    : "bg-white dark:bg-neutral-800"
                } border-b border-gray-300 dark:border-neutral-600 hover:bg-purple-100 dark:hover:bg-neutral-600 transition-all duration-300 cursor-pointer`}
                onClick={() => router.push(`/dashboard/facturas/${invoice.id}`)}
                onKeyUp={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    router.push(`/dashboard/facturas/${invoice.id}`);
                  }
                }}
                tabIndex={0}
              >
                <td className="p-3">{invoice.id}</td>
                <td className="p-2">{invoice.fechaEmision}</td>
                <td className="p-2">{invoice.importeNominal}</td>
                <td className="p-2">{invoice.tcea.toFixed(7)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
