"use client";

import { useState, useEffect } from "react";
import { FacturaTable } from "@/components/factura/FacturaTable";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client";
import { exportToPDF } from "@/utils/exportPDF";

interface Factura {
  id: number;
  fechaEmision: string;
  importeNominal: string;
  moneda: string;
  tipoTasa: string;
  valorTasa: string;
  costosAdicionales: number;
  descuento: number;
  tcea: number;
  receptor: string;
  fechaVencimiento: string;
  plazoDescuento: string;
  tiempoTasa: string;
  capitalizacion: string;
  portes: string;
  mora: boolean;
  diasDemora: number;
  comisionTardia: string;
  protesto: boolean;
}

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;

  useEffect(() => {
    // Obtiene las facturas del usuario desde Supabase
    supabase.auth.getUser().then(({ data }) => {
      supabase
        .from("documents")
        .select("*")
        .eq("user_id", data.user?.id)
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
          } else {
            setFacturas(data || []);
          }
        });
    });
  }, []);

  const filteredFacturas = facturas.filter((factura) => {
    if (selectedDate) {
      const facturaFecha = new Date(factura.fechaEmision);
      const selectedFecha = new Date(selectedDate);
      return facturaFecha <= selectedFecha;
    }
    return true;
  });

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredFacturas.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <main className="w-full max-w-6xl h-full  mx-auto p-4 space-y-6">
      {/* Título */}
      <div className="mb-4">
        <h1 className="text-2xl text-center font-bold text-gray-900 dark:text-gray-100">
          Todas las Facturas
        </h1>
      </div>

      {/* Filtros, botón y gato */}
      <div className="flex sm:flex-row items-center space-x-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start space-y-4 sm:space-y-0 sm:w-full">
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <div className="relative group">
              <div className="w-5 h-5 bg-[#5756BB] text-white flex items-center justify-center rounded-full text-xs font-bold cursor-pointer">
                ?
              </div>
              <div className="absolute top-[-34px] left-32 transform -translate-x-1/2 mt-2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-10 w-48 text-center">
                Selecciona una fecha límite para filtrar facturas.
              </div>
            </div>
          </div>
          <Link href="/dashboard/facturas/nueva">
            <button
              type="button"
              className="bg-[#5756BB] hover:bg-[#8182DA] transition-all duration-300 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Nueva Factura
            </button>
          </Link>
        </div>
        {/* Imagen del gato */}
        <div className="sm:hidden ml-2">
          <Image
            src="/cat3.png"
            alt="Cat"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
      </div>

      {/* Tabla de facturas */}
      <div className="relative sm:min-h-[400px] min-h-[300px]">
        {facturas.length === 0 ? (
          <table className="min-w-full text-sm text-center table-auto transition-all duration-300">
            <thead className="bg-[#5756BB] text-white">
              {/* Encabezados de la tabla */}
            </thead>
            <tbody>
              <tr>
                <td colSpan={10} className="p-4">
                  <div className="px-3 py-1 text-lg font-bold leading-none text-center text-[#5756BB] rounded-full animate-pulse w-60">
                    Cargando facturas...
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="relative">
            <Image
              src="/cat3.png"
              alt="Cat"
              width={100}
              height={100}
              className="absolute top-[-86px] left-1/2 transform -translate-x-1/2 z-10 hidden sm:block"
            />
            <FacturaTable facturas={currentInvoices} />
          </div>
        )}
      </div>

      {/* Paginación y botón de exportar */}
      <div className="flex flex-col align-bottom sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <button
          type="button"
          onClick={() => exportToPDF(facturas, currentInvoices)}
          className="border border-[#5756BB] px-4 py-2 rounded-md text-[#5756BB] bg-white dark:bg-gray-700 dark:text-[#A1A0F0] hover:bg-[#5756BB] hover:text-white dark:hover:bg-[#A1A0F0] dark:hover:text-gray-900 transition-all duration-300 w-full sm:w-auto"
        >
          Exportar PDF
        </button>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => paginate(currentPage - 1)}
            className={`border border-gray-400 px-4 py-2 rounded-full ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                : "bg-white dark:bg-gray-800"
            } text-gray-800 dark:text-gray-200`}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          <button
            type="button"
            onClick={() => paginate(currentPage + 1)}
            className={`border border-gray-400 px-4 py-2 rounded-full ${
              currentPage === Math.ceil(filteredFacturas.length / invoicesPerPage)
                ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                : "bg-white dark:bg-gray-800"
            } text-gray-800 dark:text-gray-200`}
            disabled={
              currentPage === Math.ceil(filteredFacturas.length / invoicesPerPage)
            }
          >
            &gt;
          </button>
        </div>
      </div>
    </main>
  );
}
