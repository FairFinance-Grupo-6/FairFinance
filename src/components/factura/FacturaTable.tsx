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
	costosAdicionales: number;
	portes: string;
	descuento: number;
	tcea: number;
	responsable: string;
}

interface FacturaTableProps {
	facturas: Factura[];
}

export const FacturaTable: React.FC<FacturaTableProps> = ({ facturas }) => {
	const router = useRouter();
	return (
		<div className="overflow-x-auto shadow-lg rounded-lg">
			<table className="min-w-full text-sm text-center table-auto transition-all duration-300">
				<thead className="bg-[#5756BB] text-white">
					<tr>
						<th className="p-4 font-medium border-b border-gray-500">Id</th>
						<th className="p-4 font-medium border-b border-gray-500">
							Fecha Emision
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
							Valor Tasa(%)
						</th>
						<th className="p-4 font-medium border-b border-gray-500">
							Descuento
						</th>
						<th className="p-4 font-medium border-b border-gray-500">
							TCEA(%)
						</th>
						<th className="p-4 font-medium border-b border-gray-500">
							Responsable
						</th>
					</tr>
				</thead>
				<tbody>
					{facturas.map((invoice) => (
						<tr
							key={invoice.id}
							className={`${
								invoice.id % 2 === 0 ? "bg-purple-50" : "bg-white"
							} border-b border-gray-300 hover:bg-purple-100 transition-all duration-300 cursor-pointer`}
							onClick={() => router.push(`/dashboard/facturas/${invoice.id}`)}
							onKeyUp={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									router.push(`/dashboard/facturas/${invoice.id}`);
								}
							}}
							tabIndex={0}
						>
							<td className="p-4">{invoice.id}</td>
							<td className="p-4">{invoice.fechaEmision}</td>
							<td className="p-4">{invoice.importeNominal}</td>
							<td className="p-4">{invoice.moneda}</td>
							<td className="p-4">{invoice.costosAdicionales}</td>
							<td className="p-4">{invoice.tipoTasa}</td>
							<td className="p-4">{invoice.valorTasa}</td>
							<td className="p-4">{invoice.descuento.toFixed(2)}</td>
							<td className="p-4">{invoice.tcea.toFixed(7)}</td>
							<td className="p-4">{invoice.responsable}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
