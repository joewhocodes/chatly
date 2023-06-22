import { updateProfile, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from '../../firebase/firebase';
import { useEffect } from "react";
import { uniqueNamesGenerator, adjectives, animals } from "unique-names-generator";

const singIn = (): void => {
	async function getImg(): Promise<string> {
		const response = await fetch('https://loremflickr.com/json/320/240');
		const jsonData = await response.json();
		return jsonData.file;
	}

	useEffect(() => {
		signInAnonymously(auth)
			.then(getImg)
			.then((res: string) => {
				onAuthStateChanged(auth, user => {
					if (user) {
						updateProfile(user, {
							displayName: uniqueNamesGenerator({
								dictionaries: [adjectives, animals],
								length: 2,
							}),
							photoURL: res,
						});
					}
				});
			})
			.catch((error: Error) => {
				console.log(error);
			});
	}, []);
};

export default singIn;
