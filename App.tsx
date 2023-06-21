import React, { useEffect } from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';

import { updateProfile, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';

import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { config } from './theme';
import Navigation from './components/Navigation/index';

import { SSRProvider } from '@react-aria/ssr';
import { useFonts } from 'expo-font';

const theme = extendTheme(config);

type MyThemeType = typeof theme;
declare module 'native-base' { interface ICustomTheme extends MyThemeType {} };

export default function App() {
	const [fontsLoaded] = useFonts({
		'Jua-Regular': require('./assets/fonts/Jua-Regular.ttf'),
	});

	async function getImg() {
		const response = await fetch('https://loremflickr.com/json/320/240');
		const jsonData = await response.json();
		return jsonData.file;
	}

	useEffect(() => {
		signInAnonymously(auth)
			.then(getImg)
			.then(res => {
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
			.catch(error => {
				console.log(error);
			});
	}, []);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<SSRProvider>
			<NativeBaseProvider theme={theme}>
				<Navigation />
			</NativeBaseProvider>
		</SSRProvider>
	);
}
