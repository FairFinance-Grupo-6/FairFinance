import { EnvVarWarning } from "@/components/env-var-warning";
import AuthButton from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Suspense } from "react";
import AuthButtonSkeleton from "@/components/skeletons/AuthButtonSkeleton";
import ToastProvider from "@/components/ToastProvider";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "FairFinance",
  description: "The app for managing your finances.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ToastProvider />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen h-screen flex flex-col items-center">
            <nav className="fixed top-0 left-0 w-full flex justify-center border-b border-b-foreground/10 h-16 bg-white dark:bg-background z-50">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                  <Link
                    href={"/"}
                    className="hover:text-[#5756BB] transition duration-200 ease-in-out"
                  >
                    Fair Finance
                  </Link>
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
                </div>
                <div className="flex gap-5 items-center">
                  <Suspense fallback={<AuthButtonSkeleton />}>
                    {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
                  </Suspense>
                  <ThemeSwitcher />
                </div>
              </div>
            </nav>
            <div className="flex flex-1 w-full min-h-full  max-w-5xl mt-16 p-5">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
