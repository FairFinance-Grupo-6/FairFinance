import {
    calcularTcea,
    calcularDescuento,
    calcularDiasDescuento,
    calcularTceaConMora,
} from "@/utils/calculations";

import { useState } from "react";

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
    plazoDescuento: string | null;
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
}

export const useFactura = (onSave: (factura: Factura) => void) => {
    const [factura, setFactura] = useState({
        id: 0,
        fechaEmision: "",
        fechaVencimiento: "",
        plazoDescuento: "",
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
        tcea: 0,
    });

    const [tcea, setTcea] = useState<number | null>(null);
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
        index: number,
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
            const diasDescuento = factura.plazoDescuento
                ? Number(factura.plazoDescuento)
                : factura.fechaEmision && factura.fechaVencimiento
                    ? calcularDiasDescuento(
                        factura.fechaEmision,
                        factura.fechaVencimiento,
                    )
                    : 0;

            const descuento = calcularDescuento(
                Number(factura.importeNominal),
                diasDescuento,
                factura.tipoTasa,
                factura.tiempoTasa,
                factura.tipoTasa === "Nominal" ? factura.capitalizacion : undefined,
                Number(factura.valorTasa),
            );

            var tceaValue;

            if (factura.conMora) {
                tceaValue = calcularTceaConMora(
                    Number(factura.importeNominal),
                    descuento,
                    Number(factura.retencion),
                    factura.costosAdicionales.map((c) => ({
                        descripcion: c.descripcion,
                        monto: c.esPorcentaje
                        ? Number(c.monto) * (Number(factura.importeNominal) / 100)
                        : Number(c.monto),
                        pagadoAlInicio: c.pagadoAlInicio,
                    })),
                    factura.costosMora.map((c) => ({
                        descripcion: c.descripcion,
                        monto: Number(c.monto),
                    })),
                    Number(diasDescuento),
                    Number(factura.valorTasa),
                    factura.tipoTasa,
                    Number(factura.portes),
                    factura.capitalizacion,
                    factura.tiempoTasa,
                    Number(factura.diasMora),
                    Number(factura.valorTasaMora),
                    factura.tipoTasaMora,
                    factura.tiempoTasaMora,
                    factura.capitalizacionMora,
                );
            } else {
                tceaValue = calcularTcea(
                    Number(factura.importeNominal),
                    descuento,
                    Number(factura.retencion),
                    factura.costosAdicionales.map((c) => ({
                        descripcion: c.descripcion,
                        monto: c.esPorcentaje
                        ? Number(c.monto) * (Number(factura.importeNominal) / 100)
                        : Number(c.monto),
                        pagadoAlInicio: c.pagadoAlInicio,
                    })),
                    Number(factura.portes),
                    Number(diasDescuento),
                );
            }

            setTcea(tceaValue);
            setIsTceaCalculated(true);
        } catch (error) {
            console.error("Error al calcular el TCEA:", error);
            alert("Por favor, completa todos los campos correctamente.");
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        index?: number,
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
                [name]: value,
                fechaEmision: "",
                fechaVencimiento: "",
            }));
        } else if (name === "fechaEmision" || name === "fechaVencimiento") {
            setFactura((prev) => ({
                ...prev,
                [name]: value,
                plazoDescuento: "",
            }));
        } else {
            setFactura((prev) => ({ ...prev, [name]: value }));
        }

        setIsTceaCalculated(false);
        setTcea(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isTceaCalculated) {
            alert("Por favor, calcula el TCEA antes de guardar.");
            return;
        }
        onSave({ ...factura, tcea });
    };
    
    return {
        factura,
        tcea,
        isTceaCalculated,
        handleInputChangeMora,
        handleInputChange,
        handleCalculateTcea,
        addCosto,
        removeCosto,
        addCostoMora,
        removeCostoMora,
        handleSubmit,
    };
};


