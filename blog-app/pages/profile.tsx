import "@/configureAmplify";
import "@aws-amplify/ui-react/styles.css";

import { Authenticator } from "@aws-amplify/ui-react";

function Profile() {
	return (
		<Authenticator>
			{({ user, signOut }) => (
				<div>
					<h1 className="text-3xl font-semibold tracking-wide mt-6">Profile</h1>
					<h2 className="font-medium text-gray-500 my-2">Username: {user!.username}</h2>
					<p className="text-sm text-gray-500 mb-6">Email: {user!.attributes!.email}</p>
					<button onClick={signOut} className="rounded-lg bg-cyan-500 text-white px-4 py-2 font-semibold">
						Sign out
					</button>
				</div>
			)}
		</Authenticator>
	);
}

export default Profile;
