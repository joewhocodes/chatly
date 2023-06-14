import React, { useEffect } from 'react';
import {
	Text,
	HStack,
	Switch,
	useColorMode,
	NativeBaseProvider,
	extendTheme,
} from 'native-base';
import Navigation from './components/Navigation/index';
import {
	updateProfile,
	signInAnonymously,
	onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase/firebase';
import {
	uniqueNamesGenerator,
	adjectives,
	animals,
} from 'unique-names-generator';

// Define the config
const config = {
	useSystemColorMode: false,
	initialColorMode: 'dark',
};

// extend the theme
export const theme = extendTheme({ config });
type MyThemeType = typeof theme;
declare module 'native-base' {
	interface ICustomTheme extends MyThemeType {}
}

export default function App() {
	useEffect(() => {
		signInAnonymously(auth)
			.then(() => {
				console.log('user created');
				onAuthStateChanged(auth, user => {
					if (user) {
						updateProfile(user, {
							displayName: uniqueNamesGenerator({
								dictionaries: [adjectives, animals],
								length: 2,
							}),
							photoURL:
								'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x',
						});
					}
				});
			})
			.catch(error => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// ...
			});
	}, []);

	return (
		<NativeBaseProvider>
			<Navigation />
		</NativeBaseProvider>
	);
}

// Color Switch Component
function ToggleDarkMode() {
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<HStack space={2} alignItems='center'>
			<Text>Dark</Text>
			<Switch
				isChecked={colorMode === 'light'}
				onToggle={toggleColorMode}
				aria-label={
					colorMode === 'light'
						? 'switch to dark mode'
						: 'switch to light mode'
				}
			/>
			<Text>Light</Text>
		</HStack>
	);
}
