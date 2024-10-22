"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaMinusCircle } from "react-icons/fa"; // Asegúrate de tener react-icons instalado

const mockUser = {
  email: "usuario@example.com",
  name: "Usuario Ejemplo",
};

const currencies = [
  { value: "PEN", label: "PEN" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  // Puedes agregar más opciones de moneda aquí
];

const formatCurrency = (value: number) => {
  if (isNaN(value)) return '';
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
};

export default function Dashboard() {
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    discountDays: 0,
    extraCosts: [{ description: "", amount: 0 }],
    transportationCosts: 0,
    totalAmount: 0,
    currency: "PEN",
    nominalRate: 0,
    effectiveRate: 0,
    discountCost: 0,
    tcea: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const checkUser = () => {
      setUser(mockUser);
    };

    checkUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    const { name, value } = e.target;

    if (name.startsWith("extraCost")) {
      const extraCosts = [...invoice.extraCosts];
      if (index !== undefined) {
        if (name.includes("Description")) {
          extraCosts[index].description = value;
        } else {
          extraCosts[index].amount = parseFloat(value);
        }
      } else {
        extraCosts.push({ description: "", amount: parseFloat(value) });
      }
      setInvoice({ ...invoice, extraCosts });
    } else {
      setInvoice(prev => {
        const updatedInvoice = { ...prev, [name]: value };
        // Calcular el costo de descuento automáticamente
        const discountCost = calculateDiscountCost(updatedInvoice);
        return { ...updatedInvoice, discountCost };
      });
    }

    if (name === "issueDate" || name === "dueDate") {
      const issueDate = new Date(name === "issueDate" ? value : invoice.issueDate);
      const dueDate = new Date(name === "dueDate" ? value : invoice.dueDate);
      if (issueDate && dueDate) {
        const differenceInTime = dueDate.getTime() - issueDate.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        setInvoice(prev => ({ ...prev, discountDays: differenceInDays }));
      }
    }
  };

  const addExtraCost = () => {
    setInvoice({ ...invoice, extraCosts: [...invoice.extraCosts, { description: "", amount: 0 }] });
  };

  const removeExtraCost = (index: number) => {
    const extraCosts = [...invoice.extraCosts];
    extraCosts.splice(index, 1);
    setInvoice({ ...invoice, extraCosts });
  };

  const calculateDiscountCost = (invoiceData: typeof invoice) => {
    const TEA = invoiceData.effectiveRate / 100; // Convertir a decimal
    const diasDescuento = invoiceData.discountDays;

    // Cálculo de TE(dias)d
    const TE_dias_d = Math.pow((1 + TEA), (diasDescuento / 360)) - 1;

    // Cálculo de Tasa de Descuento
    const tasaDescuento = TE_dias_d / (1 + TE_dias_d);

    // Cálculo de Costo de Descuento
    return tasaDescuento * invoiceData.totalAmount;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para calcular la TCEA
    const tcea = calculateTCEA(); // Implementa esta función según tu lógica
    setInvoice(prev => ({ ...prev, tcea }));
    console.log("Calculando TCEA...");
  };

  const calculateTCEA = () => {
    const { totalAmount, discountCost, extraCosts, transportationCosts, discountDays } = invoice;
  
    // Calcular Valor Neto
    const valorNeto = totalAmount - discountCost;
  
    // Calcular gastos extras y retenciones
    let totalExtraCosts = 0;
    let retencion = 0;
    let gastosAdministrativos = 0;
  
    extraCosts.forEach((cost) => {
      totalExtraCosts += cost.amount;
      if (cost.description.toLowerCase() === 'retencion') {
        retencion += cost.amount;
      } else if (cost.description.toLowerCase() === 'gastos de admin') {
        gastosAdministrativos += cost.amount;
      }
    });
  
    // Calcular Valor Recibido
    const valorRecibido = valorNeto - totalExtraCosts - retencion;
  
    // Calcular Valor Entregado
    const valorEntregado = valorRecibido + transportationCosts + gastosAdministrativos - retencion;
  
    // Calcular TCEA
    const tcea = valorRecibido > 0 ? (Math.pow((valorEntregado / valorRecibido), (360 / discountDays)) - 1) : 0;
  
    return tcea * 100; // Convertir a porcentaje
  };
  

  const handleUploadInvoice = () => {
    // Lógica para subir la factura
    console.log("Factura subida");
  };
 
  const handleCancel = () => {
    // Lógica para cancelar, por ejemplo, restablecer el formulario
    setInvoice({
      invoiceNumber: "",
      issueDate: "",
      dueDate: "",
      discountDays: 0,
      extraCosts: [{ description: "", amount: 0 }],
      transportationCosts: 0,
      totalAmount: 0,
      currency: "PEN",
      nominalRate: 0,
      effectiveRate: 0,
      discountCost: 0,
      tcea: 0,
    });
  };


  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Agregar Nueva Factura</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Número de FACTURA:</label>
            <input
              type="text"
              name="invoiceNumber"
              value={invoice.invoiceNumber}
              onChange={handleInputChange}
              className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
              placeholder="Ingrese número de factura"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Fecha de emisión:</label>
            <input
              type="date"
              name="issueDate"
              value={invoice.issueDate}
              onChange={handleInputChange}
              className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Fecha de vencimiento:</label>
            <input
              type="date"
              name="dueDate"
              value={invoice.dueDate}
              onChange={handleInputChange}
              className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Días de descuento:</label>
            <input
              type="number"
              name="discountDays"
              value={invoice.discountDays}
              readOnly
              className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg bg-gray-200 dark:bg-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">Importe Inicial:</label>
          <input
            type="number"
            name="totalAmount"
            value={invoice.totalAmount}
            onChange={handleInputChange}
            className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
            required
          />
        </div>

        <h3 className="text-xl font-semibold mt-6 text-gray-800 dark:text-white">Gastos Extras:</h3>
        {invoice.extraCosts.map((cost, index) => (
          <div key={index} className="flex gap-4 mb-4">
            <input
              type="text"
              name={`extraCostDescription-${index}`}
              placeholder="Descripción"
              value={cost.description}
              onChange={(e) => handleInputChange(e, index)}
              className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
              required
            />
            <input
              type="number"
              name={`extraCostAmount-${index}`}
              placeholder="Monto"
              value={cost.amount}
              onChange={(e) => handleInputChange(e, index)}
              className="border border-gray-300 dark:border-gray-600 p-2 w-1/4 rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => removeExtraCost(index)}
              className="text-red-500 hover:text-red-600"
            >
              <FaMinusCircle size={24} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addExtraCost}
          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
        >
          + Agregar Gasto Extra
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Portes:</label>
            <input
              type="number"
              name="transportationCosts"
              value={invoice.transportationCosts}
              onChange={handleInputChange}
              className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Moneda:</label>
            <select
              name="currency"
              value={invoice.currency}
              onChange={handleInputChange}
              className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
            >
              {currencies.map(currency => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Tasa Nominal (%):</label>
            <input
              type="number"
              name="nominalRate"
              value={invoice.nominalRate}
              onChange={handleInputChange}
              className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Tasa Efectiva (%):</label>
            <input
              type="number"
              name="effectiveRate"
              value={invoice.effectiveRate}
              onChange={handleInputChange}
              className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">Descuento:</label>
          <input
            type="text"
            name="discountCost"
            value={formatCurrency(invoice.discountCost)}
            readOnly
            className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg bg-gray-200 dark:bg-gray-600"
          />
        </div>

        <div className="w-1/2">
            <label className="block text-gray-700 dark:text-gray-300">TCEA:</label>
            <input
              type="number"
              name="tcea"
              value={invoice.tcea}
              readOnly
              className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg bg-gray-200 dark:bg-gray-600"
            />
          </div>
          <div className="w-1/2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Calcular TCEA
            </button>
          </div>
      </form>

      <div className="absolute top-6 right-6 space-x-2">
        <button onClick={handleUploadInvoice} className="bg-blue-500 text-white px-4 py-2 rounded">
          Subir Factura
        </button>
        <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded">
          Cancelar
        </button>
      </div>

    </div>
  );
}
