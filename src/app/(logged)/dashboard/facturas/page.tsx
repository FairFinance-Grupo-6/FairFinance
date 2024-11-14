"use client"

import { SetStateAction, useEffect, useState } from "react";
import mockInvoices from "@/app/data/invoices.json"; 
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const mockUser = {
  email: "usuario@example.com",
  name: "Usuario Ejemplo",
};

export default function AllInvoicesPage() {
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const [invoices, setInvoices] = useState<any[]>(mockInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>(mockInvoices);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 7;

  useEffect(() => {
    const checkUser = () => {
      setUser(mockUser);
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtered = invoices.filter((invoice) =>
        new Date(invoice.fecha_vencimiento) <= new Date(selectedDate)
      );
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  }, [selectedDate, invoices]);

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const handleDateChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1); // Reset to first page when date changes
  };

  const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

  // Calcular la TCEA promedio de las facturas actuales
  const calculateAverageTCEA = () => {
    const totalTCEA = currentInvoices.reduce((sum, invoice) => sum + invoice.TCEA, 0);
    return (totalTCEA / currentInvoices.length).toFixed(2);
  };

  const averageTCEA = calculateAverageTCEA();

  // Función para exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Facturas - Reporte", 20, 20);
    autoTable(doc, {
      head: [
        ["Nombre", "Fecha Emisión", "Fecha Vencimiento", "Importe", "Moneda", "TCEA", "Responsable"]
      ],
      body: filteredInvoices.map(invoice => [
        invoice.nombre,
        invoice.fecha_emision,
        invoice.fecha_vencimiento,
        invoice.importe.toFixed(2),
        invoice.moneda,
        invoice.TCEA,
        invoice.responsable
      ])
    });
    doc.text(`TCEA Promedio: ${averageTCEA}%`, 20, (doc as any).autoTable.previous.finalY + 10);  // Agregar TCEA promedio al final
    doc.save("facturas.pdf");
  };

  if (!user) {
    return <div>Loading usuario...</div>;
  }

  return (
    <main className="w-full max-w-3xl mx-auto p-4 space-y-6 bg-white text-black">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-center text-gray-800">Todas las Facturas</h1>
      </div>

      <div className="flex items-center justify-between mb-4 space-x-2">
        <input
          type="date"
          placeholder="Actualidad"
          value={selectedDate}
          onChange={handleDateChange}
          className="border border-black p-2 rounded-md text-gray-800 ml-auto"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-center">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-4 font-medium border-b border-gray-500">Nombre</th>
              <th className="p-4 font-medium border-b border-gray-500">Fecha Emisión</th>
              <th className="p-4 font-medium border-b border-gray-500">Fecha Vencimiento</th>
              <th className="p-4 font-medium border-b border-gray-500">Importe</th>
              <th className="p-4 font-medium border-b border-gray-500">Moneda</th>
              <th className="p-4 font-medium border-b border-gray-500">TCEA</th>
              <th className="p-4 font-medium border-b border-gray-500">Responsable</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.map((invoice, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} border-b border-gray-500`}
              >
                <td className="p-4">{invoice.nombre}</td>
                <td className="p-4">{invoice.fecha_emision}</td>
                <td className="p-4">{invoice.fecha_vencimiento}</td>
                <td className="p-4">{invoice.importe.toFixed(2)}</td>
                <td className="p-4">{invoice.moneda}</td>
                <td className="p-4">{invoice.TCEA}%</td>
                <td className="p-4">{invoice.responsable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 space-x-4">
        <div className="flex items-center">
          <button onClick={exportToPDF} className="border border-black px-4 py-2 rounded-md text-gray-800 bg-white hover:bg-gray-100">
            Exportar PDF
          </button>
        </div>

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
            className={`border border-black px-4 py-2 rounded-full ${currentPage === Math.ceil(filteredInvoices.length / invoicesPerPage) ? "bg-gray-200" : "bg-white"} text-gray-800`}
            disabled={currentPage === Math.ceil(filteredInvoices.length / invoicesPerPage)}
          >
            &gt;
          </button>
        </div>
      </div>
    </main>
  );
}
