"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { signOutAction } from "@/app/actions";

export function DropMyAccount({ user }: { user: User }) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div className="relative z-50">
			<Button
				variant="outline"
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
			>
				{user.email?.split("@")[0]}
			</Button>

			{isDropdownOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
					<Button variant="outline" className="w-full text-left">
						<Link href="/profile">Mi perfil</Link>
					</Button>
					<Button variant="outline" className="w-full text-left">
						<Link href="/reset-password">Cambiar contraseña</Link>
					</Button>
					<form action={signOutAction}>
						<Button
							type="submit"
							variant="outline"
							className="w-full text-left"
						>
							Sign out
						</Button>
					</form>
				</div>
			)}
		</div>
	);
}
