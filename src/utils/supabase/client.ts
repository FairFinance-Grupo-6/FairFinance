import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
	process.env.NEXT_PUBLIC_SUPABASE_URL ||
	(() => {
		throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
	})();
const supabaseKey =
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
	(() => {
		throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
	})();

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
