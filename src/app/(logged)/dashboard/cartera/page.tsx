"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useTheme } from "next-themes";
import Image from "next/image";
import cat6 from "@/public/cat6.png";

export default function BriefcasesPage() {
	const { theme, setTheme, systemTheme } = useTheme();
	const [user, setUser] = useState<any>(null);
	const [invoices, setInvoices] = useState<any[]>([]);

	const [filteredInvoices, setFilteredInvoices] = useState<any>([]);
	const [filters, setFilters] = useState({
		fechaEmision: "",
		fechaVencimiento: "",
	});

	const calculateAverages = () => {
		const totalFacturas = filteredInvoices.length;

		const promedioDescuento =
			filteredInvoices.reduce(
				(sum: any, invoice: any) => sum + invoice.descuento,
				0,
			) / totalFacturas;

		const promedioTCEA =
			filteredInvoices.reduce(
				(sum: any, invoice: any) => sum + invoice.tcea,
				0,
			) / totalFacturas;

		return {
			promedioDescuento: promedioDescuento.toFixed(2),
			promedioTCEA: promedioTCEA.toFixed(2),
		};
	};

	const applyFilters = useCallback(() => {
		const { fechaEmision, fechaVencimiento } = filters;
		const filtered = invoices.filter((invoice) => {
			return (
				(fechaEmision ? invoice.fechaEmision === fechaEmision : true) &&
				(fechaVencimiento
					? invoice.fechaVencimiento === fechaVencimiento
					: true)
			);
		});
		setFilteredInvoices(filtered);
	}, [filters, invoices]);

	useEffect(() => {
		supabase.auth.getUser().then(({ data }) => {
			setUser({
				email: data.user?.email || "",
				name: data.user?.email?.split("@")[0] || "",
			});
			supabase
				.from("documents")
				.select("*")
				.eq("user_id", data.user?.id)
				.then(({ data, error }) => {
					if (error) {
						console.error(error);
					} else {
						setInvoices(data);
						setFilteredInvoices(data);
					}
				});
		});
	}, []);

	const currentTheme = theme === "system" ? systemTheme : theme;

	if (!user) {
		return <div>Loading...</div>;
	}

	const { promedioDescuento, promedioTCEA } = calculateAverages();

	function clearFilters() {
		setFilters({
			fechaEmision: "",
			fechaVencimiento: "",
		});
		setFilteredInvoices(invoices);
	}

	return (
		<main
			className={`w-full max-w-3xl mx-auto p-4 space-y-6 ${
				currentTheme === "dark"
					? "bg-gray-900 text-white"
					: "bg-white text-black"
			}`}
		>
			<div className="space-y-4">
				<h1 className="text-2xl font-semibold">
					Hola, {user.name}! Esta es la cartera
				</h1>

				<div className="flex flex-col space-y-4 bg-purple-100 dark:bg-purple-800 p-4 rounded-lg shadow-lg relative">
					<h2 className="text-lg font-bold">Promedios</h2>
					<p>Promedio de Descuento: {promedioDescuento}</p>
					<p>Promedio de TCEA: {promedioTCEA}%</p>
					<Image
						src="/cat6.png"
						alt="Cats"
						width={120}
						height={120}
						className="absolute top-2 right-4 transform z-10"
					/>
				</div>

				<div className="bg-purple-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg center">
					<h2 className="text-lg font-bold">Filtros</h2>
					<div className="grid grid-cols-3 gap-4 mt-4 justify-center items-center">
						<div>
							<label
								className="block text-sm font-medium"
								htmlFor="fechaEmision"
							>
								Fecha de Emisión
							</label>
							<input
								id="fechaEmision"
								type="date"
								className="w-full p-2 border rounded-lg"
								value={filters.fechaEmision}
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										fechaEmision: e.target.value,
									}))
								}
							/>
						</div>
						<div>
							<label
								className="block text-sm font-medium"
								htmlFor="fechaVencimiento"
							>
								Fecha de Vencimiento
							</label>
							<input
								type="date"
								className="w-full p-2 border rounded-lg"
								value={filters.fechaVencimiento}
								onChange={(e) =>
									setFilters((prev) => ({
										...prev,
										fechaVencimiento: e.target.value,
									}))
								}
							/>
						</div>
					</div>
					<button
						type="button"
						className="mt-4 w-full bg-[#5756BB] hover:bg-[#8182DA] hover:scale-105 transition-all duration-300 py-3 rounded-md text-white p-2 rounded-lg"
						onClick={applyFilters}
					>
						Aplicar Filtros
					</button>

					<button
						type="button"
						className="mt-4 w-full bg-[#5756BB] hover:bg-[#8182DA] hover:scale-105 transition-all duration-300 py-3 rounded-md text-white p-2 rounded-lg"
						onClick={clearFilters}
					>
						Limpiar Filtros
					</button>
				</div>

				<div className="space-y-2">
					<h2 className="text-lg font-bold">Facturas Filtradas</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredInvoices.map((invoice: any) => (
							<div
								key={invoice.id}
								className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md"
							>
								<p>
									<strong>ID:</strong> {invoice.id}
								</p>
								<p>
									<strong>Fecha de Emisión:</strong> {invoice.fechaEmision}
								</p>
								<p>
									<strong>Fecha de Vencimiento:</strong>{" "}
									{invoice.fechaVencimiento}
								</p>
								<p>
									<strong>TCEA:</strong> {invoice.tcea}%
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
