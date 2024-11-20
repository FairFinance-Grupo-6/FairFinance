import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
	try {
		let response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		});

		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL as string,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
			{
				cookies: {
					getAll() {
						return request.cookies.getAll();
					},
					setAll(cookiesToSet) {
						for (const { name, value } of cookiesToSet) {
							request.cookies.set(name, value);
						}
						response = NextResponse.next({
							request,
						});
						for (const { name, value, options } of cookiesToSet) {
							response.cookies.set(name, value, options);
						}
					},
				},
			},
		);

		const {
			data: { user },
		} = await supabase.auth.getUser();

		const needLoggedIn = ["dashboard", "profile", "reset-password"];

		if (user === null && needLoggedIn.includes(request.nextUrl.pathname)) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}

		return response;
	} catch (e) {
		return NextResponse.next({
			request: {
				headers: request.headers,
			},
		});
	}
};
