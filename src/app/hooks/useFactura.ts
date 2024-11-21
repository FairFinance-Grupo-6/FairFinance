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
		fechaEmision: null,
		fechaVencimiento: null,
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

	const isValidFactura = (): boolean => {
		return (
			factura.importeNominal.trim() !== "" &&
			factura.fechaEmision !== null &&
			factura.fechaVencimiento !== null &&
			factura.portes.trim() !== "" &&
			factura.retencion.trim() !== "" &&
			factura.valorTasa.trim() !== "" &&
			(!factura.conMora ||
				(factura.valorTasaMora.trim() !== "" && factura.diasMora.trim() !== ""))
		);
	};

	const handleCalculateTcea = () => {
		if (!isValidFactura()) {
			toast.error("Por favor, complete todos los campos obligatorios.", {
				position: "top-right",
			});
			return;
		}

		try {
			const diasDescuento = factura.plazoDescuento;

			if (diasDescuento === null) {
				toast.error(
					"Proporciona el plazo de descuento o las fechas de emisión y vencimiento.",
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

			let tceaValue: number;

			if (factura.conMora) {
				tceaValue = calcularTceaConMora(
					Number(factura.importeNominal),
					desc,
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
						monto: Number(c.monto) || 0,
					})),
					diasDescuento,
					Number(factura.valorTasa),
					factura.tipoTasa,
					Number(factura.portes),
					factura.capitalizacion,
					factura.tiempoTasa,
					Number(factura.diasMora),
					Number(factura.valorTasaMora),
					factura.tipoTasaMora,
					factura.tiempoTasaMora,
					factura.capitalizacionMora
				);
			} else {
				tceaValue = calcularTcea(
					Number(factura.importeNominal),
					desc,
					Number(factura.retencion),
					factura.costosAdicionales.map((c) => ({
						descripcion: c.descripcion,
						monto: c.esPorcentaje
							? Number(c.monto) * (Number(factura.importeNominal) / 100)
							: Number(c.monto),
						pagadoAlInicio: c.pagadoAlInicio,
					})),
					Number(factura.portes),
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
		index?: number,
		section?: "costosAdicionales" | "costosMora"
	) => {
		const { name, value, type } = e.target;
		const checked = (e.target as HTMLInputElement).checked;

		if (section) {
			const updatedCosts = [...factura[section]];

			if (index !== undefined) {
				const currentCost = updatedCosts[index];

				if (section === "costosAdicionales" && isCosto(currentCost)) {
					if (name === `esPorcentaje${index}` || name === `pagadoAlInicio${index}`) {
						currentCost[name.includes("esPorcentaje") ? "esPorcentaje" : "pagadoAlInicio"] = checked;
					} else if (name === "descripcion" || name === "monto") {
						currentCost[name] = value;
					}
				}

				if (section === "costosMora" && isCostoMora(currentCost)) {
					if (name === "descripcion" || name === "monto") {
						currentCost[name] = value;
					}
				}
			}

			setFactura((prev) => ({ ...prev, [section]: updatedCosts }));
			return;
		}

		setFactura((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value.trim(),
		}));


		setIsTceaCalculated(false);
		setTcea(null);
		setDescuento(null);
	};


	const isCosto = (obj: any): obj is Costo => {
		return obj && "esPorcentaje" in obj && "pagadoAlInicio" in obj;
	};

	const isCostoMora = (obj: any): obj is CostoMora => {
		return obj && !("esPorcentaje" in obj) && !("pagadoAlInicio" in obj);
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
		handleInputChange,
		handleCalculateTcea,
		addCosto: () => {
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
		},
		removeCosto: (index: number) => {
			const costosAdicionales = [...factura.costosAdicionales];
			costosAdicionales.splice(index, 1);
			setFactura((prev) => ({ ...prev, costosAdicionales }));
		},
		addCostoMora: () => {
			setFactura((prev) => ({
				...prev,
				costosMora: [
					...prev.costosMora,
					{ id: Date.now(), descripcion: "", monto: "" },
				],
			}));
		},
		removeCostoMora: (index: number) => {
			const costosMora = [...factura.costosMora];
			costosMora.splice(index, 1);
			setFactura((prev) => ({ ...prev, costosMora }));
		},
	};
};
