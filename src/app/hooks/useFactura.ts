import {
    calcularTcea,
    calcularDescuento,
    calcularDiasDescuento,
    calcularTceaConMora,
  } from "@/utils/calculations";
  import { useState, useEffect } from "react";
  import { toast, ToastPosition } from "react-toastify";
  
  export interface Costo {
    id: number;
    descripcion: string;
    monto: string;
    esPorcentaje: boolean;
    pagadoAlInicio: boolean;
  }
  
  export interface CostoMora {
    id: number;
    descripcion: string;
    monto: string;
  }
  
  export interface Factura {
    id: number;
    moneda: string;
    importeNominal: string;
    fechaEmision: string | null;
    fechaVencimiento: string | null;
    plazoDescuento: number | null;
    portes: string;
    retencion: string;
    costosAdicionales: Costo[];
    tipoTasa: string;
    tiempoTasa: string;
    capitalizacion: string;
    capitalizacionMora: string;
    valorTasa: string;
    conMora: boolean;
    tipoTasaMora: string;
    tiempoTasaMora: string;
    valorTasaMora: string;
    diasMora: string;
    costosMora: CostoMora[];
    tcea: number | null;
    descuento: number | null;
    receptor: string;
  }
  
  export const useFactura = () => {
    const [factura, setFactura] = useState<Factura>({
      id: 0,
      fechaEmision: "",
      fechaVencimiento: "",
      plazoDescuento: null,
      importeNominal: "",
      moneda: "PEN",
      tipoTasa: "Efectiva",
      tiempoTasa: "Anual",
      capitalizacion: "Anual",
      valorTasa: "",
      costosAdicionales: [
        {
          id: Date.now(),
          descripcion: "",
          monto: "",
          esPorcentaje: false,
          pagadoAlInicio: false,
        },
      ],
      costosMora: [{ id: Date.now(), descripcion: "", monto: "" }],
      portes: "",
      retencion: "",
      tipoTasaMora: "Efectiva",
      tiempoTasaMora: "Anual",
      capitalizacionMora: "Anual",
      valorTasaMora: "",
      diasMora: "",
      conMora: false,
      tcea: null,
      descuento: null,
      receptor: "",
    });
  
    const [tcea, setTcea] = useState<number | null>(null);
    const [descuento, setDescuento] = useState<number | null>(null);
    const [isTceaCalculated, setIsTceaCalculated] = useState(false);
  
    const addCosto = () => {
      setFactura((prev) => ({
        ...prev,
        costosAdicionales: [
          ...prev.costosAdicionales,
          {
            id: Date.now(),
            descripcion: "",
            monto: "",
            esPorcentaje: false,
            pagadoAlInicio: false,
          },
        ],
      }));
    };
  
    const removeCosto = (index: number) => {
      const costosAdicionales = [...factura.costosAdicionales];
      costosAdicionales.splice(index, 1);
      setFactura((prev) => ({ ...prev, costosAdicionales }));
    };
  
    const handleInputChangeMora = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      const { name, value } = e.target;
      const costosMora = [...factura.costosMora];
      if (name === "descripcion") {
        costosMora[index].descripcion = value;
      } else if (name === "monto") {
        costosMora[index].monto = value;
      }
      setFactura((prev) => ({ ...prev, costosMora }));
    };
  
    const removeCostoMora = (index: number) => {
      const costosMora = [...factura.costosMora];
      costosMora.splice(index, 1);
      setFactura((prev) => ({ ...prev, costosMora }));
    };
  
    const addCostoMora = () => {
      setFactura((prev) => ({
        ...prev,
        costosMora: [
          ...prev.costosMora,
          {
            id: Date.now(),
            descripcion: "",
            monto: "",
          },
        ],
      }));
    };
  
    const handleCalculateTcea = () => {
      try {
        const diasDescuento = factura.plazoDescuento;
  
        if (diasDescuento === null) {
          toast.error(
            "Por favor, proporciona el plazo de descuento o las fechas de emisión y vencimiento.",
            { position: "top-right" }
          );
          return;
        }
  
        const desc = calcularDescuento(
          Number(factura.importeNominal),
          diasDescuento,
          factura.tipoTasa,
          factura.tiempoTasa,
          factura.tipoTasa === "Nominal" ? factura.capitalizacion : undefined,
          Number(factura.valorTasa)
        );
  
        let tceaValue;
  
        if (factura.conMora) {
          tceaValue = calcularTceaConMora(
            Number(factura.importeNominal),
            desc,
            Number(factura.retencion) || 0,
            factura.costosAdicionales.map((c) => ({
              descripcion: c.descripcion,
              monto: c.esPorcentaje
                ? Number(c.monto) * (Number(factura.importeNominal) / 100)
                : Number(c.monto),
              pagadoAlInicio: c.pagadoAlInicio,
            })),
            factura.costosMora.map((c) => ({
              descripcion: c.descripcion,
              monto: Number(c.monto) || 0,
            })),
            diasDescuento,
            Number(factura.valorTasa) || 0,
            factura.tipoTasa,
            Number(factura.portes) || 0,
            factura.capitalizacion,
            factura.tiempoTasa,
            Number(factura.diasMora) || 0,
            Number(factura.valorTasaMora) || 0,
            factura.tipoTasaMora,
            factura.tiempoTasaMora,
            factura.capitalizacionMora
          );
        } else {
          tceaValue = calcularTcea(
            Number(factura.importeNominal),
            desc,
            Number(factura.retencion) || 0,
            factura.costosAdicionales.map((c) => ({
              descripcion: c.descripcion,
              monto: c.esPorcentaje
                ? Number(c.monto) * (Number(factura.importeNominal) / 100)
                : Number(c.monto),
              pagadoAlInicio: c.pagadoAlInicio,
            })),
            Number(factura.portes) || 0,
            diasDescuento
          );
        }
  
        setTcea(tceaValue);
        setDescuento(desc);
  
        setIsTceaCalculated(true);
      } catch (error) {
        console.error("Error al calcular el TCEA:", error);
        toast.error("Por favor, completa todos los campos correctamente.", {
          position: "top-right",
        });
      }
    };
  
    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      index?: number
    ) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
  
      if (type === "checkbox" && name === "conMora") {
        setFactura((prev) => ({ ...prev, [name]: checked }));
        return;
      }
  
      if (
        name.startsWith("costoDescripcion") ||
        name.startsWith("costoMonto") ||
        name.startsWith("costoPagadoAlInicio") ||
        name.startsWith("costoPorcentaje")
      ) {
        const costosAdicionales = [...factura.costosAdicionales];
        if (index !== undefined) {
          if (name.includes("Descripcion")) {
            costosAdicionales[index].descripcion = value;
          } else if (name.includes("Monto")) {
            costosAdicionales[index].monto = value;
          } else if (name.includes("PagadoAlInicio")) {
            costosAdicionales[index].pagadoAlInicio = checked;
          } else if (name.includes("Porcentaje")) {
            costosAdicionales[index].esPorcentaje = checked;
          }
        }
        setFactura((prev) => ({ ...prev, costosAdicionales }));
        return;
      }
  
      if (name === "plazoDescuento") {
        setFactura((prev) => ({
          ...prev,
          plazoDescuento: value ? Number(value) : null,
          fechaEmision: "",
          fechaVencimiento: "",
        }));
      } else if (name === "fechaEmision" || name === "fechaVencimiento") {
        setFactura((prev) => ({
          ...prev,
          [name]: value,
          plazoDescuento: null,
        }));
      } else {
        setFactura((prev) => ({ ...prev, [name]: value }));
      }
  
      setIsTceaCalculated(false);
      setTcea(null);
      setDescuento(null);
    };
  
    useEffect(() => {
      if (factura.fechaEmision && factura.fechaVencimiento) {
        try {
          const diasDescuento = calcularDiasDescuento(
            factura.fechaEmision,
            factura.fechaVencimiento
          );
          setFactura((prev) => ({
            ...prev,
            plazoDescuento: diasDescuento,
          }));
        } catch (error: any) {
          console.error("Error al calcular el plazo de descuento:", error);
          toast.error(error.message, { position: "top-right" });
          setFactura((prev) => ({
            ...prev,
            plazoDescuento: null,
          }));
        }
      }
    }, [factura.fechaEmision, factura.fechaVencimiento]);
  
    return {
      factura,
      tcea,
      descuento,
      isTceaCalculated,
      handleInputChangeMora,
      handleInputChange,
      handleCalculateTcea,
      addCosto,
      removeCosto,
      addCostoMora,
      removeCostoMora,
    };
  };
  