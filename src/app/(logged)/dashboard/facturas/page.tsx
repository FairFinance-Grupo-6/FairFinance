"use client";

import { useState, useEffect } from "react";
import { FacturaTable } from "@/components/factura/FacturaTable";
import Link from "next/link";
import mockInvoices from "@/app/data/invoices.json";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
  TCEA: number;
  descuento: number;
  responsable: string;
}

interface FacturaTableProps {
  facturas: Factura[];
}

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 7;

  useEffect(() => {
    setFacturas(mockInvoices);
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

    doc.text("Lista de Facturas - Reporte", 20, 20);
    doc.text(`Fecha: ${formattedDate}`, 20, 30);

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
          "Responsable",
        ],
      ],
      body: filteredFacturas.map((invoice) => [
        invoice.id,
        invoice.fechaEmision,
        invoice.fechaVencimiento,
        invoice.importeNominal,
        invoice.moneda,
        invoice.costosAdicionales
          .map(
            (cost: { descripcion: any; monto: any }) =>
              `${cost.descripcion}: ${safeToFixed(cost.monto)}`,
          )
          .join(", "),
        invoice.tipoTasa,
        invoice.tiempoTasa,
        invoice.capitalizacion,
        invoice.valorTasa,
        invoice.portes,
        safeToFixed(invoice.descuento),
        safeToFixed(invoice.TCEA),
        invoice.responsable,
      ]),
      startY: 35,
      theme: "grid",
      styles: { cellWidth: "auto", fontSize: 6, overflow: "linebreak" },
      margin: { top: 20, left: 20, right: 20 },
    });

    doc.text(`TCEA Promedio: 30%`, 20, (doc as any).lastAutoTable.finalY + 10);
    doc.save("facturas.pdf");
  };

  return (
    <main className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Todas las Facturas</h1>
        <Link href="/dashboard/facturas/nueva">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Nueva Factura
          </button>
        </Link>
      </div>

      <div className="flex items-center justify-end mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        />
      </div>

      {}
      <FacturaTable facturas={currentInvoices} />

      <div className="flex items-center justify-between mt-4 space-x-4">
        <button
          onClick={exportToPDF}
          className="border border-black px-4 py-2 rounded-md text-gray-800 bg-white hover:bg-gray-100"
        >
          Exportar PDF
        </button>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            className={`border border-black px-4 py-2 rounded-full ${currentPage === 1 ? "bg-gray-200" : "bg-white"} text-gray-800`}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <button
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
