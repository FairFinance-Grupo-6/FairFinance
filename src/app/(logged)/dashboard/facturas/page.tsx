"use client";

import { useState, useEffect } from "react";
import { FacturaTable } from "@/components/factura/FacturaTable";
import Link from "next/link";
import Image from "next/image";
import cat3 from "@/public/cat2.png";
import mockInvoices from "@/app/data/invoices.json";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/utils/supabase/client";

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
	tcea: number;
	descuento: number;
	mora: boolean;
	diasDemora: number;
	comisionTardia: string;
	protesto: boolean;
	receptor: string;
}

interface FacturaTableProps {
	facturas: Factura[];
}

export default function FacturasPage() {
	const [facturas, setFacturas] = useState<Factura[]>([]);
	const [selectedDate, setSelectedDate] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const invoicesPerPage = 7;
	const [showTooltip, setShowTooltip] = useState(false);

	useEffect(() => {
		// Ordena las facturas por fecha de emisión de la más antigua a la más reciente
		supabase.auth.getUser().then(({ data }) => {
			supabase
				.from("documents")
				.select("*")
				.eq("user_id", data.user?.id)
				.then(({ data, error }) => {
					if (error) {
						console.error(error);
					} else {
						console.log(data);
						setFacturas(data);
					}
				});
		});
		/* 		const sortedFacturas = [...mockInvoices].sort((a, b) => {
			const dateA = new Date(a.fechaEmision);
			const dateB = new Date(b.fechaEmision);
			return dateA.getTime() - dateB.getTime(); // Ordenar de la más antigua a la más reciente
		});
		setFacturas(sortedFacturas); */
	}, []);

	const filteredFacturas = facturas.filter((factura) => {
		if (selectedDate) {
			const facturaFecha = new Date(factura.fechaEmision);
			const selectedFecha = new Date(selectedDate);
			return facturaFecha <= selectedFecha; // Verifica si la fecha es menor o igual a la seleccionada
		}
		return true;
	});

	const indexOfLastInvoice = currentPage * invoicesPerPage;
	const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
	const currentInvoices = filteredFacturas.slice(
		indexOfFirstInvoice,
		indexOfLastInvoice,
	);

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	const safeToFixed = (value: any, decimals: number = 2) => {
		return typeof value === "number" && !isNaN(value)
			? value.toFixed(decimals)
			: "0.00";
	};

	const exportToPDF = () => {
		const doc = new jsPDF("landscape");
		const formattedDate = new Date().toLocaleDateString();

		doc.text("Lista de Facturas", 20, 20);
		doc.text(`Fecha: ${formattedDate}`, 20, 30);

		// Color Morado
		const purpleColor = "#5756BB"; // Color morado

		autoTable(doc, {
			head: [
				[
					"Nombre",
					"Fecha Emisión",
					"Fecha Vencimiento",
					"Importe",
					"Moneda",
					"Costos Adicionales",
					"Tipo Tasa",
					"Tiempo Tasa",
					"Capitalización",
					"Valor Tasa",
					"Portes",
					"Descuento",
					"TCEA",
					"Mora",
					"Dias Mora",
					"Comision Tardia",
					"Protesto",
					"Receptor",
				],
			],
			body: facturas.map((invoice) => [
				invoice.id,
				invoice.fechaEmision,
				invoice.fechaVencimiento,
				invoice.importeNominal,
				invoice.moneda,
				invoice.costosAdicionales,
				invoice.tipoTasa,
				invoice.tiempoTasa,
				invoice.capitalizacion,
				invoice.valorTasa,
				invoice.portes,
				safeToFixed(invoice.descuento),
				safeToFixed(invoice.tcea),
				invoice.mora ? "Sí" : "-", // Si mora es falso, muestra "-"
				invoice.diasDemora || "-", // Si no tiene días de demora, muestra "-"
				invoice.comisionTardia || "-", // Si no tiene comisión tardía, muestra "-"
				invoice.protesto ? "Sí" : "-", // Si protesto es verdadero, muestra "Sí", si no "-"
				invoice.receptor,
			]),
			startY: 35,
			theme: "grid",
			styles: {
				cellWidth: "auto",
				fontSize: 6,
				overflow: "linebreak",
			},
			headStyles: {
				fillColor: purpleColor, // Encabezado morado
				textColor: "white",
			},
			margin: { top: 20, left: 20, right: 20 },
		});

		// Calcular el TCEA promedio de las facturas mostradas
		const totalTCEA = currentInvoices.reduce(
			(sum, invoice) => sum + invoice.tcea,
			0,
		);
		const promedioTCEA =
			currentInvoices.length > 0 ? totalTCEA / currentInvoices.length : 0;

		// Mostrar el TCEA Promedio en el PDF
		doc.text(
			`TCEA Promedio: ${promedioTCEA.toFixed(2)}%`,
			20,
			(doc as any).lastAutoTable.finalY + 10,
		);

		doc.save("facturas.pdf");
	};

	return (
		<main className="w-full max-w-6xl mx-auto p-4 space-y-6">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold text-black">Todas las Facturas</h1>
			</div>

			<div className="flex justify-between items-center mb-4 relative">
				<div className="flex flex-col">
					<div className="relative flex items-center">
						<input
							type="date"
							value={selectedDate}
							onChange={(e) => setSelectedDate(e.target.value)}
							className="border border-gray-300 p-2 rounded-md"
						/>
						<div className="ml-2 relative group">
							<div className="w-5 h-5 bg-[#5756BB] text-white flex items-center justify-center rounded-full text-xs font-bold cursor-pointer">
								?
							</div>
							<div className="absolute top-[-40px] left-[-30px] bg-gray-800 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
								Selecciona una fecha límite para filtrar facturas.
							</div>
						</div>
					</div>
				</div>
				<Link href="/dashboard/facturas/nueva">
					<button
						type="button"
						className="bg-[#5756BB] hover:bg-[#8182DA] hover:scale-105 transition-all duration-300 text-white px-4 py-2 rounded"
					>
						Nueva Factura
					</button>
				</Link>
			</div>

			<div className="relative">
				<Image
					src="/cat3.png"
					alt="Cats"
					width={100}
					height={100}
					className="absolute top-[-86px] left-1/2 transform -translate-x-1/2 z-10"
				/>
				<FacturaTable facturas={currentInvoices} />
			</div>

			<div className="flex items-center justify-between mt-4 space-x-4">
				<button
					type="button"
					onClick={exportToPDF}
					className="border border-[#5756BB] px-4 py-2 rounded-md text-[#5756BB] bg-white hover:bg-[#5756BB] hover:text-white transition-all duration-300"
				>
					Exportar PDF
				</button>

				<div className="flex items-center space-x-4">
					<button
						type="button"
						onClick={() => paginate(currentPage - 1)}
						className={`border border-black px-4 py-2 rounded-full ${currentPage === 1 ? "bg-gray-200" : "bg-white"} text-gray-800`}
						disabled={currentPage === 1}
					>
						&lt;
					</button>

					<button
						type="button"
						onClick={() => paginate(currentPage + 1)}
						className={`border border-black px-4 py-2 rounded-full ${currentPage === Math.ceil(filteredFacturas.length / invoicesPerPage) ? "bg-gray-200" : "bg-white"} text-gray-800`}
						disabled={
							currentPage ===
							Math.ceil(filteredFacturas.length / invoicesPerPage)
						}
					>
						&gt;
					</button>
				</div>
			</div>
		</main>
	);
}
