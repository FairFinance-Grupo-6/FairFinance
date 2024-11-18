"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import mockInvoices from "@/app/data/invoices.json";

export default function FacturaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      const invoiceId = Number(id);
      const mockInvoice = mockInvoices.find(
        (invoice) => invoice.id === invoiceId,
      );

      if (mockInvoice) {
        setInvoice(mockInvoice);
      } else {
        console.error("Invoice not found");
      }
    };

    fetchInvoice();
  }, [id, router]);

  if (!invoice) return <div className="text-center mt-10 text-lg">Cargando...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-[#5756BB] mb-6 text-center">
        Factura #{invoice.id}
      </h1>

      <div className="bg-[#F8F8FF] shadow-md rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div>
            <p className="font-semibold text-[#5756BB]">Fecha de Emisión:</p>
            <p>{invoice.fechaEmision}</p>
          </div>
          <div>
            <p className="font-semibold text-[#5756BB]">Fecha de Vencimiento:</p>
            <p>{invoice.fechaVencimiento}</p>
          </div>
          <div>
            <p className="font-semibold text-[#5756BB]">Importe:</p>
            <p>
              {invoice.importeNominal} {invoice.moneda}
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#5756BB]">Moneda:</p>
            <p>{invoice.moneda}</p>
          </div>
          <div>
            <p className="font-semibold text-[#5756BB]">Tipo de Tasa:</p>
            <p>{invoice.tipoTasa}</p>
          </div>
          <div>
            <p className="font-semibold text-[#5756BB]">Tiempo Tasa:</p>
            <p>{invoice.tiempoTasa}</p>
          </div>
          <div>
            <p className="font-semibold text-[#5756BB]">Capitalización:</p>
            <p>{invoice.capitalizacion}</p>
          </div>
          <div>
            <p className="font-semibold text-[#5756BB]">Valor Tasa:</p>
            <p>{invoice.valorTasa}%</p>
          </div>
          <div>
            <p className="font-semibold text-[#5756BB]">Portes:</p>
            <p>{invoice.portes}</p>
          </div>
          <div>
            <p className="font-semibold text-[#5756BB]">Descuento:</p>
            <p>{invoice.descuento}</p>
          </div>
          <div>
            <p className="font-semibold text-[#5756BB]">TCEA:</p>
            <p>{invoice.TCEA}%</p>
          </div>
          <div>
            <p className="font-semibold text-[#5756BB]">Responsable:</p>
            <p>{invoice.responsable}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.back()}
        className="mt-6 bg-[#5756BB] text-white px-6 py-3 rounded-md shadow-md hover:bg-[#8182DA] hover:scale-105 transition-all"
      >
        Volver
      </button>
    </div>
  );
}

