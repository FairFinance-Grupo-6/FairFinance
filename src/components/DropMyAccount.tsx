"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

export function DropMyAccount({ user, signOutAction }: { user: User, signOutAction: any }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    return (
        < div className="relative" >
            <Button variant={"outline"} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {user.email?.split("@")[0]}
            </Button>
            {
                isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                        <Link href={"/reset-password"}>
                            <Button variant={"outline"} className="w-full text-left">
                                Reset password
                            </Button>
                        </Link>
                        <form action={signOutAction}>
                            <Button type="submit" variant={"outline"} className="w-full text-left">
                                Sign out
                            </Button>
                        </form>
                    </div>
                )
            }
        </div >
    )
}