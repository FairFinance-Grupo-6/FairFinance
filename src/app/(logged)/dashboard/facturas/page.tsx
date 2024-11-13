"use client";

import { SetStateAction, useEffect, useState } from "react";
import mockInvoices from "@/app/data/invoices.json"; 

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

  if (!user) {
    return <div>Loading usuario...</div>;
  }

  return (
    <main className="w-full max-w-3xl mx-auto p-4 space-y-6 bg-white text-black">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-center text-gray-800">Todas tus Facturas</h1>
      </div>

      <div className="flex items-center justify-between mb-4 space-x-2">
        <input
          type="date"
          placeholder="Actualidad"
          value={selectedDate}
          onChange={handleDateChange}
          className="border border-black p-2 rounded-md text-gray-800"
        />
      </div>

      <div className="overflow-x-auto border border-black rounded-md">
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

      <div className="flex items-center justify-center mt-4 space-x-4">
        {Array.from({ length: Math.ceil(filteredInvoices.length / invoicesPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`border border-black px-4 py-2 rounded-md ${
              currentPage === i + 1 ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </main>
  );
}
