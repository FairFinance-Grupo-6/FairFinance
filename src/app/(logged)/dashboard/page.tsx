"use client";

import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client";
import { useFactura } from "@/app/hooks/useFactura";

const mockUser = {
	email: "usuario@example.com",
	name: "Usuario Ejemplo",
};

export default function Dashboard() {
	const { theme, setTheme, systemTheme } = useTheme();
	const [user, setUser] = useState<typeof mockUser | null>(null);
	const [invoices, setInvoices] = useState<any[]>([]); // Estado para almacenar las facturas

	useEffect(() => {
		const checkUser = () => {
			supabase.auth.getUser().then(({ data }) => {
				mockUser.email = data.user?.email || "";
				mockUser.name = data.user?.email?.split("@")[0] || "";
				setUser(mockUser);
				supabase
					.from("documents")
					.select("*")
					.eq("user_id", data.user?.id)
					.then(({ data, error }) => {
						if (error) {
							console.error(error);
						} else {
							console.log(data);
							setInvoices(data);
						}
					});
			});
		};
		checkUser();
	}, []);

	const currentTheme = theme === "system" ? systemTheme : theme;

	const colorStyles = {
		light: {
			text: "text-[#31294C]",
			buttonBg: "bg-[#5756BB]",
			buttonHover:
				"hover:bg-[#8182DA] hover:scale-105 transition-all duration-300",
			border: "border-[#000000]",
			mutedText: "text-[#8182DA]",
		},
		dark: {
			text: "text-[#E1B1E8]",
			buttonBg: "bg-[#5756BB]",
			buttonHover:
				"hover:bg-[#8182DA] hover:scale-105 transition-all duration-300",
			border: "border-[#31294C]",
			mutedText: "text-[#D3A3DA]",
		},
	};

	const styles = currentTheme === "dark" ? colorStyles.dark : colorStyles.light;

	// Ordenar las facturas por fecha de emisión (más recientes primero) y seleccionar las 4 primeras
	const sortedInvoices = invoices
		.sort(
			(a, b) =>
				new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime(),
		)
		.slice(0, 4);

	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4">
				<h1 className="text-2xl font-semibold">Cargando...</h1>
				<p className="text-gray-500">Por favor, espere un momento</p>
			</div>
		);
	}

	return (
		<main className={"w-full mx-auto space-y-6 text-black pt-20"}>
			<div className="flex items-center justify-between space-x-4">
				<div>
					<h1 className="text-2xl font-semibold text-black dark:text-white">
						Bienvenido a tu Dashboard, {user.name}
					</h1>
					<span className={`${styles.mutedText} font-normal`}>
						Estas son tus facturas registradas
					</span>
				</div>

				<div className="flex flex-col items-center justify-center">
					<Image
						src="/cat1.png"
						alt="Imagen de saludo"
						width={110}
						height={110}
					/>

					<button
						type="button"
						className={`flex items-center justify-between ${styles.buttonBg} p-3 pl-4 pr-20 text-white rounded ${styles.buttonHover}`}
					>
						<Clock className="mr-2 h-4 w-4" />
						<Link href="/dashboard/facturas">
							<p className="w-36">Ver Todas</p>
						</Link>
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{sortedInvoices.map((invoice) => (
					<div
						key={invoice.id}
						className="bg-white/30 backdrop-blur-lg rounded-lg p-6 space-y-4 shadow-lg dark:bg-grey dark:bg-opacity-30"
					>
						{/* Fondo blurry y bordes redondeados */}
						<div>
							<div className="text-sm text-gray-500 dark:text-white">
								Factura: {invoice.idFactura}
							</div>
							<div className="text-sm text-gray-500 dark:text-white">
								Fecha de emisión: {invoice.fechaEmision}
							</div>
							<div className="text-xl font-semibold">
								{invoice.moneda} {invoice.importeNominal}
							</div>
							<div className="text-xl font-semibold">
								TCEA: {Number.parseFloat(invoice.tcea).toFixed(2)}%
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="space-y-2">
				<div className="flex justify-left gap-4">
					{" "}
					{/* Esto coloca los botones centrados con espacio entre ellos */}
					<Button
						className={`w-auto ${styles.buttonBg} text-white ${styles.buttonHover}`}
					>
						<Link href="/dashboard/facturas/nueva">Agregar Factura</Link>
					</Button>
					<Button
						className={`w-auto ${styles.buttonBg} text-white ${styles.buttonHover}`}
					>
						<Link href="/dashboard/cartera">Calcular TCEA de Carteras</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
