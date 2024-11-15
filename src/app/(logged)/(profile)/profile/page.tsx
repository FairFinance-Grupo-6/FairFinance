import { redirect } from "next/dist/server/api-utils";
import { createClient } from "../../../../utils/supabase/server";

export default async function profilePage() {
	const {
		data: { user },
	} = await createClient().auth.getUser();
	if (!user) {
		return null;
	}
	console.log(user);
	const { data: profile, error: profileError } = await createClient()
		.from("profiles")
		.select()
		.eq("user_id", user.id)
		.single();
	console.log(profile);
	if (profileError) {
		console.error(profileError);
		return null;
	}
	if (profile.length === 0) {
		return (
			<div className="container mx-auto p-4">
				<h1 className="text-3xl font-bold mb-4">
					Parece que no tienes un perfil
				</h1>
				<p className="text-gray-700">
					Para poder acceder a esta página, necesitas tener un perfil.
				</p>
				<p className="text-gray-700">
					Por favor, contacta con el soporte técnico para más información.
				</p>
			</div>
		);
	}
	return (
		<>
			<div className="container mx-auto p-4">
				<h1 className="text-3xl font-bold mb-4">Profile</h1>
				<div className="bg-white shadow-md rounded-lg p-6 mb-4">
					<h2 className="text-xl font-semibold mb-2">User Information</h2>
					<p className="text-gray-700">
						<span className="font-bold">Email:</span> {user.email}
					</p>
					<p className="text-gray-700">
						<span className="font-bold">Full Name:</span> {profile.first_name}{" "}
						{profile.last_name}
					</p>
				</div>
				<div className="bg-white shadow-md rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-2">Account Details</h2>
					<p className="text-gray-700">
						<span className="font-bold">DNI:</span> {profile.dni}
					</p>
					<p className="text-gray-700">
						<span className="font-bold">Phone:</span> {profile.phone}
					</p>

					<p className="text-gray-700">
						<span className="font-bold">Joined:</span>{" "}
						{new Date(user.created_at).toLocaleDateString()}
					</p>
				</div>
			</div>
		</>
	);
}
