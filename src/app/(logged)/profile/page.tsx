import { createClient } from "../../../utils/supabase/server";

export default async function profilePage() {
    const {
        data: { user },
    } = await createClient().auth.getUser();

    return (
        <>
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold">Profile</h1>
                <div>
                    <h2 className="text-lg font-bold">User Information</h2>
                    <p>{user.email}</p>
                </div>
            </div>
        </>
    );
}