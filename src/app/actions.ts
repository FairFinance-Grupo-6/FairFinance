"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Factura } from "./hooks/useFactura";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function signUpAction(formData: FormData): Promise<any> {
	const supabase = await createClient();
	const origin = (await headers()).get("origin");

	const email = formData.get("email")?.toString();
	const password = formData.get("password")?.toString();
	const firstName = formData.get("firstName")?.toString();
	const lastName = formData.get("lastName")?.toString();
	const dni = formData.get("dni")?.toString();
	const phone = formData.get("phone")?.toString();
	const address = formData.get("address")?.toString();
	const ruc = formData.get("ruc")?.toString();
	const currency = formData.get("currency")?.toString();

	if (!email || !password) {
		return { error: "Email and password are required" };
	}

	try {
		const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
			{
				email,
				password,
				options: {
					emailRedirectTo: `${origin}/auth/callback`,
				},
			},
		);

		if (signUpError) throw new Error(signUpError.message);

		const user_id = signUpData?.user?.id;
		if (!user_id) {
			throw new Error("User ID not found after sign up");
		}

		const { data: profileData, error: profileError } = await supabase
			.from("profiles")
			.insert([
				{
					user_id: user_id,
					first_name: firstName,
					last_name: lastName,
					dni: dni,
					phone: phone,
					address: address,
					ruc: ruc,
					currency: currency,
				},
			]);

		if (profileError) throw new Error(profileError.message);

		return encodedRedirect(
			"success",
			"/sign-up",
			"Thanks for signing up! Please check your email for a verification link.",
		);

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		return encodedRedirect("error", "/sign-up", error.message);
	}
}

export async function saveInvoice(factura: any): Promise<any> {
	console.log("formData", factura);
	const supabase = await createClient();
	const facturaData = factura;
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		const user_id = user?.id || "unknown";
		console.log("user", user);

		const invoice_to_save = {
			idFactura: facturaData.id,
			fechaEmision: facturaData.fechaEmision,
			fechaVencimiento: facturaData.fechaVencimiento,
			plazoDescuento: Number.parseInt(facturaData.plazoDescuento || "0"),
			importeNominal: facturaData.importeNominal,
			moneda: facturaData.moneda,
			tipoTasa: facturaData.tipoTasa,
			tiempoTasa: facturaData.tiempoTasa,
			capitalizacion: facturaData.capitalizacion,
			valorTasa: Number.parseInt(facturaData.valorTasa || "0"),
			costosAdicionales: facturaData.costosAdicionales.reduce(
				(acc: number, costo: any) => {
					return acc + Number.parseFloat(costo.monto);
				},
				0,
			),
			costosMora: facturaData.costosMora.reduce((acc: number, costo: any) => {
				return acc + Number.parseFloat(costo.monto);
			}, 0),
			portes: Number.parseInt(facturaData.portes || "0"),
			retencion: Number.parseInt(facturaData.retencion || "0"),
			tipoTasaMora: facturaData.tipoTasaMora,
			tiempoTasaMora: facturaData.tiempoTasaMora,
			capitalizacionMora: facturaData.capitalizacionMora,
			valorTasaMora: facturaData.valorTasaMora,
			diasMora: Number.parseInt(facturaData.diasMora || "0"),
			conMora: facturaData.conMora,
			tcea: facturaData.tcea,
			descuento: facturaData.descuento,
			user_id: user_id,
		};

		console.log("invoice_to_save", invoice_to_save);
		await supabase.from("documents").insert([invoice_to_save]);
	} catch (err) {
		console.error("Error inesperado:", err);
	}
}

export const signInAction = async (formData: FormData) => {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return encodedRedirect("error", "/sign-in", error.message);
	}

	return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
	const email = formData.get("email")?.toString();
	const supabase = await createClient();
	const origin = (await headers()).get("origin");
	const callbackUrl = formData.get("callbackUrl")?.toString();

	if (!email) {
		return encodedRedirect("error", "/forgot-password", "Email is required");
	}

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
	});

	if (error) {
		return encodedRedirect(
			"error",
			"/forgot-password",
			"Could not reset password",
		);
	}

	if (callbackUrl) {
		return redirect(callbackUrl);
	}

	return encodedRedirect(
		"success",
		"/forgot-password",
		"Check your email for a link to reset your password.",
	);
};

export const resetPasswordAction = async (formData: FormData) => {
	const supabase = await createClient();

	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirmPassword") as string;

	if (!password || !confirmPassword) {
		encodedRedirect(
			"error",
			"/reset-password",
			"Password and confirm password are required",
		);
	}

	if (password !== confirmPassword) {
		encodedRedirect("error", "/reset-password", "Passwords do not match");
	}

	const { error } = await supabase.auth.updateUser({
		password: password,
	});

	if (error) {
		encodedRedirect("error", "/reset-password", "Password update failed");
	}

	encodedRedirect("success", "/reset-password", "Password updated");
};

export const signOutAction = async () => {
	const supabase = await createClient();
	await supabase.auth.signOut();
	return redirect("/sign-in");
};
