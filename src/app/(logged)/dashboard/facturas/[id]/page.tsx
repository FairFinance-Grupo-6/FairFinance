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

  if (!invoice) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Factura #{invoice.id}</h1>
      <p>Fecha de Emisión: {invoice.fechaEmision}</p>
      <p>Fecha de Vencimiento: {invoice.fechaVencimiento}</p>
      <p>
        Importe: {invoice.importeNominal} {invoice.moneda}
      </p>
      <p>Tipo de Tasa: {invoice.tipoTasa}</p>
      <p>TCEA: {invoice.TCEA}%</p>
      <p>Responsable: {invoice.responsable}</p>
    </div>
  );
}
