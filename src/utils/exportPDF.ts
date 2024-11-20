import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface Factura {
  id: number;
  fechaEmision: string;
  fechaVencimiento: string;
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

export const exportToPDF = (facturas: Factura[], currentInvoices: Factura[]) => {
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
        "Días Mora",
        "Comisión Tardía",
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
      invoice.mora ? "Sí" : "-",
      invoice.diasDemora || "-",
      invoice.comisionTardia || "-",
      invoice.protesto ? "Sí" : "-",
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
      fillColor: purpleColor,
      textColor: "white",
    },
    margin: { top: 20, left: 20, right: 20 },
  });

  // Calcular el TCEA promedio de las facturas mostradas
  const totalTCEA = currentInvoices.reduce((sum, invoice) => sum + invoice.tcea, 0);
  const promedioTCEA = currentInvoices.length > 0 ? totalTCEA / currentInvoices.length : 0;

  // Mostrar el TCEA Promedio en el PDF
  doc.text(
    `TCEA Promedio: ${promedioTCEA.toFixed(2)}%`,
    20,
    (doc as any).lastAutoTable.finalY + 10
  );

  doc.save("facturas.pdf");
};

const safeToFixed = (value: any, decimals: number = 2) => {
  return typeof value === "number" && !isNaN(value) ? value.toFixed(decimals) : "0.00";
};
