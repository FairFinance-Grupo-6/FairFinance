"use client";

import { useEffect, useState } from "react";
import { FaMinusCircle } from "react-icons/fa"; // Asegúrate de tener react-icons instalado
import { createClient } from "@/utils/supabase/client";

const mockUser = {
  email: "usuario@example.com",
  name: "Usuario Ejemplo",
};

const tiempoTasaOptions = [
  "Anual", "Semestral", "Cuatrimestral", "Trimestral", "Bimestral", "Mensual", "Quincenal", "Diario"
];


interface Invoice {
  id: bigint;
  idFactura: string;
  typeDocument: string;
  issueDate: Date;
  dueDate: Date;
  initialAmount: number;
  currency: string;
  totalOfAdditionalCosts: number;
  rateType: string;
  timeOfRate: string;
  capitalization: string;
  valueOfTheFee: number;
  totalFreight: number;
  idUser: number;
}


// Función para formatear el número solo con comas para los miles
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-PE', {
    maximumFractionDigits: 0, // Sin decimales
    useGrouping: true // Usa separadores de miles
  }).format(num);
};

// Función para parsear el string formateado de vuelta a número
const parseFormattedNumber = (str: string): number => {
  return Number(str.replace(/[^0-9-]+/g, ""));
};

export default function Dashboard() {
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    discountDays: 0,
    extraCosts: [{ id: Date.now(), description: "", amount: 0 }],
    transportationCosts: 0,
    totalAmount: 0,
    currency: "soles",
    tipoTasa: "efectiva",
    tiempoTasa: "ANUAL",
    capitalizacion: "ANUAL",
    tasa: 0,
    discountCost: 0,
    tcea: 0,
  });

  const client = createClient();

  const [formattedTotalAmount, setFormattedTotalAmount] = useState("");
  const [formattedTasa, setFormattedTasa] = useState("");
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

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
          extraCosts[index].amount = Number.parseFloat(value);
        }
      } else {
        extraCosts.push({ id: Date.now(), description: "", amount: Number.parseFloat(value) });
      }
      setInvoice({ ...invoice, extraCosts });
    } else {
      setInvoice(prev => {
        const updatedInvoice = { ...prev, [name]: value };
        return { ...updatedInvoice };
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
    setInvoice({ ...invoice, extraCosts: [...invoice.extraCosts, { id: Date.now(), description: "", amount: 0 }] });
  };

  const removeExtraCost = (index: number) => {
    const extraCosts = [...invoice.extraCosts];
    extraCosts.splice(index, 1);
    setInvoice({ ...invoice, extraCosts });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tcea = calculateTCEA();
    setInvoice(prev => ({ ...prev, tcea }));
    console.log("Calculando TCEA...");
  };

  const calculateTCEA = () => {
    const { totalAmount, discountCost, extraCosts, transportationCosts, discountDays } = invoice;

    const valorNeto = totalAmount - discountCost;

    let totalExtraCosts = 0;
    let retencion = 0;
    let gastosAdministrativos = 0;

    for (const cost of extraCosts) {
      totalExtraCosts += cost.amount;
      if (cost.description.toLowerCase() === 'retencion') {
        retencion += cost.amount;
      } else if (cost.description.toLowerCase() === 'gastos de admin') {
        gastosAdministrativos += cost.amount;
      }
    }

    const valorRecibido = valorNeto - totalExtraCosts - retencion;

    const valorEntregado = valorRecibido + transportationCosts + gastosAdministrativos - retencion;

    const tcea = valorRecibido > 0 ? ((valorEntregado / valorRecibido) ** (360 / discountDays) - 1) : 0;

    return tcea * 100;
  };


  const handleUploadInvoice = async () => {
    const { data: userData, error: userError } = await client.auth.getUser();

    if (userError) {
      console.error("error in getting user id", userError);
      return;
    }

    const invoiceCall = {
      id_invoice: invoice.invoiceNumber,
      type_document: "Factura",
      issue_date: new Date(invoice.issueDate).toISOString().split('T')[0],
      due_date: new Date(invoice.dueDate).toISOString().split('T')[0],
      initial_amount: invoice.totalAmount,
      currency: invoice.currency,
      total_of_aditional_costs: invoice.extraCosts.reduce((acc, cost) => acc + cost.amount, 0),
      rate_type: invoice.tipoTasa,
      time_of_rate: invoice.tiempoTasa,
      capitalization: invoice.capitalizacion,
      value_of_the_fee: invoice.tasa,
      total_freight: Number.parseFloat(invoice.transportationCosts.toString()),
      user_id: userData.user?.id,
    };

    console.log("Factura", invoiceCall);

    const { data: invoiceData, error: invoiceError } = await client.from("documents").upsert([
      invoiceCall
    ]).select();

    if (invoiceError) {
      console.error("error in invoice call", invoiceError);
      return;
    }
    console.log(invoiceData);
    console.log("Factura subida exitosamente");
  };


  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseFormattedNumber(value);

    if (!Number.isNaN(numericValue)) {
      setInvoice(prev => ({ ...prev, totalAmount: numericValue }));
      setFormattedTotalAmount(formatNumber(numericValue));
    }
  };

  const handleTasaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace('%', ''); // Elimina el símbolo % si existe
    const numericValue = Number.parseFloat(value);

    if (!Number.isNaN(numericValue) || value === '') {
      setInvoice(prev => ({ ...prev, tasa: value === '' ? 0 : numericValue }));
      setFormattedTasa(value === '' ? '' : `${value}%`);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <div className="w-3/4 pr-8">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 space-y-6">
            <div>
              <label htmlFor="invoiceNumber" className="block text-gray-700 dark:text-gray-300 mb-2">1. ID de factura:</label>
              <input
                type="text"
                id="invoiceNumber"
                name="invoiceNumber"
                value={invoice.invoiceNumber}
                onChange={handleInputChange}
                className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
                placeholder="Ingrese id de factura"
                required
              />
            </div>
            <div>
              <label htmlFor="issueDate" className="block text-gray-700 dark:text-gray-300 mb-2">2. Seleccione la fecha de emisión:</label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                value={invoice.issueDate}
                onChange={handleInputChange}
                className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-gray-700 dark:text-gray-300 mb-2">3. Seleccione la fecha de vencimiento:</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={invoice.dueDate}
                onChange={handleInputChange}
                className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="totalAmount" className="block text-gray-700 dark:text-gray-300 mb-2">4. Valor del importe inicial:</label>
              <input
                type="text"
                name="totalAmount"
                value={formattedTotalAmount}
                onChange={handleTotalAmountChange}
                className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
                placeholder="Ingrese el valor del importe inicial"
                required
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <label htmlFor="currency" className="block text-gray-700 dark:text-gray-300 mb-2">5. Seleccione la moneda:</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="currency"
                    value="PEN"
                    checked={invoice.currency === "PEN"}
                    onChange={handleInputChange}
                    className="form-radio text-blue-600 dark:text-blue-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Soles (PEN)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="currency"
                    value="USD"
                    checked={invoice.currency === "USD"}
                    onChange={handleInputChange}
                    className="form-radio text-blue-600 dark:text-blue-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Dólares (USD)</span>
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="extraCosts" className="block text-gray-700 dark:text-gray-300 mb-2">6. Costos adicionales:</label>
              {invoice.extraCosts.map((cost, index) => (
                <div key={cost.id} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    name={`extraCostDescription${index}`}
                    value={cost.description}
                    onChange={e => handleInputChange(e, index)}
                    placeholder="Descripción"
                    className="border border-gray-300 dark:border-gray-600 p-2 w-1/2 rounded-lg"
                  />
                  <input
                    type="number"
                    name={`extraCostAmount${index}`}
                    value={cost.amount}
                    onChange={e => handleInputChange(e, index)}
                    placeholder="Monto"
                    className="border border-gray-300 dark:border-gray-600 p-2 w-1/2 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExtraCost(index)}
                    className="text-red-500 dark:text-red-400"
                  >
                    <FaMinusCircle size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addExtraCost}
                className="text-blue-600 dark:text-blue-400 mt-2"
              >
                + Agregar costo adicional
              </button>
            </div>
            <div>
              <label htmlFor="tipoTasa" className="block text-gray-700 dark:text-gray-300 mb-2">7. Selecciones tipo de tasa:</label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="tipoTasa"
                    value="efectiva"
                    checked={invoice.tipoTasa === "efectiva"}
                    onChange={handleInputChange}
                    className="form-radio text-blue-600 dark:text-blue-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Efectiva</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="tipoTasa"
                    value="nominal"
                    checked={invoice.tipoTasa === "nominal"}
                    onChange={handleInputChange}
                    className="form-radio text-blue-600 dark:text-blue-400"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Nominal</span>
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="tiempoTasa" className="block text-gray-700 dark:text-gray-300 mb-2">8. Seleccione el tiempo de la tasa:</label>
              <select
                id="tiempoTasa"
                name="tiempoTasa"
                value={invoice.tiempoTasa}
                onChange={handleInputChange}
                className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
              >
                {tiempoTasaOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full md:w-1/3 space-y-6">
            <div>
              <label htmlFor="capitalizacion" className="block text-gray-700 dark:text-gray-300 mb-2">9. Seleccione la capitalización:</label>
              <select
                id="capitalizacion"
                name="capitalizacion"
                value={invoice.capitalizacion}
                onChange={handleInputChange}
                className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
              >
                {tiempoTasaOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tasa" className="block text-gray-700 dark:text-gray-300 mb-2">10. Ingrese el valor de la tasa:</label>
              <div className="relative">
                <input
                  type="text"
                  name="tasa"
                  value={formattedTasa}
                  onChange={handleTasaChange}
                  className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg pr-8"
                  placeholder="Ingrese la tasa"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="transportationCosts" className="block text-gray-700 dark:text-gray-300 mb-2">11. Ingrese los portes:</label>
              <input
                type="number"
                id="transportationCosts"
                name="transportationCosts"
                value={invoice.transportationCosts}
                onChange={handleInputChange}
                className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded-lg"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 w-full rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500"
              >
                Calcular TCEA
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="w-1/3 space-y-6">
        <div className="mb-6">
          <label htmlFor="showAdditionalInfoYes" className="block text-gray-700 dark:text-gray-300 mb-2">¿Tiene Mora?</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="showAdditionalInfo"
                value="yes"
                checked={showAdditionalInfo}
                onChange={() => setShowAdditionalInfo(true)}
                className="form-radio text-blue-600 dark:text-blue-400"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Sí</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="showAdditionalInfo"
                value="no"
                checked={!showAdditionalInfo}
                onChange={() => setShowAdditionalInfo(false)}
                className="form-radio text-blue-600 dark:text-blue-400"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">No</span>
            </label>
          </div>
        </div>

        {showAdditionalInfo && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Información Adicional</h3>
            {/* Aquí puedes agregar los campos de información adicional */}
            <p>Contenido de información adicional...</p>
          </div>
        )}

        <div className="bg-orange-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Resumen</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="discountCost" className="block text-gray-700 mb-2">Descuento:</label>
              <input
                id="discountCost"
                type="text"
                value={formatNumber(invoice.discountCost)}
                readOnly
                className="border border-gray-300 p-2 w-full rounded-lg bg-white"
              />
            </div>
            <div>
              <label htmlFor="tcea" className="block text-gray-700 mb-2">TCEA:</label>
              <input
                id="tcea"
                type="text"
                value={`${invoice.tcea.toFixed(2)}%`}
                readOnly
                className="border border-gray-300 p-2 w-full rounded-lg bg-white"
              />
            </div>
            <button
              type="button"
              onClick={handleUploadInvoice}
              className="bg-blue-500 text-white p-2 w-full rounded-lg hover:bg-blue-600 transition"
            >
              Subir Factura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
