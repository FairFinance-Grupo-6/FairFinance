"use client";
import { supabase } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useState } from "react";

export default function NavbarOptions() {
    const [user, setUser] = useState<{ user: User | null } | null>(null);

    supabase.auth.getUser().then(({ data, error }) => {
        setUser({ user: data.user });
    });

    return (
        <>
            <Link
                href={"/"}
                className="hover:text-[#5756BB] transition duration-200 ease-in-out"
            >
                Fair Finance
            </Link>
            {user?.user && (
                <>
                    <Link
                        href={"/dashboard"}
                        className="hover:text-[#5756BB] transition duration-200 ease-in-out"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href={"/dashboard/facturas"}
                        className="hover:text-[#5756BB] transition duration-200 ease-in-out"
                    >
                        Facturas
                    </Link>
                    <Link
                        href={"/dashboard/cartera"}
                        className="hover:text-[#5756BB] transition duration-200 ease-in-out"
                    >
                        Cartera
                    </Link>
                </>
            )}
        </>
    );
}