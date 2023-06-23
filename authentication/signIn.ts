import { updateProfile, signInAnonymously } from "firebase/auth";
import { auth } from '../firebase/firebase';
import { uniqueNamesGenerator, adjectives, animals } from "unique-names-generator";

const getImg = async (): Promise<string> => {
	const response = await fetch('https://loremflickr.com/json/320/240');
	const jsonData = await response.json();
	return jsonData.file;
};

const signIn = async (): Promise<void> => {
	try {
		const userCredential = await signInAnonymously(auth);
		const user = userCredential.user;

		if (user) {
			const res: string = await getImg();
			await updateProfile(user, {
				displayName: uniqueNamesGenerator({
					dictionaries: [adjectives, animals],
					length: 2,
				}),
				photoURL: res,
			});
		}
	} catch (error: any) {
		console.log(error);
	}
};

export default signIn;
