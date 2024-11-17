import React from "react";
import { calcularSumaCostos } from "@/utils/calculations";
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
  costosAdicionales: CostoAdicional[];
  portes: string;
}

interface FacturaTableProps {
  facturas: Factura[];
}

export const FacturaTable: React.FC<FacturaTableProps> = ({ facturas }) => {
  const router = useRouter();
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-center">
        <thead>
          <tr className="bg-black text-white">
            <th className="p-4 font-medium border-b border-gray-500">Id</th>
            <th className="p-4 font-medium border-b border-gray-500">
              Fecha Emisión
            </th>
            <th className="p-4 font-medium border-b border-gray-500">
              Fecha Vencimiento
            </th>
            <th className="p-4 font-medium border-b border-gray-500">
              Importe
            </th>
            <th className="p-4 font-medium border-b border-gray-500">Moneda</th>
            <th className="p-4 font-medium border-b border-gray-500">
              Costos Adicionales
            </th>
            <th className="p-4 font-medium border-b border-gray-500">
              Tipo Tasa
            </th>
            <th className="p-4 font-medium border-b border-gray-500">
              Tiempo Tasa
            </th>
            <th className="p-4 font-medium border-b border-gray-500">
              Capitalización
            </th>
            <th className="p-4 font-medium border-b border-gray-500">
              Valor Tasa
            </th>
            <th className="p-4 font-medium border-b border-gray-500">Portes</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((invoice) => (
            <tr
              key={invoice.id}
              className={`${
                invoice.id % 2 === 0 ? "bg-gray-100" : "bg-white"
              } border-b border-gray-500`}
              onClick={() => router.push(`/dashboard/facturas/${invoice.id}`)}
            >
              <td className="p-4">{invoice.id}</td>
              <td className="p-4">{invoice.fechaEmision}</td>
              <td className="p-4">{invoice.fechaVencimiento}</td>
              <td className="p-4">{invoice.importeNominal}</td>
              <td className="p-4">{invoice.moneda}</td>
              <td className="p-4">
                {calcularSumaCostos(
                  invoice.costosAdicionales.map((c) => ({
                    descripcion: c.descripcion,
                    monto: Number(c.monto),
                  })),
                )}
              </td>
              <td className="p-4">{invoice.tipoTasa}</td>
              <td className="p-4">{invoice.tiempoTasa}</td>
              <td className="p-4">{invoice.capitalizacion}</td>
              <td className="p-4">{invoice.valorTasa}</td>
              <td className="p-4">{invoice.portes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/*
           <td className="p-4">{invoice.descuento.toFixed(2)}</td>
           <td className="p-4">{invoice.TCEA.toFixed(2)}</td>
           <td className="p-4">{invoice.responsable}</td>
           <td className="p-4">{invoice.mora ? "Sí" : "No"}</td>
           <td className="p-4">{invoice.dias_demora ? invoice.dias_demora : "-"}</td>
           <td className="p-4">{invoice.comision_tardia ? invoice.comision_tardia.toFixed(2) : "-"}</td>
           <td className="p-4">{invoice.protesto ? "Sí" : "No"}</td> */
